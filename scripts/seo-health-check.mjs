import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const configPath = resolve(here, '..', 'seo-ops.config.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));

const report = {
  checkedAt: new Date().toISOString(),
  siteUrl: config.siteUrl,
  status: 'pass',
  checks: []
};

function record(name, ok, details) {
  report.checks.push({ name, ok, details });
  if (!ok) report.status = 'fail';
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'BrewControl-SEO-Sentinel/1.0 (+https://www.brewcontrol.app.br/)'
    }
  });
  return {
    response,
    text: await response.text()
  };
}

function extractCanonical(html) {
  const links = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of links) {
    if (!/\brel\s*=\s*["'][^"']*\bcanonical\b[^"']*["']/i.test(tag)) continue;
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    if (href) return href;
  }
  return null;
}

function hasNoIndex(html, headers) {
  const header = headers.get('x-robots-tag') || '';
  if (/\bnoindex\b/i.test(header)) return `x-robots-tag=${header}`;

  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metas) {
    const isRobots = /\bname\s*=\s*["'](?:robots|googlebot)["']/i.test(tag);
    const content = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1] || '';
    if (isRobots && /\bnoindex\b/i.test(content)) return tag;
  }
  return null;
}

function expectedUrl(path) {
  return new URL(path, `${config.siteUrl}/`).href;
}

for (const path of config.criticalPaths) {
  const url = expectedUrl(path);
  try {
    const { response, text } = await fetchText(url);
    record(`HTTP ${path}`, response.status === 200, `status=${response.status}; final=${response.url}`);

    if (response.status !== 200) continue;

    const canonical = extractCanonical(text);
    record(
      `Canonical ${path}`,
      canonical === url,
      canonical ? `expected=${url}; found=${canonical}` : `expected=${url}; canonical ausente`
    );

    const noindex = hasNoIndex(text, response.headers);
    record(`Indexability ${path}`, !noindex, noindex || 'indexável');
  } catch (error) {
    record(`Fetch ${path}`, false, error instanceof Error ? error.message : String(error));
  }
}

try {
  const robotsUrl = expectedUrl(config.robotsPath);
  const { response, text } = await fetchText(robotsUrl);
  record('robots.txt HTTP', response.status === 200, `status=${response.status}`);

  const expectedSitemap = `Sitemap: ${expectedUrl(config.sitemapPath)}`;
  record('robots.txt sitemap', text.includes(expectedSitemap), `expected line: ${expectedSitemap}`);

  const blocks = text.split(/(?=User-agent:)/i);
  const generic = blocks.find((block) => /^User-agent:\s*\*/im.test(block));
  const blocksAll = generic && /^\s*Disallow:\s*\/\s*(?:#.*)?$/im.test(generic);
  record('robots.txt generic crawl', !blocksAll, blocksAll ? 'User-agent: * bloqueia /' : 'crawl genérico permitido');
} catch (error) {
  record('robots.txt fetch', false, error instanceof Error ? error.message : String(error));
}

try {
  const sitemapUrl = expectedUrl(config.sitemapPath);
  const { response, text } = await fetchText(sitemapUrl);
  record('sitemap HTTP', response.status === 200, `status=${response.status}`);

  const locations = new Set(
    [...text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim())
  );

  for (const path of config.criticalPaths) {
    const url = expectedUrl(path);
    record(`Sitemap ${path}`, locations.has(url), locations.has(url) ? url : `URL ausente: ${url}`);
  }
} catch (error) {
  record('sitemap fetch', false, error instanceof Error ? error.message : String(error));
}

try {
  const llmsUrl = expectedUrl(config.llmsPath);
  const { response, text } = await fetchText(llmsUrl);
  record('llms.txt HTTP', response.status === 200, `status=${response.status}`);
  record(
    'llms.txt canonical host',
    text.includes(config.canonicalHost),
    text.includes(config.canonicalHost) ? config.canonicalHost : `host ausente: ${config.canonicalHost}`
  );
} catch (error) {
  record('llms.txt fetch', false, error instanceof Error ? error.message : String(error));
}

const failures = report.checks.filter((check) => !check.ok);
const lines = [
  `# BrewControl SEO Sentinel`,
  '',
  `- **Status:** ${report.status === 'pass' ? 'PASS' : 'FAIL'}`,
  `- **Checked at:** ${report.checkedAt}`,
  `- **Site:** ${report.siteUrl}`,
  `- **Checks:** ${report.checks.length}`,
  `- **Failures:** ${failures.length}`,
  '',
  '## Checks',
  '',
  ...report.checks.map((check) => `- ${check.ok ? '✅' : '❌'} **${check.name}** — ${check.details}`)
];

await writeFile(resolve(here, '..', 'seo-health-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await writeFile(resolve(here, '..', 'seo-health-report.md'), `${lines.join('\n')}\n`, 'utf8');

console.log(lines.join('\n'));
if (report.status !== 'pass') process.exitCode = 1;
