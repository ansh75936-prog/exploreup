/* ExploreUP Phase 1: live district search, region filters and SVG district map */
(function(){
 'use strict';
 const regionLists={
  awadh:['Ambedkar Nagar','Auraiya','Ayodhya','Bahraich','Balrampur','Barabanki','Etawah','Farrukhabad','Fatehpur','Gonda','Hardoi','Kannauj','Kanpur Dehat','Kanpur Nagar','Lakhimpur Kheri','Lucknow','Pratapgarh','Raebareli','Shravasti','Sitapur','Sultanpur','Unnao'],
  braj:['Agra','Aligarh','Etah','Firozabad','Hathras','Kasganj','Mainpuri','Mathura'],
  rohilkhand:['Amroha','Bareilly','Bijnor','Budaun','Moradabad','Pilibhit','Rampur','Sambhal','Shahjahanpur'],
  western:['Baghpat','Bulandshahr','Gautam Buddha Nagar','Ghaziabad','Hapur','Meerut','Muzaffarnagar','Saharanpur','Shamli'],
  bundelkhand:['Banda','Chitrakoot','Hamirpur','Jalaun','Jhansi','Lalitpur','Mahoba'],
  purvanchal:['Azamgarh','Ballia','Basti','Bhadohi','Chandauli','Deoria','Ghazipur','Gorakhpur','Jaunpur','Kaushambi','Kushinagar','Maharajganj','Mau','Mirzapur','Prayagraj','Sant Kabir Nagar','Sant Ravidas Nagar','Siddharthnagar','Sonbhadra','Varanasi']
 };
 const norm=s=>String(s||'').toLowerCase().replace(/buddha nagar/g,'buddh nagar').replace(/[^a-z0-9]+/g,' ').trim();
 const regionByName={};Object.entries(regionLists).forEach(([r,arr])=>arr.forEach(n=>regionByName[norm(n)]=r));
 function getList(){return (window.__exploreUpDistrictCities&&window.__exploreUpDistrictCities.length===75)?window.__exploreUpDistrictCities:(window.cities||[]).slice(0,75)}
 function regionOf(name){return regionByName[norm(name)]||'purvanchal'}
 function open(name){if(typeof safeOpenCity==='function')safeOpenCity(name);else if(typeof openCity==='function')openCity(name)}
 function filter(){
   const q=(document.getElementById('searchInput')?.value||'').trim().toLowerCase();
   const active=document.querySelector('.region-btn.active')?.dataset.region||'all';
   const grid=document.getElementById('cityGrid');
   if(grid&&!grid.children.length&&typeof renderCities==='function')renderCities();
   if(grid&&(q||active!=='all')&&grid.hidden){
     grid.hidden=false;
     [document.getElementById('euViewAll'),document.getElementById('euViewAllFeatured')].filter(Boolean).forEach(btn=>{
       btn.setAttribute('aria-expanded','true');
       btn.setAttribute('aria-controls','cityGrid');
       btn.textContent='Hide Districts ↑';
     });
   }
   const cards=[...document.querySelectorAll('#cityGrid .city')];let shown=0;
   cards.forEach(card=>{const name=card.querySelector('.citytext h3')?.textContent?.trim()||'';const ok=(!q||name.toLowerCase().includes(q))&&(active==='all'||regionOf(name)===active);card.classList.toggle('is-hidden',!ok);if(ok)shown++});
   const status=document.getElementById('districtFilterStatus');if(status)status.textContent=shown===0?'No districts match. Clear the search or choose All to see districts.':(shown===75&&!q&&active==='all')?'Showing all 75 districts':'Showing '+shown+' of 75 districts'+(active!=='all'?' · '+active.charAt(0).toUpperCase()+active.slice(1):'')+(q?' · matching “'+q+'”':'');
   buildMap(active,q);
 }
 function buildMap(active,q){
   const host=document.getElementById('upMapWrap');if(!host)return;const list=getList();
   const shown=list.filter(c=>(active==='all'||regionOf(c.name)===active)&&(!q||c.name.toLowerCase().includes(q)));
   const visibleNames=new Set(shown.map(c=>c.name));
   const nodes=list.map((c,i)=>{const col=i%10,row=Math.floor(i/10),x=55+col*70+(row%2)*10,y=50+row*50,r=regionOf(c.name),vis=visibleNames.has(c.name);const label=String(c.name).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');return '<g class="map-node '+r+'" tabindex="'+(vis?'0':'-1')+'" aria-hidden="'+(vis?'false':'true')+'" pointer-events="'+(vis?'auto':'none')+'" opacity="'+(vis?'1':'.18')+'" data-name="'+label+'" data-index="'+i+'" role="button" aria-label="Open '+label+'"><circle cx="'+x+'" cy="'+y+'" r="8"></circle><text x="'+x+'" y="'+(y-12)+'" text-anchor="middle">'+label.slice(0,12)+'</text></g>'}).join('');
   host.innerHTML='<svg class="up-map-svg" viewBox="0 0 760 430" role="group" aria-label="Interactive schematic map of Uttar Pradesh districts"><path class="up-map-base" d="M65 105 L120 45 L230 35 L330 55 L430 35 L535 70 L670 95 L715 170 L690 245 L720 315 L640 375 L520 360 L430 400 L320 375 L225 395 L130 350 L70 280 L90 210 Z"></path><path class="map-region" d="M90 105 L250 50 L330 90 L300 190 L150 205 Z"></path><path class="map-region" d="M300 70 L520 55 L610 120 L500 205 L300 190 Z"></path><path class="map-region" d="M500 205 L700 155 L700 300 L570 340 L470 290 Z"></path><path class="map-region" d="M130 205 L300 190 L470 290 L430 380 L210 370 L90 280 Z"></path>'+nodes+'</svg>';
   host.querySelectorAll('.map-node').forEach(node=>{const act=()=>showMapInfo(node);node.addEventListener('click',act);node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}})});
 }
 function showMapInfo(node){const name=node.dataset.name||'',i=Number(node.dataset.index),c=getList()[i],pop=document.getElementById('mapPopover');if(!pop||!c)return;const text=String(c.places||c.tag||'Explore the district guide.').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').slice(0,180);const title=document.createElement('b');title.textContent='📍 '+name;const detail=document.createElement('small');detail.textContent='Top places: '+text;const button=document.createElement('button');button.type='button';button.className='map-open-btn';button.textContent='Open '+name+' →';button.addEventListener('click',()=>open(name));pop.replaceChildren(title,detail,button);pop.classList.add('show')}
 function init(){const input=document.getElementById('searchInput');if(!input)return;input.addEventListener('input',filter);document.querySelectorAll('.region-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.region-btn').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});b.classList.add('active');b.setAttribute('aria-pressed','true');filter()}));filter()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.exploreUpPhase1Filter=filter;
})();

/* ExploreUP Phase 2: four district tabs, live map shortcuts and itinerary print/PDF */
(function(){
 'use strict';
 const byTab={places:['districtOverview','districtKnowledgeSection'],food:['districtFood'],reach:['districtTransport'],stays:['districtStay']};
 function jump(tab){const ids=byTab[tab]||byTab.places;document.querySelectorAll('.district-tab').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))});const el=document.getElementById(ids[0]);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}
 function initTabs(){document.querySelectorAll('.district-tab').forEach(b=>b.addEventListener('click',()=>jump(b.dataset.tab)));}
 function maps(city,kind){const q=kind==='food'?'Food in ':kind==='stays'?'Hotels and stays in ':kind==='places'?'Tourist places in ':'How to reach ';return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q+city+', Uttar Pradesh');}
 function setMapLinks(city){[['foodMapBtn','food'],['stayMapBtn','stays'],['placeMapBtn','places']].forEach(([id,k])=>{const a=document.getElementById(id);if(a)a.href=maps(city,k)});}
 function addExport(){const result=document.getElementById('planResult');if(!result||document.getElementById('phase2Export'))return;const box=document.createElement('div');box.id='phase2Export';box.className='itinerary-export';box.innerHTML='<button type="button" id="saveItineraryBtn">💾 Save Itinerary</button><button type="button" id="downloadItineraryBtn">📄 Download / Print PDF</button>';result.parentElement.insertBefore(box,result);document.getElementById('saveItineraryBtn').onclick=save;document.getElementById('downloadItineraryBtn').onclick=printItinerary;}
 function getItinerary(){const result=document.getElementById('planResult');return result&&result.innerText.trim()?result.innerHTML:''}
 function save(){const html=getItinerary();if(!html){alert('Pehle itinerary generate karo.');return}try{localStorage.setItem('exploreupSavedItinerary',html);const s=document.getElementById('planStatus');if(s)s.textContent='✅ Itinerary saved on this device.'}catch(e){alert('Itinerary save nahi ho paya.')}}
 function printItinerary(){const result=document.getElementById('planResult');if(!result||!result.innerText.trim()){alert('Pehle itinerary generate karo.');return}const dest=document.getElementById('planDestination')?.value||'ExploreUP';const old=document.getElementById('phase2Print');if(old)old.remove();const wrap=document.createElement('div');wrap.id='phase2Print';wrap.className='phase2-print';wrap.innerHTML='<h1>ExploreUP — '+String(dest).replace(/[<>&]/g,'')+' Itinerary</h1><div class="print-meta">Generated with ExploreUP • '+new Date().toLocaleDateString()+'</div>'+result.innerHTML;document.body.appendChild(wrap);window.print();setTimeout(()=>wrap.remove(),1000)}
 window.exploreUpPhase2={jump,setMapLinks,addExport,printItinerary};
 function init(){initTabs();addExport();const city=window.currentExploreCity||document.getElementById('modalTitle')?.textContent;if(city&&city!=='City')setMapLinks(city)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 const mo=new MutationObserver(()=>{addExport();const city=document.getElementById('modalTitle')?.textContent;if(city&&city!=='City')setMapLinks(city)});mo.observe(document.body,{subtree:true,childList:true});
})();
