/* ExploreUP V21 Step 4 — Nearby
 * Browser-only nearby helper. Uses the device Geolocation API only after
 * the user explicitly presses the Nearby button. No location is stored.
 * Arya AI is untouched.
 */
(function(){
  'use strict';
  const CITY_ALIASES={
    agra:'Agra',ayodhya:'Ayodhya',varanasi:'Varanasi',banaras:'Varanasi',
    lucknow:'Lucknow',prayagraj:'Prayagraj',allahabad:'Prayagraj',kanpur:'Kanpur',
    gorakhpur:'Gorakhpur',jaunpur:'Jaunpur',jhansi:'Jhansi',mathura:'Mathura',
    meerut:'Meerut',bareilly:'Bareilly',noida:'Noida',ghaziabad:'Ghaziabad'
  };
  function currentCity(){
    try{
      const p=new URLSearchParams(location.search); const q=p.get('city')||p.get('district');
      if(q)return q.trim();
      return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||'').trim();
    }catch(e){return ''}
  }
  function canonicalCity(value){
    const raw=String(value||'').trim(); if(!raw)return '';
    return CITY_ALIASES[raw.toLowerCase()]||raw;
  }
  function status(text){
    const el=document.getElementById('v21NearbyStatus'); if(el)el.textContent=text||'';
  }
  function openNearby(){
    if(!navigator.geolocation){status('Nearby location is not supported by this browser.');return;}
    status('Requesting your location…');
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const {latitude,longitude}=pos.coords;
        // Location is used only to open a standard map search; it is not stored.
        const city=encodeURIComponent(canonicalCity(currentCity()));
        const url='https://www.google.com/maps/search/?api=1&query='+latitude+','+longitude+(city?'&query_place_id='+city:'');
        window.open(url,'_blank','noopener,noreferrer');
        status('Nearby map opened. Your location is not saved by ExploreUP.');
      },
      err=>{
        status(err&&err.code===1?'Location permission was not granted.': 'Could not get your location.');
      },
      {enableHighAccuracy:false,maximumAge:60000,timeout:10000}
    );
  }
  function wire(){
    const btn=document.getElementById('nearbyBtn'); if(!btn||btn.dataset.nearbyWired)return;
    btn.dataset.nearbyWired='1'; btn.addEventListener('click',openNearby);
    let s=document.getElementById('v21NearbyStatus');
    if(!s){s=document.createElement('small');s.id='v21NearbyStatus';s.setAttribute('aria-live','polite');s.style.cssText='display:block;margin-top:7px;color:#60708a;font-size:12px';btn.insertAdjacentElement('afterend',s)}
  }
  window.ExploreUPNearby={open:openNearby,currentCity:currentCity,canonicalCity:canonicalCity};
  document.addEventListener('DOMContentLoaded',wire);window.addEventListener('load',wire);
})();
