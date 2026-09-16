/* ExploreUP Arya AI — single OpenAI runtime bridge
 * V20 panel/layout stays untouched. This file owns the Arya send action.
 * The page's original askArya name is replaced with this one authoritative
 * OpenAI handler so the old local/planner response cannot take over.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=false;
  AI.internetConnected=false;
  AI.uiBridgeVersion='v20-openai-single-handler-v2';

  const aliases={
    theater:'theatre',theaters:'theatres','theatre hall':'theatre','movie hall':'theatre','movie halls':'theatres',
    hotel:'hotel',hotels:'hotels',stay:'stay',stays:'stays',room:'room',rooms:'rooms',
    aspatal:'hospital',aspataal:'hospital',hospital:'hospital',hospitals:'hospitals',clinic:'clinic',clinics:'clinics',
    dawai:'pharmacy','dawai ki dukaan':'pharmacy','medical store':'pharmacy','medical shop':'pharmacy',
    'railway station':'railway',railway:'railway',train:'train','bus stand':'bus',airport:'airport',
    ghumna:'ghoomna',ghumne:'ghoomne',ghoomna:'ghoomna',ghoomne:'ghoomne',
    kaha:'kahan',kidhar:'kahan',kahaan:'kahan',kahan:'kahan',
    batao:'batao',btana:'batao',btao:'batao',dikhao:'dikhao',dikhana:'dikhao',
    khana:'food',khane:'food',khaana:'food',food:'food',restaurant:'restaurant',restaurants:'restaurants',
    shopping:'shopping',market:'market',bazaar:'bazaar',mall:'mall',
    'trip plan':'trip plan','travel plan':'trip plan',itinerary:'itinerary',planner:'planner',
    '1 day':'1 day','2 day':'2 day','3 day':'3 day','one day':'1 day','two day':'2 day','three day':'3 day'
  };
  function escapeRegex(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  function normalizeQuery(value){
    let text=String(value||'').replace(/[\u00A0\t]+/g,' ').replace(/\s+/g,' ').trim();
    if(!text)return text;
    Object.keys(aliases).sort((a,b)=>b.length-a.length).forEach(function(from){
      text=text.replace(new RegExp('\\b'+escapeRegex(from)+'\\b','gi'),aliases[from]);
    });
    return text;
  }
  function currentDistrict(){
    try{return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||document.querySelector('#breadcrumb')?.textContent?.split('›').pop()||'').trim();}
    catch(e){return '';}
  }
  function addMessage(text,who){
    const body=document.getElementById('aryaBody');
    if(!body)return null;
    if(typeof window.aryaAdd==='function')return window.aryaAdd(text,who);
    const el=document.createElement('div');
    el.className='arya-msg '+(who==='user'?'user':'bot');
    el.textContent=String(text||'');
    body.appendChild(el);
    body.scrollTop=body.scrollHeight;
    return el;
  }

  async function askOpenAI(query,city){
    const q=normalizeQuery(query);
    if(!q)return {ok:false,error:'empty'};
    try{
      const response=await fetch('/api/arya',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({query:q,city:String(city||currentDistrict()).trim()})
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.answer)throw new Error('arya_api_failed');
      AI.internetConnected=true;
      AI.freeMode=false;
      return {ok:true,answer:String(data.answer).trim(),source:'openai'};
    }catch(error){
      AI.internetConnected=false;
      return {ok:false,error:'api_unavailable'};
    }
  }

  AI.normalizeQuery=normalizeQuery;
  AI.askFree=async function(){return {ok:false,error:'free_mode_disabled'};};
  AI.askInternet=askOpenAI;
  AI.askOpenAI=askOpenAI;
  AI.knowledge=window.ExploreUPAryaKnowledge||{};
  AI.answerRouting='openai-first';

  async function handleSend(queryFromButton){
    const input=document.getElementById('aryaInput');
    const q=String(queryFromButton||input?.value||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    if(input&&(!queryFromButton||input.value===q))input.value='';
    addMessage(q,'user');
    const pending=addMessage('Arya is thinking…','bot');
    const result=await askOpenAI(q,currentDistrict());
    if(pending&&pending.parentNode)pending.parentNode.removeChild(pending);
    if(result&&result.ok&&result.answer){
      addMessage(result.answer,'bot');
    }else{
      addMessage('Arya could not connect to OpenAI right now. Please try again.','bot');
    }
    return false;
  }

  function installSingleHandler(){
    /* V20 inline buttons call window.askArya(). Replacing that single global
       entry point is safer than adding document-level competing listeners. */
    window.askArya=function(){
      return handleSend();
    };
    const input=document.getElementById('aryaInput');
    if(input&&input.dataset.aryaOpenAIKeyWired!=='1'){
      input.dataset.aryaOpenAIKeyWired='1';
      input.onkeydown=function(e){
        if(e&&e.key==='Enter'&&!e.shiftKey){
          e.preventDefault();
          handleSend();
          return false;
        }
      };
    }
    const button=document.getElementById('aryaSend');
    if(button){
      button.dataset.aryaOpenAIWired='1';
    }
    return true;
  }

  AI.handleSend=handleSend;
  function boot(){installSingleHandler();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('load',boot,{once:true});
  [100,250,500,750,1200,2000,3000,5000].forEach(function(t){setTimeout(boot,t);});
})();