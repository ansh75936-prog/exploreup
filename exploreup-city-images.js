/* ExploreUP — Travel Ideas image correction layer.
 * IMPORTANT: the 75 district cards already carry destination-specific images
 * in the cities dataset. This file must NOT override .city images.
 */
(function(){
  'use strict';

  // Only Travel Ideas (.trail) cards are corrected here.
  // District/city cards are intentionally left to their own dataset images.
  const travelImageMap = {
    ayodhya: 'https://cdn.s3waas.gov.in/s3b2eb7349035754953b57a32e2841bda5/uploads/bfi_thumb/2024011750-rr7ndu9syeyofn2mpuakhttccve73crnsrq3fvz3z4.jpg',
    varanasi: './images/varanasi.jpg',
    banaras: './images/varanasi.jpg',
    lucknow: './images/lucknow.jpg'
  };

  function getKey(text){
    const value = String(text || '').toLowerCase();
    if (/\bbanaras\b|\bvaranasi\b/.test(value)) return 'varanasi';
    if (/\blucknow\b/.test(value)) return 'lucknow';
    if (/\bayodhya\b/.test(value)) return 'ayodhya';
    return null;
  }

  function applyTravelIdeas(){
    document.querySelectorAll('.trail').forEach(card => {
      const key = getKey(card.innerText || card.textContent || '');
      if (!key) return;
      const src = travelImageMap[key];
      if (!src) return;
      const background = 'linear-gradient(transparent,#06162ddd),url("' + src.replace(/"/g, '\\"') + '")';
      if (card.style.backgroundImage !== background) card.style.backgroundImage = background;
      card.setAttribute('data-exploreup-travel-image', key);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTravelIdeas, {once:true});
  } else {
    applyTravelIdeas();
  }

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      applyTravelIdeas();
    }, 100);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style','class']
  });
})();
