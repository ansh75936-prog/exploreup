let favs=[];try{const v=JSON.parse(exploreStorage.get('exploreup_favs')||'[]');favs=Array.isArray(v)?v:[]}catch(e){favs=[];try{exploreStorage.set('exploreup_favs','[]')}catch(_e){}}
function updateFavs(){
 document.getElementById('favCount').textContent=favs.length;
 document.getElementById('favList').innerHTML=favs.length?favs.map((x,i)=>`<div class="favitem">${x} <button onclick="removeFav(${i})" style="float:right;border:0;background:none;cursor:pointer">×</button></div>`).join(''):'<div class="empty">No favourite places saved yet.</div>';
}
function toggleSave(btn,name){
 const i=favs.indexOf(name);
 if(i<0){favs.push(name);btn.classList.add('saved');btn.textContent='♥';}
 else{favs.splice(i,1);btn.classList.remove('saved');btn.textContent='♡';}
 exploreStorage.set('exploreup_favs',JSON.stringify(favs));updateFavs();
}
function removeFav(i){favs.splice(i,1);exploreStorage.set('exploreup_favs',JSON.stringify(favs));updateFavs();document.querySelectorAll('.save').forEach(b=>{const n=b.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];if(n&&!favs.includes(n)){b.classList.remove('saved');b.textContent='♡'}})}
function toggleFavPanel(){const p=document.getElementById('favPanel');p.style.display=p.style.display==='block'?'none':'block';updateFavs()}
async function shareItem(name){
 const text=`Explore ${name} on ExploreUP — Every City Has a Story`;
 if(navigator.share){try{await navigator.share({title:name,text,url:location.href})}catch(e){}}
 else{try{await navigator.clipboard.writeText(`${text} ${location.href}`);alert('Share link copied!')}catch(e){alert(text)}}
}
updateFavs();

const recentKey='exploreup_recent_destinations_v1';
const compareKey='exploreup_compare_v1';
function getRecentDestinations(){try{return JSON.parse(exploreStorage.get(recentKey,'[]'))||[]}catch(e){return []}}
function saveRecentDestination(name){let list=getRecentDestinations().filter(x=>x!==name);list.unshift(name);list=list.slice(0,6);exploreStorage.set(recentKey,JSON.stringify(list));renderRecentDestinations()}
function renderRecentDestinations(){const wrap=document.getElementById('recentWrap'),strip=document.getElementById('recentStrip');if(!wrap||!strip)return;const list=getRecentDestinations();wrap.style.display=list.length?'block':'none';strip.innerHTML=list.map(n=>{const c=cities.find(x=>x.name===n);return c?`<button class="recent-card" onclick="safeOpenCity('${n.replace(/'/g,"\\'")}')">${escapeHtml(c.name)}<small>${escapeHtml(c.tag)}</small></button>`:''}).join('')}
function getCompare(){try{return JSON.parse(exploreStorage.get(compareKey,'[]'))||[]}catch(e){return []}}
function saveCompare(list){exploreStorage.set(compareKey,JSON.stringify(list.slice(0,3)));updateCompareUI()}
function toggleCompareCity(name){let list=getCompare();if(list.includes(name)){list=list.filter(x=>x!==name)}else{if(list.length>=3){alert('Compare up to 3 destinations at a time.');return}list.push(name)}saveCompare(list);if(currentExploreCity===name)updateCompareButton()}
function updateCompareButton(){const b=document.getElementById('compareCityBtn');if(!b)return;const active=getCompare().includes(currentExploreCity);b.textContent=active?'✓ Added to Compare':'⚖️ Add to Compare';b.style.background=active?'var(--gold)':'';b.style.color=active?'#071b35':''}
function updateCompareUI(){const list=getCompare(),bar=document.getElementById('compareBar'),count=document.getElementById('compareCount'),body=document.getElementById('compareBody');if(count)count.textContent=list.length;if(bar)bar.style.display=list.length?'block':'none';if(!body)return;if(!list.length){body.innerHTML='<div class="compare-empty">Open a destination and tap “Add to Compare” to start.</div>';return}body.innerHTML=`<div class="comparegrid">${list.map(n=>{const c=cities.find(x=>x.name===n);if(!c)return '';return `<div class="comparecell"><h4>${escapeHtml(c.name)}</h4><p><b>Style:</b> ${escapeHtml(c.tag)}</p><p><b>Best time:</b> ${escapeHtml(c.time)}</p><p><b>Budget:</b> ${escapeHtml(c.budget)}</p><p><b>Places:</b> ${escapeHtml(c.places)}</p><p><b>Food:</b> ${escapeHtml(c.food)}</p><p><b>Shopping:</b> ${escapeHtml(c.shop)}</p><button class="compare-remove" onclick="toggleCompareCity('${n.replace(/'/g,"\\'")}');updateCompareUI()">Remove</button><button class="compare-remove" style="margin-left:5px" onclick="safeOpenCity('${n.replace(/'/g,"\\'")}');toggleComparePanel()">Open</button></div>`}).join('')}</div><div style="margin-top:12px"><button class="compare-remove" onclick="saveCompare([]);toggleComparePanel()">Clear comparison</button></div>`}
function toggleComparePanel(){const p=document.getElementById('comparePanel');if(!p)return;p.style.display=p.style.display==='block'?'none':'block';updateCompareUI()}
renderRecentDestinations();updateCompareUI();
