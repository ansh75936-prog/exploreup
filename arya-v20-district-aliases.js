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
    [/\b(ghoomne|ghumne|ghumna|ghoomna|gumna|gumana|dekhne|dekhna|visit|visiting|tourist|tourism|places? to visit|must visit|best places|kya ghoome|kya ghume|kahan ghoome|kaha ghoome|kahan ghume|kaha ghume|ghoomne ki jagah|ghumne ki jagah|ghoomne ke place|ghumne ke place|ghoomne wali jagah|ghumne wali jagah|dekhne layak|dekhne ki jagah|kya dekh sakte|kya dekhe|kya dekhu|kya dekhen|darshan|darshana)\b/i,'places'],
    [/\b(khana|khana hai|khane|khane ko|khaane|khaana|khaane ko|kya khaye|kya khana|kya khaun|kahan khaye|kaha khaye|food|foods|eat|eating|famous food|local food|street food|food places|khaane ki jagah|khane ki jagah|khaane ke liye|kya kha sakte|kya khana milega|kuch khane)\b/i,'food'],
    [/\b(hotel|hotels|rehne|rehna|rahna|rukna|stay|stays|room|rooms|accommodation|lodge|lodging|kahan ruke|kaha ruke|kahan rahu|kaha rahu|rehne ki jagah|rehne ke liye|rukne ki jagah|stay karna|stay chahiye|hotel chahiye|room chahiye|rukne ke liye)\b/i,'hotel'],
    [/\b(hospital|hospitals|doctor|doctors|clinic|clinics|emergency|medical|ilaaj|ilaj|treatment|dawai|dava|health|healthcare|kahan ilaaj|doctor chahiye|hospital chahiye|medical help)\b/i,'hospital'],
    [/\b(shopping|shop|shops|market|markets|bazaar|bazar|kharidna|kharidari|shopping karni|kya kharide|kahan shopping|kaha shopping|kya lena|shopping ke liye)\b/i,'shopping'],
    [/\b(train|trains|railway|rail|bus|buses|flight|flights|airport|transport|metro|auto|cab|taxi|kaise jaye|kaise jaaye|kaise jana|kaise jaana|kaise pahuche|kaise pahunche|pahuchna|pahunchna|route|raasta|rasta|distance|kitni door|kitna door|station|terminal)\b/i,'transport'],
    [/\b(history|itihaas|itihas|historical|historic|culture|sanskriti|parampara|heritage|virasat|kahani|story|stories|purana|purani|pracheen|historical place)\b/i,'history'],
    [/\b(trip|travel|travelling|tour|yatra|itinerary|plan|planning|trip plan|travel plan|kitne din|kitne din ka|weekend|weekend trip|ghoomne ka plan|trip banana|tour plan)\b/i,'trip'],
    [/\b(kab jaye|kab jaaye|kab jana|kab jaana|best time|best season|season|mausam|weather|sahi time|achha time|kis time|kab ghoome)\b/i,'best-time'],
    [/\b(budget|budget me|kitna kharcha|kitne paise|kharcha|cost|price|rates?|sasta|cheap|affordable|paise bachana|budget trip)\b/i,'budget'],
    [/\b(compare|comparison|tulana|better|best among|kaunsa better|kaun sa better|dono me|do jagah|compare karo)\b/i,'compare'],
    [/\b(district|districts|jila|jile|zilla|zila|75 district|75 jile|kaunsa jila|kis district)\b/i,'district'],
    [/\b(mandir|temple|masjid|mosque|gurudwara|church|ghat|fort|qila|mahal|museum|park|zoo|lake|talab|river|nadi|sangam|monument|place)\b/i,'places']
  ];

  // Common Roman-Hindi/Hinglish spellings used naturally on a travel site.
  const COMMON={
    'plz':'please','pls':'please','btao':'batao','bta':'batao','btana':'batana','batana':'batana','btado':'bata do','bta do':'bata do','dikhao':'dikhao','dikha':'dikhao',
    'kr':'kar','kro':'karo','krna':'karna','krni':'karni','krdo':'kardo','kardo':'kardo','krwao':'karwao','karwao':'karwao','chahiye':'chahiye','chaahiye':'chahiye','chahie':'chahiye','chaiye':'chahiye','chiye':'chahiye',
    'me':'mein','m':'mein','mai':'mein','mein':'mein','mene':'maine','maine':'maine','muje':'mujhe','mujhe':'mujhe','mujko':'mujhe','mereko':'mujhe','mere':'mere','mera':'mera','meri':'meri','ham':'hum','hum':'hum','aap':'aap','apko':'aapko','apko':'aapko','apne':'apne',
    'bhi':'bhi','acha':'achha','accha':'achha','achhi':'achhi','achhe':'achhe','badhiya':'badhiya','sahi':'sahi','thik':'theek','thik hai':'theek hai','theek':'theek','hai':'hai','hain':'hain','tha':'tha','the':'the','hu':'hoon','hun':'hoon','hoon':'hoon','nahi':'nahi','nahin':'nahi','ni':'nahi','haan':'haan','han':'haan','ha':'haan',
    'n':'and','or':'aur','ya':'ya','bas':'bas','sirf':'sirf','sab':'sab','sb':'sab','kuch':'kuch','kch':'kuch','koi':'koi','kaisa':'kaisa','kaisi':'kaisi','kaise':'kaise','kitna':'kitna','kitne':'kitne','kitni':'kitni','kyu':'kyun','kyon':'kyun','kyunki':'kyunki',
    'kaha':'kahan','kahan':'kahan','kha':'kahan','yha':'yahan','yaha':'yahan','yahan':'yahan','wha':'wahan','waha':'wahan','wahan':'wahan','idhr':'idhar','udhr':'udhar','pass':'paas','paas':'paas','aaspaas':'aas paas','as paas':'aas paas',
    'ghum':'ghoom','ghumna':'ghoomna','ghoomna':'ghoomna','ghumne':'ghoomne','ghoomne':'ghoomne','ghume':'ghoome','ghoom':'ghoom','gumna':'ghoomna','gumna':'ghoomna','dekhna':'dekhna','dekhne':'dekhne','dekho':'dekho','dekhe':'dekhe',
    'jana':'jaana','jane':'jaane','jaana':'jaana','jaaye':'jaaye','jaye':'jaaye','jao':'jao','pahuch':'pahunch','pahuche':'pahunche','pahuchna':'pahunchna','pahunche':'pahunche','rukna':'rukna','ruke':'ruke','rehna':'rehna','rehne':'rehne','rahna':'rehna',
    'khana':'khana','khane':'khane','khaana':'khana','khaane':'khane','khaun':'khaun','khaye':'khaye','khae':'khaye','milega':'milega','milenge':'milenge','mil sakta':'mil sakta','bata':'batao',
    'famous':'famous','popular':'popular','best':'best','near':'near','nearby':'nearby','place':'place','places':'places','hotel':'hotel','stay':'stay','food':'food','hospital':'hospital','doctor':'doctor','market':'market','shopping':'shopping','train':'train','bus':'bus','flight':'flight','trip':'trip','travel':'travel','mandir':'mandir','temple':'temple','bazaar':'bazaar','history':'history','culture':'culture','budget':'budget'
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
  function normalizeCommon(s){
    return norm(s).split(' ').map(w=>COMMON[w]||w).join(' ');
  }
  function normalize(q){
    let s=replaceAliases(String(q||'').trim());
    s=normalizeCommon(s);
    for(const [re,token] of INTENTS){if(re.test(s)){s=s.replace(re,token);break;}}
    return s;
  }
  function intentOf(q){const n=norm(q);for(const [re,token] of INTENTS)if(re.test(n))return token;return '';}
  const HINGLISH=/\b(bhai|yaar|yr|yrr|bro|mujhe|mere|meri|mera|hum|aap|apko|kya|kahan|kaha|kab|kaise|kaisa|kaisi|kitna|kitne|kitni|chahiye|chaiye|batao|btao|batana|dikhao|dikhana|jana|jaana|jaye|jaaye|ghoom|ghum|ghumna|ghoomna|ghoomne|ghumne|dekhna|dekhne|khana|khane|khaana|khaane|rehna|rehne|rahna|rukna|ruke|karna|karo|krna|krdo|milega|milenge|paas|pass|aaspaas|famous|best|popular|near|nearby|place|places|hotel|stay|food|hospital|doctor|market|shopping|train|bus|flight|trip|travel|mandir|temple|bazaar|history|culture|budget|compare|district|jila|jile)\b/i;

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
  window.ExploreUPAryaAliases={aliases:ALIASES,normalize,intentOf,commonWords:COMMON,intents:INTENTS.map(x=>x[1])};
})();
