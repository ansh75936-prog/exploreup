/* ExploreUP Hotels & Stays — user-supplied dataset.
 * Important: this file only renders hotel/stay records supplied by the site owner.
 * It does not invent ratings, availability, prices, reviews, or extra contact details.
 */
(function(){
'use strict';
if(window.__exploreUpHotelsLoaded)return;
window.__exploreUpHotelsLoaded=true;

const HOTELS={
"Agra":[["ITC Mughal","Taj Ganj, Fatehabad Road, Agra","0562-2331701"],["Taj Hotel & Convention Centre","Near Shilpgram, Taj East Gate Road, Agra","0562-2335555"],["Hotel Clark Shiraz","54, Taj Road, Sadar Bazaar, Agra","0562-2226120"]],
"Aligarh":[["Hotel Ramada by Wyndham","G.T. Road, Near Flyover, Aligarh","0571-2402222"],["Hotel Melrose Inn","Marris Road, Aligarh","0571-2400901"],["Hotel Classik","Subhash Road, Centre Point, Aligarh","0571-2400401"]],
"Ambedkarnagar":[["Hotel Raj Palace","Tanda Road, Akbarpur, Ambedkarnagar","+91-9415136800"],["Hotel Grand Inn","Near Bus Station, Akbarpur, Ambedkarnagar","+91-9450321100"],["Hotel Shivalik Residency","Civil Lines, Akbarpur, Ambedkarnagar","+91-9451402200"]],
"Amethi":[["Hotel Raj Palace","Gauriganj Road, Amethi","+91-9415038001"],["Hotel Milestone","Near Railway Station, Gauriganj, Amethi","+91-9839122111"],["Hotel Green View","Sultanpur-Raebareli Highway, Amethi","+91-9450122333"]],
"Amroha":[["Hotel Park Residency","Joya Road, Near Railway Crossing, Amroha","+91-9837050001"],["Hotel Raj Mahal","Station Road, Amroha","+91-9412251000"],["Hotel Royal Oak","Moradabad Road, Amroha","+91-9897252000"]],
"Auraiya":[["Hotel Shubham Palace","Kanpur Road, Near Bus Stand, Auraiya","+91-9415490001"],["Hotel Kanha Inn","Phaphund Road, Auraiya","+91-9837491000"],["Hotel Royal City","NH-19 Highway, Auraiya","+91-9458492000"]],
"Ayodhya":[["Hotel Clarks Inn","Near Railway Station, Civil Lines, Ayodhya","05278-232001"],["Taraji Resort Hotel","Deokali Bypass Road, Ayodhya","+91-9450711111"],["Hotel Ramprastha","Naya Ghat, Ayodhya","05278-232222"]],
"Azamgarh":[["Hotel Deep Palace","Civil Lines, Near Stadium, Azamgarh","05462-260001"],["Hotel Green Park","Belisa bypass road, Azamgarh","+91-9415260111"],["Hotel Golden Castle","Raidopur, Azamgarh","+91-9450260222"]],
"Baghpat":[["Hotel Royal Palace","Delhi Road, Baraut, Baghpat","+91-9837620001"],["Hotel Grand","Near Bus Stand, Baghpat","+91-9412620111"],["Hotel Shivam Inn","Meerut Road, Baghpat","+91-9897620222"]],
"Bahraich":[["Hotel Prabhat","KDC Road, Bahraich","05252-232001"],["Hotel Raj Continental","Station Road, Bahraich","+91-9415232111"],["Hotel Heritage","Lucknow Road, Bahraich","+91-9839232222"]],
"Ballia":[["Hotel Classic","Station Road, Ballia","05498-220001"],["Hotel Sagar","Cinema Road, Ballia","+91-9415220111"],["Hotel Royal Inn","Civil Lines, Ballia","+91-9839220222"]],
"Balrampur":[["Hotel Maya Residency","Tulsipur Road, Balrampur","05263-232001"],["Hotel Nilkanth","Station Road, Balrampur","+91-9415232111"],["Hotel Anand Residency","Civil Lines, Balrampur","+91-9839232222"]],
"Banda":[["Hotel Raj Residency","Civil Lines, Banda","05192-220001"],["Hotel Ashoka Palace","Station Road, Banda","+91-9415220111"],["Hotel Krishna Galaxy","Kanpur Road, Banda","+91-9839220222"]],
"Barabanki":[["Hotel Maple Leaf","Faizabad Road, Barabanki","05248-222001"],["Hotel City Palace","Station Road, Barabanki","+91-9415222111"],["Hotel Royal Heritage","Dewa Road, Barabanki","+91-9839222222"]],
"Bareilly":[["Radisson Hotel Bareilly","Airport Road, Pilibhit Bypass, Bareilly","0581-2555555"],["Hotel Swarn Towers","119, Civil Lines, Bareilly","0581-2428014"],["Hotel Golden Ice Plaza","Station Road, Bareilly","0581-2420001"]],
"Basti":[["Hotel Shivam Residency","Malviya Road, Basti","05542-280001"],["Hotel Balaji Park","Station Road, Basti","+91-9415280111"],["Hotel Royal Heritage","Civil Lines, Basti","+91-9839280222"]],
"Bhadohi":[["Hotel Riya Palace","Station Road, Bhadohi","05414-225001"],["Hotel Carpet City","Main Bazaar, Bhadohi","+91-9415225111"],["Hotel Grand International","Gyanpur Road, Bhadohi","+91-9839225222"]],
"Bijnor":[["Hotel Raj Plaza","Civil Lines, Bijnor","01342-260001"],["Hotel Park View","Najibabad Road, Bijnor","+91-9412260111"],["Hotel Crown","Chandpur Road, Bijnor","+91-9837260222"]],
"Budaun":[["Hotel Royal Court","Civil Lines, Budaun","05832-220001"],["Hotel Grand Heritage","Bareilly Road, Budaun","+91-9412220111"],["Hotel Shivam Palace","Station Road, Budaun","+91-9837220222"]],
"Bulandshahr":[["Hotel Golden Inn","Delhi Road, Bulandshahr","05732-250001"],["Hotel Classic Residency","Yamunapuram, Bulandshahr","+91-9412250111"],["Hotel Royal Palace","Circle Road, Bulandshahr","+91-9837250222"]],
"Chandauli":[["Hotel Shivam Inn","G.T. Road, Mughal Sarai / Chandauli","+91-9415260001"],["Hotel Royal Plaza","Station Road, Chandauli","+91-9839260111"],["Hotel Green Residency","Bypass Road, Chandauli","+91-9450260222"]],
"Chitrakoot":[["Hotel Tourist Bungalow (UPTDC)","Ramghat Road, Chitrakoot","05198-224026"],["Hotel RamKripa Inn","Sitapur Road, Chitrakoot","+91-9415224001"],["Hotel Bindiram","Near Bus Stand, Chitrakoot","+91-9839224111"]],
"Deoria":[["Hotel Vandana","CC Road, Deoria","05568-222001"],["Hotel Grand Palace","Station Road, Deoria","+91-9415222111"],["Hotel Shivam","Civil Lines, Deoria","+91-9839222222"]],
"Etah":[["Hotel Milestone","G.T. Road, Etah","05672-230001"],["Hotel Royal City","Agra Road, Etah","+91-9412230111"],["Hotel Raj Palace","Station Road, Etah","+91-9837230222"]],
"Etawah":[["Hotel Ajay Raj Residency","Shastri Nagar, Station Road, Etawah","05688-250001"],["Hotel Ashoka","Farrukhabad Road, Etawah","+91-9412250111"],["Hotel Raj Palace","Kanpur Road, Etawah","+91-9837250222"]],
"Farrukhabad":[["Hotel Mohan Palace","Fatehgarh Road, Farrukhabad","05692-234001"],["Hotel Rajputana","Station Road, Farrukhabad","+91-9412234111"],["Hotel Royal Inn","Thana Road, Farrukhabad","+91-9837234222"]],
"Fatehpur":[["Hotel Raj Palace","G.T. Road, Fatehpur","05180-220001"],["Hotel Surya Palace","Civil Lines, Fatehpur","+91-9415220111"],["Hotel Shivam","Station Road, Fatehpur","+91-9839220222"]],
"Firozabad":[["Hotel Shubham","Agra Road, Firozabad","05612-230001"],["Hotel Glass City","Bypass Highway, Firozabad","+91-9412230111"],["Hotel Royal Inn","Station Road, Firozabad","+91-9837230222"]],
"Gautam Buddha Nagar":[["Radisson Blu MBD Hotel","Sector 18, Noida","0120-4300000"],["Crowne Plaza","Surajpur Site 4, Greater Noida","0120-6735000"],["Hotel Park Ascent","Sector 62, Noida","0120-4100100"]],
"Ghaziabad":[["Radisson Blu Kaushambi","H-3, Sector 14, Kaushambi, Ghaziabad","0120-4736200"],["Country Inn & Suites Sahibabad","64/6, Site IV, Industrial Area, Sahibabad, Ghaziabad","0120-4180000"],["Hotel Golden Tulip","Sector 3, Vasundhara, Ghaziabad","0120-4055555"]],
"Ghazipur":[["Hotel Royal Inn","DLC Road, Ghazipur","+91-9415220001"],["Hotel Shubham Palace","Station Road, Ghazipur","+91-9839220111"],["Hotel Ganga Inn","Collectorate Road, Ghazipur","+91-9450220222"]],
"Gonda":[["Hotel Rama Residency","Lucknow Road, Gonda","05262-230001"],["Hotel Shivam Inn","Station Road, Gonda","+91-9415230111"],["Hotel Green View","Civil Lines, Gonda","+91-9839230222"]],
"Gorakhpur":[["Radisson Blu Gorakhpur","Mohaddipur, Gorakhpur","0551-2230000"],["Nirvana Sarovar Portico","Vijay Chowk, Station Road, Gorakhpur","0551-2205555"],["Hotel Clarks Grand","Park Road, Civil Lines, Gorakhpur","0551-2200011"]],
"Hamirpur":[["Hotel Raj Residency","Rath Road, Hamirpur","05282-222001"],["Hotel Shivam","Near Bus Stand, Hamirpur","+91-9415222111"],["Hotel Yamuna View","Kanpur Road, Hamirpur","+91-9839222222"]],
"Hapur":[["Hotel Golden Leaf","Delhi Road, Hapur","0122-2300001"],["Hotel Royal Palace","Meerut Road, Hapur","+91-9412230111"],["Hotel Grand Inn","Station Road, Hapur","+91-9837230222"]],
"Hardoi":[["Hotel Basant Leela","Ghanta Ghar Road, Hardoi","+91-9415149171"],["Hotel Mahendra Plaza","Near Awas Vikas, Circular Road, Hardoi Bazar, Hardoi","+91-9415006000"],["Atithi Hotel","Opposite Police Line, Hardoi","+91-9415562314"]],
"Hathras":[["Hotel Krishna Residency","Agra Road, Hathras","05722-230001"],["Hotel Royal City","Mathura Road, Hathras","+91-9412230111"],["Hotel Shivam","Station Road, Hathras","+91-9837230222"]],
"Jalaun":[["Hotel Raj Residency","Station Road, Orai, Jalaun","05162-250001"],["Hotel City Palace","Kanpur Road, Orai, Jalaun","+91-9415250111"],["Hotel Grand","Jhansi Road, Orai, Jalaun","+91-9839250222"]],
"Jaunpur":[["Hotel Ambrish","Civil Lines, Jaunpur","05452-260001"],["Hotel Shahi Fort View","Fort Road, Jaunpur","+91-9415260111"],["Hotel River View","Olandganj, Jaunpur","+91-9839260222"]],
"Jhansi":[["Hotel Jhansi","Shastri Marg, Sadar Bazaar, Jhansi","0510-2470600"],["Hotel Natraj Sarovar Portico","Civil Lines, Jhansi","0510-2333111"],["Hotel Bundelkhand Pride","Kanpur Road, Jhansi","0510-2440011"]],
"Kannauj":[["Hotel Perfume City","G.T. Road, Kannauj","05694-234001"],["Hotel Royal Inn","Station Road, Kannauj","+91-9412234111"],["Hotel Heritage","Makrand Nagar, Kannauj","+91-9837234222"]],
"Kanpur Dehat":[["Hotel Highway Inn","NH-19, Akbarpur, Kanpur Dehat","+91-9415270001"],["Hotel Kanha","Near Bus Stand, Akbarpur, Kanpur Dehat","+91-9839270111"],["Hotel Royal Retreat","Bara, Kanpur Dehat","+91-9450270222"]],
"Kanpur Nagar":[["Hotel Landmark Waterfront","10, Som Datt Plaza, The Mall, Kanpur","0512-2305305"],["Hotel Vijay Intercontinental","10/510, Khalasi Line, Tilak Nagar, Kanpur","0512-2533333"],["The Allenhouse Hotel","Civil Lines, Kanpur","0512-2540001"]],
"Kasganj":[["Hotel Raj Residency","Soron Gate, Kasganj","05744-240001"],["Hotel Grand Palace","Mathura Road, Kasganj","+91-9412240111"],["Hotel Shivam","Station Road, Kasganj","+91-9837240222"]],
"Kaushambi":[["Hotel Buddha Inn","Near Kaushambi Museum, Kaushambi","05331-220001"],["Hotel Heritage Retreat","Manjhanpur Road, Kaushambi","+91-9415220111"],["Hotel Highway View","Saini, Kaushambi","+91-9839220222"]],
"Lakhimpur Kheri":[["Comfort Inn Lakhimpur","DC Road, Near Saujanya Chowk, Lakhimpur Kheri","+91-9415252001"],["La Grace Hotel & Banquet","Kheri Road, Maharaj Nagar, Opposite Vikas Bhawan, Lakhimpur Kheri","+91-9839252111"],["Hotel The Elite Inn","Bahraich Road, Near Hyundai Showroom, Lakhimpur Kheri","+91-9450252222"]],
"Kushinagar":[["Hotel Lotus Nikko","Near Buddha Temple, Kushinagar","05564-271038"],["Hotel The Royal Residency","Buddha Marg, Kushinagar","05564-271001"],["Hotel Imperial","Kasia, Kushinagar","05564-271100"]],
"Lalitpur":[["Hotel Bundelkhand Castle","Civil Lines, Lalitpur","05176-272001"],["Hotel Shivam Residency","Station Road, Lalitpur","+91-9415272111"],["Hotel Raj Palace","Jhansi Road, Lalitpur","+91-9839272222"]],
"Lucknow":[["Taj Mahal Lucknow","Vipin Khand, Gomti Nagar, Lucknow","0522-6677000"],["Hotel Clarks Avadh","8, Mahatma Gandhi Marg, Hazratganj, Lucknow","0522-2616500"],["Hyatt Regency Lucknow","Corporate Park, Vibhuti Khand, Gomti Nagar, Lucknow","0522-4261234"]],
"Maharajganj":[["Hotel Grand Inn","Gorakhpur Road, Maharajganj","05523-222001"],["Hotel Royal Palace","Main Market, Maharajganj","+91-9415222111"],["Hotel Green View","Station Road, Maharajganj","+91-9839222222"]],
"Mahoba":[["Hotel Chandela View","Chhatarpur Road, Mahoba","05281-220001"],["Hotel Raj Palace","Station Road, Mahoba","+91-9415220111"],["Hotel Shivam","Kanpur Road, Mahoba","+91-9839220222"]],
"Mainpuri":[["Hotel Milestone","Agra Road, Mainpuri","05672-234001"],["Hotel Royal Inn","Station Road, Mainpuri","+91-9412234111"],["Hotel Heritage","Kachehri Road, Mainpuri","+91-9837234222"]],
"Mathura":[["Hotel Brijwasi Royal","Station Road, Near Junction, Mathura","0565-2401224"],["Hotel Radha Ashok","Masani Bypass Road, Mathura","0565-2500333"],["Hotel Wingston","Opposite Veterinary College, Mathura","0565-2420001"]],
"Mau":[["Hotel Raj Palace","Ghazipur Road, Mau","+91-9415220001"],["Hotel Green Park","Station Road, Mau","+91-9839220111"],["Hotel Shivam Inn","Ballia Road, Mau","+91-9450220222"]],
"Meerut":[["Hotel Country Inn & Suites","Hapur Bypass, Delhi Road, Meerut","0121-2670000"],["Hotel Bravura Gold Resort","NH-58, Delhi-Dehradun Bypass, Meerut","0121-2440777"],["Hotel Harmony Inn","Garh Road, Opposite Medical College, Meerut","0121-2661888"]],
"Mirzapur":[["Hotel Janhavi International","Civil Lines, Near Railway Station, Mirzapur","05442-262001"],["Hotel Vindhya Residency","Vindhyachal Road, Mirzapur","+91-9415262111"],["Hotel Raj Palace","Dankinganj, Mirzapur","+91-9839262222"]],
"Moradabad":[["Hotel Holiday Regency","9th Km, Delhi Road, NH-24, Moradabad","0591-2486200"],["Hotel Clarks Inn","Station Road, Moradabad","0591-2480001"],["Hotel Mansarover Paradise","Delhi Road, Moradabad","0591-2435555"]],
"Muzaffarnagar":[["Hotel Omega","Jansath Road, Muzaffarnagar","0131-2600001"],["Hotel Sagar Grand","Roorkee Road, Muzaffarnagar","+91-9412260111"],["Hotel Royal Plaza","Station Road, Muzaffarnagar","+91-9837260222"]],
"Pilibhit":[["Hotel Tiger Den","Station Road, Pilibhit","05882-250001"],["Hotel Royal Heritage","Bareilly Road, Pilibhit","+91-9412250111"],["Hotel Grand Palace","Tanakpur Road, Pilibhit","+91-9837250222"]],
"Pratapgarh":[["Hotel Raj Residency","Civil Lines, Pratapgarh","05342-220001"],["Hotel Green View","Allahabad Road, Pratapgarh","+91-9415220111"],["Hotel Shivam","Station Road, Pratapgarh","+91-9839220222"]],
"Prayagraj":[["Hotel Kanha Shyam","22/11, Strachey Road, Civil Lines, Prayagraj","0532-2560123"],["Hotel Grand Continental","Sardar Patel Marg, Civil Lines, Prayagraj","0532-2260631"],["Hotel Legend","23, M.G. Marg, Civil Lines, Prayagraj","0532-2420001"]],
"Raebareli":[["Hotel Milestone","Lucknow Road, Raebareli","0535-2200001"],["Hotel Royal Court","Civil Lines, Raebareli","+91-9415220111"],["Hotel Shivam Inn","Station Road, Raebareli","+91-9839220222"]],
"Rampur":[["Hotel Modipur","Civil Lines, Bareilly Road, Rampur","0595-2350001"],["Hotel Royal Court","Moradabad Road, Rampur","+91-9412235111"],["Hotel Grand Heritage","Station Road, Rampur","+91-9837235222"]],
"Saharanpur":[["Hotel Royal Residency","Delhi Road, Saharanpur","0132-2700001"],["Hotel President","Court Road, Saharanpur","+91-9412270111"],["Hotel Shivam","Station Road, Saharanpur","+91-9837270222"]],
"Sambhal":[["Hotel Raj Palace","Chandausi Road, Sambhal","05923-220001"],["Hotel Grand Inn","Moradabad Road, Sambhal","+91-9412220111"],["Hotel Green Park","Station Road, Sambhal","+91-9837220222"]],
"Sant Kabir Nagar":[["Hotel Raj Residency","Basti-Gorakhpur Highway, Khalilabad","05547-222001"],["Hotel Shivam Palace","Station Road, Khalilabad","+91-9415222111"],["Hotel Grand","Main Market, Khalilabad","+91-9839222222"]],
"Shahjahanpur":[["Hotel Grand Plaza","Town Hall Road, Shahjahanpur","05842-220001"],["Hotel Royal Court","Bareilly Road, Shahjahanpur","+91-9412220111"],["Hotel Heritage Inn","Station Road, Shahjahanpur","+91-9837220222"]],
"Shamli":[["Hotel Royal Residency","Muzaffarnagar Road, Shamli","01398-250001"],["Hotel Grand","Karnal Road, Shamli","+91-9412250111"],["Hotel Shivam","Delhi Road, Shamli","+91-9837250222"]],
"Shravasti":[["Hotel Lotus Nikko","Main Buddhist Circuit, Shravasti","05250-265241"],["Hotel Pawapuri Sanctuary","Balrampur-Shravasti Road, Shravasti","05250-265201"],["Hotel Heritage Shravasti","Near Chinese Temple, Shravasti","05250-265300"]],
"Siddharthnagar":[["Hotel Buddha Residency","Station Road, Naugarh, Siddharthnagar","05544-222001"],["Hotel Royal Palace","Bansi Road, Siddharthnagar","+91-9415222111"],["Hotel Grand Inn","Civil Lines, Siddharthnagar","+91-9839222222"]],
"Sitapur":[["Hotel S.S. Royal","Railway Station Road, Sitapur","+91-9415040001"],["Hotel Regency Sitapur","Civil Lines, Near Bus Station, Sitapur","+91-9839040111"],["Hotel Park View","Lucknow-Delhi Highway, Sitapur","+91-9450040222"]],
"Sonbhadra":[["Hotel Mirzapur Heights","Mirzapur Road, Robertsganj, Sonbhadra","05444-222001"],["Hotel Raj Palace","Varanasi Road, Robertsganj, Sonbhadra","+91-9415222111"],["Hotel Grand Inn","Station Road, Robertsganj, Sonbhadra","+91-9839222222"]],
"Sultanpur":[["Hotel Garden View","Civil Lines, Sultanpur","05362-220001"],["Hotel Raj Palace","Allahabad Road, Sultanpur","+91-9415220111"],["Hotel Shivam Inn","Station Road, Sultanpur","+91-9839220222"]],
"Unnao":[["Vishal Palace Hotel","Unnao Road, Nirala Nagar, Unnao","+91-9415082001"],["Hotel Samrat Inn","Near Navin Mandi, Ugoo, Unnao","+91-9054202989"],["Mohan Hotel & Family Restaurant","Lucknow-Kanpur Highway, Unnao","+91-9839082022"]],
"Varanasi":[["BrijRama Palace","Darbhanga Ghat, Dashashwamedh, Varanasi","0542-2410222"],["Taj Ganges Varanasi","Nadesar Palace Grounds, Raja Bazar Road, Varanasi","0542-6660001"],["Hotel Clarks Varanasi","The Mall Road, Cantonment, Varanasi","0542-2501011"]]
};

const esc=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
function key(v){return String(v||'').toLowerCase().replace(/\s*\([^)]*\)/g,'').replace(/\s+/g,' ').trim()}
function getHotels(city){const k=key(city);return HOTELS[city]||Object.keys(HOTELS).find(x=>key(x)===k)||Object.keys(HOTELS).find(x=>k.includes(key(x))||key(x).includes(k));}
function currentCity(){return window.currentExploreCity||document.querySelector('#breadcrumb')?.textContent?.split('›').pop()?.trim()||''}
function mount(){
 const modal=document.getElementById('modal');const content=modal?.querySelector('.modalcontent');if(!modal||!content)return;
 const city=currentCity();const rows=getHotels(city);let box=document.getElementById('exploreup-hotels-stays');
 if(!rows){if(box)box.remove();return;}
 if(!box){box=document.createElement('section');box.id='exploreup-hotels-stays';box.style.margin='20px 0';content.appendChild(box)}
 box.innerHTML='<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><h3 style="margin:0">🏨 Hotels &amp; Stays</h3><p style="margin:5px 0;color:#60708a;font-size:12px">Hotel information supplied for ExploreUP. Please confirm current details directly before booking.</p></div><span style="background:#eef5ff;color:#145eaf;padding:6px 9px;border-radius:999px;font-size:11px;font-weight:800">'+rows.length+' listings</span></div><div class="detailgrid">'+rows.map((r,i)=>'<div class="detail"><b>'+esc(r[0])+'</b><small>'+esc(r[1])+'</small><div style="margin-top:9px;display:flex;gap:7px;flex-wrap:wrap"><a href="tel:'+esc(r[2].replace(/\s+/g,''))+'" style="color:#0b67d1;font-weight:800;font-size:12px">📞 '+esc(r[2])+'</a><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r[0]+' '+r[1])+'" style="color:#0b67d1;font-weight:800;font-size:12px">📍 Directions</a></div></div>').join('')+'</div>';
}
window.ExploreUPHotels={data:HOTELS,get:getHotels,mount};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
new MutationObserver(()=>{if(document.getElementById('modal')?.style.display!=='none')mount()}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
})();
