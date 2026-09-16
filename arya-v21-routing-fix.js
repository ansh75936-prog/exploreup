/* ExploreUP Arya V21 — routing fix. Data-preserving. */
(function(){
  'use strict';
  if(window.__exploreUpAryaV21RoutingFix)return;
  window.__exploreUpAryaV21RoutingFix=true;

  const intentOnly=/^(overview|places|food|hotel|hospital|shopping|transport|history|trip|best-time|budget|compare)$/i;

  function city(){
    try{return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||document.querySelector('#breadcrumb')?.textContent?.split('›').pop()||'').trim();}
    catch(e){return '';}
  }

  function install(){
    if(typeof window.aryaAnswer!=='function'){setTimeout(install,250);return;}
    if(window.aryaAnswer.__exploreupV21RoutingFix)return;
    const original=window.aryaAnswer;
    async function fixedAryaAnswer(query,lang){
      let q=String(query||'').trim();
      const c=city();
      if(c && intentOnly.test(q)) q=c+' '+q;
      return original.call(this,q,lang||'en');
    }
    fixedAryaAnswer.__exploreupV21RoutingFix=true;
    fixedAryaAnswer.original=original;
    window.aryaAnswer=fixedAryaAnswer;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.addEventListener('load',install,{once:true});
})();
