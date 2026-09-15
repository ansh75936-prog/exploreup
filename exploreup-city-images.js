/* ExploreUP — targeted district image restoration + Travel Ideas slider. */
(function(){
  'use strict';
  const districtImageMap = {'Jhansi':'./images.jpeg?v=20260915','Prayagraj':'./images (1).jpeg?v=20260915','Ayodhya':'./images/ayodhya-gallery-2.jpg?v=20260920','Gorakhpur':'./images (3).jpeg?v=20260915'};
  const travelImageMap = {'Ayodhya Spiritual Trip':'./images/ayodhya-gallery-2.jpg?v=20260920','Lucknow Heritage Day':'./images/lucknow.jpg?v=20260915'};

  function applyDistrictImages(){
    document.querySelectorAll('#cityGrid .city').forEach(card=>{
      const heading=card.querySelector('.citytext h3'),img=card.querySelector('img');
      if(!heading||!img)return;
      const cityName=heading.textContent.trim(),src=districtImageMap[cityName];
      if(!src)return;
      if(img.getAttribute('src')!==src)img.setAttribute('src',src);
      img.setAttribute('data-exploreup-restored-district-image',cityName);
      img.setAttribute('loading','eager');
      img.setAttribute('decoding','async');
      img.setAttribute('fetchpriority',cityName==='Ayodhya'?'high':'auto');
    });
  }

  function applyTravelImages(){
    document.querySelectorAll('#travel .trail').forEach(card=>{
      const heading=card.querySelector('h3');
      if(!heading)return;
      const title=heading.textContent.trim(),src=travelImageMap[title];
      if(!src)return;
      card.style.setProperty('background-image',`url("${src}")`,'important');
      card.style.setProperty('background-size','cover','important');
      card.style.setProperty('background-position','center','important');
      card.style.setProperty('background-repeat','no-repeat','important');
      card.style.position='relative';
      card.style.overflow='hidden';
      card.setAttribute('data-exploreup-travel-image',title);
    });
  }

  function connectAyodhyaTravelPage(){
    document.querySelectorAll('#travel .trail').forEach(card=>{
      const heading=card.querySelector('h3');
      if(!heading||heading.textContent.trim()!=='Ayodhya Spiritual Trip'||card.dataset.exploreupAyodhyaPage==='1')return;
      card.dataset.exploreupAyodhyaPage='1';
      card.setAttribute('role','link');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-label','Open Ayodhya Ram Mandir travel guide');
      const open=()=>{window.location.href='./ayodhya.html';};
      card.addEventListener('click',open);
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
      card.style.cursor='pointer';
    });
  }

  function setupTravelIdeasSlider(){
    const section=document.querySelector('#travel');
    if(!section||section.dataset.exploreupTravelSlider==='1')return;
    const track=section.querySelector('.trails'),cards=track?Array.from(track.querySelectorAll('.trail')):[];
    if(!track||cards.length<2)return;
    section.dataset.exploreupTravelSlider='1';
    track.classList.add('exploreup-travel-track');
    track.style.display='flex';
    track.style.flexWrap='nowrap';
    track.style.overflowX='auto';
    track.style.scrollBehavior='smooth';
    track.style.scrollSnapType='x mandatory';
    track.style.scrollbarWidth='none';
    track.style.gap='16px';
    track.style.padding='2px 2px 10px';
    track.style.overscrollBehaviorX='contain';
    cards.forEach(card=>{card.style.flex='0 0 min(82vw, 420px)';card.style.scrollSnapAlign='start';});
    const heading=section.querySelector('.sectionhead'),controls=document.createElement('div');
    controls.className='exploreup-travel-controls';
    controls.style.display='flex';controls.style.justifyContent='flex-end';controls.style.gap='8px';controls.style.margin='0 0 12px';
    function makeButton(label,direction){
      const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',direction<0?'Previous travel idea':'Next travel idea');
      b.style.width='42px';b.style.height='42px';b.style.borderRadius='50%';b.style.border='1px solid #cbd5e1';b.style.background='#fff';b.style.cursor='pointer';b.style.fontSize='22px';b.style.fontWeight='800';
      b.addEventListener('click',()=>track.scrollBy({left:direction*Math.max(track.clientWidth*.82,300),behavior:'smooth'}));return b;
    }
    controls.appendChild(makeButton('‹',-1));controls.appendChild(makeButton('›',1));
    if(heading)heading.appendChild(controls);
    const style=document.createElement('style');
    style.textContent='.exploreup-travel-track::-webkit-scrollbar{display:none}.exploreup-travel-track>.trail{min-width:0}@media(min-width:900px){.exploreup-travel-track>.trail{flex-basis:420px}}';
    document.head.appendChild(style);
  }

  function applyAll(){applyDistrictImages();applyTravelImages();connectAyodhyaTravelPage();setupTravelIdeasSlider();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyAll,{once:true});else applyAll();
  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;applyAll();},150);}).observe(document.documentElement,{childList:true,subtree:true});
})();