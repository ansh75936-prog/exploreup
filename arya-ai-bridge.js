/* ExploreUP Arya AI — runtime bridge
 * Connects the A-Z site knowledge layer to the existing Arya input flow without replacing the UI.
 * No factual listings are created here; this only normalizes language/context and exposes navigation helpers.
 */
(function(){
  'use strict';

  const K = window.ExploreUPAryaKnowledge || {};
  const AI = window.ExploreUPAryaAI = window.ExploreUPAryaAI || {};

  const aliases = {
    'theater':'theatre','theaters':'theatres','theatre hall':'theatre','movie hall':'theatre','movie halls':'theatres',
    'hotel':'hotel','hotels':'hotels','stay':'stay','stays':'stays','room':'room','rooms':'rooms',
    'aspatal':'hospital','aspataal':'hospital','hospital':'hospital','hospitals':'hospitals','clinic':'clinic','clinics':'clinics',
    'dawai':'pharmacy','dawai ki dukaan':'pharmacy','medical store':'pharmacy','medical shop':'pharmacy',
    'railway station':'railway','railway':'railway','train':'train','bus stand':'bus','airport':'airport',
    'ghumna':'ghoomna','ghumne':'ghoomne','ghoomna':'ghoomna','ghoomne':'ghoomne',
    'kaha':'kahan','kidhar':'kahan','kahaan':'kahan','kahan':'kahan',
    'batao':'batao','btana':'batao','btao':'batao','dikhao':'dikhao','dikhana':'dikhao',
    'khana':'food','khane':'food','khaana':'food','food':'food','restaurant':'restaurant','restaurants':'restaurants',
    'shopping':'shopping','market':'market','bazaar':'bazaar','mall':'mall',
    'trip plan':'trip plan','travel plan':'trip plan','itinerary':'itinerary','planner':'planner',
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
    try{
      return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||document.querySelector('#breadcrumb')?.textContent?.split('›').pop()||'').trim();
    }catch(e){return '';}
  }

  function getContext(){
    const city=currentDistrict(),data=K.siteMap||{};
    return {
      brand:K.brand||'ExploreUP',assistant:K.assistantName||'Arya AI',city,
      categories:Array.isArray(data.categories)?data.categories.slice():[],
      features:Array.isArray(data.existingDistrictFeatures)?data.existingDistrictFeatures.slice():[],
      rules:Array.isArray(K.rules)?K.rules.slice():[],noFakeData:true,language:K.language||null
    };
  }

  function openSection(section){
    const map={overview:'#districtOverview',food:'#districtFood',hotels:'#districtStay',stay:'#districtStay',health:'#districtStay',
      knowledge:'#districtKnowledgeSection',planner:'#districtPlanner',transport:'#districtTransport',shopping:'#districtShopping'};
    const key=String(section||'').toLowerCase().trim();
    const target=map[key]||section;
    try{
      const el=typeof target==='string'?document.querySelector(target):null;
      if(el){el.scrollIntoView({behavior:'smooth',block:'start'});return true;}
    }catch(e){}
    return false;
  }

  AI.normalizeQuery=normalizeQuery;
  AI.getContext=getContext;
  AI.openSection=openSection;
  AI.knowledge=K;

  function connect(){
    try{
      if(typeof window.askArya!=='function')return false;
      if(window.askArya.__exploreupKnowledgeBridge)return true;
      const original=window.askArya;
      function bridgedAskArya(){
        const input=document.getElementById('aryaInput');
        if(!input)return original.apply(this,arguments);
        const before=input.value;
        input.value=normalizeQuery(before);
        try{return original.apply(this,arguments)}finally{input.value=before;}
      }
      bridgedAskArya.__exploreupKnowledgeBridge=true;
      bridgedAskArya.original=original;
      window.askArya=bridgedAskArya;
      AI.connected=true;
      return true;
    }catch(e){AI.lastBridgeError=String(e&&e.message||e);return false;}
  }

  AI._connect=connect;
  let tries=0;
  function boot(){if(connect()||tries++>=40)return;setTimeout(boot,250)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',boot,{once:true});
})();
