function aryaDetectLanguage(text){
 const t=String(text||'').trim(),x=t.toLowerCase();
 if(/[\u0900-\u097F]/.test(t)) return 'hi';
 if(/[\u0980-\u09FF]/.test(t)) return 'bn';
 if(/[\u0A00-\u0A7F]/.test(t)) return 'pa';
 if(/[\u0B80-\u0BFF]/.test(t)) return 'ta';
 if(/[\u0C00-\u0C7F]/.test(t)) return 'te';
 if(/[\u0C80-\u0CFF]/.test(t)) return 'kn';
 if(/[\u0D00-\u0D7F]/.test(t)) return 'ml';
 // Detect common romanised Indian-language questions too.
 if(/\b(kya|kaise|kahan|kidhar|batao|bataye|baare|ke bare|khana|khane|mithai|jagah|ghumna|ghoomna|kitna|kab|kyun|mujhe|mera|meri|hai|hain|mein|par|aur|se|ka|ki|ke)\b/.test(x)) return 'hi';
 if(/\b(kemon|ki|kothay|bolun|bolbe|khawa|khawar|mishti|jayga|ghurte|ami|amar|ache|achen)\b/.test(x)) return 'bn';
 if(/\b(kiwe|kithe|dasso|dasde|khana|thaan|ghumman|mainu|mera|meri|hai|ne)\b/.test(x)) return 'pa';
 return 'en';
}
const aryaLanguageText={
 en:{history:'History',places:'Top places',food:'Food guide',culture:'Culture & traditions',nature:'Nature',tip:'Travel tip',shopping:'Shopping',budget:'Budget guide',trip:'Quick trip idea',ask:'Ask me specifically about food, places, history, culture, nature, shopping, hotels, hospitals, budget or a trip plan.',welcome:'Hello! I’m Arya, your ExploreUP travel assistant.',all:'I have dedicated knowledge for all 75 ExploreUP districts, including district-wise places, food, hotels/stays, hospitals, transport, shopping, culture, nature and trip ideas. Ask me any district or city and I can help you find the relevant information.'},
 hi:{history:'इतिहास',places:'प्रमुख स्थान',food:'खाने-पीने की जानकारी',culture:'संस्कृति और परंपराएँ',nature:'प्रकृति',tip:'यात्रा सुझाव',shopping:'खरीदारी',budget:'बजट गाइड',trip:'यात्रा योजना',ask:'आप मुझसे भोजन, स्थान, इतिहास, संस्कृति, प्रकृति, खरीदारी, होटल, अस्पताल, बजट या ट्रिप प्लान के बारे में पूछ सकते हैं।',welcome:'नमस्ते! मैं Arya हूँ, आपका ExploreUP ट्रैवल असिस्टेंट।',all:'मेरे पास ExploreUP के सभी 75 जिलों की जानकारी है—स्थान, भोजन, होटल/स्टे, अस्पताल, ट्रांसपोर्ट, खरीदारी, संस्कृति, प्रकृति और ट्रिप प्लान सहित। किसी भी जिले या शहर के बारे में पूछिए।'},
 bn:{history:'ইতিহাস',places:'প্রধান স্থান',food:'খাবারের তথ্য',culture:'সংস্কৃতি ও ঐতিহ্য',nature:'প্রকৃতি',tip:'ভ্রমণ টিপস',shopping:'কেনাকাটা',budget:'বাজেট গাইড',trip:'ভ্রমণ পরিকল্পনা',ask:'আপনি খাবার, স্থান, ইতিহাস, সংস্কৃতি, প্রকৃতি, কেনাকাটা, হোটেল, হাসপাতাল, বাজেট বা ভ্রমণ পরিকল্পনা সম্পর্কে জিজ্ঞেস করতে পারেন।',welcome:'নমস্কার! আমি Arya, আপনার ExploreUP ট্রাভেল অ্যাসিস্ট্যান্ট।',all:'আমার কাছে ExploreUP-এর সব ডেস্টিনেশনের তথ্য আছে। যেকোনো শহর বা জেলার নাম জিজ্ঞেস করুন।'},
 pa:{history:'ਇਤਿਹਾਸ',places:'ਮੁੱਖ ਸਥਾਨ',food:'ਖਾਣ-ਪੀਣ ਦੀ ਜਾਣਕਾਰੀ',culture:'ਸੱਭਿਆਚਾਰ ਅਤੇ ਰਿਵਾਜ',nature:'ਕੁਦਰਤ',tip:'ਯਾਤਰਾ ਸੁਝਾਅ',shopping:'ਖਰੀਦਦਾਰੀ',budget:'ਬਜਟ ਗਾਈਡ',trip:'ਯਾਤਰਾ ਯੋਜਨਾ',ask:'ਤੁਸੀਂ ਖਾਣੇ, ਥਾਵਾਂ, ਇਤਿਹਾਸ, ਸੱਭਿਆਚਾਰ, ਕੁਦਰਤ, ਖਰੀਦਦਾਰੀ, ਹੋਟਲ, ਹਸਪਤਾਲ, ਬਜਟ ਜਾਂ ਯਾਤਰਾ ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।',welcome:'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ Arya ਹਾਂ, ਤੁਹਾਡਾ ExploreUP ਟ੍ਰੈਵਲ ਅਸਿਸਟੈਂਟ।',all:'ਮੇਰੇ ਕੋਲ ExploreUP ਦੇ ਸਾਰੇ ਡੈਸਟਿਨੇਸ਼ਨਾਂ ਦੀ ਜਾਣਕਾਰੀ ਹੈ। ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ ਜਾਂ ਜ਼ਿਲ੍ਹੇ ਦਾ ਨਾਮ ਪੁੱਛੋ।'},
 ta:{history:'வரலாறு',places:'முக்கிய இடங்கள்',food:'உணவு வழிகாட்டி',culture:'கலாசாரம் மற்றும் மரபுகள்',nature:'இயற்கை',tip:'பயண குறிப்பு',shopping:'ஷாப்பிங்',budget:'பட்ஜெட் வழிகாட்டி',trip:'பயண திட்டம்',ask:'உணவு, இடங்கள், வரலாறு, கலாசாரம், இயற்கை, ஷாப்பிங், ஹோட்டல்கள், மருத்துவமனைகள், பட்ஜெட் அல்லது பயணத் திட்டம் பற்றி கேளுங்கள்.',welcome:'வணக்கம்! நான் Arya, உங்கள் ExploreUP பயண உதவியாளர்.',all:'ExploreUP-இன் அனைத்து இடங்களுக்குமான தகவல் என்னிடம் உள்ளது. எந்த நகரம் அல்லது மாவட்டத்தைப் பற்றியும் கேளுங்கள்.'},
 te:{history:'చరిత్ర',places:'ప్రధాన ప్రదేశాలు',food:'ఆహార గైడ్',culture:'సంస్కృతి మరియు సంప్రదాయాలు',nature:'ప్రకృతి',tip:'ప్రయాణ సూచన',shopping:'షాపింగ్',budget:'బడ్జెట్ గైడ్',trip:'ప్రయాణ ప్రణాళిక',ask:'ఆహారం, ప్రదేశాలు, చరిత్ర, సంస్కృతి, ప్రకృతి, షాపింగ్, హోటళ్లు, ఆసుపత్రులు, బడ్జెట్ లేదా ప్రయాణ ప్రణాళిక గురించి అడగండి.',welcome:'నమస్కారం! నేను Arya, మీ ExploreUP ట్రావెల్ అసిస్టెంట్‌ని.',all:'ExploreUP లోని అన్ని గమ్యస్థానాల గురించి నా దగ్గర సమాచారం ఉంది. ఏ నగరం లేదా జిల్లాను గురించి అయినా అడగండి.'},
 kn:{history:'ಇತಿಹಾಸ',places:'ಪ್ರಮುಖ ಸ್ಥಳಗಳು',food:'ಆಹಾರ ಮಾರ್ಗದರ್ಶಿ',culture:'ಸಂಸ್ಕೃತಿ ಮತ್ತು ಪರಂಪರೆ',nature:'ಪ್ರಕೃತಿ',tip:'ಪ್ರಯಾಣ ಸಲಹೆ',shopping:'ಶಾಪಿಂಗ್',budget:'ಬಜೆಟ್ ಮಾರ್ಗದರ್ಶಿ',trip:'ಪ್ರಯಾಣ ಯೋಜನೆ',ask:'ಆಹಾರ, ಸ್ಥಳಗಳು, ಇತಿಹಾಸ, ಸಂಸ್ಕೃತಿ, ಪ್ರಕೃತಿ, ಶಾಪಿಂಗ್, ಹೋಟೆಲ್, ಆಸ್ಪತ್ರೆ, ಬಜೆಟ್ ಅಥವಾ ಪ್ರವಾಸ ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ.',welcome:'ನಮಸ್ಕಾರ! ನಾನು Arya, ನಿಮ್ಮ ExploreUP ಪ್ರಯಾಣ ಸಹಾಯಕ.',all:'ExploreUP ನ ಎಲ್ಲಾ ಸ್ಥಳಗಳ ಬಗ್ಗೆ ನನ್ನ ಬಳಿ ಮಾಹಿತಿ ಇದೆ. ಯಾವುದೇ ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯ ಬಗ್ಗೆ ಕೇಳಿ.'},
 ml:{history:'ചരിത്രം',places:'പ്രധാന സ്ഥലങ്ങൾ',food:'ഭക്ഷണ ഗൈഡ്',culture:'സംസ്കാരവും പാരമ്പര്യങ്ങളും',nature:'പ്രകൃതി',tip:'യാത്രാ നിർദ്ദേശം',shopping:'ഷോപ്പിംഗ്',budget:'ബജറ്റ് ഗൈഡ്',trip:'യാത്രാ പദ്ധതി',ask:'ഭക്ഷണം, സ്ഥലങ്ങൾ, ചരിത്രം, സംസ്കാരം, പ്രകൃതി, ഷോപ്പിംഗ്, ഹോട്ടലുകൾ, ആശുപത്രികൾ, ബജറ്റ് അല്ലെങ്കിൽ യാത്രാ പദ്ധതി എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ.',welcome:'നമസ്കാരം! ഞാൻ Arya, നിങ്ങളുടെ ExploreUP യാത്രാ സഹായി.',all:'ExploreUP-യിലെ എല്ലാ സ്ഥലങ്ങളെയും കുറിച്ചുള്ള വിവരങ്ങൾ എനിക്ക് ലഭ്യമാണ്. ഏത് നഗരത്തെയോ ജില്ലയെയോ കുറിച്ചും ചോദിക്കാം.'}
};
function aryaLangPack(lang){return aryaLanguageText[lang]||aryaLanguageText.en;}
const aryaTranslationCache=new Map();
async function aryaTranslateChunk(text,lang){
 if(lang==='en'||!text.trim()) return text;
 const key=lang+'|'+text;
 if(aryaTranslationCache.has(key)) return aryaTranslationCache.get(key);
 try{
   const url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl='+encodeURIComponent(lang)+'&dt=t&q='+encodeURIComponent(text);
   const r=await fetch(url,{method:'GET',cache:'force-cache'});
   if(!r.ok) throw new Error('translation');
   const data=await r.json();
   const out=Array.isArray(data?.[0])?data[0].map(x=>x?.[0]||'').join(''):'';
   if(!out.trim()) throw new Error('empty translation');
   aryaTranslationCache.set(key,out);
   return out;
 }catch(e){
   return text;
 }
}
async function aryaLocalizeAnswer(answer,lang){
 const L=aryaLangPack(lang);
 if(lang==='en') return answer;
 // Translate the complete ExploreUP answer naturally, while preserving line breaks and verified facts.
 const structural=answer
   .replace(/History/g,L.history).replace(/Top places/g,L.places).replace(/Food guide/g,L.food)
   .replace(/Culture & traditions/g,L.culture).replace(/Nature/g,L.nature).replace(/Travel tip/g,L.tip)
   .replace(/Shopping/g,L.shopping).replace(/Budget guide/g,L.budget).replace(/Quick trip idea/g,L.trip)
   .replace(/Ask me specifically about food, places, history, culture, nature, shopping, hotels, hospitals, budget or a trip plan\./g,L.ask);
 const chunks=structural.split(/(\n\s*\n)/);
 const out=[];
 for(const chunk of chunks){
   if(/^\n\s*\n$/.test(chunk)) out.push(chunk);
   else if(chunk.trim()) out.push(await aryaTranslateChunk(chunk,lang));
   else out.push(chunk);
 }
 return out.join('');
}
