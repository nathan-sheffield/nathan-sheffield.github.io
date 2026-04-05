---
layout: page
tagline: Thou ill-formed offspring of my feeble brain
subtitle: An assortment of things I've written or recorded over the years. Proceed with caution --- I give you no guarantees on quality.
permalink: /things/
---

<div id="misc-loading" style="color:#888; font-style:italic;">Loading...</div>
<div id="misc-locked" style="display:none; text-align:center; margin:3em 0; color:#888;">
  <p>This page requires a password.</p>
  <p><a href="/mystery-textbox/">Go to the Mystery Textbox</a></p>
</div>
<div id="misc-content"></div>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="/assets/js/decrypt.js"></script>
<script>
  // Allow raw HTML to pass through marked
  const renderer = new marked.Renderer();
  renderer.html = function(token) {
    return typeof token === 'string' ? token : (token.raw || token.text || '');
  };
  marked.use({ renderer: renderer });

  async function loadMisc() {
    const loadingEl = document.getElementById("misc-loading");
    const lockedEl = document.getElementById("misc-locked");
    const contentEl = document.getElementById("misc-content");

    try {
      const { unlockedEntries } = await SecretContent.unlockAll();
      const entry = unlockedEntries.find(e => e.metadata.nav_title === "Misc");

      loadingEl.style.display = "none";

      if (!entry) {
        lockedEl.style.display = "block";
        return;
      }

      const markdown = await SecretContent.decryptFile(entry.fileIndex, entry.fileKey);
      contentEl.innerHTML = '<div class="secret-body">' + marked.parse(markdown) + '</div>';

      // Execute any script tags
      contentEl.querySelectorAll("script").forEach(oldScript => {
        const newScript = document.createElement("script");
        if (oldScript.src) newScript.src = oldScript.src;
        else newScript.textContent = oldScript.textContent;
        oldScript.replaceWith(newScript);
      });

      if (window.MathJax && MathJax.Hub) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, contentEl]);
      }

    } catch (err) {
      document.getElementById("misc-loading").style.display = "none";
      document.getElementById("misc-locked").style.display = "block";
      console.error(err);
    }
  }

  loadMisc();
</script>
