/* ExploreUP V21 Step 3 — Favorites
 * Safe local-only favorites helper. Does not touch Arya AI.
 */
(function(){
  'use strict';
  const KEY='exploreup-favorites-v21';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
  function write(items){localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent('exploreup:favorites-changed',{detail:items}));}
  window.ExploreUPFavorites={
    all:()=>read(),
    has:(name,city='')=>read().some(x=>x.name===String(name)&&x.city===city),
    toggle:(name,type='Place',city='')=>{name=String(name||'').trim();if(!name)return false;const items=read();const i=items.findIndex(x=>x.name===name&&x.city===city);if(i>=0){items.splice(i,1);write(items);return false}items.push({name,type,city});write(items);return true;},
    remove:(name,city='')=>write(read().filter(x=>!(x.name===String(name)&&x.city===city))),
    clear:()=>write([])
  };
  function wire(){document.querySelectorAll('[data-favorite]').forEach(btn=>{if(btn.dataset.favoritesWired)return;btn.dataset.favoritesWired='1';const name=btn.dataset.favorite||btn.textContent.trim();const type=btn.dataset.favoriteType||'Place';const city=btn.dataset.favoriteCity||'';const paint=()=>{const on=window.ExploreUPFavorites.has(name,city);btn.setAttribute('aria-pressed',String(on));btn.textContent=on?'♥ Saved':'♡ Save';};btn.addEventListener('click',()=>{window.ExploreUPFavorites.toggle(name,type,city);paint()});paint()})}
  document.addEventListener('DOMContentLoaded',wire);window.addEventListener('load',wire);
})();
