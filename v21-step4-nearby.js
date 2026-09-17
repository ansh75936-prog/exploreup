/* ExploreUP V21 Step 4 — Nearby
 * Browser-only nearby helper. Uses the device Geolocation API only after
 * the user explicitly presses the Nearby button. No location is stored.
 * Arya AI is untouched.
 */
(function(){
  'use strict';

  function status(text){
    const el=document.getElementById('v21NearbyStatus');
    if(el) el.textContent=text||'';
  }

  function buildMapsUrl(latitude,longitude){
    const lat=Number(latitude), lng=Number(longitude);
    if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat < -90||lat > 90||lng < -180||lng > 180) return '';
    return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(lat+','+lng);
  }

  function openNearby(){
    if(!navigator.geolocation){
      status('Nearby location is not supported by this browser.');
      return;
    }

    status('Requesting your location…');
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const coords=pos&&pos.coords;
        const url=buildMapsUrl(coords&&coords.latitude,coords&&coords.longitude);
        if(!url){
          status('Could not read a valid location. Please try again.');
          return;
        }
        // Coordinates are used only to open Maps; ExploreUP does not save them.
        window.location.assign(url);
      },
      err=>{
        if(err&&err.code===1) status('Location permission was not granted. You can allow it in browser settings and try again.');
        else if(err&&err.code===2) status('Your location is unavailable right now. Please check Location/GPS and try again.');
        else if(err&&err.code===3) status('Location request timed out. Please try again.');
        else status('Could not get your location. Please try again.');
      },
      {enableHighAccuracy:false,maximumAge:60000,timeout:10000}
    );
  }

  function wire(){
    const btn=document.getElementById('nearbyBtn');
    if(!btn||btn.dataset.nearbyWired) return;
    btn.dataset.nearbyWired='1';
    btn.addEventListener('click',openNearby);
    let s=document.getElementById('v21NearbyStatus');
    if(!s){
      s=document.createElement('small');
      s.id='v21NearbyStatus';
      s.setAttribute('aria-live','polite');
      s.style.cssText='display:block;margin-top:7px;color:#60708a;font-size:12px';
      btn.insertAdjacentElement('afterend',s);
    }
  }

  window.ExploreUPNearby={open:openNearby};
  document.addEventListener('DOMContentLoaded',wire);
  window.addEventListener('load',wire);
})();
