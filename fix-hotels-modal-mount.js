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
      if(block.parentElement !== stay) stay.appendChild(block);
      block.setAttribute('data-exploreup-hotel-placement','districtStay');
      block.style.display='block';
      block.style.visibility='visible';
    }catch(e){}
  }

  var pending=false;
  function scheduleMount(){
    if(pending) return;
    pending=true;
    setTimeout(function(){
      pending=false;
      try{
        if(isOpen() && window.ExploreUPHotels && typeof window.ExploreUPHotels.mount === 'function'){
          window.ExploreUPHotels.mount();
        }
      }catch(e){}
      [0,80,220,500,900].forEach(function(ms){ setTimeout(placeHotelBlock,ms); });
    },40);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',scheduleMount,{once:true});
  }else{
    scheduleMount();
  }

  document.addEventListener('click',function(){ scheduleMount(); },true);
  document.addEventListener('keydown',function(e){
    if(e.key==='Enter' || e.key===' ' || e.key==='Escape') scheduleMount();
  },true);

  var observerTimer=null;
  new MutationObserver(function(){
    if(!isOpen()) return;
    clearTimeout(observerTimer);
    observerTimer=setTimeout(function(){
      /* The modal may become visible after the click handler has already run.
         Mount again here so the hotel block is created after districtStay exists. */
      scheduleMount();
      placeHotelBlock();
    },120);
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
})();
