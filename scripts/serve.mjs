import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../site');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.ico':'image/vnd.microsoft.icon','.png':'image/png','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
const server = http.createServer(async (req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403); res.end('Forbidden'); return;}
  try {
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) {res.writeHead(301,{Location:pathname+'/'});res.end();return;}
      file = path.join(file,'index.html');
    }
    const data = await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    try {res.end(await readFile(path.join(root,'404.html')));} catch {res.end('Run npm run build first.');}
  }
});
server.on('error', error => {console.error(error.message); process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}`));
