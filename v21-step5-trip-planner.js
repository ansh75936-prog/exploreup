/* ExploreUP V21 Step 5 — Trip Planner
 * Local-only planner. Saves only the user's selected city/days and stops.
 * Arya AI is untouched.
 */
(function(){
  'use strict';
  const KEY='exploreup-trip-v21';
  const defaults={city:'',days:1,stops:{}};
  function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&typeof x==='object'?{...defaults,...x,stops:x.stops&&typeof x.stops==='object'?x.stops:{}}:{...defaults}}catch(e){return {...defaults}}}
  function write(x){try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch(e){return false}}
  function render(){
    const root=document.getElementById('v21TripPlanner'); if(!root)return;
    const x=read();
    root.querySelectorAll('[data-trip-day]').forEach(el=>{const d=el.getAttribute('data-trip-day');el.classList.toggle('selected',Number(d)===Number(x.days));});
    root.querySelectorAll('[data-trip-stop]').forEach(btn=>{const day=btn.closest('[data-trip-day-card]')?.getAttribute('data-trip-day-card')||'1';const id=btn.getAttribute('data-trip-stop');const arr=Array.isArray(x.stops[day])?x.stops[day]:[];const on=arr.includes(id);btn.setAttribute('aria-pressed',String(on));btn.textContent=on?'✓ Added':'＋ Add';btn.classList.toggle('added',on);});
    const summary=root.querySelector('[data-trip-summary]');
    if(summary){const total=Object.values(x.stops).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);summary.textContent=(x.city?x.city+' • ':'')+x.days+' day'+(x.days===1?'':'s')+' • '+total+' stop'+(total===1?'':'s')+' planned';}
  }
  function wire(){
    const root=document.getElementById('v21TripPlanner'); if(!root||root.dataset.wired)return;
    root.dataset.wired='1';
    root.querySelectorAll('[data-trip-day]').forEach(btn=>btn.addEventListener('click',()=>{const x=read();x.days=Number(btn.getAttribute('data-trip-day'))||1;write(x);render();}));
    root.querySelectorAll('[data-trip-stop]').forEach(btn=>btn.addEventListener('click',()=>{const x=read();const day=btn.closest('[data-trip-day-card]')?.getAttribute('data-trip-day-card')||'1';const id=btn.getAttribute('data-trip-stop');x.stops[day]=Array.isArray(x.stops[day])?x.stops[day]:[];const i=x.stops[day].indexOf(id);if(i>=0)x.stops[day].splice(i,1);else x.stops[day].push(id);write(x);render();}));
    const city=root.querySelector('[data-trip-city]');
    if(city){city.value=read().city||city.value||'';city.addEventListener('input',()=>{const x=read();x.city=city.value.trim().slice(0,80);write(x);render();});}
    const clear=root.querySelector('[data-trip-clear]'); if(clear)clear.addEventListener('click',()=>{write({...defaults});render();});
    render();
  }
  window.ExploreUPTripPlanner={read,save:write,render};
  document.addEventListener('DOMContentLoaded',wire);window.addEventListener('load',wire);
})();
