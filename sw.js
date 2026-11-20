const V='qlct-v5';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const XL='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(V);await c.addAll(FILES);
  try{await c.add(new Request(XL,{mode:'cors'}))}catch(_){}
  self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==V)await caches.delete(k);
  await clients.claim();
})())});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith((async()=>{
    const c=await caches.open(V),m=await c.match(e.request,{ignoreSearch:true});
    if(m)return m;
    try{
      const r=await fetch(e.request);
      if(r.ok&&(e.request.url.startsWith(self.location.origin)||e.request.url===XL))c.put(e.request,r.clone());
      return r;
    }catch(_){
      return e.request.mode==='navigate'?(await c.match('./index.html')):Response.error();
    }
  })());
});