(function(){
  'use strict';
  const getPanel=()=>document.getElementById('aryaPanel');
  const close=()=>{
    const p=getPanel();
    if(p){p.hidden=true;p.classList.remove('arya-visible');p.style.display='none';}
    document.body.classList.remove('arya-open');
  };
  const open=()=>{
    const p=getPanel();
    if(!p)return;
    p.hidden=false;
    p.classList.add('arya-visible');
    p.style.display='flex';
    document.body.classList.add('arya-open');
    setTimeout(()=>document.getElementById('aryaInput')?.focus(),50);
  };
  window.aryaBackHome=()=>{close();window.scrollTo({top:0,behavior:'smooth'});};
  window.toggleArya=()=>{
    const p=getPanel();
    if(!p)return;
    if(p.hidden)open();else close();
  };
  // Keep Arya closed on a fresh page load. Do not close it from pageshow,
  // because pageshow can fire after the UI has been restored from bfcache.
  const init=()=>close();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
