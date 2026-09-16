/* ExploreUP Arya AI — secure OpenAI runtime bridge
 * V20 compatibility: do not replace or wrap the original askArya() handler.
 * The V20 handler in index-1.html owns the chat UI, message rendering,
 * language detection and multilingual response flow.
 * This bridge only provides the secure /api/arya connection plus local fallback.
 */
(function(){
  'use strict';
  const K=window.ExploreUPAryaKnowledge||{};
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=false;
  AI.internetConnected=false;
  AI.uiBridgeVersion='v20-openai';

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
  function openSection(section){
    const map={overview:'#districtOverview',food:'#districtFood',hotels:'#districtStay',stay:'#districtStay',health:'#districtStay',planner:'#districtPlanner',transport:'#districtTransport',shopping:'#districtShopping',theatres:'#districtKnowledgeSection',theatre:'#districtKnowledgeSection',places:'#districtKnowledgeSection'};
    const target=map[String(section||'').toLowerCase().trim()]||section;
    try{const el=typeof target==='string'?document.querySelector(target):null;if(el){el.scrollIntoView({behavior:'smooth',block:'start'});return true;}}catch(e){}
    return false;
  }
  function localAnswer(query,city){
    const q=normalizeQuery(query),c=String(city||currentDistrict()).trim();
    if(!q)return {ok:false,error:'empty'};
    const text=q.toLowerCase();
    if(/^(hi|hii|hello|hey|namaste|namaskar)\b/.test(text))return {ok:true,answer:`Namaste! Main Arya AI hoon. ${c?c+' ke ':''}ExploreUP ke places, food, hotels, theatres, transport aur trip planning mein help kar sakta hoon.`};
    return {ok:true,answer:`${c?c+' ke ':''}ExploreUP mein places, food, hotels, theatres, transport aur trip planning available hai. Apna sawal poochho.`};
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
  AI.openSection=openSection;
  AI.askFree=localAnswer;
  AI.askInternet=askOpenAI;
  AI.askOpenAI=askOpenAI;
  AI.knowledge=K;
  // IMPORTANT: never replace/wrap window.askArya. V20 owns that function.
})();
