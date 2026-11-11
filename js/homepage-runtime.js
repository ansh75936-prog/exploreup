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

function heroAryaQuick(q){toggleArya();setTimeout(()=>{const i=document.getElementById('aryaInput');if(i){i.value=q;askArya()}},80)}
function aryaBackHome(){const p=document.getElementById('aryaPanel');if(p){p.style.display='none';}document.body.classList.remove('arya-open');window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'',window.location.pathname+window.location.search);}
function toggleArya(){const p=document.getElementById('aryaPanel');const open=p.style.display==='block';p.style.display=open?'none':'block';document.body.classList.toggle('arya-open',!open);if(!open)setTimeout(()=>document.getElementById('aryaInput')?.focus(),50)}
function aryaAdd(text,type='bot'){const b=document.getElementById('aryaBody');const d=document.createElement('div');d.className='arya-msg '+type;d.textContent=text;b.appendChild(d);b.scrollTop=b.scrollHeight}
function aryaQuick(q){document.getElementById('aryaInput').value=q;askArya()}
let aryaLiveCache=null, aryaLiveCacheAt=0, aryaLivePromise=null;
async function getAryaLiveContext(){
 const now=Date.now();
 if(aryaLiveCache && now-aryaLiveCacheAt<60000)return aryaLiveCache;
 if(aryaLivePromise)return aryaLivePromise;
 aryaLivePromise=(async()=>{
  try{
   if(!exploreSupabase)return {districts:[],suggestions:[],reviews:[]};
   const [d,s,r]=await Promise.all([
    exploreSupabase.from('districts').select('name,name_hi,slug,kind').eq('is_active',true).order('sort_order',{ascending:true}),
    exploreSupabase.from('suggestions').select('district_slug,category,message').eq('status','approved').order('created_at',{ascending:false}).limit(20),
    exploreSupabase.from('reviews').select('district_slug,rating,review_text').eq('status','approved').order('created_at',{ascending:false}).limit(20)
   ]);
   aryaLiveCache={districts:d.data||[],suggestions:s.data||[],reviews:r.data||[]};
   aryaLiveCacheAt=Date.now();
   return aryaLiveCache;
  }catch(e){return aryaLiveCache||{districts:[],suggestions:[],reviews:[]};}
  finally{aryaLivePromise=null;}
 })();
 return aryaLivePromise;
}
async function askArya(){const input=document.getElementById('aryaInput');const q=input.value.trim();if(!q)return;aryaAdd(q,'user');input.value='';const lang=aryaDetectLanguage(q);const b=document.getElementById('aryaBody');const temp=document.createElement('div');temp.className='arya-msg bot';temp.textContent='Checking ExploreUP information…';b.appendChild(temp);b.scrollTop=b.scrollHeight;try{const answer=await aryaAnswer(q,lang);temp.remove();aryaAdd(answer,'bot')}catch(e){temp.remove();aryaAdd('I could not load live ExploreUP data right now. Please try again in a moment.','bot')}}
const aryaKnowledge={
"Lucknow":{history:"Capital of Uttar Pradesh, shaped strongly by the Nawabs of Awadh and the events of 1857.",places:"Bara Imambara, Rumi Darwaza, Chhota Imambara, Lucknow Residency, Dilkusha Kothi, British Residency area, Hazratganj and Chowk.",food:"Awadhi biryani, galouti and kakori kebabs, nihari-kulcha, basket chaat, malai makkhan, sheermal and kulfi.",culture:"Known for Awadhi tehzeeb, Urdu literature, music, chikankari and zardozi crafts.",nature:"Gomti River, city parks and landscaped green spaces.",tips:"For heritage, combine Old Lucknow with Chowk; verify monument timings and current traffic before travel."},
"Ayodhya":{history:"An ancient pilgrimage city on the Sarayu, traditionally associated with the Ramayana and the birthplace of Lord Rama.",places:"Ram Mandir, Hanuman Garhi, Kanak Bhawan, Sita ki Rasoi, Ram ki Paidi and Sarayu ghats.",food:"Chandrakala, peda, balushahi, kachori-sabzi, poori-sabzi, satvik thali, rabri, lassi and thandai.",culture:"Temple traditions, devotional music, Ramayana heritage and major religious festivals.",nature:"Sarayu riverfront and ghats provide the main outdoor experience.",tips:"Expect heavy crowds during major festivals; plan temple visits around current entry and security rules."},
"Varanasi":{history:"One of the world's oldest continuously inhabited cities, centred on the Ganga and a major Hindu pilgrimage tradition.",places:"Kashi Vishwanath Temple, Dashashwamedh Ghat, Assi Ghat, Manikarnika Ghat, Sarnath and Ramnagar Fort.",food:"Kachori-sabzi, tamatar chaat, launglata, malaiyo, rabri, lassi, thandai and Banarasi paan.",culture:"Ganga ghats, classical music, silk weaving, religious rituals and living Banarasi traditions.",nature:"Ganga riverfront, ghats and boat experiences; Sarnath adds a quieter heritage landscape.",tips:"Early morning is excellent for the ghats; confirm temple, boat and monument timings locally."},
"Agra":{history:"Major Mughal-era city and home to the Taj Mahal, with a rich imperial architectural legacy.",places:"Taj Mahal, Agra Fort, Itmad-ud-Daulah, Mehtab Bagh, Akbar's Tomb at Sikandra and Fatehpur Sikri nearby.",food:"Agra petha, dalmoth, bedai-aloo, Mughlai dishes, chaat, kachori and paratha.",culture:"Mughal architecture, marble inlay craft, leather work and traditional sweet-making.",nature:"Yamuna riverfront and Mehtab Bagh offer open-air views of the Taj area.",tips:"Start major monuments early, especially on busy days; check the Taj Mahal weekly closure and ticket rules."},
"Mathura":{history:"Historic Braj city and an important centre of Krishna traditions and pilgrimage.",places:"Krishna Janmabhoomi, Vishram Ghat, Dwarkadhish Temple, Kusum Sarovar and nearby Govardhan.",food:"Mathura peda, makhan mishri, bedhai, kachori, poori-sabzi, rabri, lassi and thandai.",culture:"Braj Bhasha, Krishna traditions, Holi celebrations, temple music and devotional art.",nature:"Yamuna ghats and the wider Braj countryside around pilgrimage routes.",tips:"Mathura and Vrindavan can be combined; allow extra time during Holi and other major festivals."},
"Vrindavan":{history:"A major Braj pilgrimage town associated with Krishna and Radha traditions and medieval bhakti movements.",places:"Banke Bihari Temple, Prem Mandir, ISKCON Vrindavan, Radha Raman Temple, Nidhivan and Yamuna ghats.",food:"Peda, makhan mishri, bedhai, kachori-sabzi, poori-sabzi, rabri, lassi and thandai.",culture:"Bhakti traditions, temple rituals, devotional music, Braj festivals and Holi.",nature:"Yamuna riverfront and the traditional groves of Braj.",tips:"Respect temple rules and local customs; crowds can become very dense during festival periods."},
"Prayagraj":{history:"Historic Sangam city, formerly Allahabad, known for the confluence of the Ganga, Yamuna and the traditional Saraswati.",places:"Triveni Sangam, Anand Bhavan, Allahabad Fort area, Khusro Bagh and All Saints Cathedral.",food:"Kachori-sabzi, samosa, chaat, imarti, balushahi and Allahabadi guava.",culture:"Literary and political history, Sangam pilgrimage traditions and the Kumbh/Magh Mela culture.",nature:"Sangam riverfront, ghats and open spaces around the confluence.",tips:"For Sangam visits, check river conditions, boat availability and crowd arrangements."},
"Kanpur":{history:"Industrial city on the Ganga with important colonial-era, leather-industry and modern urban history.",places:"JK Temple, Moti Jheel, Allen Forest Zoo, Kanpur Memorial Church and Jajmau.",food:"Thaggu ke Laddu, chaat, aloo tikki, samosa, poha-jalebi, milk sweets and namkeen.",culture:"Leather craftsmanship, local markets and a strong North Indian urban food culture.",nature:"Moti Jheel and Allen Forest provide major city green spaces.",tips:"Kanpur works well as a city break or as a base for nearby heritage and nature excursions."},
"Jhansi":{history:"Historic Bundelkhand city strongly associated with Rani Lakshmibai and the 1857 uprising.",places:"Jhansi Fort, Rani Mahal, Government Museum, St. Jude's Shrine and nearby Orchha.",food:"Bundelkhandi dishes, dal, local breads, kachori, samosa, jalebi, peda and lassi.",culture:"Bundeli language, folk traditions, martial history and regional handicrafts.",nature:"Rocky Bundelkhand landscapes and parks around the city; Orchha adds riverine scenery nearby.",tips:"Combine Jhansi with Orchha for a fuller Bundelkhand heritage trip."},
"Chitrakoot":{history:"Pilgrimage landscape linked in tradition with the Ramayana and long-standing religious communities.",places:"Kamadgiri, Ramghat, Gupt Godavari, Hanuman Dhara, Sati Anusuya and Bharat Milap sites.",food:"Vegetarian thalis, poori-sabzi, kachori, samosa, peda, jalebi and lassi.",culture:"Ramayana traditions, pilgrimage rituals, temples and devotional music.",nature:"Forested hills, caves, streams and the Mandakini riverfront shape the destination.",tips:"Comfortable footwear helps because several sites involve walking and steps."},
"Meerut":{history:"Ancient-region city with major significance in the 1857 uprising and a long association with the Upper Doab.",places:"Augarnath Temple, Gandhi Bagh, St. John's Church, Suraj Kund and nearby Hastinapur.",food:"Gajak, rewri, chaat, kachori, samosa, jalebi, biryani and kebabs.",culture:"Sports-goods manufacturing, local markets, religious traditions and North Indian food culture.",nature:"Gandhi Bagh and green spaces; Hastinapur offers a broader heritage-and-nature excursion.",tips:"Hastinapur can be added as a day excursion from Meerut."},
"Moradabad":{history:"Historic city on the Ramganga, widely recognised for its brass and metalware craft tradition.",places:"Raza Library area in nearby Rampur, local craft markets, Jama Masjid and historic city areas.",food:"Moradabadi dal, kebabs, biryani, chaat, kachori, handi halwa and local namkeen.",culture:"Brassware, metal engraving, handicraft workshops and Rohilkhand traditions.",nature:"Ramganga river landscape and nearby rural areas.",tips:"For shopping, compare workmanship and finish across multiple craft sellers."},
"Rampur":{history:"Former princely state of Rohilkhand with a notable Nawabi heritage and scholarly collections.",places:"Rampur Raza Library, Rampur Fort area, Jama Masjid and historic city quarters.",food:"Rampuri biryani, kebabs, korma, sheermal, rumali roti, halwa and jalebi.",culture:"Rampuri cuisine, music, manuscripts, calligraphy and courtly cultural traditions.",nature:"Rural Rohilkhand landscapes surround the city.",tips:"Raza Library access rules and timings should be checked before visiting."},
"Bareilly":{history:"Important Rohilkhand city with long religious, trading and craft traditions.",places:"Alakhnath Temple, Dhopeshwar Nath Temple, local markets and nearby religious sites.",food:"Aloo tikki, kachori-sabzi, bedmi puri, chaat, samosa, jalebi, barfi and kebabs.",culture:"Zardozi, religious traditions, local bazaars and Rohilkhand food culture.",nature:"Urban parks and surrounding agricultural landscapes.",tips:"Use the old markets for local crafts and food, and verify temple timings."},
"Saharanpur":{history:"Historic north-western UP city and an important gateway toward the Shivalik foothills.",places:"Shakumbhari Devi Temple, local woodcraft markets and nearby Shivalik-area destinations.",food:"Kachori-sabzi, chaat, samosa, tikki, jalebi, peda and lassi.",culture:"Famous wood carving tradition, handicrafts and western UP traditions.",nature:"Shivalik foothills and forest landscapes lie close to the city.",tips:"Saharanpur pairs well with nearby Shivalik and pilgrimage excursions."},
"Firozabad":{history:"City known nationally for its glass and bangle industry, with roots in the wider Mughal-era region.",places:"Glass and bangle markets, local Jain temples and heritage areas.",food:"Tikki, kachori, samosa, chaat, golgappa, jalebi, peda and barfi.",culture:"Glassmaking, bangle craftsmanship and small-scale manufacturing traditions.",nature:"Mostly urban and agricultural surroundings.",tips:"When buying glassware, inspect finishing and packaging carefully for travel."},
"Kannauj":{history:"Historic city on the Ganga with major medieval importance and a long perfume-making tradition.",places:"Kannauj archaeological areas, Ganga ghats, local perfume workshops and museums/heritage sites where open.",food:"Local sweets, kachori, jalebi, seasonal produce and North Indian meals.",culture:"Attar and traditional perfume distillation, Kannauji language and old trading traditions.",nature:"Ganga river landscape and fertile Gangetic plains.",tips:"A guided perfume-workshop visit is useful for understanding traditional attar production."},
"Mirzapur":{history:"Historic Vindhyan-edge city on the Ganga, known for pilgrimage, carpet traditions and river landscapes.",places:"Vindhyachal Temple, Ghats, Chunar Fort nearby, waterfalls and forest-area viewpoints.",food:"Kachori, samosa, chaat, jalebi, peda, lassi and seasonal local dishes.",culture:"Vindhyachal pilgrimage, carpet weaving, brassware and eastern UP traditions.",nature:"Vindhya hills, waterfalls, forests and the Ganga riverfront.",tips:"For waterfalls and forest areas, check seasonal access and local weather before travelling."},
"Jaunpur":{history:"Medieval city founded in the Sharqi period and known for its distinctive Indo-Islamic architecture.",places:"Atala Masjid, Jama Masjid, Shahi Bridge and Shahi Qila area.",food:"Imarti, kachori, samosa, chaat, jalebi, local sweets and North Indian dishes.",culture:"Sharqi architectural heritage, local weaving and eastern UP traditions.",nature:"Gomti riverfront and surrounding agricultural landscapes.",tips:"The old city is best explored slowly to appreciate the architecture and markets."},
"Gorakhpur":{history:"Major eastern UP city associated with the Nath tradition and important religious and cultural institutions.",places:"Gorakhnath Temple, Gita Press, Ramgarh Tal and Kushmi Forest area.",food:"Kachori-sabzi, samosa, chaat, jalebi, peda and regional North Indian meals.",culture:"Nath tradition, religious publishing, Bhojpuri cultural influences and local crafts.",nature:"Ramgarh Tal and Kushmi Forest are key outdoor attractions.",tips:"Combine city heritage with a relaxed visit around Ramgarh Tal."},
"Kushinagar":{history:"Major Buddhist pilgrimage site traditionally identified with the place of the Buddha's Mahaparinirvana.",places:"Mahaparinirvana Temple, Ramabhar Stupa, Wat Thai Temple and international Buddhist monasteries.",food:"Vegetarian meals, kachori, samosa, jalebi, peda, lassi and simple pilgrim-friendly food.",culture:"International Buddhist monastic traditions and pilgrimage culture.",nature:"Quiet green surroundings and open temple grounds.",tips:"The destination is best explored respectfully and at an unhurried pace."},
"Lakhimpur Kheri":{history:"Large Terai district known for forests, wetlands, agriculture and access toward Dudhwa.",places:"Dudhwa National Park, Kishanpur Wildlife Sanctuary, local temples and Terai landscapes.",food:"Banana-based products, jaggery, khoya peda, kheer mohan, rasgulla and regional meals.",culture:"Terai rural life, forest communities, agriculture and local crafts.",nature:"Dudhwa forests, wetlands, grasslands and wildlife habitats are the main draw.",tips:"Wildlife visits require seasonal planning, permits and adherence to park rules."},
"Sonbhadra":{history:"Eastern-south UP district with a distinctive mix of tribal, forest, industrial and archaeological heritage.",places:"Robertsganj area, Vijaygarh Fort, Agori Fort, Rihand reservoir and nearby waterfalls.",food:"Regional vegetarian meals, millet/rice dishes, kachori, samosa, jalebi and local sweets.",culture:"Tribal traditions, folk arts, forest-based livelihoods and eastern UP influences.",nature:"Vindhyan hills, forests, reservoirs and waterfalls define the landscape.",tips:"Road conditions and seasonal waterfall access can vary; check locally before remote excursions."},
"Bhadohi":{history:"Major carpet-producing district of eastern UP with a strong weaving and export tradition.",places:"Carpet-weaving clusters, local markets, Gyanpur-area heritage and nearby religious sites.",food:"Kachori, samosa, chaat, jalebi, peda and eastern UP meals.",culture:"Hand-knotted carpets, weaving skills, artisan workshops and Bhojpuri/eastern UP culture.",nature:"Flat Gangetic plain with rural agricultural scenery.",tips:"For carpets, ask about fibre, knotting, origin and care before buying."},
"Pratapgarh":{history:"Historic Awadh-region district with religious, agricultural and local market traditions.",places:"Bela Devi Temple, local heritage sites, markets and rural pilgrimage spots.",food:"Peda, kachori, samosa, kadhai puri, red peda, jalebi and local snacks.",culture:"Awadhi/eastern UP traditions, pilgrimage culture and agricultural life.",nature:"Fertile plains, ponds and rural landscapes.",tips:"Local markets are useful for regional sweets and everyday handicrafts."},
"Etawah":{history:"Historic Yamuna-region city with links to Mughal, Maratha and later colonial-era history.",places:"Etawah Safari Park, Chambal landscape nearby, Ekdil Fort area and local temples.",food:"Kachori, samosa, chaat, jalebi, peda and North Indian meals.",culture:"Braja-Bundelkhand transition zone with rural traditions and local crafts.",nature:"Yamuna and Chambal landscapes, ravines and wildlife areas are important attractions.",tips:"Wildlife and river excursions should be planned with current seasonal and access information."},
"Aligarh":{history:"Historic university city and major centre of locks and hardware manufacturing.",places:"Aligarh Muslim University campus area, Sir Syed House, Aligarh Fort area and local markets.",food:"Kachori, samosa, chaat, dairy products, jalebi and local sweets.",culture:"Academic heritage, lock-making, Urdu scholarship and western UP traditions.",nature:"Urban parks and surrounding agricultural plains.",tips:"Respect campus access rules; combine heritage with local lock and hardware markets."},
"Bulandshahr":{history:"Historic western UP district on the Ganga-Yamuna Doab with long settlement and pilgrimage traditions.",places:"Sikandrabad and Bulandshahr heritage areas, Belon Temple and Narora/Ganga region nearby.",food:"Kachori, samosa, chaat, jalebi, rabri and North Indian meals.",culture:"Western UP rural traditions, pottery and religious festivals.",nature:"Ganga river belt and agricultural landscapes.",tips:"Narora and river-area visits should be planned with current local access information."},
"Hapur":{history:"Historic market and agricultural district in the Delhi-NCR region.",places:"Pilkhuwa textile/handloom markets, local temples and nearby heritage areas.",food:"Kachori, samosa, chaat, jalebi, sweets and North Indian street food.",culture:"Handloom, textile trading, agriculture and western UP market culture.",nature:"Mostly flat agricultural landscapes with urban green spaces.",tips:"Pilkhuwa is particularly useful for visitors interested in local textiles."},
"Muzaffarnagar":{history:"Western UP city in the sugarcane-growing belt with a strong agricultural and trading economy.",places:"Akshardham-area attractions, local temples, markets and nearby rural destinations.",food:"Kachori, samosa, chaat, jalebi, gajak, rewri and North Indian meals.",culture:"Jat and western UP rural traditions, agriculture and local fairs.",nature:"Sugarcane fields, canals and rural Doab landscapes.",tips:"Seasonal fairs and local markets vary; check current dates before planning."},
"Pilibhit":{history:"Terai district known for forests, tiger habitat and the long-running traditions of rural Rohilkhand.",places:"Pilibhit Tiger Reserve, Gomat Talab and local temples/heritage sites.",food:"Local sweets, kachori, samosa, jalebi, peda and regional meals.",culture:"Terai farming communities, forest-linked livelihoods and Rohilkhand traditions.",nature:"Tiger reserve forests, wetlands, grasslands and the Sharda/Gomti-linked landscape.",tips:"Wildlife tourism needs advance planning and compliance with reserve rules."},
"Amroha":{history:"Historic Rohilkhand city known for musical instrument making, wood craft and local trading traditions.",places:"Local heritage quarters, temples, mosques, markets and craft areas.",food:"Kachori, samosa, chaat, jalebi, local sweets and North Indian meals.",culture:"Woodcraft, dholak/drum making, mango trade and Rohilkhand traditions.",nature:"Agricultural plains and orchards surround the city.",tips:"Ask local artisans about traditional dholak-making when exploring craft markets."},
"Budaun":{history:"Historic Rohilkhand city with medieval monuments and an old urban core.",places:"Budaun Jama Masjid, Sufi shrines, old city areas and local markets.",food:"Kachori, samosa, chaat, jalebi, peda, rabri and regional meals.",culture:"Sufi traditions, religious architecture and Rohilkhand local life.",nature:"Agricultural plains and nearby rural landscapes.",tips:"The old city is best visited in daylight with time for local markets and architecture."},
"Chandauli":{history:"Eastern UP district on the edge of the Kaimur/Vindhyan landscape and close to Varanasi.",places:"Chandra Prabha Wildlife Sanctuary, Devdari and Latif Shah waterfalls, local temples and rural heritage.",food:"Kachori, samosa, chaat, jalebi, peda and eastern UP meals.",culture:"Bhojpuri/eastern UP traditions, farming communities and local fairs.",nature:"Forests, waterfalls, hills and reservoirs are the district's major attractions.",tips:"Waterfalls are seasonal; check rainfall, road access and safety conditions before visiting."},
"Sultanpur":{history:"Historic Awadh-region district with religious, literary and agricultural traditions.",places:"Sita Kund, local temples, Gomti river areas and district markets.",food:"Peda, samosa, kadhai puri, red peda, jalebi and local North Indian dishes.",culture:"Awadhi traditions, pilgrimage, rural fairs and local handicrafts.",nature:"Gomti river and fertile agricultural plains.",tips:"Local sweets are a good souvenir; compare freshness and packaging for travel."},
"Unnao":{history:"Historic Awadh-region district between Lucknow and Kanpur with archaeological and craft traditions.",places:"Nawabganj Bird Sanctuary, local temples, old market areas and rural heritage sites.",food:"Kala jamun, samosa, kushli, Trilok Pari and local North Indian snacks.",culture:"Awadhi rural traditions, sweets, handicrafts and agricultural life.",nature:"Nawabganj Bird Sanctuary and wetland landscapes are the main nature attraction.",tips:"Bird sanctuary visits are most rewarding in suitable seasonal conditions; check current access."}
};

// Arya's district/service knowledge is sourced from the same ExploreUP district data used by the visible guide cards.
const aryaDistrictCoverage = (typeof cities!=='undefined') ? cities.map(v=>v.name) : Object.keys(districtServiceContacts||{});
function aryaDetectLanguage(text){
 const t=String(text||'').trim(),x=t.toLowerCase();
 if(/[\u0900-\u097F]/.test(t)) return 'hi';
 if(/[\u0980-\u09FF]/.test(t)) return 'bn';
 if(/[\u0A00-\u0A7F]/.test(t)) return 'pa';
 if(/[\u0B80-\u0BFF]/.test(t)) return 'ta';
 if(/[\u0C00-\u0C7F]/.test(t)) return 'te';
 if(/[\u0C80-\u0CFF]/.test(t)) return 'kn';
 if(/[\u0D00-\u0D7F]/.test(t)) return 'ml';
 // Detect common romanised Indian-language questions too.
 if(/\b(kya|kaise|kahan|kidhar|batao|bataye|baare|ke bare|khana|khane|mithai|jagah|ghumna|ghoomna|kitna|kab|kyun|mujhe|mera|meri|hai|hain|mein|me|par|aur|se|ka|ki|ke)\b/.test(x)) return 'hi';
 if(/\b(kemon|ki|kothay|bolun|bolbe|khawa|khawar|mishti|jayga|ghurte|ami|amar|ache|achen)\b/.test(x)) return 'bn';
 if(/\b(kiwe|kithe|dasso|dasde|khana|thaan|ghumman|mainu|mera|meri|hai|ne)\b/.test(x)) return 'pa';
 return 'en';
}
const aryaLanguageText={
 en:{history:'History',places:'Top places',food:'Food guide',culture:'Culture & traditions',nature:'Nature',tip:'Travel tip',shopping:'Shopping',budget:'Budget guide',trip:'Quick trip idea',ask:'Ask me specifically about food, places, history, culture, nature, shopping, hotels, hospitals, budget or a trip plan.',welcome:'Hello! I’m Arya, your ExploreUP travel assistant.',all:'I have dedicated knowledge for all 75 ExploreUP districts, including district-wise places, food, hotels/stays, hospitals, transport, shopping, culture, nature and trip ideas. Ask me any district or city and I can help you find the relevant information.'},
 hi:{history:'इतिहास',places:'प्रमुख स्थान',food:'खाने-पीने की जानकारी',culture:'संस्कृति और परंपराएँ',nature:'प्रकृति',tip:'यात्रा सुझाव',shopping:'खरीदारी',budget:'बजट गाइड',trip:'यात्रा योजना',ask:'आप मुझसे भोजन, स्थान, इतिहास, संस्कृति, प्रकृति, खरीदारी, होटल, अस्पताल, बजट या ट्रिप प्लान के बारे में पूछ सकते हैं।',welcome:'नमस्ते! मैं Arya हूँ, आपका ExploreUP ट्रैवल असिस्टेंट।',all:'मेरे पास ExploreUP के सभी 75 जिलों की जानकारी है—स्थान, भोजन, होटल/स्टे, अस्पताल, ट्रांसपोर्ट, खरीदारी, संस्कृति, प्रकृति और ट्रिप प्लान सहित। किसी भी जिले या शहर के बारे में पूछिए।'},
 bn:{history:'ইতিহাস',places:'প্রধান স্থান',food:'খাবারের তথ্য',culture:'সংস্কৃতি ও ঐতিহ্য',nature:'প্রকৃতি',tip:'ভ্রমণ টিপস',shopping:'কেনাকাটা',budget:'বাজেট গাইড',trip:'ভ্রমণ পরিকল্পনা',ask:'আপনি খাবার, স্থান, ইতিহাস, সংস্কৃতি, প্রকৃতি, কেনাকাটা, হোটেল, হাসপাতাল, বাজেট বা ভ্রমণ পরিকল্পনা সম্পর্কে জিজ্ঞেস করতে পারেন।',welcome:'নমস্কার! আমি Arya, আপনার ExploreUP ট্রাভেল অ্যাসিস্ট্যান্ট।',all:'আমার কাছে ExploreUP-এর সব ডেস্টিনেশনের তথ্য আছে। যেকোনো শহর বা জেলার নাম জিজ্ঞেস করুন।'},
 pa:{history:'ਇਤਿਹਾਸ',places:'ਮੁੱਖ ਸਥਾਨ',food:'ਖਾਣ-ਪੀਣ ਦੀ ਜਾਣਕਾਰੀ',culture:'ਸੱਭਿਆਚਾਰ ਅਤੇ ਰਿਵਾਜ',nature:'ਕੁਦਰਤ',tip:'ਯਾਤਰਾ ਸੁਝਾਅ',shopping:'ਖਰੀਦਦਾਰੀ',budget:'ਬਜਟ ਗਾਈਡ',trip:'ਯਾਤਰਾ ਯੋਜਨਾ',ask:'ਤੁਸੀਂ ਖਾਣੇ, ਥਾਵਾਂ, ਇਤਿਹਾਸ, ਸੱਭਿਆਚਾਰ, ਕੁਦਰਤ, ਖਰੀਦਦਾਰੀ, ਹੋਟਲ, ਹਸਪਤਾਲ, ਬਜਟ ਜਾਂ ਯਾਤਰਾ ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।',welcome:'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ Arya ਹਾਂ, ਤੁਹਾਡਾ ExploreUP ਟ੍ਰੈਵਲ ਅਸਿਸਟੈਂਟ।',all:'ਮੇਰੇ ਕੋਲ ExploreUP ਦੇ ਸਾਰੇ ਡੈਸਟਿਨੇਸ਼ਨਾਂ ਦੀ ਜਾਣਕਾਰੀ ਹੈ। ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ ਜਾਂ ਜ਼ਿਲ੍ਹੇ ਦਾ ਨਾਮ ਪੁੱਛੋ।'},
 ta:{history:'வரலாறு',places:'முக்கிய இடங்கள்',food:'உணவு வழிகாட்டி',culture:'கலாசாரம் மற்றும் மரபுகள்',nature:'இயற்கை',tip:'பயண குறிப்பு',shopping:'ஷாப்பிங்',budget:'பட்ஜெட் வழிகாட்டி',trip:'பயண திட்டம்',ask:'உணவு, இடங்கள், வரலாறு, கலாசாரம், இயற்கை, ஷாப்பிங், ஹோட்டல்கள், மருத்துவமனைகள், பட்ஜெட் அல்லது பயணத் திட்டம் பற்றி கேளுங்கள்.',welcome:'வணக்கம்! நான் Arya, உங்கள் ExploreUP பயண உதவியாளர்.',all:'ExploreUP-இன் அனைத்து இடங்களுக்குமான தகவல் என்னிடம் உள்ளது. எந்த நகரம் அல்லது மாவட்டத்தைப் பற்றியும் கேளுங்கள்.'},
 te:{history:'చరిత్ర',places:'ప్రధాన ప్రదేశాలు',food:'ఆహార గైడ్',culture:'సంస్కృతి మరియు సంప్రదాయాలు',nature:'ప్రకృతి',tip:'ప్రయాణ సూచన',shopping:'షాపింగ్',budget:'బడ్జెట్ గైడ్',trip:'ప్రయాణ ప్రణాళిక',ask:'ఆహారం, ప్రదేశాలు, చరిత్ర, సంస్కృతి, ప్రకృతి, షాపింగ్, హోటళ్లు, ఆసుపత్రులు, బడ్జెట్ లేదా ప్రయాణ ప్రణాళిక గురించి అడగండి.',welcome:'నమస్కారం! నేను Arya, మీ ExploreUP ట్రావెల్ అసిస్టెంట్‌ని.',all:'ExploreUP లోని అన్ని గమ్యస్థానాల గురించి నా దగ్గర సమాచారం ఉంది. ఏ నగరం లేదా జిల్లాను గురించి అయినా అడగండి.'},
 kn:{history:'ಇತಿಹಾಸ',places:'ಪ್ರಮುಖ ಸ್ಥಳಗಳು',food:'ಆಹಾರ ಮಾರ್ಗದರ್ಶಿ',culture:'ಸಂಸ್ಕೃತಿ ಮತ್ತು ಪರಂಪರೆ',nature:'ಪ್ರಕೃತಿ',tip:'ಪ್ರಯಾಣ ಸಲಹೆ',shopping:'ಶಾಪಿಂಗ್',budget:'ಬಜೆಟ್ ಮಾರ್ಗದರ್ಶಿ',trip:'ಪ್ರಯಾಣ ಯೋಜನೆ',ask:'ಆಹಾರ, ಸ್ಥಳಗಳು, ಇತಿಹಾಸ, ಸಂಸ್ಕೃತಿ, ಪ್ರಕೃತಿ, ಶಾಪಿಂಗ್, ಹೋಟೆಲ್, ಆಸ್ಪತ್ರೆ, ಬಜೆಟ್ ಅಥವಾ ಪ್ರವಾಸ ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ.',welcome:'ನಮಸ್ಕಾರ! ನಾನು Arya, ನಿಮ್ಮ ExploreUP ಪ್ರಯಾಣ ಸಹಾಯಕ.',all:'ExploreUP ನ ಎಲ್ಲಾ ಸ್ಥಳಗಳ ಬಗ್ಗೆ ನನ್ನ ಬಳಿ ಮಾಹಿತಿ ಇದೆ. ಯಾವುದೇ ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯ ಬಗ್ಗೆ ಕೇಳಿ.'},
 ml:{history:'ചരിത്രം',places:'പ്രധാന സ്ഥലങ്ങൾ',food:'ഭക്ഷണ ഗൈഡ്',culture:'സംസ്കാരവും പാരമ്പര്യങ്ങളും',nature:'പ്രകൃതി',tip:'യാത്രാ നിർദ്ദേശം',shopping:'ഷോപ്പിംഗ്',budget:'ബജറ്റ് ഗൈഡ്',trip:'യാത്രാ പദ്ധതി',ask:'ഭക്ഷണം, സ്ഥലങ്ങൾ, ചരിത്രം, സംസ്കാരം, പ്രകൃതി, ഷോപ്പിംഗ്, ഹോട്ടലുകൾ, ആശുപത്രികൾ, ബജറ്റ് അല്ലെങ്കിൽ യാത്രാ പദ്ധതി എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ.',welcome:'നമസ്കാരം! ഞാൻ Arya, നിങ്ങളുടെ ExploreUP യാത്രാ സഹായി.',all:'ExploreUP-യിലെ എല്ലാ സ്ഥലങ്ങളെയും കുറിച്ചുള്ള വിവരങ്ങൾ എനിക്ക് ലഭ്യമാണ്. ഏത് നഗരത്തെയോ ജില്ലയെയോ കുറിച്ചും ചോദിക്കാം.'}
};
function aryaLangPack(lang){return aryaLanguageText[lang]||aryaLanguageText.en;}
const aryaTranslationCache=new Map();
async function aryaTranslateChunk(text,lang){
 if(lang==='en'||!text.trim()) return text;
 const key=lang+'|'+text;
 if(aryaTranslationCache.has(key)) return aryaTranslationCache.get(key);
 try{
   const url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl='+encodeURIComponent(lang)+'&dt=t&q='+encodeURIComponent(text);
   const r=await fetch(url,{method:'GET',cache:'force-cache'});
   if(!r.ok) throw new Error('translation');
   const data=await r.json();
   const out=Array.isArray(data?.[0])?data[0].map(x=>x?.[0]||'').join(''):'';
   if(!out.trim()) throw new Error('empty translation');
   aryaTranslationCache.set(key,out);
   return out;
 }catch(e){
   return text;
 }
}
async function aryaLocalizeAnswer(answer,lang){
 const L=aryaLangPack(lang);
 if(lang==='en') return answer;
 // Translate the complete ExploreUP answer naturally, while preserving line breaks and verified facts.
 const structural=answer
   .replace(/History/g,L.history).replace(/Top places/g,L.places).replace(/Food guide/g,L.food)
   .replace(/Culture & traditions/g,L.culture).replace(/Nature/g,L.nature).replace(/Travel tip/g,L.tip)
   .replace(/Shopping/g,L.shopping).replace(/Budget guide/g,L.budget).replace(/Quick trip idea/g,L.trip)
   .replace(/Ask me specifically about food, places, history, culture, nature, shopping, hotels, hospitals, budget or a trip plan\./g,L.ask);
 const chunks=structural.split(/(\n\s*\n)/);
 const out=[];
 for(const chunk of chunks){
   if(/^\n\s*\n$/.test(chunk)) out.push(chunk);
   else if(chunk.trim()) out.push(await aryaTranslateChunk(chunk,lang));
   else out.push(chunk);
 }
 return out.join('');
}
async function aryaAnswer(q,lang){
 const raw=q.trim(), x=raw.toLowerCase();
 const L=aryaLangPack(lang);
 const websiteTerms=/exploreup|explore up|website|site|page|section|menu|search|district|city|destination|place|food|cuisine|hotel|stay|hospital|health|pharmacy|emergency|shopping|mall|market|cinema|theatre|transport|train|railway|flight|airport|bus|metro|trip|itinerary|planner|plan maker|budget|cost|expense|people|interest|recommend|recommendation|smart plan|quick plan|offline|online|internet|history|heritage|culture|festival|nature|wildlife|park|river|map|review|rating|suggestion|correction|admin|favourite|favorite|save|share|timing|time|ticket|fee|entry|how to|kaise|kahan|kidhar|ghoom|ghumna|khana|mithai|aspataal|dawai|rail|hawai/.test(x);
 const outOfScope=/weather|cricket|football|song|lyrics|joke|homework|math|coding|programming|stock|crypto|recipe for|medical diagnosis|relationship|personal advice|general knowledge|news/.test(x);
 if(!websiteTerms || outOfScope){
  return aryaLocalizeAnswer(`${L.welcome}\n\nI can help only with information and features available inside ExploreUP — destinations, places, food, hotels, hospitals, shopping, transport, history, culture, trip planning, reviews, suggestions and website navigation.\n\nPlease ask me about an ExploreUP destination or section.`,lang);
 }
 const plannerKnowledge=`Arya Trip Plan Maker knowledge:
- Quick Plan uses bundled ExploreUP information and is designed to remain usable offline.
- Smart Plan requires internet and checks available ExploreUP live data before adding live approved updates.
- Planner inputs: destination/district, 1–7 days, number of people, approximate budget, travel style, transport preference, stay category, and interests including history, religion, nature, shopping, photography, family and food.
- Budget Calculator estimates accommodation, food, transport, activities and local transport. It is an estimate only, not a live quote.
- Smart Recommendations use bundled ExploreUP destination knowledge and selected interests.
- Generated plans are suggestions, not guaranteed bookings or exact route/timing information.
- ExploreUP has built-in coverage for all 75 Uttar Pradesh districts, with district guides and district-wise Hotels/Stays and Hospitals where data is stored.
- Live hotel prices, availability, ratings, weather and transport timings are not assumed unless a verified live source is available.`;
 let live={districts:[],suggestions:[],reviews:[]};
 const needsLive=/live|latest|recent|update|review|rating/.test(x);
 if(needsLive){try{live=await Promise.race([getAryaLiveContext(),new Promise(resolve=>setTimeout(()=>resolve({districts:[],suggestions:[],reviews:[]}),1200))])}catch(e){console.warn('Arya live context unavailable; using local knowledge.',e)}}
 const liveDistrict=live.districts.find(d=>{const n=(d.name||'').toLowerCase(),h=(d.name_hi||'').toLowerCase();return x.includes(n)||x.includes(h)||n.includes(x)});
 const c=cities.find(c=>{const n=c.name.toLowerCase();return x.includes(n)||n.includes(x)}) || (liveDistrict?cities.find(c=>c.name.toLowerCase()===liveDistrict.name.toLowerCase()):null);
 const slug=(liveDistrict?.slug)||(c?.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const liveSug=live.suggestions.filter(v=>v.district_slug===slug);
 const liveRev=live.reviews.filter(v=>v.district_slug===slug);
 const websiteOnly=()=>{
   if(/admin|login|dashboard|suggest|suggestion|review|rate|rating|feedback/.test(x)) return `ExploreUP website help:
You can use Admin for authorised moderation, Suggest an Update to send information corrections, and Share Your Experience to submit a review/rating. I can explain these website features.`;
   if(/plan|planner|itinerary|trip|budget|cost|expense|recommend|recommendation|smart plan|quick plan|offline|online|internet|people|interest/.test(x)) return plannerKnowledge+`\n\nOpen Arya Trip Plan Maker from the Plan/Trip Planner controls to generate a destination plan.`;
   if(/search|find|navigation|menu|use|kaise|kahan|where|how/.test(x)) return `ExploreUP website help:
Use the main search to find destinations, open a city/district for its full guide, then use its sections for Food, Stay & Health, Knowledge, Trip Planner, Transport and Shopping. You can also use the district search inside each destination page.`;
   return `${L.welcome} ${L.ask}\n\nI can help with Uttar Pradesh travel, destinations, places, food, hotels, hospitals, shopping, transport, history, culture, trip plans and ExploreUP features.`;
 };
 if(c){
   const k=aryaKnowledge[c.name]||{};
   let base='';
   if(/plan|planner|itinerary|trip|day/.test(x)) base=plannerKnowledge+`\n\nFor ${c.name}: the planner uses its bundled places, food and destination information to build a suggested day-by-day plan.`;
   else if(/budget|cost|expense|paisa|kitna/.test(x)) base=`${c.name} — Budget Planner:\n${c.budget}.\n\nThe Budget Calculator estimates accommodation, food, transport, activities and local transport. Estimate only; actual prices vary.`;
   else if(/recommend|recommendation|interest|smart/.test(x)) base=`${c.name} — Smart Recommendations:\nChoose interests such as history, religion, nature, food, shopping, photography or family. Arya uses bundled ExploreUP knowledge for ${c.name} to suggest relevant categories.`;
   else if(/offline|quick plan|smart plan|online plan|internet/.test(x)) base=plannerKnowledge;
   else if(/food|khana|cuisine|dish|sweet|mithai|street/.test(x)) base=`${c.name} — Food & Cuisine section:
${k.food||c.food}.`;
   else if(/hotel|stay|room|resort|accommodation/.test(x)){
     const staySource=(typeof districtServiceContacts!=='undefined'&&districtServiceContacts[c.name])?districtServiceContacts[c.name]:(contactData[c.name]||{}); const stays=staySource.hotels||[];
     base=`${c.name} — Hotels / Stays:
`+(stays.length?stays.map((v,i)=>`${i+1}. ${v.name}${v.type?' ('+v.type+')':''} — ${v.address}${v.phone?' — Phone: '+v.phone:''}`).join('\n'):`No verified hotel/stay address is currently stored for ${c.name} in ExploreUP. The district page also provides a Google Maps search option.`);
   }
   else if(/hospital|doctor|medical|health|pharmacy|ambulance|emergency/.test(x)){
     const healthSource=(typeof districtServiceContacts!=='undefined'&&districtServiceContacts[c.name])?districtServiceContacts[c.name]:(contactData[c.name]||{}); const hospitals=healthSource.hospitals||[];
     base=`${c.name} — Hospitals / Health:
`+(hospitals.length?hospitals.map((v,i)=>`${i+1}. ${v.name}${v.type?' ('+v.type+')':''} — ${v.address}${v.phone?' — Phone: '+v.phone:''}`).join('\n'):`No verified hospital address is currently stored for ${c.name} in ExploreUP. The district page also provides a Google Maps search option.`);
   }
   else if(/shopping|market|mall|buy|craft|handicraft/.test(x)) base=`${c.name} — Shopping section:
${c.shop}.

ExploreUP also lists available malls and shopping/map options for the destination.`;
   else if(/history|heritage/.test(x)) base=`${c.name} — History & Heritage:
${k.history}`;
   else if(/culture|festival|tradition|tehzeeb/.test(x)) base=`${c.name} — Culture & Local Life:
${k.culture}`;
   else if(/nature|wildlife|forest|waterfall|park|river/.test(x)) base=`${c.name} — Geography & Nature:
${k.nature}`;
   else if(/place|visit|tour|ghoom|ghumna|attraction|sight|temple|fort|museum/.test(x)) base=`${c.name} — Places to Explore:
${k.places}`;
   else if(/budget|cost|expense|paisa|kitna/.test(x)) base=`${c.name} — Budget information:
${c.budget}.

ExploreUP provides this as a planning guide; it does not provide live prices.`;
   else if(/trip|itinerary|plan|day/.test(x)) base=`${c.name} — Trip Planner:
${k.places}

Food: ${k.food}

Tip: ${k.tips}`;
   else if(/tip|tips|advice|kab|when|best time/.test(x)) base=`${c.name} — Travel Tip:
${k.tips}

ExploreUP lists: ${c.time}.`;
   else if(/about|overview|guide|information|info|batao|tell me|details|baare mein|ke bare mein/.test(x)) base=`${c.name}
${c.tag}.

History: ${k.history}

Places: ${k.places}

Food: ${k.food}

Culture: ${k.culture}

Nature: ${k.nature}

Travel tip: ${k.tips}`;
   else base=`I can help with the ExploreUP sections for ${c.name}: Places, Food, Stay & Health, Knowledge, Trip Planner, Transport and Shopping. Ask me about one of these sections.`;
   if(liveSug.length) base+=`

Live approved updates from ExploreUP:
${liveSug.slice(0,5).map(v=>`• ${v.category}: ${v.message}`).join('\n')}`;
   if(liveRev.length) base+=`

Recent approved visitor reviews: ${liveRev.length}
Average shown from approved reviews: ${(liveRev.reduce((a,v)=>a+Number(v.rating||0),0)/liveRev.length).toFixed(1)}/5`;
   return aryaLocalizeAnswer(base+`

Ask me about any section or feature available inside this ExploreUP destination page.`,lang);
 }
 if(liveDistrict){
   let ans=`${liveDistrict.name} (${liveDistrict.name_hi||''}) is an active destination in ExploreUP.

Open its destination page to explore the sections available for this place: Overview, Food, Stay & Health, Knowledge, Trip Planner, Transport and Shopping.`;
   if(liveSug.length) ans+=`

Approved ExploreUP updates for this destination:
${liveSug.slice(0,5).map(v=>`• ${v.category}: ${v.message}`).join('\n')}`;
   if(liveRev.length) ans+=`

Approved visitor reviews currently available: ${liveRev.length}.`;
   return aryaLocalizeAnswer(ans,lang);
 }
 if(/all cities|every city|har city|sabhi city|sabhi jila|all district|har jila|destinations|kitne city|kitne district/.test(x)) return aryaLangPack(lang).all+`

ExploreUP currently has ${live.districts.length} active destination records in its live database.`;
 const matched=live.districts.filter(d=>{const hay=(d.name+' '+(d.name_hi||'')).toLowerCase();return raw.toLowerCase().split(/\s+/).filter(w=>w.length>2).some(w=>hay.includes(w))});
 if(matched.length) return `ExploreUP destinations matching your question:
${matched.slice(0,8).map(d=>'• '+d.name).join('\n')}

Tell me which destination you want to explore.`;
 return websiteOnly();
}
document.getElementById('aryaInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')askArya()});



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
