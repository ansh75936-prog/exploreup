/* ExploreUP Arya AI — FREE/local send repair v6 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=true;
  AI.uiBridgeVersion='safe-free-6';

  const $=id=>document.getElementById(id);
  const panel=()=>$('aryaPanel');
  const input=()=>$('aryaInput')||document.querySelector('[data-arya-input],input[name="arya"],textarea[name="arya"]');

  function city(){
    return String(window.currentExploreCity||$('modalTitle')?.textContent||'').trim();
  }

  function box(i){
    let b=$('exploreup-arya-live-response');
    if(!b){
      b=document.createElement('div');
      b.id='exploreup-arya-live-response';
      b.setAttribute('role','status');
      b.setAttribute('aria-live','polite');
      b.style.cssText='display:block!important;position:relative!important;z-index:1001!important;margin:10px 0!important;padding:14px 16px!important;background:#fff!important;border:1px solid #dce6f2!important;border-radius:14px!important;color:#10233f!important;line-height:1.55!important;font-size:14px!important;white-space:pre-wrap!important;box-shadow:0 5px 18px rgba(0,27,59,.08)!important;max-height:180px!important;overflow:auto!important;pointer-events:none!important;';
      const p=panel();
      const host=i?.parentElement||p||document.body;
      host.appendChild(b);
    }
    const p=panel();
    if(p){p.style.zIndex='1000';p.style.paddingBottom='120px';}
    return b;
  }

  function freeAnswer(q){
    const fn=AI.askFree||AI.askInternet;
    if(typeof fn==='function')return fn(q,city());
    return {ok:true,answer:'Namaste! Main Arya AI hoon. Main ExploreUP ke available places, food, hotels, theatres, transport aur trip planning mein help kar sakta hoon.'};
  }

  function send(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    const i=input();
    const q=String(i?.value||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    const b=box(i);
    b.textContent='Arya • Free\n\nThinking…';
    try{
      const r=freeAnswer(q);
      if(r&&typeof r.then==='function'){
        r.then(x=>{
          const out=x&&x.ok?x.answer:'Arya is temporarily unavailable. Please try again.';
          b.textContent='Arya • Free\n\n'+String(out||'').trim();
        }).catch(()=>{b.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.';});
      }else if(!r||!r.ok){
        b.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.';
      }else{
        b.textContent='Arya • Free\n\n'+String(r.answer||'').trim();
      }
      i.value='';
      i.dispatchEvent(new Event('input',{bubbles:true}));
      AI.freeMode=true;
      return true;
    }catch(err){
      b.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.';
      AI.lastUiError=String(err&&err.message||err);
      return false;
    }
  }

  function belongsToArya(el){
    const p=panel();
    return !!(el&&p&&p.contains(el));
  }

  function clickIsSend(el){
    if(!el||!belongsToArya(el)||el.disabled)return false;
    if(el.id==='aryaClose'||el.id==='aryaFab')return false;
    if(el.id==='aryaSend')return true;
    const label=String(el.getAttribute('aria-label')||el.getAttribute('title')||el.textContent||el.value||'').trim().toLowerCase();
    return /^(send|ask|ask arya|send message)$/.test(label)||/send message|ask arya/.test(label);
  }

  function wire(){
    const i=input(),p=panel();
    if(!i||!p)return false;
    const known=$('aryaSend');
    if(known){
      known.disabled=false;
      if(known.dataset.aryaFree6!=='1'){
        known.dataset.aryaFree6='1';
        known.addEventListener('click',send,true);
      }
    }
    const form=i.closest('form');
    if(form&&form.dataset.aryaFree6!=='1'){
      form.dataset.aryaFree6='1';
      form.addEventListener('submit',send,true);
    }
    if(i.dataset.aryaFree6!=='1'){
      i.dataset.aryaFree6='1';
      i.addEventListener('keydown',function(e){
        if(e.key==='Enter'&&!e.shiftKey)send(e);
      },true);
      i.addEventListener('input',function(){if(known)known.disabled=false;},false);
    }
    if(document.documentElement.dataset.aryaFree6!=='1'){
      document.documentElement.dataset.aryaFree6='1';
      document.addEventListener('click',function(e){
        const t=e.target?.closest?.('button,[role="button"],input[type="submit"],input[type="button"],a');
        if(clickIsSend(t))send(e);
      },true);
      document.addEventListener('keydown',function(e){
        if(e.key==='Enter'&&!e.shiftKey&&e.target===input())send(e);
      },true);
    }
    AI.uiWired=true;
    AI.freeMode=true;
    return true;
  }

  function boot(){wire();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',boot,{once:true});
  [250,750,1500,3000,5000].forEach(t=>setTimeout(boot,t));
  new MutationObserver(boot).observe(document.documentElement,{childList:true,subtree:true});
})();