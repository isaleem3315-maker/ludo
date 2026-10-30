const http=require('http'),fs=require('fs'),path=require('path'),PUB=__dirname,rooms=new Map();
const T={'.html':'text/html','.json':'application/json','.js':'text/javascript','.png':'image/png'};
const send=r=>{const d=JSON.stringify([...r.m].map(([id,c])=>({id,p:c.p})));r.m.forEach(c=>c.res.write('data: '+d+'\n\n'))};
http.createServer((q,s)=>{
 const u=new URL(q.url,'http://x'),room=u.searchParams.get('room')||'',id=u.searchParams.get('id')||'';
 if(u.pathname=='/e'){
  if(!/^[a-z0-9-]{1,40}$/.test(room)||!/^[a-z0-9]{4,40}$/.test(id))return s.writeHead(400).end();
  let r=rooms.get(room);if(!r){if(rooms.size>300)return s.writeHead(503).end();rooms.set(room,r={m:new Map()})}
  if(r.m.size>=8&&!r.m.has(id))return s.writeHead(403).end();
  s.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','X-Accel-Buffering':'no'});
  r.m.set(id,{res:s,p:{}});s.write(': ok\n\n');send(r);
  const k=setInterval(()=>s.write(': k\n\n'),20000);
  q.on('close',()=>{clearInterval(k);const c=r.m.get(id);if(c&&c.res===s){r.m.delete(id);r.m.size?send(r):rooms.delete(room)}});return}
 if(u.pathname=='/p'&&q.method=='POST'){let b='';q.on('data',d=>{b+=d;if(b.length>8192)q.destroy()});
  q.on('end',()=>{const r=rooms.get(room),c=r&&r.m.get(id);try{if(c){const p=JSON.parse(b);for(const k in p){if(!['h','n','seats','go','lg','rq','em'].includes(k))continue;if(p[k]===null)delete c.p[k];else c.p[k]=p[k]}send(r)}}catch(e){}s.writeHead(204).end()});return}
 const f=path.join(PUB,u.pathname=='/'?'index.html':u.pathname);
 if(!f.startsWith(PUB)||/server\.js$|package\.json$/.test(f))return s.writeHead(403).end();
 fs.readFile(f,(e,d)=>{if(e)return s.writeHead(404).end('Not found');s.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});s.end(d)})
}).listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Ludo server running on port '+(process.env.PORT||3000)));
