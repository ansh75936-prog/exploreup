/* ExploreUP Arya UI bridge — FREE/local mode */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  const inputSelectors=['#aryaInput','#arya-input','[data-arya-input]','input[name="arya"]','textarea[name="arya"]','input[id*="arya" i]','textarea[id*="arya" i]','input[placeholder*="arya" i]','textarea[placeholder*="arya" i]','input[aria-label*="arya" i]','textarea[aria-label*="arya" i]'];
  const isInput=e=>e&&e.matches&&((e.matches('textarea'))||(e.matches('input')&&!/^(button|submit|reset|checkbox|radio|file|hidden)$/i.test(e.type||'')))&&!e.disabled&&!e.readOnly;
  function findInput(){
    for(const s of inputSelectors){const e=document.querySelector(s);if(isInput(e))return e;}
    return [...document.querySelectorAll('input,textarea')].find(e=>isInput(e)&&/arya|ask anything|ask arya|chat with/.test(String(e.placeholder||e.getAttribute('aria-label')||'').toLowerCase()))||null;
  }
  function box(input){let b=document.getElementById('exploreup-arya-live-response');if(!b){b=document.createElement('div');b.id='exploreup-arya-live-response';b.setAttribute('role','status');b.setAttribute('aria-live','polite');b.style.cssText='margin:12px 0;padding:14px 16px;background:#fff;border:1px solid #dce6f2;border-radius:14px;color:#10233f;line-height:1.55;font-size:14px;white-space:pre-wrap;box-shadow:0 5px 18px rgba(0,27,59,.08)';(input?.parentElement||document.body).appendChild(b);}return b;}
  function city(){return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||'').trim();}
  async function send(input){
    const q=String(input?.value||'').replace(/\s+/g,' ').trim();if(!q)return false;
    const b=box(input);b.textContent='Arya • Free\n\nThinking…';
    try{const r=typeof AI.askFree==='function'?AI.askFree(q,city()):null;if(!r||!r.ok)throw Error('unavailable');b.textContent='Arya • Free\n\n'+String(r.answer||'').trim();input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));AI.freeMode=true;return true;}catch(e){b.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.';return false;}
  }
  function looksLikeSend(el,input){
    if(!el)return false;
    const label=String(el.textContent||el.getAttribute('aria-label')||el.title||el.value||'').toLowerCase();
    if(/send|ask|search|arya/.test(label))return true;
    const parent=input?.closest('form,[id*="arya" i],[class*="arya" i]');
    return !!(parent&&parent.contains(el));
  }
  function wire(){
    const input=findInput();if(!input)return false;
    if(input.dataset.exploreupFreeAryaWired==='1')return true;input.dataset.exploreupFreeAryaWired='1';
    const submit=e=>{e.preventDefault();e.stopImmediatePropagation();send(input)};
    input.closest('form')?.addEventListener('submit',submit,true);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey)submit(e)},true);
    document.addEventListener('click',e=>{const el=e.target?.closest?.('button,[role="button"],input[type="submit"],input[type="button"]');if(looksLikeSend(el,input)){e.preventDefault();e.stopImmediatePropagation();send(input)}},true);
    AI.uiWired=true;AI.freeMode=true;return true;
  }
  let tries=0;function boot(){if(wire()||tries++>=160)return;setTimeout(boot,250)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',boot,{once:true});
  new MutationObserver(wire).observe(document.documentElement,{childList:true,subtree:true});
})();