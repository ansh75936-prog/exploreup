/* ExploreUP Arya AI — single V20 send handler
 * Keeps the existing V20 panel/layout. Existing V20 HTML buttons and Enter
 * wiring call window.askArya(); this file replaces that function only.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.uiBridgeVersion='v20-openai-direct-v3';
  AI.freeMode=false;

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

  function apiTargets(){
    const list=[];
    const origin=String(window.location.origin||'').replace(/\/$/,'');
    if(origin)list.push(origin+'/api/arya');
    const production='https://exploreup-five.vercel.app/api/arya';
    if(!list.includes(production))list.push(production);
    return list;
  }

  async function askDirect(q,city){
    let lastError=null;
    for(const url of apiTargets()){
      try{
        const response=await fetch(url,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({query:q,city:city||''})
        });
        const data=await response.json().catch(function(){return {};});
        if(response.ok&&data.answer)return String(data.answer).trim();
        lastError=new Error(String(data.error||('http_'+response.status)));
      }catch(e){lastError=e;}
    }
    throw lastError||new Error('arya_api_unavailable');
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

  // The existing V20 inline Ask button and Enter listener both resolve this name.
  // No extra click/keydown listeners are installed here, preventing duplicate sends.
  window.askArya=send;
  AI.handleSend=send;
  AI.askOpenAI=askDirect;
  AI.askInternet=askDirect;
})();
