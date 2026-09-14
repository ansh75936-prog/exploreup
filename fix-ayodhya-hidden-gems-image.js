(function(){
  'use strict';
  const AYODHYA_IMAGE = './images (3).jpeg';
  function norm(v){ return String(v||'').toLowerCase().replace(/\s+/g,' ').trim(); }
  function fix(){
    document.querySelectorAll('img').forEach(function(img){
      const parent = img.closest('article, .card, .city, .place-card, .hidden-gem, .gem-card, .destination-card, .feature-card, div');
      const text = norm((parent && parent.innerText) || '');
      if(text.includes('hidden gems') && text.includes('ayodhya')) img.src = AYODHYA_IMAGE;
      const alt = norm(img.alt);
      if(alt.includes('ayodhya') && (text.includes('hidden') || text.includes('gem'))) img.src = AYODHYA_IMAGE;
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',fix); else fix();
  new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});
})();
