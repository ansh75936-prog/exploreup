/* ExploreUP Arya UI bridge — FREE/local mode
 * Wires the visible Arya interaction to the local Arya assistant.
 * No external AI/API key is required in this mode.
 */
(function(){
  'use strict';
  const AI = window.ExploreUPAryaAI = window.ExploreUPAryaAI || {};

  function isTextInput(el){
    if(!el || !el.matches) return false;
    if(el.disabled || el.readOnly) return false;
    if(el.matches('textarea')) return true;
    return el.matches('input') && !/^(button|submit|reset|checkbox|radio|file|hidden)$/i.test(el.type || 'text');
  }

  function findInput(){
    const selectors = [
      '#aryaInput',
      '#arya-input',
      '[data-arya-input]',
      'input[name="arya"]',
      'textarea[name="arya"]',
      'input[id*="arya" i]',
      'textarea[id*="arya" i]',
      'input[placeholder*="arya" i]',
      'textarea[placeholder*="arya" i]',
      'input[aria-label*="arya" i]',
      'textarea[aria-label*="arya" i]'
    ];
    for(const selector of selectors){
      const el=document.querySelector(selector);
      if(isTextInput(el)) return el;
    }

    // Fallback for an Arya panel whose input has a generic id/name.
    const candidates=[...document.querySelectorAll('input,textarea')].filter(isTextInput);
    for(const el of candidates){
      const box=el.closest('[id*="arya" i],[class*="arya" i],form,section,dialog,div');
      const text=String(box?.innerText || box?.textContent || '').toLowerCase();
      const hint=String(el.placeholder || el.getAttribute('aria-label') || '').toLowerCase();
      if(/arya|ask me|ask anything|ask your|chat with/.test(hint) || /arya ai|ask arya/.test(text)) return el;
    }
    return null;
  }

  function responseBox(input){
    let box=document.getElementById('exploreup-arya-live-response');
    if(box)return box;
    box=document.createElement('div');
    box.id='exploreup-arya-live-response';
    box.setAttribute('role','status');
    box.setAttribute('aria-live','polite');
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
    if(!q) return false;
    const box=responseBox(input);
    box.textContent='Arya • Free\n\nThinking…';
    try{
      const result=typeof AI.askFree==='function' ? AI.askFree(q,city()) : {ok:false};
      if(result && result.ok){
        box.textContent='Arya • Free\n\n'+String(result.answer||'').trim();
        if(input) input.value='';
        AI.freeMode=true;
        return true;
      }
      throw new Error('free_mode_unavailable');
    }catch(e){
      box.textContent='Arya • Free\n\nArya is temporarily unavailable. Please try again.';
      return false;
    }
  }

  function buttonLooksLikeArya(button,input){
    if(!button) return false;
    const label=String(button.textContent||button.getAttribute('aria-label')||button.getAttribute('title')||'').toLowerCase();
    if(/ask|send|search|arya/.test(label)) return true;
    const box=input?.closest('form,[id*="arya" i],[class*="arya" i],section,dialog,div');
    return !!(box && box.contains(button) && /arya ai|ask arya|chat with arya/.test(String(box.innerText||box.textContent||'').toLowerCase()));
  }

  function wire(){
    const input=findInput();
    if(!input) return false;
    if(input.dataset.exploreupFreeAryaWired==='1') return true;
    input.dataset.exploreupFreeAryaWired='1';

    const submit=async function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      await live(input.value,input);
    };

    const form=input.closest('form');
    if(form) form.addEventListener('submit',submit,true);

    input.addEventListener('keydown',async function(e){
      if(e.key==='Enter' && !e.shiftKey){
        e.preventDefault();
        e.stopImmediatePropagation();
        await live(input.value,input);
      }
    },true);

    // Capture clicks at document level so dynamically rendered Arya buttons work too.
    document.addEventListener('click',async function(e){
      const button=e.target?.closest?.('button,[role="button"],input[type="submit"]');
      if(!button || !buttonLooksLikeArya(button,input)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      await live(input.value,input);
    },true);

    if(typeof window.askArya==='function' && !window.askArya.__freeAryaUIBridge){
      const original=window.askArya;
      async function freeAskArya(){
        const current=findInput() || input;
        const ok=await live(current.value,current);
        if(ok)return;
        return original.apply(this,arguments);
      }
      freeAskArya.__freeAryaUIBridge=true;
      freeAskArya.original=original;
      window.askArya=freeAskArya;
    }

    AI.uiWired=true;
    AI.freeMode=true;
    return true;
  }

  let tries=0;
  function boot(){
    if(wire() || tries++>=120) return;
    setTimeout(boot,250);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('load',boot,{once:true});
  new MutationObserver(()=>wire()).observe(document.documentElement,{childList:true,subtree:true});
})();