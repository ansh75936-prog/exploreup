/* ExploreUP Arya AI — OpenAI API client only
 * This file does NOT own the UI or replace askArya().
 * The single visible send handler lives in arya-ai-ui.js.
 * v3: use text/plain to keep the cross-origin request preflight-free.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=false;
  AI.internetConnected=false;
  AI.uiBridgeVersion='openai-client-only-v3';
  const API='/api/arya';
  function currentDistrict(){
    try{return String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||'').trim();}
    catch(e){return '';}
  }
  async function askOpenAI(query,city){
    const q=String(query||'').replace(/\s+/g,' ').trim().slice(0,4000);
    if(!q)return {ok:false,error:'empty'};
    try{
      const response=await fetch(API+'?v=20260916-8b',{
        method:'POST',
        headers:{'Content-Type':'text/plain;charset=UTF-8'},
        body:JSON.stringify({query:q,city:String(city||currentDistrict()).trim().slice(0,120)})
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.answer)return {ok:false,error:String(data.error||('http_'+response.status))};
      AI.internetConnected=true;
      AI.freeMode=false;
      return {ok:true,answer:String(data.answer).trim(),source:'openai'};
    }catch(error){
      AI.internetConnected=false;
      return {ok:false,error:'openai_connection_failed'};
    }
  }
  AI.askOpenAI=askOpenAI;
  AI.askInternet=askOpenAI;
  AI.askFree=async function(){return {ok:false,error:'free_mode_disabled'}};
  AI.knowledge=window.ExploreUPAryaKnowledge||{};
})();
