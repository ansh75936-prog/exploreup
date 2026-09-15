/* ExploreUP — targeted district image restoration + Travel Ideas slider. */
(function(){
  'use strict';

  const districtImageMap = {
    'Jhansi': './images.jpeg?v=20260915',
    'Prayagraj': './images (1).jpeg?v=20260915',
    'Ayodhya': './images (2).jpeg?v=20260915',
    'Gorakhpur': './images (3).jpeg?v=20260915'
  };

  const travelImageMap = {
    'Ayodhya Spiritual Trip': './images (2).jpeg?v=20260915',
    'Lucknow Heritage Day': './images/lucknow.jpg?v=20260915'
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

  function applyTravelImages(){
    document.querySelectorAll('#travel .trail').forEach(card => {
      const heading = card.querySelector('h3');
      if (!heading) return;
      const title = heading.textContent.trim();
      const src = travelImageMap[title];
      if (!src) return;
      card.style.backgroundImage = `url("${src}")`;
      card.setAttribute('data-exploreup-travel-image', title);
    });
  }

  function setupTravelIdeasSlider(){
    const section = document.querySelector('#travel');
    if (!section || section.dataset.exploreupTravelSlider === '1') return;

    const track = section.querySelector('.trails');
    const cards = track ? Array.from(track.querySelectorAll('.trail')) : [];
    if (!track || cards.length < 2) return;

    section.dataset.exploreupTravelSlider = '1';
    track.classList.add('exploreup-travel-track');
    track.style.display = 'flex';
    track.style.flexWrap = 'nowrap';
    track.style.overflowX = 'auto';
    track.style.scrollBehavior = 'smooth';
    track.style.scrollSnapType = 'x mandatory';
    track.style.scrollbarWidth = 'none';
    track.style.gap = '16px';
    track.style.padding = '2px 2px 10px';
    track.style.overscrollBehaviorX = 'contain';

    cards.forEach(card => {
      card.style.flex = '0 0 min(82vw, 420px)';
      card.style.scrollSnapAlign = 'start';
    });

    const heading = section.querySelector('.sectionhead');
    const controls = document.createElement('div');
    controls.className = 'exploreup-travel-controls';
    controls.style.display = 'flex';
    controls.style.justifyContent = 'flex-end';
    controls.style.gap = '8px';
    controls.style.margin = '0 0 12px';

    function makeButton(label, direction){
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('aria-label', direction < 0 ? 'Previous travel idea' : 'Next travel idea');
      b.style.width = '42px';
      b.style.height = '42px';
      b.style.borderRadius = '50%';
      b.style.border = '1px solid #cbd5e1';
      b.style.background = '#fff';
      b.style.cursor = 'pointer';
      b.style.fontSize = '22px';
      b.style.fontWeight = '800';
      b.addEventListener('click', () => {
        track.scrollBy({
          left: direction * Math.max(track.clientWidth * 0.82, 300),
          behavior: 'smooth'
        });
      });
      return b;
    }

    controls.appendChild(makeButton('‹', -1));
    controls.appendChild(makeButton('›', 1));
    if (heading) heading.appendChild(controls);

    const style = document.createElement('style');
    style.textContent = `
      .exploreup-travel-track::-webkit-scrollbar{display:none}
      .exploreup-travel-track>.trail{min-width:0}
      @media(min-width:900px){.exploreup-travel-track>.trail{flex-basis:420px}}
    `;
    document.head.appendChild(style);
  }

  function applyAll(){
    applyDistrictImages();
    applyTravelImages();
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
    setTimeout(() => {
      queued = false;
      applyAll();
    }, 150);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src','class','style']
  });
})();
