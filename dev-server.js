const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const port = 5173;
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.ico':'image/x-icon','.woff2':'font/woff2'};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/admin.html';
  let f = path.join(root, p);
  if (!path.resolve(f).startsWith(path.resolve(root))) { res.writeHead(403); res.end('403'); return; }
  if (!fs.existsSync(f) && !path.extname(f) && fs.existsSync(f + '.html')) f += '.html';
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end('404'); }
    else { res.writeHead(200, {'Content-Type': mime[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store'}); res.end(d); }
  });
}).listen(port, () => console.log('serving ' + root + ' on http://localhost:' + port));
