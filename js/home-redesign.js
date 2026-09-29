/* ExploreUP homepage refresh. This script deliberately does not modify Arya AI files or its widget logic. */
(function(){
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const regionData = [
    {id:"awadh",name:"Awadh",count:"12 Districts",symbol:"🏛️",color:"awadh"},
    {id:"braj",name:"Braj",count:"11 Districts",symbol:"🛕",color:"braj"},
    {id:"purvanchal",name:"Purvanchal",count:"20 Districts",symbol:"🕌",color:"purvanchal"},
    {id:"bundelkhand",name:"Bundelkhand",count:"12 Districts",symbol:"🏰",color:"bundelkhand"}
  ];
  const featured = [
    {name:"Varanasi",subtitle:"Spiritual Capital",image:"./images/varanasi.jpg"},
    {name:"Agra",subtitle:"Taj Mahal City",image:"https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85"},
    {name:"Lucknow",subtitle:"City of Nawabs",image:"https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=85"},
    {name:"Ayodhya",subtitle:"Ram Janmabhoomi",image:"https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&w=900&q=85"},
    {name:"Mathura",subtitle:"Land of Krishna",image:"https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85"}
  ];
  function openCity(name){
    if(typeof window.safeOpenCity === "function") window.safeOpenCity(name);
    else if(typeof window.openCity === "function") window.openCity(name);
  }
  function selectRegion(id){
    const filter = $('.region-btn[data-region="'+id+'"]');
    if(filter) filter.click();
    const viewAll = $("#viewAllDistrictsBtn");
    if(viewAll && viewAll.getAttribute("aria-expanded") !== "true") viewAll.click();
    const citySection = $("#cities");
    if(citySection) citySection.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function makeDashboard(main){
    if($("#homeDiscoveryDashboard")) return;
    const dashboard = document.createElement("section");
    dashboard.className = "home-discovery-dashboard";
    dashboard.id = "homeDiscoveryDashboard";
    dashboard.setAttribute("aria-label","Explore Uttar Pradesh by region");
    dashboard.innerHTML = `
      <article class="home-map-panel">
        <h2 class="home-map-title">🗺️ Uttar Pradesh Map</h2>
        <p class="home-panel-subtitle">Select a district on the map to open its guide.</p>
        <div id="homeMapMount"></div>
      </article>
      <section class="home-region-panel" aria-label="Explore by region">
        <h2 class="home-regions-title">📍 Explore by Region</h2>
        <p class="home-panel-subtitle">Discover the beauty of Uttar Pradesh, one district at a time.</p>
        <div class="home-region-grid"></div>
      </section>
      <aside class="home-why-panel">
        <h2>Why ExploreUP?</h2>
        <div class="home-why-item"><span class="home-why-icon">♧</span><div><b>Authentic &amp; useful information</b><small>Clear, practical travel details in one place.</small></div></div>
        <div class="home-why-item"><span class="home-why-icon">▣</span><div><b>District guides &amp; photo stories</b><small>Explore places, food, culture and local highlights.</small></div></div>
        <div class="home-why-item"><span class="home-why-icon">⌖</span><div><b>Detailed travel guidance</b><small>Places, food, how to reach and where to stay.</small></div></div>
        <div class="home-why-item"><span class="home-why-icon">▤</span><div><b>Plan your journey</b><small>Build an itinerary around the places you love.</small></div></div>
        <p class="home-why-note">Uttar Pradesh — more than a destination ♥</p>
      </aside>`;
    const mount = $("#homeMapMount",dashboard);
    const mapCard = $(".up-map-card");
    if(mapCard) mount.appendChild(mapCard);
    const regionGrid = $(".home-region-grid",dashboard);
    regionData.forEach(region=>{
      const button = document.createElement("button");
      button.type = "button";
      button.className = "home-region-card";
      button.dataset.region = region.id;
      button.innerHTML = '<span class="home-region-symbol">'+region.symbol+'</span><span><b>'+region.name+'</b><small>'+region.count+'</small></span><span class="home-region-arrow">→</span>';
      button.addEventListener("click",()=>selectRegion(region.id));
      regionGrid.appendChild(button);
    });
    const recent = $("#recentWrap");
    if(recent && recent.parentNode === main) main.insertBefore(dashboard,recent);
    else main.insertBefore(dashboard,main.children[1]||null);
    return dashboard;
  }
  function makeFeatured(main,dashboard){
    if($("#homeFeaturedDistricts")) return;
    const section = document.createElement("section");
    section.className = "section home-featured-section";
    section.id = "homeFeaturedDistricts";
    section.innerHTML = '<div class="sectionhead"><div><h2>⭐ Featured Districts</h2><p>Popular destinations you must explore</p></div><button class="view" type="button" id="homeViewAllDistricts">View All 75 Districts →</button></div><div class="home-featured-grid"></div>';
    const grid = $(".home-featured-grid",section);
    featured.forEach(item=>{
      const button = document.createElement("button");
      button.type = "button";
      button.className = "home-featured-card";
      button.setAttribute("aria-label","Open "+item.name+" district guide");
      button.innerHTML = '<div class="home-featured-image"><img loading="lazy" decoding="async" alt="'+item.name+' travel highlights"><span class="home-featured-play">▶</span></div><div class="home-featured-info"><span><b>'+item.name+'</b><small>'+item.subtitle+'</small></span><span class="home-featured-arrow">→</span></div>';
      const img = $("img",button);
      img.src = item.image;
      img.addEventListener("error",function(){
        if(this.dataset.fallback) return;
        this.dataset.fallback = "1";
        this.src = "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=75";
      });
      button.addEventListener("click",()=>openCity(item.name));
      grid.appendChild(button);
    });
    $("#homeViewAllDistricts",section).addEventListener("click",()=>{
      const existing = $("#viewAllDistrictsBtn");
      if(existing) existing.click();
      const citySection = $("#cities");
      if(citySection) citySection.scrollIntoView({behavior:"smooth",block:"start"});
    });
    dashboard.insertAdjacentElement("afterend",section);
  }
  function polishHero(){
    const hero = $(".hero");
    if(!hero) return;
    const eyebrow = $(".eyebrow",hero);
    if(eyebrow) eyebrow.textContent = "Uttar Pradesh";
    const heading = $("h1",hero);
    if(heading) heading.innerHTML = 'Beyond Ordinary,<br><em>Explore Extraordinary</em>';
    const description = $("p",hero);
    if(description) description.textContent = "75+ Districts  |  Rich Culture  |  Timeless Heritage  |  Endless Stories";
    const input = $("#searchInput");
    if(input) input.placeholder = "Search for a district...";
    const searchButton = $(".search button",hero);
    if(searchButton){searchButton.textContent="→";searchButton.setAttribute("aria-label","Search districts");}
    const chips = document.createElement("div");
    chips.className = "home-region-chips";
    chips.setAttribute("aria-label","Explore by UP region");
    regionData.forEach(region=>{
      const button = document.createElement("button");
      button.type = "button";
      button.className = "home-region-chip";
      button.dataset.region = region.id;
      button.innerHTML = '<span class="home-region-icon">'+region.symbol+'</span>'+region.name;
      button.addEventListener("click",()=>selectRegion(region.id));
      chips.appendChild(button);
    });
    const search = $(".search",hero);
    if(search && !$(".home-region-chips",hero)) search.insertAdjacentElement("afterend",chips);
  }
  function polishNavigation(){
    const nav = $(".navlinks");
    if(nav){
      nav.innerHTML = '<a aria-label="ExploreUP home" href="#top">⌂ &nbsp;Home</a><a href="#homeFeaturedDistricts">♧ &nbsp;Districts</a><a href="#about">ⓘ &nbsp;About UP</a><a href="#travel" id="homeTripPlannerLink">▦ &nbsp;Trip Planner</a><a href="#blogs">☷ &nbsp;More⌄</a>';
      const planner = $("#homeTripPlannerLink",nav);
      if(planner) planner.addEventListener("click",function(event){event.preventDefault();if(typeof window.planTrip==="function")window.planTrip();});
    }
    const pin = $(".pin b");
    if(pin) pin.textContent = "⌂";
    const viewAll = $("#viewAllDistrictsBtn");
    if(viewAll) viewAll.textContent = "View All 75 Districts →";
  }
  function init(){
    const main = $("#mainContent");
    if(!main) return;
    polishHero();
    polishNavigation();
    const dashboard = makeDashboard(main);
    if(dashboard) makeFeatured(main,dashboard);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();