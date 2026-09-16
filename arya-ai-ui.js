/* ExploreUP Arya AI — FREE/local repair bridge
 * Owns only Arya's open/close/send wiring.
 * Does not touch any other ExploreUP feature or global clicks.
 */
(function(){
  'use strict';
  const AI = window.ExploreUPAryaAI = window.ExploreUPAryaAI || {};
  AI.freeMode = true;
  AI.uiBridgeVersion = 'safe-free-2';

  function get(id){ return document.getElementById(id); }
  function input(){ return get('aryaInput') || document.querySelector('[data-arya-input], input[name="arya"], textarea[name="arya"]'); }
  function panel(){ return get('aryaPanel'); }

  function openArya(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    const p=panel();
    if(!p) return;
    p.style.display='flex';
    p.removeAttribute('hidden');
    p.setAttribute('aria-hidden','false');
    const i=input();
    if(i) setTimeout(function(){ try{i.focus();}catch(_){} },0);
  }

  function closeArya(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    const p=panel();
    if(!p) return;
    p.style.display='none';
    p.setAttribute('aria-hidden','true');
  }

  function responseBox(i){
    let b=get('exploreup-arya-live-response');
    if(!b){
      b=document.createElement('div');
      b.id='exploreup-arya-live-response';
      b.setAttribute('role','status');
      b.setAttribute('aria-live','polite');
      b.style.cssText='margin:12px 0;padding:14px 16px;background:#fff;border:1px solid #dce6f2;border-radius:14px;color:#10233f;line-height:1.55;font-size:14px;white-space:pre-wrap;box-shadow:0 5px 18px rgba(0,27,59,.08)';
      (i && i.parentElement ? i.parentElement : panel() || document.body).appendChild(b);
    }
    return b;
  }

  function city(){
    return String(window.currentExploreCity || get('modalTitle')?.textContent || '').trim();
  }

  function send(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    const i=input();
    const q=String(i?.value||'').replace(/\s+/g,' ').trim();
    if(!q) return false;
    const b=responseBox(i);
    b.textContent='Arya • Free\n\nThinking…';
    try{
      const r=typeof AI.askFree==='function' ? AI.askFree(q,city()) : null;
      if(!r || !r.ok) throw new Error('free_mode_unavailable');
      b.textContent='Arya • Free\n\n'+String(r.answer||'').trim();
      if(i){ i.value=''; i.dispatchEvent(new Event('input',{bubbles:true})); }
      AI.freeMode=true;
      return true;
    }catch(err){
      b.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.';
      return false;
    }
  }

  function wire(){
    const fab=get('aryaFab'), close=get('aryaClose'), sendBtn=get('aryaSend'), i=input();
    if(fab && fab.dataset.aryaSafeWired!=='1'){
      fab.dataset.aryaSafeWired='1';
      fab.addEventListener('click',openArya,false);
    }
    if(close && close.dataset.aryaSafeWired!=='1'){
      close.dataset.aryaSafeWired='1';
      close.addEventListener('click',closeArya,false);
    }
    if(sendBtn && sendBtn.dataset.aryaSafeWired!=='1'){
      sendBtn.dataset.aryaSafeWired='1';
      sendBtn.addEventListener('click',send,false);
    }
    if(i && i.dataset.aryaSafeWired!=='1'){
      i.dataset.aryaSafeWired='1';
      i.addEventListener('keydown',function(e){ if(e.key==='Enter' && !e.shiftKey) send(e); },false);
    }
    AI.uiWired=!!(fab||close||sendBtn||i);
  }

  function boot(){ wire(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('load',boot,{once:true});
  setTimeout(boot,250);
  setTimeout(boot,1000);
  setTimeout(boot,2500);
})();
