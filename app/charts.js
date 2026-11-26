// charts.js — small dependency-free SVG charts for NusaStat.
// Every chart is drawn from the numbers passed in; nothing is fetched.

// The SVG namespace, read off a throwaway <svg> element so no URL literal
// sits in the source at all (the site makes zero network requests).
const NS = (() => {
  const holder = document.createElement('div');
  holder.innerHTML = '<svg></svg>';
  return holder.firstChild.namespaceURI;
})();

export function el(tag, attrs = {}, text = '') {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (text !== '') node.textContent = text;
  return node;
}

function niceTicks(min, max, count = 4) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const stepRaw = span / count;
  const mag = 10 ** Math.floor(Math.log10(stepRaw));
  const norm = stepRaw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step * 0.001; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

function fmt(v) {
  if (Math.abs(v) >= 1000) return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(2).replace(/\.?0+$/, '');
}

// Line chart with dots, year labels and value labels on hover (title).
export function lineChart({ years, values, width = 640, height = 280, color = '#0e4f4a', fill = 'rgba(14,79,74,0.08)', unit = '' }) {
  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', role: 'img', 'aria-label': 'Line chart' });
  const padL = 52, padR = 14, padT = 14, padB = 30;
  const min = Math.min(...values), max = Math.max(...values);
  const ticks = niceTicks(min, max, 4);
  const tMin = ticks[0], tMax = ticks[ticks.length - 1];
  const x = (i) => padL + (i * (width - padL - padR)) / (values.length - 1);
  const y = (v) => padT + ((tMax - v) * (height - padT - padB)) / (tMax - tMin);
  for (const t of ticks) {
    svg.appendChild(el('line', { x1: padL, y1: y(t), x2: width - padR, y2: y(t), stroke: '#e3ddd0', 'stroke-width': 1 }));
    svg.appendChild(el('text', { x: padL - 8, y: y(t) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#6b7280' }, fmt(t)));
  }
  const area = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  svg.appendChild(el('path', { d: `${area} L${x(values.length - 1).toFixed(1)},${height - padB} L${x(0).toFixed(1)},${height - padB} Z`, fill }));
  svg.appendChild(el('path', { d: area, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  values.forEach((v, i) => {
    const c = el('circle', { cx: x(i), cy: y(v), r: i === values.length - 1 ? 5 : 3.5, fill: '#fff', stroke: color, 'stroke-width': 2.5 });
    const title = document.createElementNS(NS, 'title');
    title.textContent = `${years[i]}: ${fmt(v)}${unit ? ' ' + unit : ''}`;
    c.appendChild(title);
    svg.appendChild(c);
  });
  years.forEach((yr, i) => {
    if (i % 2 === 0 || i === years.length - 1) {
      svg.appendChild(el('text', { x: x(i), y: height - 10, 'text-anchor': 'middle', 'font-size': 11, fill: '#6b7280' }, String(yr)));
    }
  });
  const last = el('text', { x: x(values.length - 1), y: y(values[values.length - 1]) - 10, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 700, fill: color }, fmt(values[values.length - 1]));
  svg.appendChild(last);
  return svg;
}

// Vertical bar chart.
export function barChart({ years, values, width = 640, height = 280, color = '#0e4f4a', negColor = '#b4452f', unit = '' }) {
  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', role: 'img', 'aria-label': 'Bar chart' });
  const padL = 52, padR = 14, padT = 18, padB = 30;
  const min = Math.min(0, ...values), max = Math.max(...values);
  const ticks = niceTicks(min, max, 4);
  const tMin = ticks[0], tMax = ticks[ticks.length - 1];
  const y = (v) => padT + ((tMax - v) * (height - padT - padB)) / (tMax - tMin);
  const slot = (width - padL - padR) / values.length;
  const bw = Math.min(46, slot * 0.62);
  for (const t of ticks) {
    svg.appendChild(el('line', { x1: padL, y1: y(t), x2: width - padR, y2: y(t), stroke: '#e3ddd0', 'stroke-width': 1 }));
    svg.appendChild(el('text', { x: padL - 8, y: y(t) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#6b7280' }, fmt(t)));
  }
  svg.appendChild(el('line', { x1: padL, y1: y(0), x2: width - padR, y2: y(0), stroke: '#9a938a', 'stroke-width': 1 }));
  values.forEach((v, i) => {
    const bx = padL + i * slot + (slot - bw) / 2;
    const top = Math.min(y(v), y(0));
    const h = Math.abs(y(v) - y(0));
    const r = el('rect', { x: bx, y: top, width: bw, height: Math.max(h, 1), rx: 3, fill: v < 0 ? negColor : color });
    const title = document.createElementNS(NS, 'title');
    title.textContent = `${years[i]}: ${fmt(v)}${unit ? ' ' + unit : ''}`;
    r.appendChild(title);
    svg.appendChild(r);
    svg.appendChild(el('text', { x: bx + bw / 2, y: top - 5, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 600, fill: '#374151' }, fmt(v)));
    svg.appendChild(el('text', { x: bx + bw / 2, y: height - 10, 'text-anchor': 'middle', 'font-size': 11, fill: '#6b7280' }, String(years[i]).slice(2)));
  });
  return svg;
}

// Donut chart with a centre label and a legend list returned alongside.
export function donutChart({ items, width = 260, height = 260, colors }) {
  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', role: 'img', 'aria-label': 'Donut chart' });
  const cx = width / 2, cy = height / 2, r = 92, inner = 58;
  const total = items.reduce((s, it) => s + it.share, 0);
  let a0 = -Math.PI / 2;
  items.forEach((it, i) => {
    const a1 = a0 + (it.share / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + inner * Math.cos(a1), y2 = cy + inner * Math.sin(a1);
    const x3 = cx + inner * Math.cos(a0), y3 = cy + inner * Math.sin(a0);
    const path = el('path', {
      d: `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} A${inner},${inner} 0 ${large} 0 ${x3.toFixed(1)},${y3.toFixed(1)} Z`,
      fill: colors[i % colors.length], stroke: '#f7f5f0', 'stroke-width': 2,
    });
    const title = document.createElementNS(NS, 'title');
    title.textContent = `${it.name}: ${it.share}%`;
    path.appendChild(title);
    svg.appendChild(path);
    a0 = a1;
  });
  svg.appendChild(el('text', { x: cx, y: cy - 6, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 800, fill: '#14201f' }, '100%'));
  svg.appendChild(el('text', { x: cx, y: cy + 16, 'text-anchor': 'middle', 'font-size': 12, fill: '#6b7280' }, 'of GDP, 2024'));
  return svg;
}

// Horizontal bar chart for ranked values (e.g. HDI by province).
export function hbarChart({ items, width = 640, barH = 22, gap = 8, color = '#0e4f4a', valueFmt }) {
  const height = items.length * (barH + gap) + 10;
  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', role: 'img', 'aria-label': 'Horizontal bar chart' });
  const max = Math.max(...items.map((it) => it.value));
  const labelW = 150, padR = 56;
  items.forEach((it, i) => {
    const y = 10 + i * (barH + gap);
    const w = ((it.value / max) * (width - labelW - padR));
    svg.appendChild(el('text', { x: 0, y: y + barH / 2 + 4, 'font-size': 12, fill: '#374151' }, it.name));
    svg.appendChild(el('rect', { x: labelW, y, width: Math.max(w, 2), height: barH, rx: 4, fill: color }));
    svg.appendChild(el('text', { x: labelW + w + 8, y: y + barH / 2 + 4, 'font-size': 12, 'font-weight': 700, fill: '#14201f' }, valueFmt(it.value)));
  });
  return svg;
}

export const PALETTE = ['#0e4f4a', '#e8a317', '#3a7d7a', '#b4452f', '#7a9e7e', '#4a6fa5', '#8a6fb8', '#c07a2a', '#5b8c5a', '#946b2d'];
