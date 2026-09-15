/* ExploreUP — targeted district image restoration + Travel Ideas slider.
 * District fix: only the four requested district cards are changed.
 * Travel Ideas is converted from vertical scrolling to a horizontal slider.
 * All other district cards remain untouched.
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
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
      img.setAttribute('data-exploreup-restored-district-image', cityName);
    });
  }

  function setupTravelIdeasSlider(){
    const headings = Array.from(document.querySelectorAll('h2,h3,h4,.section-title'));
    const title = headings.find(el => el.textContent.trim().toLowerCase() === 'travel ideas');
    if (!title) return;

    const section = title.closest('section') || title.parentElement;
    if (!section || section.dataset.exploreupTravelSlider === '1') return;

    const cards = Array.from(section.querySelectorAll('.gem'));
    if (cards.length < 2) return;

    let track = cards[0].parentElement;
    if (!track) return;

    section.dataset.exploreupTravelSlider = '1';
    track.classList.add('exploreup-travel-track');
    track.style.display = 'flex';
    track.style.flexWrap = 'nowrap';
    track.style.overflowX = 'auto';
    track.style.scrollBehavior = 'smooth';
    track.style.scrollSnapType = 'x mandatory';
    track.style.scrollbarWidth = 'none';
    track.style.gap = '16px';
    track.style.paddingBottom = '8px';
    track.style.overscrollBehaviorX = 'contain';
    cards.forEach(card => {
      card.style.flex = '0 0 min(82vw, 360px)';
      card.style.scrollSnapAlign = 'start';
    });

    const controls = document.createElement('div');
    controls.className = 'exploreup-travel-controls';
    controls.style.display = 'flex';
    controls.style.justifyContent = 'flex-end';
    controls.style.gap = '8px';
    controls.style.margin = '0 0 12px';

    const makeButton = (label, direction) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('aria-label', direction < 0 ? 'Previous travel idea' : 'Next travel idea');
      b.style.width = '40px';
      b.style.height = '40px';
      b.style.borderRadius = '50%';
      b.style.border = '1px solid #cbd5e1';
      b.style.background = '#fff';
      b.style.cursor = 'pointer';
      b.style.fontSize = '20px';
      b.addEventListener('click', () => {
        track.scrollBy({left: direction * Math.max(track.clientWidth * 0.82, 280), behavior:'smooth'});
      });
      return b;
    };

    controls.appendChild(makeButton('‹', -1));
    controls.appendChild(makeButton('›', 1));
    title.parentNode.insertBefore(controls, title.nextSibling);

    const style = document.createElement('style');
    style.textContent = '.exploreup-travel-track::-webkit-scrollbar{display:none}.exploreup-travel-track>.gem{min-width:0}@media(min-width:900px){.exploreup-travel-track>.gem{flex-basis:320px}}';
    document.head.appendChild(style);
  }

  function applyAll(){
    applyDistrictImages();
    setupTravelIdeasSlider();
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
    setTimeout(() => { queued = false; applyAll(); }, 150);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src','class']
  });
})();
