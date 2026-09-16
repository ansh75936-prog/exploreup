/* ExploreUP Arya AI — runtime bridge
 * Connects the A-Z site knowledge layer to the existing Arya input flow without replacing the UI.
 * No factual listings are created here; this only normalizes language/context and exposes navigation helpers.
 * V20 dataset remains read-only. Internet answers come through /api/arya.
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

  function internetBox(){
    let box=document.getElementById('exploreup-arya-live-response');
    if(box)return box;
    box=document.createElement('div');
    box.id='exploreup-arya-live-response';
    box.setAttribute('role','status');
    box.style.cssText='margin:12px 0;padding:14px 16px;background:#fff;border:1px solid #dce6f2;border-radius:14px;color:#10233f;line-height:1.55;font-size:14px;white-space:pre-wrap;box-shadow:0 5px 18px rgba(0,27,59,.08)';
    const input=document.getElementById('aryaInput');
    if(input&&input.parentElement) input.parentElement.insertAdjacentElement('afterend',box);
    else document.body.appendChild(box);
    return box;
  }

  function showInternetAnswer(text){
    const box=internetBox();
    box.textContent='Arya • Live web\n\n'+String(text||'').trim();
  }

  async function askInternet(query, city){
    const q=normalizeQuery(query);
    if(!q)return {ok:false,error:'empty'};
    const box=internetBox();
    box.textContent='Arya • Live web\n\nSearching the web…';
    try{
      const response=await fetch('/api/arya',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({query:q,city:String(city||currentDistrict()).trim()})
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.answer)throw new Error(data.error||'internet_backend_unavailable');
      showInternetAnswer(data.answer);
      AI.internetConnected=true;
      return {ok:true,answer:data.answer};
    }catch(error){
      AI.internetConnected=false;
      return {ok:false,error:String(error&&error.message||error)};
    }
  }

  AI.normalizeQuery=normalizeQuery;
  AI.getContext=getContext;
  AI.openSection=openSection;
  AI.askInternet=askInternet;
  AI.knowledge=K;

  function connect(){
    try{
      if(typeof window.askArya!=='function')return false;
      if(window.askArya.__exploreupKnowledgeBridge)return true;
      const original=window.askArya;
      async function bridgedAskArya(){
        const input=document.getElementById('aryaInput');
        if(!input)return original.apply(this,arguments);
        const before=input.value;
        const normalized=normalizeQuery(before);
        input.value=normalized;
        try{
          const live=await askInternet(normalized,currentDistrict());
          if(live.ok)return live.answer;
          return original.apply(this,arguments);
        }finally{
          input.value=before;
        }
      }
      bridgedAskArya.__exploreupKnowledgeBridge=true;
      bridgedAskArya.original=original;
      window.askArya=bridgedAskArya;
      window.askAryaInternet=askInternet;
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
