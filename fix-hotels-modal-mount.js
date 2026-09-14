/* ExploreUP Hotels & Stays — reliable district-modal mount + placement fix. */
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
      if(!modal || !stay) return;

      /* Find the hotel block without depending on one fragile class name. */
      var candidates=Array.from(modal.querySelectorAll('[id*="hotel" i],[class*="hotel" i],[data-exploreup-hotels]'));
      candidates=candidates.filter(function(el){
        if(el===stay || stay.contains(el)) return false;
        var text=(el.innerText||el.textContent||'').trim();
        return text.length>0;
      });

      if(!candidates.length) return;

      /* Prefer the highest-level matching element so we move the whole section once. */
      candidates.sort(function(a,b){
        var da=0,db=0,x=a; while(x&&x.parentElement){da++;x=x.parentElement;}
        x=b; while(x&&x.parentElement){db++;x=x.parentElement;}
        return da-db;
      });
      var block=candidates[0];
      while(block.parentElement && block.parentElement!==modal && block.parentElement!==stay.parentElement){
        if(block.parentElement.id && /hotel/i.test(block.parentElement.id)) block=block.parentElement;
        else break;
      }

      /* Keep it inside the Stay & Health section whenever possible. */
      if(block.parentElement!==stay){
        stay.appendChild(block);
      }
      block.setAttribute('data-exploreup-hotel-placement','districtStay');
    }catch(e){}
  }

  function mount(){
    try{
      if(window.ExploreUPHotels && typeof window.ExploreUPHotels.mount === 'function'){
        window.ExploreUPHotels.mount();
      }
    }catch(e){}
    [0,60,180,400,800].forEach(function(ms){ setTimeout(placeHotelBlock,ms); });
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
