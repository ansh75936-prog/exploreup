/* ExploreUP V20 — Arya language-understanding layer.
   Data-preserving: normalizes Roman Hindi, Hinglish, common spellings and travel intents
   into the existing V20 district/city knowledge. It does not add or alter destination data.
*/
(function(){
  'use strict';
  if(window.__exploreUpAryaDistrictAliasV20)return;
  window.__exploreUpAryaDistrictAliasV20=true;

  const ALIASES={
    'allahabad':'Prayagraj','allahabad city':'Prayagraj','prayag':'Prayagraj','prayagraj city':'Prayagraj','prayag raj':'Prayagraj','ilhabad':'Prayagraj',
    'banaras':'Varanasi','benaras':'Varanasi','banarasi':'Varanasi','varansi':'Varanasi','varanasi city':'Varanasi','kashi':'Varanasi','kashi nagari':'Varanasi','banaras city':'Varanasi','benares':'Varanasi',
    'faizabad':'Ayodhya','faizabad city':'Ayodhya','ayodhya dham':'Ayodhya','ayodhya ji':'Ayodhya',
    'noida':'Gautam Buddh Nagar','new okhla':'Gautam Buddh Nagar','greater noida':'Gautam Buddh Nagar','gb nagar':'Gautam Buddh Nagar','gautam buddha nagar':'Gautam Buddh Nagar','gautam buddh nagar':'Gautam Buddh Nagar',
    'mughalsarai':'Chandauli','mughal sarai':'Chandauli','dd u nagar':'Chandauli','deen dayal upadhyaya nagar':'Chandauli','pt deen dayal upadhyaya nagar':'Chandauli',
    'khalilabad':'Sant Kabir Nagar','sant kabir nagar city':'Sant Kabir Nagar','naugarh':'Siddharthnagar','siddharth nagar':'Siddharthnagar','siddharthnagar district':'Siddharthnagar',
    'robertsganj':'Sonbhadra','roberts ganj':'Sonbhadra','orai':'Jalaun','urai':'Jalaun','jalaun city':'Jalaun',
    'barsana':'Mathura','vrindavan':'Mathura','vrindaban':'Mathura','govardhan':'Mathura','gokul':'Mathura','braj':'Mathura','mathura vrindavan':'Mathura',
    'gorakhpur city':'Gorakhpur','jhansi city':'Jhansi','lucknow city':'Lucknow','agra city':'Agra','kanpur city':'Kanpur Nagar','meerut city':'Meerut','bareilly city':'Bareilly',
    'firozabad city':'Firozabad','moradabad city':'Moradabad','saharanpur city':'Saharanpur','kannauj city':'Kannauj','jaunpur city':'Jaunpur','mirzapur city':'Mirzapur','etawah city':'Etawah','aligarh city':'Aligarh','ghaziabad city':'Ghaziabad','hapur city':'Hapur','rampur city':'Rampur','pilibhit city':'Pilibhit','amroha city':'Amroha','budaun city':'Budaun','bulandshahr city':'Bulandshahr','muzaffarnagar city':'Muzaffarnagar','pratapgarh city':'Pratapgarh','sultanpur city':'Sultanpur','unnao city':'Unnao','chitrakoot city':'Chitrakoot','kushinagar city':'Kushinagar','lakhimpur city':'Lakhimpur Kheri','lakhimpur kheri city':'Lakhimpur Kheri'
  };

  const INTENTS=[
    [/\b(ghoomne|ghumne|ghumna|ghoomna|gumna|gumana|dekhne|dekhna|visit|visiting|tourist|places? to visit|must visit|best places|kya ghoome|kya ghume|kahan ghoome|kaha ghoome|kahan ghume|kaha ghume|ghoomne ki jagah|ghumne ki jagah|ghoomne ke place|ghumne ke place|ghoomne wali jagah|ghumne wali jagah|dekhne layak|dekhne ki jagah|kya dekh sakte|kya dekhe)\b/i,'places'],
    [/\b(khana|khana hai|khane|khane ko|khaane|khaana|khaane ko|kya khaye|kya khana|kya khaun|kahan khaye|kaha khaye|food|foods|eat|eating|famous food|local food|street food|food places|khaane ki jagah|khane ki jagah|khaane ke liye)\b/i,'food'],
    [/\b(hotel|hotels|rehne|rehna|rahna|rukna|stay|stays|room|rooms|accommodation|lodge|lodging|kahan ruke|kaha ruke|kahan rahu|kaha rahu|rehne ki jagah|rehne ke liye|rukne ki jagah|stay karna|stay chahiye)\b/i,'hotel'],
    [/\b(hospital|hospitals|doctor|doctors|clinic|clinics|emergency|medical|ilaaj|ilaj|treatment|dawai|dava|health|healthcare|kahan ilaaj|doctor chahiye|hospital chahiye)\b/i,'hospital'],
    [/\b(shopping|shop|shops|market|markets|bazaar|bazar|kharidna|kharidari|shopping karni|kya kharide|kahan shopping|kaha shopping)\b/i,'shopping'],
    [/\b(train|trains|railway|rail|bus|buses|flight|flights|airport|transport|metro|auto|cab|taxi|kaise jaye|kaise jaaye|kaise jana|kaise jaana|kaise pahuche|kaise pahunche|pahuchna|pahunchna|route|raasta|rasta|distance)\b/i,'transport'],
    [/\b(history|itihaas|itihas|historical|historic|culture|sanskriti|parampara|heritage|virasat|kahani|story|stories)\b/i,'history'],
    [/\b(trip|travel|travelling|tour|yatra|itinerary|plan|planning|trip plan|travel plan|kitne din|kitne din ka|weekend|weekend trip)\b/i,'trip'],
    [/\b(kab jaye|kab jaaye|kab jana|kab jaana|best time|best season|season|mausam|weather|sahi time|achha time)\b/i,'best-time']
  ];

  const COMMON={
    'plz':'please','pls':'please','btao':'batao','btana':'batana','bta':'batao','kr':'kar','kro':'karo','krna':'karna','krni':'karni','krdo':'kardo','chahiye':'chahiye','chaahiye':'chahiye','chahie':'chahiye',
    'me':'mein','m':'mein','mai':'mein','ka':'ka','ki':'ki','ke':'ke','ko':'ko','se':'se','par':'par','pe':'par','yha':'yahan','yaha':'yahan','waha':'wahan','kaha':'kahan','kyu':'kyun','kyon':'kyun','kyunki':'kyunki','mujhe':'mujhe','mere':'mere','mera':'mera','meri':'meri','ham':'hum','hum':'hum','aap':'aap','apko':'aapko','apne':'apne','bhi':'bhi','acha':'achha','accha':'achha','achhi':'achhi','badhiya':'badhiya','sahi':'sahi','hai':'hai','hain':'hain','tha':'tha','the':'the','hu':'hoon','hoon':'hoon','nahi':'nahi','nahin':'nahi','haan':'haan','ha':'haan','n':'and','or':'aur','ya':'ya','bas':'bas','sirf':'sirf','sab':'sab','kuch':'kuch','koi':'koi','kaisa':'kaisa','kaisi':'kaisi','kaise':'kaise','kitna':'kitna','kitne':'kitne','kitni':'kitni','famous':'famous','popular':'popular','near':'near','pass':'paas','aaspaas':'aas paas','aas':'aas'
  };

  const norm=s=>String(s||'').toLowerCase().normalize('NFKC').replace(/[’']/g,"'").replace(/[^a-z0-9\u0900-\u097f]+/g,' ').replace(/\s+/g,' ').trim();
  function replaceAliases(s){
    const n=norm(s), keys=Object.keys(ALIASES).sort((a,b)=>b.length-a.length);
    for(const key of keys){
      const re=new RegExp('(^|[^a-z0-9])'+key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^a-z0-9])','i');
      if(re.test(n))return s.replace(re,(_,p)=>p+ALIASES[key]);
    }
    return s;
  }
  function normalize(q){
    let s=replaceAliases(String(q||'').trim());
    for(const [re,token] of INTENTS){if(re.test(s)){s=s.replace(re,token);break;}}
    return s;
  }
  function intentOf(q){const n=norm(q);for(const [re,token] of INTENTS)if(re.test(n))return token;return '';}
  const HINGLISH=/\b(bhai|yaar|yr|bro|mujhe|mere|meri|mera|hum|aap|apko|kya|kahan|kaha|kab|kaise|kaisa|kaisi|kitna|kitne|kitni|chahiye|batao|btao|batana|dikhao|dikhana|jana|jaana|jaye|jaaye|ghoom|ghum|ghumna|ghoomna|ghoomne|ghumne|dekhna|dekhne|khana|khane|khaana|khaane|rehna|rehne|rahna|rukna|ruke|karna|karo|krna|krdo|milega|milenge|paas|pass|aaspaas|famous|best|place|places|hotel|stay|food|hospital|doctor|market|shopping|train|bus|flight|trip|travel|mandir|temple|bazaar|history|culture)\b/i;

  function route(input,e){
    const raw=input.value.trim(); if(!raw)return false;
    const normalized=normalize(raw), changed=normalized!==raw;
    if(!changed&&!HINGLISH.test(raw))return false;
    // askArya is the page's real engine; using it avoids duplicating its UI or knowledge base.
    if(typeof window.askArya!=='function')return false;
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    input.value=normalized;
    window.askArya();
    return true;
  }
  function handle(e){
    if(e.type==='keydown'&&e.key!=='Enter')return;
    const input=document.getElementById('aryaInput')||document.getElementById('userInput');
    if(input)route(input,e);
  }
  document.addEventListener('keydown',handle,true);
  document.addEventListener('click',function(e){
    const b=e.target&&e.target.closest&&e.target.closest('button');
    if(!b)return;
    if(/send|ask|poocho|पूछ/i.test(norm(b.textContent)))handle(e);
  },true);
  window.ExploreUPAryaAliases={aliases:ALIASES,normalize,intentOf,commonWords:COMMON};
})();
