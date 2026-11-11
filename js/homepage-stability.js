/* ExploreUP stability batch v1: feedback/suggestion storage + form safety. */
(function(){
  'use strict';
  function readSuggestionLocal(city){
    try{
      const v=JSON.parse(exploreStorage.get(suggestionKey(city))||'[]');
      return Array.isArray(v)?v:[];
    }catch(e){return []}
  }
  function writeSuggestionLocal(city,items){
    try{exploreStorage.set(suggestionKey(city),JSON.stringify(Array.isArray(items)?items.slice(-30):[]));return true}catch(e){return false}
  }
  function localSuggestionFallback(city,name,category,text){
    const items=readSuggestionLocal(city);
    items.push({name,category,text,time:new Date().toISOString()});
    return writeSuggestionLocal(city,items);
  }
  window.__exploreUpLocalSuggestionFallback=localSuggestionFallback;
  window.__exploreUpReadSuggestionLocal=readSuggestionLocal;
  window.__exploreUpWriteSuggestionLocal=writeSuggestionLocal;
})();

/* ExploreUP local city image stability patch v1 */
(function(){
  'use strict';
  const localImages={Lucknow:'./images/lucknow.jpg',Varanasi:'./images/varanasi.jpg'};
  function applyCards(){
    document.querySelectorAll('#cityGrid .city').forEach(card=>{
      const name=card.querySelector('.citytext h3')?.textContent?.trim();
      const src=localImages[name];
      const img=card.querySelector('img');
      if(src&&img&&img.getAttribute('src')!==src){
        img.setAttribute('src',src);
        img.setAttribute('loading','lazy');
        img.setAttribute('decoding','async');
        img.setAttribute('onerror','exploreUpImageFallback(this)');
      }
    });
  }
  function applyProfile(){
    const title=document.getElementById('modalTitle');
    const hero=document.getElementById('modalHero');
    if(!title||!hero)return;
    const name=title.textContent.trim();
    const src=localImages[name];
    if(src)hero.style.backgroundImage='linear-gradient(transparent,#06162d88),url("'+src+'")';
  }
  function applyAll(){try{applyCards();applyProfile();}catch(e){console.warn('ExploreUP local image patch warning:',e)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyAll,{once:true});else applyAll();
  new MutationObserver(applyAll).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','src']});
})();

/* ExploreUP Varanasi hero image stability fix v1 */
(function(){
  'use strict';
  function apply(){
    try{
      const el=document.querySelector('.featurebanner');
      if(!el)return;
      el.style.backgroundImage='linear-gradient(180deg,rgba(3,20,41,.08),rgba(3,20,41,.86)),url("./images/varanasi.jpg")';
      el.style.backgroundSize='cover';
      el.style.backgroundPosition='center';
    }catch(e){console.warn('ExploreUP Varanasi hero image warning:',e)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
