// views.js — NusaStat pages, routing and controls.
// Hash router: #/ (Overview), #/population, #/economy, #/people, #/regions, #/data.
// Every control on every page does what it says: filters, sorts, downloads.

import { YEARS, SERIES, SECTORS_2024, AGE_2024, PROVINCES, ISLANDS, HEADLINES_2024, RELEASES, SOURCES, METHOD_NOTE } from './data.js';
import { lineChart, barChart, donutChart, hbarChart, PALETTE } from './charts.js';

const app = document.getElementById('app');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function num(v, d = 1) {
  return Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

function sourceLine(text) {
  return `<p class="source">Source: ${esc(text)}</p>`;
}

function kpiCard(h) {
  return `<div class="kpi"><div class="kpi-value">${esc(h.value)}</div><div class="kpi-label">${esc(h.label)}</div><div class="kpi-note">${esc(h.note)}</div></div>`;
}

function chartCard(title, sub, chartNode, controlsHtml = '') {
  const wrap = document.createElement('section');
  wrap.className = 'card chart-card';
  wrap.innerHTML = `<h2>${esc(title)}</h2><p class="card-sub">${esc(sub)}</p>${controlsHtml}<div class="chart"></div>`;
  wrap.querySelector('.chart').appendChild(chartNode);
  return wrap;
}

function downloadCSV(filename, header, rows) {
  const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function seriesTable(key) {
  const s = SERIES[key];
  const rows = YEARS.map((y, i) => `<tr><td>${y}</td><td class="num">${num(s.values[i], 2)}</td></tr>`).join('');
  return `<table class="data-table"><thead><tr><th>Year</th><th>${esc(s.label)} (${esc(s.unit)})</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function sliceYears(fromYear) {
  const i = YEARS.indexOf(fromYear);
  return { years: YEARS.slice(i), idx: i };
}

// ---------- Overview ----------
function viewOverview() {
  const pop = SERIES.population;
  const gdp = SERIES.gdpGrowth;
  const state = { from: 2015, gdpType: 'bar' };
  const root = document.createElement('div');
  root.innerHTML = `
    <section class="hero">
      <p class="eyebrow">Indonesia · Official statistics, made readable</p>
      <h1>Indonesia in Numbers</h1>
      <p class="lede">Population, economy, people and regions — the figures that describe
      281.6 million people across 38 provinces, with every number traced to its source and year.</p>
      <p class="hero-links"><a class="btn" href="#/economy">Explore the economy →</a>
      <a class="btn btn-ghost" href="#/data">Download the data ↓</a></p>
    </section>
    <section class="kpi-grid">${HEADLINES_2024.slice(0, 6).map(kpiCard).join('')}</section>
    <div class="grid-2" id="ov-charts"></div>
    <section class="card">
      <h2>Latest releases</h2>
      <ul class="releases">${RELEASES.map((r) => `<li><span class="rel-date">${esc(r.date)}</span><strong>${esc(r.title)}</strong><span>${esc(r.body)}</span></li>`).join('')}</ul>
    </section>
    <section class="card">
      <h2>Five largest provinces</h2>
      <p class="card-sub">Share of the 281.6 million people counted in 2024 — Java alone holds 55.9%.</p>
      <table class="data-table"><thead><tr><th>Province</th><th>Island</th><th class="num">Population (m)</th><th class="num">Share</th></tr></thead>
      <tbody>${[...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5).map((p) => `<tr><td><a href="#/regions">${esc(p.name)}</a></td><td>${esc(p.island)}</td><td class="num">${num(p.pop)}</td><td class="num">${num((p.pop / 281.6) * 100)}%</td></tr>`).join('')}</tbody></table>
      <p><a href="#/regions">See all 38 provinces →</a></p>
    </section>`;
  const charts = root.querySelector('#ov-charts');
  function renderCharts() {
    charts.innerHTML = '';
    const { years, idx } = sliceYears(state.from);
    const popCard = chartCard(
      'Population, 2015–2024',
      'Steady growth of about 1% a year. 2020 is the census year.',
      lineChart({ years, values: pop.values.slice(idx), unit: 'million', color: '#0e4f4a' }),
      `<label class="ctl">From <select id="ov-from">${[2015, 2018, 2020].map((y) => `<option value="${y}"${y === state.from ? ' selected' : ''}>${y}</option>`).join('')}</select></label>`,
    );
    popCard.querySelector('#ov-from').addEventListener('change', (e) => { state.from = Number(e.target.value); renderCharts(); });
    const gdpCard = chartCard(
      'Real GDP growth, 2015–2024',
      'The 2020 pandemic contraction, then a return to ~5% growth.',
      state.gdpType === 'bar'
        ? barChart({ years, values: gdp.values.slice(idx), unit: '%', color: '#0e4f4a' })
        : lineChart({ years, values: gdp.values.slice(idx), unit: '%', color: '#b4452f', fill: 'rgba(180,69,47,0.08)' }),
      `<label class="ctl">Chart <select id="ov-gdp-type"><option value="bar"${state.gdpType === 'bar' ? ' selected' : ''}>Bars</option><option value="line"${state.gdpType === 'line' ? ' selected' : ''}>Line</option></select></label>`,
    );
    gdpCard.querySelector('#ov-gdp-type').addEventListener('change', (e) => { state.gdpType = e.target.value; renderCharts(); });
    charts.append(popCard, gdpCard);
  }
  renderCharts();
  root.insertAdjacentHTML('beforeend', sourceLine('BPS — population, GDP growth; figures for 2024.'));
  return root;
}

// ---------- Population ----------
function viewPopulation() {
  const root = document.createElement('div');
  root.innerHTML = `
    <section class="page-head"><h1>Population</h1>
    <p class="lede">281.6 million people in 2024 — the world's fourth-largest population, still young: a median age near 31 and 68.3% of working age.</p></section>
    <section class="kpi-grid">${[HEADLINES_2024[0], { value: '68.3%', label: 'Working age (15–64)', note: 'BPS, 2024 — the demographic dividend' }, { value: '24.9%', label: 'Children (0–14)', note: 'BPS, 2024' }, { value: '6.8%', label: 'Aged 65+', note: 'BPS, 2024 — rising slowly' }, { value: '16,083', label: 'People per km² in Jakarta', note: 'BPS, 2024 — densest province' }, { value: '3.4', label: 'People per km² in Papua', note: 'BPS, 2024 — least dense province' }].map(kpiCard).join('')}</section>
    <div class="grid-2" id="pop-charts"></div>
    <section class="card"><h2>Population by year</h2>${seriesTable('population')}${sourceLine(SERIES.population.source)}</section>`;
  const charts = root.querySelector('#pop-charts');
  charts.append(
    chartCard('Population, 2015–2024', 'Million people, mid-year estimates.',
      lineChart({ years: YEARS, values: SERIES.population.values, unit: 'million' })),
    chartCard('Who lives here, 2024', 'Age structure as a share of the population.',
      hbarChart({ items: AGE_2024.map((a) => ({ name: a.group, value: a.share })), valueFmt: (v) => `${v.toFixed(1)}%`, color: '#e8a317' })),
  );
  return root;
}

// ---------- Economy ----------
function viewEconomy() {
  const state = { type: 'bar', from: 2015 };
  const root = document.createElement('div');
  root.innerHTML = `
    <section class="page-head"><h1>Economy</h1>
    <p class="lede">A US$1.40 trillion economy growing at 5.03% in 2024, with inflation down to 1.57% and a US$31.0 billion goods surplus.</p></section>
    <section class="kpi-grid">${[HEADLINES_2024[1], HEADLINES_2024[2], HEADLINES_2024[3], HEADLINES_2024[4], { value: 'US$264.7bn', label: 'Exports of goods', note: 'BPS, 2024' }, { value: 'US$155.7bn', label: 'Foreign reserves', note: 'Bank Indonesia, Dec 2024' }].map(kpiCard).join('')}</section>
    <div class="grid-2" id="ec-charts"></div>
    <div class="grid-2" id="ec-charts2"></div>
    <section class="card"><h2>GDP by year</h2>${seriesTable('gdpGrowth')}${sourceLine(SERIES.gdpGrowth.source)}</section>`;
  const charts = root.querySelector('#ec-charts');
  const charts2 = root.querySelector('#ec-charts2');
  function render() {
    charts.innerHTML = '';
    charts2.innerHTML = '';
    const { years, idx } = sliceYears(state.from);
    const gdpCard = chartCard(
      'Real GDP growth, 2015–2024', 'Percent per year, constant prices.',
      state.type === 'bar'
        ? barChart({ years, values: SERIES.gdpGrowth.values.slice(idx), unit: '%' })
        : lineChart({ years, values: SERIES.gdpGrowth.values.slice(idx), unit: '%', color: '#0e4f4a' }),
      `<label class="ctl">Chart <select id="ec-type"><option value="bar"${state.type === 'bar' ? ' selected' : ''}>Bars</option><option value="line"${state.type === 'line' ? ' selected' : ''}>Line</option></select></label>
       <label class="ctl">From <select id="ec-from">${[2015, 2018, 2020].map((y) => `<option value="${y}"${y === state.from ? ' selected' : ''}>${y}</option>`).join('')}</select></label>`,
    );
    gdpCard.querySelector('#ec-type').addEventListener('change', (e) => { state.type = e.target.value; render(); });
    gdpCard.querySelector('#ec-from').addEventListener('change', (e) => { state.from = Number(e.target.value); render(); });
    const donut = donutChart({ items: SECTORS_2024, colors: PALETTE });
    const sectorCard = document.createElement('section');
    sectorCard.className = 'card chart-card';
    sectorCard.innerHTML = '<h2>What makes the economy, 2024</h2><p class="card-sub">Share of nominal GDP by sector.</p><div class="donut-wrap"></div><ul class="legend"></ul>';
    sectorCard.querySelector('.donut-wrap').appendChild(donut);
    sectorCard.querySelector('.legend').innerHTML = SECTORS_2024.map((s, i) =>
      `<li><span class="swatch" style="background:${PALETTE[i % PALETTE.length]}"></span>${esc(s.name)}<strong>${s.share}%</strong></li>`).join('');
    charts.append(gdpCard, sectorCard);
    charts2.append(
      chartCard('Inflation, 2015–2024', 'Consumer prices, December year-on-year, %.',
        lineChart({ years: YEARS, values: SERIES.inflation.values, unit: '%', color: '#b4452f', fill: 'rgba(180,69,47,0.08)' })),
      chartCard('Trade in goods, 2015–2024', 'Exports minus imports: a US$31.0bn surplus in 2024.',
        barChart({ years: YEARS, values: YEARS.map((_, i) => +(SERIES.exports.values[i] - SERIES.imports.values[i]).toFixed(1)), unit: 'US$ bn', color: '#3a7d7a' })),
    );
  }
  render();
  return root;
}

// ---------- People ----------
function viewPeople() {
  const root = document.createElement('div');
  root.innerHTML = `
    <section class="page-head"><h1>People</h1>
    <p class="lede">Health, schooling and work: life expectancy 74.2 years, HDI 75.02, and the lowest unemployment rate in a generation.</p></section>
    <section class="kpi-grid">${[HEADLINES_2024[7], HEADLINES_2024[5], HEADLINES_2024[6], { value: '74.2 yrs', label: 'Life expectancy', note: 'BPS, 2024' }, { value: '8.93 yrs', label: 'Mean years of schooling', note: 'BPS, 2024' }, { value: '96.6%', label: 'Literacy, age 15+', note: 'BPS, 2024' }].map(kpiCard).join('')}</section>
    <div class="grid-2" id="pe-charts"></div>
    <section class="card"><h2>Human Development Index by province, 2024</h2>
    <p class="card-sub">Jakarta leads at 82.9; Highland Papua trails at 59.5. The national index is 75.02.</p>
    <div id="pe-hdi"></div>${sourceLine('BPS, 2024 — rounded to one decimal.')}</section>`;
  const charts = root.querySelector('#pe-charts');
  charts.append(
    chartCard('Human Development Index, 2015–2024', 'Index 0–100; above 70 is high human development.',
      lineChart({ years: YEARS, values: SERIES.hdi.values, color: '#0e4f4a' })),
    chartCard('Unemployment, 2015–2024', '% of the labour force, August survey.',
      barChart({ years: YEARS, values: SERIES.unemployment.values, unit: '%', color: '#4a6fa5' })),
  );
  const top = [...PROVINCES].sort((a, b) => b.hdi - a.hdi).slice(0, 10);
  root.querySelector('#pe-hdi').appendChild(
    hbarChart({ items: top.map((p) => ({ name: p.name, value: p.hdi })), valueFmt: (v) => v.toFixed(1), color: '#0e4f4a' }),
  );
  return root;
}

// ---------- Regions ----------
function viewRegions() {
  const state = { island: 'All islands', q: '', sort: 'pop', dir: -1, selected: null };
  const root = document.createElement('div');
  root.innerHTML = `
    <section class="page-head"><h1>Regions</h1>
    <p class="lede">38 provinces, from 48.9 million people in West Java to 0.5 million in South Papua.
    Sort the table, filter by island, or tap a province to see it against the national average.</p></section>
    <section class="card">
      <div class="region-controls">
        <label class="ctl">Island <select id="rg-island">${ISLANDS.map((i) => `<option>${esc(i)}</option>`).join('')}</select></label>
        <label class="ctl">Search <input id="rg-q" type="search" placeholder="Type a province name…" aria-label="Search provinces"></label>
      </div>
      <div class="table-wrap"><table class="data-table sortable" id="rg-table">
        <thead><tr>
          <th data-k="name">Province ↕</th><th data-k="island">Island ↕</th>
          <th data-k="pop" class="num">Population (m) ↕</th><th data-k="share" class="num">Share ↕</th>
          <th data-k="density" class="num">People / km² ↕</th><th data-k="hdi" class="num">HDI ↕</th>
        </tr></thead><tbody></tbody>
      </table></div>
      <p class="source">Source: BPS, mid-year 2024 estimates (population, rounded); HDI 2024, rounded. Density is population ÷ land area. Click a column heading to sort; click a row for detail.</p>
      <div id="rg-detail" class="detail" hidden></div>
    </section>`;
  const tbody = root.querySelector('#rg-table tbody');
  const detail = root.querySelector('#rg-detail');
  function density(p) { return (p.pop * 1e6) / p.area; }
  function rows() {
    let list = PROVINCES.map((p) => ({ ...p, share: (p.pop / 281.6) * 100, density: density(p) }));
    if (state.island !== 'All islands') list = list.filter((p) => p.island === state.island);
    if (state.q) list = list.filter((p) => p.name.toLowerCase().includes(state.q.toLowerCase()));
    list.sort((a, b) => {
      const k = state.sort;
      const d = typeof a[k] === 'string' ? a[k].localeCompare(b[k]) : a[k] - b[k];
      return d * state.dir;
    });
    return list;
  }
  function render() {
    const list = rows();
    tbody.innerHTML = list.length ? list.map((p) => `<tr data-name="${esc(p.name)}"><td>${esc(p.name)}</td><td>${esc(p.island)}</td><td class="num">${num(p.pop)}</td><td class="num">${num(p.share)}%</td><td class="num">${num(density(p), 0)}</td><td class="num">${p.hdi.toFixed(1)}</td></tr>`).join('')
      : '<tr><td colspan="6">No province matches that search.</td></tr>';
    tbody.querySelectorAll('tr[data-name]').forEach((tr) => tr.addEventListener('click', () => showDetail(tr.dataset.name)));
    if (state.selected) showDetail(state.selected, true);
  }
  function showDetail(name, keep = false) {
    const p = PROVINCES.find((x) => x.name === name);
    if (!p) return;
    state.selected = name;
    const d = density(p);
    detail.hidden = false;
    detail.innerHTML = `
      <h3>${esc(p.name)} — ${esc(p.island)}</h3>
      <div class="detail-grid">
        <div><strong>${num(p.pop)}m</strong><span>people (2024)</span></div>
        <div><strong>${num((p.pop / 281.6) * 100)}%</strong><span>of Indonesia</span></div>
        <div><strong>${num(d, 0)} / km²</strong><span>density (national: 147)</span></div>
        <div><strong>${p.hdi.toFixed(1)}</strong><span>HDI 2024 (national: 75.0)</span></div>
        <div><strong>${num(p.area, 0)} km²</strong><span>land area</span></div>
        <div><strong>${p.hdi >= 75 ? 'Above' : 'Below'}</strong><span>national HDI</span></div>
      </div>
      <p>${esc(p.name)} holds ${num((p.pop / 281.6) * 100)}% of the country's people on ${num(p.area, 0)} km² — ${d > 147 ? 'denser' : 'less dense'} than the national average of 147 people per km², with human development ${p.hdi >= 75 ? 'above' : 'below'} the national index of 75.02.</p>
      <button class="btn btn-ghost" id="rg-close">Close detail</button>`;
    detail.querySelector('#rg-close').addEventListener('click', () => { detail.hidden = true; state.selected = null; });
    if (!keep) detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  root.querySelector('#rg-island').addEventListener('change', (e) => { state.island = e.target.value; render(); });
  root.querySelector('#rg-q').addEventListener('input', (e) => { state.q = e.target.value; render(); });
  root.querySelectorAll('#rg-table th[data-k]').forEach((th) => th.addEventListener('click', () => {
    const k = th.dataset.k;
    if (state.sort === k) state.dir *= -1; else { state.sort = k; state.dir = k === 'name' || k === 'island' ? 1 : -1; }
    render();
  }));
  render();
  return root;
}

// ---------- Data & sources ----------
function viewData() {
  const root = document.createElement('div');
  root.innerHTML = `
    <section class="page-head"><h1>Data &amp; sources</h1>
    <p class="lede">Every series behind this site, ready to download as CSV. Each figure carries its source and year — check it, reuse it, cite it.</p></section>
    <section class="card"><h2>Download the data</h2>
    <p class="card-sub">One CSV per series, 2015–2024. The files are generated in your browser from the numbers on this page — no server, no sign-in.</p>
    <div class="dl-grid" id="dl-grid"></div></section>
    <section class="card"><h2>Provinces, 2024</h2>
    <p class="card-sub">All 38 provinces: population, land area, density and HDI.</p>
    <div class="table-wrap"><table class="data-table"><thead><tr><th>Province</th><th>Island</th><th class="num">Population (m)</th><th class="num">Area (km²)</th><th class="num">People / km²</th><th class="num">HDI</th></tr></thead>
    <tbody>${PROVINCES.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.island)}</td><td class="num">${num(p.pop)}</td><td class="num">${num(p.area, 0)}</td><td class="num">${num((p.pop * 1e6) / p.area, 0)}</td><td class="num">${p.hdi.toFixed(1)}</td></tr>`).join('')}</tbody></table></div>
    <p><button class="btn" id="dl-prov">Download provinces (CSV)</button></p></section>
    <section class="card"><h2>Sources</h2>
    <ul class="sources">${SOURCES.map((s) => `<li><strong>${esc(s.name)}</strong> — ${esc(s.what)}<span>${esc(s.note)}</span></li>`).join('')}</ul>
    <h2>Method &amp; notes</h2><p>${esc(METHOD_NOTE)}</p>
    <p class="source">NusaStat is an independent demonstration portal. It is not an official publication of Statistics Indonesia (BPS) or the Government of Indonesia.</p></section>`;
  const grid = root.querySelector('#dl-grid');
  Object.entries(SERIES).forEach(([key, s]) => {
    const b = document.createElement('button');
    b.className = 'btn dl-btn';
    b.textContent = `${s.label} (CSV)`;
    b.addEventListener('click', () => downloadCSV(`nusastat-${key}-2015-2024.csv`, ['Year', `${s.label} (${s.unit})`, 'Source'], YEARS.map((y, i) => [y, s.values[i], s.source])));
    grid.appendChild(b);
  });
  root.querySelector('#dl-prov').addEventListener('click', () => downloadCSV('nusastat-provinces-2024.csv',
    ['Province', 'Island', 'Population (million)', 'Area (km2)', 'HDI 2024', 'Source'],
    PROVINCES.map((p) => [p.name, p.island, p.pop, p.area, p.hdi, 'BPS 2024'])));
  return root;
}

// ---------- Router ----------
const ROUTES = {
  '': { title: 'Overview', view: viewOverview },
  population: { title: 'Population', view: viewPopulation },
  economy: { title: 'Economy', view: viewEconomy },
  people: { title: 'People', view: viewPeople },
  regions: { title: 'Regions', view: viewRegions },
  data: { title: 'Data & sources', view: viewData },
};

export function render() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  const route = ROUTES[hash] || ROUTES[''];
  document.querySelectorAll('nav a').forEach((a) => {
    const key = a.getAttribute('href').replace(/^#\/?/, '');
    a.classList.toggle('active', key === hash || (key === '' && hash === ''));
    if (key === hash || (key === '' && hash === '')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.title = `${route.title} — NusaStat · Indonesia in Numbers`;
  app.innerHTML = '';
  app.appendChild(route.view());
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
