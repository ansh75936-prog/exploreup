/* ExploreUP district media: high-resolution Wikimedia Commons video previews. */
(function () {
  "use strict";
  const cache = new Map();
  const pending = new Map();
  let lastCity = "";

  function text(value) { return String(value || "").replace(/\s+/g, " ").trim(); }
  function el(id) { return document.getElementById(id); }
  function commonsSearchUrl(city) {
    return "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=video&search=" + encodeURIComponent(city + " Uttar Pradesh");
  }
  function quality(info) {
    const w = Number(info.width || 0), h = Number(info.height || 0);
    return Math.max(w, h);
  }
  function isVideo(info) {
    return !!info && (
      String(info.mediatype || "").toUpperCase() === "VIDEO" ||
      String(info.mime || "").toLowerCase().startsWith("video/")
    ) && /^https:\/\/upload\.wikimedia\.org\//i.test(info.url || "");
  }
  function score(page, info, city) {
    const title = text(page.title).toLowerCase();
    const needle = city.toLowerCase();
    let value = 0;
    if (title.includes(needle)) value += 12;
    if (title.includes("tourism") || title.includes("tourist") || title.includes("city") || title.includes("temple") || title.includes("fort") || title.includes("ghat") || title.includes("monument")) value += 4;
    if (quality(info) >= 1920) value += 5;
    else if (quality(info) >= 1280) value += 4;
    else if (quality(info) >= 720) value += 2;
    const bytes = Number(info.size || 0);
    if (bytes > 0 && bytes < 180 * 1024 * 1024) value += 1;
    return value;
  }

  async function searchVideos(city) {
    if (cache.has(city)) return cache.get(city);
    if (pending.has(city)) return pending.get(city);
    const task = (async function () {
      const queries = [
        'filetype:video "' + city + '"',
        "filetype:video " + city + " Uttar Pradesh",
        "filetype:video " + city + " India"
      ];
      let all = [];
      for (const query of queries) {
        try {
          const params = new URLSearchParams({
            action: "query", format: "json", origin: "*",
            generator: "search", gsrsearch: query,
            gsrnamespace: "6", gsrlimit: "12",
            prop: "imageinfo", iiprop: "url|size|mime|mediatype|extmetadata",
            iiurlwidth: "1280"
          });
          const response = await fetch("https://commons.wikimedia.org/w/api.php?" + params.toString(), {
            headers: { Accept: "application/json" }
          });
          if (!response.ok) continue;
          const data = await response.json();
          const pages = Object.values(data.query && data.query.pages || {});
          for (const page of pages) {
            const info = page.imageinfo && page.imageinfo[0];
            if (!info || !isVideo(info)) continue;
            const dimensions = quality(info);
            if (dimensions < 720) continue; // Never display a low-resolution result as an HD video.
            const fileUrl = info.descriptionurl || ("https://commons.wikimedia.org/wiki/" + encodeURIComponent(page.title).replace(/%3A/g, ":").replace(/%20/g, "_"));
            const candidate = {
              title: text(page.title).replace(/^File:/i, "").replace(/\.[^.]+$/, "").replace(/[_]+/g, " "),
              url: info.url,
              pageUrl: fileUrl,
              poster: info.thumburl || info.thumburl || "",
              width: Number(info.width || 0),
              height: Number(info.height || 0),
              mime: info.mime || "",
              score: score(page, info, city),
              bytes: Number(info.size || 0),
              city
            };
            if (!all.some(item => item.url === candidate.url)) all.push(candidate);
          }
          if (all.some(item => item.score >= 16 && Math.max(item.width, item.height) >= 1080)) break;
        } catch (error) {
          console.warn("ExploreUP Commons video search failed:", error);
        }
      }
      all.sort((a, b) => b.score - a.score || Math.max(b.width, b.height) - Math.max(a.width, a.height));
      const best = all[0] || null;
      cache.set(city, best);
      return best;
    })();
    pending.set(city, task);
    try { return await task; } finally { pending.delete(city); }
  }

  function node(tag, className, value) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (value !== undefined) item.textContent = value;
    return item;
  }

  function setStatus(container, message) {
    container.replaceChildren(node("div", "district-media-status", message));
  }

  function renderVideo(container, city, video) {
    container.replaceChildren();
    const card = node("div", "district-video-card");
    const mediaWrap = node("div", "district-video-frame");
    const player = document.createElement("video");
    player.className = "district-feature-video";
    player.controls = true;
    player.playsInline = true;
    player.preload = "metadata";
    player.setAttribute("controlslist", "nodownload noplaybackrate");
    player.setAttribute("aria-label", city + " destination video");
    if (video.poster) player.poster = video.poster;
    const source = document.createElement("source");
    source.src = video.url;
    if (video.mime) source.type = video.mime;
    player.appendChild(source);
    player.addEventListener("error", function () {
      if (card.dataset.videoError) return;
      card.dataset.videoError = "true";
      mediaWrap.replaceChildren(node("div", "district-media-status", "This video could not be played in this browser. Open the original Wikimedia file instead."));
    }, { once: true });
    mediaWrap.appendChild(player);

    const body = node("div", "district-video-info");
    const badge = node("span", "district-video-badge", "✦ HD VIDEO");
    const title = node("h3", "", video.title || (city + " — City Video"));
    const qualityLabel = video.width && video.height ? (video.width + " × " + video.height) : "High resolution";
    const description = node("p", "", "A video result from Wikimedia Commons. Video quality: " + qualityLabel + ". Tap play when you're ready; it won't autoplay or use mobile data in the background.");
    const attribution = document.createElement("a");
    attribution.href = video.pageUrl;
    attribution.target = "_blank";
    attribution.rel = "noopener noreferrer";
    attribution.textContent = "View video source & licence ↗";
    attribution.className = "district-video-source";
    body.append(badge, title, description, attribution);
    card.append(mediaWrap, body);
    container.appendChild(card);
  }

  function renderNoVideo(container, city) {
    container.replaceChildren();
    const empty = node("div", "district-video-empty");
    const icon = node("div", "district-video-empty-icon", "▶");
    const copy = node("div", "district-video-empty-copy");
    copy.append(
      node("h3", "", "No HD video found for " + city + " yet"),
      node("p", "", "We couldn't find a relevant Wikimedia Commons video at 720p or higher. The district guide and photo remain available—no unrelated or blurry clip is shown.")
    );
    const link = document.createElement("a");
    link.href = commonsSearchUrl(city);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "district-video-source";
    link.textContent = "Browse available videos ↗";
    copy.appendChild(link);
    empty.append(icon, copy);
    container.appendChild(empty);
  }

  async function loadForCity(cityName) {
    const city = text(cityName);
    const section = el("districtMediaSection");
    const container = el("districtMediaContent");
    if (!section || !container || !city || city.toLowerCase() === "city") return;
    if (city === lastCity && section.dataset.loaded === "true") return;
    lastCity = city;
    section.dataset.loaded = "false";
    section.hidden = false;
    const heading = el("districtMediaTitle");
    const intro = el("districtMediaIntro");
    if (heading) heading.textContent = "🎬 Watch " + city + " — Video Stories";
    if (intro) intro.textContent = "A carefully filtered video preview, when a suitable high-resolution file is available.";
    setStatus(container, "Searching for a relevant HD city video…");
    const video = await searchVideos(city);
    // Ignore stale requests if the user opened another district while search was running.
    const current = text(el("modalTitle") && el("modalTitle").textContent);
    if (current.toLowerCase() !== city.toLowerCase()) return;
    if (video) renderVideo(container, city, video);
    else renderNoVideo(container, city);
    section.dataset.loaded = "true";
  }

  function init() {
    const title = el("modalTitle");
    const modal = el("modal");
    if (!title || !modal || typeof MutationObserver === "undefined") return;
    let previous = "";
    const maybeLoad = function () {
      if (modal.getAttribute("aria-hidden") === "true" || modal.style.display === "none") return;
      const city = text(title.textContent);
      if (!city || city.toLowerCase() === "city" || city === previous) return;
      previous = city;
      loadForCity(city).catch(error => {
        console.warn("ExploreUP district video preview unavailable:", error);
        const content = el("districtMediaContent");
        if (content) setStatus(content, "Video preview is temporarily unavailable. Your district guide is still available.");
      });
    };
    new MutationObserver(maybeLoad).observe(title, { childList: true, subtree: true, characterData: true });
    new MutationObserver(maybeLoad).observe(modal, { attributes: true, attributeFilter: ["style", "aria-hidden"] });
    const back = document.querySelector(".modal-back");
    if (back) back.addEventListener("click", function () {
      previous = "";
      const section = el("districtMediaSection");
      if (section) section.dataset.loaded = "false";
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();