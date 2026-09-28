/* ExploreUP verified-video policy.
   Do not auto-play search results: only manually verified city-specific videos may be embedded.
   The existing Varanasi hero video in index.html is intentionally preserved. */
(function () {
  "use strict";
  const GALLERY = "https://upstdc.co.in/website/gallery.aspx";
  const COMMONS = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=video&search=";
  const clean = v => String(v || "").replace(/\s+/g, " ").trim();
  const byId = id => document.getElementById(id);
  function node(tag, cls, value) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined) el.textContent = value;
    return el;
  }
  function makeLink(url, label) {
    const a = node("a", "district-video-source", label);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  function render(city) {
    const title = byId("districtMediaTitle");
    const intro = byId("districtMediaIntro");
    const content = byId("districtMediaContent");
    const section = byId("districtMediaSection");
    if (!title || !content || !section || !city) return;
    title.textContent = "🎬 Verified videos — " + city;
    if (intro) intro.textContent = "Only videos confirmed to show this district should be embedded here. Unverified search results are not played automatically.";
    content.replaceChildren();
    const card = node("article", "district-official-video-card");
    const badge = node("span", "district-video-badge", "✓ NO UNVERIFIED CLIPS");
    const heading = node("h3", "", "No verified video added for " + city + " yet");
    const body = node("p", "", "We removed automatic video results because file titles and search matches can be misleading. To keep ExploreUP accurate, this section will show an in-site player only after the video’s location and source are checked.");
    const sourceNote = node("p", "district-official-source-name", "The existing Varanasi hero video is preserved. Other districts will not show random or unrelated clips.");
    const actions = node("div", "district-official-video-actions");
    const official = makeLink(GALLERY, "Official UP Tourism gallery ↗");
    const commons = makeLink(COMMONS + encodeURIComponent(city + " Uttar Pradesh"), "Browse video sources ↗");
    actions.append(official, commons);
    card.append(badge, heading, body, sourceNote, actions);
    content.appendChild(card);
    section.dataset.loaded = "true";
    section.dataset.city = city;
  }
  function init() {
    const title = byId("modalTitle"), modal = byId("modal");
    if (!title || !modal) return;
    let lastCity = "";
    function refresh() {
      if (modal.getAttribute("aria-hidden") === "true" || modal.style.display === "none") return;
      const city = clean(title.textContent);
      if (!city || city.toLowerCase() === "city" || city === lastCity) return;
      lastCity = city;
      render(city);
    }
    new MutationObserver(refresh).observe(title, { childList: true, subtree: true, characterData: true });
    new MutationObserver(refresh).observe(modal, { attributes: true, attributeFilter: ["style", "aria-hidden"] });
    const back = document.querySelector(".modal-back");
    if (back) back.addEventListener("click", function () { lastCity = ""; });
    refresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();