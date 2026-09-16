/* ExploreUP Arya AI — FREE/local send repair v5 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=true;
  AI.uiBridgeVersion='safe-free-5';
  const $=id=>document.getElementById(id);
  const panel=()=>$('aryaPanel');
  const input=()=>$('aryaInput')||document.querySelector('[data-arya-input],input[name="arya"],textarea[name="arya"]');
  function city(){return String(window.currentExploreCity||$('modalTitle')?.textContent||'').trim();}
  function box(i){
    let b=$('exploreup-arya-live-response');
    if(!b){
      b=document.createElement('div');b.id='exploreup-arya-live-response';b.setAttribute('role','status');b.setAttribute('aria-live','polite');
      b.style.cssText='margin:12px 0;padding:14px 16px;background:#fff;border:1px solid #dce6f2;border-radius:14px;color:#10233f;line-height:1.55;font-size:14px;white-space:pre-wrap;box-shadow:0 5px 18px rgba(0,27,59,.08)';
      (i?.parentElement||panel()||document.body).appendChild(b);
    } return b;
  }
  function send(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    const i=input(),q=String(i?.value||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    const b=box(i);b.textContent='Arya • Free\n\nThinking…';
    try{
      const r=typeof AI.askFree==='function'?AI.askFree(q,city()):null;
      if(!r||!r.ok)throw Error('free_mode_unavailable');
      b.textContent='Arya • Free\n\n'+String(r.answer||'').trim();
      i.value='';i.dispatchEvent(new Event('input',{bubbles:true}));
      AI.freeMode=true;return true;
    }catch(err){b.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.';return false;}
  }
  function isSend(el,i){
    if(!el||el.disabled||el.id==='aryaClose'||el.id==='aryaFab')return false;
    if(el.id==='aryaSend')return true;
    const s=(el.tagName||'').toLowerCase();
    const label=String(el.textContent||el.getAttribute('aria-label')||el.getAttribute('title')||el.value||'').trim().toLowerCase();
    if(/send|ask arya|send message/.test(label))return true;
    if(i&&panel()?.contains(el)){
      const parent=i.parentElement;
      if(parent&&parent.contains(el)&&s!=='input'&&s!=='textarea')return true;
      if(el.closest('form')&&el.closest('form').contains(i))return true;
    }
    return false;
  }
  function wire(){
    const i=input(),p=panel();
    if(!i)return false;
    const known=$('aryaSend');
    if(known&&known.dataset.aryaFree5!=='1'){known.dataset.aryaFree5='1';known.disabled=false;known.addEventListener('click',send,true);}
    const form=i.closest('form');
    if(form&&form.dataset.aryaFree5!=='1'){form.dataset.aryaFree5='1';form.addEventListener('submit',send,true);}
    if(i.dataset.aryaFree5!=='1'){
      i.dataset.aryaFree5='1';
      i.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey)send(e);},true);
      i.addEventListener('input',()=>{if(known)known.disabled=false;},false);
    }
    if(p&&p.dataset.aryaFree5!=='1'){
      p.dataset.aryaFree5='1';
      p.addEventListener('click',function(e){
        const el=e.target?.closest?.('button,[role="button"],input[type="submit"],input[type="button"],a,div,span');
        if(isSend(el,i))send(e);
      },true);
    }
    AI.uiWired=true;AI.freeMode=true;return true;
  }
  function boot(){wire();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',boot,{once:true});
  [250,750,1500,3000,5000].forEach(t=>setTimeout(boot,t));
  new MutationObserver(boot).observe(document.documentElement,{childList:true,subtree:true});
})();