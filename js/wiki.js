/**
 * ExploreUP — Wikipedia-powered destination photos and article details.
 * Keeps local district content as fallback and does not touch Arya AI.
 */
(function () {
  "use strict";
  const summaryCache = new Map();
  const pendingSummaries = new Map();
  const articleCache = new Map();
  const pendingArticles = new Map();
  const sectionCache = new Map();
  const queuedCards = new WeakSet();

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }
  function candidates(city) {
    return [...new Set([city, city + " district", city + ", Uttar Pradesh"])];
  }
  function imageOf(page) {
    return page && (
      page.original && page.original.source ||
      page.thumbnail && page.thumbnail.source ||
      page.originalimage && page.originalimage.source
    ) || "";
  }
  function articleUrl(page) {
    return page && (page.fullurl ||
      page.content_urls && page.content_urls.desktop && page.content_urls.desktop.page) || "";
  }
  function normalizePage(page) {
    if (!page) return null;
    const extract = clean(page.extract || page.description || "");
    if (!extract && !imageOf(page)) return null;
    const url = articleUrl(page) || ("https://en.wikipedia.org/wiki/" + encodeURIComponent(String(page.title || "").replace(/ /g, "_")));
    return {
      title: page.title || "",
      extract,
      description: clean(page.description || extract.split(/[.!?]/)[0]).slice(0, 170),
      thumbnail: page.thumbnail || null,
      originalimage: page.originalimage || (page.original ? { source: page.original.source } : null),
      original: page.original || null,
      content_urls: { desktop: { page: url } },
      fullurl: url
    };
  }

  async function searchWikipedia(city) {
    try {
      const params = new URLSearchParams({
        action: "query", format: "json", origin: "*",
        generator: "search", gsrsearch: city + " Uttar Pradesh",
        gsrnamespace: "0", gsrlimit: "8",
        prop: "pageimages|extracts|info",
        piprop: "thumbnail|original", pithumbsize: "1200",
        exintro: "1", explaintext: "1", exchars: "900",
        inprop: "url"
      });
      const response = await fetch("https://en.wikipedia.org/w/api.php?" + params.toString(), {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) return null;
      const json = await response.json();
      const pages = Object.values(json.query && json.query.pages || {});
      const normalized = pages.map(normalizePage).filter(Boolean);
      return normalized.find(p => imageOf(p)) || normalized[0] || null;
    } catch (error) {
      console.warn("ExploreUP Wikipedia search unavailable:", error);
      return null;
    }
  }

  async function fetchCitySummary(cityName) {
    const city = clean(cityName);
    if (!city) return null;
    if (summaryCache.has(city)) return summaryCache.get(city);
    if (pendingSummaries.has(city)) return pendingSummaries.get(city);
    const request = (async () => {
      let fallback = null;
      for (const title of candidates(city)) {
        try {
          const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(title.replace(/ /g, "_"));
          const response = await fetch(url, { headers: { Accept: "application/json" } });
          if (!response.ok) continue;
          const data = await response.json();
          if (!data || !data.extract || data.type === "disambiguation") continue;
          if (!fallback) fallback = data;
          if (imageOf(data)) {
            summaryCache.set(city, data);
            return data;
          }
        } catch (error) {
          console.warn("ExploreUP Wikipedia summary unavailable:", error);
        }
      }
      const searched = await searchWikipedia(city);
      if (searched && (imageOf(searched) || searched.extract)) {
        summaryCache.set(city, searched);
        return searched;
      }
      if (fallback) summaryCache.set(city, fallback);
      return fallback;
    })();
    pendingSummaries.set(city, request);
    try { return await request; }
    finally { pendingSummaries.delete(city); }
  }

  async function fetchArticleDetails(summary) {
    if (!summary || !summary.title) return null;
    const title = summary.title;
    if (articleCache.has(title)) return articleCache.get(title);
    if (pendingArticles.has(title)) return pendingArticles.get(title);
    const request = (async () => {
      try {
        const params = new URLSearchParams({
          action: "query", format: "json", origin: "*",
          prop: "extracts|pageimages|info", explaintext: "1",
          exchars: "14000", piprop: "original", inprop: "url", titles: title
        });
        const response = await fetch("https://en.wikipedia.org/w/api.php?" + params.toString(), {
          headers: { Accept: "application/json" }
        });
        if (!response.ok) return null;
        const json = await response.json();
        const page = Object.values(json.query && json.query.pages || {})[0];
        if (!page || page.missing !== undefined) return null;
        const details = {
          title: page.title || title,
          extract: page.extract || summary.extract || "",
          image: imageOf(page) || imageOf(summary),
          pageUrl: articleUrl(page) || articleUrl(summary)
        };
        articleCache.set(title, details);
        return details;
      } catch (error) {
        console.warn("ExploreUP Wikipedia article details unavailable:", error);
        return null;
      }
    })();
    pendingArticles.set(title, request);
    try { return await request; }
    finally { pendingArticles.delete(title); }
  }

  function imageFor(summary, details) {
    return details && details.image || imageOf(summary) || "";
  }

  function enhanceCard(card) {
    if (!card || queuedCards.has(card)) return;
    const image = card.querySelector("img[data-city-image]");
    const city = clean(card.getAttribute("data-open-city") ||
      (card.querySelector(".citytext h3") && card.querySelector(".citytext h3").textContent));
    if (!image || !city) return;
    queuedCards.add(card);
    fetchCitySummary(city).then(summary => {
      if (!summary || !image.isConnected) return;
      const imageUrl = imageFor(summary, null);
      if (imageUrl) {
        delete image.dataset.fallbackDone;
        image.onerror = function () {
          image.onerror = null;
          // Keep the site's existing image fallback if Wikipedia's image is unavailable.
          if (typeof window.exploreUpImageFallback === "function") window.exploreUpImageFallback(image);
        };
        image.src = imageUrl;
        image.alt = (summary.title || city) + " destination photo";
        image.removeAttribute("title");
        image.dataset.wikiImage = "true";
      }
      const description = card.querySelector(".citytext small");
      if (description && summary.description && !description.dataset.wikiDescription) {
        description.textContent = summary.description;
        description.dataset.wikiDescription = "true";
      }
    }).catch(error => console.warn("ExploreUP card image update skipped:", error));
  }

  function setupCardObserver() {
    const grid = document.getElementById("cityGrid");
    if (!grid) return;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          enhanceCard(entry.target);
        });
      }, { rootMargin: "500px 0px" });
      const observeCards = () => {
        grid.querySelectorAll(".city").forEach(card => {
          if (!queuedCards.has(card)) observer.observe(card);
        });
      };
      observeCards();
      new MutationObserver(observeCards).observe(grid, { childList: true, subtree: true });
      // When the collapsed district list is opened, explicitly queue its cards.
      const button = document.getElementById("viewAllDistrictsBtn");
      if (button) button.addEventListener("click", () => setTimeout(observeCards, 80));
    } else {
      const loadCards = () => grid.querySelectorAll(".city").forEach(enhanceCard);
      loadCards();
      new MutationObserver(loadCards).observe(grid, { childList: true });
    }
  }

  async function fetchArticleSections(summary) {
    if (!summary || !summary.title) return {};
    if (sectionCache.has(summary.title)) return sectionCache.get(summary.title);
    const result = {};
    try {
      const params = new URLSearchParams({
        action: "parse", format: "json", origin: "*",
        page: summary.title, prop: "sections"
      });
      const response = await fetch("https://en.wikipedia.org/w/api.php?" + params.toString(), {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) return result;
      const json = await response.json();
      const sections = json.parse && json.parse.sections || [];
      const wanted = [
        { key: "history", terms: ["history"] },
        { key: "culture", terms: ["culture", "tradition", "arts"] },
        { key: "nature", terms: ["geography", "climate", "environment"] },
        { key: "tourism", terms: ["tourism", "attractions", "landmarks", "places of interest"] },
        { key: "places", terms: ["tourist attractions", "places of interest", "sights", "landmarks"] },
        { key: "food", terms: ["cuisine", "food", "gastronomy", "culinary"] }
      ];
      await Promise.all(wanted.map(async item => {
        const section = sections.find(entry => item.terms.some(term =>
          String(entry.line || "").toLowerCase().includes(term)));
        if (!section) return;
        try {
          const sp = new URLSearchParams({
            action: "parse", format: "json", origin: "*",
            page: summary.title, prop: "text", section: String(section.index)
          });
          const sr = await fetch("https://en.wikipedia.org/w/api.php?" + sp.toString(), {
            headers: { Accept: "application/json" }
          });
          if (!sr.ok) return;
          const sj = await sr.json();
          const html = sj.parse && sj.parse.text && sj.parse.text["*"];
          if (!html) return;
          const parsed = new DOMParser().parseFromString(html, "text/html");
          parsed.querySelectorAll("script,style,table,.navbox,.reference,.mw-editsection").forEach(n => n.remove());
          const text = clean(parsed.body.textContent || "");
          if (text) result[item.key] = text.slice(0, 2200);
        } catch (error) {
          console.warn("ExploreUP Wikipedia section unavailable:", item.key, error);
        }
      }));
    } catch (error) {
      console.warn("ExploreUP Wikipedia section list unavailable:", error);
    }
    sectionCache.set(summary.title, result);
    return result;
  }

  function addSourceAfterAbout(target, href) {
    if (!target || !href) return;
    let credit = document.getElementById("exploreupWikiAttribution");
    if (!credit) {
      credit = document.createElement("div");
      credit.id = "exploreupWikiAttribution";
      credit.style.cssText = "margin:6px 0 14px;font-size:12px;color:#60708a";
      target.insertAdjacentElement("afterend", credit);
    }
    credit.replaceChildren();
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Source: Wikipedia · Read full article";
    link.style.cssText = "color:#0b67d1;text-decoration:underline";
    credit.appendChild(link);
  }

  function fillIfBlank(id, value) {
    const el = document.getElementById(id);
    if (el && !clean(el.textContent) && value) el.textContent = value;
  }

  function updateArticleDetails(city, summary, details, sections) {
    const current = clean(document.getElementById("modalTitle") && document.getElementById("modalTitle").textContent);
    const modal = document.getElementById("modal");
    if (!modal || current.toLowerCase() !== city.toLowerCase()) return;
    const extract = clean(details && details.extract || summary && summary.extract || "");
    const about = document.getElementById("dAbout");
    if (about && extract) {
      about.textContent = extract;
      addSourceAfterAbout(about, details && details.pageUrl || articleUrl(summary));
    }
    const knowledge = document.getElementById("districtKnowledge");
    if (knowledge && extract && (!clean(knowledge.textContent) || clean(knowledge.textContent).length < 45)) {
      knowledge.textContent = extract.slice(0, 2400);
    }

    const historyText = sections && sections.history || "";
    const cultureText = sections && sections.culture || "";
    const natureText = sections && sections.nature || "";
    const tourismText = sections && (sections.tourism || sections.places) || "";
    const foodText = sections && sections.food || "";
    if (historyText) document.getElementById("districtHistory") && (document.getElementById("districtHistory").textContent = historyText);
    if (cultureText) document.getElementById("districtCulture") && (document.getElementById("districtCulture").textContent = cultureText);
    if (natureText) document.getElementById("districtNature") && (document.getElementById("districtNature").textContent = natureText);
    if (tourismText) document.getElementById("districtWhy") && (document.getElementById("districtWhy").textContent = tourismText);
    if (tourismText) document.getElementById("dPlaces") && (document.getElementById("dPlaces").textContent = tourismText);
    if (foodText) document.getElementById("dFood") && (document.getElementById("dFood").textContent = foodText);

    // If a district has no local food list, replace the empty-state message with a useful article-backed card.
    const foodGrid = document.getElementById("foodGrid");
    if (foodGrid && /no matching food item/i.test(foodGrid.textContent || "")) {
      const card = document.createElement("article");
      card.className = "foodcard";
      const type = document.createElement("div");
      type.className = "foodtype";
      type.textContent = "LOCAL CUISINE";
      const heading = document.createElement("h3");
      heading.textContent = city + " food and cuisine";
      const paragraph = document.createElement("p");
      paragraph.textContent = foodText || "Explore local eateries and regional dishes; specialities vary by neighbourhood. Check current options before travelling.";
      const chips = document.createElement("div");
      chips.className = "foodchips";
      const cityChip = document.createElement("span");
      cityChip.className = "foodchip";
      cityChip.textContent = city;
      const sourceChip = document.createElement("span");
      sourceChip.className = "foodchip";
      sourceChip.textContent = foodText ? "Wikipedia article" : "ExploreUP Food Guide";
      chips.append(cityChip, sourceChip);
      card.append(type, heading, paragraph, chips);
      foodGrid.replaceChildren(card);
    }

    // Never leave these key city-guide cards blank when a district data record is incomplete.
    fillIfBlank("dPlaces", "Explore local landmarks, heritage sites and nearby attractions. Check current opening hours before visiting.");
    fillIfBlank("dFood", "Explore local eateries and regional dishes; specialities vary by neighbourhood. Check current options before travelling.");
    fillIfBlank("dShop", "Explore local markets, crafts, textiles and regional products. Availability varies by area.");
    fillIfBlank("dTime", "October to March is often more comfortable for outdoor sightseeing; check the local forecast before travelling.");
    fillIfBlank("dBudget", "Costs vary by transport, accommodation and activities. Confirm current prices before your visit.");
    fillIfBlank("dTip", "Check opening hours, local transport and current travel conditions before setting out.");
    fillIfBlank("districtHistory", extract || "Explore the destination's history and heritage through local museums, monuments and historic neighbourhoods.");
    fillIfBlank("districtCulture", "Discover local traditions, crafts, language, arts and everyday culture.");
    fillIfBlank("districtNature", "Explore nearby rivers, parks, green spaces and natural areas where available.");
    fillIfBlank("districtWhy", tourismText || "Plan a visit around local landmarks, food, markets and cultural experiences.");
  }

  function updateHeroImage(city, summary, details) {
    const hero = document.getElementById("modalHero");
    const title = clean(document.getElementById("modalTitle") && document.getElementById("modalTitle").textContent);
    if (!hero || title.toLowerCase() !== city.toLowerCase()) return;
    // Varanasi's existing video remains untouched.
    if (city.toLowerCase() === "varanasi" || hero.classList.contains("has-district-video")) return;
    const url = imageFor(summary, details);
    if (!url) return;
    hero.style.backgroundImage = "linear-gradient(transparent,#06162d88),url('" + url.replace(/'/g, "%27") + "')";
    hero.style.backgroundPosition = "center";
    hero.style.backgroundSize = "cover";
  }

  async function syncCityWikipedia(cityName) {
    const city = clean(cityName);
    if (!city) return null;
    const summary = await fetchCitySummary(city);
    if (!summary) {
      // Still populate blank fields with readable fallback copy when Wikipedia has no article.
      updateArticleDetails(city, { extract: "" }, null, {});
      return null;
    }
    const details = await fetchArticleDetails(summary);
    updateHeroImage(city, summary, details);
    const sections = await fetchArticleSections(summary);
    updateArticleDetails(city, summary, details, sections);
    return { summary, details, sections };
  }

  window.ExploreUPWiki = {
    fetchSummary: fetchCitySummary,
    fetchDetails: fetchArticleDetails,
    fetchSections: fetchArticleSections,
    syncModal: syncCityWikipedia,
    enhanceCards: function () {
      document.querySelectorAll("#cityGrid .city").forEach(enhanceCard);
    }
  };

  window.addEventListener("exploreup:citychange", function (event) {
    const city = event.detail && event.detail.cityName ||
      window.currentExploreCity ||
      document.getElementById("modalTitle") && document.getElementById("modalTitle").textContent;
    if (city) syncCityWikipedia(city);
  });

  function attachModalObserver() {
    const modal = document.getElementById("modal");
    const title = document.getElementById("modalTitle");
    if (!modal || !title || typeof MutationObserver === "undefined") return;
    let lastRequested = "";
    const syncIfOpen = () => {
      if (modal.getAttribute("aria-hidden") === "true" || modal.style.display === "none") return;
      const city = clean(title.textContent);
      if (!city || city === "City" || city === lastRequested) return;
      lastRequested = city;
      syncCityWikipedia(city).catch(error => console.warn("ExploreUP Wikipedia modal update skipped:", error));
    };
    new MutationObserver(syncIfOpen).observe(title, { childList: true, subtree: true, characterData: true });
    new MutationObserver(syncIfOpen).observe(modal, { attributes: true, attributeFilter: ["style", "aria-hidden"] });
  }

  function init() {
    setupCardObserver();
    attachModalObserver();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();