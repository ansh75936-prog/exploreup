/* ExploreUP Arya AI — runtime bridge
 * Connects the A-Z site knowledge layer to the existing Arya input flow without replacing the UI.
 * No factual listings are created here; this only normalizes language/context and exposes navigation helpers.
 */
(function(){
  'use strict';

  const K = window.ExploreUPAryaKnowledge || {};
  const AI = window.ExploreUPAryaAI = window.ExploreUPAryaAI || {};

  const aliases = {
    'theater':'theatre', 'theaters':'theatres', 'cinema':'cinema', 'cinemas':'cinemas',
    'movie hall':'theatre', 'movie halls':'theatres',
    'hotel':'hotel', 'hotels':'hotels', 'stay':'stay', 'stays':'stays',
    'aspatal':'hospital', 'aspataal':'hospital', 'hospital':'hospital', 'hospitals':'hospitals',
    'dawai':'pharmacy', 'dawai ki dukaan':'pharmacy', 'medical store':'pharmacy',
    'railway station':'railway', 'railway':'railway', 'train':'train',
    'ghumna':'ghoomna', 'ghoomna':'ghoomna', 'ghumne':'ghoomne',
    'kaha':'kahan', 'kidhar':'kahan', 'kahan':'kahan',
    'batao':'batao', 'btana':'batao', 'btao':'batao',
    'khana':'food', 'khane':'food', 'khaana':'food', 'food':'food',
    'shopping':'shopping', 'market':'market', 'bazaar':'bazaar', 'mall':'mall',
    'trip plan':'trip plan', 'travel plan':'trip plan', 'itinerary':'itinerary',
    '1 day':'1 day', '2 day':'2 day', '3 day':'3 day'
  };

  function normalizeQuery(value){
    let text=String(value||'').replace(/[\u00A0\t]+/g,' ').replace(/\s+/g,' ').trim();
    if(!text)return text;
    Object.keys(aliases).sort((a,b)=>b.length-a.length).forEach(function(from){
      const to=aliases[from];
      text=text.replace(new RegExp('\\b'+from.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')+'\\b','gi'),to);
    });
    return text;
  }

  function currentDistrict(){
    return String(
      window.currentExploreCity ||
      document.getElementById('modalTitle')?.textContent ||
      document.querySelector('#breadcrumb')?.textContent?.split('›').pop() ||
      ''
    ).trim();
  }

  function getContext(){
    const city=currentDistrict();
    const data=K.siteMap||{};
    return {
      brand:K.brand||'ExploreUP',
      assistant:K.assistantName||'Arya AI',
      city,
      categories:Array.isArray(data.categories)?data.categories.slice():[],
      features:Array.isArray(data.existingDistrictFeatures)?data.existingDistrictFeatures.slice():[],
      rules:Array.isArray(K.rules)?K.rules.slice():[],
      noFakeData:true,
      language:K.language||null
    };
  }

  function openSection(section){
    const map={
      overview:'#districtOverview', food:'#districtFood', hotels:'#districtStay', stay:'#districtStay',
      health:'#districtStay', knowledge:'#districtKnowledgeSection', planner:'#districtPlanner',
      transport:'#districtTransport', shopping:'#districtShopping', theatres:'#districtTheatres',
      cinema:'#districtTheatres', cinemas:'#districtTheatres'
    };
    const key=String(section||'').toLowerCase().trim();
    const target=map[key]||section;
    const el=typeof target==='string'?document.querySelector(target):null;
    if(el){el.scrollIntoView({behavior:'smooth',block:'start'});return true;}
    return false;
  }

  AI.normalizeQuery=normalizeQuery;
  AI.getContext=getContext;
  AI.openSection=openSection;
  AI.knowledge=K;

  /* Wrap the existing Arya entry point once it is available. */
  function connect(){
    try{
      if(typeof window.askArya!=='function' || window.askArya.__exploreupKnowledgeBridge)return false;
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
    }catch(e){return false;}
  }

  let tries=0;
  function boot(){
    if(connect() || tries++>20)return;
    setTimeout(boot,250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('load',boot,{once:true});
})();
