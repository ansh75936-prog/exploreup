/* ExploreUP stability fix: keep corrupted favourites storage from stopping the main UI. */
(function(){
'use strict';
try{
  const raw=exploreStorage.get('exploreup_favs')||'[]';
  const parsed=JSON.parse(raw);
  if(!Array.isArray(parsed)) exploreStorage.set('exploreup_favs','[]');
}catch(e){
  try{exploreStorage.set('exploreup_favs','[]')}catch(_e){}
}
})();
