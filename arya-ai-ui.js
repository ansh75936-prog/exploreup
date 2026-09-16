/* ExploreUP Arya UI bridge
 * Forces the visible Arya interaction to use the secure /api/arya OpenAI backend first.
 * V20 data remains read-only; this file only handles UI -> backend wiring.
 */
(function(){
  'use strict';
  const AI = window.ExploreUPAryaAI = window.ExploreUPAryaAI || {};

  function findInput(){
    const selectors = [
      '#aryaInput',
      'input[name="arya"]',
      'textarea[name="arya"]',
      'input[id*="arya" i]',
      'textarea[id*="arya" i]',
      'input[placeholder*="arya" i]',
      'textarea[placeholder*="arya" i]'
    ];
    for(const selector of selectors){
      const el=document.querySelector(selector);
      if(el)return el;
    }
    return null;
  }

  function responseBox(input){
    let box=document.getElementById('exploreup-arya-live-response');
    if(box)return box;
    box=document.createElement('div');
    box.id='exploreup-arya-live-response';
    box.setAttribute('role','status');
    box.style.cssText='margin:12px 0;padding:14px 16px;background:#fff;border:1px solid #dce6f2;border-radius:14px;color:#10233f;line-height:1.55;font-size:14px;white-space:pre-wrap;box-shadow:0 5px 18px rgba(0,27,59,.08)';
    if(input && input.parentElement) input.parentElement.insertAdjacentElement('afterend',box);
    else document.body.appendChild(box);
    return box;
  }

  function city(){
    return String(window.currentExploreCity || document.getElementById('modalTitle')?.textContent || '').trim();
  }

  async function live(query,input){
    const q=String(query||'').replace(/\s+/g,' ').trim();
    if(!q)return false;
    const box=responseBox(input);
    box.textContent='Arya • OpenAI\n\nThinking…';
    try{
      const r=await fetch('/api/arya',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({query:q,city:city()})
      });
      const data=await r.json().catch(()=>({}));
      if(!r.ok || !data.answer) throw new Error(data.error || 'OpenAI backend unavailable');
      box.textContent='Arya • OpenAI\n\n'+String(data.answer).trim();
      AI.openAIConnected=true;
      return true;
    }catch(e){
      AI.openAIConnected=false;
      box.textContent='Arya • OpenAI\n\nLive AI temporarily unavailable. Please try again.';
      return false;
    }
  }

  function wire(){
    const input=findInput();
    if(!input)return false;
    if(input.dataset.exploreupOpenAIWired==='1')return true;
    input.dataset.exploreupOpenAIWired='1';

    const form=input.closest('form');
    if(form){
      form.addEventListener('submit',async function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        await live(input.value,input);
      },true);
    }

    const root=input.parentElement || document;
    root.addEventListener('click',async function(e){
      const button=e.target.closest('button');
      if(!button)return;
      const label=String(button.textContent||button.getAttribute('aria-label')||'').toLowerCase();
      if(/ask|send|search|arya/.test(label)){
        e.preventDefault();
        e.stopImmediatePropagation();
        await live(input.value,input);
      }
    },true);

    if(typeof window.askArya==='function' && !window.askArya.__openAIUIBridge){
      const original=window.askArya;
      async function openAIAskArya(){
        const ok=await live(input.value,input);
        if(ok)return;
        return original.apply(this,arguments);
      }
      openAIAskArya.__openAIUIBridge=true;
      openAIAskArya.original=original;
      window.askArya=openAIAskArya;
    }
    AI.uiWired=true;
    return true;
  }

  let tries=0;
  function boot(){
    if(wire() || tries++>=80)return;
    setTimeout(boot,250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('load',boot,{once:true});
})();
