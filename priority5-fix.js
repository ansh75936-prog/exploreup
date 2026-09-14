/* ExploreUP Priority 5 bug-safety patch. Non-destructive companion layer. */
(function(){
'use strict';
if(window.__exploreUpPriority5FixLoaded)return;
window.__exploreUpPriority5FixLoaded=true;
function wrapPlanner(){
  const fn=window.makeAryaPlan;
  if(typeof fn!=='function'||fn.__p5wrapped)return;
  const wrapped=async function(){
    const result=await fn.apply(this,arguments);
    setTimeout(function(){
      if(typeof window.__exploreUpP5RenderOnce==='function') window.__exploreUpP5RenderOnce();
    },80);
    return result;
  };
  wrapped.__p5wrapped=true;
  window.makeAryaPlan=wrapped;
}
function dedupe(){
  const results=document.getElementById('planResult');
  if(!results)return;
  const boxes=results.querySelectorAll('.p5box');
  boxes.forEach(function(box,i){if(i>0 && box.id!=='p5Controls')box.remove();});
}
function renderOnce(){
  if(typeof window.p5SavePlan!=='function')return;
  const r=document.getElementById('planResult');
  const dest=document.getElementById('planDestination');
  if(!r||!dest||!dest.value.trim())return;
  dedupe();
}
window.__exploreUpP5RenderOnce=renderOnce;
wrapPlanner();
new MutationObserver(function(){wrapPlanner();dedupe();}).observe(document.documentElement,{childList:true,subtree:true});
})();
