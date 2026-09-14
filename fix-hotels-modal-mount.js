/* ExploreUP Hotels & Stays — mount fix for dynamically opened city/district modal. */
(function(){
  'use strict';
  function mount(){
    try{
      if(window.ExploreUPHotels && typeof window.ExploreUPHotels.mount === 'function'){
        window.ExploreUPHotels.mount();
      }
    }catch(e){}
  }
  function remountAfterInteraction(){
    mount();
    [50,150,350,700].forEach(function(ms){ setTimeout(mount,ms); });
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
})();
