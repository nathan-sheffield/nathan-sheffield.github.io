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

  // --- Session cache (survives navigation, cleared on browser close) ---
  // Cache is versioned by manifest content so re-encrypting invalidates stale data.
  const CACHE_VERSION_KEY = "secret-cache-version";
  const ENVELOPE_CACHE_KEY = "secret-envelope-cache";
  const FILE_CACHE_KEY = "secret-file-cache";

  let _cacheVersionChecked = false;
  async function checkCacheVersion() {
    if (_cacheVersionChecked) return;
    _cacheVersionChecked = true;
    try {
      const manifest = await getManifest();
      const version = manifest.numFiles + ":" + manifest.numEnvelopes;
      const stored = sessionStorage.getItem(CACHE_VERSION_KEY);
      if (stored !== version) {
        sessionStorage.removeItem(ENVELOPE_CACHE_KEY);
        sessionStorage.removeItem(FILE_CACHE_KEY);
        sessionStorage.setItem(CACHE_VERSION_KEY, version);
      }
    } catch {}
  }

  function getEnvelopeCache() {
    try { return JSON.parse(sessionStorage.getItem(ENVELOPE_CACHE_KEY)) || {}; } catch { return {}; }
  }

  function setEnvelopeCache(cache) {
    sessionStorage.setItem(ENVELOPE_CACHE_KEY, JSON.stringify(cache));
  }

  function getFileCache() {
    try { return JSON.parse(sessionStorage.getItem(FILE_CACHE_KEY)) || {}; } catch { return {}; }
  }

  function setFileCache(cache) {
    sessionStorage.setItem(FILE_CACHE_KEY, JSON.stringify(cache));
  }

  function clearSessionCache() {
    sessionStorage.removeItem(ENVELOPE_CACHE_KEY);
    sessionStorage.removeItem(FILE_CACHE_KEY);
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
   * Try a password against all envelopes. Returns an array of
   * {envelopeIndex, entries: [{fileIndex, fileKey, metadata}]} for each
   * envelope that the password successfully decrypts.
   */
  async function tryPassword(password) {
    await checkCacheVersion();
    // Check session cache first
    const cache = getEnvelopeCache();
    if (cache[password]) {
      return cache[password];
    }

    const manifest = await getManifest();
    const results = [];

    for (let i = 0; i < manifest.numEnvelopes; i++) {
      try {
        const resp = await fetch(`/encrypted/envelopes/${i}.env`);
        if (!resp.ok) continue;
        const envelope = await resp.json();

        const key = await deriveKey(password, envelope.salt);
        const decrypted = await decryptAesGcm(key, envelope.iv, envelope.ciphertext);
        const entries = JSON.parse(decrypted);

        results.push({ envelopeIndex: i, entries });
      } catch {
        // Wrong password for this envelope — expected, continue
      }
    }

    // Cache results (even empty — avoids re-deriving for known-bad passwords)
    if (results.length > 0) {
      cache[password] = results;
      setEnvelopeCache(cache);
    }

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
    const allEntries = [];
    const validPasswords = [];

    for (const password of passwords) {
      const results = await tryPassword(password);
      if (results.length > 0) {
        validPasswords.push(password);
        for (const r of results) {
          for (const entry of r.entries) {
            // Deduplicate by fileIndex
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
        };
      }
    });
    Object.entries(groups).sort((a, b) => a[1].navOrder - b[1].navOrder).forEach(([hash, info]) => {
      const link = document.createElement("a");
      link.className = "page-link secret-nav-link";
      link.href = "/g/#" + hash;
      link.textContent = info.name.charAt(0).toUpperCase() + info.name.slice(1);
      link.style.color = "#bb86fc";
      if (window.location.pathname === "/g/" && window.location.hash === "#" + hash) link.style.fontWeight = "bold";
      trigger.appendChild(link);
    });

    // Add standalone page links
    unlockedEntries.filter(e => e.metadata.type === "page" && e.metadata.nav_title && !e.metadata.group)
      .sort((a, b) => (a.metadata.nav_order || 999) - (b.metadata.nav_order || 999))
      .forEach(entry => {
        const link = document.createElement("a");
        link.className = "page-link secret-nav-link";
        link.href = entry.metadata.permalink || ("/secret/#file=" + entry.fileIndex + "&key=" + entry.fileKey);
        link.textContent = entry.metadata.nav_title;
        link.style.color = "#bb86fc";
        if (entry.metadata.permalink && window.location.pathname === entry.metadata.permalink) link.style.fontWeight = "bold";
        trigger.appendChild(link);
      });
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
  };
})();
