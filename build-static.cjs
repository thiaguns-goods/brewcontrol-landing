const fs = require('fs');
const path = require('path');

const root = process.cwd();
const out = path.join(root, 'dist');
const skipNames = new Set(['.git', '.github', 'dist', 'node_modules', 'vercel.json', 'build-static.cjs']);
const skipExtensions = new Set(['.md', '.rules']);
const textExtensions = new Set(['.html', '.xml', '.txt', '.json', '.js', '.css', '.svg']);
const oldHost = 'https://brewcontrol.app.br';
const canonicalHost = 'https://www.brewcontrol.app.br';

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function shouldSkip(name, fullPath) {
  if (skipNames.has(name)) return true;
  if (fs.statSync(fullPath).isFile() && skipExtensions.has(path.extname(name).toLowerCase())) return true;
  return false;
}

for (const name of fs.readdirSync(root)) {
  const source = path.join(root, name);
  if (shouldSkip(name, source)) continue;
  fs.cpSync(source, path.join(out, name), { recursive: true });
}

let replacements = 0;
function normalize(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      normalize(full);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;

    const original = fs.readFileSync(full, 'utf8');
    const updated = original.split(oldHost).join(canonicalHost);
    if (updated !== original) {
      fs.writeFileSync(full, updated, 'utf8');
      replacements += 1;
    }
  }
}

normalize(out);

const required = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'modulo-producao.html',
  'modulo-almoxarifado.html',
  'modulo-ativos.html',
  'modulo-comercial.html',
  'modulo-logistica.html',
  'modulo-financeiro.html',
  'modulo-brewpub.html',
  'modulo-fiscal.html',
  'modulo-pdv-mobile.html'
];

for (const file of required) {
  const full = path.join(out, file);
  if (!fs.existsSync(full)) throw new Error(`Missing required deploy file: ${file}`);
  const text = fs.readFileSync(full, 'utf8');
  if (text.includes(oldHost)) throw new Error(`Non-canonical host remains in ${file}`);
}

console.log(`Static deploy prepared in dist/. Canonical host normalized in ${replacements} file(s).`);
