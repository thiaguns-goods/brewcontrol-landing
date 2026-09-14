import fs from 'node:fs/promises';
import process from 'node:process';

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '529736619';
const SAMPLE_JSON = 'seo-validation-sample.json';
const SAMPLE_MD = 'seo-validation-sample.md';

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function currentWindow() {
  const end = shiftDays(new Date(), -3);
  const start = shiftDays(end, -27);
  return { start: isoDate(start), end: isoDate(end) };
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeGsc(rows) {
  return (rows || [])
    .map((row) => ({
      query: row.keys?.[0] || '',
      page: row.keys?.[1] || '',
      clicks: number(row.clicks),
      impressions: number(row.impressions),
      ctr: number(row.ctr),
      position: number(row.position, 100),
    }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
    .slice(0, 20);
}

function normalizeBing(rows) {
  return (rows || [])
    .map((row) => ({
      query: String(row.Query || row.query || ''),
      page: String(row.Page || row.page || ''),
      clicks: number(row.Clicks ?? row.clicks),
      impressions: number(row.Impressions ?? row.impressions),
      position: number(row.AvgPosition ?? row.position, 100),
      date: String(row.Date || row.date || ''),
    }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
    .slice(0, 20);
}

function pct(value) {
  return `${(number(value) * 100).toFixed(1)}%`;
}

function esc(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function markdown(report) {
  const lines = [
    '# SEO validation sample',
    '',
    `- Status: **${report.status}**`,
    `- Período: **${report.period.start} → ${report.period.end}**`,
    '- Finalidade: validar manualmente a leitura das APIs antes de qualquer merge/automação da fila #14.',
    '- Modo: **read-only**',
    '',
    '## Google Search Console — amostra query/page',
    '',
  ];

  if (!report.samples.google.length) {
    lines.push('Nenhuma linha retornada.');
  } else {
    lines.push('| Query | Página | Cliques | Impressões | CTR | Posição |');
    lines.push('|---|---|---:|---:|---:|---:|');
    for (const row of report.samples.google) {
      lines.push(`| ${esc(row.query)} | ${esc(row.page)} | ${row.clicks} | ${row.impressions} | ${pct(row.ctr)} | ${row.position.toFixed(1)} |`);
    }
  }

  lines.push('', '## Bing Webmaster Tools — amostra query/page', '');
  if (!report.samples.bing.length) {
    lines.push('Nenhuma linha retornada no endpoint query/page.');
  } else {
    lines.push('| Query | Página | Cliques | Impressões | Posição | Data |');
    lines.push('|---|---|---:|---:|---:|---|');
    for (const row of report.samples.bing) {
      lines.push(`| ${esc(row.query)} | ${esc(row.page)} | ${row.clicks} | ${row.impressions} | ${row.position.toFixed(1)} | ${esc(row.date)} |`);
    }
  }

  lines.push('', '## GA4 — landing pages orgânicas', '');
  if (!report.samples.ga4LandingPages.length) {
    lines.push('Nenhuma landing page orgânica retornada.');
  } else {
    lines.push('| Landing page | Sessões | Engajamento | Conversões | Bounce rate |');
    lines.push('|---|---:|---:|---:|---:|');
    for (const row of report.samples.ga4LandingPages) {
      lines.push(`| ${esc(row.landingPage)} | ${row.sessions} | ${pct(row.engagementRate)} | ${row.conversions} | ${pct(row.bounceRate)} |`);
    }
  }

  lines.push('', '## GA4 — fontes/meios (amostra)', '');
  if (!report.samples.ga4TrafficSources.length) {
    lines.push('Nenhuma fonte/meio retornada.');
  } else {
    lines.push('| Source | Medium | Landing page | Sessões | Engajamento | Conversões |');
    lines.push('|---|---|---|---:|---:|---:|');
    for (const row of report.samples.ga4TrafficSources) {
      lines.push(`| ${esc(row.sessionSource)} | ${esc(row.sessionMedium)} | ${esc(row.landingPage)} | ${row.sessions} | ${pct(row.engagementRate)} | ${row.conversions} |`);
    }
  }

  if (report.errors.length) {
    lines.push('', '## Erros', '');
    for (const error of report.errors) lines.push(`- ${esc(error.source)}: ${esc(error.message)}`);
  }

  lines.push('', '> Esta amostra não contém credenciais e não executa mutações, submissões ou escrita em Issues.', '');
  return lines.join('\n');
}

async function main() {
  const config = JSON.parse(await fs.readFile('seo-ops.config.json', 'utf8'));
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsPath) throw new Error('GOOGLE_APPLICATION_CREDENTIALS não definido.');
  if (!process.env.BING_API_KEY) throw new Error('BING_API_KEY não definido.');

  const [{ updateAccount }, gsc, bing, ga4, ga4Utils] = await Promise.all([
    import('search-console-mcp/dist/common/auth/config.js'),
    import('search-console-mcp/dist/google/tools/analytics.js'),
    import('search-console-mcp/dist/bing/tools/analytics.js'),
    import('search-console-mcp/dist/ga4/tools/analytics.js'),
    import('search-console-mcp/dist/ga4/utils.js'),
  ]);

  await updateAccount({
    id: 'brewcontrol_ga4_validation',
    engine: 'ga4',
    alias: 'BrewControl GA4 validation',
    ga4PropertyId: GA4_PROPERTY_ID,
    websites: [GA4_PROPERTY_ID],
    serviceAccountPath: credentialsPath,
  });

  const period = currentWindow();
  const errors = [];
  const safe = async (source, fn, fallback) => {
    try {
      return await fn();
    } catch (error) {
      errors.push({ source, message: error instanceof Error ? error.message : String(error) });
      return fallback;
    }
  };

  const [googleRaw, bingRaw, ga4LandingRaw, ga4SourcesResponse] = await Promise.all([
    safe('Google Search Console', () => gsc.queryAnalytics({
      siteUrl: config.siteUrl,
      startDate: period.start,
      endDate: period.end,
      dimensions: ['query', 'page'],
      dataState: 'final',
      rowLimit: 100,
    }), []),
    safe('Bing Webmaster Tools', () => bing.getQueryPageStats(config.siteUrl), []),
    safe('GA4 organic landing pages', () => ga4.getOrganicLandingPages(
      GA4_PROPERTY_ID,
      period.start,
      period.end,
      20,
      'brewcontrol_ga4_validation',
    ), []),
    safe('GA4 traffic sources', () => ga4.queryAnalytics({
      propertyId: GA4_PROPERTY_ID,
      accountId: 'brewcontrol_ga4_validation',
      startDate: period.start,
      endDate: period.end,
      dimensions: ['sessionSource', 'sessionMedium', 'landingPagePlusQueryString'],
      metrics: ['sessions', 'conversions', 'engagementRate'],
      limit: 50,
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    }), null),
  ]);

  const ga4Sources = ga4SourcesResponse ? ga4Utils.formatRows(ga4SourcesResponse) : [];
  const report = {
    generatedAt: new Date().toISOString(),
    status: errors.length ? 'PARTIAL' : 'PASS',
    mode: 'validation-sample-read-only',
    siteUrl: config.siteUrl,
    ga4PropertyId: GA4_PROPERTY_ID,
    period,
    samples: {
      google: normalizeGsc(googleRaw),
      bing: normalizeBing(bingRaw),
      ga4LandingPages: (Array.isArray(ga4LandingRaw) ? ga4LandingRaw : []).slice(0, 20).map((row) => ({
        landingPage: String(row.landingPagePlusQueryString || row.pagePath || ''),
        sessions: number(row.sessions),
        engagementRate: number(row.engagementRate),
        conversions: number(row.conversions),
        bounceRate: number(row.bounceRate),
      })),
      ga4TrafficSources: ga4Sources.slice(0, 30).map((row) => ({
        sessionSource: String(row.sessionSource || ''),
        sessionMedium: String(row.sessionMedium || ''),
        landingPage: String(row.landingPagePlusQueryString || ''),
        sessions: number(row.sessions),
        engagementRate: number(row.engagementRate),
        conversions: number(row.conversions),
      })),
    },
    errors,
    guardrails: {
      issueWrite: false,
      siteMutation: false,
      sitemapSubmission: false,
      indexingSubmission: false,
    },
  };

  await fs.writeFile(SAMPLE_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await fs.writeFile(SAMPLE_MD, `${markdown(report)}\n`, 'utf8');
  console.log(markdown(report));

  if (errors.length) process.exitCode = 2;
}

main().catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(error);
  await fs.writeFile(SAMPLE_JSON, `${JSON.stringify({ status: 'FAIL', error: message }, null, 2)}\n`, 'utf8').catch(() => {});
  await fs.writeFile(SAMPLE_MD, `# SEO validation sample\n\nStatus: **FAIL**\n\n${message}\n`, 'utf8').catch(() => {});
  process.exitCode = 1;
});
