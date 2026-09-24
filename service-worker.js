const CACHE_NAME='exploreup-runtime-v3';

self.addEventListener('install',()=>self.skipWaiting());

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(key=>key.startsWith('exploreup-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;

  // Always fetch HTML fresh so a new deployment is available on the next navigation.
  if(request.mode==='navigate' || request.destination==='document'){
    event.respondWith(
      fetch(new Request(request,{cache:'no-store'}))
        .then(response=>{
          if(response&&response.ok){
            const copy=response.clone();
            caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
          }
          return response;
        })
        .catch(()=>caches.match(request).then(cached=>cached||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})))
    );
    return;
  }

  // Do not cache the deployment version endpoint.
  if(url.pathname==='/api/version') return;

  event.respondWith(
    fetch(request)
      .then(response=>{
        if(response&&response.ok){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
        }
        return response;
      })
      .catch(()=>caches.match(request).then(cached=>cached||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})))
  );
});
