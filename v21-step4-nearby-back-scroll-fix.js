/* ExploreUP V21 — Nearby back-scroll fix
 * Restores page scrolling when the browser returns from Google Maps.
 * No location data is read or stored. Arya AI is untouched.
 */
(function(){
  'use strict';
  function restoreScroll(){
    try{
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('position');
      document.body.style.removeProperty('position');
      document.documentElement.style.removeProperty('height');
      document.body.style.removeProperty('height');
      document.documentElement.classList.remove('modal-open','no-scroll');
      document.body.classList.remove('modal-open','no-scroll');
    }catch(e){}
  }
  window.addEventListener('pageshow',restoreScroll);
  window.addEventListener('popstate',restoreScroll);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible') restoreScroll();
  });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',restoreScroll);
  else restoreScroll();
})();
