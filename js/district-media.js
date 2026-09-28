/* ExploreUP district videos.
   Curated embed: a published Uttar Pradesh travel compilation whose description lists
   Varanasi, Agra, Lucknow, Mathura/Vrindavan, Ayodhya/Faizabad, Fatehpur Sikri and Kushinagar.
   Do not use unrelated or automatically searched clips. Arya AI files are not touched. */
(function () {
  "use strict";
  const GALLERY = "https://upstdc.co.in/website/gallery.aspx";
  const COMMONS = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=video&search=";
  const VIDEO = {
    id: "5yOAVBk2r38",
    title: "Uttar Pradesh — travel highlights",
    source: "https://www.youtube.com/watch?v=5yOAVBk2r38",
    credit: "Explore with Love · published 3 April 2020",
    places: [
      "varanasi", "banaras", "kashi", "agra", "lucknow", "mathura",
      "vrindavan", "ayodhya", "faizabad", "fatehpur sikri", "kushinagar"
    ]
  };
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
  function matchesCity(city) {
    const name = city.toLowerCase();
    return VIDEO.places.some(place => {
      const escaped = place.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp("(^|[^a-z])" + escaped + "([^a-z]|$)", "i").test(name);
    });
  }
  function render(city) {
    const title = byId("districtMediaTitle");
    const intro = byId("districtMediaIntro");
    const content = byId("districtMediaContent");
    const section = byId("districtMediaSection");
    if (!title || !content || !section || !city) return;
    title.textContent = "🎬 City videos — " + city;
    if (intro) intro.textContent = "Videos are embedded only when the source description names this city. Check the source link for full context.";
    content.replaceChildren();
    const card = node("article", "district-official-video-card");
    if (/\\bagra\\b/i.test(city)) {
      const badge = node("span", "district-video-badge", "AGRA CITY VIDEO");
      const heading = node("h3", "", "Explore Agra — video");
      const frame = node("div", "district-playable-video-frame");
      const player = node("video", "district-playable-video");
      player.src = "/videos/agra-video.mp4";
      player.controls = true;
      player.playsInline = true;
      player.preload = "metadata";
      player.setAttribute("aria-label", "Agra city travel video");
      player.onerror = function () {
        const fallback = node("iframe", "district-playable-video");
        fallback.src = "https://www.youtube-nocookie.com/embed/" + VIDEO.id;
        fallback.title = VIDEO.title + " — includes Agra";
        fallback.loading = "lazy";
        fallback.referrerPolicy = "strict-origin-when-cross-origin";
        fallback.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        fallback.allowFullscreen = true;
        fallback.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation allow-popups");
        frame.replaceChildren(fallback);
      };
      frame.appendChild(player);
      const body = node("p", "", "Agra-specific video. If the video file has not been uploaded to the site yet, the verified Uttar Pradesh travel compilation will appear instead.");
      const credit = node("p", "district-official-source-name", "Local video asset: /videos/agra-video.mp4");
      const actions = node("div", "district-official-video-actions");
      actions.append(makeLink(VIDEO.source, "Open verified backup video ↗"));
      actions.append(makeLink(GALLERY, "Official UP Tourism gallery ↗"));
      card.append(badge, heading, frame, body, credit, actions);
    } else if (matchesCity(city)) {
      const badge = node("span", "district-video-badge", "SOURCE LINK INCLUDED");
      const heading = node("h3", "", VIDEO.title);
      const frame = node("div", "district-playable-video-frame");
      const player = node("iframe", "district-playable-video");
      player.src = "https://www.youtube-nocookie.com/embed/" + VIDEO.id;
      player.title = VIDEO.title + " — includes " + city;
      player.loading = "lazy";
      player.referrerPolicy = "strict-origin-when-cross-origin";
      player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      player.allowFullscreen = true;
      player.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation allow-popups");
      frame.appendChild(player);
      const body = node("p", "", "This is a multi-destination Uttar Pradesh travel compilation; it includes this place but is not an exclusive film about " + city + ".");
      const credit = node("p", "district-official-source-name", VIDEO.credit);
      const actions = node("div", "district-official-video-actions");
      actions.append(makeLink(VIDEO.source, "Open original YouTube source ↗"));
      actions.append(makeLink(GALLERY, "Official UP Tourism gallery ↗"));
      card.append(badge, heading, frame, body, credit, actions);
    } else {
      const badge = node("span", "district-video-badge", "NO UNVERIFIED CLIPS");
      const heading = node("h3", "", "No verified video added for " + city + " yet");
      const body = node("p", "", "We will not insert a random clip just because its title matches. Add a city-specific video here only after checking that the footage actually shows " + city + " and recording its original source.");
      const actions = node("div", "district-official-video-actions");
      actions.append(makeLink(GALLERY, "Official UP Tourism gallery ↗"));
      actions.append(makeLink(COMMONS + encodeURIComponent(city + " Uttar Pradesh"), "Browse video sources ↗"));
      card.append(badge, heading, body, actions);
    }
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