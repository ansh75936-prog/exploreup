/* ExploreUP — local city image mapping for the four newly uploaded city photos. */
(function(){
  'use strict';
  const imageMap = {
    'jhansi': './images (3).jpeg',
    'prayagraj': './images.jpeg',
    'ayodhya': './images (1).jpeg',
    'gorakhpur': './images (2).jpeg'
  };

  function applyCityImages(){
    const cards = document.querySelectorAll('.city');
    cards.forEach(card => {
      const text = (card.innerText || card.textContent || '').trim().toLowerCase();
      const key = Object.keys(imageMap).find(k => text.includes(k));
      if (!key) return;
      const img = card.querySelector('img');
      if (!img) return;
      const src = imageMap[key];
      if (img.getAttribute('src') !== src) img.src = src;
      img.setAttribute('data-exploreup-local-city-image', key);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCityImages, {once:true});
  } else applyCityImages();

  new MutationObserver(applyCityImages).observe(document.documentElement, {childList:true, subtree:true});
})();
