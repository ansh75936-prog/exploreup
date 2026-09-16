/* ExploreUP Arya AI — secure OpenAI runtime bridge
 * V20 compatibility: keep the original Arya panel, bubbles and controls.
 * The V20 page defines askArya() inside its main script. Replacing only
 * window.aryaAnswer() does not affect that lexical function call, so this
 * bridge replaces the global askArya handler itself after V20 is loaded.
 */
(function(){
  'use strict';
  const K=window.ExploreUPAryaKnowledge||{};
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=false;
  AI.internetConnected=false;
  AI.uiBridgeVersion='v20-openai-direct';

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
  function getContext(){
    const data=K.siteMap||{};
    return {brand:K.brand||'ExploreUP',assistant:K.assistantName||'Arya AI',city:currentDistrict(),categories:Array.isArray(data.categories)?data.categories.slice():[],features:Array.isArray(data.existingDistrictFeatures)?data.existingDistrictFeatures.slice():[],rules:Array.isArray(K.rules)?K.rules.slice():[],noFakeData:true,language:K.language||null};
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
  AI.getContext=getContext;
  AI.askFree=async function(){return {ok:false,error:'free_mode_disabled'};};
  AI.askInternet=askOpenAI;
  AI.askOpenAI=askOpenAI;
  AI.knowledge=K;

  function renderOpenAIAnswer(q){
    const input=document.getElementById('aryaInput');
    const body=document.getElementById('aryaBody');
    if(!input||!body)return;
    const text=String(q||input.value||'').trim();
    if(!text)return;

    if(typeof window.aryaAdd==='function') window.aryaAdd(text,'user');
    else {
      const user=document.createElement('div');
      user.className='arya-msg user';
      user.textContent=text;
      body.appendChild(user);
    }
    input.value='';

    const temp=document.createElement('div');
    temp.className='arya-msg bot';
    temp.textContent='Arya is thinking…';
    body.appendChild(temp);
    body.scrollTop=body.scrollHeight;

    askOpenAI(text,currentDistrict()).then(function(result){
      temp.remove();
      if(result&&result.ok&&result.answer){
        if(typeof window.aryaAdd==='function') window.aryaAdd(result.answer,'bot');
        else {
          const answer=document.createElement('div');
          answer.className='arya-msg bot';
          answer.textContent=result.answer;
          body.appendChild(answer);
        }
      }else{
        if(typeof window.aryaAdd==='function') window.aryaAdd('Arya could not connect to OpenAI right now. Please try again.','bot');
        else {
          const answer=document.createElement('div');
          answer.className='arya-msg bot';
          answer.textContent='Arya could not connect to OpenAI right now. Please try again.';
          body.appendChild(answer);
        }
      }
      body.scrollTop=body.scrollHeight;
    }).catch(function(){
      temp.remove();
      if(typeof window.aryaAdd==='function') window.aryaAdd('Arya could not connect to OpenAI right now. Please try again.','bot');
    });
  }

  function wire(){
    if(typeof window.askArya!=='function')return false;
    if(window.askArya.__exploreUpOpenAI)return true;
    const original=window.askArya;
    const openAIHandler=function(){
      const input=document.getElementById('aryaInput');
      renderOpenAIAnswer(input?input.value:'');
    };
    openAIHandler.__exploreUpOpenAI=true;
    openAIHandler.__exploreUpOriginal=original;
    window.askArya=openAIHandler;
    AI.answerRouting='openai-first';
    AI.originalV20AskArya=original;
    return true;
  }

  function boot(){wire();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('load',boot,{once:true});
  [100,250,500,750,1200,2000,3000,5000].forEach(function(t){setTimeout(boot,t);});
})();
