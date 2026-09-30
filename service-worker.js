const CACHE_NAME='exploreup-runtime-v14';

self.addEventListener('install',()=>self.skipWaiting());

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(key=>key.startsWith('exploreup-')).map(key=>caches.delete(key)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;

  // Let the browser fetch the worker script with the server's no-store headers.
  if(url.pathname==='/service-worker.js'||url.pathname==='/sw.js') return;

  // Never serve cached HTML: always request the currently deployed document.
  if(request.mode==='navigate'||request.destination==='document'){
    event.respondWith(
      fetch(new Request(request,{cache:'no-store'}))
        .catch(()=>new Response(
          '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ExploreUP offline</title><body style="font-family:system-ui;padding:2rem"><h1>You are offline</h1><p>Connect to the internet and reload ExploreUP to get the latest version.</p></body></html>',
          {status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}}
        ))
    );
    return;
  }

  if(url.pathname==='/api/version') return;

  // Versioned assets use network-first; cache is only an offline fallback.
  event.respondWith(
    fetch(request)
      .then(response=>{
        if(response&&response.ok){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
        }
        return response;
      })
      .catch(()=>caches.match(request).then(cached=>cached||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}}))
    )
  );
});
