const C="ielts7-v2";
const FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const put=r=>{if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r};
  // Sayfa: önce internet (güncellemeler hemen gelsin), yoksa önbellek
  if(req.mode==="navigate"||req.url.endsWith("index.html")){
    e.respondWith(fetch(req).then(put).catch(()=>caches.match(req).then(h=>h||caches.match("index.html"))));return;
  }
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(put)));
});
