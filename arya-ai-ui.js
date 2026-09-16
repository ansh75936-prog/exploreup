/* ExploreUP Arya AI — FREE/local repair bridge
 * Owns only Arya's open/close/send wiring.
 * Capture handlers prevent the old inline/API handler from blocking FREE mode.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=true;
  AI.uiBridgeVersion='safe-free-3';

  const $=id=>document.getElementById(id);
  const input=()=>$('aryaInput')||document.querySelector('[data-arya-input],input[name="arya"],textarea[name="arya"]');
  const panel=()=>$('aryaPanel');

  function open(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    const p=panel(); if(!p)return;
    p.style.display='flex'; p.removeAttribute('hidden'); p.setAttribute('aria-hidden','false');
    const i=input(); if(i)setTimeout(()=>{try{i.focus();}catch(_){}},0);
  }
  function close(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    const p=panel(); if(!p)return;
    p.style.display='none'; p.setAttribute('aria-hidden','true');
  }
  function box(i){
    let b=$('exploreup-arya-live-response');
    if(!b){
      b=document.createElement('div'); b.id='exploreup-arya-live-response';
      b.setAttribute('role','status'); b.setAttribute('aria-live','polite');
      b.style.cssText='margin:12px 0;padding:14px 16px;background:#fff;border:1px solid #dce6f2;border-radius:14px;color:#10233f;line-height:1.55;font-size:14px;white-space:pre-wrap;box-shadow:0 5px 18px rgba(0,27,59,.08)';
      (i?.parentElement||panel()||document.body).appendChild(b);
    }
    return b;
  }
  function city(){return String(window.currentExploreCity||$('modalTitle')?.textContent||'').trim();}
  function send(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    const i=input(),q=String(i?.value||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    const b=box(i); b.textContent='Arya • Free\n\nThinking…';
    try{
      const r=typeof AI.askFree==='function'?AI.askFree(q,city()):null;
      if(!r||!r.ok)throw Error('free_mode_unavailable');
      b.textContent='Arya • Free\n\n'+String(r.answer||'').trim();
      if(i){i.value='';i.dispatchEvent(new Event('input',{bubbles:true}));}
      AI.freeMode=true; return true;
    }catch(err){
      b.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.'; return false;
    }
  }
  function wire(){
    const fab=$('aryaFab'),closeBtn=$('aryaClose'),sendBtn=$('aryaSend'),i=input();
    if(fab&&fab.dataset.aryaSafe3!=='1'){fab.dataset.aryaSafe3='1';fab.addEventListener('click',open,true);}
    if(closeBtn&&closeBtn.dataset.aryaSafe3!=='1'){closeBtn.dataset.aryaSafe3='1';closeBtn.addEventListener('click',close,true);}
    if(sendBtn&&sendBtn.dataset.aryaSafe3!=='1'){sendBtn.dataset.aryaSafe3='1';sendBtn.addEventListener('click',send,true);}
    if(i&&i.dataset.aryaSafe3!=='1'){
      i.dataset.aryaSafe3='1';
      i.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey)send(e);},true);
    }
    AI.uiWired=!!(fab||closeBtn||sendBtn||i);
  }
  function boot(){wire();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',boot,{once:true});
  [250,1000,2500,5000].forEach(t=>setTimeout(boot,t));
})();
