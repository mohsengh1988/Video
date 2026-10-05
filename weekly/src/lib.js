const DMF = {};
DMF.rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// ---------- pretzel: one continuous rope, thick belly, arms crossing over it ----------
DMF.PZ = 'M205,372 C215,320 255,262 300,228 C350,190 375,108 445,104 C510,100 552,160 545,228 C540,288 510,330 470,360 C420,398 360,412 300,412 C240,412 180,398 130,360 C90,330 60,288 55,228 C48,160 90,100 155,104 C225,108 250,190 300,228 C345,262 385,320 395,372';
DMF.pretzel = (p = 'pz', seed = 7) => `<svg class="pretzel" data-p="${p}" data-seed="${seed}" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${p}-base" gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="440"><stop offset="0" stop-color="#8f4213"/><stop offset="1" stop-color="#5e2708"/></linearGradient>
    <filter id="${p}-b1"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="${p}-b2"><feGaussianBlur stdDeviation="1.8"/></filter>
    <filter id="${p}-b3"><feGaussianBlur stdDeviation="3.4"/></filter>
    <filter id="${p}-rough" x="-10%" y="-50%" width="120%" height="200%"><feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter>
    <filter id="${p}-sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="16" stdDeviation="13" flood-color="#3b2210" flood-opacity=".38"/></filter>
  </defs>
  <g filter="url(#${p}-sh)"><g class="rope" fill="none" stroke-linejoin="round"></g><g class="salt"></g></g></svg>`;
DMF.buildPretzels = (root = document) => {
  const NS = 'http://www.w3.org/2000/svg';
  root.querySelectorAll('svg.pretzel').forEach(svg => {
    const p = svg.dataset.p, rope = svg.querySelector('.rope');
    const m = document.createElementNS(NS, 'path'); m.setAttribute('d', DMF.PZ); svg.appendChild(m);
    const T = m.getTotalLength(), N = 3000, pts = [];
    for (let i = 0; i <= N; i++) pts.push(m.getPointAtLength(T * i / N));
    const near = (x, y, a = 0, b = 1) => { let best = 1e9, bi = 0; for (let i = Math.floor(a * N); i <= b * N; i++) { const d = (pts[i].x - x) ** 2 + (pts[i].y - y) ** 2; if (d < best) { best = d; bi = i; } } return bi / N * 1000; };
    const sX1 = near(300, 228, 0, .5), sX2 = near(300, 228, .5, 1), sA = near(236, 300, 0, .2), sB = near(364, 300, .8, 1);
    const sR = near(512, 318, .1, .6), sL = near(88, 318, .4, .9), bm = (sR + sL) / 2, bh = (sL - sR) / 2;
    svg.removeChild(m);
    const seg = (s0, s1) => `pathLength="1000" stroke-dasharray="${(s1 - s0).toFixed(2)} 3000" stroke-dashoffset="${(-s0).toFixed(2)}"`;
    const layer = (k, w, s0, s1, cap) => {
      const d = `d="${DMF.PZ}" ${seg(s0, s1)} stroke-linecap="${cap}"`;
      return [
        `<path ${d} stroke="#3f1a05" stroke-width="${w + 5}"/>`,
        `<path ${d} stroke="url(#${p}-base)" stroke-width="${w}"/>`,
        `<path ${d} stroke="#a65219" stroke-width="${w * .7}" transform="translate(-1.5,-3.5)" filter="url(#${p}-b2)"/>`,
        `<path ${d} stroke="#d4823f" stroke-width="${w * .34}" transform="translate(-3,-8)" opacity=".8" filter="url(#${p}-b3)"/>`,
        `<path ${d} stroke="#f8cd96" stroke-width="${w * .09}" transform="translate(-4,-${Math.round(w * .24)})" opacity=".55" filter="url(#${p}-b1)"/>`][k];
    };
    const group = (parts, cap, oc = cap) => { let h = ''; for (let k = 0; k < 5; k++) for (const [w, s0, s1] of parts) h += layer(k, w, s0, s1, k ? cap : oc); return h; };
    const W = 44;
    let h = group([[W, 0, 1000]], 'round');
    const ov = []; for (let i = 0; i < 14; i++) { const f = i / 13, w = 46 + 36 * Math.sin(f * Math.PI / 2), e = 1.0 - 0.58 * f; ov.push([w, bm - bh * e, bm + bh * e]); } h += group(ov, 'round', 'butt');
    h += `<path d="${DMF.PZ}" ${seg(bm - bh * .5, bm + bh * .5)} stroke-linecap="round" stroke="#6a2d0a" stroke-width="15" transform="translate(0,-10)" filter="url(#${p}-rough)" opacity=".75"/>`;
    h += `<path d="${DMF.PZ}" ${seg(bm - bh * .47, bm + bh * .47)} stroke-linecap="round" stroke="#f1d0a2" stroke-width="9" transform="translate(0,-16)" filter="url(#${p}-rough)"/>`;
    h += group([[W, 0, sA]], 'round') + group([[W, sA - 2, sA + 40]], 'butt');
    h += group([[W, sB, 1000]], 'round') + group([[W, sB - 40, sB + 2]], 'butt');
    h += group([[W, sX2 - 70, sX2 + 70]], 'butt');
    rope.innerHTML = h;
    // salt
    const r = DMF.rng(+svg.dataset.seed || 7), g = svg.querySelector('.salt'); g.innerHTML = '';
    for (let i = 0; i < 230; i++) {
      const s = r() * 1000; if (Math.abs(s - sX1) < 45) continue;
      const inBelly = Math.abs(s - bm) < bh * .7, w = inBelly ? 70 : W;
      const i0 = Math.round(s / 1000 * N), a = pts[i0], b = pts[Math.min(N, i0 + 2)];
      let tx = b.x - a.x, ty = b.y - a.y; const mm = Math.hypot(tx, ty) || 1; tx /= mm; ty /= mm;
      let nx = -ty, ny = tx; if (ny > 0) { nx = -nx; ny = -ny; }
      const off = (r() * 1.0 - 0.25) * w * 0.48, x = a.x + nx * off - 2, y = a.y + ny * off - 4, sz = 2.6 + r() * 3.8;
      const k = 5 + Math.floor(r() * 2), q = [];
      for (let j = 0; j < k; j++) { const an = j / k * Math.PI * 2 + r() * .6, rr = sz * (0.6 + r() * .5); q.push((x + Math.cos(an) * rr).toFixed(1) + ',' + (y + Math.sin(an) * rr * .85).toFixed(1)); }
      const pg = document.createElementNS(NS, 'polygon'); pg.setAttribute('points', q.join(' '));
      pg.setAttribute('fill', r() > .3 ? '#fdfcf7' : '#e6e2d9'); pg.setAttribute('stroke', '#b9b1a2'); pg.setAttribute('stroke-width', '.6'); g.appendChild(pg);
    }
  });
};
DMF.salt = DMF.buildPretzels;

// ---------- Maß glass ----------
DMF.mug = (p = 'mg') => {
  let dim = ''; for (let c = 0; c < 3; c++) for (let r = 0; r < 5; r++) dim += `<rect x="${78 + c * 76}" y="${212 + r * 60}" width="62" height="48" rx="22" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.34)" stroke-width="3"/>`;
  let foam = ''; const R = DMF.rng(11); for (let i = 0; i < 11; i++) { const x = 66 + i * 24 + R() * 8, y = 96 + R() * 18, rr = 24 + R() * 16; foam += `<circle cx="${x}" cy="${y}" r="${rr}" fill="url(#${p}-foam)"/>`; }
  let bub = ''; for (let i = 0; i < 26; i++) bub += `<circle cx="${70 + R() * 230}" cy="${200 + R() * 300}" r="${1.5 + R() * 3}" fill="#fff6d0" opacity="${.35 + R() * .4}"/>`;
  return `<svg class="mug" viewBox="0 0 440 560" xmlns="http://www.w3.org/2000/svg"><defs>
   <linearGradient id="${p}-beer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbd257"/><stop offset=".5" stop-color="#eda92a"/><stop offset="1" stop-color="#c47812"/></linearGradient>
   <linearGradient id="${p}-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".08" stop-color="#fff" stop-opacity=".45"/><stop offset=".18" stop-color="#fff" stop-opacity=".05"/><stop offset=".82" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#5a3a10" stop-opacity=".28"/></linearGradient>
   <radialGradient id="${p}-foam" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffefa"/><stop offset=".7" stop-color="#fbf4e4"/><stop offset="1" stop-color="#e9dcc0"/></radialGradient>
   <clipPath id="${p}-clip"><rect x="50" y="80" width="270" height="440" rx="30"/></clipPath>
   <filter id="${p}-bl"><feGaussianBlur stdDeviation="3"/></filter>
   <filter id="${p}-sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter></defs>
   <ellipse cx="205" cy="528" rx="190" ry="20" fill="#3a220c" opacity=".38" filter="url(#${p}-sh)"/>
   <path d="M310,175 C420,170 432,350 310,365" fill="none" stroke="rgba(90,110,120,.35)" stroke-width="48" stroke-linecap="round"/>
   <path d="M310,175 C420,170 432,350 310,365" fill="none" stroke="rgba(236,244,247,.82)" stroke-width="40" stroke-linecap="round"/>
   <path d="M314,190 C400,190 410,340 314,350" fill="none" stroke="rgba(240,180,60,.35)" stroke-width="12"/>
   <path d="M306,170 C410,166 424,330 330,352" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="7" transform="translate(-3,-4)" filter="url(#${p}-bl)"/>
   <g clip-path="url(#${p}-clip)">
     <rect x="40" y="70" width="300" height="460" fill="rgba(224,236,242,.55)"/>
     <rect x="40" y="168" width="300" height="360" fill="url(#${p}-beer)"/>
     ${bub}
     <path d="M40,120 L340,120 L340,178 C300,190 260,170 220,184 C180,196 130,172 90,186 C70,192 52,186 40,182 Z" fill="url(#${p}-foam)"/>
     ${dim}
     <rect x="40" y="70" width="300" height="460" fill="url(#${p}-side)"/>
     <rect x="70" y="100" width="16" height="400" rx="8" fill="#fff" opacity=".45" filter="url(#${p}-bl)"/>
     <rect x="40" y="494" width="300" height="40" fill="rgba(255,255,255,.28)"/>
   </g>
   ${foam}
   <rect x="50" y="80" width="270" height="440" rx="30" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="6"/>
   <rect x="47" y="77" width="276" height="446" rx="32" fill="none" stroke="rgba(80,100,110,.35)" stroke-width="2.5"/>
  </svg>`;
};

// ---------- plate ----------
DMF.plate = (p = 'pl') => `<svg class="plate" viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg"><defs>
  <radialGradient id="${p}-g" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#f3efe7"/><stop offset="1" stop-color="#dcd5c8"/></radialGradient>
  <filter id="${p}-sh" x="-20%" y="-40%" width="140%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>
  <ellipse cx="460" cy="205" rx="430" ry="128" fill="#3a220c" opacity=".35" filter="url(#${p}-sh)"/>
  <ellipse cx="450" cy="180" rx="430" ry="140" fill="url(#${p}-g)" stroke="#d5cdbf" stroke-width="2"/>
  <ellipse cx="450" cy="180" rx="385" ry="122" fill="none" stroke="#9FD0F0" stroke-width="7"/>
  <ellipse cx="450" cy="186" rx="310" ry="96" fill="#f7f4ee" stroke="#e1dace" stroke-width="3"/>
  <path d="M150,120 C260,62 640,62 750,120" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".9"/></svg>`;

// ---------- wooden table ----------
DMF.wood = (w, h, p = 'wd', seed = 3) => {
  let seams = ''; for (let y = 150; y < h; y += 190) seams += `<rect x="0" y="${y}" width="${w}" height="4" fill="#5a381c" opacity=".55"/><rect x="0" y="${y + 4}" width="${w}" height="2" fill="#e2b585" opacity=".35"/>`;
  return `<svg class="wood" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs>
  <linearGradient id="${p}-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c99662"/><stop offset="1" stop-color="#9a663a"/></linearGradient>
  <radialGradient id="${p}-l" cx=".5" cy=".25" r=".8"><stop offset="0" stop-color="#fff1d6" stop-opacity=".45"/><stop offset="1" stop-color="#2a1606" stop-opacity=".35"/></radialGradient>
  <filter id="${p}-g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0022 0.075" numOctaves="4" seed="${seed}"/><feColorMatrix type="matrix" values="0 0 0 0 .25  0 0 0 0 .13  0 0 0 0 .04  0 0 0 1.6 -.55"/></filter>
  <filter id="${p}-g2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.01 0.3" numOctaves="2" seed="${seed + 5}"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .9  0 0 0 0 .75  0 0 0 .9 -.4"/></filter></defs>
  <rect width="${w}" height="${h}" fill="url(#${p}-b)"/><rect width="${w}" height="${h}" filter="url(#${p}-g)"/><rect width="${w}" height="${h}" filter="url(#${p}-g2)" opacity=".35"/>
  ${seams}<rect width="${w}" height="${h}" fill="url(#${p}-l)"/></svg>`;
};

// ---------- Oktoberfest tent, soft focus ----------
DMF.tent = (w, h, p = 'tn', seed = 5, blur = 16) => {
  const R = DMF.rng(seed); let s = '';
  const cx = w / 2, cy = -h * 0.35, n = 28, ceil = h * 0.4;
  for (let i = 0; i < n; i++) { const a0 = Math.PI * (0.08 + 0.84 * i / n), a1 = Math.PI * (0.08 + 0.84 * (i + 1) / n), L = h * 1.6;
    s += `<polygon points="${cx},${cy} ${cx + Math.cos(a0) * L},${cy + Math.sin(a0) * L} ${cx + Math.cos(a1) * L},${cy + Math.sin(a1) * L}" fill="${i % 2 ? '#f7f5ef' : '#a9d3ee'}"/>`; }
  let g = ''; for (let k = 0; k < 3; k++) { const y = ceil * (0.55 + k * 0.17); let d = `M-50,${y}`; const seg = 4; for (let j = 0; j < seg; j++) { const x0 = -50 + j * (w + 100) / seg, x1 = x0 + (w + 100) / seg; d += ` Q${(x0 + x1) / 2},${y + 70 + k * 10} ${x1},${y}`; }
    g += `<path d="${d}" fill="none" stroke="#6f8d45" stroke-width="${26 - k * 4}"/><path d="${d}" fill="none" stroke="#a9c46e" stroke-width="6" stroke-dasharray="4 18" opacity=".8"/>`;
    for (let j = 0; j < seg; j++) { const x = -50 + (j + .5) * (w + 100) / seg; g += `<circle cx="${x}" cy="${y + 52 + k * 8}" r="${60 + k * 10}" fill="url(#${p}-lamp)"/>`; } }
  let bok = ''; for (let i = 0; i < 90; i++) { const c = ['#ffe3a1', '#ffd27a', '#fff2d6', '#ffc061', '#fffaf0'][Math.floor(R() * 5)]; bok += `<circle cx="${R() * w}" cy="${h * (0.36 + R() * 0.4)}" r="${10 + R() * 50}" fill="${c}" opacity="${.3 + R() * .55}"/>`; }
  let pil = ''; for (let i = 0; i < 5; i++) pil += `<rect x="${w * (0.1 + i * 0.2) + R() * 40}" y="${h * 0.32}" width="${30 + R() * 20}" height="${h}" fill="#9b6738" opacity=".42"/>`;
  let tb = ''; for (let i = 0; i < 4; i++) { const y = h * (0.74 + i * 0.065); tb += `<rect x="-20" y="${y}" width="${w + 40}" height="${h * 0.03}" fill="#7b4c26" opacity=".7"/><rect x="-20" y="${y - 6}" width="${w + 40}" height="6" fill="#e9c08a" opacity=".55"/>`; }
  return `<svg class="tent" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>
   <linearGradient id="${p}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3f6"/><stop offset=".4" stop-color="#f4e2b8"/><stop offset=".72" stop-color="#e2ab62"/><stop offset="1" stop-color="#8f5e34"/></linearGradient>
   <radialGradient id="${p}-lamp"><stop offset="0" stop-color="#fffbe9"/><stop offset=".35" stop-color="#ffd987" stop-opacity=".9"/><stop offset="1" stop-color="#ffc85a" stop-opacity="0"/></radialGradient>
   <filter id="${p}-blur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>
   <g filter="url(#${p}-blur)"><rect x="-60" y="-60" width="${w + 120}" height="${h + 120}" fill="url(#${p}-bg)"/>
   <g opacity=".9"><clipPath id="${p}-c"><rect x="-60" y="-60" width="${w + 120}" height="${ceil + 60}"/></clipPath><g clip-path="url(#${p}-c)">${s}</g></g>
   ${pil}${bok}${g}${tb}</g><rect width="${w}" height="${h}" fill="#fff4de" opacity=".14"/></svg>`;
};

DMF.rauten = (w, h = 20) => `<svg class="rauten" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><pattern id="rt" width="${h * 1.8}" height="${h}" patternUnits="userSpaceOnUse"><rect width="${h * 1.8}" height="${h}" fill="#fff"/><polygon points="${h * .9},0 ${h * 1.8},${h / 2} ${h * .9},${h} 0,${h / 2}" fill="#9FD0F0"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#rt)"/></svg>`;

DMF.logo = () => `<span class="mark"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 4h14v9H9l-4 3v-3H3z" fill="#18263F"/></svg></span><b>deutsch</b><span>mit</span><b>farsi</b>`;
DMF.ready = async () => { DMF.salt(); await document.fonts.ready; window.__ready = true; };

// ---------- price tag (never shows a price) ----------
DMF.tag = (txt = '? €', p = 'tg') => `<svg class="tag" viewBox="0 0 340 520" xmlns="http://www.w3.org/2000/svg"><defs>
 <filter id="${p}-sh" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="6" dy="14" stdDeviation="10" flood-color="#3b2210" flood-opacity=".3"/></filter></defs>
 <path d="M170,0 L170,150" stroke="#8a6a45" stroke-width="5"/>
 <g filter="url(#${p}-sh)"><path d="M170,120 L290,190 L290,490 Q290,510 270,510 L70,510 Q50,510 50,490 L50,190 Z" fill="#FFFBF3" stroke="#d9cbb0" stroke-width="4"/>
 <path d="M170,120 L290,190 L50,190 Z" fill="#CFE7F7"/>
 <circle cx="170" cy="170" r="15" fill="#efe4cf" stroke="#c8b796" stroke-width="4"/></g>
 <text x="170" y="400" text-anchor="middle" font-family="Inter" font-weight="850" font-size="150" fill="#18263F">${txt}</text></svg>`;
DMF.icon = {
  bookmark: (c = '#18263F') => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M6 3h12v18l-6-4.5L6 21z" fill="${c}"/></svg>`,
  comment: (c = '#18263F') => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M4 4h16v12H9l-5 4z" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
  arrow: (c = '#5E9FCB') => `<svg viewBox="0 0 120 60" width="100%" height="100%"><path d="M6 44 C36 6 76 6 104 26" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/><path d="M88 14 L106 27 L86 36" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};
// table scene: tent background + wood tabletop + optional mug + plate with pretzel
DMF.scene = ({ w, h, table = .34, plateW = .62, plateX = .5, mug = false, mugW = .22, mugX = .14, mugY = .35, plateY = .45, blur = 16, id = 's', pz = true, plate = true }) => {
  const th = Math.round(h * table), ty = h - th; const pw = w * plateW, ph = pw * 340 / 900; const px = w * plateX - pw / 2, py = ty + th * plateY - ph * .55;
  const zw = pw * .78, zx = w * plateX - zw / 2, zy = py + ph * .5 - zw * (500 / 600) * .78 * .82;
  let s = `<div style="position:absolute;inset:0">${DMF.tent(w, ty + 40, id + 't', 5, blur)}</div>`;
  s += `<div style="position:absolute;left:0;top:${ty}px">${DMF.wood(w, th, id + 'w', 4)}</div><div style="position:absolute;left:0;right:0;top:${ty - 2}px;height:6px;background:linear-gradient(#f3d3a6,#8a5a30)"></div>`;
  if (mug) { const mw = w * mugW; s += `<div style="position:absolute;left:${w * mugX - mw / 2}px;top:${ty + th * mugY - mw * 560 / 440}px;width:${mw}px;filter:blur(${mug === 'blur' ? 2.5 : 0}px)">${DMF.mug(id + 'm')}</div>`; }
  if (plate) s += `<div style="position:absolute;left:${px}px;top:${py}px;width:${pw}px">${DMF.plate(id + 'p')}</div>`;
  if (pz) s += `<div style="position:absolute;left:${zx}px;top:${zy}px;width:${zw}px;transform:scaleY(.78);transform-origin:50% 80%">${DMF.pretzel(id + 'z', 31)}</div>`;
  return s;
};
