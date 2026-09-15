/* ExploreUP — targeted image restoration layer.
 * Only the four requested district cards are restored here.
 * All other district cards remain untouched.
 */
(function(){
  'use strict';

  const districtImageMap = {
    jhansi: './images.jpeg',
    prayagraj: './images (1).jpeg',
    ayodhya: './images (2).jpeg',
    gorakhpur: './images (3).jpeg'
  };

  const travelImageMap = {
    ayodhya: 'https://cdn.s3waas.gov.in/s3b2eb7349035754953b57a32e2841bda5/uploads/bfi_thumb/2024011750-rr7ndu9syeyofn2mpuakhttccve73crnsrq3fvz3z4.jpg',
    varanasi: './images/varanasi.jpg',
    banaras: './images/varanasi.jpg',
    lucknow: './images/lucknow.jpg'
  };

  function textKey(text, map){
    const value = String(text || '').toLowerCase();
    return Object.keys(map).find(key => new RegExp('\\b' + key + '\\b').test(value)) || null;
  }

  function applyDistrictImages(){
    document.querySelectorAll('.city').forEach(card => {
      const key = textKey(card.innerText || card.textContent || '', districtImageMap);
      if (!key) return;
      const img = card.querySelector('img');
      if (!img) return;
      const src = districtImageMap[key];
      if (img.getAttribute('src') !== src) img.src = src;
      img.setAttribute('data-exploreup-restored-district-image', key);
    });
  }

  function applyTravelIdeas(){
    document.querySelectorAll('.trail').forEach(card => {
      const key = textKey(card.innerText || card.textContent || '', travelImageMap);
      if (!key) return;
      const src = travelImageMap[key];
      const background = 'linear-gradient(transparent,#06162ddd),url("' + src.replace(/"/g, '\\"') + '")';
      if (card.style.backgroundImage !== background) card.style.backgroundImage = background;
      card.setAttribute('data-exploreup-travel-image', key);
    });
  }

  function applyAll(){
    applyDistrictImages();
    applyTravelIdeas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll, {once:true});
  } else {
    applyAll();
  }

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; applyAll(); }, 100);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style','src','class']
  });
})();
