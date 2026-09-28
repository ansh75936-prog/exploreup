/* ExploreUP: real, playable, city-matched video files from Wikimedia Commons.
   Strictly filters video files by district name; never substitutes unrelated clips. */
(function () {
  "use strict";
  const COMMONS = "https://commons.wikimedia.org/w/api.php";
  const officialGallery = "https://upstdc.co.in/website/gallery.aspx";
  const aliases = {
    "varanasi": ["varanasi", "banaras", "kashi"],
    "prayagraj": ["prayagraj", "allahabad"],
    "ayodhya": ["ayodhya", "faizabad"],
    "agra": ["agra", "taj mahal"],
    "mathura": ["mathura", "vrindavan", "gokul", "barsana", "govardhan"],
    "lucknow": ["lucknow"],
    "kanpur nagar": ["kanpur"],
    "siddharthnagar": ["siddharthnagar", "siddharth nagar"],
    "amroha": ["amroha", "jyotiba phule nagar"],
    "maharajganj": ["maharajganj", "maharaj ganj"],
    "rae bareli": ["rae bareli", "raebareli"],
    "lakhimpur kheri": ["lakhimpur kheri", "kheri"]
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
    { value: "hd", label: "HD (720p+)" },
    { value: "fullhd", label: "Full HD (1080p+)" },
    { value: "4k", label: "4K (2160p+)" }
  ];
  const clean = v => String(v || "").replace(/\s+/g, " ").trim();
  const byId = id => document.getElementById(id);
  let requestVersion = 0;
  function node(tag, cls, value) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined) el.textContent = value;
    return el;
  }
  function link(url, label) {
    const a = node("a", "district-video-source", label);
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    return a;
  }
  function options(select, data) {
    data.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.value; opt.textContent = item.label; select.appendChild(opt);
    });
  }
  function cityNames(city) {
    const low = city.toLowerCase();
    const found = Object.entries(aliases).find(([key, vals]) =>
      low.includes(key) || vals.some(v => low === v || low.includes(v))
    );
    return found ? [...new Set([city.toLowerCase(), ...found[1]])] : [city.toLowerCase()];
  }
  function matchesCity(title, names) {
    const t = title.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
    return names.some(name => t.includes(name));
  }
  function languageTerms(value) {
    return ({hi:["hindi","hi "],en:["english","en "],ur:["urdu"],bho:["bhojpuri"]})[value] || [];
  }
  function qualityMin(value) {
    return value === "hd" ? 720 : value === "fullhd" ? 1080 : value === "4k" ? 2160 : 0;
  }
  async function findVideos(city, language, quality) {
    const names = cityNames(city);
    const query = '"' + names[0] + '" filemime:video';
    const url = COMMONS + "?action=query&generator=search&gsrsearch=" + encodeURIComponent(query) +
      "&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url%7Cmime%7Csize%7Cextmetadata&format=json&origin=*";
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Commons API returned " + response.status);
    const data = await response.json();
    const pages = Object.values((data.query && data.query.pages) || {});
    const minHeight = qualityMin(quality);
    const langTerms = languageTerms(language);
    return pages.map(page => {
      const info = page.imageinfo && page.imageinfo[0];
      return info ? { page, info } : null;
    }).filter(item => {
      if (!item || !item.info.url || !item.info.mime || !item.info.mime.startsWith("video/")) return false;
      if (!matchesCity(item.page.title.replace(/^File:/i, ""), names)) return false;
      if (minHeight && Number(item.info.height || 0) < minHeight) return false;
      if (langTerms.length) {
        const metadata = item.page.title + " " + JSON.stringify(item.info.extmetadata || {});
        if (!langTerms.some(term => metadata.toLowerCase().includes(term))) return false;
      }
      return /\.(mp4|webm|ogv|ogg)(?:$|\?)/i.test(item.info.url);
    }).sort((a,b) => Number(b.info.height || 0) - Number(a.info.height || 0));
  }
  function metaText(meta, key) {
    const value = meta && meta[key] && meta[key].value;
    return clean(String(value || "").replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&#039;/g, "'"));
  }
  function renderVideo(container, item) {
    const card = node("article", "district-playable-video-card");
    const frame = node("div", "district-playable-video-frame");
    const video = document.createElement("video");
    video.className = "district-playable-video";
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("controlsList", "nodownload");
    video.setAttribute("aria-label", "Video about " + item.page.title.replace(/^File:/i, ""));
    const source = document.createElement("source");
    source.src = item.info.url;
    source.type = item.info.mime;
    video.appendChild(source);
    video.appendChild(node("p", "", "Your browser cannot play this file. Open the original source instead."));
    frame.appendChild(video);
    const info = node("div", "district-playable-video-info");
    const badge = node("span", "district-video-badge", "✓ CITY-MATCHED VIDEO FILE");
    const title = node("h3", "", item.page.title.replace(/^File:/i, "").replace(/_/g, " "));
    const height = Number(item.info.height || 0);
    const quality = height >= 2160 ? "4K" : height >= 1080 ? "Full HD" : height >= 720 ? "HD" : "Standard resolution";
    const details = node("p", "", quality + " · " + (item.info.mime || "Video") + (item.info.size ? " · " + Math.round(item.info.size / 1048576) + " MB" : ""));
    const description = metaText(item.info.extmetadata, "ImageDescription");
    const creator = metaText(item.info.extmetadata, "Artist");
    const license = metaText(item.info.extmetadata, "LicenseShortName");
    const caption = node("p", "district-video-caption", description || "Description was not supplied by the file uploader. Check the original file page for context.");
    const attribution = node("p", "district-video-attribution", [creator ? "Creator: " + creator : "", license ? "License: " + license : ""].filter(Boolean).join(" · "));
    info.append(badge, title, details, caption);
    if (attribution.textContent) info.appendChild(attribution);
    info.appendChild(link(item.info.descriptionurl || item.info.url, "View original video, author & licence ↗"));
    card.append(frame, info);
    container.appendChild(card);
  }
  function init() {
    const title = byId("districtMediaTitle"), modalTitle = byId("modalTitle");
    const modal = byId("modal"), section = byId("districtMediaSection"), content = byId("districtMediaContent");
    if (!title || !modalTitle || !modal || !section || !content) return;
    const intro = byId("districtMediaIntro");
    if (intro) intro.textContent = "Searches real video files whose file title matches this district. Tap play to watch on ExploreUP; if no relevant video is available, no unrelated clip will be substituted.";
    content.replaceChildren();
    const settings = node("div", "district-video-settings");
    const qLabel = node("label", "", "Video quality");
    const qSelect = node("select", "district-video-select"); qSelect.id = "districtVideoQuality";
    qSelect.setAttribute("aria-label", "Minimum video quality"); options(qSelect, qualities); qLabel.htmlFor = qSelect.id;
    const lLabel = node("label", "", "Language");
    const lSelect = node("select", "district-video-select"); lSelect.id = "districtVideoLanguage";
    lSelect.setAttribute("aria-label", "Video language"); options(lSelect, languages); lLabel.htmlFor = lSelect.id;
    const qWrap = node("div", "district-video-setting"), lWrap = node("div", "district-video-setting");
    qWrap.append(qLabel,qSelect); lWrap.append(lLabel,lSelect); settings.append(qWrap,lWrap);
    const results = node("div", "district-video-results");
    content.append(settings, results);
    const status = node("div", "district-media-status", "Open a district to find playable video files.");
    results.appendChild(status);
    let lastKey = "";
    async function refresh() {
      const city = clean(modalTitle.textContent);
      if (!city || city.toLowerCase() === "city") return;
      title.textContent = "🎬 Videos — " + city;
      const key = city + "|" + qSelect.value + "|" + lSelect.value;
      if (key === lastKey) return;
      lastKey = key;
      const version = ++requestVersion;
      results.replaceChildren(node("div", "district-media-status", "Finding real video files for " + city + "…"));
      try {
        const videos = await findVideos(city, lSelect.value, qSelect.value);
        if (version !== requestVersion) return;
        results.replaceChildren();
        if (!videos.length) {
          const empty = node("div", "district-video-empty");
          const icon = node("div", "district-video-empty-icon", "▶");
          const copy = node("div", "district-video-empty-copy");
          copy.append(node("h3", "", "No matching playable video found"));
          copy.append(node("p", "", "No video file matching " + city + " and these settings was found. We won't show a random clip. Try another quality/language setting or check the official tourism source."));
          copy.appendChild(link(officialGallery, "Official UP Tourism gallery ↗"));
          const searchUrl = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=video&search=" + encodeURIComponent(city + " Uttar Pradesh");
          copy.appendChild(link(searchUrl, "Check Commons video search ↗"));
          empty.append(icon, copy); results.appendChild(empty);
          return;
        }
        videos.slice(0, 6).forEach(item => renderVideo(results, item));
      } catch (error) {
        if (version !== requestVersion) return;
        results.replaceChildren();
        const empty = node("div", "district-video-empty");
        const copy = node("div", "district-video-empty-copy");
        copy.append(node("h3", "", "Video search temporarily unavailable"));
        copy.append(node("p", "", "We couldn't reach the video source just now. No substitute video was loaded."));
        copy.appendChild(link(officialGallery, "Official UP Tourism gallery ↗"));
        empty.append(copy); results.appendChild(empty);
      }
    }
    qSelect.addEventListener("change", () => { lastKey = ""; refresh(); });
    lSelect.addEventListener("change", () => { lastKey = ""; refresh(); });
    function maybeRefresh() {
      if (modal.getAttribute("aria-hidden") === "true" || modal.style.display === "none") return;
      const city = clean(modalTitle.textContent);
      if (city && city.toLowerCase() !== "city") refresh();
    }
    new MutationObserver(maybeRefresh).observe(modalTitle, { childList:true, subtree:true, characterData:true });
    new MutationObserver(maybeRefresh).observe(modal, { attributes:true, attributeFilter:["style","aria-hidden"] });
    maybeRefresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})();