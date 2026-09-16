/* ExploreUP Arya AI — single V20 send handler
 * Keeps the existing V20 panel/layout. This is the only visible Arya
 * send/Enter handler. It calls the same-origin /api/arya endpoint directly.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.uiBridgeVersion='v20-openai-direct-v2';
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

  async function askDirect(q,city){
    const response=await fetch('/api/arya',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'same-origin',
      body:JSON.stringify({query:q,city:city||''})
    });
    const data=await response.json().catch(function(){return {};});
    if(!response.ok||!data.answer)throw new Error(String(data.error||('http_'+response.status)));
    return String(data.answer).trim();
  }

  async function send(){
    const i=input();
    const q=String(i?.value||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    if(i)i.value='';
    add(q,'user');
    const pending=add('Arya is thinking…','bot');
    try{
      const city=String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||'').trim();
      const answer=await askDirect(q,city);
      if(pending?.parentNode)pending.parentNode.removeChild(pending);
      add(answer,'bot');
      AI.internetConnected=true;
      AI.freeMode=false;
    }catch(e){
      if(pending?.parentNode)pending.parentNode.removeChild(pending);
      add('Arya could not connect to OpenAI right now. Please try again.','bot');
      AI.internetConnected=false;
    }
    return false;
  }

  window.askArya=function(){return send();};
  AI.handleSend=send;
  AI.askOpenAI=askDirect;
  AI.askInternet=askDirect;

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
  [100,300,700,1500].forEach(function(t){setTimeout(wire,t);});
})();
