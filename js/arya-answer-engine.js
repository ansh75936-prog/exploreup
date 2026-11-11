async function aryaAnswer(q,lang){
 const raw=q.trim(), x=raw.toLowerCase();
 const L=aryaLangPack(lang);
 const websiteTerms=/exploreup|explore up|website|site|page|section|menu|search|district|city|destination|place|food|cuisine|hotel|stay|hospital|health|pharmacy|emergency|shopping|mall|market|cinema|theatre|transport|train|railway|flight|airport|bus|metro|trip|itinerary|planner|plan maker|budget|cost|expense|people|interest|recommend|recommendation|smart plan|quick plan|offline|online|internet|history|heritage|culture|festival|nature|wildlife|park|river|map|review|rating|suggestion|correction|admin|favourite|favorite|save|share|timing|time|ticket|fee|entry|how to|kaise|kahan|kidhar|ghoom|ghumna|khana|mithai|aspataal|dawai|rail|hawai/.test(x);
 const outOfScope=/weather|cricket|football|song|lyrics|joke|homework|math|coding|programming|stock|crypto|recipe for|medical diagnosis|relationship|personal advice|general knowledge|news/.test(x);
 if(!websiteTerms || outOfScope){
  return aryaLocalizeAnswer(`${L.welcome}\n\nI can help only with information and features available inside ExploreUP — destinations, places, food, hotels, hospitals, shopping, transport, history, culture, trip planning, reviews, suggestions and website navigation.\n\nPlease ask me about an ExploreUP destination or section.`,lang);
 }
 const plannerKnowledge=`Arya Trip Plan Maker knowledge:
- Quick Plan uses bundled ExploreUP information and is designed to remain usable offline.
- Smart Plan requires internet and checks available ExploreUP live data before adding live approved updates.
- Planner inputs: destination/district, 1–7 days, number of people, approximate budget, travel style, transport preference, stay category, and interests including history, religion, nature, shopping, photography, family and food.
- Budget Calculator estimates accommodation, food, transport, activities and local transport. It is an estimate only, not a live quote.
- Smart Recommendations use bundled ExploreUP destination knowledge and selected interests.
- Generated plans are suggestions, not guaranteed bookings or exact route/timing information.
- ExploreUP has built-in coverage for all 75 Uttar Pradesh districts, with district guides and district-wise Hotels/Stays and Hospitals where data is stored.
- Live hotel prices, availability, ratings, weather and transport timings are not assumed unless a verified live source is available.`;
 let live={districts:[],suggestions:[],reviews:[]};
 const needsLive=/live|latest|recent|update|review|rating/.test(x);
 if(needsLive){try{live=await Promise.race([getAryaLiveContext(),new Promise(resolve=>setTimeout(()=>resolve({districts:[],suggestions:[],reviews:[]}),1200))])}catch(e){console.warn('Arya live context unavailable; using local knowledge.',e)}}
 const liveDistrict=live.districts.find(d=>{const n=(d.name||'').toLowerCase(),h=(d.name_hi||'').toLowerCase();return x.includes(n)||x.includes(h)||n.includes(x)});
 const c=cities.find(c=>{const n=c.name.toLowerCase();return x.includes(n)||n.includes(x)}) || (liveDistrict?cities.find(c=>c.name.toLowerCase()===liveDistrict.name.toLowerCase()):null);
 const slug=(liveDistrict?.slug)||(c?.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const liveSug=live.suggestions.filter(v=>v.district_slug===slug);
 const liveRev=live.reviews.filter(v=>v.district_slug===slug);
 const websiteOnly=()=>{
   if(/admin|login|dashboard|suggest|suggestion|review|rate|rating|feedback/.test(x)) return `ExploreUP website help:
You can use Admin for authorised moderation, Suggest an Update to send information corrections, and Share Your Experience to submit a review/rating. I can explain these website features.`;
   if(/plan|planner|itinerary|trip|budget|cost|expense|recommend|recommendation|smart plan|quick plan|offline|online|internet|people|interest/.test(x)) return plannerKnowledge+`\n\nOpen Arya Trip Plan Maker from the Plan/Trip Planner controls to generate a destination plan.`;
   if(/search|find|navigation|menu|use|kaise|kahan|where|how/.test(x)) return `ExploreUP website help:
Use the main search to find destinations, open a city/district for its full guide, then use its sections for Food, Stay & Health, Knowledge, Trip Planner, Transport and Shopping. You can also use the district search inside each destination page.`;
   return `${L.welcome} ${L.ask}\n\nI can help with Uttar Pradesh travel, destinations, places, food, hotels, hospitals, shopping, transport, history, culture, trip plans and ExploreUP features.`;
 };
 if(c){
   const knowledgeKey=c.name==="Kanpur Nagar"?"Kanpur":c.name;
   const k=aryaKnowledge[knowledgeKey]||{};
   const hasSpecificDetail=value=>{
     if(typeof value!=='string'||!value.trim())return false;
     return !/^(?:local landmarks, attractions, markets & nearby places|local cuisine, regional specialities & popular eateries|local markets, handicrafts & district shopping)$/i.test(value.trim());
   };
   const districtDetail=(primary,fallback,label)=>{
     const detail=[primary,fallback].find(hasSpecificDetail);
     return detail||`Verified ${c.name} ${label} details are not currently available in ExploreUP.`;
   };
   const districtDetails={
     history:districtDetail(k.history,c.history,'history'),
     places:districtDetail(k.places,c.places,'place'),
     food:districtDetail(k.food,c.food,'food'),
     culture:districtDetail(k.culture,c.culture,'culture'),
     nature:districtDetail(k.nature,c.nature,'nature'),
     shopping:districtDetail(c.shop,c.shopping,'shopping'),
     tips:districtDetail(k.tips,c.tip,'travel tip')
   };
   let base='';
   if(/plan|planner|itinerary|trip|day/.test(x)) base=plannerKnowledge+`\n\nFor ${c.name}: the planner uses the available district information to build a suggested day-by-day plan.\n\nPlaces: ${districtDetails.places}\n\nFood: ${districtDetails.food}\n\nTravel tip: ${districtDetails.tips}`;
   else if(/budget|cost|expense|paisa|kitna/.test(x)) base=`${c.name} — Budget Planner:\n${c.budget}.\n\nThe Budget Calculator estimates accommodation, food, transport, activities and local transport. Estimate only; actual prices vary.`;
   else if(/recommend|recommendation|interest|smart/.test(x)) base=`${c.name} — Smart Recommendations:\nChoose interests such as history, religion, nature, food, shopping, photography or family. Arya uses bundled ExploreUP knowledge for ${c.name} to suggest relevant categories.`;
   else if(/offline|quick plan|smart plan|online plan|internet/.test(x)) base=plannerKnowledge;
   else if(/food|khana|cuisine|dish|sweet|mithai|street/.test(x)) base=`${c.name} — Food & Cuisine section:
${districtDetails.food}.`;
   else if(/hotel|stay|room|resort|accommodation/.test(x)){
     const staySource=(typeof districtServiceContacts!=='undefined'&&districtServiceContacts[c.name])?districtServiceContacts[c.name]:(contactData[c.name]||{}); const stays=staySource.hotels||[];
     base=`${c.name} — Hotels / Stays:
`+(stays.length?stays.map((v,i)=>`${i+1}. ${v.name}${v.type?' ('+v.type+')':''} — ${v.address}${v.phone?' — Phone: '+v.phone:''}`).join('\n'):`No verified hotel/stay address is currently stored for ${c.name} in ExploreUP. The district page also provides a Google Maps search option.`);
   }
   else if(/hospital|doctor|medical|health|pharmacy|ambulance|emergency/.test(x)){
     const healthSource=(typeof districtServiceContacts!=='undefined'&&districtServiceContacts[c.name])?districtServiceContacts[c.name]:(contactData[c.name]||{}); const hospitals=healthSource.hospitals||[];
     base=`${c.name} — Hospitals / Health:
`+(hospitals.length?hospitals.map((v,i)=>`${i+1}. ${v.name}${v.type?' ('+v.type+')':''} — ${v.address}${v.phone?' — Phone: '+v.phone:''}`).join('\n'):`No verified hospital address is currently stored for ${c.name} in ExploreUP. The district page also provides a Google Maps search option.`);
   }
   else if(/shopping|market|mall|buy|craft|handicraft/.test(x)) base=`${c.name} — Shopping section:
${districtDetails.shopping}.

ExploreUP also lists available malls and shopping/map options for the destination.`;
   else if(/history|heritage/.test(x)) base=`${c.name} — History & Heritage:
${districtDetails.history}`;
   else if(/culture|festival|tradition|tehzeeb/.test(x)) base=`${c.name} — Culture & Local Life:
${districtDetails.culture}`;
   else if(/nature|wildlife|forest|waterfall|park|river/.test(x)) base=`${c.name} — Geography & Nature:
${districtDetails.nature}`;
   else if(/place|visit|tour|ghoom|ghumna|attraction|sight|temple|fort|museum/.test(x)) base=`${c.name} — Places to Explore:
${districtDetails.places}`;
   else if(/budget|cost|expense|paisa|kitna/.test(x)) base=`${c.name} — Budget information:
${c.budget}.

ExploreUP provides this as a planning guide; it does not provide live prices.`;
   else if(/trip|itinerary|plan|day/.test(x)) base=`${c.name} — Trip Planner:
${districtDetails.places}

Food: ${districtDetails.food}

Tip: ${districtDetails.tips}`;
   else if(/\b(?:tip|tips|advice|kab|when)\b|best time/.test(x)) base=`${c.name} — Travel Tip:
${districtDetails.tips}

ExploreUP lists: ${c.time}.`;
   else if(/about|overview|guide|information|info|batao|tell me|details|baare mein|ke bare mein/.test(x)) base=`${c.name}
${c.tag}.

${c.about||"ExploreUP has a district guide for this destination."}

History: ${districtDetails.history}

Places: ${districtDetails.places}

Food: ${districtDetails.food}

Culture: ${districtDetails.culture}

Nature: ${districtDetails.nature}

Travel tip: ${districtDetails.tips}`;
   else base=`I can help with the ExploreUP sections for ${c.name}: Places, Food, Stay & Health, Knowledge, Trip Planner, Transport and Shopping. Ask me about one of these sections.`;
   if(liveSug.length) base+=`

Live approved updates from ExploreUP:
${liveSug.slice(0,5).map(v=>`• ${v.category}: ${v.message}`).join('\n')}`;
   if(liveRev.length) base+=`

Recent approved visitor reviews: ${liveRev.length}
Average shown from approved reviews: ${(liveRev.reduce((a,v)=>a+Number(v.rating||0),0)/liveRev.length).toFixed(1)}/5`;
   return aryaLocalizeAnswer(base+`

Ask me about any section or feature available inside this ExploreUP destination page.`,lang);
 }
 if(liveDistrict){
   let ans=`${liveDistrict.name} (${liveDistrict.name_hi||''}) is an active destination in ExploreUP.

Open its destination page to explore the sections available for this place: Overview, Food, Stay & Health, Knowledge, Trip Planner, Transport and Shopping.`;
   if(liveSug.length) ans+=`

Approved ExploreUP updates for this destination:
${liveSug.slice(0,5).map(v=>`• ${v.category}: ${v.message}`).join('\n')}`;
   if(liveRev.length) ans+=`

Approved visitor reviews currently available: ${liveRev.length}.`;
   return aryaLocalizeAnswer(ans,lang);
 }
 if(/all cities|every city|har city|sabhi city|sabhi jila|all district|har jila|destinations|kitne city|kitne district/.test(x)) return aryaLangPack(lang).all+`

ExploreUP currently has ${live.districts.length} active destination records in its live database.`;
 const matched=live.districts.filter(d=>{const hay=(d.name+' '+(d.name_hi||'')).toLowerCase();return raw.toLowerCase().split(/\s+/).filter(w=>w.length>2).some(w=>hay.includes(w))});
 if(matched.length) return `ExploreUP destinations matching your question:
${matched.slice(0,8).map(d=>'• '+d.name).join('\n')}

Tell me which destination you want to explore.`;
 return websiteOnly();
}
