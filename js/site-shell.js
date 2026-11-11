let reportDistrictSlug='';
function toggleReportPanel(){const p=document.getElementById('reportPanel');if(p)p.classList.toggle('show');}
async function submitInfoReport(){const msg=document.getElementById('reportMessage')?.value.trim();const status=document.getElementById('reportStatus');if(!msg||msg.length<3){if(status)status.textContent='Please describe the correction.';return}try{if(exploreSupabase){const {error}=await exploreSupabase.from('info_reports').insert({district_slug:reportDistrictSlug||null,section:'general',message:msg,page_url:location.href,status:'pending'});if(error)throw error;}exploreStorage.set('exploreup_report_sent','1');if(status)status.textContent='Thanks — your correction was submitted for review.';document.getElementById('reportMessage').value='';}catch(e){if(status)status.textContent='Could not submit online. Please try again later.';}}
async function loadDistrictContent(slug){try{if(!exploreSupabase||!slug)return null;const {data,error}=await exploreSupabase.from('district_content').select('name,name_hi,about,history,culture,nature,places,food,tips,content_status,source_name,source_url,source_note,verified_at,updated_at').eq('district_slug',slug).maybeSingle();if(error)throw error;return data||null}catch(e){return null}}
let deferredInstallPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;document.getElementById('installBtn')?.classList.add('show')});async function installExploreUP(){if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();try{await deferredInstallPrompt.userChoice}catch(e){}deferredInstallPrompt=null;document.getElementById('installBtn')?.classList.remove('show')}
function setupOfflineState(){const bar=document.getElementById('offlineBar');const sync=()=>{if(!bar)return;bar.style.display=navigator.onLine?'none':'block';bar.classList.toggle('show',!navigator.onLine)};window.addEventListener('online',sync);window.addEventListener('offline',sync);sync()}
setupOfflineState();
/* Service Worker intentionally disabled for stability. The app runs from the primary index.html entry point. */

// Current government profile — update this small object when the office-holder changes.
const governmentProfile={
  chiefMinisterName:'Yogi Adityanath',
  designation:'Hon’ble Chief Minister, Uttar Pradesh',
  photoUrl:'',
  officialProfile:'https://www.vidhanparishad.up.gov.in/chief-minister',
  source:'Government of Uttar Pradesh'
};
function renderGovernmentProfile(){
  const n=document.getElementById('govCmName'),r=document.getElementById('govCmRole'),a=document.getElementById('govOfficialLink'),img=document.getElementById('govPhoto');
  if(n)n.textContent=governmentProfile.chiefMinisterName;
  if(r)r.textContent=governmentProfile.designation;
  if(a)a.href=governmentProfile.officialProfile;
  if(img && governmentProfile.photoUrl){img.classList.remove('gov-fallback');img.innerHTML='';img.style.backgroundImage=`url("${governmentProfile.photoUrl}")`;img.style.backgroundSize='cover';img.style.backgroundPosition='center';}
  else if(img){img.textContent=(governmentProfile.chiefMinisterName||'CM').split(' ').map(x=>x[0]).slice(0,2).join('');}
}
renderGovernmentProfile();
window.addEventListener('DOMContentLoaded',renderGovernmentProfile,{once:true});

// Supabase is optional: load it only after the local ExploreUP UI has started.
loadSupabaseBackend().then(client=>{
  if(!client)return;
  syncDistrictCatalog().then(()=>{renderCities(); handleCityUrl();}).catch(()=>{renderCities(); handleCityUrl();});
});
