/* ExploreUP V21 Step 2 — Powerful Search
 * Self-contained search helper. Does not touch Arya AI or index-1.html.
 */
(function(){
  'use strict';
  const input=document.getElementById('powerSearch');
  const results=document.getElementById('searchResults');
  const count=document.getElementById('searchCount');
  const filter=document.getElementById('categoryFilter');
  if(!input||!results)return;

  const items=[
    ['Agra','City','Taj Mahal, Agra Fort, food, hotels, cinemas, transport','places'],
    ['Ayodhya','City','Ram Mandir, heritage, food, hotels, cinemas, transport','places'],
    ['Varanasi','City','Kashi Vishwanath, ghats, Banarasi food, hotels, cinemas, transport','places'],
    ['Lucknow','City','heritage, Awadhi food, hotels, cinemas, transport, shopping','places'],
    ['Prayagraj','City','Sangam, heritage, food, hotels, cinemas, transport','places'],
    ['Kanpur','City','city guide, food, hotels, cinemas, transport, shopping','places'],
    ['Gorakhpur','City','tourist places, food, hotels, cinemas, transport','places'],
    ['Jhansi','City','Jhansi Fort, heritage, food, hotels, cinemas, transport','places'],
    ['Mathura','City','Krishna heritage, temples, local food, stays and transport','places'],
    ['Agra Food','Food','local food and restaurant information for Agra','food'],
    ['Ayodhya Food','Food','local food and restaurant information for Ayodhya','food'],
    ['Varanasi Food','Food','kachori-sabzi, tamatar chaat, lassi and Banarasi food','food'],
    ['Lucknow Food','Food','Awadhi and Lucknow food guide','food'],
    ['Hotels & Stays','Hotels','verified accommodation information by city','hotels'],
    ['Theatres / Cinemas','Cinema','cinema and theatre locations by city','cinema'],
    ['Hospitals & Clinics','Health','verified health facilities by city','health'],
    ['Transport','Transport','rail, bus, airport and local transport information','transport'],
    ['Essential Services','Services','banks, ATMs, petrol, EV, emergency, markets and government services','services']
  ];

  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function render(){
    const q=input.value.trim().toLowerCase();
    const cat=filter?.value||'all';
    const found=items.filter(x=>(cat==='all'||x[3]===cat)&&(!q||(x[0]+' '+x[1]+' '+x[2]).toLowerCase().includes(q)));
    count.textContent=found.length+' result'+(found.length===1?'':'s');
    results.innerHTML=found.length
      ?found.map(x=>`<button class="search-result" type="button" data-name="${esc(x[0])}" data-cat="${esc(x[3])}"><span class="result-title">${esc(x[0])}</span><span class="result-type">${esc(x[1])}</span><span class="result-desc">${esc(x[2])}</span><span class="result-go">Open →</span></button>`).join('')
      :'<div class="no-results">No matching result. Try a city name, food, hotels, cinema, health, transport or services.</div>';
  }

  function openResult(el){
    const name=el.dataset.name||'';
    const cat=el.dataset.cat||'';
    const city=name.replace(/\s+(Food)$/i,'').trim();
    const hash={places:'places',food:'food',hotels:'hotels',cinema:'cinema',health:'health',transport:'transport',services:'services'}[cat];

    // City-specific results can open the relevant city section directly.
    if(['places','food'].includes(cat)&&city&&city!==name){
      location.href='./city.html?city='+encodeURIComponent(city)+'#'+hash;
      return;
    }
    if(cat==='places'&&city){
      location.href='./city.html?city='+encodeURIComponent(city)+'#places';
      return;
    }

    // Generic categories have no selected city. Open the neutral city guide
    // without pretending the user selected "Uttar Pradesh" as a city.
    if(hash){
      location.href='./city.html#'+hash;
      return;
    }

    location.href='./city.html?city='+encodeURIComponent(name)+'#places';
  }

  input.addEventListener('input',render);
  filter?.addEventListener('change',render);
  results.addEventListener('click',e=>{
    const b=e.target.closest('.search-result');
    if(b)openResult(b);
  });
  render();
})();
