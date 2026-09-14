/* ExploreUP Priority 5 — Wishlist safety/flow fix. Non-destructive companion layer. */
(function(){
'use strict';
if(window.__exploreUpP5WishlistFixLoaded)return;
window.__exploreUpP5WishlistFixLoaded=true;
const KEY='exploreup_priority5_wishlist_trip_v1';
const get=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function render(){const r=document.getElementById('planResult');if(!r)return;const selected=get(),key=selected.join('\u0001');const old=r.querySelector('.p5wishlist-plan');if(!selected.length){if(old)old.remove();return}if(old&&old.dataset.key===key)return;if(old)old.remove();const box=document.createElement('div');box.className='p5box p5wishlist-plan';box.dataset.key=key;box.innerHTML='<b>🧳 Wishlist stops</b><div class="p5muted">Your saved places will be treated as optional stops inside the selected district plan. They do not replace the destination or provide guaranteed route/timing data.</div><div class="p5chips">'+selected.map(x=>'<span class="p5chip">'+esc(x)+'</span>').join('')+'</div>';r.appendChild(box)}
function open(){const selected=get(),dest=document.getElementById('planDestination');if(typeof window.openPlanMaker==='function')window.openPlanMaker();setTimeout(()=>{render();if(!dest?.value&&selected.length){const s=document.getElementById('planStatus');if(s)s.textContent='🧳 Wishlist loaded. Select a district/city to build the trip.'}},150)}
if(typeof window.p5UseWishlist!=='function')window.p5UseWishlist=open;
let scheduled=false;
function observe(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;render()},50)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
new MutationObserver(observe).observe(document.documentElement,{childList:true,subtree:true});
})();
