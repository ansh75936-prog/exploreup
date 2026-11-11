function updateMobileDarkStatus(isDark){
 const toggle=document.querySelector('.mobile-menu-toggle');
 const text=document.getElementById('mobileDarkText');
 if(toggle)toggle.classList.toggle('is-on',isDark);
 if(text)text.textContent=isDark?'Dark Theme Active':'Light Theme Active';
}
function toggleDark(){
 document.body.classList.toggle('dark');
 const isDark=document.body.classList.contains('dark');
 exploreStorage.set('exploreup_dark',isDark?'1':'0');
 updateMobileDarkStatus(isDark);
}
const exploreLanguageText={
 nav:{'Home':'होम','Cities':'शहर','Places':'स्थान','Food':'खाना','Travel':'यात्रा','Blogs':'ब्लॉग','About':'हमारे बारे में'},
 headings:{
  '🕘 Recently Viewed':'🕘 हाल ही में देखे गए','🧭 Find a District':'🧭 जिला खोजें','🗺️ Interactive UP District Map':'🗺️ उत्तर प्रदेश जिला मानचित्र',
  '📍 Explore Our Cities':'📍 हमारे शहर देखें','⭐ Why ExploreUP?':'⭐ ExploreUP क्यों?','💎 Hidden Gems of Uttar Pradesh':'💎 उत्तर प्रदेश के छिपे रत्न',
  '🧭 District-wise Exploration':'🧭 जिलेवार खोज','🎉 Festivals Calendar':'🎉 त्योहार कैलेंडर','🍴 Food Trails':'🍴 भोजन यात्रा',
  '🧳 Travel Ideas':'🧳 यात्रा के सुझाव','🌱 Sustainable Travel Tips':'🌱 टिकाऊ यात्रा सुझाव','📝 Featured Blogs':'📝 प्रमुख ब्लॉग',
  'Emergency & Important Helplines':'आपातकालीन और महत्वपूर्ण हेल्पलाइन','About this city':'इस शहर के बारे में','🏨 Hotels / Stays':'🏨 होटल / ठहरने की जगह',
  '🏥 Hospitals':'🏥 अस्पताल','📖 District Knowledge':'📖 जिले की जानकारी','🍴 Food & Cuisine Guide':'🍴 भोजन और व्यंजन गाइड',
  '🚆✈️ Transport Guide — Travel Within Uttar Pradesh':'🚆✈️ परिवहन गाइड — उत्तर प्रदेश में यात्रा','🗓️ Trip Planner':'🗓️ यात्रा योजनाकार',
  '🛍️ Shopping Malls & Centres':'🛍️ शॉपिंग मॉल और सेंटर','⚠️ Report Incorrect Information':'⚠️ गलत जानकारी रिपोर्ट करें',
  '💬 Suggest an Update':'💬 अपडेट सुझाएँ','⭐ Share Your Experience':'⭐ अपना अनुभव साझा करें','🧭 Arya Trip Plan Maker':'🧭 Arya ट्रिप प्लान मेकर'
 }
};
function applyLanguage(isHindi){
 const b=document.getElementById('langBtn');
 if(b)b.textContent=isHindi?'English':'हिंदी';
 document.querySelectorAll('.navlinks a').forEach(a=>{const key=a.textContent.trim();if(exploreLanguageText.nav[key])a.textContent=isHindi?exploreLanguageText.nav[key]:Object.keys(exploreLanguageText.nav).find(k=>exploreLanguageText.nav[k]===key)||key});
 document.querySelectorAll('h2').forEach(h=>{
   const raw=h.dataset.exploreEn||h.textContent.trim();h.dataset.exploreEn=raw;
   if(isHindi&&exploreLanguageText.headings[raw])h.textContent=exploreLanguageText.headings[raw];
   else h.textContent=raw;
 });
 const eyebrow=document.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent=isHindi?'घूमें • खोजें • अनुभव करें':'EXPLORE • DISCOVER • EXPERIENCE';
 const h1=document.querySelector('.hero h1');if(h1)h1.innerHTML=isHindi?'असाधारण से आगे,<em>उत्तर प्रदेश घूमें</em>':'Beyond Ordinary,<em>Explore Extraordinary</em>';
 const heroP=document.querySelector('.hero > div > p');if(heroP)heroP.textContent=isHindi?'उत्तर प्रदेश की संस्कृति, विरासत, भोजन, स्थानों, ठहरने की जगहों और उपयोगी यात्रा जानकारी को शहर-दर-शहर जानें।':'Discover the culture, heritage, food, places, stays and useful travel information of Uttar Pradesh — city by city.';
 try{localStorage.setItem('exploreup_language',isHindi?'hi':'en')}catch(e){}
}
function updateMobileLanguageStatus(isHindi){
  const text=document.getElementById('mobileLanguageText');
  const badge=document.getElementById('mobileLanguageBadge');
  if(text)text.textContent=isHindi?'Active: हिंदी • Tap to switch':'Active: English • Tap to switch';
  if(badge)badge.textContent=isHindi?'हिंदी (Active)':'English (Active)';
}
function toggleLanguage(){
  const isHindi=document.documentElement.lang!=='hi';
  document.documentElement.lang=isHindi?'hi':'en';
  applyLanguage(isHindi);
  updateMobileLanguageStatus(isHindi);
}
(function(){let lang='en';try{lang=localStorage.getItem('exploreup_language')||'en'}catch(e){}document.documentElement.lang=lang;const run=()=>{const isHindi=lang==='hi';applyLanguage(isHindi);updateMobileLanguageStatus(isHindi)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run()})();
if(exploreStorage.get('exploreup_dark')==='1')document.body.classList.add('dark');
updateMobileDarkStatus(document.body.classList.contains('dark'));
