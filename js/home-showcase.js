/* ExploreUP homepage visual layer. Keeps district navigation and Arya AI behavior intact. */
(function(){
 "use strict";
 const slides=[
  {name:"Varanasi",subtitle:"The City of Light",image:"/images/varanasi.jpg?v=20260929-6",position:"center 48%"},
  {name:"Agra",subtitle:"Home of the Taj Mahal",image:"/images/agra-card.jpg?v=20260929-6",position:"center 48%"},
  {name:"Mathura",subtitle:"The Heart of Braj",image:"",position:"center"},
  {name:"Ayodhya",subtitle:"Ram Mandir & Sacred Heritage",image:"/images/ayodhya-ram-mandir-card.jpg?v=20260929-6",position:"center 42%"}
 ];
 const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 function makeDashboard(){
  const categories=document.querySelector(".categories");
  if(!categories||document.querySelector(".eu-home-dashboard"))return;
  const dash=document.createElement("section");dash.className="eu-home-dashboard";
  dash.innerHTML=
   '<div class="eu-region-panel"><h2 class="eu-section-title">🏰 Explore by Region</h2><p class="eu-section-subtitle">Discover the beauty of Uttar Pradesh, one district at a time.</p><div class="eu-region-grid">'+
   '<button class="eu-region-card" type="button" data-region-jump="awadh"><span class="eu-region-icon">🏛️</span><span><strong>Awadh</strong><small>22 Districts</small></span><span class="eu-region-arrow">→</span></button>'+
   '<button class="eu-region-card" type="button" data-region-jump="braj"><span class="eu-region-icon">🛕</span><span><strong>Braj</strong><small>8 Districts</small></span><span class="eu-region-arrow">→</span></button>'+
   '<button class="eu-region-card" type="button" data-region-jump="purvanchal"><span class="eu-region-icon">🌅</span><span><strong>Purvanchal</strong><small>20 Districts</small></span><span class="eu-region-arrow">→</span></button>'+
   '<button class="eu-region-card" type="button" data-region-jump="bundelkhand"><span class="eu-region-icon">🏰</span><span><strong>Bundelkhand</strong><small>7 Districts</small></span><span class="eu-region-arrow">→</span></button>'+
   '</div></div>'+
   '<aside class="eu-why-panel"><h2 class="eu-section-title">Why ExploreUP?</h2><div class="eu-why-list">'+
   '<div class="eu-why-item"><span class="eu-why-icon">🛡️</span><div><strong>Useful travel information</strong><small>Clear, practical destination guides</small></div></div>'+
   '<div class="eu-why-item"><span class="eu-why-icon">🖼️</span><div><strong>District-wise photo galleries</strong><small>Your own selected images, not API photos</small></div></div>'+
   '<div class="eu-why-item"><span class="eu-why-icon">🧭</span><div><strong>Detailed travel guide</strong><small>Places, food, transport and stays</small></div></div>'+
   '<div class="eu-why-item"><span class="eu-why-icon">📋</span><div><strong>Trip planning</strong><small>Plan your Uttar Pradesh journey</small></div></div>'+
   '</div><div class="eu-trip-promo"><strong>Plan Your Trip</strong><small>Create your perfect Uttar Pradesh journey</small><button type="button" id="euTripPlannerBtn">Start Planning →</button></div></aside>';
  categories.insertAdjacentElement("afterend",dash);
  dash.querySelectorAll("[data-region-jump]").forEach(btn=>btn.addEventListener("click",function(){
   const filter=document.querySelector('.region-btn[data-region="'+btn.dataset.regionJump+'"]');
   if(filter)filter.click();
   const target=document.getElementById("districtDiscovery");
   if(target)target.scrollIntoView({behavior:"smooth",block:"start"});
  }));
  const trip=dash.querySelector("#euTripPlannerBtn");if(trip)trip.addEventListener("click",function(){if(typeof window.planTrip==="function")window.planTrip();else document.getElementById("travel")?.scrollIntoView({behavior:"smooth"});});
 }
 function makeFeatured(){
  if(document.querySelector(".eu-featured-section"))return;
  const main=document.getElementById("mainContent");if(!main)return;
  const section=document.createElement("section");section.className="eu-featured-section";
  section.innerHTML='<div class="sectionhead"><div><h2>⭐ Featured Districts</h2><p>Popular destinations you must explore</p></div><button class="view" type="button" id="euViewAllFeatured" aria-controls="cityGrid" aria-expanded="false" onclick="toggleAllDistricts()">View All 75 Districts ↓</button></div><div class="eu-featured-grid">'+
   featuredCard("Varanasi","Spiritual Capital","🛕")+
   featuredCard("Agra","Taj Mahal City","🏛️")+
   featuredCard("Lucknow","City of Nawabs","🏰")+
   featuredCard("Ayodhya","Ram Janmabhoomi","🪔")+
   featuredCard("Mathura","Land of Krishna","🦚")+
   '</div>';
  const dash=main.querySelector(".eu-home-dashboard");
  if(dash)dash.insertAdjacentElement("afterend",section);else main.insertBefore(section,main.children[1]||null);
  section.querySelectorAll("[data-feature-city]").forEach(card=>{
   const openCity=()=>{if(typeof window.safeOpenCity==="function")window.safeOpenCity(card.dataset.featureCity);};
   card.addEventListener("click",openCity);
   card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openCity();}});
  });
 }
 function featuredCard(name,sub,icon){
  return '<article class="eu-featured-card" data-feature-city="'+name+'" role="button" tabindex="0" aria-label="'+name+' — Explore district guide"><div class="eu-featured-photo" aria-hidden="true"><span>'+icon+'</span></div><div class="eu-featured-info"><div><strong>'+name+'</strong><small>'+sub+'</small></div><span class="arrow" aria-hidden="true">→</span></div></article>';
 }
 function setupHero(){
  const hero=document.querySelector(".hero");if(!hero||hero.dataset.euSlideshowReady==="1")return;
  hero.dataset.euSlideshowReady="1";hero.classList.add("eu-slideshow-active");
  const stack=document.createElement("div");stack.className="eu-hero-slides";stack.setAttribute("aria-hidden","true");
  const layers=slides.map((s,i)=>{const el=document.createElement("div");el.className="eu-hero-slide"+(i===0?" is-active":"");el.style.backgroundPosition=s.position;stack.appendChild(el);return el;});
  hero.appendChild(stack);
  const caption=document.createElement("div");caption.className="eu-hero-location";caption.setAttribute("aria-live","polite");caption.innerHTML='<span class="eu-live-dot"></span><span class="eu-hero-city"></span><span class="eu-hero-subtitle"></span>';hero.appendChild(caption);
  const toggle=document.createElement("button");toggle.type="button";toggle.className="eu-slideshow-toggle";toggle.setAttribute("aria-pressed","false");toggle.setAttribute("aria-label","Ⅱ Pause slides — featured destination slideshow");toggle.textContent="Ⅱ Pause slides";hero.appendChild(toggle);
  let current=0,paused=!!reduced,timer=null;
  function show(i){
   current=i%slides.length;const s=slides[current],layer=layers[current];
   if(s.image){layer.style.backgroundImage='url("'+s.image.replace(/"/g,"")+'")';}
   else{layer.style.backgroundImage="linear-gradient(130deg,#0b2b50,#27618b 52%,#d99a3d)";}
   layers.forEach((el,j)=>el.classList.toggle("is-active",j===current));
   caption.querySelector(".eu-hero-city").textContent=s.name;
   caption.querySelector(".eu-hero-subtitle").textContent=s.subtitle;
   if(s.image){const im=new Image();im.src=s.image;}
  }
  function stop(){if(timer){window.clearInterval(timer);timer=null;}}
  function start(){stop();if(!paused&&!document.hidden)timer=window.setInterval(()=>show((current+1)%slides.length),6500);}
  toggle.hidden=!!reduced;
  toggle.addEventListener("click",()=>{paused=!paused;toggle.setAttribute("aria-pressed",String(paused));toggle.textContent=paused?"▶ Play slides":"Ⅱ Pause slides";toggle.setAttribute("aria-label",paused?"▶ Play slides — featured destination slideshow":"Pause featured destination slideshow");if(paused)stop();else start();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();else start();});
  show(0);start();
 }
 function prepareDistrictCards(){
  const grid=document.getElementById("cityGrid");if(!grid)return;
  grid.querySelectorAll(".city").forEach(card=>{
   card.classList.add("eu-district-card");
   const img=card.querySelector("img");
   if(img){img.loading="lazy";img.decoding="async";img.removeAttribute("fetchpriority");}
   const placeholder=card.querySelector(".eu-card-photo-placeholder");
   if(placeholder)placeholder.remove();
  });
 }
 function init(){
  setupHero();makeDashboard();makeFeatured();prepareDistrictCards();
  const grid=document.getElementById("cityGrid");
  if(grid&&window.MutationObserver)new MutationObserver(prepareDistrictCards).observe(grid,{childList:true,subtree:true});
  const feature=document.querySelector(".featurebanner");
  if(feature)feature.style.backgroundImage='linear-gradient(100deg,rgba(5,25,49,.78),rgba(5,25,49,.16)),url("/images/varanasi.jpg?v=20260929-6")';
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();