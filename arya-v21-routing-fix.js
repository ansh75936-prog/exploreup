/* ExploreUP Arya V21 — routing + language fix. Data-preserving. */
(function(){
  'use strict';
  if(window.__exploreUpAryaV21RoutingFix)return;
  window.__exploreUpAryaV21RoutingFix=true;

  const intentOnly=/^(overview|places|food|hotel|hospital|shopping|transport|history|trip|best-time|budget|compare)$/i;
  const cityAliases={
    prayagraj:'Prayagraj',allahabad:'Prayagraj',prayag:'Prayagraj',
    lucknow:'Lucknow',varanasi:'Varanasi',banaras:'Varanasi',kashi:'Varanasi',
    ayodhya:'Ayodhya',faizabad:'Ayodhya',agra:'Agra',mathura:'Mathura',vrindavan:'Mathura',
    gorakhpur:'Gorakhpur',jhansi:'Jhansi',kanpur:'Kanpur Nagar',meerut:'Meerut',bareilly:'Bareilly',
    noida:'Gautam Buddh Nagar','greater noida':'Gautam Buddh Nagar','gb nagar':'Gautam Buddh Nagar',
    orai:'Jalaun',urai:'Jalaun',mughalsarai:'Chandauli',khalilabad:'Sant Kabir Nagar',
    robertsganj:'Sonbhadra',naugarh:'Siddharthnagar',siddharthnagar:'Siddharthnagar'
  };

  function clean(s){
    return String(s||'').toLowerCase().normalize('NFKC')
      .replace(/[’']/g,"'").replace(/[^a-z0-9\u0900-\u097f]+/g,' ')
      .replace(/\s+/g,' ').trim();
  }

  function city(){
    try{
      return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||
        document.querySelector('#breadcrumb')?.textContent?.split('›').pop()||'').trim();
    }catch(e){return '';}
  }

  function detectCity(q){
    const n=clean(q);
    const keys=Object.keys(cityAliases).sort((a,b)=>b.length-a.length);
    for(const key of keys){
      const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const re=new RegExp('(^|[^a-z])'+escaped+'(?=$|[^a-z])','i');
      if(re.test(n))return cityAliases[key];
    }
    return city();
  }

  function detectIntent(q){
    const n=clean(q);
    if(/ghumne ki jagah|ghumna|ghoomna|tourist place|tourist places|places|place|jagah|darshani|dekhne ki jagah|kya dekhe/.test(n))return 'places';
    if(/ke baare mein|ke bare mein|ke baare me|ke bare me|about|batao|btao|overview/.test(n))return 'overview';
    if(/food|khana|khane|khaana|restaurant|restaurants|kha sakte|famous food|cuisine/.test(n))return 'food';
    if(/hotel|hotels|stay|stays|rehne|rehna|rukna|room|rooms/.test(n))return 'hotel';
    if(/hospital|hospitals|doctor|medical|aspataal|aspatal|dawai|pharmacy/.test(n))return 'hospital';
    if(/shopping|market|bazaar|bazar|mall/.test(n))return 'shopping';
    if(/transport|train|bus|flight|station|airport|railway/.test(n))return 'transport';
    if(/history|itihaas|culture|sanskriti|heritage/.test(n))return 'history';
    if(/trip|travel|yatra|plan|itinerary|planner/.test(n))return 'trip';
    if(/best time|kab jana|kab jaaye|season/.test(n))return 'best-time';
    if(/budget|kitna kharcha|cost|expense|paisa/.test(n))return 'budget';
    return '';
  }

  function canonicalQuery(q){
    const c=detectCity(q);
    const intent=detectIntent(q);
    if(!c)return String(q||'').trim();
    if(intent)return c+' '+intent;
    return c+' overview';
  }

  function install(){
    if(typeof window.aryaAnswer!=='function'){setTimeout(install,250);return;}
    if(window.aryaAnswer.__exploreupV21RoutingFix)return;
    const original=window.aryaAnswer;
    async function fixedAryaAnswer(query,lang){
      const raw=String(query||'').trim();
      const detected=detectCity(raw);
      let q=raw;
      if(detected && (detectIntent(raw)||clean(raw)!==clean(detected))) q=canonicalQuery(raw);
      else if(detected && intentOnly.test(q)) q=detected+' '+q;
      const replyLang=lang||((typeof window.aryaDetectLanguage==='function')?window.aryaDetectLanguage(raw):'en');
      return original.call(this,q,replyLang);
    }
    fixedAryaAnswer.__exploreupV21RoutingFix=true;
    fixedAryaAnswer.original=original;
    window.aryaAnswer=fixedAryaAnswer;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
  window.addEventListener('load',install,{once:true});
})();
