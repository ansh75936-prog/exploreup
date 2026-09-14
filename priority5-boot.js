/* ExploreUP Priority 5 boot compatibility layer. Keeps legacy globals safe without changing index-1.html. */
(function(){
'use strict';
try{
  if(!Array.isArray(window.cities) && Array.isArray(window.__exploreUpDistrictCities)){
    window.cities=window.__exploreUpDistrictCities;
  }
}catch(e){}
})();
