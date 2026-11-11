function suggestionKey(city){return 'exploreup_suggestions_'+city.toLowerCase().replace(/[^a-z0-9]+/g,'_');}
function districtSlug(city){return String(city).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function renderSuggestions(city){
 const box=document.getElementById('suggestionsList'); if(!box)return;
 const local=typeof window.__exploreUpReadSuggestionLocal==='function'?window.__exploreUpReadSuggestionLocal(city):[];
 box.innerHTML=local.length?local.slice().reverse().map(x=>`<div class="suggestion-item"><b>${escapeHtml(x.category)}</b><div>${escapeHtml(x.text)}</div><small>${escapeHtml(x.name||'Visitor')} · ${new Date(x.time).toLocaleDateString()}</small></div>`).join(''):'<div class="suggestion-item"><small>No approved suggestions yet. Be the first to help improve this district page.</small></div>';
 loadOnlineSuggestions(city);
}
async function loadOnlineSuggestions(city){
 try{if(!exploreSupabase)return;const {data,error}=await exploreSupabase.from('suggestions').select('name,category,message,created_at').eq('district_slug',districtSlug(city)).eq('status','approved').order('created_at',{ascending:false}).limit(30);if(error)throw error;const box=document.getElementById('suggestionsList');if(!box)return;box.innerHTML=data?.length?data.map(x=>`<div class="suggestion-item"><b>${escapeHtml(x.category)}</b><div>${escapeHtml(x.message)}</div><small>${escapeHtml(x.name||'Visitor')} · ${new Date(x.created_at).toLocaleDateString()}</small></div>`).join(''):'<div class="suggestion-item"><small>No approved suggestions yet. Be the first to help improve this district page.</small></div>';}catch(e){/* fallback to local */}}
async function submitSuggestion(e){
 e.preventDefault();
 const city=currentExploreCity||document.getElementById('breadcrumb')?.textContent?.split('›').pop()?.trim()||'';
 const text=document.getElementById('suggestionText').value.trim(); if(text.length<3)return;
 const name=document.getElementById('suggestionName').value.trim(); const category=document.getElementById('suggestionCategory').value;
 const st=document.getElementById('suggestionStatus');
 try{
   if(exploreSupabase){const {error}=await exploreSupabase.from('suggestions').insert({district_slug:districtSlug(city),name:name||null,category,message:text});if(error)throw error;recordOnlineEvent('suggestion_submit',districtSlug(city),{category});}
   if(typeof window.__exploreUpLocalSuggestionFallback==='function')window.__exploreUpLocalSuggestionFallback(city,name,category,text);trackSuggestion();
   document.getElementById('suggestionForm').reset();st.textContent='✓ Thank you! Your suggestion has been submitted for review.';st.style.color='green';
   renderSuggestions(city);setTimeout(()=>{st.textContent=''},4000);
 }catch(err){st.textContent='Could not submit online right now. Your suggestion is saved on this device.';st.style.color='#b45309';if(typeof window.__exploreUpLocalSuggestionFallback==='function')window.__exploreUpLocalSuggestionFallback(city,name,category,text);trackSuggestion();renderSuggestions(city);}
}
async function loadOnlineReviews(city){
 const box=document.getElementById('reviewsList');if(!box)return;
 try{if(!exploreSupabase)return;const {data,error}=await exploreSupabase.from('reviews').select('name,rating,review_text,created_at').eq('district_slug',districtSlug(city)).eq('status','approved').order('created_at',{ascending:false}).limit(30);if(error)throw error;box.innerHTML=data?.length?data.map(x=>`<div class="suggestion-item"><b>${'★'.repeat(x.rating)}${'☆'.repeat(5-x.rating)}</b><div>${escapeHtml(x.review_text)}</div><small>${escapeHtml(x.name||'Visitor')} · ${new Date(x.created_at).toLocaleDateString()}</small></div>`).join(''):'<div class="suggestion-item"><small>No approved reviews yet.</small></div>';}catch(e){box.innerHTML='<div class="suggestion-item"><small>Reviews will appear here after moderation.</small></div>';}}
async function submitReview(e){
 e.preventDefault();const city=currentExploreCity||'';const name=document.getElementById('reviewName').value.trim();const rating=Number(document.getElementById('reviewRating').value);const review_text=document.getElementById('reviewText').value.trim();const st=document.getElementById('reviewStatus');
 if(!city){st.textContent='Please open a destination before submitting a review.';st.style.color='#b45309';return;}
 if(!Number.isInteger(rating)||rating<1||rating>5){st.textContent='Please select a rating from 1 to 5.';st.style.color='#b45309';return;}
 if(review_text.length<3||review_text.length>1000){st.textContent='Review must be between 3 and 1000 characters.';st.style.color='#b45309';return;}
 if(name.length>100){st.textContent='Name must be 100 characters or fewer.';st.style.color='#b45309';return;}
 try{if(!exploreSupabase)throw new Error('offline');const {error}=await exploreSupabase.from('reviews').insert({district_slug:districtSlug(city),name:name||null,rating,review_text});if(error)throw error;recordOnlineEvent('review_submit',districtSlug(city),{rating});document.getElementById('reviewForm').reset();st.textContent='✓ Thanks! Your review has been submitted for moderation.';st.style.color='green';loadOnlineReviews(city);setTimeout(()=>{st.textContent=''},4000);}catch(err){st.textContent='Review could not be submitted online right now. Please try again.';st.style.color='#b45309';}
}
function openBlogsPage(e){
 if(e)e.preventDefault();
 document.querySelector('main')?.style.setProperty('display','none');
 document.querySelectorAll('.gov-profile,.footer,.trip-sticky,.favbar,.comparebar').forEach(el=>el.style.display='none');
 const page=document.getElementById('all-blogs'); if(page)page.classList.add('active');
 history.pushState({exploreupBlogs:true},'',location.pathname+'#all-blogs');
 window.scrollTo(0,0);
}
function closeBlogsPage(fromHistory=false){
 const page=document.getElementById('all-blogs'); if(page)page.classList.remove('active');
 document.querySelector('main')?.style.removeProperty('display');
 document.querySelectorAll('.gov-profile,.footer,.trip-sticky,.favbar,.comparebar').forEach(el=>el.style.removeProperty('display'));
 if(!fromHistory && location.hash==='#all-blogs')history.back();
 else window.scrollTo(0,0);
}
function filterBlogs(category,btn){
 document.querySelectorAll('.blog-filter').forEach(b=>b.classList.remove('active')); if(btn)btn.classList.add('active');
 document.querySelectorAll('#allBlogsGrid .blog-full').forEach(card=>card.style.display=(category==='all'||card.dataset.category===category)?'':'none');
}
function goBackNavigation(){
 const m=document.getElementById('modal');
 if(!m || m.style.display==='none')return;
 if(history.state && history.state.exploreupCity){ history.back(); }
 else { closeModal({fromHistory:true}); }
}

function closeModal(options={}){
 const m=document.getElementById('modal'); if(!m)return;
 // Stop and reset any district hero video before returning to the home page.
 const heroVideo=document.getElementById('districtHeroVideo');
 const hero=document.getElementById('modalHero');
 if(heroVideo){
   try{heroVideo.pause();}catch(e){}
   try{heroVideo.currentTime=0;}catch(e){}
   heroVideo.onloadedmetadata=null;
   heroVideo.onloadeddata=null;
   heroVideo.oncanplay=null;
   heroVideo.onplaying=null;
   heroVideo.onerror=null;
   heroVideo.removeAttribute('src');
   heroVideo.load();
 }
 if(hero)hero.classList.remove('has-district-video');
 const heroSound=document.getElementById('districtHeroSound');
 if(heroSound)heroSound.hidden=true;
 m.style.display='none'; m.setAttribute('aria-hidden','true'); document.body.style.overflow='';
 currentExploreCity='';
 document.title='ExploreUP — Explore Uttar Pradesh | Cities, Places, Food & Travel';
 const canonical=document.getElementById('canonicalLink'); if(canonical)canonical.href='https://exploreup-five.vercel.app/';
 const ogUrl=document.querySelector('meta[property="og:url"]'); if(ogUrl)ogUrl.setAttribute('content','https://exploreup-five.vercel.app/');
 if(!options.fromHistory){
   if(history.state && history.state.exploreupCity){ history.back(); }
   else if(location.search || location.hash){ history.replaceState({},'',location.pathname); }
 }
}
function handleCityUrl(){
 const params=new URLSearchParams(location.search); const slug=params.get('city');
 if(slug){ const c=cities.find(x=>districtSlug(x.name)===slug); if(c)openCity(c.name,{fromHistory:true}); else districtCatalogReady?.then(()=>{const ready=cities.find(x=>districtSlug(x.name)===slug);if(ready)openCity(ready.name,{fromHistory:true});}); }
 else if(location.hash.startsWith('#city=')){ const n=decodeURIComponent(location.hash.slice(6)); openCity(n,{fromHistory:true}); }
}
window.handleCityUrl=handleCityUrl;
window.addEventListener('popstate',()=>{if(location.hash==='#all-blogs'){openBlogsPage();}else if(location.search.includes('city=')||location.hash.startsWith('#city=')){closeBlogsPage(true);handleCityUrl();}else{closeBlogsPage(true);closeModal({fromHistory:true});}});

function openAdminPanel(){const o=document.getElementById('adminOverlay');if(!o)return;o.style.display='block';o.setAttribute('aria-hidden','false');checkAdminSession();}
function closeAdminPanel(){const o=document.getElementById('adminOverlay');if(o){o.style.display='none';o.setAttribute('aria-hidden','true')}}
async function adminLogin(){await loadSupabaseBackend(); const status=document.getElementById('adminStatus');try{if(!exploreSupabase)throw new Error('Online connection unavailable.');const email=document.getElementById('adminEmail').value.trim();const password=document.getElementById('adminPassword').value;if(!email||!password)throw new Error('Enter your admin email and password.');const {error}=await exploreSupabase.auth.signInWithPassword({email,password});if(error)throw error;await checkAdminSession();}catch(e){status.textContent=e.message||'Sign-in failed.';status.style.color='#b91c1c'}}
async function checkAdminSession(){await loadSupabaseBackend(); const box=document.getElementById('adminContent');if(!box)return;try{if(!exploreSupabase)throw new Error('Online connection unavailable.');const {data:{user}}=await exploreSupabase.auth.getUser();if(!user){box.querySelector('.admin-login')?.scrollIntoView({block:'center'});return;}const {data,isAdminError}=await (async()=>{const r=await exploreSupabase.rpc('is_exploreup_admin');return {data:r.data,isAdminError:r.error}})();if(isAdminError)throw isAdminError;if(!data){box.innerHTML='<div class="admin-login"><p style="color:#b91c1c;font-weight:800">This account is not an approved ExploreUP administrator.</p><button class="suggestbtn" onclick="adminLogout()">Sign out</button></div>';return;}box.innerHTML='<div class="admin-grid"><div class="admin-stat"><small>Pending suggestions</small><b id="adminSuggestions">—</b></div><div class="admin-stat"><small>Pending reviews</small><b id="adminReviews">—</b></div><div class="admin-stat"><small>Analytics events</small><b id="adminEvents">—</b></div></div><div class="admin-actions"><button class="admin-logout" onclick="adminLogout()">Sign out</button><button class="admin-logout" onclick="loadAdminData()">Refresh</button></div><h3>Pending suggestions</h3><div class="admin-list" id="adminSuggestionList"></div><h3 style="margin-top:20px">Pending reviews</h3><div class="admin-list" id="adminReviewList"></div>';loadAdminData();}catch(e){box.innerHTML='<div class="admin-login"><p style="color:#b91c1c">'+escapeHtml(e.message||'Unable to open admin dashboard.')+'</p><button class="suggestbtn" onclick="adminLogout()">Sign out</button></div>';}}
async function loadAdminData(){try{const [{data:sugg},{data:reviews},{count:events}]=await Promise.all([exploreSupabase.from('suggestions').select('id,district_slug,name,category,message,created_at').eq('status','pending').order('created_at',{ascending:false}).limit(50),exploreSupabase.from('reviews').select('id,district_slug,name,rating,review_text,created_at').eq('status','pending').order('created_at',{ascending:false}).limit(50),exploreSupabase.from('analytics_events').select('id',{count:'exact',head:true})]);document.getElementById('adminSuggestions').textContent=sugg?.length||0;document.getElementById('adminReviews').textContent=reviews?.length||0;document.getElementById('adminEvents').textContent=events??0;document.getElementById('adminSuggestionList').innerHTML=sugg?.length?sugg.map(x=>`<div class="admin-item"><b>${escapeHtml(x.category)}</b> · ${escapeHtml(x.district_slug||'—')}<div>${escapeHtml(x.message)}</div><small>${escapeHtml(x.name||'Visitor')} · ${new Date(x.created_at).toLocaleString()}</small><div class="admin-actions"><button class="admin-approve" onclick="moderateSuggestion('${x.id}','approved')">Approve</button><button class="admin-reject" onclick="moderateSuggestion('${x.id}','rejected')">Reject</button></div></div>`).join(''):'<div class="admin-item">No pending suggestions.</div>';document.getElementById('adminReviewList').innerHTML=reviews?.length?reviews.map(x=>`<div class="admin-item"><b>${'★'.repeat(x.rating)}${'☆'.repeat(5-x.rating)}</b> · ${escapeHtml(x.district_slug||'—')}<div>${escapeHtml(x.review_text)}</div><small>${escapeHtml(x.name||'Visitor')} · ${new Date(x.created_at).toLocaleString()}</small><div class="admin-actions"><button class="admin-approve" onclick="moderateReview('${x.id}','approved')">Approve</button><button class="admin-reject" onclick="moderateReview('${x.id}','rejected')">Reject</button></div></div>`).join(''):'<div class="admin-item">No pending reviews.</div>';}catch(e){console.warn('Admin data load failed',e)}}
async function moderateSuggestion(id,status){const {error}=await exploreSupabase.from('suggestions').update({status}).eq('id',id);if(error)alert(error.message);else loadAdminData()}
async function moderateReview(id,status){const {error}=await exploreSupabase.from('reviews').update({status}).eq('id',id);if(error)alert(error.message);else loadAdminData()}
async function adminLogout(){try{await exploreSupabase?.auth.signOut()}finally{closeAdminPanel()}}
