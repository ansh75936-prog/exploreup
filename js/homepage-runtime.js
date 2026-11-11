async function searchSite(){
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

window.addEventListener('error',e=>{console.warn('ExploreUP runtime warning:',e.error||e.message);});
window.addEventListener('unhandledrejection',e=>{console.warn('ExploreUP async warning:',e.reason);e.preventDefault();});
// Keep the page eligible for browser back/forward cache; avoid unload handlers.
window.addEventListener('pageshow',()=>{document.documentElement.classList.remove('page-restoring')},{passive:true});


