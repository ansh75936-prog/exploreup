if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(reg => {
          reg.update();
          setInterval(() => reg.update().catch(() => {}), 60000);
        }).catch(() => {});
      });
      let exploreUpReloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (exploreUpReloading) return;
        exploreUpReloading = true;
        window.location.reload();
      });
    }

/* ExploreUP PWA: detect new Vercel deployments while the app is open */
    (function(){
      'use strict';
      const KEY='exploreup-deployment-version-v1';
      const CHECK_EVERY=60000;
      let checking=false;

      async function checkForUpdate(){
        if(checking || document.visibilityState==='hidden') return;
        checking=true;
        try{
          const controller=new AbortController();
          const timeout=setTimeout(()=>controller.abort(),8000);
          const response=await fetch('/api/version?ts='+Date.now(),{
            cache:'no-store',
            headers:{'Cache-Control':'no-cache'},
            signal:controller.signal
          });
          clearTimeout(timeout);
          if(!response.ok) return;
          const data=await response.json();
          const version=String(data.version||'').trim();
          if(!version || version==='unknown') return;

          const previous=localStorage.getItem(KEY);
          if(!previous){
            localStorage.setItem(KEY,version);
            return;
          }
          if(previous!==version){
            localStorage.setItem(KEY,version);
            window.location.reload();
          }
        }catch(e){
          /* Offline or temporary network failure: keep the current app usable. */
        }finally{
          checking=false;
        }
      }

      window.addEventListener('load',()=>{
        checkForUpdate();
        setInterval(checkForUpdate,CHECK_EVERY);
      });
      document.addEventListener('visibilitychange',()=>{
        if(document.visibilityState==='visible') checkForUpdate();
      });
      window.addEventListener('pageshow',checkForUpdate);
    })();
