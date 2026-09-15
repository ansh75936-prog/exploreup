/* ExploreUP V20 — Arya Hinglish understanding layer. Data-preserving. Cache 20260926 */
(function(){
'use strict';
if(window.__exploreUpAryaDistrictAliasV20)return;
window.__exploreUpAryaDistrictAliasV20=true;

const A={
'allahabad':'Prayagraj','allahabad city':'Prayagraj','prayag':'Prayagraj','prayag raj':'Prayagraj','ilhabad':'Prayagraj',
'banaras':'Varanasi','benaras':'Varanasi','banarasi':'Varanasi','benares':'Varanasi','varansi':'Varanasi','kashi':'Varanasi','kashi nagari':'Varanasi',
'faizabad':'Ayodhya','faizabad city':'Ayodhya','ayodhya dham':'Ayodhya','ayodhya ji':'Ayodhya',
'noida':'Gautam Buddh Nagar','new okhla':'Gautam Buddh Nagar','greater noida':'Gautam Buddh Nagar','gb nagar':'Gautam Buddh Nagar','gautam buddha nagar':'Gautam Buddh Nagar',
'mughalsarai':'Chandauli','mughal sarai':'Chandauli','dd u nagar':'Chandauli','deen dayal upadhyaya nagar':'Chandauli',
'khalilabad':'Sant Kabir Nagar','naugarh':'Siddharthnagar','siddharth nagar':'Siddharthnagar','robertsganj':'Sonbhadra','roberts ganj':'Sonbhadra',
'orai':'Jalaun','urai':'Jalaun','barsana':'Mathura','vrindavan':'Mathura','vrindaban':'Mathura','govardhan':'Mathura','gokul':'Mathura','braj':'Mathura',
'gorakhpur city':'Gorakhpur','jhansi city':'Jhansi','lucknow city':'Lucknow','agra city':'Agra','kanpur city':'Kanpur Nagar','meerut city':'Meerut','bareilly city':'Bareilly',
'firozabad city':'Firozabad','moradabad city':'Moradabad','saharanpur city':'Saharanpur','kannauj city':'Kannauj','jaunpur city':'Jaunpur','mirzapur city':'Mirzapur','etawah city':'Etawah','aligarh city':'Aligarh','ghaziabad city':'Ghaziabad','hapur city':'Hapur','rampur city':'Rampur','pilibhit city':'Pilibhit','amroha city':'Amroha','budaun city':'Budaun','bulandshahr city':'Bulandshahr','muzaffarnagar city':'Muzaffarnagar','pratapgarh city':'Pratapgarh','sultanpur city':'Sultanpur','unnao city':'Unnao','chitrakoot city':'Chitrakoot','kushinagar city':'Kushinagar','lakhimpur city':'Lakhimpur Kheri','lakhimpur kheri city':'Lakhimpur Kheri'
};
const C={
'kr':'kar','kro':'karo','krna':'karna','krni':'karni','krdo':'kardo','krwao':'karwao','bta':'batao','btao':'batao','btado':'bata do','btana':'batana','dikha':'dikhao','plz':'please','pls':'please',
'me':'mein','m':'mein','mai':'mein','muje':'mujhe','mujko':'mujhe','mereko':'mujhe','apko':'aapko','sb':'sab','kch':'kuch','acha':'achha','accha':'achha','thik':'theek','nahi':'nahi','nahin':'nahi','ni':'nahi','han':'haan','ha':'haan','kyu':'kyun','kyon':'kyun',
'kaha':'kahan','kha':'kahan','yha':'yahan','yaha':'yahan','wha':'wahan','waha':'wahan','idhr':'idhar','udhr':'udhar','pass':'paas','aaspaas':'aas paas',
'ghum':'ghoom','ghumna':'ghoomna','gumna':'ghoomna','ghumne':'ghoomne','ghume':'ghoome','jana':'jaana','jane':'jaane','jaye':'jaaye','pahuch':'pahunch','pahuche':'pahunche','pahuchna':'pahunchna','rahna':'rehna',
'khane':'khane','khaane':'khane','khaana':'khana','khaun':'khaun','khaye':'khaye','khae':'khaye','milega':'milega','milenge':'milenge'
};
const I=[
[/\b(ghoomne|ghumne|ghoomna|ghumna|ghoom|ghum|dekhne|dekhna|dekho|dekhe|visit|visiting|tourist|tourism|must visit|best places|places? to visit|places?|kya ghoome|kya ghume|kahan ghoome|kaha ghoome|kahan ghume|kaha ghume|ghoomne ki jagah|ghumne ki jagah|ghoomne wali jagah|ghumne wali jagah|dekhne layak|dekhne ki jagah|kya dekh sakte|kya dekhe|kya dekhu|kya dekhen|darshan)\b/i,'places'],
[/\b(khana|khane|khana hai|khane ko|khaane|khaana|kya khaye|kya khana|kya khaun|kahan khaye|kaha khaye|food|foods|eat|eating|famous food|local food|street food|food places|khaane ki jagah|khane ki jagah|khaane ke liye|kya kha sakte|kya khana milega)\b/i,'food'],
[/\b(hotel|hotels|rehne|rehna|rahna|rukna|ruke|stay|stays|room|rooms|accommodation|lodge|lodging|kahan ruke|kaha ruke|kahan rahu|kaha rahu|rehne ki jagah|rehne ke liye|rukne ki jagah|stay karna|stay chahiye|hotel chahiye|room chahiye|rukne ke liye)\b/i,'hotel'],
[/\b(hospital|hospitals|doctor|doctors|clinic|clinics|emergency|medical|ilaaj|ilaj|treatment|dawai|dava|health|healthcare|doctor chahiye|hospital chahiye|medical help)\b/i,'hospital'],
[/\b(shopping|shop|shops|market|markets|bazaar|bazar|kharidna|kharidari|shopping karni|kya kharide|kahan shopping|kaha shopping|kya lena|shopping ke liye)\b/i,'shopping'],
[/\b(train|trains|railway|rail|bus|buses|flight|flights|airport|transport|metro|auto|cab|taxi|kaise jaye|kaise jaaye|kaise jana|kaise jaana|kaise pahuche|kaise pahunche|pahuchna|pahunchna|route|raasta|rasta|distance|kitni door|kitna door|station|terminal)\b/i,'transport'],
[/\b(history|itihaas|itihas|historical|historic|culture|sanskriti|parampara|heritage|virasat|kahani|story|stories|purana|purani|pracheen)\b/i,'history'],
[/\b(trip|travel|travelling|tour|yatra|itinerary|plan|planning|trip plan|travel plan|kitne din|kitne din ka|weekend|weekend trip|ghoomne ka plan|trip banana|tour plan)\b/i,'trip'],
[/\b(kab jaye|kab jaaye|kab jana|kab jaana|best time|best season|season|mausam|weather|sahi time|achha time|kis time|kab ghoome)\b/i,'best-time'],
[/\b(budget|budget me|kitna kharcha|kitne paise|kharcha|cost|price|rates?|sasta|cheap|affordable|budget trip)\b/i,'budget'],
[/\b(compare|comparison|tulana|better|best among|kaunsa better|kaun sa better|dono me|do jagah|compare karo)\b/i,'compare']
];
const norm=s=>String(s||'').toLowerCase().normalize('NFKC').replace(/[’']/g,"'").replace(/[^a-z0-9\u0900-\u097f]+/g,' ').replace(/\s+/g,' ').trim();
function alias(s){let n=norm(s);for(const k of Object.keys(A).sort((a,b)=>b.length-a.length)){const r=new RegExp('(^|[^a-z0-9])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^a-z0-9])','i');if(r.test(n))return s.replace(r,(_,p)=>p+A[k]);}return s;}
function common(s){return norm(s).split(' ').map(w=>C[w]||w).join(' ');}
function normalize(q){let s=common(alias(q));for(const [r,t]of I){if(r.test(s)){s=s.replace(r,t);break;}}return s;}
const H=/\b(bhai|yaar|yr|yrr|bro|mujhe|mere|meri|mera|hum|aap|apko|kya|kahan|kaha|kab|kaise|kitna|kitne|kitni|chahiye|chaiye|btao|bta|krna|krdo|ghoom|ghum|ghumna|ghumne|dekhne|places?|khana|khane|khaane|rehna|rehne|rahna|rukna|ruke|hotel|stay|room|food|hospital|doctor|shopping|market|train|bus|flight|trip|travel|mandir|temple|history|culture|budget|compare|jila|jile)\b/i;
const SAFE_CITY={Prayagraj:'pray'};
function safeEngineQuery(s){let out=s;for(const [city,token]of Object.entries(SAFE_CITY)){const r=new RegExp('(^|[^a-z0-9])'+city.toLowerCase()+'(?=$|[^a-z0-9])','i');out=out.replace(r,(_,p)=>p+token);}return out;}
async function route(input,e){const raw=input.value.trim();if(!raw)return false;const n=normalize(raw),changed=n!==norm(raw);if(!changed&&!H.test(raw))return false;if(typeof window.aryaAnswer!=='function')return false;if(e){e.preventDefault();e.stopImmediatePropagation();}
const b=document.getElementById('aryaBody');if(typeof window.aryaAdd==='function')window.aryaAdd(raw,'user');input.value='';const temp=document.createElement('div');temp.className='arya-msg bot';temp.textContent='Checking ExploreUP information…';if(b){b.appendChild(temp);b.scrollTop=b.scrollHeight;}
try{const answer=await window.aryaAnswer(safeEngineQuery(n),(document.documentElement.lang||'en').startsWith('hi')?'hi':'en');if(temp.parentNode)temp.remove();if(typeof window.aryaAdd==='function')window.aryaAdd(answer,'bot');}catch(err){if(temp.parentNode)temp.remove();if(typeof window.aryaAdd==='function')window.aryaAdd('I could not load ExploreUP information right now. Please try again.','bot');}return true;}
function handle(e){if(e.type==='keydown'&&e.key!=='Enter')return;const input=document.getElementById('aryaInput')||document.getElementById('userInput');if(input)route(input,e);}
document.addEventListener('keydown',handle,true);document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('button');if(b&&/send|ask|poocho|पूछ/i.test(norm(b.textContent)))handle(e);},true);window.ExploreUPAryaAliases={aliases:A,normalize,intentOf:q=>{const n=norm(q);for(const[r,t]of I)if(r.test(n))return t;return '';},commonWords:C,intents:I.map(x=>x[1])};
})();