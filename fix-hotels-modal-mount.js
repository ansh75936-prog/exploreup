/* ExploreUP Hotels & Stays — district hotel block placement fix. */
(function(){
  'use strict';

  function isOpen(){
    var modal=document.getElementById('modal');
    return !!(modal && getComputedStyle(modal).display !== 'none');
  }

  function placeHotelBlock(){
    try{
      if(!isOpen()) return;
      var modal=document.getElementById('modal');
      var stay=document.getElementById('districtStay');
      var block=document.getElementById('exploreup-hotels-stays');
      if(!modal || !stay || !block) return;

      /* Move the actual hotel list itself — never a generic hotel-looking
         nav/chip/parent element. Keep it inside the district Stay section. */
      if(block.parentElement !== stay) stay.appendChild(block);
      block.setAttribute('data-exploreup-hotel-placement','districtStay');
      block.style.display='block';
      block.style.visibility='visible';
    }catch(e){}
  }

  function mount(){
    try{
      if(window.ExploreUPHotels && typeof window.ExploreUPHotels.mount === 'function'){
        window.ExploreUPHotels.mount();
      }
    }catch(e){}
    [0,60,180,400,800,1400].forEach(function(ms){ setTimeout(placeHotelBlock,ms); });
  }

  function remountAfterInteraction(){
    if(isOpen()) mount();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',mount,{once:true});
  }else{
    mount();
  }

  document.addEventListener('click',remountAfterInteraction,true);
  document.addEventListener('keydown',function(e){
    if(e.key==='Enter' || e.key===' '){ remountAfterInteraction(); }
  },true);

  new MutationObserver(function(){
    if(isOpen()) mount();
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
})();
