/* ExploreUP Priority 5 — Wishlist → Trip bridge. Non-destructive companion layer. */
(function(){
'use strict';
if(window.__exploreUpP5WishlistLoaded)return;
window.__exploreUpP5WishlistLoaded=true;
const KEY='exploreup_priority5_wishlist_trip_v1';
const readFavs=()=>{try{const raw=localStorage.getItem('exploreup_favs');const v=JSON.parse(raw||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function getSelected(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}}
function setSelected(v){try{localStorage.setItem(KEY,JSON.stringify(v.slice(0,20)))}catch(e){}}
function injectStyle(){if(document.getElementById('p5wl-style'))return;const s=document.createElement('style');s.id='p5wl-style';s.textContent='.p5wl-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.p5wl-btn{border:1px solid #d7e1ed;background:#fff;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:800;cursor:pointer}.p5wl-btn.primary{background:#ffb51b;border-color:#ffb51b}.p5wl-selected{margin:8px 0;padding:9px;border-radius:10px;background:#f7faff;border:1px solid #dfe7f1}.p5wl-chip{display:inline-block;margin:3px 4px 0 0;padding:5px 8px;border-radius:999px;background:#eef5ff;color:#145eaf;font-size:11px;font-weight:800}';document.head.appendChild(s)}
function addPlace(name){const a=getSelected();if(!a.includes(name))a.push(name);setSelected(a);renderBridge()}
function clearPlaces(){setSelected([]);renderBridge()}
function renderBridge(){const panel=document.getElementById('favPanel'),list=document.getElementById('favList');if(!panel||!list)return;let box=document.getElementById('p5WishlistBridge');if(!box){box=document.createElement('div');box.id='p5WishlistBridge';box.className='p5box';list.parentNode.insertBefore(box,list.nextSibling)}const favs=readFavs(),selected=getSelected();box.innerHTML='<b>🧳 Wishlist → Trip</b><div class="p5wl-actions"><button class="p5wl-btn primary" type="button" id="p5wlUse">Use wishlist in trip</button><button class="p5wl-btn" type="button" id="p5wlClear">Clear trip wishlist</button></div><div class="p5wl-selected">'+(selected.length?selected.map(x=>'<span class="p5wl-chip">'+esc(x)+'</span>').join(''):'<span class="p5muted">No places selected for the next trip yet.</span>')+'</div>';
const actions=list.querySelectorAll('.favitem');actions.forEach((item,i)=>{if(item.querySelector('.p5wl-add'))return;const name=favs[i];if(!name)return;const b=document.createElement('button');b.type='button';b.className='p5wl-btn p5wl-add';b.textContent=selected.includes(name)?'✓ Added':'＋ Trip';b.onclick=()=>addPlace(name);item.appendChild(b)});
box.querySelector('#p5wlUse').onclick=useWishlistInTrip;box.querySelector('#p5wlClear').onclick=clearPlaces}
function useWishlistInTrip(){const selected=getSelected(),dest=document.getElementById('planDestination');if(typeof window.openPlanMaker==='function'){window.openPlanMaker();setTimeout(function(){if(dest&&!dest.value&&selected[0])dest.value=selected[0];renderInPlan();},150)}else renderInPlan();}
function renderInPlan(){const r=document.getElementById('planResult');if(!r)return;let old=r.querySelector('.p5wishlist-plan');if(old)old.remove();const selected=getSelected();if(!selected.length)return;const box=document.createElement('div');box.className='p5box p5wishlist-plan';box.innerHTML='<b>🧳 Wishlist stops</b><div class="p5muted">These saved places were selected by you. Fit them into the itinerary where practical; they are not guaranteed route or timing data.</div><div class="p5chips">'+selected.map(x=>'<span class="p5chip">'+esc(x)+'</span>').join('')+'</div>';r.appendChild(box)}
function observe(){injectStyle();renderBridge();renderInPlan()}
window.p5UseWishlist=useWishlistInTrip;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
new MutationObserver(observe).observe(document.documentElement,{childList:true,subtree:true});
})();
