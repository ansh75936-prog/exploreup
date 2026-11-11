function renderFood(city){const grid=document.getElementById('foodGrid');const input=document.getElementById('foodSearchInput');if(!grid)return;const items=foodData[city]||[];const draw=(q='')=>{const qq=q.toLowerCase();const list=items.filter(x=>x.join(' ').toLowerCase().includes(qq));grid.innerHTML=list.length?list.map(x=>`<article class="foodcard"><div class="foodtype">${escapeHtml(x[2])}</div><h3>${escapeHtml(x[0])}</h3><p>${escapeHtml(x[1])}</p><div class="foodchips"><span class="foodchip">${escapeHtml(city)}</span><span class="foodchip">ExploreUP Food Guide</span></div></article>`).join(''):'<div class="foodcard"><h3>No matching food item</h3><p>Try another dish, sweet, street food or drink.</p></div>';};draw();if(input){input.value='';input.oninput=()=>draw(input.value);}}

function contactMap(name,address){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' '+address);}
function escapeHtml(value){
 const div=document.createElement('div');
 div.textContent=String(value??'');
 return div.innerHTML;
}
function contactCard(x){
 const name=escapeHtml(x.name||'Unnamed service');
 const type=escapeHtml(x.type||'Local service');
 const address=escapeHtml(x.address||'Address not available');
 const phone=x.phone?escapeHtml(x.phone):'';
 const email=x.email?escapeHtml(x.email):'';
 const website=x.website?escapeHtml(x.website):'';
 const sourceUrl=x.sourceUrl?escapeHtml(x.sourceUrl):'';
 const sourceLabel=escapeHtml(x.sourceLabel||'ExploreUP verified directory');
 return `<article class="contact-card" style="display:block!important;visibility:visible!important;opacity:1!important">
   <div class="type">✓ Verified listing</div>
   <h3>${name}</h3>
   <p class="service-field"><span class="service-label">🏷️ Type:</span> ${type}</p>
   <p class="service-field"><span class="service-label">📍 Address:</span> ${address}</p>
   ${phone?`<p class="service-field"><span class="service-label">📞 Contact:</span> <a href="tel:${x.phone.replace(/[^+\d]/g,'')}">${phone}</a></p>`:''}
   ${email?`<p class="service-field"><span class="service-label">✉️ Email:</span> <a href="mailto:${x.email}">${email}</a></p>`:''}
   ${x.extra?`<p class="service-field"><span class="service-label">ℹ️ Details:</span> ${escapeHtml(x.extra)}</p>`:''}
   ${website?`<p class="service-field"><span class="service-label">🌐 Website:</span> ${website}</p>`:''}
   <p class="service-source">Source: ${sourceUrl?`<a href="${sourceUrl}" target="_blank" rel="noopener">${sourceLabel} ↗</a>`:sourceLabel}</p>
   <div class="contact-actions">${x.phone?`<a href="tel:${x.phone.replace(/[^+\d]/g,'')}">📞 Call</a>`:''}${x.email?`<a href="mailto:${x.email}">✉️ Email</a>`:''}<a href="${contactMap(x.name,x.address)}" target="_blank" rel="noopener">🗺️ Map</a>${x.website?`<a href="${x.website}" target="_blank" rel="noopener">🌐 Website</a>`:''}</div>
 </article>`;
}
function renderContacts(city){
 const direct=(typeof districtServiceContacts!=='undefined'&&districtServiceContacts[city])?districtServiceContacts[city]:null;
 const d=direct||contactData[city]||{hotels:[],hospitals:[]};
 const current=cities.find(x=>x.name===city);
 if(current){current.hotels=d.hotels||[];current.hospitals=d.hospitals||[];}
 const h=document.getElementById('hotelContacts'),p=document.getElementById('hospitalContacts');
 if(!h||!p)return;
 const hotelUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Hotels in '+city+', Uttar Pradesh');
 const hospitalUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Hospitals in '+city+', Uttar Pradesh');
 const hotelFallback=`<article class="contact-card" style="display:block!important;visibility:visible!important;opacity:1!important"><div class="type">Live directory</div><h3>🏨 Current Hotels / Stays in ${escapeHtml(city)}</h3><p class="service-field"><span class="service-label">📍 District:</span> ${escapeHtml(city)}, Uttar Pradesh</p><p class="service-field">No individual hotel record is currently verified in the ExploreUP dataset for this district. Use the live map directory for current nearby properties.</p><p class="service-source">Source: Google Maps live directory</p><div class="contact-actions"><a href="${hotelUrl}" target="_blank" rel="noopener">🗺️ View Current Hotels</a></div></article>`;
 const hospitalFallback=`<article class="contact-card" style="display:block!important;visibility:visible!important;opacity:1!important"><div class="type">Live directory</div><h3>🏥 Current Hospitals in ${escapeHtml(city)}</h3><p class="service-field"><span class="service-label">📍 District:</span> ${escapeHtml(city)}, Uttar Pradesh</p><p class="service-field">No individual hospital record is currently verified in the ExploreUP dataset for this district. Use the live map directory for current facilities.</p><p class="service-source">Source: Google Maps live directory</p><div class="contact-actions"><a href="${hospitalUrl}" target="_blank" rel="noopener">🗺️ Find Hospitals</a></div></article>`;
 h.innerHTML=(d.hotels&&d.hotels.length)?d.hotels.map(contactCard).join(''):hotelFallback;
 p.innerHTML=(d.hospitals&&d.hospitals.length)?d.hospitals.map(x=>{x.sourceLabel=x.sourceLabel||'ExploreUP district health record';return contactCard(x)}).join(''):hospitalFallback;
}
function showContactTab(tab,btn){return false;}
function renderMalls(city){
 const grid=document.getElementById('mallGrid'); const list=mallData[city]||[];
 if(!list.length){grid.innerHTML='<div class="mallcard"><b>No major mall listed yet</b><small>Local markets and shopping areas are covered in the Shopping section. Verified mall listings will be added city by city.</small></div>';return;}
 grid.innerHTML=list.map(m=>{const q=encodeURIComponent(m[0]+' '+m[1]);return `<div class="mallcard"><b>🏬 ${m[0]}</b><small>📍 ${m[1]}</small><a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Open exact location in Google Maps →</a></div>`}).join('');
}
