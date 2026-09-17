/* ExploreUP V21 Step 3 — Favorites
 * Safe local-only favorites helper. Does not touch Arya AI.
 * Bridges the existing .save / Save-this-destination UI.
 */
(function(){
  'use strict';
  const KEY='exploreup-favorites-v21';
  function read(){try{const value=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(value)?value:[]}catch(e){return[]}}
  function write(items){try{localStorage.setItem(KEY,JSON.stringify(items));}catch(e){return false}try{window.dispatchEvent(new CustomEvent('exploreup:favorites-changed',{detail:items}));}catch(e){}return true}
  window.ExploreUPFavorites={
    all:()=>read(),
    has:(name,city='')=>read().some(x=>x.name===String(name)&&x.city===String(city||'')),
    toggle:(name,type='Place',city='')=>{name=String(name||'').trim();city=String(city||'').trim();type=String(type||'Place').trim()||'Place';if(!name)return false;const items=read();const i=items.findIndex(x=>x.name===name&&x.city===city);if(i>=0){items.splice(i,1);write(items);return false}items.push({name,type,city});write(items);return true},
    remove:(name,city='')=>write(read().filter(x=>!(x.name===String(name)&&x.city===String(city||'')))),
    clear:()=>write([])
  };
  function inferLegacyName(btn){
    const raw=btn.getAttribute('onclick')||'';
    const m=raw.match(/toggleSave\s*\(\s*this\s*,\s*['\"]([^'\"]+)['\"]\s*\)/i);
    if(m)return m[1].trim();
    const card=btn.closest('.gem,.foodcard,.mallcard,.blog,.card,.city,.detail');
    const heading=card&&card.querySelector('h3,h2,b');
    return heading?heading.textContent.trim():'';
  }
  function currentCity(){try{return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||'').trim()}catch(e){return ''}}
  function wireButton(btn,getMeta){
    if(!btn||btn.dataset.favoritesWired)return;
    btn.dataset.favoritesWired='1';
    const meta=()=>{const x=getMeta();return{name:String(x.name||'').trim(),type:String(x.type||'Place').trim()||'Place',city:String(x.city||'').trim()}};
    const paint=()=>{const x=meta();if(!x.name)return;const on=window.ExploreUPFavorites.has(x.name,x.city);btn.setAttribute('aria-pressed',String(on));btn.textContent=on?'♥ Saved':'♡ Save';btn.classList.toggle('saved',on)};
    btn.onclick=null;
    btn.addEventListener('click',()=>{const x=meta();if(x.name)window.ExploreUPFavorites.toggle(x.name,x.type,x.city);paint();updateFavUI()});
    paint();
  }
  function addFavoritesLink(){
    if(location.pathname.endsWith('/favorites.html')||document.getElementById('v21FavoritesLink'))return;
    const link=document.createElement('a');link.id='v21FavoritesLink';link.href='./favorites.html';link.textContent='♥ Favorites';link.setAttribute('aria-label','Open saved favorites');
    Object.assign(link.style,{position:'fixed',right:'18px',bottom:'18px',zIndex:'9999',background:'#071b35',color:'#fff',padding:'12px 17px',borderRadius:'30px',fontWeight:'800',fontSize:'13px',textDecoration:'none',boxShadow:'0 8px 25px #001b3b40'});
    document.body.appendChild(link);
  }
  function wire(){
    document.querySelectorAll('[data-favorite]').forEach(btn=>wireButton(btn,()=>({name:btn.dataset.favorite||btn.textContent.trim(),type:btn.dataset.favoriteType||'Place',city:btn.dataset.favoriteCity||currentCity()})));
    document.querySelectorAll('.save').forEach(btn=>wireButton(btn,()=>({name:inferLegacyName(btn),type:'Place',city:btn.dataset.favoriteCity||''})));
    const cityBtn=document.getElementById('saveCityBtn');
    if(cityBtn)wireButton(cityBtn,()=>({name:currentCity(),type:'Destination',city:currentCity()}));
    const bar=document.querySelector('.favbar');
    if(bar&&!bar.dataset.favoritesBarWired){bar.dataset.favoritesBarWired='1';bar.onclick=null;bar.textContent='♥ Favorites ';const count=document.createElement('span');count.id='v21FavCount';bar.appendChild(count);bar.addEventListener('click',()=>{location.href='./favorites.html'})}
    addFavoritesLink();
    updateFavUI();
  }
  function updateFavUI(){
    const count=document.getElementById('v21FavCount');if(count)count.textContent=String(read().length);
    document.querySelectorAll('[data-favorite]').forEach(btn=>{if(btn.dataset.favoritesWired){const name=btn.dataset.favorite||btn.textContent.trim();const city=btn.dataset.favoriteCity||currentCity();const on=window.ExploreUPFavorites.has(name,city);btn.setAttribute('aria-pressed',String(on));btn.textContent=on?'♥ Saved':'♡ Save';btn.classList.toggle('saved',on)}});
  }
  document.addEventListener('DOMContentLoaded',wire);
  window.addEventListener('load',wire);
  window.addEventListener('exploreup:favorites-changed',updateFavUI);
})();
