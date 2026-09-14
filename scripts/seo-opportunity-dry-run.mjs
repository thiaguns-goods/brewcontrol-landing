import fs from 'node:fs/promises';
import process from 'node:process';

const UPSTREAM_VERSION = '2.1.3';
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '529736619';
const REPORT_JSON = 'seo-opportunity-dry-run.json';
const REPORT_MD = 'seo-opportunity-dry-run.md';

const AI_REFERRAL_HOSTS = [
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'gemini.google.com',
  'bard.google.com',
  'copilot.microsoft.com',
  'copilot.com',
  'claude.ai',
  'poe.com',
  'you.com',
  'phind.com',
  'meta.ai',
  'chat.deepseek.com',
  'grok.com',
  'chat.mistral.ai',
];

const CLUSTER_PATTERNS = {
  'ERP e sistema para cervejaria': [
    'erp', 'sistema', 'software', 'gestao cervejaria', 'gestão cervejaria',
    'sistema para cervejaria', 'software cervejaria', 'brewcontrol',
  ],
  'Produção e rastreabilidade': [
    'producao', 'produção', 'ordem de producao', 'ordem de produção', 'lote',
    'rastreabilidade', 'mostura', 'fermentacao', 'fermentação', 'receita',
    'controle de producao', 'controle de produção',
  ],
  'Barris, chopeiras e ativos': [
    'barril', 'barris', 'chopeira', 'chopeiras', 'ativo', 'ativos', 'keg',
    'cilindro', 'comodato',
  ],
  'Estoque e insumos': [
    'estoque', 'insumo', 'insumos', 'malte', 'lupulo', 'lúpulo', 'levedura',
    'almoxarifado', 'inventario', 'inventário',
  ],
  'Comercial e logística de chope': [
    'venda', 'vendas', 'comercial', 'pedido', 'pedidos', 'logistica', 'logística',
    'entrega', 'delivery', 'consignado', 'consignacao', 'consignação', 'rota',
  ],
  'Brewpub e gestão financeira': [
    'brewpub', 'pdv', 'financeiro', 'fluxo de caixa', 'caixa', 'contas a pagar',
    'contas a receber', 'faturamento', 'gestao financeira', 'gestão financeira',
  ],
  'Cervejaria cigana e terceirização': [
    'cervejaria cigana', 'cigana', 'terceirizacao', 'terceirização',
    'producao terceirizada', 'produção terceirizada', 'contract brewing',
    'gypsy brewer',
  ],
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function classifyCluster(value, topicClusters) {
  const text = normalizeText(value);
  let best = null;
  let bestHits = 0;
  for (const cluster of topicClusters) {
    const patterns = CLUSTER_PATTERNS[cluster] || [];
    const hits = patterns.reduce((count, pattern) => count + (text.includes(normalizeText(pattern)) ? 1 : 0), 0);
    if (hits > bestHits) {
      best = cluster;
      bestHits = hits;
    }
  }
  return best || 'Não classificado';
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function periodWindows() {
  const now = new Date();
  const currentEnd = shiftDays(now, -3);
  const currentStart = shiftDays(currentEnd, -27);
  const previousEnd = shiftDays(currentStart, -1);
  const previousStart = shiftDays(previousEnd, -27);
  return {
    current: { start: isoDate(currentStart), end: isoDate(currentEnd) },
    previous: { start: isoDate(previousStart), end: isoDate(previousEnd) },
  };
}

function metric(row, key, fallback = 0) {
  const value = Number(row?.[key]);
  return Number.isFinite(value) ? value : fallback;
}

function normalizeGoogleRows(rows) {
  return (rows || []).map((row) => ({
    query: row.keys?.[0] || '',
    page: row.keys?.[1] || '',
    clicks: metric(row, 'clicks'),
    impressions: metric(row, 'impressions'),
    ctr: metric(row, 'ctr'),
    position: metric(row, 'position', 100),
  }));
}

function parseBingDate(value) {
  if (!value) return null;
  const ms = String(value).match(/\/Date\((\d+)\)\//)?.[1];
  if (ms) return new Date(Number(ms));
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function inPeriod(dateValue, period) {
  const d = parseBingDate(dateValue);
  if (!d) return true;
  const start = new Date(`${period.start}T00:00:00Z`);
  const end = new Date(`${period.end}T23:59:59Z`);
  return d >= start && d <= end;
}

function aggregateBing(rows, period) {
  const map = new Map();
  for (const row of rows || []) {
    if (!inPeriod(row.Date, period)) continue;
    const query = String(row.Query || row.query || '');
    const page = String(row.Page || row.page || '');
    const key = `${query}\u0001${page}`;
    const clicks = Number(row.Clicks ?? row.clicks ?? 0) || 0;
    const impressions = Number(row.Impressions ?? row.impressions ?? 0) || 0;
    const position = Number(row.AvgPosition ?? row.position ?? 0) || 0;
    const current = map.get(key) || { query, page, clicks: 0, impressions: 0, weightedPosition: 0 };
    current.clicks += clicks;
    current.impressions += impressions;
    current.weightedPosition += position * impressions;
    map.set(key, current);
  }
  return [...map.values()].map((row) => ({
    query: row.query,
    page: row.page,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.impressions ? row.clicks / row.impressions : 0,
    position: row.impressions ? row.weightedPosition / row.impressions : 100,
  }));
}

function aggregatePages(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!row.page) continue;
    const current = map.get(row.page) || { page: row.page, clicks: 0, impressions: 0, weightedPosition: 0 };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.weightedPosition += row.position * row.impressions;
    map.set(row.page, current);
  }
  return [...map.values()].map((row) => ({
    page: row.page,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.impressions ? row.clicks / row.impressions : 0,
    position: row.impressions ? row.weightedPosition / row.impressions : 100,
  }));
}

function rowMap(rows) {
  return new Map(rows.map((row) => [`${row.query}\u0001${row.page}`, row]));
}

function pageMap(rows) {
  return new Map(rows.map((row) => [row.page, row]));
}

function benchmarkCtr(position) {
  const pos = Math.max(1, Math.round(position));
  if (pos === 1) return 0.30;
  if (pos === 2) return 0.15;
  if (pos === 3) return 0.10;
  if (pos === 4) return 0.06;
  if (pos === 5) return 0.04;
  if (pos === 6) return 0.03;
  if (pos === 7) return 0.02;
  if (pos === 8) return 0.015;
  if (pos <= 10) return 0.01;
  if (pos <= 15) return 0.008;
  if (pos <= 20) return 0.005;
  if (pos <= 30) return 0.003;
  return 0.002;
}

function percentChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function normalizePath(url) {
  if (!url) return '';
  try {
    return new URL(url).pathname || '/';
  } catch {
    return String(url).split('?')[0] || '/';
  }
}

function mapGa4Rows(rows) {
  const map = new Map();
  for (const row of rows || []) {
    const key = String(row.landingPagePlusQueryString || row.pagePath || '').split('?')[0];
    if (!key) continue;
    map.set(key, row);
  }
  return map;
}

function addSignal(candidate, signal, score) {
  if (!candidate.signals.includes(signal)) candidate.signals.push(signal);
  candidate.score += score;
}

function impactForScore(score) {
  if (score >= 60) return 'alto';
  if (score >= 35) return 'médio';
  return 'baixo';
}

function confidenceFor(candidate, minimumImpressions) {
  const impressions = candidate.current?.impressions || candidate.previous?.impressions || 0;
  if (impressions >= 100 || candidate.signals.length >= 3) return 'alta';
  if (impressions >= minimumImpressions || candidate.signals.length >= 2) return 'média';
  return 'baixa';
}

function actionFor(candidate) {
  const signals = new Set(candidate.signals);
  if (signals.has('canibalização')) {
    return 'Revisar intenção e sobreposição entre URLs; decidir consolidação, diferenciação ou links internos. Nenhuma mudança automática.';
  }
  if (signals.has('queda de página')) {
    return 'Auditar atualização factual, intenção, indexação e links internos da página antes de qualquer edição.';
  }
  if (signals.has('CTR abaixo do potencial')) {
    return 'Revisar title/meta e aderência ao intent/serp snippet; preparar alteração para revisão humana.';
  }
  if (signals.has('gap GSC↔GA4')) {
    return 'Verificar tracking e experiência da landing page; separar falha de medição de problema real de engajamento.';
  }
  if (signals.has('nova demanda no cluster')) {
    return 'Avaliar reforço da página existente para a nova demanda e links internos; criar conteúdo novo apenas se houver gap real e aprovação humana.';
  }
  return 'Reforçar a página existente para a query, priorizando cobertura de intenção e links internos; submeter qualquer mudança à revisão humana.';
}

function buildCandidates({ engine, currentRows, previousRows, config, topicClusters }) {
  const minImp = config.dataThresholds.minimumImpressionsToAct;
  const posMin = config.dataThresholds.opportunityPositionMin;
  const posMax = config.dataThresholds.opportunityPositionMax;
  const previous = rowMap(previousRows);
  const candidates = new Map();

  const ensure = (row) => {
    const key = `${engine}|${row.query}|${row.page}`;
    if (!candidates.has(key)) {
      candidates.set(key, {
        key,
        engine,
        query: row.query,
        page: row.page,
        cluster: classifyCluster(`${row.query} ${row.page}`, topicClusters),
        current: row,
        previous: previous.get(`${row.query}\u0001${row.page}`) || null,
        signals: [],
        score: 0,
      });
    }
    return candidates.get(key);
  };

  for (const row of currentRows) {
    const prev = previous.get(`${row.query}\u0001${row.page}`) || null;
    const inOpportunityBand = row.position >= posMin && row.position <= posMax && row.impressions >= minImp;
    if (inOpportunityBand) {
      const c = ensure(row);
      const volumeScore = Math.min(25, Math.log10(row.impressions + 1) * 10);
      const positionScore = Math.max(4, 20 - ((row.position - posMin) / Math.max(1, posMax - posMin)) * 12);
      addSignal(c, 'posição 4–30 com volume', volumeScore + positionScore);

      const benchmark = benchmarkCtr(row.position);
      if (row.ctr < benchmark * 0.6) addSignal(c, 'CTR abaixo do potencial', 18);
      if ((!prev || prev.impressions < minImp) && c.cluster !== 'Não classificado') addSignal(c, 'nova demanda no cluster', 15);
    }

    if (prev && row.impressions >= minImp && prev.impressions >= minImp) {
      const rankDelta = prev.position - row.position;
      if (rankDelta >= 3) addSignal(ensure(row), 'ranking em alta', Math.min(12, 5 + rankDelta));
      if (rankDelta <= -3) addSignal(ensure(row), 'ranking em queda', Math.min(18, 7 + Math.abs(rankDelta)));
    }
  }

  const byQuery = new Map();
  for (const row of currentRows) {
    if (!row.query || !row.page) continue;
    if (!byQuery.has(row.query)) byQuery.set(row.query, []);
    byQuery.get(row.query).push(row);
  }
  for (const rows of byQuery.values()) {
    const useful = rows.filter((row) => row.impressions > 0).sort((a, b) => b.impressions - a.impressions);
    const totalImp = useful.reduce((sum, row) => sum + row.impressions, 0);
    if (useful.length >= 2 && totalImp >= minImp && useful[1].impressions >= useful[0].impressions * 0.2) {
      const c = ensure(useful[0]);
      c.competingPages = useful.slice(0, 4).map((row) => row.page);
      addSignal(c, 'canibalização', 20);
    }
  }

  return candidates;
}

function addPageDecayCandidates(candidates, engine, currentRows, previousRows, config, topicClusters) {
  const current = pageMap(aggregatePages(currentRows));
  const previous = pageMap(aggregatePages(previousRows));
  for (const [page, prev] of previous) {
    if (prev.impressions < config.dataThresholds.minimumImpressionsToAct) continue;
    const curr = current.get(page) || { page, clicks: 0, impressions: 0, ctr: 0, position: 100 };
    const clickChange = percentChange(curr.clicks, prev.clicks);
    const impChange = percentChange(curr.impressions, prev.impressions);
    const clickDrop = prev.clicks > 0 && clickChange <= -config.dataThresholds.materialClickDropPercent;
    const impDrop = impChange <= -config.dataThresholds.materialImpressionDropPercent;
    if (!clickDrop && !impDrop) continue;
    const key = `${engine}|PAGE|${page}`;
    const candidate = candidates.get(key) || {
      key,
      engine,
      query: '',
      page,
      cluster: classifyCluster(page, topicClusters),
      current: curr,
      previous: prev,
      signals: [],
      score: 0,
    };
    candidate.pageChanges = { clicksPercent: clickChange, impressionsPercent: impChange };
    addSignal(candidate, 'queda de página', 28 + Math.min(12, Math.abs(Math.min(clickChange, impChange)) / 10));
    candidates.set(key, candidate);
  }
}

function addGa4Signals(candidates, googleRows, ga4LandingMap, config) {
  const pages = aggregatePages(googleRows);
  for (const page of pages) {
    if (page.impressions < config.dataThresholds.minimumImpressionsToAct) continue;
    const ga4 = ga4LandingMap.get(normalizePath(page.page));
    const sessions = Number(ga4?.sessions || 0);
    const engagementRate = Number(ga4?.engagementRate || 0);
    const isGap = (page.clicks >= 3 && sessions === 0) || (sessions >= 5 && engagementRate > 0 && engagementRate < 0.35);
    if (!isGap) continue;

    let candidate = [...candidates.values()]
      .filter((c) => c.engine === 'Google' && c.page === page.page)
      .sort((a, b) => b.score - a.score)[0];

    if (!candidate) {
      const key = `Google|PAGE|${page.page}`;
      candidate = {
        key,
        engine: 'Google',
        query: '',
        page: page.page,
        cluster: 'Não classificado',
        current: page,
        previous: null,
        signals: [],
        score: 0,
      };
      candidates.set(key, candidate);
    }
    candidate.ga4 = ga4 || null;
    addSignal(candidate, 'gap GSC↔GA4', 10);
  }
}

function isAiReferralSource(source) {
  const normalized = normalizeText(source);
  return AI_REFERRAL_HOSTS.some((host) => normalized.includes(normalizeText(host)));
}

function formatPct(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function mdEscape(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function buildMarkdown(report) {
  const lines = [];
  lines.push('# SEO Opportunity DRY RUN');
  lines.push('');
  lines.push(`- Status: **${report.status}**`);
  lines.push(`- Upstream: \`search-console-mcp@${report.upstreamVersion}\``);
  lines.push(`- Período atual: **${report.periods.current.start} → ${report.periods.current.end}**`);
  lines.push(`- Comparação: **${report.periods.previous.start} → ${report.periods.previous.end}**`);
  lines.push('- Modo: **read-only / sem escrita em Issues / sem alteração do site**');
  lines.push('');

  if (report.errors.length) {
    lines.push('## Erros de fonte');
    lines.push('');
    for (const error of report.errors) lines.push(`- ${mdEscape(error.source)}: ${mdEscape(error.message)}`);
    lines.push('');
  }

  lines.push('## Cobertura');
  lines.push('');
  lines.push(`- Google query/page rows: ${report.coverage.googleRows}`);
  lines.push(`- Bing query/page rows: ${report.coverage.bingRows}`);
  lines.push(`- GA4 organic landing pages: ${report.coverage.ga4LandingPages}`);
  lines.push(`- GA4 referral rows: ${report.coverage.ga4ReferralRows}`);
  lines.push('');

  lines.push('## Top oportunidades');
  lines.push('');
  if (!report.opportunities.length) {
    lines.push('Nenhuma oportunidade atingiu os thresholds canônicos nesta janela.');
  } else {
    lines.push('| # | Engine | Cluster | Query/Página | Evidência | Impacto | Confiança | Ação |');
    lines.push('|---:|---|---|---|---|---|---|---|');
    report.opportunities.forEach((item, index) => {
      const evidence = [
        `cliques ${item.current?.clicks ?? 0}`,
        `imp. ${Math.round(item.current?.impressions ?? 0)}`,
        `CTR ${formatPct(item.current?.ctr ?? 0)}`,
        `pos. ${Number(item.current?.position ?? 0).toFixed(1)}`,
        item.signals.join(', '),
      ].join('; ');
      const queryPage = item.query ? `\`${item.query}\` → ${item.page || '—'}` : item.page;
      lines.push(`| ${index + 1} | ${mdEscape(item.engine)} | ${mdEscape(item.cluster)} | ${mdEscape(queryPage)} | ${mdEscape(evidence)} | ${item.impact} | ${item.confidence} | ${mdEscape(item.recommendedAction)} |`);
    });
  }
  lines.push('');

  lines.push('## Sinais de referrals de assistentes de IA');
  lines.push('');
  if (!report.aiReferrals.length) {
    lines.push('Nenhum referral identificável de assistente de IA apareceu no período. Isso não prova ausência de uso/citação por IA.');
  } else {
    for (const row of report.aiReferrals) {
      lines.push(`- ${mdEscape(row.sessionSource)} / ${mdEscape(row.sessionMedium)} → ${mdEscape(row.landingPage || '(not set)')} — ${row.sessions} sessões; ${row.conversions} conversões; engajamento ${formatPct(row.engagementRate)}`);
    }
  }
  lines.push('');
  lines.push('> AI query heuristic do upstream não é usado nesta V1: o classificador auditado é predominantemente em inglês e seria inadequado para priorização PT-BR sem adaptação própria.');
  lines.push('');
  lines.push('> Guardrail: este relatório é diagnóstico. Não publica conteúdo, não altera a landing, não submete sitemap/IndexNow e não cria tráfego artificial.');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const config = JSON.parse(await fs.readFile('seo-ops.config.json', 'utf8'));
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const bingKey = process.env.BING_API_KEY;
  if (!credentialsPath) throw new Error('GOOGLE_APPLICATION_CREDENTIALS não definido.');
  if (!bingKey) throw new Error('BING_API_KEY não definido.');

  const missingClusters = config.topicClusters.filter((cluster) => !CLUSTER_PATTERNS[cluster]);
  if (missingClusters.length) throw new Error(`Clusters sem matcher: ${missingClusters.join(', ')}`);

  const [{ updateAccount }, gsc, bing, ga4, ga4Utils] = await Promise.all([
    import('search-console-mcp/dist/common/auth/config.js'),
    import('search-console-mcp/dist/google/tools/analytics.js'),
    import('search-console-mcp/dist/bing/tools/analytics.js'),
    import('search-console-mcp/dist/ga4/tools/analytics.js'),
    import('search-console-mcp/dist/ga4/utils.js'),
  ]);

  await updateAccount({
    id: 'brewcontrol_ga4_dry_run',
    engine: 'ga4',
    alias: 'BrewControl GA4 dry-run',
    ga4PropertyId: GA4_PROPERTY_ID,
    websites: [GA4_PROPERTY_ID],
    serviceAccountPath: credentialsPath,
  });

  const periods = periodWindows();
  const errors = [];
  const safe = async (source, fn, fallback) => {
    try {
      return await fn();
    } catch (error) {
      errors.push({ source, message: error instanceof Error ? error.message : String(error) });
      return fallback;
    }
  };

  const [gCurrentRaw, gPreviousRaw, bingAllRaw, ga4Landing, ga4ReferralResponse] = await Promise.all([
    safe('Google Search Console atual', () => gsc.queryAnalytics({
      siteUrl: config.siteUrl,
      startDate: periods.current.start,
      endDate: periods.current.end,
      dimensions: ['query', 'page'],
      dataState: 'final',
      rowLimit: 25000,
    }), []),
    safe('Google Search Console anterior', () => gsc.queryAnalytics({
      siteUrl: config.siteUrl,
      startDate: periods.previous.start,
      endDate: periods.previous.end,
      dimensions: ['query', 'page'],
      dataState: 'final',
      rowLimit: 25000,
    }), []),
    safe('Bing Webmaster Tools', () => bing.getQueryPageStats(config.siteUrl), []),
    safe('GA4 organic landing pages', () => ga4.getOrganicLandingPages(
      GA4_PROPERTY_ID,
      periods.current.start,
      periods.current.end,
      5000,
      'brewcontrol_ga4_dry_run',
    ), []),
    safe('GA4 AI referral dimensions', () => ga4.queryAnalytics({
      propertyId: GA4_PROPERTY_ID,
      accountId: 'brewcontrol_ga4_dry_run',
      startDate: periods.current.start,
      endDate: periods.current.end,
      dimensions: ['sessionSource', 'sessionMedium', 'landingPagePlusQueryString'],
      metrics: ['sessions', 'conversions', 'engagementRate'],
      limit: 5000,
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    }), null),
  ]);

  const googleCurrent = normalizeGoogleRows(gCurrentRaw);
  const googlePrevious = normalizeGoogleRows(gPreviousRaw);
  const bingCurrent = aggregateBing(bingAllRaw, periods.current);
  const bingPrevious = aggregateBing(bingAllRaw, periods.previous);

  const candidates = new Map([
    ...buildCandidates({ engine: 'Google', currentRows: googleCurrent, previousRows: googlePrevious, config, topicClusters: config.topicClusters }),
    ...buildCandidates({ engine: 'Bing', currentRows: bingCurrent, previousRows: bingPrevious, config, topicClusters: config.topicClusters }),
  ]);

  addPageDecayCandidates(candidates, 'Google', googleCurrent, googlePrevious, config, config.topicClusters);
  addPageDecayCandidates(candidates, 'Bing', bingCurrent, bingPrevious, config, config.topicClusters);
  addGa4Signals(candidates, googleCurrent, mapGa4Rows(ga4Landing), config);

  const opportunities = [...candidates.values()]
    .map((candidate) => ({
      ...candidate,
      score: Number(candidate.score.toFixed(2)),
      impact: impactForScore(candidate.score),
      confidence: confidenceFor(candidate, config.dataThresholds.minimumImpressionsToAct),
      recommendedAction: actionFor(candidate),
      period: periods.current,
    }))
    .filter((candidate) => candidate.signals.length > 0)
    .sort((a, b) => b.score - a.score || (b.current?.impressions || 0) - (a.current?.impressions || 0))
    .slice(0, 5);

  const ga4ReferralRows = ga4ReferralResponse ? ga4Utils.formatRows(ga4ReferralResponse) : [];
  const aiReferrals = ga4ReferralRows
    .filter((row) => isAiReferralSource(row.sessionSource))
    .map((row) => ({
      sessionSource: row.sessionSource,
      sessionMedium: row.sessionMedium,
      landingPage: row.landingPagePlusQueryString,
      sessions: Number(row.sessions || 0),
      conversions: Number(row.conversions || 0),
      engagementRate: Number(row.engagementRate || 0),
    }))
    .sort((a, b) => b.sessions - a.sessions);

  const report = {
    generatedAt: new Date().toISOString(),
    status: errors.length ? 'PARTIAL' : 'PASS',
    mode: 'dry-run-read-only',
    upstreamVersion: UPSTREAM_VERSION,
    siteUrl: config.siteUrl,
    ga4PropertyId: GA4_PROPERTY_ID,
    periods,
    thresholds: config.dataThresholds,
    topicClusters: config.topicClusters,
    coverage: {
      googleRows: googleCurrent.length,
      bingRows: bingCurrent.length,
      ga4LandingPages: Array.isArray(ga4Landing) ? ga4Landing.length : 0,
      ga4ReferralRows: ga4ReferralRows.length,
    },
    aiReferrals,
    opportunities,
    errors,
    guardrails: {
      issueWrite: false,
      siteMutation: false,
      sitemapSubmission: false,
      indexingSubmission: false,
      artificialTraffic: false,
    },
  };

  await fs.writeFile(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await fs.writeFile(REPORT_MD, buildMarkdown(report), 'utf8');

  console.log(buildMarkdown(report));
  if (errors.length) process.exitCode = 2;
}

main().catch(async (error) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(message);
  const failure = {
    generatedAt: new Date().toISOString(),
    status: 'FAIL',
    mode: 'dry-run-read-only',
    upstreamVersion: UPSTREAM_VERSION,
    error: String(error?.message || error),
  };
  await fs.writeFile(REPORT_JSON, `${JSON.stringify(failure, null, 2)}\n`, 'utf8').catch(() => {});
  await fs.writeFile(REPORT_MD, `# SEO Opportunity DRY RUN\n\nStatus: **FAIL**\n\n${failure.error}\n`, 'utf8').catch(() => {});
  process.exitCode = 1;
});
