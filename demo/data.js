// Dữ liệu giả lập dùng chung cho bản demo web và app.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function fmt(n, d) {
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

const MARKETS = [
  ['BTC', '67,482.15', 1.94], ['ETH', '2,618.42', 2.71], ['BNB', '584.30', -0.42],
  ['SOL', '152.87', 4.38], ['XRP', '0.5312', -1.12], ['ADA', '0.3644', 0.86],
  ['DOGE', '0.1186', 6.03], ['TON', '5.214', -2.35], ['AVAX', '27.61', 1.27],
  ['LINK', '11.48', 3.12], ['DOT', '4.312', -0.77], ['MATIC', '0.3921', 0.44],
  ['NEAR', '4.87', 5.41], ['ARB', '0.5833', -3.06], ['APT', '9.142', 2.18],
  ['SUI', '1.932', 8.66], ['OP', '1.611', -0.95],
];

// Sinh dữ liệu nến giả định và vẽ vào SVG (nến + khối lượng + MA7/MA25).
function drawCandles(svg, W, H, n, last, theme) {
  const r = rng(42), candles = [];
  let p = last * 0.955;
  for (let i = 0; i < n; i++) {
    const drift = (last - p) / (n - i) ;
    const o = p, c = o + drift + (r() - 0.48) * last * 0.006;
    const h = Math.max(o, c) + r() * last * 0.0028, l = Math.min(o, c) - r() * last * 0.0028;
    candles.push({ o, c, h, l, v: 0.25 + r() ** 1.6 });
    p = c;
  }
  candles[n - 1].c = last;
  const padR = 64, chartH = H * 0.74, volTop = H * 0.79, volH = H * 0.18;
  const hi = Math.max(...candles.map(c => c.h)), lo = Math.min(...candles.map(c => c.l));
  const y = v => 10 + (hi - v) / (hi - lo) * (chartH - 20);
  const cw = (W - padR) / n, bw = cw * 0.62;
  const NS = 'http://www.w3.org/2000/svg';
  const add = (tag, attrs, text) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    svg.appendChild(e);
  };
  for (let g = 0; g <= 5; g++) {
    const v = lo + (hi - lo) * g / 5, yy = y(v);
    add('line', { x1: 0, x2: W - padR, y1: yy, y2: yy, stroke: theme.grid, 'stroke-width': 1 });
    if (Math.abs(yy - y(last)) > 14 && yy > 12)
      add('text', { x: W - padR + 6, y: yy + 4, fill: theme.text, 'font-size': 11 }, fmt(v, 0));
  }
  for (let g = 1; g < 6; g++) {
    const xx = (W - padR) * g / 6;
    add('line', { x1: xx, x2: xx, y1: 0, y2: H, stroke: theme.grid, 'stroke-width': 1 });
  }
  const ma = k => candles.map((_, i) => i < k - 1 ? null :
    candles.slice(i - k + 1, i + 1).reduce((a, c) => a + c.c, 0) / k);
  candles.forEach((c, i) => {
    const x = i * cw + cw / 2, up = c.c >= c.o, col = up ? '#16c784' : '#ea3943';
    add('line', { x1: x, x2: x, y1: y(c.h), y2: y(c.l), stroke: col, 'stroke-width': 1 });
    add('rect', { x: x - bw / 2, y: y(Math.max(c.o, c.c)), width: bw, height: Math.max(1, Math.abs(y(c.o) - y(c.c))), fill: col });
    add('rect', { x: x - bw / 2, y: volTop + volH * (1 - c.v / 1.25), width: bw, height: volH * c.v / 1.25, fill: col, opacity: 0.35 });
  });
  [[ma(7), '#f0b90b'], [ma(25), '#a970ff']].forEach(([s, col]) => {
    const pts = s.map((v, i) => v == null ? null : `${i * cw + cw / 2},${y(v)}`).filter(Boolean).join(' ');
    add('polyline', { points: pts, fill: 'none', stroke: col, 'stroke-width': 1.4 });
  });
  const ly = y(last);
  add('line', { x1: 0, x2: W - padR, y1: ly, y2: ly, stroke: '#16c784', 'stroke-dasharray': '3 3', 'stroke-width': 1 });
  add('rect', { x: W - padR + 2, y: ly - 9, width: padR - 4, height: 18, rx: 2, fill: '#16c784' });
  add('text', { x: W - padR + 6, y: ly + 4, fill: '#fff', 'font-size': 11, 'font-weight': 600 }, fmt(last, 0));
}
