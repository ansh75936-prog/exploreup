/* ExploreUP Arya AI — FREE/local send repair */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=true;
  AI.uiBridgeVersion='safe-free-4';

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
      b.style.cssText='margin:12px 0;padding:14px 16px;background:#fff;border:1px solid #dce6f2;border-radius:14px;color:#10233f;line-height:1.55;font-size:14px;white-space:pre-wrap;box-shadow:0 5px 18px rgba(0,27,59,.08)';
      (i?.parentElement||panel()||document.body).appendChild(b);
    }
    return b;
  }

  function send(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    const i=input();
    const q=String(i?.value||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    const b=box(i);
    b.textContent='Arya • Free\n\nThinking…';
    try{
      const r=typeof AI.askFree==='function'?AI.askFree(q,city()):null;
      if(!r||!r.ok)throw new Error('free_mode_unavailable');
      b.textContent='Arya • Free\n\n'+String(r.answer||'').trim();
      if(i){i.value='';i.dispatchEvent(new Event('input',{bubbles:true}));}
      AI.freeMode=true;
      return true;
    }catch(err){
      b.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.';
      return false;
    }
  }

  function isSendButton(el){
    if(!el||el.disabled)return false;
    if(el.id==='aryaClose'||el.id==='aryaFab')return false;
    if(el.id==='aryaSend')return true;
    const label=String(el.textContent||el.getAttribute('aria-label')||el.getAttribute('title')||el.value||'').toLowerCase();
    return /^(send|ask|ask arya|search)$/.test(label.trim())||/send message|ask arya/.test(label);
  }

  function wire(){
    const i=input();
    if(!i)return false;

    const sendButtons=[];
    const known=$('aryaSend');
    if(known)sendButtons.push(known);
    const p=panel();
    if(p)p.querySelectorAll('button,[role="button"],input[type="submit"],input[type="button"]').forEach(el=>{if(isSendButton(el)&&!sendButtons.includes(el))sendButtons.push(el);});

    sendButtons.forEach(btn=>{
      btn.disabled=false;
      if(btn.dataset.aryaFree4!=='1'){
        btn.dataset.aryaFree4='1';
        btn.addEventListener('click',send,true);
      }
    });

    const form=i.closest('form');
    if(form&&form.dataset.aryaFree4!=='1'){
      form.dataset.aryaFree4='1';
      form.addEventListener('submit',send,true);
    }

    if(i.dataset.aryaFree4!=='1'){
      i.dataset.aryaFree4='1';
      i.addEventListener('input',function(){
        sendButtons.forEach(btn=>{btn.disabled=false;});
      },false);
      i.addEventListener('keydown',function(e){
        if(e.key==='Enter'&&!e.shiftKey)send(e);
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
