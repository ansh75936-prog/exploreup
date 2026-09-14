/* ExploreUP Priority 5 boot compatibility layer. Keeps legacy globals safe and loads optional data layers. */
(function(){
'use strict';
try{
  if(!Array.isArray(window.cities) && Array.isArray(window.__exploreUpDistrictCities)){
    window.cities=window.__exploreUpDistrictCities;
  }
  if(!document.querySelector('script[data-exploreup-hotels]')){
    const s=document.createElement('script');
    s.src='./district-hotels.js';
    s.async=false;
    s.dataset.exploreupHotels='1';
    (document.head||document.documentElement).appendChild(s);
  }
}catch(e){}
})();
