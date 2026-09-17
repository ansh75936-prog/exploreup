/* ExploreUP V21 Step 4 — Nearby
 * Browser-only nearby helper. Uses the device Geolocation API only after
 * the user explicitly presses the Nearby button. No location is stored.
 * Arya AI is untouched.
 */
(function(){
  'use strict';
  function status(text){
    const el=document.getElementById('v21NearbyStatus'); if(el)el.textContent=text||'';
  }
  function openNearby(){
    if(!navigator.geolocation){status('Nearby location is not supported by this browser.');return;}
    status('Requesting your location…');
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const {latitude,longitude}=pos.coords;
        const url='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(latitude+','+longitude);
        window.location.href=url;
      },
      err=>{
        status(err&&err.code===1?'Location permission was not granted.':'Could not get your location. Please try again.');
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
  window.ExploreUPNearby={open:openNearby};
  document.addEventListener('DOMContentLoaded',wire);window.addEventListener('load',wire);
})();
