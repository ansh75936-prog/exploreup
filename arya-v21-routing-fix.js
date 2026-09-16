/* ExploreUP Arya V21 — routing fix. Data-preserving. */
(function(){
  'use strict';
  if(window.__exploreUpAryaV21RoutingFix)return;
  window.__exploreUpAryaV21RoutingFix=true;

  const intentOnly=/^(overview|places|food|hotel|hospital|shopping|transport|history|trip|best-time|budget|compare)$/i;
  const cityAliases={
    prayagraj:'Prayagraj',allahabad:'Prayagraj',prayag:'Prayagraj',
    lucknow:'Lucknow',varanasi:'Varanasi',banaras:'Varanasi',kashi:'Varanasi',
    ayodhya:'Ayodhya',faizabad:'Ayodhya',agra:'Agra',mathura:'Mathura',vrindavan:'Mathura',
    gorakhpur:'Gorakhpur',jhansi:'Jhansi',kanpur:'Kanpur Nagar',meerut:'Meerut',bareilly:'Bareilly'
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
      const re=new RegExp('(^|[^a-z])'+key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^a-z])','i');
      if(re.test(n))return cityAliases[key];
    }
    return city();
  }

  function detectIntent(q){
    const n=clean(q);
    if(/ghumne ki jagah|ghumna|ghoomna|tourist place|tourist places|places|place|jagah|darshani|dekhne ki jagah|kya dekhe/.test(n))return 'places';
    if(/ke baare mein|ke bare mein|ke baare me|ke bare me|about|batao|btao|overview/.test(n))return 'overview';
    if(/food|khana|khane|restaurant|restaurants|kha sakte|famous food/.test(n))return 'food';
    if(/hotel|hotels|stay|rehne|rehna|rukna/.test(n))return 'hotel';
    if(/hospital|doctor|medical/.test(n))return 'hospital';
    if(/shopping|market|bazaar|bazar/.test(n))return 'shopping';
    if(/transport|train|bus|flight|station|airport/.test(n))return 'transport';
    if(/history|itihaas|culture|sanskriti/.test(n))return 'history';
    if(/trip|travel|yatra|plan|itinerary/.test(n))return 'trip';
    if(/best time|kab jana|kab jaaye|season/.test(n))return 'best-time';
    if(/budget|kitna kharcha|cost/.test(n))return 'budget';
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
      let raw=String(query||'').trim();
      let q=raw;
      const detected=detectCity(raw);

      // Raw Hinglish/Hindi city questions were previously falling into the generic fallback.
      // Route them through the existing V20 answer engine using a canonical city + intent query.
      if(detected && (detectIntent(raw)||clean(raw)!==clean(detected))) q=canonicalQuery(raw);
      else {
        const c=city();
        if(c && intentOnly.test(q))q=c+' '+q;
      }

      // Use the existing engine's English routing for canonicalized queries, while leaving
      // the existing response/data engine untouched.
      return original.call(this,q,(detected||city())?'en':(lang||'en'));
    }

    fixedAryaAnswer.__exploreupV21RoutingFix=true;
    fixedAryaAnswer.original=original;
    window.aryaAnswer=fixedAryaAnswer;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.addEventListener('load',install,{once:true});
})();
