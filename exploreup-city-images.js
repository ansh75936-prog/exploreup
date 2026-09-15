/* ExploreUP — verified local/official image correction layer for city cards + Travel Ideas cards. */
(function(){
  'use strict';

  const imageMap = {
    // Keep the original uploaded-city mapping intact.
    jhansi: './images (3).jpeg',
    prayagraj: './images.jpeg',
    gorakhpur: './images (2).jpeg',

    // Verified city-specific images.
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
    if (/\bjhansi\b/.test(value)) return 'jhansi';
    if (/\bprayagraj\b/.test(value)) return 'prayagraj';
    if (/\bgorakhpur\b/.test(value)) return 'gorakhpur';
    return null;
  }

  function setBackground(el, value){
    if (el.style.backgroundImage !== value) el.style.backgroundImage = value;
  }

  function applyCards(){
    document.querySelectorAll('.city, .trail').forEach(card => {
      const key = getKey(card.innerText || card.textContent || card.getAttribute('data-city'));
      if (!key) return;
      const img = card.querySelector('img');
      const src = imageMap[key];
      if (!src) return;

      if (img && img.getAttribute('src') !== src) img.src = src;
      if (img && img.getAttribute('data-exploreup-local-city-image') !== key) {
        img.setAttribute('data-exploreup-local-city-image', key);
      }

      // Travel Idea cards use CSS backgrounds rather than <img> tags.
      if (card.classList.contains('trail')) {
        const background = 'linear-gradient(transparent,#06162ddd),url("' + src.replace(/"/g, '\\"') + '")';
        setBackground(card, background);
        if (card.getAttribute('data-exploreup-local-city-image') !== key) {
          card.setAttribute('data-exploreup-local-city-image', key);
        }
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
    if (hero) {
      const background = 'linear-gradient(90deg,rgba(3,20,41,.18),rgba(3,20,41,.18)),url("' + src.replace(/"/g, '\\"') + '")';
      setBackground(hero, background);
    }
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
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src','class']
  });
})();
