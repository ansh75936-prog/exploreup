/* ExploreUP homepage showcase: rotating heritage hero + curated homepage card images.
   Visual-only layer; district data, navigation handlers and Arya AI files remain untouched. */
(function () {
  "use strict";

  const HERO_SLIDES = [
    { name: "Varanasi", subtitle: "The City of Light", image: "./images/varanasi.jpg?v=20260929-2", position: "center 48%" },
    { name: "Agra", subtitle: "Home of the Taj Mahal", image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Taj_Mahal_HD.jpg", position: "center 48%" },
    { name: "Mathura", subtitle: "The Heart of Braj", image: "https://loremflickr.com/1800/1000/Mathura%2C%20Uttar%20Pradesh%2C%20India?lock=5", position: "center 48%" },
    { name: "Ayodhya", subtitle: "Ram Mandir & Sacred Heritage", image: "./images/ayodhya-gallery-1.jpg?v=20260929-4", position: "center 42%" }
  ];

  const CARD_IMAGES = {
    "varanasi": "./images/varanasi.jpg?v=20260929-2",
    "agra": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Taj_Mahal_HD.jpg",
    "mathura": "https://loremflickr.com/900/600/Mathura%2C%20Uttar%20Pradesh%2C%20India?lock=5",
    "ayodhya": "./images/ayodhya-gallery-1.jpg?v=20260929-4",
    "lucknow": "./images/lucknow.jpg?v=20260929-2"
  };

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupHero() {
    const hero = document.querySelector(".hero");
    if (!hero || hero.dataset.euSlideshowReady === "1") return;
    hero.dataset.euSlideshowReady = "1";
    hero.classList.add("eu-slideshow-active");

    const stack = document.createElement("div");
    stack.className = "eu-hero-slides";
    stack.setAttribute("aria-hidden", "true");
    const layers = HERO_SLIDES.map((slide, index) => {
      const layer = document.createElement("div");
      layer.className = "eu-hero-slide" + (index === 0 ? " is-active" : "");
      layer.style.backgroundPosition = slide.position;
      layer.dataset.slideName = slide.name;
      stack.appendChild(layer);
      return layer;
    });
    hero.appendChild(stack);

    let caption = hero.querySelector(".eu-hero-location");
    if (!caption) {
      caption = document.createElement("div");
      caption.className = "eu-hero-location";
      caption.setAttribute("aria-live", "polite");
      caption.innerHTML = '<span class="eu-live-dot"></span><span class="eu-hero-city"></span><span class="eu-hero-subtitle"></span>';
      hero.appendChild(caption);
    }

    let current = 0;
    function preloadNext(index) {
      const next = (index + 1) % HERO_SLIDES.length;
      const preload = new Image();
      preload.decoding = "async";
      preload.src = HERO_SLIDES[next].image;
    }
    function show(index) {
      current = index % HERO_SLIDES.length;
      const slide = HERO_SLIDES[current];
      layers[current].style.backgroundImage = 'url("' + slide.image.replace(/"/g, "") + '")';
      layers.forEach((layer, i) => layer.classList.toggle("is-active", i === current));
      const city = caption.querySelector(".eu-hero-city");
      const subtitle = caption.querySelector(".eu-hero-subtitle");
      if (city) city.textContent = slide.name;
      if (subtitle) subtitle.textContent = slide.subtitle;
      preloadNext(current);
    }
    show(0);
    if (!reducedMotion) window.setInterval(() => show(current + 1), 6500);
  }

  function patchCityCards() {
    const grid = document.getElementById("cityGrid");
    if (!grid) return;
    grid.querySelectorAll(".city").forEach(card => {
      const title = (card.getAttribute("data-open-city") || card.querySelector(".citytext h3")?.textContent || "").trim().toLowerCase();
      const image = CARD_IMAGES[title];
      const img = card.querySelector("img");
      if (!image || !img || img.dataset.euCuratedImage === image) return;
      img.dataset.euCuratedImage = image;
      img.src = image;
      img.alt = title.charAt(0).toUpperCase() + title.slice(1) + " travel highlights";
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = function () {
        if (this.dataset.euFallbackUsed === "1") return;
        this.dataset.euFallbackUsed = "1";
        const original = window.ExploreUPDistricts || [];
        const city = original.find(item => String(item.name || "").toLowerCase() === title);
        if (city && city.img && city.img !== this.src) this.src = city.img;
      };
    });
  }

  function init() {
    setupHero();
    patchCityCards();
    const grid = document.getElementById("cityGrid");
    if (grid && window.MutationObserver) {
      new MutationObserver(patchCityCards).observe(grid, { childList: true, subtree: true });
    }
    const feature = document.querySelector(".featurebanner");
    if (feature) feature.style.backgroundImage = 'linear-gradient(100deg,rgba(5,25,49,.78),rgba(5,25,49,.16)),url("./images/varanasi.jpg?v=20260929-2")';
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
