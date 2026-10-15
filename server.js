// Local dev server: serves /public and the API. Run: npm start  (http://localhost:3000)
const http = require('http'), fs = require('fs'), path = require('path');
try { // tiny .env loader (no dependencies)
  for (const l of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const need = ['api/index.js', 'lib/products.js', 'lib/store.js', 'public/index.html', 'public/admin.html'];
const missing = need.filter(f => !fs.existsSync(path.join(__dirname, f)));
if (missing.length) {
  console.error('\n  Something is missing from this folder: ' + missing.join(', ') +
    '\n  Re-extract the full ZIP (right-click > Extract All), then run again from the folder that contains server.js.\n');
  process.exit(1);
}
const api = require('./api/index.js');
const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain' };
const CSP = "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api')) return api(req, res);
  let p; try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.statusCode = 400; return res.end(); }
  if (p === '/') p = '/index.html'; else if (p === '/admin') p = '/admin.html';
  const f = path.join(PUBLIC, path.normalize(p));
  if (!f.startsWith(PUBLIC + path.sep)) { res.statusCode = 403; return res.end('Forbidden'); }
  fs.readFile(f, (err, data) => {
    if (err) { res.statusCode = 404; return res.end('Not found'); }
    res.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream');
    res.setHeader('Content-Security-Policy', CSP);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(data);
  });
});

let port = Number(process.env.PORT) || 3000, tries = 0;
server.on('error', e => {
  if (e.code === 'EADDRINUSE' && tries++ < 10) { console.log('  Port ' + port + ' is busy, trying ' + (port + 1) + '...'); port++; setTimeout(() => server.listen(port), 100); }
  else { console.error('\n  Could not start the server: ' + e.message + '\n'); process.exit(1); }
});
server.on('listening', () => {
  const url = 'http://localhost:' + port;
  console.log('\n  VOID SMP store is running.\n  Open this in your browser:  ' + url + '\n  (Leave this window open. Press Ctrl+C to stop.)\n');
  if (process.env.OPEN_BROWSER) {
    const cmd = process.platform === 'win32' ? 'start "" "' + url + '"' : process.platform === 'darwin' ? 'open "' + url + '"' : 'xdg-open "' + url + '"';
    require('child_process').exec(cmd, () => {});
  }
});
server.listen(port);
