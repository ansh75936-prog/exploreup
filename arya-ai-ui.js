/* ExploreUP Arya AI — single V20 send handler
 * Uses the fixed production Vercel API so GitHub Pages cannot accidentally
 * send /api/arya to the static host. Keeps the existing V20 panel/layout.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.uiBridgeVersion='v20-openai-direct-v4';
  AI.freeMode=false;
  const API='https://exploreup-five.vercel.app/api/arya';
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
    const response=await fetch(API+'?v=20260916-4',{
      method:'POST',
      headers:{'Content-Type':'application/json','Cache-Control':'no-cache'},
      body:JSON.stringify({query:String(q||'').trim().slice(0,4000),city:String(city||'').trim().slice(0,120)})
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
      console.warn('ExploreUP Arya OpenAI request failed:',e);
    }
    return false;
  }
  window.askArya=send;
  AI.handleSend=send;
  AI.askOpenAI=askDirect;
  AI.askInternet=askDirect;
})();
