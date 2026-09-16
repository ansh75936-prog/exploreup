/* ExploreUP Arya AI — FREE/local runtime bridge
 * Keeps Arya usable without an external AI/API key.
 * This file only handles Arya's local language understanding and navigation.
 * Paid/API-backed web answers can be added later without changing the site structure.
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
      knowledge:'#districtKnowledgeSection',planner:'#districtPlanner',transport:'#districtTransport',shopping:'#districtShopping',
      theatres:'#districtKnowledgeSection',theatre:'#districtKnowledgeSection',places:'#districtKnowledgeSection'};
    const key=String(section||'').toLowerCase().trim();
    const target=map[key]||section;
    try{
      const el=typeof target==='string'?document.querySelector(target):null;
      if(el){el.scrollIntoView({behavior:'smooth',block:'start'});return true;}
    }catch(e){}
    return false;
  }

  function responseBox(){
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

  function showAnswer(text){
    responseBox().textContent='Arya • Free\n\n'+String(text||'').trim();
  }

  function intentFor(q){
    const text=q.toLowerCase();
    const intents=K.intents||{};
    for(const name of Object.keys(intents)){
      const words=Array.isArray(intents[name])?intents[name]:[];
      if(words.some(w=>text.includes(String(w).toLowerCase()))) return name;
    }
    return '';
  }

  function localAnswer(query, city){
    const q=normalizeQuery(query), c=String(city||currentDistrict()).trim();
    if(!q)return {ok:false,error:'empty'};
    const intent=intentFor(q);
    const name=c?` ${c}`:'';
    const labels={
      places:'Famous Places / Hidden Gems',food:'Food & Restaurants',hotels:'Hotels & Stays',
      theatres:'Theatres & Cinemas',health:'Hospitals, Clinics & Pharmacies',transport:'Transport',
      shopping:'Markets & Shopping',emergency:'Emergency Services',planner:'Trip Planner'
    };
    if(intent){
      const label=labels[intent]||'relevant section';
      const opened=openSection(intent==='theatres'?'theatres':intent);
      if(opened) return {ok:true,answer:`${label}${name ? ` in${name}` : ''} ke liye ExploreUP ka relevant section khol diya hai.\n\nMain sirf site par available information use karta hoon; missing listings invent nahi karta.`};
      return {ok:true,answer:`${label}${name ? ` in${name}` : ''} ExploreUP mein available hai. Relevant section mein details dekho.`};
    }
    if(/hello|hi|hii|hey|namaste|namaskar/.test(q)) return {ok:true,answer:`Namaste! Main Arya AI hoon. ${c?c+' ke ':''}places, food, hotels, theatres, transport aur trip planning mein site ke available data ke saath help kar sakta hoon.`};
    if(/help|kya kar|kya kya|what can/.test(q)) return {ok:true,answer:'Main ExploreUP ke available sections tak jaldi pahunchne mein help kar sakta hoon: Places, Food, Hotels & Stays, Theatres/Cinemas, Health, Transport, Shopping aur Trip Planner.'};
    return {ok:true,answer:`Main abhi FREE mode mein hoon, isliye bina API key ke ExploreUP ke built-in knowledge aur navigation ke saath help karta hoon. ${c?c+' ke ':''}liye kya dekhna hai—places, food, hotel, theatre, transport ya trip plan?`};
  }

  async function askInternet(query, city){
    const result=localAnswer(query,city);
    if(result.ok){showAnswer(result.answer);AI.internetConnected=false;AI.freeMode=true;return result;}
    return result;
  }

  AI.normalizeQuery=normalizeQuery;
  AI.getContext=getContext;
  AI.openSection=openSection;
  AI.askInternet=askInternet;
  AI.askFree=localAnswer;
  AI.knowledge=K;
  AI.freeMode=true;

  function connect(){
    try{
      if(typeof window.askArya!=='function')return false;
      if(window.askArya.__exploreupKnowledgeBridge)return true;
      const original=window.askArya;
      async function bridgedAskArya(){
        const input=document.getElementById('aryaInput');
        if(!input)return original.apply(this,arguments);
        const before=input.value;
        const result=localAnswer(before,currentDistrict());
        if(result.ok){showAnswer(result.answer);return result.answer;}
        input.value=before;
        return original.apply(this,arguments);
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
