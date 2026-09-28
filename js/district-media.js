/* ExploreUP district video finder: transparent source, language and quality controls.
   Never invent video IDs or auto-play unrelated clips. */
(function () {
  "use strict";
  const officialGallery = "https://upstdc.co.in/website/gallery.aspx";
  const cityAliases = {
    "varanasi": ["Banaras", "Kashi"],
    "prayagraj": ["Allahabad"],
    "ayodhya": ["Faizabad"],
    "agra": ["Taj Mahal"],
    "mathura": ["Vrindavan"],
    "siddharthnagar": ["Siddharth Nagar"]
  };
  const languages = [
    { value: "any", label: "Any language" },
    { value: "hi", label: "Hindi" },
    { value: "en", label: "English" },
    { value: "ur", label: "Urdu" },
    { value: "bho", label: "Bhojpuri" }
  ];
  const qualities = [
    { value: "any", label: "Any quality" },
    { value: "hd", label: "HD (720p+ preferred)" },
    { value: "fullhd", label: "Full HD (1080p+ preferred)" },
    { value: "4k", label: "4K preferred" }
  ];
  const clean = value => String(value || "").replace(/\s+/g, " ").trim();
  const byId = id => document.getElementById(id);
  function node(tag, cls, value) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (value !== undefined) n.textContent = value;
    return n;
  }
  function addOptions(select, items) {
    items.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.value;
      opt.textContent = item.label;
      select.appendChild(opt);
    });
  }
  function cityTerms(city) {
    const lower = city.toLowerCase();
    const aliases = Object.entries(cityAliases).find(([key]) => lower.includes(key));
    return aliases ? [city, ...aliases[1]] : [city];
  }
  function buildSearchUrl(city, language, quality) {
    const terms = cityTerms(city).map(t => '"' + t + '"').join(" OR ");
    const words = [];
    if (language === "hi") words.push("Hindi");
    if (language === "en") words.push("English");
    if (language === "ur") words.push("Urdu");
    if (language === "bho") words.push("Bhojpuri");
    if (quality === "hd") words.push("HD 720p");
    if (quality === "fullhd") words.push("1080p");
    if (quality === "4k") words.push("4K UHD");
    words.push("official tourism");
    const query = [terms, "Uttar Pradesh India", words.join(" ")].join(" ");
    return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
  }
  function sourceForCity(city) {
    const lower = city.toLowerCase();
    if (lower.includes("mathura") || lower.includes("vrindavan") || lower.includes("gokul") || lower.includes("barsana")) {
      return { label: "Official UP Tourism destination page · Mathura–Vrindavan", url: "https://www.upstdc.co.in/website/Mathura_Tourism.aspx" };
    }
    return { label: "Official UP Tourism gallery", url: officialGallery };
  }
  function makeLink(url, text) {
    const a = node("a", "district-video-source", text);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  function initSection() {
    const title = byId("districtMediaTitle");
    const modalTitle = byId("modalTitle");
    const modal = byId("modal");
    const section = byId("districtMediaSection");
    const content = byId("districtMediaContent");
    if (!title || !modalTitle || !modal || !section || !content) return;
    const heading = byId("districtMediaIntro");
    if (heading) heading.textContent = "Choose preferred video quality and language. Search results open on YouTube so you can confirm the actual district and creator before playing.";
    content.replaceChildren();
    const settings = node("div", "district-video-settings");
    const qualityLabel = node("label", "", "Video quality");
    const qualitySelect = node("select", "district-video-select");
    qualitySelect.id = "districtVideoQuality";
    qualitySelect.setAttribute("aria-label", "Preferred video quality");
    addOptions(qualitySelect, qualities);
    qualityLabel.htmlFor = qualitySelect.id;
    const languageLabel = node("label", "", "Language");
    const languageSelect = node("select", "district-video-select");
    languageSelect.id = "districtVideoLanguage";
    languageSelect.setAttribute("aria-label", "Preferred video language");
    addOptions(languageSelect, languages);
    languageLabel.htmlFor = languageSelect.id;
    const qWrap = node("div", "district-video-setting");
    const lWrap = node("div", "district-video-setting");
    qWrap.append(qualityLabel, qualitySelect);
    lWrap.append(languageLabel, languageSelect);
    settings.append(qWrap, lWrap);
    const card = node("article", "district-official-video-card");
    const badge = node("span", "district-video-badge", "✓ SOURCE-AWARE VIDEO SEARCH");
    const cardTitle = node("h3", "", "Find a real video for this district");
    const desc = node("p", "", "ExploreUP does not invent video links or automatically play unverified clips. Open the results, check that the video actually shows this district, and select a suitable result.");
    const warning = node("p", "district-official-source-name", "Quality is a search preference, not a guarantee; confirm the actual resolution and source on the video page.");
    const actions = node("div", "district-official-video-actions");
    const search = makeLink("#", "Find district videos ↗");
    const official = makeLink("#", "Official tourism source ↗");
    actions.append(search, official);
    card.append(badge, cardTitle, desc, warning, actions);
    content.append(settings, card);
    let activeCity = "";
    function refresh() {
      const city = clean(modalTitle.textContent);
      if (!city || city.toLowerCase() === "city") return;
      activeCity = city;
      title.textContent = "🎬 District Videos — " + city;
      search.href = buildSearchUrl(city, languageSelect.value, qualitySelect.value);
      const source = sourceForCity(city);
      official.href = source.url;
      official.textContent = source.label + " ↗";
      search.textContent = "Find " + city + " videos ↗";
      search.setAttribute("aria-label", "Search video results for " + city);
    }
    qualitySelect.addEventListener("change", refresh);
    languageSelect.addEventListener("change", refresh);
    function maybeRefresh() {
      if (modal.getAttribute("aria-hidden") === "true" || modal.style.display === "none") return;
      refresh();
    }
    new MutationObserver(maybeRefresh).observe(modalTitle, { childList: true, subtree: true, characterData: true });
    new MutationObserver(maybeRefresh).observe(modal, { attributes: true, attributeFilter: ["style", "aria-hidden"] });
    maybeRefresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initSection, { once: true });
  else initSection();
})();