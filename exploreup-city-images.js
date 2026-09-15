/* ExploreUP — targeted district image restoration.
 * Only the four requested district cards are changed here.
 * Travel Ideas and all other district cards are left untouched.
 */
(function(){
  'use strict';

  const districtImageMap = {
    'Jhansi': './images.jpeg?v=20260915',
    'Prayagraj': './images (1).jpeg?v=20260915',
    'Ayodhya': './images (2).jpeg?v=20260915',
    'Gorakhpur': './images (3).jpeg?v=20260915'
  };

  function applyDistrictImages(){
    document.querySelectorAll('#cityGrid .city').forEach(card => {
      const heading = card.querySelector('.citytext h3');
      const img = card.querySelector('img');
      if (!heading || !img) return;

      const cityName = heading.textContent.trim();
      const src = districtImageMap[cityName];
      if (!src) return;

      if (img.getAttribute('src') !== src) {
        img.setAttribute('src', src);
      }
      img.setAttribute('data-exploreup-restored-district-image', cityName);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDistrictImages, {once:true});
  } else {
    applyDistrictImages();
  }

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      applyDistrictImages();
    }, 100);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src','class']
  });
})();
