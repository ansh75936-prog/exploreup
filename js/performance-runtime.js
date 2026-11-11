(function(){
  'use strict';
  // Keep off-screen media cheap; visible/interactive media remains unchanged.
  const markMedia=()=>{
    document.querySelectorAll('img:not([loading]),video:not([preload])').forEach(el=>{
      if(el.closest('.hero,.modalhero,[data-critical-media]')) return;
      if(el.tagName==='IMG'){el.loading='lazy';el.decoding='async';}
      else if(el.tagName==='VIDEO'){el.preload='metadata';}
    });
  };
  if('requestIdleCallback' in window) requestIdleCallback(markMedia,{timeout:1200});
  else setTimeout(markMedia,300);
})();
