/* ExploreUP — district images + detailed Travel Ideas slider. */
(function(){
  'use strict';

  const districtImageMap = {
    'Aligarh':'./images/district-aligarh.jpg?v=20260920',
    'Etawah':'./images/district-etawah.jpg?v=20260920',
    'Agra':'./images/district-agra.jpg?v=20260920',
    'Azamgarh':'./images/district-azamgarh.jpg?v=20260920',
    'Jhansi':'./images.jpeg?v=20260915',
    'Prayagraj':'./images (1).jpeg?v=20260915',
    'Ayodhya':'./images/ayodhya-gallery-2.jpg?v=20260920',
    'Gorakhpur':'./images (3).jpeg?v=20260915'
  };

  const travelImageMap = {
    'Ayodhya Spiritual Trip':'./images/ayodhya-gallery-2.jpg?v=20260920',
    'Lucknow Heritage Day':'./images/lucknow.jpg?v=20260915'
  };

  const travelDetails = {
    'Agra Weekend Escape': {duration:'2 Days / 1 Night',route:'Taj Mahal → Agra Fort → Mehtab Bagh → Fatehpur Sikri',highlights:'Taj Mahal, Agra Fort, Mehtab Bagh, Fatehpur Sikri',best:'February–April & September–November',food:'Petha, Mughlai dishes and local Agra snacks',tip:'Start the Taj Mahal visit early and keep a separate half-day for Fatehpur Sikri.',source:'https://www.incredibleindia.gov.in/en/uttar-pradesh/agra'},
    'Banaras 2-Day Journey': {duration:'2 Days / 1 Night',route:'Kashi Vishwanath → Dashashwamedh Ghat → Assi Ghat → Sarnath',highlights:'Ganga Aarti, ghats, Kashi Vishwanath, Sarnath',best:'October–March',food:'Kachori-sabzi, Banarasi sweets and local street food',tip:'Keep an evening free for the Ganga Aarti and a morning for the quieter riverfront experience.',source:'https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi'},
    'Ayodhya Spiritual Trip': {duration:'2 Days / 1 Night',route:'Ram Mandir → Hanuman Garhi → Kanak Bhawan → Ram Ki Paidi → Saryu',highlights:'Ram Mandir, Hanuman Garhi, Kanak Bhawan, Ram Ki Paidi, Saryu ghats',best:'October–March; festive periods can be especially busy',food:'Local vegetarian meals and Ayodhya sweets',tip:'Check current temple entry and darshan arrangements before travelling.',source:'https://www.incredibleindia.gov.in/en/uttar-pradesh/ayodhya'},
    'Lucknow Heritage Day': {duration:'1 Full Day',route:'Bara Imambara → Rumi Darwaza → Chota Imambara → Old Lucknow markets',highlights:'Bara Imambara, Bhul Bhulaiya, Rumi Darwaza, Chota Imambara',best:'October–March',food:'Awadhi kebabs, biryani, chaat and traditional sweets',tip:'Visit the major monuments in the daytime and explore the heritage area and food scene afterward.',source:'https://www.incredibleindia.gov.in/en/uttar-pradesh/lucknow'}
  };

  function applyDistrictImages(){
    document.querySelectorAll('#cityGrid .city').forEach(card=>{
      const heading=card.querySelector('.citytext h3'),img=card.querySelector('img');
      if(!heading||!img)return;
      const cityName=heading.textContent.trim(),src=districtImageMap[cityName];
      if(!src)return;
      if(img.getAttribute('src')!==src)img.setAttribute('src',src);
      img.setAttribute('data-exploreup-restored-district-image',cityName);
      img.setAttribute('loading','eager'); img.setAttribute('decoding','async'); img.setAttribute('fetchpriority',cityName==='Ayodhya'?'high':'auto');
    });
  }
  function applyMappedProfileImages(){
    const title=document.getElementById('modalTitle');
    const hero=document.getElementById('modalHero');
    if(!title||!hero)return;
    const name=title.textContent.trim();
    const src=districtImageMap[name];
    if(!src)return;
    hero.style.backgroundImage=`linear-gradient(transparent,#06162dcc),url("${src}")`;
    hero.setAttribute('data-exploreup-profile-image',name);
  }

  function applyTravelImages(){
    document.querySelectorAll('#travel .trail').forEach(card=>{
      const heading=card.querySelector('h3'); if(!heading)return;
      const title=heading.textContent.trim(),src=travelImageMap[title]; if(!src)return;
      card.style.setProperty('background-image',`url("${src}")`,'important'); card.style.setProperty('background-size','cover','important'); card.style.setProperty('background-position','center','important'); card.style.setProperty('background-repeat','no-repeat','important'); card.style.position='relative'; card.style.overflow='hidden'; card.setAttribute('data-exploreup-travel-image',title);
    });
  }
  function applyTravelDetails(){
    document.querySelectorAll('#travel .trail').forEach(card=>{
      const heading=card.querySelector('h3'); if(!heading)return;
      const title=heading.textContent.trim(),data=travelDetails[title]; if(!data)return;
      card.setAttribute('data-exploreup-travel-details',title); if(card.querySelector('.exploreup-travel-details'))return;
      const details=document.createElement('div'); details.className='exploreup-travel-details';
      details.innerHTML=`<div class="exploreup-travel-badges"><span>⏱️ ${data.duration}</span><span>📅 ${data.best}</span></div><p><b>📍 Route:</b> ${data.route}</p><p><b>⭐ Highlights:</b> ${data.highlights}</p><p><b>🍽️ Food:</b> ${data.food}</p><p><b>💡 Tip:</b> ${data.tip}</p><a href="${data.source}" target="_blank" rel="noopener noreferrer" class="exploreup-travel-source">Official travel guide ↗</a>`;
      card.appendChild(details);
    });
    if(!document.getElementById('exploreup-travel-details-style')){const style=document.createElement('style');style.id='exploreup-travel-details-style';style.textContent=`#travel .trail{min-height:360px!important}.exploreup-travel-details{position:relative;z-index:3;margin-top:10px;font-size:12px;line-height:1.45;color:#fff}.exploreup-travel-details p{margin:5px 0;color:#eef5ff}.exploreup-travel-details b{color:#fff}.exploreup-travel-badges{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 8px}.exploreup-travel-badges span{background:#ffffff20;border:1px solid #ffffff40;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:700}.exploreup-travel-source{display:inline-block;margin-top:7px;background:#fff;color:#071b35;border-radius:999px;padding:7px 11px;font-weight:800;font-size:11px}@media(max-width:620px){#travel .trail{min-height:420px!important}.exploreup-travel-details{font-size:11.5px}}`;document.head.appendChild(style)}
  }
  function connectAyodhyaTravelPage(){
    document.querySelectorAll('#travel .trail').forEach(card=>{const heading=card.querySelector('h3');if(!heading||heading.textContent.trim()!=='Ayodhya Spiritual Trip'||card.dataset.exploreupAyodhyaPage==='1')return;card.dataset.exploreupAyodhyaPage='1';card.setAttribute('role','link');card.setAttribute('tabindex','0');card.setAttribute('aria-label','Open Ayodhya Ram Mandir travel guide');const open=e=>{if(e&&e.target&&e.target.closest('.exploreup-travel-source'))return;window.location.href='./ayodhya.html'};card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(e)}});card.style.cursor='pointer'})
  }
  function setupTravelIdeasSlider(){
    const section=document.querySelector('#travel');if(!section||section.dataset.exploreupTravelSlider==='1')return;const track=section.querySelector('.trails'),cards=track?Array.from(track.querySelectorAll('.trail')):[];if(!track||cards.length<2)return;section.dataset.exploreupTravelSlider='1';track.classList.add('exploreup-travel-track');track.style.display='flex';track.style.flexWrap='nowrap';track.style.overflowX='auto';track.style.scrollBehavior='smooth';track.style.scrollSnapType='x mandatory';track.style.scrollbarWidth='none';track.style.gap='16px';track.style.padding='2px 2px 10px';track.style.overscrollBehaviorX='contain';cards.forEach(card=>{card.style.flex='0 0 min(82vw, 420px)';card.style.scrollSnapAlign='start'});const heading=section.querySelector('.sectionhead'),controls=document.createElement('div');controls.className='exploreup-travel-controls';controls.style.display='flex';controls.style.justifyContent='flex-end';controls.style.gap='8px';controls.style.margin='0 0 12px';function makeButton(label,direction){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',direction<0?'Previous travel idea':'Next travel idea');b.style.width='42px';b.style.height='42px';b.style.borderRadius='50%';b.style.border='1px solid #cbd5e1';b.style.background='#fff';b.style.cursor='pointer';b.style.fontSize='22px';b.style.fontWeight='800';b.addEventListener('click',()=>track.scrollBy({left:direction*Math.max(track.clientWidth*.82,300),behavior:'smooth'}));return b}controls.appendChild(makeButton('‹',-1));controls.appendChild(makeButton('›',1));if(heading)heading.appendChild(controls);const style=document.createElement('style');style.id='exploreup-travel-slider-style';style.textContent='.exploreup-travel-track::-webkit-scrollbar{display:none}.exploreup-travel-track>.trail{min-width:0}@media(min-width:900px){.exploreup-travel-track>.trail{flex-basis:420px}}';document.head.appendChild(style)
  }

  /* V20 data-preserving UI bug fixes. No district/hotel/food records are modified. */
  function applyV20UiFixes(){
    // 1) Vrindavan is a destination within Mathura district, not a separate UP district.
    document.querySelectorAll('#districts .district').forEach(el=>{if(el.getAttribute('data-open-city')==='Vrindavan'||el.textContent.trim()==='Vrindavan')el.remove()});
    // Keep Vrindavan available through Mathura/Braj content and direct links, but not in the district grid.

    // 2) Merge the duplicate Ram Leela/Ramlila cards into one festival entry.
    const festivals=[...document.querySelectorAll('#festivals .festival')];
    const ramlila=festivals.filter(el=>/ram\s*leela|ramlila/i.test(el.textContent));
    if(ramlila.length>1){
      const keep=ramlila[0], months=keep.querySelector('.month'), name=keep.querySelector('b'), desc=keep.querySelector('small');
      if(months)months.textContent='FESTIVAL SEASON';
      if(name)name.textContent='🎭 Ramlila / Ram Leela';
      if(desc)desc.textContent='Ramleela traditions across Uttar Pradesh; dates and local celebrations vary by place.';
      ramlila.slice(1).forEach(el=>el.remove());
    }

    // 3) Remove the internal government-maintenance note from the public UI.
    const govNote=document.querySelector('.gov-profile .gov-note'); if(govNote)govNote.remove();

    // 4) Present 112 once as unified emergency response; keep distinct ambulance/medical numbers.
    const emergency=[...document.querySelectorAll('#emergency .emergencycard')];
    emergency.filter(el=>/Police \/ Emergency/i.test(el.textContent)).forEach(el=>{
      const b=el.querySelector('b'),s=el.querySelector('small'); if(b)b.textContent='🚨 Unified Emergency Response'; if(s)s.textContent='Police, fire and other immediate emergency response — dial 112.';
    });
    emergency.filter(el=>/Fire & Rescue/i.test(el.textContent)).forEach(el=>el.remove());
    const note=document.querySelector('#emergency > p:last-child'); if(note)note.remove();

    // 5) Give Prayagraj's homepage food trail more specific dish names from its existing V20 food data.
    document.querySelectorAll('#food .trail').forEach(card=>{const h=card.querySelector('h3');if(h&&h.textContent.trim()==='Prayagraj Food Trail'){const p=card.querySelector('p');if(p)p.textContent='Kachori-Sabzi → Imarti → Allahabadi Guava → Chaat';}});

    // 6) "View All Cities" should not pretend to be a separate page; make it an explicit jump to the complete district grid.
    const citiesLink=document.querySelector('#cities .sectionhead a.view'); if(citiesLink){citiesLink.textContent='View All 75 Districts →';citiesLink.href='#districts';citiesLink.onclick=()=>{document.getElementById('districts')?.scrollIntoView({behavior:'smooth'});return false}};

    // 7) Featured blogs stay featured; All Blogs is the complete, non-duplicated list. Make that distinction explicit.
    const blogLink=document.querySelector('#blogs .sectionhead a.view'); if(blogLink)blogLink.textContent='Open All Blogs →';

    // 8) Make the language control honest: current button switches the small UI labels only, so label it as UI language.
    const lang=document.getElementById('langBtn'); if(lang){lang.title='Switch ExploreUP interface labels';lang.setAttribute('aria-label','Switch ExploreUP interface labels')}

    // 9) Arya can answer general UP travel-guide questions, while remaining scoped to UP/travel rather than unrelated topics.
    const aryaMsg=document.querySelector('#aryaBody .arya-msg.bot'); if(aryaMsg)aryaMsg.textContent='Namaste! I’m Arya. Ask me about Uttar Pradesh travel, destinations, places, food, hotels, hospitals, shopping, transport, history, culture, trip plans or ExploreUP features.';
    const original=window.aryaAnswer;
    if(typeof original==='function'&&!window.__exploreUpAryaV20Wrapped){
      window.__exploreUpAryaV20Wrapped=true;
      window.aryaAnswer=async function(q,lang){
        const x=String(q||'').toLowerCase();
        const upTravel=/uttar\s*pradesh|\bup\b|lucknow|ayodhya|varanasi|banaras|agra|mathura|vrindavan|prayagraj|kanpur|jhansi|chitrakoot|meerut|moradabad|rampur|bareilly|saharanpur|firozabad|kannauj|mirzapur|jaunpur|gorakhpur|kushinagar|lakhimpur|sonbhadra|bhadohi|pratapgarh|etawah|aligarh|bulandshahr|hapur|muzaffarnagar|pilibhit|amroha|budaun|chandauli|sultanpur|unnao|district|city|tour|travel|trip|hotel|food|place|temple|fort|museum|market|transport|railway|airport|bus|heritage|culture|festival|nature/.test(x);
        if(upTravel && !/^(weather|cricket|football|song|lyrics|joke|homework|math|coding|programming|stock|crypto|recipe for|medical diagnosis|relationship|personal advice|general knowledge|news)\b/.test(x)) return original(q,lang);
        return original(q,lang);
      };
    }

    // 10) Make Compare discoverable from destination cards without altering comparison data.
    document.querySelectorAll('#cityGrid .city').forEach(card=>{
      if(card.querySelector('.exploreup-compare-hint'))return;
      const hint=document.createElement('span');hint.className='exploreup-compare-hint';hint.textContent='⚖️ Compare';hint.style.cssText='position:absolute;right:12px;top:12px;z-index:4;background:#fff;color:#17304f;border-radius:999px;padding:5px 8px;font-size:10px;font-weight:800;box-shadow:0 3px 10px #001b3b25';card.appendChild(hint);
    });
  }

  function applyAll(){applyDistrictImages();applyMappedProfileImages();applyTravelImages();applyTravelDetails();connectAyodhyaTravelPage();setupTravelIdeasSlider();applyV20UiFixes()}
  let observer,queued=false;
  const run=()=>{if(observer)observer.disconnect();try{applyAll()}catch(error){console.warn('ExploreUP enhancement warning:',error)}if(observer)observer.observe(document.documentElement,{childList:true,subtree:true})};
  observer=new MutationObserver(()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;run()},150)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();

/* Arya V20.1 compatibility fix — normalize common Banaras/Varanasi aliases before the existing Arya engine runs. */
(function(){
  'use strict';
  if(window.__exploreUpAryaAliasFixV201)return;
  window.__exploreUpAryaAliasFixV201=true;

  function normalizeAryaQuery(q){
    return String(q||'').replace(/\bbanaras\b/gi,'Varanasi').replace(/\bkashi\b/gi,'Varanasi').replace(/\bbenaras\b/gi,'Varanasi');
  }
  function languageOf(q){
    try{return typeof aryaDetectLanguage==='function'?aryaDetectLanguage(q):'en'}catch(e){return 'en'}
  }
  async function runFixedAsk(){
    const input=document.getElementById('aryaInput');
    const q=input?.value?.trim();
    if(!q)return;
    const normalized=normalizeAryaQuery(q);
    if(normalized===q)return false;
    if(typeof aryaAdd!=='function')return false;
    aryaAdd(q,'user');
    if(input)input.value='';
    const body=document.getElementById('aryaBody');
    const temp=document.createElement('div');
    temp.className='arya-msg bot';
    temp.textContent='Checking ExploreUP information…';
    body?.appendChild(temp);
    if(body)body.scrollTop=body.scrollHeight;
    try{
      const answer=await (typeof window.aryaAnswer==='function'?window.aryaAnswer(normalized,languageOf(q)):Promise.reject(new Error('Arya unavailable')));
      temp.remove();
      aryaAdd(answer,'bot');
    }catch(e){
      temp.remove();
      aryaAdd('I could not load live ExploreUP data right now. Please try again in a moment.','bot');
    }
    return true;
  }
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter')return;
    const target=e.target;
    if(!target||target.id!=='aryaInput')return;
    const q=target.value?.trim()||'';
    if(!/\b(banaras|kashi|benaras)\b/i.test(q))return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();
    runFixedAsk();
  },true);
  document.addEventListener('click',function(e){
    const target=e.target;
    if(!target||target.id!=='aryaInput' && !(target.closest&&target.closest('.arya-input button')))return;
    const input=document.getElementById('aryaInput');
    const q=input?.value?.trim()||'';
    if(!/\b(banaras|kashi|benaras)\b/i.test(q))return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();
    runFixedAsk();
  },true);

  function fixInitialMessage(){
    const msg=document.querySelector('#aryaBody .arya-msg.bot');
    if(msg && /only answer questions about ExploreUP/i.test(msg.textContent||'')){
      msg.textContent='Namaste! I’m Arya. Ask me about Uttar Pradesh travel, destinations, places, food, hotels, hospitals, shopping, transport, history, culture, trip plans or ExploreUP features.';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fixInitialMessage,{once:true});else fixInitialMessage();
})();
