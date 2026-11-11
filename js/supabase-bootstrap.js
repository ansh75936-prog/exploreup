/* ExploreUP online backend: publishable key is safe in browser when RLS is enabled. */
const SUPABASE_URL='https://jsfjorthausrepgnsymv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_Lgj3WAOWOny7WQAloGqHcQ_hupjaK-e';
let exploreSupabase=null;
let supabaseLoadPromise=null;
function loadSupabaseBackend(){
  if(supabaseLoadPromise) return supabaseLoadPromise;
  supabaseLoadPromise=new Promise(resolve=>{
    if(window.supabase?.createClient){
      try{exploreSupabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);}catch(e){}
      resolve(exploreSupabase); return;
    }
    const sc=document.createElement('script');
    sc.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    sc.async=true;
    sc.onload=()=>{try{exploreSupabase=window.supabase?.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);}catch(e){exploreSupabase=null;} resolve(exploreSupabase);};
    sc.onerror=()=>resolve(null);
    document.head.appendChild(sc);
  });
  return supabaseLoadPromise;
}
let currentExploreCity='';
const analyticsKey='exploreup_analytics_v1';
const exploreStorage={
 get(k,fallback=null){try{return window.localStorage.getItem(k)??fallback}catch(e){return fallback}},
 set(k,v){try{window.localStorage.setItem(k,v);return true}catch(e){return false}},
 remove(k){try{window.localStorage.removeItem(k)}catch(e){}}
};
function getAnalytics(){try{return JSON.parse(exploreStorage.get(analyticsKey,'{"visits":0,"unique":[],"districts":{},"suggestions":0,"lastVisit":null}'))}catch(e){return {visits:0,unique:[],districts:{},suggestions:0,lastVisit:null}}}
function saveAnalytics(a){exploreStorage.set(analyticsKey,JSON.stringify(a))}
function getSessionId(){let id=exploreStorage.get('exploreup_session_id');if(!id){id='s_'+Math.random().toString(36).slice(2)+Date.now();exploreStorage.set('exploreup_session_id',id)}return id}
async function recordOnlineEvent(event_type,district_slug=null,metadata={}){try{if(!exploreSupabase)return;await exploreSupabase.from('analytics_events').insert({event_type,district_slug,session_id:getSessionId(),path:location.pathname+location.hash,metadata})}catch(e){/* local analytics remains available if offline */}}
function trackVisit(){const a=getAnalytics();a.visits=(a.visits||0)+1;const device=exploreStorage.get('exploreup_device_id')||('d_'+Math.random().toString(36).slice(2)+Date.now());exploreStorage.set('exploreup_device_id',device);a.unique=Array.isArray(a.unique)?a.unique:[];if(!a.unique.includes(device))a.unique.push(device);a.lastVisit=new Date().toISOString();saveAnalytics(a);recordOnlineEvent('visit',null,{device_id:device})}
function trackDistrict(name){const a=getAnalytics();a.districts=a.districts||{};a.districts[name]=(a.districts[name]||0)+1;saveAnalytics(a);const slug=String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');recordOnlineEvent('district_open',slug)}
function trackSuggestion(){const a=getAnalytics();a.suggestions=(a.suggestions||0)+1;saveAnalytics(a);recordOnlineEvent('suggestion_submit',null,{source:'district-form'})}
function totalSuggestionCount(){let n=0;for(const c of cities||[]){try{n+=JSON.parse(exploreStorage.get(suggestionKey(c.name))||'[]').length}catch(e){}}return n}
try{trackVisit()}catch(e){console.warn('ExploreUP analytics startup skipped:',e)}
