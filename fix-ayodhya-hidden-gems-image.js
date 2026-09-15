(function(){
  'use strict';
  const MAP = {
    prayagraj: './images (2).jpeg',
    jhansi: './images (1).jpeg',
    gorakhpur: './images.jpeg',
    // Correct Ayodhya card image: Shri Ram Janmabhoomi Mandir, Ayodhya.
    // Source: Prime Minister's Office, Government of India / Wikimedia Commons.
    ayodhya: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Shri_Ram_Janambhoomi_Mandir%2C_Ayodhya.jpg'
  };
  function norm(v){ return String(v||'').toLowerCase().replace(/\s+/g,' ').trim(); }
  function fix(){
    document.querySelectorAll('.city, .city-card, [data-city]').forEach(function(card){
      const text = norm(card.innerText || card.textContent || card.getAttribute('data-city'));
      const img = card.querySelector('img');
      if(!img) return;
      Object.keys(MAP).forEach(function(city){
        const re = new RegExp('(^|[^a-z])'+city+'([^a-z]|$)','i');
        if(re.test(text)) img.src = MAP[city];
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',fix,{once:true}); else fix();
  new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});
})();
