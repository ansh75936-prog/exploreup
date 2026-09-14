/* ExploreUP Arya AI — stability + diagnostics layer.
 * Defensive only: does not create factual listings or replace the existing Arya UI/answer engine.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  const state=AI.stability=AI.stability||{booted:false,connected:false,lastError:null};

  function normalize(value){
    if(AI.normalizeQuery) return AI.normalizeQuery(value);
    return String(value||'').replace(/[\u00A0\t]+/g,' ').replace(/\s+/g,' ').trim();
  }

  function currentCity(){
    try{
      return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||document.querySelector('#breadcrumb')?.textContent?.split('›').pop()||'').trim();
    }catch(e){return '';}
  }

  function intent(value){
    const q=normalize(value).toLowerCase();
    const tests=[
      ['hotels',/\b(hotel|hotels|stay|stays|room|resort)\b/],
      ['theatres',/\b(theatre|theatres|theater|theaters|cinema|cinemas|movie)\b/],
      ['health',/\b(hospital|hospitals|clinic|doctor|medical|pharmacy|dawai|aspatal)\b/],
      ['food',/\b(food|khana|khane|restaurant|restaurants|cuisine|mithai)\b/],
      ['shopping',/\b(shopping|market|bazaar|mall|buy)\b/],
      ['transport',/\b(transport|bus|train|railway|airport|flight|metro)\b/],
      ['planner',/\b(plan|planner|trip|itinerary|1 day|2 day|3 day|ghoomna|ghumna)\b/],
      ['places',/\b(place|places|tourist|sightseeing|attraction|ghoomne|famous|hidden gem)\b/]
    ];
    for(const item of tests) if(item[1].test(q)) return item[0];
    return 'general';
  }

  function health(){
    const knowledge=!!window.ExploreUPAryaKnowledge;
    const bridge=!!window.ExploreUPAryaAI;
    const input=!!document.getElementById('aryaInput');
    const ask=typeof window.askArya==='function';
    return {knowledge,bridge,input,ask,connected:!!state.connected,city:currentCity(),ok:knowledge&&bridge&&input&&ask};
  }

  AI.normalizeQuery=AI.normalizeQuery||normalize;
  AI.detectIntent=intent;
  AI.currentCity=currentCity;
  AI.health=health;
  AI.ready=()=>health().ok;
  state.booted=true;

  /* Retry connection without stacking listeners or wrappers. */
  let attempts=0;
  function ensure(){
    try{
      if(typeof window.askArya==='function' && !window.askArya.__exploreupKnowledgeBridge && typeof AI._connect==='function'){
        state.connected=!!AI._connect();
      }else if(window.askArya?.__exploreupKnowledgeBridge){
        state.connected=true;
      }
    }catch(e){state.lastError=String(e&&e.message||e);}
    attempts++;
    if(!state.connected&&attempts<40)setTimeout(ensure,250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
  window.addEventListener('load',ensure,{once:true});
})();
