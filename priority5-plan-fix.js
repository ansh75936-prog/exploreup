/* ExploreUP Priority 5 — Save/restore + date reliability fix. Non-destructive companion layer. */
(function(){
'use strict';
if(window.__exploreUpP5PlanFixLoaded)return;
window.__exploreUpP5PlanFixLoaded=true;
const KEY='exploreup_priority5_saved_plan_v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function monthIndexSafe(value){const s=String(value||'');const m=s.match(/^\d{4}-(\d{2})/);return m?Math.max(0,Math.min(11,Number(m[1])-1)):new Date().getMonth()}
function repairEventIndex(){try{window.__exploreUpP5MonthIndex=monthIndexSafe}catch(e){}}
function readSaved(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&typeof v==='object'?v:null}catch(e){return null}}
let restoredMounted=false;
function restore(){if(restoredMounted)return true;const v=readSaved();const r=document.getElementById('planResult');if(!v||!r)return false;const existing=document.querySelector('.p5-restored-plan');if(existing){restoredMounted=true;return true}const box=document.createElement('div');box.className='p5box p5-restored-plan';box.innerHTML='<b>💾 Saved plan</b><div class="p5muted">Saved on this device. Restoring replaces the current planner result.</div><div class="p5actions"><button class="p5btn primary" type="button" id="p5RestoreNow">Restore saved plan</button><button class="p5btn" type="button" id="p5DeleteSaved">Delete saved plan</button></div>';r.insertAdjacentElement('beforebegin',box);restoredMounted=true;box.querySelector('#p5RestoreNow').onclick=()=>{r.innerHTML=String(v.html||'');const status=document.getElementById('planStatus');if(status)status.textContent='💾 Saved plan restored.'};box.querySelector('#p5DeleteSaved').onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}box.remove();const status=document.getElementById('planStatus');if(status)status.textContent='Saved plan deleted from this device.'};return true}
function patchSave(){if(typeof window.p5SavePlan!=='function'||window.p5SavePlan.__p5PlanFix)return;const original=window.p5SavePlan;const wrapped=function(){const result=original.apply(this,arguments);setTimeout(()=>{const status=document.getElementById('planStatus');if(status)status.textContent='💾 Plan saved on this device.'},0);return result};wrapped.__p5PlanFix=true;window.p5SavePlan=wrapped}
function mount(){repairEventIndex();patchSave();restore()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;mount()},100)}).observe(document.documentElement,{childList:true,subtree:true});
window.p5GetSavedPlan=readSaved;
window.p5MonthIndex=monthIndexSafe;
})();
