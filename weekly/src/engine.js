// Deterministischer Renderer: render(t) setzt den kompletten Bildzustand für Zeit t (Sekunden).
const TL = window.TL;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const easeOut = p => 1 - Math.pow(1 - p, 3);
const smooth = p => p * p * (3 - 2 * p);
const IN = 0.42, OUT = 0.3;
const pad2 = n => String(n).padStart(2, '0');
const faWrap = s => s.replace(/([؀-ۿ][؀-ۿ‌ ]*[؀-ۿ]|[؀-ۿ])/g, '<span class="fa-in">$1</span>');

function helpers(sc) {
  const q = i => { const c = sc.cues[i]; if (!c) throw Error(sc.id + ': no cue ' + i); return c; };
  const S = {
    start: sc.start, end: sc.end, sc,
    c: i => q(i).start, e: i => q(i).end,
    after: i => { const c = q(i); return Math.max(c.end, c.hold ? c.hold[1] : 0, c.wait ? c.wait[1] : 0, c.pause ? c.pause[1] : 0); },
    w: (i, word, occ = 0) => { const c = q(i); let k = -1; for (let n = 0; n <= occ; n++) k = c.say.indexOf(word, k + 1); if (k < 0) throw Error(sc.id + ': "' + word + '" not in "' + c.say + '"'); return c.start + (c.end - c.start) * k / c.say.length; },
    sp: i => { const c = q(i); const r = [[c.start, c.end]]; if (c.slow) r.push(c.slow); return r; },
    wait: i => q(i).wait, pause: i => q(i).pause,
  };
  return S;
}

let cur = null, els = [], tick = null, built = {};
const $ = id => document.getElementById(id);

async function buildScene(sc) {
  const S = helpers(sc);
  const v = VIS[sc.id](S);
  const html = typeof v === 'string' ? v : v.html;
  tick = typeof v === 'string' ? null : v.tick;
  const root = $('scene'); root.innerHTML = html;
  DMF.buildPretzels(root);
  await Promise.all([...root.querySelectorAll('img')].map(i => i.decode().catch(() => {})));
  els = [...root.querySelectorAll('[data-at],[data-on],[data-hl],[data-cd],[data-ty],[data-kb],[data-swing],[data-draw],[data-dim]')].map(el => {
    const d = el.dataset, o = { el };
    if (d.at) { o.at = +d.at; o.a = d.a || 'up'; o.until = d.until ? +d.until : null; }
    if (d.on) o.on = d.on.split(';').map(r => r.split(',').map(Number));
    if (d.hl) o.hl = +d.hl;
    if (d.cd) { o.cd = d.cd.split(',').map(Number); o.num = el.querySelector('.num'); o.arc = el.querySelector('.arc'); }
    if (d.ty) { o.ty = d.ty.split(',').map(Number); o.text = el.textContent; }
    if (d.kb) o.kb = 1;
    if (d.swing) o.swing = 1;
    if (d.draw) o.draw = d.draw.split(',').map(Number);
    if (d.dim) o.dim = +d.dim;
    return o;
  });
  const idx = TL.scenes.indexOf(sc);
  $('chapno').textContent = pad2(idx + 1);
  $('chapt').textContent = sc.title;
  $('progn').innerHTML = `${pad2(idx + 1)}<small> / ${TL.scenes.length}</small>`;
  $('dots').innerHTML = TL.scenes.map((s, k) => `<i class="${k < idx ? 'd' : k === idx ? 'c' : ''}"></i>`).join('');
  cur = sc;
}

function update(t) {
  const sc = cur, lt = t - sc.start;
  for (const o of els) {
    const st = o.el.style;
    let op = 1, tr = '';
    if (o.at != null) {
      const p = easeOut(clamp((t - o.at) / IN));
      const out = o.until != null ? 1 - easeOut(clamp((t - o.until) / OUT)) : 1;
      op = Math.min(p, out);
      const r = 1 - p;
      if (o.a === 'up') tr = `translateY(${(r * 30).toFixed(2)}px)`;
      else if (o.a === 'pop') tr = `scale(${(0.9 + 0.1 * p).toFixed(4)})`;
      else if (o.a === 'left') tr = `translateX(${(-r * 40).toFixed(2)}px)`;
      else if (o.a === 'right') tr = `translateX(${(r * 40).toFixed(2)}px)`;
    }
    if (o.dim != null) op *= 1 - 0.6 * easeOut(clamp((t - o.dim) / IN));
    if (o.at != null || o.dim != null) { st.opacity = op.toFixed(4); st.visibility = op < 0.002 ? 'hidden' : 'visible'; }
    if (o.swing) tr += ` rotate(${(Math.sin(lt * 1.3) * 3).toFixed(3)}deg)`;
    if (o.at != null || o.swing) st.transform = tr;
    if (o.on) {
      let k = 0;
      for (const [a, b] of o.on) k = Math.max(k, smooth(clamp((t - (a - 0.15)) / 0.25)) * smooth(clamp((b + 0.5 - t) / 0.3)));
      st.setProperty('--k', k.toFixed(4));
    }
    if (o.hl != null) st.setProperty('--h', easeOut(clamp((t - o.hl) / 0.45)).toFixed(4));
    if (o.cd) {
      const [a, b] = o.cd, p = clamp((t - a) / (b - a));
      st.setProperty('--p', p.toFixed(4));
      if (o.arc) o.arc.style.strokeDashoffset = (p).toFixed(4);
      if (o.num) o.num.textContent = t < a ? Math.round(b - a) : t >= b ? '✓' : Math.ceil(b - t);
    }
    if (o.ty) { const [a, b] = o.ty; o.el.textContent = o.text.slice(0, Math.round(clamp((t - a) / (b - a)) * o.text.length)); }
    if (o.draw) { const [a, b] = o.draw; st.setProperty('--d', (1 - smooth(clamp((t - a) / (b - a)))).toFixed(4)); }
    if (o.kb) {
      // langsamer Zoom 1.00→1.06 je 8 s, Richtung wechselt, dazu sanfte Drift
      const P = 8, k = Math.floor(lt / P), f = smooth((lt % P) / P);
      const z = k % 2 === 0 ? 1 + 0.06 * f : 1.06 - 0.06 * f;
      const dx = Math.sin(lt * 2 * Math.PI / 37) * 14, dy = Math.cos(lt * 2 * Math.PI / 51) * 9;
      st.transform = `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px) scale(${(z + 0.02).toFixed(5)})`;
    }
  }
  if (tick) tick(t, $('scene'));
  // scene fade
  $('scene').style.opacity = Math.min(clamp((t - sc.start) / 0.45), clamp((sc.end - t) / 0.35)).toFixed(4);
  // subtitles
  let sub = null;
  for (const s of TL.subs) if (s.scene === sc.id && s.start <= t + 0.05) sub = s;
  const de = $('subde'), fa = $('subfa');
  if (sub) {
    if (de.dataset.k !== sub.start + '') { de.innerHTML = `<span>${faWrap(sub.text)}</span>`; de.dataset.k = sub.start + ''; }
    de.style.opacity = clamp((t - sub.start + 0.05) / 0.2).toFixed(3);
  } else { de.innerHTML = ''; de.dataset.k = ''; }
  let fc = null;
  for (const c of sc.cues) if (c.fa && c.start <= t + 0.05) fc = c;
  if (fc) {
    if (fa.dataset.k !== fc.start + '') { fa.textContent = fc.fa; fa.dataset.k = fc.start + ''; }
    fa.style.opacity = clamp((t - fc.start + 0.05) / 0.25).toFixed(3);
  } else { fa.textContent = ''; fa.dataset.k = ''; }
  const sceneOp = Math.min(clamp((t - sc.start) / 0.3), clamp((sc.end - t) / 0.3));
  $('subin').style.opacity = sceneOp.toFixed(3);
  // badge: slow repeat / learner pause / answer time
  let b = null;
  for (const c of sc.cues) {
    if (c.slow && t >= c.slow[0] - 0.1 && t < c.slow[1]) b = { k: 'slow', a: c.slow[0] - 0.1, e: c.slow[1] };
    if (c.hold && t >= c.hold[0] && t < c.hold[1]) b = { k: 'hold', a: c.hold[0], e: c.hold[1] };
    if (c.wait && t >= c.wait[0] && t < c.wait[1]) b = { k: 'wait', a: c.wait[0], e: c.wait[1] };
  }
  const bd = $('badge');
  if (b) {
    if (bd.dataset.k !== b.k) {
      bd.dataset.k = b.k;
      bd.innerHTML = b.k === 'slow' ? `<div class="t"><span class="ico">${IC.slow()}</span>Langsam</div><div class="fa">آهسته گوش کن</div>`
        : b.k === 'hold' ? `<div class="t"><span class="ico">${IC.speak()}</span>Sprich nach!</div><div class="fa">حالا تو تکرار کن</div><div class="bar"><i></i></div>`
        : `<div class="t"><span class="ico">${IC.speak()}</span>Du bist dran!</div><div class="fa">نوبت توست</div><div class="bar"><i></i></div>`;
    }
    const p = clamp((t - b.a) / (b.e - b.a));
    bd.style.setProperty('--p', p.toFixed(4));
    const op = Math.min(clamp((t - b.a) / 0.25), clamp((b.e - t) / 0.25));
    bd.style.opacity = op.toFixed(3); bd.style.transform = `scale(${(0.94 + 0.06 * easeOut(clamp((t - b.a) / 0.3))).toFixed(4)})`;
    $('prog').style.opacity = (1 - op).toFixed(3);
  } else { bd.style.opacity = 0; bd.dataset.k = ''; $('prog').style.opacity = 1; }
}

async function render(t) {
  let sc = TL.scenes[TL.scenes.length - 1];
  for (const s of TL.scenes) if (t >= s.start && t < s.end) { sc = s; break; }
  if (sc !== cur) await buildScene(sc);
  update(t);
}

window.addEventListener('DOMContentLoaded', async () => {
  $('logo').innerHTML = DMF.logo();
  const pre = [...new Set(TL.scenes.filter(s => s.photo).map(s => '../assets/' + s.photo))];
  await Promise.all(pre.map(src => { const i = new Image(); i.src = src; return i.decode().catch(() => {}); }));
  await document.fonts.load('400 40px Lalezar', 'سلام'); await document.fonts.load('800 40px Inter', 'Aa');
  await document.fonts.ready;
  const t0 = +(new URLSearchParams(location.search).get('t') || 0);
  await render(t0);
  window.__ready = true;
});
