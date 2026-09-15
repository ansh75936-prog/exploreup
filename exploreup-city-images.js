/* ExploreUP — local city image mapping for the four newly uploaded city photos. */
(function(){
  'use strict';
  const imageMap = {
    'jhansi': './images (3).jpeg',
    'prayagraj': './images.jpeg',
    'ayodhya': './images (1).jpeg',
    'gorakhpur': './images (2).jpeg'
  };

  function getCityKey(text){
    const value = (text || '').trim().toLowerCase();
    return Object.keys(imageMap).find(k => value.includes(k)) || null;
  }

  function applyCityImages(){
    document.querySelectorAll('.city').forEach(card => {
      const key = getCityKey(card.innerText || card.textContent);
      if (!key) return;
      const img = card.querySelector('img');
      if (!img) return;
      const src = imageMap[key];
      if (img.getAttribute('src') !== src) img.src = src;
      img.setAttribute('data-exploreup-local-city-image', key);
    });
  }

  function applyDistrictProfileImage(){
    const modal = document.getElementById('modal');
    if (!modal) return;

    const modalText = modal.innerText || modal.textContent || '';
    const key = getCityKey(modalText);
    if (!key) return;

    const src = imageMap[key];
    const hero = modal.querySelector('.modalhero');
    if (hero) {
      hero.style.backgroundImage = 'linear-gradient(90deg,rgba(3,20,41,.18),rgba(3,20,41,.18)), url("' + src.replace(/"/g, '\\"') + '")';
      hero.setAttribute('data-exploreup-local-city-image', key);
    }

    const heroImages = modal.querySelectorAll('.modalhero img, [data-exploreup-modal-hero-image]');
    heroImages.forEach(img => {
      if (img.getAttribute('src') !== src) img.src = src;
      img.setAttribute('data-exploreup-local-city-image', key);
    });
  }

  function applyAll(){
    applyCityImages();
    applyDistrictProfileImage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll, {once:true});
  } else applyAll();

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      applyAll();
    }, 100);
  }).observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['style','class']});
})();
