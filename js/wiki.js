/**
 * ExploreUP — Wikipedia-powered city images and destination details.
 * Uses Wikipedia REST summaries + MediaWiki article extracts.
 * Existing local images/content remain as fallbacks; Arya AI is independent.
 */
(function () {
  "use strict";

  const summaryCache = new Map();
  const pendingSummaries = new Map();
  const articleCache = new Map();
  const pendingArticles = new Map();
  const queuedCards = new WeakSet();
  const CREDIT_CLASS = "exploreup-wiki-credit";

  function normalizeName(value) {
    return String(value || "").trim().replace(/\\s+/g, " ");
  }

  function titleCandidates(city) {
    return [...new Set([
      city,
      city + " district",
      city + ", Uttar Pradesh"
    ])];
  }

  async function fetchCitySummary(cityName) {
    const city = normalizeName(cityName);
    if (!city) return null;
    if (summaryCache.has(city)) return summaryCache.get(city);
    if (pendingSummaries.has(city)) return pendingSummaries.get(city);

    const request = (async () => {
      for (const title of titleCandidates(city)) {
        try {
          const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(title.replace(/ /g, "_"));
          const response = await fetch(url, { headers: { Accept: "application/json" } });
          if (!response.ok) continue;
          const data = await response.json();
          if (data && data.extract && data.type !== "disambiguation") {
            summaryCache.set(city, data);
            return data;
          }
        } catch (error) {
          console.warn("ExploreUP Wikipedia summary unavailable:", error);
        }
      }
      return null;
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
          action: "query",
          format: "json",
          origin: "*",
          prop: "extracts|pageimages|info",
          explaintext: "1",
          exchars: "14000",
          piprop: "original",
          inprop: "url",
          titles: title
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
          image: page.original && page.original.source || summary.originalimage && summary.originalimage.source ||
            summary.thumbnail && summary.thumbnail.source || "",
          pageUrl: page.fullurl || summary.content_urls && summary.content_urls.desktop && summary.content_urls.desktop.page || ""
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
    return details && details.image ||
      summary && summary.originalimage && summary.originalimage.source ||
      summary && summary.thumbnail && summary.thumbnail.source || "";
  }

  function addCredit(host, href, label) {
    if (!host || !href) return;
    let link = host.querySelector(":scope > ." + CREDIT_CLASS);
    if (!link) {
      link = document.createElement("a");
      link.className = CREDIT_CLASS;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.cssText = "position:absolute;z-index:7;right:10px;bottom:10px;background:rgba(4,18,36,.78);color:#fff!important;border-radius:14px;padding:5px 8px;font-size:10px;line-height:1.2;text-decoration:none!important;backdrop-filter:blur(4px)";
      link.addEventListener("click", function (event) { event.stopPropagation(); });
      host.appendChild(link);
    }
    link.href = href;
    link.textContent = label || "Photo & details: Wikipedia";
    link.setAttribute("aria-label", "Open Wikipedia source in a new tab");
  }

  function enhanceCard(card) {
    if (!card || queuedCards.has(card)) return;
    const image = card.querySelector("img[data-city-image]");
    const city = normalizeName(card.getAttribute("data-open-city") ||
      card.querySelector(".citytext h3") && card.querySelector(".citytext h3").textContent);
    if (!image || !city) return;
    queuedCards.add(card);

    fetchCitySummary(city).then(summary => {
      if (!summary) return;
      const source = summary.content_urls && summary.content_urls.desktop && summary.content_urls.desktop.page;
      const imageUrl = imageFor(summary, null);
      if (imageUrl && image.isConnected) {
        image.src = imageUrl;
        image.alt = (summary.title || city) + " — photo from Wikipedia";
        image.dataset.wikiImage = "true";
        image.title = "Photo source: Wikipedia";
        const existingCredit = card.querySelector("." + CREDIT_CLASS);
        if (existingCredit) existingCredit.remove();
        addCredit(card, source, "Photo: Wikipedia");
      }
      const cardDescription = card.querySelector(".citytext small");
      if (cardDescription && summary.description && !cardDescription.dataset.wikiDescription) {
        cardDescription.textContent = summary.description;
        cardDescription.dataset.wikiDescription = "true";
      }
    }).catch(error => console.warn("ExploreUP card Wikipedia update skipped:", error));
  }

  function setupCardObserver() {
    const grid = document.getElementById("cityGrid");
    if (!grid) return;

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          imageObserver.unobserve(entry.target);
          enhanceCard(entry.target);
        });
      }, { rootMargin: "350px 0px" });

      const observeCards = () => {
        grid.querySelectorAll(".city").forEach(card => {
          if (!queuedCards.has(card)) imageObserver.observe(card);
        });
      };
      observeCards();
      new MutationObserver(observeCards).observe(grid, { childList: true, subtree: true });
    } else {
      const loadVisibleCards = () => {
        grid.querySelectorAll(".city").forEach((card, index) => {
          if (index < 12) enhanceCard(card);
        });
      };
      loadVisibleCards();
      new MutationObserver(loadVisibleCards).observe(grid, { childList: true });
    }
  }

  function updateHeroImage(city, summary, details) {
    const hero = document.getElementById("modalHero");
    const currentCity = normalizeName(document.getElementById("modalTitle") && document.getElementById("modalTitle").textContent);
    if (!hero || currentCity.toLowerCase() !== city.toLowerCase()) return;

    const imageUrl = imageFor(summary, details);
    const isVaranasi = city.toLowerCase() === "varanasi";
    // Varanasi uses the existing hero video; never replace or disable that video.
    if (imageUrl && !isVaranasi) {
      hero.style.backgroundImage = "linear-gradient(transparent,#06162d88),url('" + imageUrl.replace(/'/g, "%27") + "')";
      hero.style.backgroundPosition = "center";
      hero.style.backgroundSize = "cover";
      addCredit(hero, summary.content_urls && summary.content_urls.desktop && summary.content_urls.desktop.page ||
        details && details.pageUrl, "Photo: Wikipedia");
    }
  }

  function updateArticleDetails(city, summary, details) {
    const currentCity = normalizeName(document.getElementById("modalTitle") && document.getElementById("modalTitle").textContent);
    const modal = document.getElementById("modal");
    if (!modal || currentCity.toLowerCase() !== city.toLowerCase()) return;

    const extract = details && details.extract || summary.extract || "";
    const about = document.getElementById("dAbout");
    if (about && summary.extract) {
      about.textContent = summary.extract;
      addCreditAfterAbout(about, details && details.pageUrl ||
        summary.content_urls && summary.content_urls.desktop && summary.content_urls.desktop.page);
    }

    // The longer article is displayed in the existing knowledge overview, while
    // the local district dataset remains in place for places, food, prices and tips.
    const knowledge = document.getElementById("districtKnowledge");
    if (knowledge && extract) {
      const paragraphs = extract.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
      knowledge.textContent = paragraphs.slice(0, 3).join("\n\n").slice(0, 2600) || summary.extract;
    }

    const history = document.getElementById("districtHistory");
    const culture = document.getElementById("districtCulture");
    const nature = document.getElementById("districtNature");
    const why = document.getElementById("districtWhy");
    // Keep district-specific existing content in these fields unless Wikipedia
    // provides an appropriate clearly-labelled paragraph in the article extract.
    const sections = extract.split(/\n(?===)/);
    const findSection = terms => {
      const found = sections.find(section => {
        const heading = (section.split("\n")[0] || "").toLowerCase();
        return terms.some(term => heading.includes(term));
      });
      return found ? found.split("\n").slice(1).join(" ").replace(/\s+/g, " ").trim().slice(0, 1800) : "";
    };
    const historyText = findSection(["history"]);
    const cultureText = findSection(["culture", "tradition"]);
    const natureText = findSection(["geography", "climate", "environment"]);
    const tourismText = findSection(["tourism", "attractions", "landmarks"]);
    if (history && historyText) history.textContent = historyText;
    if (culture && cultureText) culture.textContent = cultureText;
    if (nature && natureText) nature.textContent = natureText;
    if (why && tourismText) why.textContent = tourismText;

    const hero = document.getElementById("modalHero");
    if (hero) {
      addCredit(hero, details && details.pageUrl ||
        summary.content_urls && summary.content_urls.desktop && summary.content_urls.desktop.page,
        "Wikipedia article");
    }
  }

  function addCreditAfterAbout(target, href) {
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

  async function syncCityWikipedia(cityName) {
    const city = normalizeName(cityName);
    if (!city) return null;
    const summary = await fetchCitySummary(city);
    if (!summary) return null;
    const details = await fetchArticleDetails(summary);
    updateHeroImage(city, summary, details);
    updateArticleDetails(city, summary, details);
    return { summary, details };
  }

  window.ExploreUPWiki = {
    fetchSummary: fetchCitySummary,
    fetchDetails: fetchArticleDetails,
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
      const city = normalizeName(title.textContent);
      if (!city || city === "City" || city === lastRequested) return;
      lastRequested = city;
      syncCityWikipedia(city).catch(error => console.warn("ExploreUP Wikipedia modal update skipped:", error));
    };
    new MutationObserver(syncIfOpen).observe(title, {
      childList: true, subtree: true, characterData: true
    });
    new MutationObserver(syncIfOpen).observe(modal, {
      attributes: true, attributeFilter: ["style", "aria-hidden"]
    });
  }

  function init() {
    setupCardObserver();
    attachModalObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
