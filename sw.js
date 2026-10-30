self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!='GET'||u.pathname=='/e')return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open('l1').then(k=>k.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
