/* ExploreUP V21 Step 1 — Smart City Guide helper
 * Safe, data-neutral enhancement for city.html.
 * Does not touch Arya AI files or page data.
 */
(function(){
  'use strict';
  const city=(document.getElementById('cityName')?.textContent||'City Guide').trim();
  const intro=document.getElementById('cityIntro');
  if(!intro||!city||city==='City Guide')return;
  intro.textContent='Explore '+city+' through one clear city guide: places, food, stays, cinemas, health, transport and essential services.';
})();
