/* ExploreUP Arya AI — V20 OpenAI send bridge
 * Keeps the original V20 panel and controls. The send/Enter events are
 * scoped only to Arya, and the response is rendered inside the existing
 * panel instead of creating a floating/fixed UI element.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=false;
  AI.uiBridgeVersion='v20-openai-send-v2';
  AI.uiWired=false;

  const $=s=>document.querySelector(s);
  function panel(){return $('#aryaPanel');}
  function input(){return $('#aryaInput')||panel()?.querySelector('input[name="arya"],textarea[name="arya"]');}
  function sendButton(){
    const p=panel();
    return $('#aryaSend')||p?.querySelector('.arya-input button')||p?.querySelector('button[onclick*="askArya"]')||p?.querySelector('button[type="submit"],input[type="submit"]');
  }
  function messageHost(){
    const p=panel(),i=input();
    if(!p)return null;
    return p.querySelector('#aryaBody,#aryaMessages,.arya-messages,.arya-chat-messages,[data-arya-messages],.arya-chat-body,.arya-body')||i?.closest('form')?.parentElement||p;
  }
  function addBubble(text,who){
    const host=messageHost(),i=input();
    if(!host)return;
    const wrap=document.createElement('div');
    wrap.className='arya-v20-openai-message '+(who==='user'?'arya-v20-user-message':'arya-v20-ai-message');
    wrap.style.cssText='margin:10px 0;padding:10px 13px;border-radius:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word;';
    if(who==='user'){
      wrap.style.marginLeft='auto';
      wrap.style.maxWidth='88%';
      wrap.style.background='#fff1c9';
      wrap.textContent=text;
    }else{
      wrap.style.maxWidth='94%';
      wrap.style.background='#f4f8fc';
      wrap.textContent=text;
    }
    const form=i?.closest('form');
    if(form&&form.parentElement===host)host.insertBefore(wrap,form);
    else host.appendChild(wrap);
    try{wrap.scrollIntoView({block:'nearest'});}catch(e){}
    return wrap;
  }
  function busy(text){return addBubble(text,'ai');}
  async function run(q){
    const city=String(window.currentExploreCity||$('#modalTitle')?.textContent||'').trim();
    if(!AI.askOpenAI)return null;
    return AI.askOpenAI(q,city);
  }
  function intercept(e){
    const p=panel(),i=input();
    if(!p||!i)return;
    const b=sendButton();
    const target=e.target?.closest?.('button,input[type="submit"],input[type="button"]');
    const isClick=!!(b&&target===b);
    const isSubmit=!!(target&&target.closest?.('form')?.contains(i));
    const isEnter=e.type==='keydown'&&e.key==='Enter'&&!e.shiftKey&&document.activeElement===i;
    if(!(isClick||isSubmit||isEnter))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const q=String(i.value||'').replace(/\s+/g,' ').trim();
    if(!q)return;
    addBubble(q,'user');
    i.value='';
    const wait=busy('Arya is thinking…');
    run(q).then(function(r){
      if(r&&r.ok&&r.answer){
        if(wait)wait.textContent=String(r.answer).trim();
        AI.internetConnected=true;
        AI.freeMode=false;
      }else if(wait){
        wait.textContent='Arya is temporarily unable to connect. Please try again.';
      }
    }).catch(function(){if(wait)wait.textContent='Arya is temporarily unable to connect. Please try again.';});
  }
  function wire(){
    const p=panel(),i=input();
    if(!p||!i||p.dataset.aryaOpenAIWired==='1')return false;
    p.dataset.aryaOpenAIWired='1';
    document.addEventListener('click',intercept,true);
    document.addEventListener('keydown',intercept,true);
    AI.uiWired=true;
    return true;
  }
  function boot(){wire();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',boot,{once:true});
  [250,750,1500,3000,5000].forEach(t=>setTimeout(boot,t));
})();
