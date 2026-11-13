(function(){
  'use strict';
  const getPanel=()=>document.getElementById('aryaPanel');

  // The page scroll lock must always match the real visibility of the assistant.
  // This also repairs stale state restored by mobile browser history/cache.
  const syncScrollLock=()=>{
    const panel=getPanel();
    const isOpen=!!panel&&!panel.hidden&&panel.classList.contains('arya-visible');
    document.body.classList.toggle('arya-open',isOpen);
    return isOpen;
  };

  const close=()=>{
    const panel=getPanel();
    if(panel){
      panel.hidden=true;
      panel.classList.remove('arya-visible');
      panel.style.display='none';
    }
    syncScrollLock();
  };

  const open=()=>{
    const panel=getPanel();
    if(!panel)return;
    panel.hidden=false;
    panel.classList.add('arya-visible');
    panel.style.display='flex';
    syncScrollLock();
    setTimeout(()=>document.getElementById('aryaInput')?.focus(),50);
  };

  window.aryaBackHome=()=>{close();window.scrollTo({top:0,behavior:'smooth'});};
  window.toggleArya=()=>{
    const panel=getPanel();
    if(!panel)return;
    if(panel.hidden)open();else close();
  };

  const init=()=>{
    close();
    const panel=getPanel();
    if(panel&&'MutationObserver'in window){
      const observer=new MutationObserver(syncScrollLock);
      observer.observe(panel,{attributes:true,attributeFilter:['hidden','class','style']});
    }
    window.addEventListener('pageshow',syncScrollLock);
    window.addEventListener('focus',syncScrollLock);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
