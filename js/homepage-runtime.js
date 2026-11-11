async function syncDistrictCatalog(){
  try{
    if(!exploreSupabase) return;
    const {data,error}=await exploreSupabase.from('districts').select('name,name_hi,slug,kind,sort_order,is_active').eq('is_active',true).order('sort_order',{ascending:true});
    if(error||!Array.isArray(data)) return;
    const existing=new Set(cities.map(c=>c.name.toLowerCase()));
    data.forEach(d=>{
      if(!d.name || existing.has(d.name.toLowerCase())) return;
      cities.push({
        name:d.name,
        tag:'Uttar Pradesh district guide',
        img:'./images/india-3578009_1280.jpg',
        places:'District attractions and local experiences will be added here.',
        food:'Local food and cuisine guide.',
        shop:'Local markets, crafts and products.',
        time:'Check seasonal conditions',
        budget:'Varies by stay, food and transport',
        tip:'Check current timings, transport and local conditions before travelling.',
        about:`ExploreUP district guide for ${d.name}, Uttar Pradesh.`,
        distance:'District guide', fee:'Varies', rating:'—',
        districtKind:d.kind||'district', slug:d.slug||''
      });
      existing.add(d.name.toLowerCase());
    });
  }catch(e){ console.warn('District catalog sync failed',e); }
}

function safeOpenCityByIndex(index){
 try{
  const i=Number(index);
  if(!Number.isInteger(i)||i<0||i>=cities.length)return false;
  return safeOpenCity(cities[i].name);
 }catch(err){console.warn('ExploreUP destination index tap warning:',err);return false}
}

function safeOpenCity(name){
 try{
  const value=String(name||'').trim();
  if(!value)return false;
  const city=cities.find(c=>normalizeCityQuery(c.name)===normalizeCityQuery(value)) || cities.find(c=>normalizeCityQuery(c.name).includes(normalizeCityQuery(value)) || normalizeCityQuery(value).includes(normalizeCityQuery(c.name)));
  if(!city){console.warn('ExploreUP destination not found:',value);return false;}
  const modal=document.getElementById('modal');
  if(modal){modal.style.display='block';modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
  const title=document.getElementById('modalTitle');
  if(title)title.textContent=city.name;
  const state=document.getElementById('modalState');
  if(state)state.textContent='WELCOME TO';
  currentExploreCity=city.name;
  try{saveRecentDestination(city.name)}catch(e){console.warn('ExploreUP recent destination skipped:',e)}
  Promise.resolve().then(()=>openCity(city.name).catch(err=>console.warn('ExploreUP destination open warning:',err)));
  return true;
 }catch(err){console.warn('ExploreUP destination tap warning:',err);return false}
}
// Static district catalog: the 75 district records bundled in this HTML are the primary source.
// Supabase is optional and may enrich data later, but it must never be required to show districts.
(function ensureAll75Districts(){
  try{
    if(typeof districtServiceContacts!=='undefined'){
      const alias={'gautam buddha nagar':'Gautam Buddh Nagar'};
      const byName=new Map(cities.map(c=>[normalizeCityQuery(c.name),c]));
      Object.keys(alias).forEach(k=>{
        const c=byName.get(k);
        if(c){ c.name=alias[k]; byName.delete(k); byName.set(normalizeCityQuery(c.name),c); }
      });
      // Keep non-district destinations such as Vrindavan available for direct links,
      // but render exactly the 75 district records in the main District-wise section.
      window.__exploreUpDistrictNames=Object.keys(districtServiceContacts);
      window.__exploreUpDistrictCities=window.__exploreUpDistrictNames.map(name=>{
        const exact=byName.get(normalizeCityQuery(name));
        if(exact)return exact;
        const c={name,tag:'Uttar Pradesh district guide',img:'./images/india-3578009_1280.jpg',places:'District attractions and local experiences.',food:'Local food and cuisine guide.',shop:'Local markets, crafts and products.',time:'Check current timings',budget:'Varies',tip:'Check current timings, transport and local conditions before travelling.',about:`ExploreUP district guide for ${name}, Uttar Pradesh.`,distance:'District guide',fee:'Varies',rating:'—'};
        cities.push(c); return c;
      });
    }
  }catch(e){ console.warn('ExploreUP static 75-district catalog setup failed:',e); }
})();

function toggleAllDistricts(){
 const grid=document.getElementById('cityGrid');
 if(!grid)return false;
 const willOpen=grid.hidden || grid.getAttribute('aria-hidden')==='true';
 if(willOpen){
  try{
   renderCities();
   const cards=grid.querySelectorAll('.city');
   if(cards.length!==75){
    const status=document.getElementById('districtFilterStatus');
    if(status)status.textContent='District list could not be loaded completely. Please refresh and try again.';
    console.error('ExploreUP expected 75 district cards; rendered:',cards.length);
    return false;
   }
  }catch(error){
   console.error('ExploreUP district list render failed:',error);
   const status=document.getElementById('districtFilterStatus');
   if(status)status.textContent='Unable to load districts right now. Please refresh and try again.';
   return false;
  }
 }
 grid.hidden=!willOpen;
 grid.setAttribute('aria-hidden',String(!willOpen));
 grid.style.display=willOpen?'block':'none';
 const buttons=[...document.querySelectorAll('#euViewAll,#euViewAllFeatured')];
 buttons.forEach(btn=>{
  btn.setAttribute('aria-expanded',String(willOpen));
  btn.setAttribute('aria-controls','cityGrid');
  btn.textContent=willOpen?'Hide Districts ↑':'View All 75 Districts ↓';
 });
 if(willOpen){
  const section=document.getElementById('cities');
  if(section)section.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 }
 return true;
}
window.toggleAllDistricts=toggleAllDistricts;
function renderCities(){
 const grid=document.getElementById('cityGrid'); if(!grid)return;
 const list=(window.__exploreUpDistrictCities&&window.__exploreUpDistrictCities.length===75)?window.__exploreUpDistrictCities:cities;
 grid.innerHTML=list.map((c)=>{const i=cities.indexOf(c);const name=escapeHtml(c.name);const photo=escapeHtml(c.img||'');const imageMarkup=photo ? `<img width="1000" height="650" class="city-photo" src="${photo}" alt="${name} district attraction" loading="lazy" decoding="async" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : '';const fallbackDisplay=photo?'none':'flex';return `<div class="city" data-open-city="${name}" data-city-index="${i>=0?i:''}" role="button" tabindex="0" aria-label="Explore ${name} district">${imageMarkup}<div class="city-photo-fallback" style="display:${fallbackDisplay}" aria-hidden="true">📍<span>Discover ${name}</span></div><span class="city-badge"><span class="city-badge-dot"></span> UTTAR PRADESH</span><div class="citytext"><h3>${name}</h3><small>${escapeHtml(c.tag||'Explore local places, food and culture')}</small></div><div class="city-bottom"><span class="city-location">⌖ ${escapeHtml(c.distance||'District guide')}</span><span class="city-explore">Explore <b>→</b></span></div><div class="citymeta" aria-label="Travel information"><span class="meta">₹ ${escapeHtml(c.fee||'Varies')}</span><span class="meta rating">★ ${escapeHtml(c.rating||'—')}</span></div></div>`}).join('');
 const badge=document.getElementById('destinationCountBadge'); if(badge)badge.textContent='75 districts';
}
;

// Robust destination tap fallback: supports static district cards and dynamic city cards.
(function setupDestinationTapGuard(){
 if(window.__exploreUpTapGuardV4)return;
 window.__exploreUpTapGuardV4=true;
 const getName=(el)=>{
  if(!el)return '';
  const direct=el.getAttribute('data-open-city');
  if(direct)return direct;
  const idx=el.getAttribute('data-city-index');
  if(idx!==null && idx!==''){
   const i=Number(idx);
   if(Number.isInteger(i) && cities[i])return cities[i].name;
  }
  return '';
 };
 const openFromEvent=(e)=>{
  const target=e.target && e.target.closest ? e.target.closest('.district,.city,[data-open-city],[data-city-index]') : null;
  if(!target)return;
  const name=getName(target);
  if(!name)return;
  if(e.type==='keydown' && e.key!=='Enter' && e.key!==' ')return;
  e.preventDefault();
  e.stopPropagation();
  if(e.type==='keydown') e.stopImmediatePropagation?.();
  safeOpenCity(name);
 };
 document.addEventListener('click',openFromEvent,true);
 document.addEventListener('keydown',openFromEvent,true);
})();

function setupDistrictSearch(){
 const input=document.getElementById('districtSearchInput'), results=document.getElementById('districtSearchResults');
 if(!input||!results)return;
 input.oninput=()=>{
   const q=input.value.trim().toLowerCase().normalize('NFKC').replace(/[’']/g,"'").replace(/\\s+/g,' ');
   const cards=[...document.querySelectorAll('#modal .detail,#modal .mallcard,#modal .knowledge-card,#modal .contact-card')];
   cards.forEach(x=>x.style.display='');
   if(!q){results.style.display='none';results.innerHTML='';return;}
   const hits=[];
   cards.forEach(x=>{
     const text=x.textContent.toLowerCase();
     const ok=text.includes(q);
     x.style.display=ok?'':'none';
     if(ok)hits.push(x);
   });
   results.innerHTML=hits.length?hits.slice(0,10).map(x=>{
     const title=(x.querySelector('b,h3,h4,strong')?.textContent||x.textContent).trim().replace(/\\s+/g,' ').slice(0,140);
     return `<div class="dsr" role="button" tabindex="0">${escapeHtml(title)}</div>`;
   }).join(''):`<div class="dsr" style="cursor:default">No matching information found. Try places, food, hotels, hospitals, shopping, transport or services.</div>`;
   results.style.display='block';
   results.querySelectorAll('.dsr[role="button"]').forEach((el,i)=>{
     const jump=()=>{hits[i]?.scrollIntoView({behavior:'smooth',block:'center'});results.style.display='none';};
     el.addEventListener('click',jump);
     el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();jump();}});
   });
 };
 input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();input.dispatchEvent(new Event('input'));}};
 input.value='';
 results.style.display='none';
}
function clearDistrictSearch(){const i=document.getElementById('districtSearchInput');if(i){i.value='';i.dispatchEvent(new Event('input'));i.focus();}}
function normalizeCityQuery(value){
 return String(value||'').trim().toLowerCase().normalize('NFKC').replace(/[’']/g,"'").replace(/\s+/g,' ');
}
async function openCity(name, options={}){
 const aliases={banaras:'Varanasi',kashi:'Varanasi',agra:'Agra',lucknow:'Lucknow',kanpur:'Kanpur Nagar'};
 const wanted=String(name||'').trim(); const normalized=aliases[normalizeCityQuery(wanted)]||wanted;
 const cityQuery=normalizeCityQuery(normalized);
 const c=cities.find(x=>normalizeCityQuery(x.name)===cityQuery)||cities.find(x=>normalizeCityQuery(x.name).includes(cityQuery)||cityQuery.includes(normalizeCityQuery(x.name)));
 if(!c)return;
 currentExploreCity=c.name;
 saveRecentDestination(c.name);
 const modal=document.getElementById('modal');
 if(!modal){console.warn('ExploreUP modal container is missing.');return;}
 modal.style.display='block';
 document.body.style.overflow='hidden';
 modal.setAttribute('aria-hidden','false');
 try{trackDistrict(c.name)}catch(e){console.warn('ExploreUP district analytics skipped:',e)}
 document.getElementById('modalState').textContent='WELCOME TO';
 document.getElementById('modalTitle').textContent=c.name; if(window.exploreUpPhase2) exploreUpPhase2.setMapLinks(c.name); try{renderContacts(c.name)}catch(e){console.warn('V10 service render:',e)}
 document.title=`${c.name} Tourism Guide | ExploreUP`;
 const cityUrl='https://exploreup-five.vercel.app/?city='+encodeURIComponent(districtSlug(c.name));
 const canonical=document.getElementById('canonicalLink'); if(canonical)canonical.href=cityUrl;
 const ogUrl=document.querySelector('meta[property="og:url"]'); if(ogUrl)ogUrl.setAttribute('content',cityUrl);
 const schema=document.getElementById('siteSchema'); if(schema){schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"TouristDestination",name:c.name,description:`Explore ${c.name}, Uttar Pradesh with places, food, stays, services, shopping, transport and travel information.`,url:cityUrl});}
 const cityMeta=document.querySelector('meta[name="description"]');
 if(cityMeta) cityMeta.setAttribute('content',`Explore ${c.name}, Uttar Pradesh: tourist places, local food, hotels, hospitals, shopping, transport, culture, history and travel tips.`);
 const ogTitle=document.querySelector('meta[property="og:title"]');
 if(ogTitle) ogTitle.setAttribute('content',`${c.name} Tourism Guide | ExploreUP`);
 const ogDesc=document.querySelector('meta[property="og:description"]');
 if(ogDesc) ogDesc.setAttribute('content',`Discover ${c.name}, Uttar Pradesh with places to visit, food, stays, services, shopping and travel information.`);
 document.getElementById('aboutCityName').textContent=c.name;
 document.getElementById('mDistance').textContent=c.distance; document.getElementById('mFee').textContent=c.fee;
 document.getElementById('mTime').textContent=c.time; document.getElementById('mRating').textContent=c.rating;
 document.getElementById('breadcrumb').innerHTML=`Home <span>›</span> <b>Cities</b> <span>›</span> <b>${c.name}</b>`;
 document.getElementById('modalSubtitle').textContent=c.tag;
 const hero=document.getElementById('modalHero');
 const heroVideo=document.getElementById('districtHeroVideo');
 const heroSound=document.getElementById('districtHeroSound');
 if(hero){ const isVaranasi=normalizeCityQuery(c.name)==='varanasi'; hero.style.backgroundImage=isVaranasi?'none':`linear-gradient(transparent,#06162d88),url('${c.img}')`; hero.style.backgroundColor=isVaranasi?'#06162d':'transparent'; }
 if(heroVideo&&heroSound){
   const isVaranasi=normalizeCityQuery(c.name)==='varanasi';
   hero.classList.remove('has-district-video');
   heroSound.hidden=true;
   heroSound.textContent='🔇';
   heroSound.setAttribute('aria-label','Turn sound on');
   heroSound.title='Turn sound on';
   heroVideo.muted=true;
   heroVideo.defaultMuted=true;
   heroVideo.autoplay=true;
   heroVideo.loop=true;
   heroVideo.playsInline=true;
   heroVideo.preload='auto'; heroVideo.disablePictureInPicture=true; heroVideo.disableRemotePlayback=true;
   if(!isVaranasi){
     try{heroVideo.pause();}catch(e){}
     heroVideo.removeAttribute('src');
     heroVideo.load();
   }else{
     const videoSources=[
       'https://exploreup-five.vercel.app/images/varanasi-under-25mb-faststart-1.mp4?v=20260928',
       './images/varanasi-under-25mb-faststart-1.mp4?v=20260928',
       c.video || 'https://cdn.jsdelivr.net/gh/ansh75936-prog/exploreup@main/images/varanasi-under-25mb-faststart-1.mp4?v=20260928',
       'https://raw.githubusercontent.com/ansh75936-prog/exploreup/main/images/varanasi-under-25mb-faststart-1.mp4?v=20260928'
     ];
     let videoSourceIndex=0;
     const session=Date.now();
     const activateVideo=()=>{
       if(normalizeCityQuery(window.currentExploreCity||'')!=='varanasi')return;
       hero.classList.add('has-district-video');
       heroSound.hidden=false;
       heroVideo.muted=true;
       const p=heroVideo.play();
       if(p&&typeof p.catch==='function')p.catch(()=>{});
     };
     const loadVideoSource=()=>{
       heroVideo.src=videoSources[videoSourceIndex];
       heroVideo.removeAttribute('poster');
       heroVideo.load();
       const p=heroVideo.play();
       if(p&&typeof p.catch==='function')p.catch(()=>{});
     };
     heroVideo.onloadedmetadata=activateVideo;
     heroVideo.onloadeddata=activateVideo;
     heroVideo.oncanplay=activateVideo;
     heroVideo.onplaying=activateVideo;
     heroVideo.onerror=()=>{
       if(videoSourceIndex<videoSources.length-1){
         videoSourceIndex++;
         loadVideoSource();
       }else{
         heroSound.hidden=true;
         hero.classList.remove('has-district-video');
       }
     };
     loadVideoSource();
   }
 }
 // Render Hotels and Hospitals immediately, before any optional district renderer can fail.
 try{renderContacts(c.name)}catch(e){console.error('ExploreUP services renderer failed:',e);}
 document.getElementById('dPlaces').textContent=c.places; document.getElementById('dFood').textContent=c.food;
 document.getElementById('dShop').textContent=c.shop; document.getElementById('dTime').textContent=c.time;
 document.getElementById('dBudget').textContent=c.budget; document.getElementById('dTip').textContent=c.tip;
 document.getElementById('dAbout').textContent=c.about;
 // Populate the district knowledge and trip planner from Arya's destination dataset.
 const ak=typeof aryaKnowledge!=='undefined'?aryaKnowledge[c.name]:null;
 if(ak){
   document.getElementById('districtKnowledge').textContent=`${c.name} combines local history, culture, food and travel experiences. Use the sections below to build a practical visit around the destination's strongest highlights.`;
   document.getElementById('districtHistory').textContent=ak.history||"Explore the destination's historical background and heritage.";
   document.getElementById('districtCulture').textContent=ak.culture||"Explore local traditions, arts, crafts and everyday culture.";
   document.getElementById('districtNature').textContent=ak.nature||"Explore the destination's natural surroundings and outdoor experiences.";
   document.getElementById('districtWhy').textContent=ak.places||"Explore the destination's key attractions and local experiences.";
   document.querySelector('.district-section[data-search="travel planner itinerary budget"] .section-intro').textContent=`A practical starting point for exploring ${c.name} without rushing. Check current opening hours, ticket rules and transport conditions before travelling.`;
   const planner=document.querySelectorAll('.district-section[data-search="travel planner itinerary budget"] .knowledge-card p');
   if(planner[0]) planner[0].textContent=`Start with the strongest highlights: ${ak.places||c.places} Then add a local food experience from the Food & Cuisine section and finish with a market, cultural stop or relaxed evening activity.`;
   if(planner[1]) planner[1].textContent=`Day 1: focus on ${ak.places||c.places} Day 2: add local food, shopping, culture and nearby experiences from this guide. Keep the route flexible for traffic and opening hours.`;
 }
 // Verified reference content for Lucknow receives additional detail.
 if(c.name==='Lucknow'){
   document.getElementById('districtKnowledge').textContent='Lucknow is the capital of Uttar Pradesh and a major destination on the state’s Heritage Arc. The city combines Nawabi-era architecture, colonial-era landmarks, Awadhi cuisine, performing arts, literature and the living tradition of tehzeeb.';
   document.getElementById('districtHistory').textContent='Lucknow’s most recognisable heritage grew during the Nawabi period of Awadh. Bara Imambara was built by Nawab Asaf-ud-Daula in 1784; the complex includes the Asafi Mosque, Shahi Baoli and the Bhool Bhulaiya labyrinth. Rumi Darwaza, also associated with Asaf-ud-Daula’s reign, became a symbol of the city. Chhota Imambara was built by Nawab Muhammad Ali Shah between 1837 and 1842. The city also preserves major colonial and 1857-era heritage around the Residency and other historic quarters.';
   document.getElementById('districtCulture').textContent='Lucknow is closely associated with Awadhi tehzeeb, refined hospitality, Urdu literary traditions, music and performing arts. Chikankari is one of the city’s signature crafts, while zardozi is another important embroidery tradition. The historic Chowk and surrounding old-city markets remain important places for traditional food, textiles, handicrafts and everyday local life.';
   document.getElementById('districtNature').textContent='The Gomti River is a defining geographic feature of Lucknow. For leisure, visitors can explore green spaces and landscaped areas across the city, while the wider Lucknow region offers a mix of urban parks, riverfront areas and seasonal outdoor experiences. Nature-focused visits should be planned with current local conditions and opening information checked before travel.';
   document.getElementById('districtWhy').textContent='Visit Lucknow for its concentration of heritage architecture, Awadhi food, traditional crafts and cultural experiences. A first visit can combine Bara Imambara, Rumi Darwaza and Chhota Imambara with Chowk’s food and shopping; longer stays can add the Residency, Kaiserbagh, Dilkusha, museums, parks and modern shopping districts.';
   document.querySelector('.district-section[data-search="travel planner itinerary budget"] .section-intro').textContent='A practical starting point for exploring Lucknow without rushing. Timings, ticket rules and transport conditions can change, so verify them before the visit.';
   const planner=document.querySelectorAll('.district-section[data-search="travel planner itinerary budget"] .knowledge-card p');
   if(planner[0]) planner[0].textContent='Morning: Bara Imambara, Bhool Bhulaiya and Asafi Mosque. Walk/drive past Rumi Darwaza, then explore Chowk for Awadhi food and traditional shopping. Keep the evening for a relaxed cultural or market experience.';
   if(planner[1]) planner[1].textContent='Day 1: Old Lucknow heritage, Bara Imambara, Rumi Darwaza, Chhota Imambara and Chowk. Day 2: Residency, Kaiserbagh heritage area, Dilkusha and a museum/park or modern shopping district. Adjust the route according to opening hours and traffic.';
 }
 try{renderMalls(c.name)}catch(e){console.warn('Malls renderer skipped:',e)}
 try{renderFood(c.name)}catch(e){console.warn('Food renderer skipped:',e)}
 try{renderTransport(c.name)}catch(e){console.warn('Transport renderer skipped:',e)}
 try{setupDistrictSearch()}catch(e){console.warn('District search setup skipped:',e)}
 try{renderSuggestions(c.name)}catch(e){console.warn('Suggestions renderer skipped:',e)}
 try{loadOnlineReviews(c.name)}catch(e){console.warn('Reviews loader skipped:',e)}
 const q=encodeURIComponent(c.name+' Uttar Pradesh');
 reportDistrictSlug=districtSlug(c.name);
 document.getElementById('mapBtn').href=`https://www.google.com/maps/search/?api=1&query=${q}`;
 document.getElementById('saveCityBtn').onclick=()=>{ if(!favs.includes(c.name)){favs.push(c.name);exploreStorage.set('exploreup_favs',JSON.stringify(favs));updateFavs();} };
 document.getElementById('shareCityBtn').onclick=()=>{const shareData={title:`Explore ${c.name}`,text:`Discover ${c.name} with ExploreUP`,url:location.href.split('#')[0]+'#city='+encodeURIComponent(c.name)}; if(navigator.share) navigator.share(shareData); else navigator.clipboard?.writeText(shareData.url);};
 document.getElementById('compareCityBtn').onclick=()=>{toggleCompareCity(c.name);updateCompareButton();updateCompareUI();}; updateCompareButton();
 if(!options.fromHistory) history.pushState({exploreupCity:c.name},'', location.pathname+'?city='+encodeURIComponent(districtSlug(c.name)));
 // Load verified live content after the modal paints so opening a destination stays responsive.
 requestAnimationFrame(()=>loadDistrictContent(districtSlug(c.name)).then(liveContent=>{
  if(!liveContent || currentExploreCity!==c.name)return;
  const usable=liveContent.content_status==='verified'||liveContent.content_status==='partial';
  if(usable){
    if(liveContent.history)document.getElementById('districtHistory').textContent=liveContent.history;
    if(liveContent.culture)document.getElementById('districtCulture').textContent=liveContent.culture;
    if(liveContent.nature)document.getElementById('districtNature').textContent=liveContent.nature;
    if(liveContent.about)document.getElementById('districtWhy').textContent=liveContent.about;
    if(liveContent.about)document.getElementById('districtKnowledge').textContent=liveContent.about;
  }
  document.getElementById('districtLastUpdated').textContent=liveContent.content_status==='verified' ? `Verified content • ${liveContent.source_name||'Official source'}${liveContent.verified_at?` • ${new Date(liveContent.verified_at).toLocaleDateString()}`:''}` : (liveContent.content_status==='partial' ? `Partially verified • ${liveContent.source_name||'Official source'} • Last database update: ${liveContent.updated_at?new Date(liveContent.updated_at).toLocaleDateString():'—'}` : `Information not verified yet • Official source: ${liveContent.source_name||'District Administration'}`);
 }));
}
(function setupDistrictHeroVideoControls(){
 const btn=document.getElementById('districtHeroSound');
 const video=document.getElementById('districtHeroVideo');
 if(!btn||!video||btn.dataset.bound==='1')return;
 btn.dataset.bound='1';
 btn.addEventListener('click',()=>{
   video.muted=!video.muted;
   btn.textContent=video.muted?'🔇':'🔊';
   btn.setAttribute('aria-label',video.muted?'Turn sound on':'Turn sound off');
   btn.title=video.muted?'Turn sound on':'Turn sound off';
 });
 video.addEventListener('volumechange',()=>{
   btn.textContent=video.muted?'🔇':'🔊';
   btn.setAttribute('aria-label',video.muted?'Turn sound on':'Turn sound off');
 });
 video.addEventListener('error',()=>{
   // Varanasi has its own multi-source fallback handler in openCity().
   // Do not hide the hero video on the first source error.
   if(normalizeCityQuery(window.currentExploreCity||'')!=='varanasi'){
     const hero=document.getElementById('modalHero');
     if(hero)hero.classList.remove('has-district-video');
     if(btn)btn.hidden=true;
   }
 });
})();
function searchSite(){
 const input=document.getElementById('searchInput'), box=document.getElementById('results');
 if(!input||!box)return;
 const raw=input.value.trim();
 const q=raw.toLowerCase().normalize('NFKC').replace(/[’']/g,"'").replace(/\\s+/g,' ');
 if(!q){box.style.display='none';box.innerHTML='';return;}
 try{recordOnlineEvent('search',null,{query:q.slice(0,120)});}catch(e){}
 const source=(window.__exploreUpDistrictCities&&window.__exploreUpDistrictCities.length?window.__exploreUpDistrictCities:cities)||[];
 const extra=Array.isArray(cities)?cities:[];
 const byName=new Map();
 [...source,...extra].forEach(c=>{if(c&&c.name)byName.set(normalizeCityQuery(c.name),c);});
 const aliases={banaras:'varanasi',kashi:'varanasi',allahabad:'prayagraj',prayag:'prayagraj',noida:'gautam buddh nagar'};
 const wanted=aliases[q]||q;
 const hits=[...byName.values()].map(c=>{
   const text=[c.name,c.tag,c.places,c.food,c.shop,c.about,c.budget].filter(Boolean).join(' ').toLowerCase();
   let score=text.includes(wanted)?1:0;
   if(normalizeCityQuery(c.name)===wanted)score=3;
   else if(normalizeCityQuery(c.name).includes(wanted)||wanted.includes(normalizeCityQuery(c.name)))score=2;
   return {c,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.c.name.localeCompare(b.c.name)).slice(0,12);
 box.innerHTML=hits.length?hits.map(({c})=>{
   const safeName=String(c.name).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
   return `<div class="result" role="button" tabindex="0" data-search-city="${safeName}"><b>${escapeHtml(c.name)}</b><br><small>${escapeHtml(c.tag||'Explore this destination')}</small></div>`;
 }).join(''):`<div class="result" style="cursor:default">No match found. Try a city, district, place, food or shopping name.</div>`;
 box.style.display='block';
 box.querySelectorAll('[data-search-city]').forEach(el=>{
   const open=()=>{safeOpenCity(el.getAttribute('data-search-city')||'');box.style.display='none';input.blur();};
   el.addEventListener('click',open);
   el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
 });
}
const homeSearch=document.getElementById('searchInput');
if(homeSearch){
 let searchTimer;
 homeSearch.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();searchSite();}});
 homeSearch.addEventListener('input',()=>{
   clearTimeout(searchTimer);
   searchTimer=setTimeout(()=>{if(homeSearch.value.trim().length>0)searchSite();else document.getElementById('results').style.display='none';},120);
 });
}
const exploreModal=document.getElementById('modal');if(exploreModal)exploreModal.addEventListener('click',e=>{if(e.target===exploreModal)closeModal()}); document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
try{renderCities()}catch(e){console.warn('ExploreUP city render failed:',e)}
const b=document.getElementById('destinationCountBadge'); if(b)b.textContent=(window.__exploreUpDistrictCities&&window.__exploreUpDistrictCities.length===75)?'75 districts':`${cities.length} destinations`;
const districtCatalogReady=Promise.resolve();
handleCityUrl();

function updateMobileDarkStatus(isDark){
 const toggle=document.querySelector('.mobile-menu-toggle');
 const text=document.getElementById('mobileDarkText');
 if(toggle)toggle.classList.toggle('is-on',isDark);
 if(text)text.textContent=isDark?'Dark Theme Active':'Light Theme Active';
}
function toggleDark(){
 document.body.classList.toggle('dark');
 const isDark=document.body.classList.contains('dark');
 exploreStorage.set('exploreup_dark',isDark?'1':'0');
 updateMobileDarkStatus(isDark);
}
const exploreLanguageText={
 nav:{'Home':'होम','Cities':'शहर','Places':'स्थान','Food':'खाना','Travel':'यात्रा','Blogs':'ब्लॉग','About':'हमारे बारे में'},
 headings:{
  '🕘 Recently Viewed':'🕘 हाल ही में देखे गए','🧭 Find a District':'🧭 जिला खोजें','🗺️ Interactive UP District Map':'🗺️ उत्तर प्रदेश जिला मानचित्र',
  '📍 Explore Our Cities':'📍 हमारे शहर देखें','⭐ Why ExploreUP?':'⭐ ExploreUP क्यों?','💎 Hidden Gems of Uttar Pradesh':'💎 उत्तर प्रदेश के छिपे रत्न',
  '🧭 District-wise Exploration':'🧭 जिलेवार खोज','🎉 Festivals Calendar':'🎉 त्योहार कैलेंडर','🍴 Food Trails':'🍴 भोजन यात्रा',
  '🧳 Travel Ideas':'🧳 यात्रा के सुझाव','🌱 Sustainable Travel Tips':'🌱 टिकाऊ यात्रा सुझाव','📝 Featured Blogs':'📝 प्रमुख ब्लॉग',
  'Emergency & Important Helplines':'आपातकालीन और महत्वपूर्ण हेल्पलाइन','About this city':'इस शहर के बारे में','🏨 Hotels / Stays':'🏨 होटल / ठहरने की जगह',
  '🏥 Hospitals':'🏥 अस्पताल','📖 District Knowledge':'📖 जिले की जानकारी','🍴 Food & Cuisine Guide':'🍴 भोजन और व्यंजन गाइड',
  '🚆✈️ Transport Guide — Travel Within Uttar Pradesh':'🚆✈️ परिवहन गाइड — उत्तर प्रदेश में यात्रा','🗓️ Trip Planner':'🗓️ यात्रा योजनाकार',
  '🛍️ Shopping Malls & Centres':'🛍️ शॉपिंग मॉल और सेंटर','⚠️ Report Incorrect Information':'⚠️ गलत जानकारी रिपोर्ट करें',
  '💬 Suggest an Update':'💬 अपडेट सुझाएँ','⭐ Share Your Experience':'⭐ अपना अनुभव साझा करें','🧭 Arya Trip Plan Maker':'🧭 Arya ट्रिप प्लान मेकर'
 }
};
function applyLanguage(isHindi){
 const b=document.getElementById('langBtn');
 if(b)b.textContent=isHindi?'English':'हिंदी';
 document.querySelectorAll('.navlinks a').forEach(a=>{const key=a.textContent.trim();if(exploreLanguageText.nav[key])a.textContent=isHindi?exploreLanguageText.nav[key]:Object.keys(exploreLanguageText.nav).find(k=>exploreLanguageText.nav[k]===key)||key});
 document.querySelectorAll('h2').forEach(h=>{
   const raw=h.dataset.exploreEn||h.textContent.trim();h.dataset.exploreEn=raw;
   if(isHindi&&exploreLanguageText.headings[raw])h.textContent=exploreLanguageText.headings[raw];
   else h.textContent=raw;
 });
 const eyebrow=document.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent=isHindi?'घूमें • खोजें • अनुभव करें':'EXPLORE • DISCOVER • EXPERIENCE';
 const h1=document.querySelector('.hero h1');if(h1)h1.innerHTML=isHindi?'असाधारण से आगे,<em>उत्तर प्रदेश घूमें</em>':'Beyond Ordinary,<em>Explore Extraordinary</em>';
 const heroP=document.querySelector('.hero > div > p');if(heroP)heroP.textContent=isHindi?'उत्तर प्रदेश की संस्कृति, विरासत, भोजन, स्थानों, ठहरने की जगहों और उपयोगी यात्रा जानकारी को शहर-दर-शहर जानें।':'Discover the culture, heritage, food, places, stays and useful travel information of Uttar Pradesh — city by city.';
 try{localStorage.setItem('exploreup_language',isHindi?'hi':'en')}catch(e){}
}
function updateMobileLanguageStatus(isHindi){
  const text=document.getElementById('mobileLanguageText');
  const badge=document.getElementById('mobileLanguageBadge');
  if(text)text.textContent=isHindi?'Active: हिंदी • Tap to switch':'Active: English • Tap to switch';
  if(badge)badge.textContent=isHindi?'हिंदी (Active)':'English (Active)';
}
function toggleLanguage(){
  const isHindi=document.documentElement.lang!=='hi';
  document.documentElement.lang=isHindi?'hi':'en';
  applyLanguage(isHindi);
  updateMobileLanguageStatus(isHindi);
}
(function(){let lang='en';try{lang=localStorage.getItem('exploreup_language')||'en'}catch(e){}document.documentElement.lang=lang;const run=()=>{const isHindi=lang==='hi';applyLanguage(isHindi);updateMobileLanguageStatus(isHindi)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run()})();
if(exploreStorage.get('exploreup_dark')==='1')document.body.classList.add('dark');
updateMobileDarkStatus(document.body.classList.contains('dark'));
window.addEventListener('error',e=>{console.warn('ExploreUP runtime warning:',e.error||e.message);});
window.addEventListener('unhandledrejection',e=>{console.warn('ExploreUP async warning:',e.reason);e.preventDefault();});
// Keep the page eligible for browser back/forward cache; avoid unload handlers.
window.addEventListener('pageshow',()=>{document.documentElement.classList.remove('page-restoring')},{passive:true});


let reportDistrictSlug='';
function toggleReportPanel(){const p=document.getElementById('reportPanel');if(p)p.classList.toggle('show');}
async function submitInfoReport(){const msg=document.getElementById('reportMessage')?.value.trim();const status=document.getElementById('reportStatus');if(!msg||msg.length<3){if(status)status.textContent='Please describe the correction.';return}try{if(exploreSupabase){const {error}=await exploreSupabase.from('info_reports').insert({district_slug:reportDistrictSlug||null,section:'general',message:msg,page_url:location.href,status:'pending'});if(error)throw error;}exploreStorage.set('exploreup_report_sent','1');if(status)status.textContent='Thanks — your correction was submitted for review.';document.getElementById('reportMessage').value='';}catch(e){if(status)status.textContent='Could not submit online. Please try again later.';}}
async function loadDistrictContent(slug){try{if(!exploreSupabase||!slug)return null;const {data,error}=await exploreSupabase.from('district_content').select('name,name_hi,about,history,culture,nature,places,food,tips,content_status,source_name,source_url,source_note,verified_at,updated_at').eq('district_slug',slug).maybeSingle();if(error)throw error;return data||null}catch(e){return null}}
let deferredInstallPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;document.getElementById('installBtn')?.classList.add('show')});async function installExploreUP(){if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();try{await deferredInstallPrompt.userChoice}catch(e){}deferredInstallPrompt=null;document.getElementById('installBtn')?.classList.remove('show')}
function setupOfflineState(){const bar=document.getElementById('offlineBar');const sync=()=>{if(!bar)return;bar.style.display=navigator.onLine?'none':'block';bar.classList.toggle('show',!navigator.onLine)};window.addEventListener('online',sync);window.addEventListener('offline',sync);sync()}
setupOfflineState();
/* Service Worker intentionally disabled for stability. The app runs from the primary index.html entry point. */

// Current government profile — update this small object when the office-holder changes.
const governmentProfile={
  chiefMinisterName:'Yogi Adityanath',
  designation:'Hon’ble Chief Minister, Uttar Pradesh',
  photoUrl:'',
  officialProfile:'https://www.vidhanparishad.up.gov.in/chief-minister',
  source:'Government of Uttar Pradesh'
};
function renderGovernmentProfile(){
  const n=document.getElementById('govCmName'),r=document.getElementById('govCmRole'),a=document.getElementById('govOfficialLink'),img=document.getElementById('govPhoto');
  if(n)n.textContent=governmentProfile.chiefMinisterName;
  if(r)r.textContent=governmentProfile.designation;
  if(a)a.href=governmentProfile.officialProfile;
  if(img && governmentProfile.photoUrl){img.classList.remove('gov-fallback');img.innerHTML='';img.style.backgroundImage=`url("${governmentProfile.photoUrl}")`;img.style.backgroundSize='cover';img.style.backgroundPosition='center';}
  else if(img){img.textContent=(governmentProfile.chiefMinisterName||'CM').split(' ').map(x=>x[0]).slice(0,2).join('');}
}
renderGovernmentProfile();
window.addEventListener('DOMContentLoaded',renderGovernmentProfile,{once:true});
// Supabase is optional: load it only after the local ExploreUP UI has started.
loadSupabaseBackend().then(client=>{
  if(!client)return;
  syncDistrictCatalog().then(()=>{renderCities(); handleCityUrl();}).catch(()=>{renderCities(); handleCityUrl();});
});
