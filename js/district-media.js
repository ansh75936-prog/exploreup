/* ExploreUP: verified official Uttar Pradesh Tourism video sources only. */
(function () {
  "use strict";
  const loaded = new Set();
  const sources = [
    {
      matches: ["mathura", "vrindavan", "gokul", "barsana", "govardhan"],
      title: "Mathura–Vrindavan through Lens",
      description: "Official Uttar Pradesh Tourism destination page with a city-specific video player and verified destination information.",
      url: "https://www.upstdc.co.in/website/Mathura_Tourism.aspx",
      sourceLabel: "Official UP Tourism · Mathura–Vrindavan"
    },
    {
      matches: ["prayagraj", "allahabad"],
      title: "Prayagraj Catamaran Boat",
      description: "The official UP Tourism gallery lists Prayagraj catamaran boat video content. Open the source to watch the original.",
      url: "https://upstdc.co.in/website/gallery.aspx",
      sourceLabel: "Official UP Tourism · Prayagraj"
    },
    {
      matches: ["lucknow"],
      title: "Lucknow Tourism Event",
      description: "The official UP Tourism gallery includes World Tourism Day celebration and Tourism Conclave content from Lucknow.",
      url: "https://upstdc.co.in/website/gallery.aspx",
      sourceLabel: "Official UP Tourism · Lucknow"
    },
    {
      matches: ["jhansi"],
      title: "Jhansi Tourism & Culture",
      description: "The official UP Tourism gallery lists World Tourism Day and local food festival coverage from Jhansi.",
      url: "https://upstdc.co.in/website/gallery.aspx",
      sourceLabel: "Official UP Tourism · Jhansi"
    }
  ];
  const generalUrl = "https://www.upstdc.co.in/website/gallery.aspx";
  function clean(value) { return String(value || "").replace(/\s+/g, " ").trim(); }
  function byId(id) { return document.getElementById(id); }
  function node(tag, cls, content) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content !== undefined) el.textContent = content;
    return el;
  }
  function makeLink(url, label) {
    const a = node("a", "district-video-source", label);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  function render(city, source) {
    const container = byId("districtMediaContent");
    const section = byId("districtMediaSection");
    if (!container || !section) return;
    container.replaceChildren();
    const card = node("article", "district-official-video-card");
    const badge = node("span", "district-video-badge", "✓ OFFICIAL TOURISM SOURCE");
    const title = node("h3", "", source ? source.title : "No verified official video found yet");
    const description = node("p", "", source
      ? source.description
      : "We have not verified a city-specific video for " + city + " on the official UP Tourism pages yet. ExploreUP will not substitute a random or unrelated clip.");
    const sourceName = node("p", "district-official-source-name", source ? source.sourceLabel : "Source: Uttar Pradesh State Tourism Development Corporation");
    const actions = node("div", "district-official-video-actions");
    if (source) actions.appendChild(makeLink(source.url, "Watch on official UP Tourism ↗"));
    else actions.appendChild(makeLink(generalUrl, "Check official tourism gallery ↗"));
    card.append(badge, title, description, sourceName, actions);
    container.appendChild(card);
    section.dataset.loaded = "true";
    section.dataset.city = city;
  }
  function matchSource(city) {
    const normalized = clean(city).toLowerCase();
    return sources.find(item => item.matches.some(term => normalized === term || normalized.includes(term))) || null;
  }
  function loadForCity(city) {
    const title = byId("districtMediaTitle");
    const intro = byId("districtMediaIntro");
    const section = byId("districtMediaSection");
    const modalTitle = byId("modalTitle");
    if (!section || !byId("districtMediaContent") || !city) return;
    const current = clean(modalTitle && modalTitle.textContent);
    if (current && current.toLowerCase() !== city.toLowerCase()) return;
    if (section.dataset.city === city && section.dataset.loaded === "true") return;
    if (title) title.textContent = "🎬 Official videos — " + city;
    if (intro) intro.textContent = "Only city-matched videos/pages from Uttar Pradesh Tourism are shown here. No random clips or unverified video search results.";
    render(city, matchSource(city));
    loaded.add(city);
  }
  function init() {
    const title = byId("modalTitle");
    const modal = byId("modal");
    if (!title || !modal || typeof MutationObserver === "undefined") return;
    function maybeLoad() {
      if (modal.getAttribute("aria-hidden") === "true" || modal.style.display === "none") return;
      const city = clean(title.textContent);
      if (!city || city.toLowerCase() === "city") return;
      loadForCity(city);
    }
    new MutationObserver(maybeLoad).observe(title, { childList: true, subtree: true, characterData: true });
    new MutationObserver(maybeLoad).observe(modal, { attributes: true, attributeFilter: ["style", "aria-hidden"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();