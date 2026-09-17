/* ExploreUP Favorites UI patch — one launcher, left side. Arya untouched. */
(function(){
  'use strict';
  function fix(){
    const old=document.getElementById('v21FavoritesLink');
    if(old)old.remove();
    const bars=document.querySelectorAll('.favbar');
    bars.forEach((bar,i)=>{
      if(i>0) bar.style.display='none';
      else Object.assign(bar.style,{left:'18px',right:'auto',bottom:'18px',zIndex:'9999'});
    });
  }
  document.addEventListener('DOMContentLoaded',fix);
  window.addEventListener('load',fix);
})();
