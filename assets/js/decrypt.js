/**
 * Client-side decryption for secret content.
 * Uses Web Crypto API for PBKDF2 key derivation and AES-256-GCM decryption.
 */

const SecretContent = (() => {
  const STORAGE_KEY = "secret-passwords";
  const PBKDF2_ITERATIONS = 600_000;

  // --- Password normalization ---

  function normalizePassword(password) {
    return password.replace(/[^a-zA-Z]/g, "").toLowerCase();
  }

  // --- Crypto helpers ---

  function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  async function deriveKey(password, saltHex) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: hexToBytes(saltHex), iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  }

  async function decryptAesGcm(key, ivHex, ciphertextHex) {
    const iv = hexToBytes(ivHex);
    const ciphertext = hexToBytes(ciphertextHex);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(plaintext);
  }

  async function decryptWithRawKey(keyHex, ivHex, ciphertextHex) {
    const key = await crypto.subtle.importKey(
      "raw", hexToBytes(keyHex), { name: "AES-GCM" }, false, ["decrypt"]
    );
    return decryptAesGcm(key, ivHex, ciphertextHex);
  }

  // --- Persistent cache (survives tab close / browser restart) ---
  // Cache is versioned by manifest content so re-encrypting invalidates stale data.
  const CACHE_VERSION_KEY = "secret-cache-version";
  const ENVELOPE_CACHE_KEY = "secret-envelope-cache";
  const FILE_CACHE_KEY = "secret-file-cache";

  // In-memory copies so parallel callers share one object and don't clobber
  // each other's writes via read-modify-write on localStorage.
  let _envelopeCache = null;
  let _fileCache = null;

  let _cacheVersionPromise = null;
  function checkCacheVersion() {
    if (_cacheVersionPromise) return _cacheVersionPromise;
    _cacheVersionPromise = (async () => {
      try {
        const manifest = await getManifest();
        const version = manifest.numFiles + ":" + manifest.numEnvelopes + ":" + manifest.salt;
        const stored = localStorage.getItem(CACHE_VERSION_KEY);
        if (stored !== version) {
          localStorage.removeItem(ENVELOPE_CACHE_KEY);
          localStorage.removeItem(FILE_CACHE_KEY);
          _envelopeCache = {};
          _fileCache = {};
          localStorage.setItem(CACHE_VERSION_KEY, version);
        }
      } catch {}
    })();
    return _cacheVersionPromise;
  }

  function getEnvelopeCache() {
    if (_envelopeCache === null) {
      try { _envelopeCache = JSON.parse(localStorage.getItem(ENVELOPE_CACHE_KEY)) || {}; }
      catch { _envelopeCache = {}; }
    }
    return _envelopeCache;
  }

  function setEnvelopeCache(cache) {
    _envelopeCache = cache;
    try { localStorage.setItem(ENVELOPE_CACHE_KEY, JSON.stringify(cache)); } catch {}
  }

  function getFileCache() {
    if (_fileCache === null) {
      try { _fileCache = JSON.parse(localStorage.getItem(FILE_CACHE_KEY)) || {}; }
      catch { _fileCache = {}; }
    }
    return _fileCache;
  }

  function setFileCache(cache) {
    _fileCache = cache;
    try { localStorage.setItem(FILE_CACHE_KEY, JSON.stringify(cache)); } catch {}
  }

  function clearSessionCache() {
    _envelopeCache = {};
    _fileCache = {};
    localStorage.removeItem(ENVELOPE_CACHE_KEY);
    localStorage.removeItem(FILE_CACHE_KEY);
  }

  // --- Password storage ---

  function getStoredPasswords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function storePassword(password) {
    const passwords = getStoredPasswords();
    if (!passwords.includes(password)) {
      passwords.push(password);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
    }
  }

  function removePassword(password) {
    const passwords = getStoredPasswords().filter(p => p !== password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
  }

  function clearPasswords() {
    localStorage.removeItem(STORAGE_KEY);
    clearSessionCache();
  }

  // --- Core decryption logic ---

  let _manifest = null;
  async function getManifest() {
    if (_manifest) return _manifest;
    const resp = await fetch("/encrypted/manifest.json");
    if (!resp.ok) throw new Error("Could not load encrypted manifest");
    _manifest = await resp.json();
    return _manifest;
  }

  /**
   * Try a password against all envelopes. Derives the key once (using the
   * global salt from the manifest) then tries fast AES-GCM decryption against
   * each envelope. Returns an array of
   * {envelopeIndex, entries: [{fileIndex, fileKey, metadata}]} for each
   * envelope that the password successfully decrypts.
   */
  async function tryPassword(password) {
    await checkCacheVersion();
    const cache = getEnvelopeCache();
    if (cache.hasOwnProperty(password)) {
      return cache[password];
    }

    const manifest = await getManifest();

    // One PBKDF2 derivation using the global salt
    const key = await deriveKey(password, manifest.salt);

    // Try all envelopes in parallel (AES-GCM is near-instant)
    const attempts = [];
    for (let i = 0; i < manifest.numEnvelopes; i++) {
      attempts.push((async () => {
        try {
          const resp = await fetch(`/encrypted/envelopes/${i}.env`);
          if (!resp.ok) return null;
          const envelope = await resp.json();
          const decrypted = await decryptAesGcm(key, envelope.iv, envelope.ciphertext);
          return { envelopeIndex: i, entries: JSON.parse(decrypted) };
        } catch {
          return null;
        }
      })());
    }

    const results = (await Promise.all(attempts)).filter(r => r !== null);

    // Cache results (including empty — avoids re-deriving for known-bad passwords)
    cache[password] = results;
    setEnvelopeCache(cache);

    return results;
  }

  /**
   * Decrypt a specific file given its index and key.
   */
  async function decryptFile(fileIndex, fileKeyHex) {
    const cacheKey = `${fileIndex}:${fileKeyHex.slice(0, 16)}`;
    const fileCache = getFileCache();
    if (fileCache[cacheKey]) return fileCache[cacheKey];

    const resp = await fetch(`/encrypted/files/${fileIndex}.enc`);
    if (!resp.ok) throw new Error(`Could not load encrypted file ${fileIndex}`);
    const encrypted = await resp.json();
    const content = await decryptWithRawKey(fileKeyHex, encrypted.iv, encrypted.ciphertext);

    fileCache[cacheKey] = content;
    setFileCache(fileCache);
    return content;
  }

  /**
   * Try all stored passwords and return all unlocked content.
   * Returns: { unlockedEntries: [{fileIndex, fileKey, metadata}], passwords: string[] }
   */
  async function unlockAll() {
    const passwords = getStoredPasswords();

    // Try all passwords in parallel
    const allResults = await Promise.all(passwords.map(p => tryPassword(p).then(r => ({ password: p, results: r }))));

    const allEntries = [];
    const validPasswords = [];

    for (const { password, results } of allResults) {
      if (results.length > 0) {
        validPasswords.push(password);
        for (const r of results) {
          for (const entry of r.entries) {
            if (!allEntries.find(e => e.fileIndex === entry.fileIndex)) {
              allEntries.push(entry);
            }
          }
        }
      }
    }

    return { unlockedEntries: allEntries, passwords: validPasswords };
  }

  /**
   * Submit a password: try it, store if valid, return unlocked entries.
   */
  async function submitPassword(password) {
    password = normalizePassword(password);
    const results = await tryPassword(password);
    if (results.length === 0) {
      return { success: false, entries: [] };
    }
    storePassword(password);
    const entries = results.flatMap(r => r.entries);
    return { success: true, entries };
  }

  /**
   * Refresh secret nav links in the header (call after a new password is added).
   */
  async function refreshNav() {
    const { unlockedEntries } = await unlockAll();
    if (!unlockedEntries.length) return;

    const trigger = document.querySelector(".site-nav .trigger");
    if (!trigger) return;

    // Remove any previously-added secret nav links
    trigger.querySelectorAll(".secret-nav-link").forEach(el => el.remove());

    // Add group links (using groupHash for URLs, real name only from decrypted metadata)
    const groups = {};
    unlockedEntries.forEach(e => {
      if (e.metadata.groupHash && !groups[e.metadata.groupHash]) {
        groups[e.metadata.groupHash] = {
          name: e.metadata.group,
          navOrder: e.metadata.nav_order || 999,
          navAfter: e.metadata.nav_after || "",
        };
      }
    });
    const findStaticLink = (text) => {
      const links = trigger.querySelectorAll("a.page-link:not(.secret-nav-link)");
      for (const l of links) if (l.textContent.trim() === text) return l;
      return null;
    };
    const makeLogoImg = () => {
      const img = document.createElement("img");
      img.src = "/assets/logos/phi-logo.svg";
      img.style.width = "auto";
      img.style.height = "20px";
      return img;
    };
    const setLinkLabel = (link, text, active) => {
      if (active) {
        link.style.fontWeight = "bold";
        link.append(" ", makeLogoImg(), " " + text + " ", makeLogoImg(), " ");
      } else {
        link.textContent = text;
      }
    };
    Object.entries(groups).sort((a, b) => a[1].navOrder - b[1].navOrder).forEach(([hash, info]) => {
      const link = document.createElement("a");
      link.className = "page-link secret-nav-link";
      link.href = "/g/#" + hash;
      const active = window.location.pathname === "/g/" && window.location.hash === "#" + hash;
      setLinkLabel(link, info.name, active);
      link.style.color = "#bb86fc";
      const anchor = info.navAfter ? findStaticLink(info.navAfter) : null;
      if (anchor) anchor.after(link);
      else trigger.appendChild(link);
    });

    // Add standalone page links
    unlockedEntries.filter(e => e.metadata.type === "page" && e.metadata.nav_title && !e.metadata.group)
      .sort((a, b) => (a.metadata.nav_order || 999) - (b.metadata.nav_order || 999))
      .forEach(entry => {
        const link = document.createElement("a");
        link.className = "page-link secret-nav-link";
        link.href = entry.metadata.permalink || ("/secret/#file=" + entry.fileIndex + "&key=" + entry.fileKey);
        const active = entry.metadata.permalink && window.location.pathname === entry.metadata.permalink;
        setLinkLabel(link, entry.metadata.nav_title, active);
        link.style.color = "#bb86fc";
        trigger.appendChild(link);
      });
  }

  /**
   * Returns a marked extension that renders kramdown-style footnotes
   * ([^id] references and [^id]: definitions). The public Jekyll site gets
   * these from kramdown; client-rendered secret content needs this since
   * stock marked has no footnote support.
   */
  function footnoteExtension() {
    let defs = {};
    let order = [];
    return {
      hooks: {
        preprocess(md) { defs = {}; order = []; return md; },
        postprocess(html) {
          if (!order.length) return html;
          let out = html + '<hr class="footnotes-sep"><section class="footnotes"><ol>';
          order.forEach(id => {
            const inner = marked.parseInline(defs[id] || "");
            out += `<li id="fn-${id}" class="footnote-item">${inner} <a href="#fnref-${id}" class="footnote-backref">↩</a></li>`;
          });
          return out + "</ol></section>";
        },
      },
      extensions: [
        {
          name: "footnoteDef",
          level: "block",
          start(src) { const m = /^\[\^[^\]\n]+\]:/m.exec(src); return m ? m.index : undefined; },
          tokenizer(src) {
            const m = /^\[\^([^\]\n]+)\]:[ \t]*([^\n]*)\n?/.exec(src);
            if (m) {
              defs[m[1]] = m[2].trim();
              return { type: "footnoteDef", raw: m[0] };
            }
          },
          renderer() { return ""; },
        },
        {
          name: "footnoteRef",
          level: "inline",
          start(src) { const i = src.indexOf("[^"); return i < 0 ? undefined : i; },
          tokenizer(src) {
            const m = /^\[\^([^\]\n]+)\]/.exec(src);
            if (m) return { type: "footnoteRef", raw: m[0], id: m[1] };
          },
          renderer(token) {
            if (order.indexOf(token.id) === -1) order.push(token.id);
            const n = order.indexOf(token.id) + 1;
            return `<sup class="footnote-ref" id="fnref-${token.id}"><a href="#fn-${token.id}">[${n}]</a></sup>`;
          },
        },
      ],
    };
  }

  // --- Public API ---
  return {
    getStoredPasswords,
    storePassword,
    removePassword,
    clearPasswords,
    tryPassword,
    decryptFile,
    unlockAll,
    submitPassword,
    getManifest,
    refreshNav,
    normalizePassword,
    footnoteExtension,
  };
})();
