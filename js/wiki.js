/**
 * ExploreUP — Wikipedia API integration.
 * Fetches a short public summary when a district guide opens and credits Wikipedia.
 * This file is independent of Arya AI.
 */
(function () {
  "use strict";

  const summaryCache = new Map();
  const pending = new Map();

  async function fetchCitySummary(cityName) {
    const city = String(cityName || "").trim();
    if (!city) return null;
    if (summaryCache.has(city)) return summaryCache.get(city);
    if (pending.has(city)) return pending.get(city);

    const request = (async () => {
      // Try common article-title formats so district names are more likely to resolve.
      const candidates = [...new Set([
        city,
        city + " district",
        city + ", Uttar Pradesh"
      ])];

      for (const title of candidates) {
        try {
          const endpoint = "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(title.replace(/ /g, "_"));
          const response = await fetch(endpoint, {
            headers: { "Accept": "application/json" }
          });
          if (!response.ok) continue;

          const data = await response.json();
          if (data && data.extract && data.type !== "disambiguation") {
            summaryCache.set(city, data);
            return data;
          }
        } catch (error) {
          console.warn("ExploreUP Wikipedia request failed:", error);
        }
      }
      return null;
    })();

    pending.set(city, request);
    try {
      return await request;
    } finally {
      pending.delete(city);
    }
  }

  function addWikipediaAttribution(target, data) {
    if (!target || !data || !data.content_urls || !data.content_urls.desktop ||
        !data.content_urls.desktop.page) return;

    let attribution = document.getElementById("exploreupWikiAttribution");
    if (!attribution) {
      attribution = document.createElement("div");
      attribution.id = "exploreupWikiAttribution";
      attribution.style.cssText = "margin:6px 0 14px;font-size:12px;color:#60708a";
      target.insertAdjacentElement("afterend", attribution);
    }
    attribution.replaceChildren();
    const link = document.createElement("a");
    link.href = data.content_urls.desktop.page;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Source: Wikipedia · Read more";
    link.style.cssText = "color:#0b67d1;text-decoration:underline";
    attribution.appendChild(link);
  }

  async function syncCityWikipedia(cityName) {
    const city = String(cityName || "").trim();
    if (!city) return null;

    const data = await fetchCitySummary(city);
    if (!data || !data.extract) return null;

    const target = document.getElementById("dAbout") ||
      document.getElementById("districtWikiSummary") ||
      document.querySelector("#modalHero .hero-description") ||
      document.querySelector(".modal-description");

    // Only replace the existing city overview when a real summary was returned.
    if (target) target.textContent = data.extract;
    addWikipediaAttribution(target, data);
    return data;
  }

  window.ExploreUPWiki = {
    fetchSummary: fetchCitySummary,
    syncModal: syncCityWikipedia
  };

  window.addEventListener("exploreup:citychange", function (event) {
    const city = (event.detail && event.detail.cityName) ||
      window.currentExploreCity ||
      document.getElementById("modalTitle")?.textContent;
    if (city) syncCityWikipedia(city);
  });

  // The existing homepage does not emit a city-change event yet. Observe its
  // existing modal title so the uploaded API file actually runs when a guide opens.
  function attachModalObserver() {
    const modal = document.getElementById("modal");
    const title = document.getElementById("modalTitle");
    if (!modal || !title || typeof MutationObserver === "undefined") return;

    const syncIfOpen = () => {
      if (modal.getAttribute("aria-hidden") === "true") return;
      const city = (title.textContent || "").trim();
      if (!city || city === "City") return;
      syncCityWikipedia(city);
    };

    const observer = new MutationObserver(syncIfOpen);
    observer.observe(title, { childList: true, subtree: true, characterData: true });
    observer.observe(modal, { attributes: true, attributeFilter: ["style", "aria-hidden"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachModalObserver, { once: true });
  } else {
    attachModalObserver();
  }
})();
