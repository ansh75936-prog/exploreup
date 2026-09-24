/* ExploreUP Arya AI — single V20 send handler
 * Uses the fixed production Vercel API so GitHub Pages cannot accidentally
 * send /api/arya to the static host. Keeps the existing V20 panel/layout.
 * v8: avoid CORS preflight by sending JSON as text/plain; the API already
 * accepts a string body and parses JSON server-side.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.uiBridgeVersion='v20-gemini-direct-v2';
  AI.freeMode=false;
  const API='/api/arya';

  function input(){return document.getElementById('aryaInput');}
  function body(){return document.getElementById('aryaBody');}
  function add(text,type){
    if(typeof window.aryaAdd==='function'){
      window.aryaAdd(String(text||''),type||'bot');
      const b=body();
      return b&&b.lastElementChild;
    }
    const b=body();
    if(!b)return null;
    const el=document.createElement('div');
    el.className='arya-msg '+(type||'bot');
    el.textContent=String(text||'');
    b.appendChild(el);
    b.scrollTop=b.scrollHeight;
    return el;
  }

  async function askDirect(q,city){
    const response=await fetch(API+'?v=20260924-gemini-1',{
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=UTF-8'},
      body:JSON.stringify({query:String(q||'').trim().slice(0,4000),city:String(city||'').trim().slice(0,120)})
    });
    const data=await response.json().catch(function(){return {};});
    if(!response.ok||!data.answer)throw new Error(String(data.error||('http_'+response.status)));
    return String(data.answer).trim();
  }

  async function send(){
    const i=input();
    const q=String(i?.value||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    if(i)i.value='';
    add(q,'user');
    const pending=add('Arya is thinking…','bot');
    try{
      const city=String(window.currentExploreCity||document.getElementById('modalTitle')?.textContent||'').trim();
      const answer=await askDirect(q,city);
      if(pending?.parentNode)pending.parentNode.removeChild(pending);
      add(answer,'bot');
      AI.internetConnected=true;
      AI.freeMode=false;
    }catch(e){
      if(pending?.parentNode)pending.parentNode.removeChild(pending);
      AI.internetConnected=false;
      console.warn('ExploreUP Arya Gemini request failed:',e);
      const msg=String(e?.message||'gemini_connection_failed');
      add('Arya Gemini connection issue: '+msg+'\nPlease try again.', 'bot');
    }
    return false;
  }

  window.askArya=send;
  AI.handleSend=send;
  AI.askOpenAI=askDirect;
  AI.askInternet=askDirect;
  AI.askInternet=askDirect;

  function wire(){
    const i=input();
    if(i && i.dataset.aryaOpenAIKeyWired!=='1'){
      i.dataset.aryaOpenAIKeyWired='1';
      i.addEventListener('keydown',function(e){
        if(e.key==='Enter'&&!e.shiftKey){
          e.preventDefault();
          e.stopImmediatePropagation();
          send();
        }
      },true);
    }

    const buttons=[];
    const main=document.getElementById('aryaSend');
    if(main)buttons.push(main);
    document.querySelectorAll('.arya-send,[data-arya-send],.arya-input button,#aryaPanel .arya-input button').forEach(function(btn){
      if(buttons.indexOf(btn)<0)buttons.push(btn);
    });
    buttons.forEach(function(btn){
      if(btn.dataset.aryaOpenAIButtonWired==='1')return;
      btn.dataset.aryaOpenAIButtonWired='1';
      btn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        send();
      },true);
    });

    if(i){
      const form=i.closest('form');
      if(form && form.dataset.aryaOpenAIFormWired!=='1'){
        form.dataset.aryaOpenAIFormWired='1';
        form.addEventListener('submit',function(e){
          e.preventDefault();
          e.stopImmediatePropagation();
          send();
        },true);
      }
    }
    AI.uiWired=!!i || buttons.length>0;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});
  else wire();
  window.addEventListener('load',wire,{once:true});
  [100,300,700,1500,3000,5000,8000].forEach(function(t){setTimeout(wire,t);});
  if(window.MutationObserver){
    new MutationObserver(function(){wire();}).observe(document.documentElement,{childList:true,subtree:true});
  }
})();
