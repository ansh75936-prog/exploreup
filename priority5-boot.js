/* ExploreUP Priority 5 boot compatibility layer. Keeps legacy globals safe and loads optional data layers. */
(function(){
'use strict';
try{
  if(!Array.isArray(window.cities) && Array.isArray(window.__exploreUpDistrictCities)) window.cities=window.__exploreUpDistrictCities;
  const load=(src,attr)=>{
    if(document.querySelector('script['+attr+']')) return;
    const s=document.createElement('script');s.src=src;s.async=false;s.setAttribute(attr,'1');
    (document.head||document.documentElement).appendChild(s);
  };
  load('./district-services-framework.js','data-exploreup-district-services');
  load('./district-hotels.js','data-exploreup-hotels');
  load('./district-hotels-verified-overrides.js','data-exploreup-verified-hotel-overrides');
  load('./fix-ayodhya-hidden-gems-image.js','data-exploreup-city-image-fix');
  load('./fix-hotels-modal-mount.js?v=3','data-exploreup-hotels-mount-fix');
  load('./arya-ai-knowledge.js?v=1','data-exploreup-arya-knowledge');
  load('./arya-ai-bridge.js?v=2','data-exploreup-arya-bridge');
  load('./arya-ai-stability.js?v=1','data-exploreup-arya-stability');
}catch(e){try{console.warn('ExploreUP boot warning:',e)}catch(_){}}
})();
