/* ExploreUP V20 — Arya district aliases + Hinglish understanding layer.
   Data-preserving: this file only normalizes user language to existing V20 district names.
*/
(function(){
  'use strict';
  if(window.__exploreUpAryaDistrictAliasV20)return;
  window.__exploreUpAryaDistrictAliasV20=true;

  const ALIASES={
    'allahabad':'Prayagraj','prayag':'Prayagraj','prayagraj city':'Prayagraj','prayag raj':'Prayagraj',
    'banaras':'Varanasi','benaras':'Varanasi','kashi':'Varanasi','kashi nagari':'Varanasi','banaras city':'Varanasi','varanasi city':'Varanasi',
    'faizabad':'Ayodhya','faizabad city':'Ayodhya','ayodhya dham':'Ayodhya','ayodhya ji':'Ayodhya',
    'noida':'Gautam Buddh Nagar','new okhla':'Gautam Buddh Nagar','greater noida':'Gautam Buddh Nagar','gb nagar':'Gautam Buddh Nagar','gautam buddha nagar':'Gautam Buddh Nagar','gautam buddh nagar':'Gautam Buddh Nagar',
    'mughalsarai':'Chandauli','mughal sarai':'Chandauli','dd u nagar':'Chandauli','pt deen dayal upadhyaya nagar':'Chandauli',
    'khalilabad':'Sant Kabir Nagar','sant kabir nagar city':'Sant Kabir Nagar',
    'naugarh':'Siddharthnagar','siddharth nagar':'Siddharthnagar','siddharthnagar district':'Siddharthnagar',
    'robertsganj':'Sonbhadra','roberts ganj':'Sonbhadra',
    'orai':'Jalaun','urai':'Jalaun','jalaun city':'Jalaun',
    'barsana':'Mathura','vrindavan':'Mathura','vrindaban':'Mathura','govardhan':'Mathura','gokul':'Mathura','braj':'Mathura','mathura vrindavan':'Mathura',
    'gorakhpur city':'Gorakhpur','jhansi city':'Jhansi','lucknow city':'Lucknow','agra city':'Agra','kanpur city':'Kanpur Nagar','meerut city':'Meerut','bareilly city':'Bareilly',
    'firozabad city':'Firozabad','moradabad city':'Moradabad','saharanpur city':'Saharanpur','kannauj city':'Kannauj','jaunpur city':'Jaunpur','mirzapur city':'Mirzapur','etawah city':'Etawah','aligarh city':'Aligarh','ghaziabad city':'Ghaziabad','hapur city':'Hapur','rampur city':'Rampur','pilibhit city':'Pilibhit','amroha city':'Amroha','budaun city':'Budaun','bulandshahr city':'Bulandshahr','muzaffarnagar city':'Muzaffarnagar','pratapgarh city':'Pratapgarh','sultanpur city':'Sultanpur','unnao city':'Unnao','chitrakoot city':'Chitrakoot','kushinagar city':'Kushinagar','lakhimpur city':'Lakhimpur Kheri','lakhimpur kheri city':'Lakhimpur Kheri'
  };

  const norm=s=>String(s||'').toLowerCase().normalize('NFKC').replace(/[’']/g,"'").replace(/[^a-z0-9\u0900-\u097f]+/g,' ').replace(/\s+/g,' ').trim();
  function normalize(q){
    let s=String(q||'');
    const n=norm(s);
    const keys=Object.keys(ALIASES).sort((a,b)=>b.length-a.length);
    for(const key of keys){
      const re=new RegExp('(^|[^a-z0-9])'+key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^a-z0-9])','i');
      if(re.test(n))return s.replace(re,(_,p)=>p+ALIASES[key]);
    }
    return s;
  }

  // Common Hinglish phrasing is intentionally kept broad but travel-scoped.
  const HINGLISH=/\b(ke baare mein|ke bare mein|ke baare me|ke bare me|batao|btao|dikhao|dikhana|chahiye|chaahiye|chahie|kahan|kaha|kaise|kaisa|kaisi|kitna|kitne|kab|jana hai|jaana hai|ghoomna|ghumna|rehna|rahna|rukna|khana|khana hai|khane|gumana|gumna|pahunchna|pahuche|pahuchna|near|pass|aas paas|aaspaas|milega|milenge|suggest|recommend|best|famous|place|jagah|hotel|stay|food|khana|trip|travel|yatra|tour|mandir|temple|market|bazaar|shopping|hospital|doctor|transport|train|bus|flight|festival|tyohar|history|itihaas|culture|sanskriti)\b/i;

  function handle(e){
    if(e.type==='keydown' && e.key!=='Enter')return;
    const input=document.getElementById('aryaInput')||document.getElementById('userInput');
    if(!input)return;
    const raw=input.value.trim();
    if(!raw)return;
    const normalized=normalize(raw);
    const changed=normalized!==raw;
    if(!changed && !HINGLISH.test(raw))return;
    if(typeof window.aryaAnswer!=='function')return;
    // Let the original Arya UI submit its own message when no alias needs interception.
    if(!changed)return;
    e.preventDefault();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    try{
      const lang=(document.documentElement.lang||'hi').toLowerCase().startsWith('hi')?'hi':'en';
      if(typeof window.addAryaMessage==='function')window.addAryaMessage(raw,'user');
      else if(typeof window.addMsg==='function')window.addMsg(raw,'user');
      input.value='';
      const reply=window.aryaAnswer(normalized,lang);
      if(reply&&typeof reply.then==='function')reply.then(r=>{if(typeof window.addAryaMessage==='function')window.addAryaMessage(r,'bot');else if(typeof window.addMsg==='function')window.addMsg(r,'bot')});
    }catch(err){console.warn('ExploreUP Arya alias layer:',err)}
  }

  document.addEventListener('keydown',handle,true);
  document.addEventListener('click',function(e){
    const b=e.target&&e.target.closest&&e.target.closest('button');
    if(!b)return;
    const text=norm(b.textContent);
    if(/send|ask|poocho|पूछ/.test(text))handle(e);
  },true);

  window.ExploreUPAryaAliases={aliases:ALIASES,normalize};
})();
