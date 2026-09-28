/**
 * ExploreUP - Wikipedia API Integration
 * City ka real-time summary aur thumbnail fetch karne ke liye
 */

(function () {
  "use strict";

  // Wikipedia REST API se summary nikalne ka function
  async function fetchCitySummary(cityName) {
    if (!cityName) return null;

    try {
      const cleanCity = encodeURIComponent(cityName.trim());
      const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanCity}`;

      const res = await fetch(endpoint, {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!res.ok) {
        // Agar simple naam se na mile, toh state tag add karke retry
        const fallbackEndpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanCity},_Uttar_Pradesh`;
        const fallbackRes = await fetch(fallbackEndpoint);
        if (!fallbackRes.ok) return null;
        return await fallbackRes.json();
      }

      return await res.json();
    } catch (err) {
      console.warn("Wikipedia fetch error:", err);
      return null;
    }
  }

  // Modal open hone par details inject karne ka function
  async function syncCityWikipedia(cityName) {
    const data = await fetchCitySummary(cityName);
    if (!data) return;

    // 1. Text description inject karein
    const descTarget = document.getElementById("districtWikiSummary") || 
                       document.querySelector("#modalHero .hero-description") ||
                       document.querySelector(".modal-description");
    if (descTarget && data.extract) {
      descTarget.textContent = data.extract;
    }

    // 2. Agar hero video load na ho, toh fallback poster/image set karein
    const fallbackImg = document.getElementById("districtHeroFallbackImg");
    if (fallbackImg && data.thumbnail && data.thumbnail.source) {
      fallbackImg.src = data.thumbnail.source;
    }
  }

  // Window object par function expose karein
  window.ExploreUPWiki = {
    fetchSummary: fetchCitySummary,
    syncModal: syncCityWikipedia
  };

  // Jab bhi district modal change ho, auto-run karein
  window.addEventListener("exploreup:citychange", function (e) {
    const city = window.currentExploreCity || (e.detail && e.detail.cityName);
    if (city) {
      syncCityWikipedia(city);
    }
  });
})();
