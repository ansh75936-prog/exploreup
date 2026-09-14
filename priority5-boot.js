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
  if(!document.querySelector('script[data-exploreup-city-image-fix]')){
    const s2=document.createElement('script');
    s2.src='./fix-ayodhya-hidden-gems-image.js';
    s2.async=false;
    s2.dataset.exploreupCityImageFix='1';
    (document.head||document.documentElement).appendChild(s2);
  }
  if(!document.querySelector('script[data-exploreup-hotels-mount-fix]')){
    const s3=document.createElement('script');
    s3.src='./fix-hotels-modal-mount.js';
    s3.async=false;
    s3.dataset.exploreupHotelsMountFix='1';
    (document.head||document.documentElement).appendChild(s3);
  }
}catch(e){}
})();
