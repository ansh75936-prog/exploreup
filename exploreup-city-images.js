/* ExploreUP — local image correction layer for city cards + Travel Ideas cards. */
(function(){
  'use strict';

  const imageMap = {
    jhansi: './images (1).jpeg',
    prayagraj: './images (2).jpeg',
    ayodhya: './images (3).jpeg',
    gorakhpur: './images.jpeg',
    varanasi: './images/varanasi.jpg',
    banaras: './images/varanasi.jpg',
    lucknow: './images/lucknow.jpg'
  };

  function getKey(text){
    const value = String(text || '').toLowerCase();
    if (/\bbanaras\b|\bvaranasi\b/.test(value)) return 'varanasi';
    if (/\blucknow\b/.test(value)) return 'lucknow';
    if (/\bayodhya\b/.test(value)) return 'ayodhya';
    if (/\bjhansi\b/.test(value)) return 'jhansi';
    if (/\bprayagraj\b/.test(value)) return 'prayagraj';
    if (/\bgorakhpur\b/.test(value)) return 'gorakhpur';
    return null;
  }

  function applyCards(){
    document.querySelectorAll('.city, .trail').forEach(card => {
      const key = getKey(card.innerText || card.textContent || card.getAttribute('data-city'));
      if (!key) return;
      const img = card.querySelector('img');
      const src = imageMap[key];
      if (!src) return;

      if (img) {
        if (img.getAttribute('src') !== src) img.src = src;
        img.setAttribute('data-exploreup-local-city-image', key);
      }

      // Travel Idea cards use CSS background images rather than <img> tags.
      if (card.classList.contains('trail')) {
        card.style.backgroundImage = 'linear-gradient(transparent,#06162ddd),url("' + src.replace(/"/g, '\\"') + '")';
        card.setAttribute('data-exploreup-local-city-image', key);
      }
    });
  }

  function applyDistrictProfileImage(){
    const modal = document.getElementById('modal');
    if (!modal) return;
    const key = getKey(modal.innerText || modal.textContent || '');
    if (!key) return;
    const src = imageMap[key];
    const hero = modal.querySelector('.modalhero');
    if (hero) hero.style.backgroundImage = 'linear-gradient(90deg,rgba(3,20,41,.18),rgba(3,20,41,.18)),url("' + src.replace(/"/g, '\\"') + '")';
  }

  function applyAll(){
    try { applyCards(); applyDistrictProfileImage(); }
    catch(e){ console.warn('ExploreUP image correction warning:', e); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyAll, {once:true});
  else applyAll();

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; applyAll(); }, 100);
  }).observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['style','src','class']});
})();
