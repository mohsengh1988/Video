// Szenen-Layouts. Jede Funktion bekommt S (Zeit-Helfer aus der gemessenen Timeline) und liefert HTML
// (optional {html, tick}). Zeiten sind absolut in Sekunden; Animationen werden in engine.js berechnet.
const f3 = x => (+x).toFixed(3);
const at = (t, a = 'up', u = null) => `data-at="${f3(t)}" data-a="${a}"${u != null ? ` data-until="${f3(u)}"` : ''}`;
const on = (...lists) => `data-on="${lists.flat().map(r => r.map(f3).join(',')).join(';')}"`;
const R = (a, b) => [[a, b]];
const pos = (x, y, w, h) => `left:${x}px;top:${y}px;${w ? `width:${w}px;` : ''}${h ? `height:${h}px;` : ''}`;
const mk = (txt, t) => `<span class="mk" data-hl="${f3(t)}"><i></i>${txt}</span>`;
const PX = 1120, PW = 720; // rechte Spalte neben dem Foto

const photo = (S, file, cap, op = '50% 50%') =>
  `<div class="abs photo" style="" ${at(S.start + 0.05, 'fade')}><img src="../assets/${file}" data-kb="1" style="object-position:${op}"><div class="cap">${cap}</div></div>`;
const bub = ({ x, y, w, side = 'l', who, whoFa, tx, tf, a, u, o = '', right, cls = '' }) =>
  `<div class="bub ${side} ${cls} glow" style="${right != null ? `right:${right}px;top:${y}px;${w ? `max-width:${w}px;` : ''}` : pos(x, y, w)}" ${at(a, 'up', u)} ${o}>
   ${who ? `<div class="who">${who}${whoFa ? ` <span class="fa">${whoFa}</span>` : ''}</div>` : ''}<div class="tx">${tx}</div>${tf ? `<div class="tf">${tf}</div>` : ''}</div>`;
const wc = ({ x, y, w, h, icon, ar, word, fa, sm, a, u, o = '', extra = '' }) =>
  `<div class="wc glow" style="${pos(x, y, w, h)}" ${at(a, 'up', u)} ${o}><div class="im">${icon}</div><div class="w">${ar ? `<span class="ar">${ar}</span> ` : ''}${word}</div>${sm ? `<div class="sm">${sm}</div>` : ''}${fa ? `<div class="fa">${fa}</div>` : ''}${extra}</div>`;
const chip = ({ x, y, de, fa, icon, a, u, cls = '', o = '', fs }) =>
  `<div class="chip ${cls} glow" style="${x == null ? 'position:relative;' : pos(x, y)}${fs ? `font-size:${fs}px;` : ''}" ${at(a, 'pop', u)} ${o}>${icon || ''}<span>${de}</span>${fa ? `<span class="fa">${fa}</span>` : ''}</div>`;
const note = ({ x, y, w, de, fa, a, u, icon }) =>
  `<div class="note" style="${pos(x, y, w)}" ${at(a, 'up', u)}>${icon || IC.info()}<div><div class="de">${de}</div>${fa ? `<div class="fa">${fa}</div>` : ''}</div></div>`;
const ring = ({ x, y, s = 150, cd }) =>
  `<div class="ring" style="${pos(x, y, s, s)}" data-cd="${cd.map(f3).join(',')}" ${at(cd[0] - 0.3, 'pop', cd[1] + 0.6)}><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#FFFBF3" stroke="#EFE4CF" stroke-width="10"/><circle class="arc" cx="50" cy="50" r="44" fill="none" stroke="#5E9FCB" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" style="stroke-dashoffset:0"/></svg><div class="num"></div></div>`;

// Zwischenstopp: persischer Satz → Antwortpause → deutsche Musterantwort
function zwischen(S) {
  const cs = S.sc.cues, items = cs.map((c, i) => i).filter(i => cs[i].wait), last = cs.length - 1;
  return `
    ${chip({ x: 80, y: PY, de: 'Zwischenstopp', fa: 'توقف کوتاه', icon: IC.pause(), a: S.start + 0.3, cls: 'navy' })}
    <div class="abs" style="${pos(80, 250, 1760, 300)};display:flex;gap:30px" ${at(S.c(0) + 0.6, 'up', S.c(items[0]) - 0.1)}>
      ${[[IC.read(), '1 · Persisch lesen', 'بخوان'], [IC.speak(), '2 · Deutsch sagen', 'بگو'], [IC.ear(), '3 · Antwort hören', 'گوش کن']].map(([ic, de, fa]) => `<div class="step" style="position:relative;flex:1;padding:30px"><div class="im">${ic}</div><div class="de" style="min-height:0">${de}</div><div class="fa">${fa}</div></div>`).join('')}</div>
    ${items.map((c, k) => { const u = k < items.length - 1 ? S.c(items[k + 1]) - 0.15 : S.c(last) - 0.15;
      return `<div class="abs pc" style="${pos(80, 240, 1500, 220)};display:flex;align-items:center;gap:30px" ${at(S.c(c) - 0.1, 'up', u)}>
        <span style="flex:0 0 90px;height:90px;border-radius:50%;background:#18263F;color:#FFFBF3;font-family:Inter;font-weight:850;font-size:48px;display:grid;place-items:center">${k + 1}</span>
        <span style="flex:1;font-family:Lalezar;font-size:52px;direction:rtl;text-align:right;color:#18263F">${cs[c].fa}</span></div>
      ${ring({ x: 1640, y: 250, s: 200, cd: S.wait(c) })}
      <div class="abs pc row glow" style="${pos(80, 500, 1760, 150)}" ${at(S.c(c + 1) - 0.1, 'up', u)} ${on(S.sp(c + 1))}><span style="width:70px;height:70px;flex:0 0 70px">${IC.check()}</span><div class="de" style="font-size:66px">${cs[c + 1].say}</div></div>`; }).join('')}
    ${card({ x: 260, y: 250, w: 1400, h: 380, de: 'Sehr gut!', fa: 'خیلی خوب', size: 110, a: S.c(last), st: ';display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center' })}
  `;
}

  // 01 Hook ------------------------------------------------------------
const PY = 136, PH = 612;
const card = ({ x, y, w, h, k, de, fa, a, u, o = '', cls = '', size, extra = '', st = '' }) =>
  `<div class="abs pc glow ${cls}" style="${pos(x, y, w, h)}${st}" ${at(a, 'up', u)} ${o}>${extra}${k ? `<div class="k">${k}</div>` : ''}${de ? `<div class="de" ${size ? `style="font-size:${size}px"` : ''}>${de}</div>` : ''}${fa ? `<div class="fa">${fa}</div>` : ''}</div>`;
const iconRow = ({ x, y, w, h = 96, icon, de, fa, a, u, o = '', fs = 50 }) =>
  `<div class="abs glow" style="${pos(x, y, w, h)};display:flex;align-items:center;gap:20px;background:#FFFBF3;border-radius:26px;padding:0 24px;box-shadow:0 10px 24px rgba(40,25,10,.08)" ${at(a, 'left', u)} ${o}>
   <span style="width:78px;height:${h - 26}px;flex:0 0 78px;display:flex;align-items:center">${icon}</span><span style="font-family:Inter;font-weight:800;font-size:${fs}px;letter-spacing:-.03em;white-space:nowrap">${de}</span>${fa ? `<span style="margin-left:auto;font-family:Lalezar;font-size:40px;color:#5E9FCB;white-space:nowrap">${fa}</span>` : ''}</div>`;
const rt = (w, top = 0) => `<div style="position:absolute;left:0;top:${top}px;width:${w}px;height:16px;border-radius:36px 36px 0 0;overflow:hidden">${DMF.rauten(w, 16)}</div>`;
const strike = `<svg style="position:absolute;left:-8px;right:-8px;top:50%;height:10px;width:calc(100% + 16px)" preserveAspectRatio="none" viewBox="0 0 100 10"><path d="M0,6 L100,4" stroke="#55607A" stroke-width="3"/></svg>`;
const opt = (S, y, L, txt, a, u, ok, rev, xr = []) => `<div class="opt glow" style="${pos(80, y, 1460, 100)}" ${at(a, 'left', u)} ${ok ? on(R(rev, S.end + 5), xr) : `data-dim="${f3(rev)}"`}>
      <span class="L">${L}</span><span class="t">${txt}</span>${ok ? `<span class="ok" ${at(rev, 'pop', u)}>${IC.check()}</span>` : ''}</div>`;
const qtext = (txt, a, u) => `<div class="abs" style="${pos(80, 250, 1760)};font-family:Inter;font-weight:800;font-size:56px;letter-spacing:-.03em;line-height:1.1" ${at(a, 'up', u)}>${txt}</div>`;
const CAP = {
  mp: 'München, Marienplatz · Abendaufnahme · Foto: Andrey Omelyanchuk / Pexels',
  eg: 'Englischer Garten, München · Monopteros · Foto: Michele Petruzzelli / Pexels',
  ub: 'Münchner U-Bahn (Symbolbild) · Foto: Maria Geller / Pexels',
  bk: 'Symbolbild · Bäckerei in Berlin · Foto: Manish Jain / Pexels',
  bmw: 'BMW-Zentrale (Bürogebäude, keine Fabrik), München · Foto: Yuri Semenyaga / Pexels',
};
// Dialog als Chat mit Scroll (Rollen links/rechts)
function chat(S, leftRole, roleFa, head) {
  const turns = S.sc.cues.filter(c => c.role);
  const html = `${chip({ x: 80, y: 136, de: head[0], fa: head[1], icon: IC.ear(), a: S.start + 0.3, cls: 'navy' })}
    <div class="abs" id="chat" style="left:0;top:0;width:1920px;height:752px;overflow:hidden;clip-path:inset(214px 0 0 0)">
    ${turns.map(c => { const l = c.role === leftRole;
      return `<div class="bub dlg ${l ? 'l' : 'r'} glow" data-t="${f3(c.start - 0.15)}" style="${l ? 'left:80px' : 'right:80px'};top:0;max-width:1250px;opacity:0" ${on(R(c.start, c.end))}>
       <div class="who">${c.role} <span class="fa">${roleFa[c.role] || ''}</span></div><div class="tx">${c.show}</div></div>`; }).join('')}</div>`;
  let hs = null;
  const tick = (t, root) => {
    const b = [...root.querySelectorAll('.dlg')];
    if (!hs) hs = b.map(e => e.offsetHeight);
    const P = b.map(e => easeOut(clamp((t - +e.dataset.t) / 0.45)));
    for (let j = 0; j < b.length; j++) {
      let y = 748 - hs[j];
      for (let k = j + 1; k < b.length; k++) y -= (hs[k] + 22) * P[k];
      b[j].style.top = (y + (1 - P[j]) * 40).toFixed(2) + 'px';
      b[j].style.opacity = (P[j] * clamp((y - 150) / 90)).toFixed(3);
    }
  };
  return { html, tick };
}

// Zwischenstopp: persischer Satz → Antwortpause → deutsche Musterantwort
function zwischen(S) {
  const cs = S.sc.cues, items = cs.map((c, i) => i).filter(i => cs[i].wait), last = cs.length - 1;
  return `
    ${chip({ x: 80, y: PY, de: 'Zwischenstopp', fa: 'توقف کوتاه', icon: IC.pause(), a: S.start + 0.3, cls: 'navy' })}
    <div class="abs" style="${pos(80, 250, 1760, 300)};display:flex;gap:30px" ${at(S.c(0) + 0.6, 'up', S.c(items[0]) - 0.1)}>
      ${[[IC.read(), '1 · Persisch lesen', 'بخوان'], [IC.speak(), '2 · Deutsch sagen', 'بگو'], [IC.ear(), '3 · Antwort hören', 'گوش کن']].map(([ic, de, fa]) => `<div class="step" style="position:relative;flex:1;padding:30px"><div class="im">${ic}</div><div class="de" style="min-height:0">${de}</div><div class="fa">${fa}</div></div>`).join('')}</div>
    ${items.map((c, k) => { const u = k < items.length - 1 ? S.c(items[k + 1]) - 0.15 : S.c(last) - 0.15;
      return `<div class="abs pc" style="${pos(80, 240, 1500, 220)};display:flex;align-items:center;gap:30px" ${at(S.c(c) - 0.1, 'up', u)}>
        <span style="flex:0 0 90px;height:90px;border-radius:50%;background:#18263F;color:#FFFBF3;font-family:Inter;font-weight:850;font-size:48px;display:grid;place-items:center">${k + 1}</span>
        <span style="flex:1;font-family:Lalezar;font-size:52px;direction:rtl;text-align:right;color:#18263F">${cs[c].fa}</span></div>
      ${ring({ x: 1640, y: 250, s: 200, cd: S.wait(c) })}
      <div class="abs pc row glow" style="${pos(80, 500, 1760, 150)}" ${at(S.c(c + 1) - 0.1, 'up', u)} ${on(S.sp(c + 1))}><span style="width:70px;height:70px;flex:0 0 70px">${IC.check()}</span><div class="de" style="font-size:66px">${cs[c + 1].say}</div></div>`; }).join('')}
    ${card({ x: 260, y: 250, w: 1400, h: 380, de: 'Sehr gut!', fa: 'خیلی خوب', size: 110, a: S.c(last), st: ';display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center' })}
  `;
}

const VIS = {
  // 01 Hook
  monthly_01: S => `
  ${photo(S, 'marienplatz.jpg', CAP.mp, '50% 45%')}
  ${card({ x: PX, y: PY, w: PW, k: 'Deutsch mit Farsi · Monatsfolge', de: `${mk('München', S.start + 1)} &amp; Bayern entdecken`, fa: 'مونیخ فراتر از اکتبرفست', a: S.start + 0.4 })}
  ${chip({ x: PX, y: 470, de: 'mehr als ein Fest', fa: 'بیشتر از یک جشن', icon: IC.star(), a: S.c(1), u: S.c(2) - 0.1 })}
  ${[['Bilder', 'عکس', IC.camera(), 'Bilder'], ['kurze Geschichten', 'روایت', IC.read(), 'Geschichten'], ['einfache Sätze', 'جمله‌های ساده', IC.speak(), 'Sätze']]
    .map(([de, fa, ic, w], i) => chip({ x: PX, y: 450 + i * 98, de, fa, icon: ic, a: S.w(2, w) })).join('')}
  `,

  // 02 Orientierung: drei Ebenen (schematisch, keine Karte)
  monthly_02: S => {
    const lay = (x, y, w, h, bg, de, ar, fa, c, extra = '') => `<div class="abs glow" style="${pos(x, y, w, h)};border-radius:40px;background:${bg};border:4px solid #18263F" ${at(S.c(c) - 0.1, 'pop')} ${on(S.sp(c), R(S.w(4, de), S.w(4, de) + 0.8))}>
      <div style="position:absolute;left:28px;top:18px;font-family:Inter;font-weight:850;font-size:54px;letter-spacing:-.03em">${de} <span style="font-weight:700;font-size:30px;color:#5E9FCB">${ar}</span></div>
      <div style="position:absolute;right:28px;top:22px;font-family:Lalezar;font-size:42px;color:#2b3a57">${fa}</div>${extra}</div>`;
    return `
    ${lay(80, 136, 1000, 612, '#EFE4CF', 'Deutschland', 'das Land', 'آلمان', 1)}
    ${lay(150, 250, 860, 440, '#CFE7F7', 'Bayern', 'das Bundesland', 'بایرن', 2)}
    ${lay(230, 372, 700, 290, '#9FD0F0', 'München', 'die Stadt', 'مونیخ', 3, `<div style="position:absolute;left:30px;bottom:26px;font-family:Inter;font-weight:700;font-size:30px">Landeshauptstadt von Bayern</div><div style="position:absolute;right:40px;bottom:20px;width:70px;height:90px">${IC.pin()}</div>`)}
    <div class="abs" style="${pos(100, 704, 960)};text-align:right;font-family:Inter;font-weight:600;font-size:22px;color:#55607A" ${at(S.start + 1, 'fade')}>schematisch – keine Landkarte</div>
    ${card({ x: 1120, y: PY, w: 720, k: '3 Ebenen · سه سطح', de: 'Land → Bundesland → Stadt', size: 48, a: S.c(4), o: on(S.sp(4)) })}
    ${note({ x: 1120, y: 360, w: 720, de: 'nicht austauschbar', fa: 'جایگزین یکدیگر نیستند', a: S.c(5), icon: IC.cross() })}
    ${card({ x: 1120, y: 520, w: 720, k: 'wohnt in München', de: '= auch in Bayern<br>= auch in Deutschland', size: 46, a: S.c(6), o: on(S.sp(6)) })}
    `;
  },

  // 03 Wortschatz Land
  monthly_03: S => `
  ${[[IC.land(), 'das', 'Land', 'کشور', 2], [IC.state(), 'das', 'Bundesland', 'ایالت', 3], [IC.city(), 'die', 'Stadt', 'شهر', 4]]
    .map(([ic, ar, w, fa, c], i) => wc({ x: 80 + i * 600, y: PY, w: 560, h: 330, icon: ic, ar, word: w, fa, a: S.w(0, w === 'Land' ? 'das Land' : w) - 0.1, o: on(R(S.c(c), S.pause(c)[1])) })).join('')}
  ${chip({ x: 80, y: 500, de: 'Artikel + Wort lernen', fa: 'حرف تعریف + کلمه', icon: IC.check(), a: S.c(5), u: S.c(6) - 0.1 })}
  ${card({ x: 80, y: 496, w: 1760, k: 'Beispielsatz', de: `${mk('München', S.c(7))} ist eine Stadt in ${mk('Bayern', S.w(7, 'Bayern'))}.`, size: 72, a: S.c(6), o: on(S.sp(7)) })}
  ${note({ x: 80, y: 496, w: 1760, de: 'Die Grafik ist schematisch – keine Karte mit genauen Grenzen.', fa: 'تصویر جهت‌یابی شماتیک است، نه نقشه.', a: S.c(8) })}
  `,

  // 04 Bayern ist vielfältig (Wortkarte, keine Landkarte)
  monthly_04: S => {
    const city = (x, y, de, a, cls = '') => chip({ x, y, de, icon: IC.pin(), a, cls, fs: 44 });
    return `
    <div class="abs pc" style="${pos(80, PY, 900, PH)};padding-top:40px" ${at(S.start + 0.3)}>${rt(900)}<div class="k">Wortkarte · keine Landkarte</div></div>
    ${city(140, 250, 'München', S.c(0) + 0.3, 'navy')}
    ${city(520, 360, 'Nürnberg', S.w(1, 'Nürnberg'))}
    ${city(170, 480, 'Augsburg', S.w(1, 'Augsburg'))}
    ${city(510, 590, 'Regensburg', S.w(1, 'Regensburg'))}
    ${[['Städte', 'شهرها', IC.skyline(), 'Städte'], ['Landschaften', 'منظره‌ها', IC.tree(), 'Landschaften'], ['regionale Traditionen', 'سنت‌ها', IC.star(), 'Traditionen']]
      .map(([de, fa, ic, w], i) => iconRow({ x: 1020, y: PY + i * 106, w: 820, icon: ic, de, fa, a: S.w(2, w), fs: 46 })).join('')}
    <div class="abs pc" style="${pos(1020, 470, 820, 120)};display:flex;align-items:center;gap:20px;padding:0 30px" ${at(S.c(3))}><span style="width:56px;height:56px;flex:0 0 56px">${IC.cross()}</span><span style="position:relative;font-family:Inter;font-weight:800;font-size:36px;color:#55607A;white-space:nowrap">Alle Menschen in Bayern leben gleich.${strike}</span></div>
    ${chip({ x: 1020, y: 620, de: 'viele Perspektiven', fa: 'دیدگاه‌های زیاد', icon: IC.eye(), a: S.c(4), o: on(S.sp(4)) })}
    `;
  },

  // 05 Ankommen
  monthly_05: S => `
  ${photo(S, 'metro_interior.jpg', CAP.ub, '50% 50%')}
  ${chip({ x: PX, y: PY, de: 'ins Zentrum', fa: 'به مرکز', icon: IC.pin(), a: S.c(1) })}
  ${bub({ x: PX, y: 232, w: PW, cls: 'tight', side: 'r', who: 'Du', whoFa: 'تو', tx: `Entschuldigung,<br>wie komme ich zum ${mk('Marienplatz', S.w(3, 'Marienplatz'))}?`, a: S.c(2), o: on(S.sp(3)) })}
  ${note({ x: PX, y: 506, w: PW, de: 'Verbindung und Fahrpreis selbst prüfen.', fa: 'مسیر و قیمت را خودت بررسی کن.', a: S.c(4) })}
  ${chip({ x: PX, y: 676, de: 'Heute: die Frage', fa: 'امروز: سؤال', icon: IC.check(), a: S.c(6), o: on(S.sp(6)), fs: 30 })}
  `,

  // 06 Marienplatz
  monthly_06: S => {
    const items = [[IC.tower(), 'der', 'Turm', 'برج', 'Türme'], [IC.window(), 'das', 'Fenster', 'پنجره', 'Fenster'], [IC.facade(), 'die', 'Fassade', 'نما', 'Fassaden'], [IC.square(), 'der', 'Platz', 'میدان', 'Platz']];
    return `
    ${photo(S, 'marienplatz.jpg', CAP.mp, '50% 50%')}
    ${card({ x: PX, y: PY, w: PW, k: 'der Marienplatz · مارین‌پلاتس', de: `im Zentrum der Altstadt<br><span style="color:#5E9FCB">seit ${mk('1158', S.w(1, 'Stadtgründung'))}</span>`, size: 52, a: S.start + 0.4 })}
    ${items.map(([ic, ar, w, fa, sp], i) => `<div class="abs pc row glow" style="${pos(PX + (i % 2) * 370, 412 + Math.floor(i / 2) * 172, 350, 156)};padding:14px 18px;gap:12px" ${at(S.w(5, sp) - 0.1, 'pop')} ${on(R(S.w(6, w), S.w(6, w) + 0.9))}>
      <div style="width:84px;height:100px;flex:0 0 84px">${ic}</div><div><div style="font-family:Inter;font-weight:700;font-size:28px;color:#5E9FCB" ${at(S.w(6, w) - 0.1, 'fade')}>${ar}</div><div style="font-family:Inter;font-weight:850;font-size:46px;letter-spacing:-.03em;line-height:1">${w}</div><div style="font-family:Lalezar;font-size:36px;color:#2b3a57">${fa}</div></div></div>`).join('')}
    `;
  },

  // 07 Ein Foto lesen
  monthly_07: S => `
  ${photo(S, 'marienplatz.jpg', CAP.mp, '15% 60%')}
  ${card({ x: PX, y: PY, w: PW, k: 'Ein Foto lesen', de: 'Ein Foto = ein Moment', fa: 'عکس = یک لحظه', size: 54, a: S.start + 0.4, extra: `<div class="abs" style="right:28px;top:22px;width:80px;height:66px">${IC.camera()}</div>` })}
  <div class="abs" style="${pos(PX, 400, PW)};display:flex;gap:10px">
  ${chip({ de: 'am Abend', icon: IC.moon(), a: S.w(2, 'Abend'), fs: 30 })}
  ${chip({ de: 'Licht', icon: IC.sun(), a: S.w(3, 'Licht'), fs: 30 })}
  ${chip({ de: 'Perspektive', icon: IC.eye(), a: S.w(3, 'Perspektive'), fs: 30 })}</div>
  ${iconRow({ x: PX, y: 520, w: PW, h: 104, icon: IC.camera(), de: 'Was zeigt das Foto?', a: S.w(4, 'Was'), fs: 44, o: on(R(S.w(4, 'Was'), S.e(4))) })}
  ${iconRow({ x: PX, y: 640, w: PW, h: 104, icon: IC.read(), de: 'Was sagt mein Text?', a: S.c(5), fs: 44, o: on(S.sp(5)) })}
  `,

  // 08 Altstadt Wortschatz
  monthly_08: S => `
  ${wc({ x: 80, y: PY, w: 860, h: 320, icon: IC.skyline(), ar: 'die', word: 'Altstadt', sm: 'der historische Teil einer Stadt', fa: 'بافت قدیمی شهر', a: S.start + 0.4, o: on(S.sp(0)) })}
  ${wc({ x: 980, y: PY, w: 860, h: 320, icon: IC.star(), ar: 'die', word: 'Sehenswürdigkeit', sm: 'ein Ort, den Besucher interessant finden', fa: 'دیدنی', a: S.w(1, 'Sehenswürdigkeit'), o: on(S.sp(1), S.sp(2)) })}
  ${card({ x: 80, y: 490, w: 1760, k: 'Unser Satz', de: `Ich möchte die Altstadt ${mk('besichtigen', S.c(5))}.`, size: 72, a: S.c(3), o: on(S.sp(4), S.sp(7)), extra: `<div class="abs" style="right:36px;top:30px">${chip({ x: null, de: 'besichtigen = bewusst ansehen', a: S.c(5), fs: 32 })}</div>` })}
  `,

  // 09 Wegfrage üben
  monthly_09: S => {
    const u = S.c(5) - 0.15, t1 = S.c(6), w = S.wait(6);
    return `
    ${bub({ x: 860, y: 150, w: 980, side: 'r', who: 'Besucher', whoFa: 'بازدیدکننده', tx: 'Entschuldigung, wie komme ich zum Marienplatz?', a: S.c(1) - 0.15, u, o: on(S.sp(1)) })}
    ${bub({ x: 80, y: 340, w: 900, who: 'Andere Person', whoFa: 'رهگذر', tx: 'Gehen Sie geradeaus und dann links.', a: S.c(2) - 0.15, u, o: on(S.sp(2)) })}
    <div class="abs" style="${pos(1040, 350, 220, 150)};display:flex;gap:16px" ${at(S.w(2, 'geradeaus'), 'pop', u)}><span style="width:90px;height:90px">${IC.arrow('up')}</span><span style="width:90px;height:90px">${IC.arrow('left')}</span></div>
    ${bub({ x: 1340, y: 520, w: 500, side: 'r', who: 'Besucher', tx: 'Vielen Dank!', a: S.c(3) - 0.15, u, o: on(S.sp(3)) })}
    ${note({ x: 80, y: 560, w: 1200, de: 'Erfundenes Lernbeispiel – keine echte Wegbeschreibung.', fa: 'مسیر خیالی آموزشی', a: S.c(4), u })}
    ${card({ x: 80, y: PY, w: 1760, k: 'Jetzt du · نوبت توست', de: `Wie komme ich zum <span style="position:relative;display:inline-block;width:470px;height:80px;vertical-align:bottom;border-bottom:5px dashed #9FD0F0"><span class="abs" style="left:0;bottom:4px;color:#55607A" ${at(S.c(5), 'up', S.w(6, 'Bahnhof'))}>Marienplatz</span><span class="abs" style="left:0;bottom:4px;color:#5E9FCB" ${at(S.w(6, 'Bahnhof'), 'up')}>Bahnhof</span></span>?`, size: 72, a: S.c(5), o: on(S.sp(7)) })}
    ${wc({ x: 80, y: 420, w: 460, h: 320, icon: IC.station(), ar: 'der', word: 'Bahnhof', fa: 'ایستگاه قطار', a: S.w(6, 'Bahnhof') })}
    ${ring({ x: 1600, y: 470, s: 200, cd: w })}
    ${chip({ x: 600, y: 520, de: 'zum Marienplatz → zum Bahnhof', icon: IC.check(), a: S.c(7), fs: 38 })}
    `;
  },

  // 10 Grün in der Stadt
  monthly_10: S => `
  ${photo(S, 'english_garden.jpg', CAP.eg, '50% 40%')}
  ${wc({ x: PX, y: PY, w: PW, h: 250, icon: IC.tree(), ar: 'der', word: 'Englische Garten', sm: 'ein großer Park in München', a: S.w(1, 'Englische'), o: on(S.sp(1)) })}
  ${iconRow({ x: PX, y: 404, w: PW, h: 110, icon: IC.rotunda(), de: 'der Monopteros', fa: 'مونوپتروس', a: S.w(2, 'Monopteros'), fs: 46, o: on(S.sp(2)) })}
  ${[['Wege', 'مسیر', 'Wege'], ['Bäume', 'درخت', 'Bäume'], ['Plätze', 'محل مکث', 'Plätze']].map(([de, fa, w], i) => chip({ x: PX + [0, 220, 450][i], y: 540, de, a: S.w(4, w), fs: 36 })).join('')}
  ${chip({ x: PX, y: 650, de: 'zum Verweilen', fa: 'برای مکث', icon: IC.pause(), a: S.w(4, 'Verweilen'), fs: 34 })}
  `,

  // 11 Spazieren gehen
  monthly_11: S => `
  ${photo(S, 'english_garden.jpg', CAP.eg, '30% 70%')}
  ${wc({ x: PX, y: PY, w: PW, h: 250, icon: IC.walk(), word: 'spazieren gehen', fa: 'قدم زدن', a: S.w(0, 'spazieren'), o: on(S.sp(0)) })}
  ${chip({ x: PX, y: 404, de: 'ohne Eile', fa: 'بدون عجله', icon: IC.slow(), a: S.c(1), u: S.c(3) - 0.1 })}
  ${card({ x: PX, y: 404, w: PW, k: 'in + dem = im', de: `<span style="color:#55607A">in dem Park</span> → ${mk('im', S.c(3))} Park`, size: 52, a: S.c(3) })}
  ${card({ x: PX, y: 590, w: PW, h: 158, k: 'Unser Satz', de: 'Ich gehe im Park spazieren.', size: 50, a: S.w(2, 'Ich'), o: on(R(S.w(2, 'Ich'), S.e(2)), S.sp(6)) })}
  `,

  // 12 Pause: Platz oder Park?
  monthly_12: S => `
  ${photo(S, 'english_garden.jpg', CAP.eg, '70% 50%')}
  <div class="abs pc" style="${pos(PX, PY, PW, 190)};display:flex;align-items:center;gap:22px" ${at(S.start + 0.4, 'up', S.c(4) - 0.1)}>
    <div style="width:110px;height:90px">${IC.skyline()}</div><div class="de" style="font-size:56px">Platz oder Park?</div><div style="width:90px;height:100px">${IC.tree()}</div></div>
  ${card({ x: PX, y: PY, w: PW, h: 190, k: 'Dein Satz · جملهٔ تو', de: `Ich mag <span data-ty="${f3(S.wait(4)[0])},${f3(S.wait(4)[0] + 2)}">…………</span>`, size: 60, a: S.c(4) })}
  ${iconRow({ x: PX, y: 350, w: PW, h: 100, icon: IC.skyline(), de: 'Ich mag die Altstadt.', a: S.w(1, 'Ich'), fs: 46, o: on(R(S.w(1, 'Ich'), S.e(1))) })}
  ${iconRow({ x: PX, y: 466, w: PW, h: 100, icon: IC.tree(), de: `Ich mag <b style="color:#5E9FCB">den</b> Park.`, a: S.w(2, 'Ich'), fs: 46, o: on(R(S.w(2, 'Ich'), S.e(2))) })}
  ${chip({ x: PX, y: 600, de: 'der Park → den Park', fa: 'تغییر حرف تعریف', a: S.c(3), fs: 32 })}
  ${ring({ x: PX + 560, y: 156, s: 150, cd: S.wait(4) })}
  `,

  // 13 Alltag unterwegs
  monthly_13: S => `
  ${photo(S, 'metro_interior.jpg', CAP.ub, '15% 50%')}
  <div class="abs pc" style="${pos(PX, PY, PW, 190)};display:flex;align-items:center;justify-content:space-around;padding:20px" ${at(S.c(1))}>
    ${[[IC.walk(), 'zu Fuß'], [IC.bike(), 'Fahrrad'], [IC.bus(), 'Bus'], [IC.metro(), 'Bahn']].map(([ic, w]) => `<div style="width:130px;text-align:center" ${at(S.w(1, w), 'pop')}><div style="height:100px;display:flex;justify-content:center">${ic}</div><div style="font-family:Inter;font-weight:800;font-size:28px">${w}</div></div>`).join('')}</div>
  ${note({ x: PX, y: 350, w: PW, de: 'Nicht jeder hat denselben Weg.', fa: 'همه مسیر یکسان ندارند.', a: S.c(2), u: S.c(3) - 0.1 })}
  ${card({ x: PX, y: 350, w: PW, k: 'Sprachübung', de: 'Ich fahre mit der U-Bahn.', size: 54, a: S.w(3, 'Ich'), o: on(R(S.w(3, 'Ich'), S.e(3))) })}
  ${bub({ x: PX, y: 548, w: PW, side: 'r', who: 'Du', whoFa: 'تو', tx: `Wo muss ich ${mk('aussteigen', S.w(5, 'aussteigen'))}?`, a: S.c(4), o: on(S.sp(5)) })}
  `,

  // 14 Verkehrsmittel
  monthly_14: S => `
  ${[[IC.ubahn(), 'die', 'U-Bahn', 'مترو'], [IC.bus(), 'der', 'Bus', 'اتوبوس'], [IC.bike(), 'das', 'Fahrrad', 'دوچرخه'], [IC.station(), 'der', 'Bahnhof', 'ایستگاه قطار']]
    .map(([ic, ar, w, fa], i) => wc({ x: 80 + i * 445, y: PY, w: 425, h: 300, icon: ic, ar, word: w, fa, a: S.w(0, w) - 0.1, o: on(R(S.w(0, w), S.w(0, w) + 0.9), w === 'Bahnhof' ? S.sp(1) : []) })).join('')}
  ${chip({ x: 1390, y: 452, de: 'Ort, kein Verkehrsmittel', icon: IC.pin(), a: S.c(1), fs: 28 })}
  ${wc({ x: 80, y: 452, w: 460, h: 296, icon: IC.stop(), ar: 'die', word: 'Haltestelle', fa: 'ایستگاه (محل توقف)', a: S.c(2), o: on(S.sp(2)) })}
  ${card({ x: 580, y: 548, w: 1260, h: 200, k: 'Unsere Frage', de: `Wo ist die ${mk('nächste', S.w(4, 'nächste'))} Haltestelle?`, size: 62, a: S.c(3), o: on(S.sp(4)) })}
  `,

  // 14x Zwischenstopp: Persisch lesen → Deutsch sagen
  monthly_14x: S => zwischen(S),
  monthly_21x: S => zwischen(S),

  // 15 Bäckerei als Alltag
  monthly_15: S => `
  ${photo(S, 'bakery.jpg', CAP.bk, '50% 50%')}
  ${note({ x: PX, y: PY, w: PW, de: 'Foto aus Berlin – nicht aus München.', fa: 'عکس از برلین است، نه مونیخ.', a: S.c(1), icon: IC.pin() })}
  ${chip({ x: PX, y: 300, de: 'ehrliche Ortsangaben', fa: 'معرفی درست مکان', icon: IC.check(), a: S.c(3), o: on(S.sp(3)), fs: 30 })}
  ${card({ x: PX, y: 410, w: PW, h: 220, k: 'Der Satz passt', de: 'Ich hätte gern<br>eine Brezel, bitte.', size: 52, a: S.w(4, 'Ich'), o: on(R(S.w(4, 'Ich'), S.e(4))), extra: `<div class="abs" style="right:24px;top:60px;width:150px">${IC.pretzel()}</div>` })}
  ${chip({ x: PX, y: 656, de: 'bekannt aus: „Ein Morgen in Deutschland“', a: S.c(5), fs: 28 })}
  `,

  // 16 Brezel und Brezn
  monthly_16: S => `
  <div class="abs pc glow" style="${pos(80, PY, 840, 360)};text-align:center" ${at(S.c(0))} ${on(R(S.w(0, 'Brezel'), S.e(0) + 0.6))}><div class="k">Standarddeutsch</div><div class="de l"><span style="font-size:40px;color:#5E9FCB;font-weight:700">die</span> Brezel</div><div class="fa" style="text-align:center">آلمانی معیار</div></div>
  <div class="abs" style="${pos(800, 150, 320, 300)};z-index:2" ${at(S.c(1) - 0.2, 'pop')}>${IC.pretzel()}</div>
  <div class="abs pc glow" style="${pos(1000, PY, 840, 360)};text-align:center;padding-top:44px" ${at(S.w(1, 'Brezn'))} ${on(R(S.w(1, 'Brezn'), S.e(1) + 0.6))}>${rt(840)}<div class="k">in Bayern auch</div><div class="de l"><span style="font-size:40px;color:#5E9FCB;font-weight:700">die</span> Brezn</div><div class="fa" style="text-align:center">واژهٔ محلی</div></div>
  ${note({ x: 80, y: 530, w: 840, de: 'Kein Dialekt nötig – höflich bestellen reicht.', fa: 'تقلید لهجه لازم نیست.', a: S.c(3), u: S.c(6) - 0.1 })}
  ${chip({ x: 1000, y: 530, de: 'Ausgangspunkt: Standarddeutsch', icon: IC.check(), a: S.c(4), u: S.c(6) - 0.1, fs: 32 })}
  ${chip({ x: 1000, y: 640, de: 'regionale Wörter ergänzen', icon: IC.star(), a: S.c(5), u: S.c(6) - 0.1, fs: 32 })}
  ${card({ x: 80, y: 530, w: 1760, h: 210, k: 'Beispielsatz', de: `${mk('Eine Brezel', S.c(7))}, bitte.`, size: 78, a: S.c(6), o: on(S.sp(7)) })}
  `,

  // 17 Tradition ohne Klischee
  monthly_17: S => `
  ${[[IC.star(), 'die', 'Tradition', 'سنت', 'Traditionen', 0], [IC.roles(), 'die', 'Tracht', 'لباس سنتی', 'Tracht', 1], [IC.sun(), 'das', 'Fest', 'جشن', 'Feste', 2]]
    .map(([ic, ar, w, fa, sw, c], i) => iconRow({ x: 80, y: PY + i * 112, w: 760, h: 100, icon: ic, de: `<span style="font-size:30px;color:#5E9FCB">${ar}</span> ${w}`, fa, a: S.w(c, sw) - 0.1, fs: 50 })).join('')}
  <div class="abs pc" style="${pos(880, PY, 960, 320)}" ${at(S.c(3))}>
    <div style="display:flex;gap:24px;height:100%">
      <div style="flex:1;background:#E4F2FB;border-radius:24px;padding:20px"><div style="width:60px;height:60px">${IC.check()}</div><div style="font-family:Inter;font-weight:850;font-size:40px;margin-top:10px">Tradition</div><div style="font-family:Inter;font-weight:600;font-size:28px;color:#55607A">gehört zu einer Region</div></div>
      <div style="flex:1;background:#F2EEE6;border-radius:24px;padding:20px"><div style="width:60px;height:60px">${IC.cross()}</div><div style="font-family:Inter;font-weight:850;font-size:40px;margin-top:10px">„Alle Menschen …“</div><div style="font-family:Inter;font-weight:600;font-size:28px;color:#55607A">allgemeine Behauptung</div></div></div></div>
  ${note({ x: 80, y: 490, w: 760, de: 'Nicht jede Person trägt Tracht.', fa: 'همه لباس سنتی نمی‌پوشند.', a: S.c(1), u: S.c(4) - 0.1 })}
  ${card({ x: 80, y: 490, w: 1760, h: 250, k: 'Ein guter Satz', de: `Diese Tradition ist in der Region ${mk('bekannt', S.w(4, 'bekannt'))}.`, size: 64, a: S.c(4), o: on(R(S.w(4, 'Diese'), S.e(4))) })}
  `,

  // 18 Sprache und Dialekt
  monthly_18: S => `
  ${[['Servus', 'regional', S.w(0, 'Servus')], ['Grüß Gott', 'regional', S.w(0, 'Grüß')], ['Guten Tag', 'Standard', S.w(2, 'Guten')]]
    .map(([de, sm, a], i) => `<div class="abs pc glow" style="${pos(80 + i * 600, PY, 560, 230)};text-align:center;${i < 2 ? 'padding-top:44px' : ''}" ${at(a - 0.1, 'pop')} ${on(R(a, a + 1.2))}>${i < 2 ? rt(560) : ''}<div class="de l">${de}</div><div class="k" style="margin-top:6px">${sm}</div></div>`).join('')}
  ${chip({ x: 80, y: 400, de: 'Dialekt kann ungewohnt klingen', fa: 'لهجه ممکن است ناآشنا باشد', icon: IC.ear(), a: S.c(3) })}
  <div class="abs pc row glow" style="${pos(80, 500, 1760, 116)};padding:10px 30px" ${at(S.w(4, 'Können'))} ${on(R(S.w(4, 'Können'), S.e(4)))}><div style="width:90px;height:90px;flex:0 0 90px">${IC.repeat()}</div><div class="de" style="font-size:58px">Können Sie das bitte wiederholen?</div></div>
  <div class="abs pc row glow" style="${pos(80, 632, 1760, 116)};padding:10px 30px" ${at(S.c(5))} ${on(S.sp(5))}><div style="width:100px;height:86px;flex:0 0 100px">${IC.slow()}</div><div class="de" style="font-size:58px">Können Sie bitte langsamer sprechen?</div></div>
  `,

  // 19 Wirtschaft
  monthly_19: S => `
  ${photo(S, 'bmw_headquarters.jpg', CAP.bmw, '50% 50%')}
  ${chip({ x: PX, y: PY, de: 'Alltag · Tradition → Wirtschaft', icon: IC.layers(), a: S.c(0), fs: 32 })}
  ${iconRow({ x: PX, y: 250, w: PW, h: 110, icon: IC.factory(), de: 'ein Werk', fa: 'کارخانه', a: S.w(1, 'Werk'), fs: 50 })}
  ${iconRow({ x: PX, y: 374, w: PW, h: 110, icon: IC.flask(), de: 'Forschung', fa: 'پژوهش', a: S.w(1, 'Forschung'), fs: 50 })}
  ${note({ x: PX, y: 510, w: PW, de: 'Foto: Unternehmenszentrale – keine Fabrik.', fa: 'عکس: دفتر مرکزی، نه کارخانه', a: S.c(2), icon: IC.office() })}
  ${chip({ x: PX, y: 664, de: 'keine Werbung', fa: 'تبلیغ نیست', icon: IC.info(), a: S.c(4), o: on(S.sp(4)) })}
  `,

  // 20 Industrie Wortschatz
  monthly_20: S => {
    const t1 = S.w(8, 'Architektur'), t2 = S.w(8, 'Geschichte');
    const slot = (txt, a, u) => `<span class="abs" style="left:0;bottom:4px;color:#5E9FCB;white-space:nowrap" ${at(a, 'up', u)}>${txt}</span>`;
    return `
    ${[[IC.factory(), 'die', 'Industrie', 'صنعت', 0, ''], [IC.office(), 'das', 'Unternehmen', 'شرکت', 1, 'eine Organisation, die wirtschaftlich tätig ist'], [IC.flask(), 'die', 'Forschung', 'پژوهش', 2, 'Fragen systematisch untersuchen']]
      .map(([ic, ar, w, fa, c, def], i) => wc({ x: 80 + i * 600, y: PY, w: 560, h: 340, icon: ic, ar, word: w, fa, a: S.c(c) - 0.1, o: on(S.sp(c), i === 1 ? S.sp(4) : i === 2 ? S.sp(5) : []),
        extra: def ? `<div class="sm" style="font-size:24px" ${at(S.c(i + 3), 'fade')}>${def}</div>` : '' })).join('')}
    ${card({ x: 80, y: 510, w: 1760, h: 230, k: 'Unser Satz', de: `Ich interessiere mich für <span style="position:relative;display:inline-block;width:480px;height:84px;vertical-align:bottom;border-bottom:5px dashed #9FD0F0">${slot('Technik', S.c(6), t1)}${slot('Architektur', t1, t2)}${slot('Geschichte', t2)}</span>.`, size: 70, a: S.c(6), o: on(S.sp(7)) })}
    `;
  },

  // 21 Lernen und Forschung
  monthly_21: S => `
  <div class="abs pc row" style="${pos(80, PY, 1760, 200)}" ${at(S.w(1, 'Technische'))}><div style="width:170px;height:130px;flex:0 0 170px">${IC.gradcap()}</div><div><div class="k">ein Beispiel · یک مثال</div><div class="de" style="font-size:60px">Technische Universität München</div></div></div>
  ${chip({ x: 80, y: 360, de: 'Naturwissenschaften', fa: 'علوم طبیعی', icon: IC.flask(), a: S.w(1, 'Naturwissenschaften'), fs: 34 })}
  ${chip({ x: 760, y: 360, de: 'Ingenieurwissenschaften', fa: 'مهندسی', icon: IC.gear(), a: S.w(1, 'Ingenieurwissenschaften'), fs: 34 })}
  ${chip({ x: 1450, y: 360, de: 'keine Liste', icon: IC.info(), a: S.c(2), fs: 30 })}
  ${bub({ x: 80, y: 470, w: 760, who: 'Frage', whoFa: 'سؤال', tx: `Was ${mk('studierst', S.w(4, 'studierst'))} du?`, a: S.c(3), o: on(S.sp(4)) })}
  ${bub({ x: 900, y: 470, w: 940, side: 'r', who: 'Antwort', whoFa: 'پاسخ', tx: 'Ich studiere Bauingenieurwesen.', tf: 'مهندسی عمران می‌خوانم.', a: S.c(5), o: on(S.sp(6)) })}
  `,

  // 22 Drei Interessen
  monthly_22: S => `
  ${[[IC.culture(), 'Kultur', 'فرهنگ', 3], [IC.tree(), 'Natur', 'طبیعت', 4], [IC.gear(), 'Technik', 'فناوری', 5]].map(([ic, w, fa, c], i) =>
    `<div class="abs pc glow" style="${pos(80 + i * 600, PY, 560, 420)};text-align:center" ${at(S.w(1, w) - 0.1, 'pop')} ${on(S.sp(c))}>
      <div style="height:150px;display:flex;justify-content:center">${ic}</div><div class="de l">${w}</div><div class="fa" style="text-align:center">${fa}</div>
      <div style="font-family:Inter;font-weight:700;font-size:30px;color:#55607A;margin-top:8px" ${at(S.c(c), 'fade')}>Ich interessiere mich für ${w}.</div></div>`).join('')}
  ${chip({ x: 80, y: 600, de: 'Du bist dran!', fa: 'نوبت توست', icon: IC.speak(), a: S.c(6), cls: 'navy' })}
  ${ring({ x: 1660, y: 576, s: 170, cd: S.wait(7) })}
  ${chip({ x: 560, y: 600, de: 'keine perfekte Aussprache nötig', icon: IC.check(), a: S.c(8), fs: 32 })}
  `,

  // 23 Mini-Reise planen
  monthly_23: S => `
  ${note({ x: 80, y: PY, w: 1760, de: 'Keine echte Reise – eine Sprachaufgabe.', fa: 'یک تمرین زبانی، نه سفر واقعی', a: S.c(0), u: S.c(1) - 0.1 })}
  ${[[IC.skyline(), 'zuerst', 'اول', 'Vormittag: Altstadt', 1, 4, 'Zuerst gehe ich zum Marienplatz.'], [IC.tree(), 'danach', 'سپس', 'danach: Park', 2, 5, 'Danach gehe ich in den Park.']].map(([ic, k, fa, lab, c, cs, s], i) =>
    `<div class="abs pc glow" style="${pos(80 + i * 900, PY, 860, 380)}" ${at(S.c(c) - 0.1)} ${on(S.sp(cs))}>
      <div style="display:flex;align-items:center;gap:20px"><span style="width:130px;height:100px">${ic}</span><span class="chip navy" style="position:relative">${k} <span class="fa">${fa}</span></span></div>
      <div style="font-family:Inter;font-weight:700;font-size:32px;color:#55607A;margin-top:12px">${lab}</div>
      <div class="de" style="font-size:52px;margin-top:10px" ${at(S.c(cs) - 0.1, 'fade')}>${s}</div></div>`).join('')}
  <div class="abs" style="${pos(900, 280, 120, 100)};z-index:3" ${at(S.c(2), 'pop')}>${IC.arrow('right')}</div>
  ${card({ x: 80, y: 548, w: 860, h: 200, k: 'Wohin? · به کجا؟', de: `in ${mk('den', S.w(7, 'In den'))} Park`, size: 66, a: S.w(7, 'Wohin'), o: on(R(S.w(7, 'Wohin'), S.w(7, 'Wo gehe'))) })}
  ${card({ x: 980, y: 548, w: 860, h: 200, k: 'Wo? · کجا؟', de: `${mk('im', S.w(7, 'Im Park'))} Park`, size: 66, a: S.w(7, 'Wo gehe'), o: on(R(S.w(7, 'Wo gehe'), S.e(7))) })}
  `,

  // 24 Dialog Kultur
  monthly_24: S => chat(S, 'Person A', { 'Person A': 'نفر اول', 'Person B': 'نفر دوم' }, ['Gespräch', 'گفت‌وگو']),

  // 24x Deine Rolle (zweiter Durchlauf mit Antwortpause)
  monthly_24x: S => {
    const rounds = [[1, 2], [3, 4], [5, 6]];
    return `
    ${chip({ x: 80, y: PY, de: 'Du bist Person B', fa: 'تو نفر دوم هستی', icon: IC.roles(), a: S.c(0), cls: 'navy', u: S.c(7) - 0.1 })}
    ${rounds.map(([q, a], k) => { const u = k < 2 ? S.c(rounds[k + 1][0]) - 0.1 : S.c(7) - 0.1, w = S.wait(q);
      return `${bub({ x: 80, y: 250, w: 1000, who: 'Person A', whoFa: 'نفر اول', tx: S.sc.cues[q].say, a: S.c(q) - 0.1, u, o: on(S.sp(q)) })}
      <div class="bub r glow" style="${pos(780, 450, 1060, 250)}" ${at(w[0] - 0.2, 'up', u)} ${on(S.sp(a))}>
        <div class="who">Du · Person B <span class="fa">تو</span></div>
        <div class="tx" style="color:#9FD0F0;font-size:80px;line-height:1" ${at(w[0], 'fade', S.c(a) - 0.2)}>• • •</div>
        <div class="tx" style="position:absolute;left:36px;top:84px;width:780px" ${at(S.c(a) - 0.1, 'up')}>${S.sc.cues[a].say}</div>
        <div class="tf" style="position:absolute;left:36px;bottom:16px;text-align:left" ${at(S.c(a) - 0.1, 'fade')}>Musterantwort · پاسخ نمونه</div>
        ${ring({ x: 880, y: 50, s: 140, cd: w })}</div>`; }).join('')}
    ${card({ x: 260, y: 250, w: 1400, h: 380, de: 'Super!', fa: 'عالی! همهٔ نقش را گفتی.', size: 110, a: S.c(7), st: ';display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center' })}
    `;
  },

  // 25 Quiz Stadt und Land
  monthly_25: S => {
    const u1 = S.c(5) - 0.2, u2 = S.c(7) - 0.2, q2 = S.c(5) + 0.4, q3 = S.c(7) + 0.4;
    return `
    ${chip({ x: 80, y: PY, de: 'Quiz 1/3', fa: 'آزمون', icon: IC.check(), a: S.start + 0.3, cls: 'navy', u: u1 })}
    ${chip({ x: 80, y: PY, de: 'Quiz 2/3', fa: 'آزمون', icon: IC.check(), a: S.c(5), cls: 'navy', u: u2 })}
    ${chip({ x: 80, y: PY, de: 'Quiz 3/3', fa: 'آزمون', icon: IC.check(), a: S.c(7), cls: 'navy' })}
    ${qtext('Was ist <span style="color:#5E9FCB">Bayern</span>?', S.c(0) + 0.3, u1)}
    ${opt(S, 380, 'A', 'eine Stadt', S.c(1) - 0.1, u1, 0, S.c(4))}
    ${opt(S, 494, 'B', 'ein Bundesland', S.c(2) - 0.1, u1, 1, S.c(4), S.sp(2))}
    ${opt(S, 608, 'C', 'ein Bahnhof', S.c(3) - 0.1, u1, 0, S.c(4))}
    <div ${at(S.wait(3)[0] - 0.3, 'fade', u1)}>${ring({ x: 1620, y: 420, s: 200, cd: S.wait(3) })}</div>
    ${qtext('Was ist <span style="color:#5E9FCB">München</span>?', S.c(5), u2)}
    ${opt(S, 380, 'A', 'ein Bundesland', q2 + 0.4, u2, 0, S.c(6))}
    ${opt(S, 494, 'B', 'ein Park', q2 + 0.7, u2, 0, S.c(6))}
    ${opt(S, 608, 'C', 'eine Stadt und die Landeshauptstadt', q2 + 1.0, u2, 1, S.c(6), S.sp(6))}
    <div ${at(S.wait(5)[0] - 0.3, 'fade', u2)}>${ring({ x: 1620, y: 420, s: 200, cd: S.wait(5) })}</div>
    ${qtext('Unser Beispiel für einen <span style="color:#5E9FCB">Park</span>?', S.c(7))}
    ${opt(S, 380, 'A', 'der Marienplatz', q3 + 0.6, null, 0, S.c(8))}
    ${opt(S, 494, 'B', 'der Englische Garten', q3 + 0.9, null, 1, S.c(8), S.sp(8))}
    ${opt(S, 608, 'C', 'der Bahnhof', q3 + 1.2, null, 0, S.c(8))}
    ${ring({ x: 1620, y: 420, s: 200, cd: S.wait(7) })}
    `;
  },

  // 26 Quiz sprechen
  monthly_26: S => `
  ${chip({ x: 80, y: PY, de: 'Ohne Auswahl', fa: 'بدون گزینه', icon: IC.speak(), a: S.start + 0.3, cls: 'navy' })}
  ${[[1, 5, IC.station(), 'Weg zum Bahnhof?'], [2, 6, IC.tree(), 'im Park spazieren?'], [3, 7, IC.gear(), 'Interesse: Technik?']].map(([q, a, ic, lab], i) =>
    `<div class="abs pc glow" style="${pos(80, 236 + i * 172, 1760, 156)};display:flex;align-items:center;gap:28px;padding:0 34px" ${at(S.c(q) - 0.1)} ${on(S.sp(q), S.sp(a))}>
      <span style="width:100px;height:100px;flex:0 0 100px">${ic}</span>
      <div style="flex:1"><div style="font-family:Inter;font-weight:700;font-size:30px;color:#55607A">${lab}</div>
      <div class="de" style="font-size:56px;color:#18263F" ${at(S.c(a) - 0.1, 'up')}>${S.sc.cues[a].say}</div></div>
      <div style="position:relative;width:130px;height:130px">${ring({ x: 0, y: 0, s: 130, cd: S.wait(q) })}</div></div>`).join('')}
  `,

  // 27 Rückblick: Foto-Mosaik (nur München-Fotos)
  monthly_27: S => {
    const ph = [['marienplatz.jpg', 'Marienplatz', '50% 45%'], ['english_garden.jpg', 'Englischer Garten', '50% 40%'], ['metro_interior.jpg', 'U-Bahn', '50% 50%'], ['bmw_headquarters.jpg', 'BMW-Zentrale', '50% 50%']];
    return `
    ${ph.map(([f, cap, op], i) => `<div class="abs photo" style="${pos(80 + (i % 2) * 510, PY + Math.floor(i / 2) * 316, 490, 296)}" ${at(S.start + 0.2 + i * 0.25, 'pop')}><img src="../assets/${f}" data-kb="1" style="object-position:${op}"><div class="cap" style="font-size:18px">${cap}</div></div>`).join('')}
    <div class="abs" style="${pos(1140, 724, 700)};font-family:Inter;font-weight:600;font-size:17px;color:#55607A" ${at(S.start + 1, 'fade')}>Fotos: A. Omelyanchuk, M. Petruzzelli, M. Geller, Y. Semenyaga / Pexels</div>
    ${[['Stadt &amp; Bundesland', 'شهر و ایالت', 'Stadt'], ['Altstadt &amp; Park', 'بافت قدیمی و پارک', 'Altstadt'], ['Alltag &amp; Industrie', 'روزمره و صنعت', 'Alltag']].map(([de, fa, w], i) =>
      iconRow({ x: 1140, y: PY + i * 110, w: 700, h: 96, icon: IC.check(), de, fa, a: S.w(0, w), fs: 40 })).join('')}
    ${note({ x: 1140, y: 480, w: 700, de: 'Kein Foto erzählt alles.', fa: 'هیچ عکسی همه‌چیز را نمی‌گوید.', a: S.c(1) })}
    ${chip({ x: 1140, y: 640, de: 'Beobachten → Sätze', icon: IC.eye(), a: S.c(3), o: on(S.sp(3)) })}
    `;
  },

  // 28 Abschluss
  monthly_28: S => {
    const u = S.c(4) - 0.1;
    return `
    <div class="abs pc glow" style="${pos(80, PY, 840, 300)}" ${at(S.start + 0.3, 'up', u)} ${on(S.sp(0), S.sp(1))}>
      <div class="k" style="display:flex;align-items:center;gap:14px"><span style="width:44px;height:44px">${IC.comment()}</span>Kommentar · کامنت</div>
      <div style="font-family:Inter;font-weight:850;font-size:56px;letter-spacing:-.03em">Nächste Stadt?</div>
      <div style="border:3px solid #CFE7F7;border-radius:20px;padding:10px 22px;font-family:Inter;font-weight:700;font-size:40px;margin-top:14px;height:72px;white-space:nowrap"><span data-ty="${f3(S.c(1))},${f3(S.c(1) + 1.8)}">Stadt: … · Grund: …</span><span style="color:#5E9FCB">|</span></div></div>
    <div class="abs pc row glow" style="${pos(960, PY, 880, 300)}" ${at(S.c(2), 'up', u)} ${on(S.sp(2))}>
      <div style="width:90px;height:110px;flex:0 0 90px">${IC.bookmark()}</div><div><div class="de" style="font-size:54px">3 Sätze speichern</div><div class="fa" style="text-align:left">سه جمله را ذخیره و تمرین کن</div></div></div>
    <div class="abs" style="${pos(80, 470, 1760, 200)};display:flex;align-items:center;justify-content:center" ${at(S.c(3), 'pop', u)}>
      <div class="glow" style="display:flex;align-items:center;gap:22px;background:#18263F;color:#FFFBF3;border-radius:999px;padding:24px 46px 26px 30px;font-family:Inter;font-weight:850;font-size:54px" ${on(S.sp(3))}>
        <span style="width:70px;height:70px">${IC.bell()}</span>Abonnieren <span style="font-family:Lalezar;font-weight:400;font-size:48px;color:#9FD0F0">سابسکرایب</span></div></div>
    <div class="abs pc" style="${pos(160, 190, 1600, 500)};display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding-top:50px" ${at(S.c(4) + 0.1, 'pop')}>${rt(1600)}
      <div class="de l" style="font-size:76px">Jeden Tag einen Schritt näher<br>an die ${mk('deutsche Sprache', S.w(4, 'deutsche'))}.</div>
      <div class="fa" style="text-align:center;font-size:52px;margin-top:22px">هر روز یک قدم به زبان آلمانی نزدیک‌تر.</div>
      <div class="logo" style="position:relative;margin-top:30px;transform:scale(1.2)">${DMF.logo()}</div></div>
    `;
  },

  // 24y Mini-Geschichte (erfunden)
  monthly_24y: S => {
    const panels = [[IC.pin(), 'am Morgen', 'صبح', [1, 2]], [IC.skyline(), 'zuerst: Altstadt', 'بافت قدیمی', [3, 4]], [IC.tree(), 'danach: Park', 'پارک', [5, 6]], [IC.pretzel(), 'Nachmittag', 'بعدازظهر', [7]], [IC.culture(), 'Kultur + Natur', 'فرهنگ و طبیعت', [8]]];
    const q = [[9, 10], [11, 12]];
    return `
    ${panels.map(([ic, de, fa, cs], i) => `<div class="abs pc glow" style="${pos(80 + i * 356, PY, 336, 300)};text-align:center;padding:22px 16px" ${at(S.c(cs[0]) - 0.1, 'pop')} ${on(...cs.map(c => S.sp(c)))}>
      <div style="position:absolute;left:16px;top:14px;width:44px;height:44px;border-radius:50%;background:#18263F;color:#FFFBF3;font-family:Inter;font-weight:850;font-size:24px;display:grid;place-items:center">${i + 1}</div>
      <div style="height:140px;display:flex;justify-content:center;align-items:center"><div style="width:150px;height:130px;display:flex;justify-content:center;align-items:center">${ic}</div></div><div style="font-family:Inter;font-weight:800;font-size:32px;line-height:1.1">${de}</div><div class="fa" style="text-align:center;font-size:36px;margin-top:4px">${fa}</div></div>`).join('')}
    <div class="abs pc row" style="${pos(80, 470, 1760, 140)}" ${at(S.c(0) + 0.3, 'up', S.c(9) - 0.15)}><div style="width:100px;height:100px;flex:0 0 100px">${IC.person('#CFE7F7')}</div><div><div class="k">Geschichte · erfunden</div><div class="de" style="font-size:60px">Sara in München</div></div></div>
    ${q.map(([c, a], k) => { const u = k === 0 ? S.c(q[1][0]) - 0.15 : null;
      return `${card({ x: 80, y: 470, w: 1500, h: 140, k: `Frage ${k + 1}`, de: S.sc.cues[c].say.replace(/^\w+ Frage: /, ''), size: 54, a: S.c(c), u })}
      ${ring({ x: 1640, y: 450, s: 180, cd: S.wait(c) })}
      ${chip({ x: 80, y: 640, de: S.sc.cues[a].say, icon: IC.check(), a: S.c(a) - 0.1, u, fs: 40, o: on(S.sp(a)) })}`; }).join('')}
    `;
  },

  // 26x Wortschatz-Check
  monthly_26x: S => {
    const ws = S.sc.cues.slice(1, -1);
    return `
    ${ws.map((c, i) => { const [ar, ...rest] = c.show.split(' ');
      return `<div class="abs pc glow" style="${pos(80 + (i % 3) * 595, PY + Math.floor(i / 3) * 122, 570, 108)};display:flex;align-items:center;gap:14px;padding:0 26px" ${at(c.start - 0.1, 'pop')} ${on(R(c.start, c.pause[1]))}>
        <span style="font-family:Inter;font-weight:700;font-size:30px;color:#5E9FCB">${ar}</span><span style="font-family:Inter;font-weight:850;font-size:${rest.join(' ').length > 13 ? 40 : 46}px;letter-spacing:-.03em;white-space:nowrap">${rest.join(' ')}</span>
        <span style="margin-left:auto;font-family:Lalezar;font-size:38px;color:#2b3a57;white-space:nowrap">${c.fa}</span></div>`; }).join('')}
    ${chip({ x: 80 + 595, y: PY + 4 * 122 + 12, de: `${ws.length} Wörter mit Artikel`, fa: 'واژه با حرف تعریف', icon: IC.check(), a: S.c(ws.length + 1), cls: 'navy', o: on(S.sp(ws.length + 1)) })}
    `;
  },
};
