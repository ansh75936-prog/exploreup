/* ExploreUP Arya AI — single V20 send handler
 * Keeps the existing V20 panel/layout. This is the only file that handles
 * the visible Arya send button and Enter key. OpenAI API access is provided
 * by arya-ai-bridge.js; no duplicate document-level handlers are installed.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.uiBridgeVersion='v20-openai-single-handler-v1';
  AI.freeMode=false;
  AI.uiWired=false;

  function input(){return document.getElementById('aryaInput');}
  function body(){return document.getElementById('aryaBody');}
  function add(text,type){
    if(typeof window.aryaAdd==='function'){
      window.aryaAdd(String(text||''),type||'bot');
      const b=body();
      return b&&b.lastElementChild;
    }
    const b=body();
    if(!b)return null;
    const el=document.createElement('div');
    el.className='arya-msg '+(type||'bot');
    el.textContent=String(text||'');
    b.appendChild(el);
    b.scrollTop=b.scrollHeight;
    return el;
  }

  async function send(){
    const i=input();
    const q=String(i?.value||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    if(i)i.value='';
    add(q,'user');
    const pending=add('Arya is thinking…','bot');
    try{
      if(typeof AI.askOpenAI!=='function')throw new Error('openai_client_missing');
      const city=String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||'').trim();
      const result=await AI.askOpenAI(q,city);
      if(pending?.parentNode)pending.parentNode.removeChild(pending);
      if(result?.ok&&result.answer){
        add(result.answer,'bot');
        AI.internetConnected=true;
        return false;
      }
      add('Arya could not connect to OpenAI right now. Please try again.','bot');
    }catch(e){
      if(pending?.parentNode)pending.parentNode.removeChild(pending);
      add('Arya could not connect to OpenAI right now. Please try again.','bot');
    }
    return false;
  }

  /* The V20 HTML button calls askArya(). Make that one entry point use OpenAI. */
  window.askArya=function(){return send();};
  AI.handleSend=send;

  function wire(){
    const i=input();
    if(!i||i.dataset.aryaOpenAIKeyWired==='1')return;
    i.dataset.aryaOpenAIKeyWired='1';
    i.onkeydown=function(e){
      if(e.key==='Enter'&&!e.shiftKey){
        e.preventDefault();
        send();
        return false;
      }
    };
    AI.uiWired=true;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});
  else wire();
  window.addEventListener('load',wire,{once:true});
  [100,300,700,1500].forEach(t=>setTimeout(wire,t));
})();
