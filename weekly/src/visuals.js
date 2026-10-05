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

const VIS = {
  // 01 Hook ------------------------------------------------------------
  weekly_01: S => `
  ${photo(S, 'bread_coffee.jpg', 'Symbolbild · Foto: Angela Khebou / Pexels', '50% 62%')}
  <div class="abs pc" style="${pos(PX, 136, PW)}" ${at(S.start + 0.4)}>
    <div class="k">Deutsch mit Farsi · A1–A2</div>
    <div class="de">Ein ${mk('Morgen', S.start + 1.0)}<br>in Deutschland</div>
    <div class="fa">یک صبح در آلمان</div></div>
  ${wc({ x: PX, y: 446, w: 340, h: 300, icon: IC.roll(), ar: 'das', word: 'Brötchen', fa: 'نان کوچک', a: S.w(1, 'Brötchen'), u: S.c(2) })}
  ${wc({ x: PX + 380, y: 446, w: 340, h: 300, icon: IC.coffee(), ar: 'der', word: 'Kaffee', fa: 'قهوه', a: S.w(1, 'Kaffee'), u: S.c(2) })}
  <div class="abs" style="${pos(PX + 150, 450, 420, 290)}" ${at(S.c(2), 'pop', S.c(4))}>${IC.think()}</div>
  ${[['bestellen', 'سفارش', IC.coffee(), 'bestellen'], ['nach dem Preis fragen', 'پرسیدن قیمت', IC.tag(), 'Preis'], ['zur Arbeit fahren', 'رفتن به محل کار', IC.ubahn(), 'Arbeit'], ['Kollegen begrüßen', 'سلام به همکاران', IC.roles(), 'Kollegen']]
    .map(([de, fa, ic, wd], i) => chip({ x: PX, y: 446 + i * 76, de, fa, icon: ic, a: S.w(4, wd), fs: 32 })).join('')}
  `,

  // 02 Lernplan --------------------------------------------------------
  weekly_02: S => `
  <div class="abs" style="${pos(80, 150, 1760)}" ${at(S.start + 0.3)}><div class="h1">So lernst du mit diesem Video</div></div>
  <div class="abs h1f" style="${pos(1140, 168, 700)};text-align:right" ${at(S.start + 0.5)}>روش یادگیری با این ویدیو</div>
  ${[[IC.ear(), 'Zuhören', 'گوش کن', 1], [IC.read(), 'Deutsch und Persisch lesen', 'بخوان', 2], [IC.speak(), 'Langsam mitsprechen', 'همراه بگو', 3], [IC.pause(), 'Video pausieren', 'مکث کن', 4], [IC.roles(), 'Selbst die Rolle spielen', 'نقش بازی کن', 5]]
    .map(([ic, de, fa, c], i) => `<div class="step glow" style="${pos(80 + i * 358, 292, 328, 440)}" ${at(S.start + 0.7 + i * 0.18)} ${on(S.sp(c))}>
      <div class="n">${i + 1}</div><div class="im">${ic}</div><div class="de">${de}</div><div class="fa">${fa}</div></div>`).join('')}
  `,

  // 03 Begrüßen --------------------------------------------------------
  weekly_03: S => `
  ${photo(S, 'bakery.jpg', 'Symbolbild · Bäckerei in Berlin · Foto: Manish Jain / Pexels', '50% 50%')}
  <div class="abs pc glow" style="${pos(PX, 136, PW)}" ${at(S.w(0, 'Begrüßung'))} ${on(S.sp(1))}>
    <div class="abs" style="right:30px;top:24px;width:96px;height:96px">${IC.sun()}</div>
    <div class="k">Begrüßung</div><div class="de l" style="font-size:72px">${mk('Guten Morgen!', S.c(1))}</div><div class="fa">صبح بخیر!</div></div>
  ${chip({ x: PX, y: 382, de: 'am Morgen', fa: 'صبح', icon: IC.sun(), a: S.w(2, 'Morgen') })}
  ${chip({ x: PX + 330, y: 382, de: '„bitte“', fa: 'لطفاً', icon: IC.check(), a: S.w(5, 'bitte'), o: on(R(S.w(5, 'bitte') - 0.1, S.e(5))) })}
  <div class="abs pc glow" style="${pos(PX, 482, PW, 266)}" ${at(S.c(6))} ${on(S.sp(7))}>
    <div class="k">Unser erster Satz</div><div class="de s">Guten Morgen! Ich hätte gern zwei ${mk('Brötchen', S.w(7, 'Brötchen'))}, bitte.</div></div>
  `,

  // 04 Bestellen -------------------------------------------------------
  weekly_04: S => {
    const t1 = S.w(2, 'einen Kaffee'), t2 = S.w(2, 'eine Brezel'), t3 = S.w(2, 'zwei Brötchen');
    const slot = (txt, a, u) => `<span class="abs" style="left:0;bottom:6px;white-space:nowrap;color:#5E9FCB" ${at(a, 'up', u)}>${txt}</span>`;
    return `
  <div class="abs pc glow" style="${pos(80, 136, 1760, 250)}" ${at(S.start + 0.3)} ${on(S.sp(0))}>
    <div class="k">Höflich bestellen</div>
    <div class="de l" style="font-size:72px;white-space:nowrap">${mk('Ich hätte gern', S.c(1))} <span style="position:relative;display:inline-block;width:540px;height:86px;vertical-align:bottom;border-bottom:5px dashed #9FD0F0">
      ${slot('zwei Brötchen', S.start + 0.3, t1)}${slot('einen Kaffee', t1, t2)}${slot('eine Brezel', t2, t3)}${slot('zwei Brötchen', t3)}</span>, bitte.</div>
    <div class="abs" style="right:40px;top:28px;width:150px;height:105px">${IC.roll()}</div></div>
  ${[[IC.coffee(), 'der', 'Kaffee', 'einen Kaffee', 'قهوه', t1], [IC.pretzel(), 'die', 'Brezel', 'eine Brezel', 'پرتزل', t2], [IC.roll(), 'das', 'Brötchen', 'zwei Brötchen', 'دو نان کوچک', t3]]
    .map(([ic, ar, w, sm, fa, a], i) => wc({ x: 80 + i * 600, y: 420, w: 560, h: 310, icon: ic, ar, word: w, sm: '→ Ich hätte gern ' + sm, fa, a: a - 0.15, u: S.c(3), o: on(R(a, a + 1.1)) })).join('')}
  <div class="abs pc row" style="${pos(80, 420, 1760, 210)}" ${at(S.c(3), 'up')}>
    <div style="width:150px;height:150px;flex:0 0 150px">${IC.coffee()}</div>
    <div><div class="k">Achte darauf</div><div class="de" style="font-size:62px;white-space:nowrap"><span style="color:#55607A">ein Kaffee</span> &nbsp;→&nbsp; Ich hätte gern ${mk('ein<span style="color:#5E9FCB">en</span>', S.w(3, 'einen Kaffee'))} Kaffee</div>
    </div></div>
  ${chip({ x: 80, y: 664, de: 'Zuerst den ganzen Satz lernen', fa: 'اول جملهٔ کامل', icon: IC.check(), a: S.c(5), o: on(S.sp(5)) })}
  `;
  },

  // 05 Kaffee ----------------------------------------------------------
  weekly_05: S => `
  ${photo(S, 'bread_coffee.jpg', 'Symbolbild · Foto: Angela Khebou / Pexels', '50% 78%')}
  <div class="abs pc glow" style="${pos(PX, 136, PW)}" ${at(S.w(0, 'Kaffee'), 'up', S.c(2))} ${on(S.sp(1))}>
    <div class="abs" style="right:28px;top:20px;width:110px;height:110px">${IC.coffee()}</div>
    <div class="k">Bestellen</div><div class="de s">Ich hätte gern<br>${mk('einen Kaffee', S.w(1, 'einen'))}, bitte.</div><div class="fa">لطفاً یک قهوه می‌خواهم.</div></div>
  ${bub({ x: PX, y: 136, w: PW, who: 'Theke', whoFa: 'فروشنده', tx: 'Zum Mitnehmen oder hier trinken?', a: S.c(2) + 0.2, o: on(S.sp(3)) })}
  ${wc({ x: PX, y: 396, w: 345, h: 352, icon: IC.togo(), word: 'zum Mitnehmen', fa: 'بیرون‌بر', a: S.w(3, 'Mitnehmen'), o: on(S.sp(4), R(S.c(6), S.e(6) + 1.5)),
    extra: `<div class="abs" style="right:16px;top:16px;width:62px;height:62px" ${at(S.c(6), 'pop')}>${IC.check()}</div>` })}
  ${wc({ x: PX + 375, y: 396, w: 345, h: 352, icon: IC.mug(), word: 'hier trinken', fa: 'همین‌جا', a: S.w(3, 'hier'), o: on(S.sp(5)) })}
  `,

  // 06 Antworten -------------------------------------------------------
  weekly_06: S => `
  ${bub({ x: 80, y: 150, w: 760, who: 'Verkäufer', whoFa: 'فروشنده', tx: 'Zum Mitnehmen?', a: S.start + 0.4 })}
  ${bub({ x: 420, y: 330, w: 760, side: 'r', who: 'Kunde', whoFa: 'مشتری', tx: mk('Zum Mitnehmen, bitte.', S.c(1)), a: S.c(0), o: on(S.sp(0)) })}
  ${bub({ x: 80, y: 520, w: 1100, side: 'r', who: 'Kunde', whoFa: 'مشتری', tx: 'Eine Brezel zum Mitnehmen, bitte.', a: S.w(3, 'Eine'), o: on(R(S.w(3, 'Eine'), S.e(3))) })}
  ${wc({ x: 1240, y: 150, w: 600, h: 300, icon: IC.pretzel(), ar: 'die', word: 'Brezel', fa: 'پرتزل', a: S.w(2, 'Brezel'), o: on(R(S.w(2, 'Brezel'), S.e(3))) })}
  ${note({ x: 1240, y: 480, w: 600, de: 'Beispielsätze zum Üben. Fotos = Symbolbilder.', fa: 'مکالمهٔ آموزشی؛ عکس‌ها تصویر کمکی‌اند.', a: S.c(4) })}
  `,

  // 07 Preis -----------------------------------------------------------
  weekly_07: S => `
  <div class="abs" style="${pos(120, 140, 300, 460)};transform-origin:50% 0" data-swing="1"><div ${at(S.start + 0.3, 'fade')}>${IC.tag()}</div></div>
  ${bub({ x: 480, y: 150, w: 900, side: 'r', who: 'Kunde', whoFa: 'مشتری', tx: 'Was kostet das?', a: S.c(1) - 0.1, u: S.c(3) - 0.2, o: on(S.sp(1)) })}
  ${bub({ x: 480, y: 150, w: 1200, side: 'r', who: 'Kunde', whoFa: 'مشتری', tx: `Was kostet das ${mk('zusammen', S.w(3, 'zusammen'))}?`, a: S.c(3), o: on(S.sp(3)) })}
  <div class="abs pc" style="${pos(480, 340, 1360, 196)};display:flex;align-items:center;gap:26px" ${at(S.c(2) + 0.2)}>
    <div style="width:150px;height:110px">${IC.roll()}</div><div class="h1">+</div><div style="width:150px;height:110px">${IC.roll()}</div><div class="h1">+</div>
    <div style="width:130px;height:130px">${IC.coffee()}</div><div class="h1" style="margin-left:10px">=</div>
    <div class="de" style="font-size:64px;font-weight:850">${mk('zusammen', S.w(4, 'insgesamt'))} <span style="color:#5E9FCB">? €</span></div></div>
  ${note({ x: 480, y: 566, w: 1360, de: '„zusammen“ = alles insgesamt', fa: '«zusammen» یعنی در مجموع', a: S.c(4), u: S.c(5) })}
  ${note({ x: 480, y: 566, w: 1360, de: 'Kein echter Ladenpreis – Preise ändern sich.', fa: 'قیمت واقعی نشان نمی‌دهیم.', a: S.c(5) + 0.2 })}
  `,

  // 08 Bezahlen --------------------------------------------------------
  weekly_08: S => {
    const pay = (y, ic, ar, w, sm, fa, cue) => `<div class="abs pc row glow" style="${pos(1120, y, 720, 280)}" ${at(S.start + 0.8 + (y > 300 ? 0.25 : 0))} ${on(R(S.c(cue), S.pause(cue)[1]))}>
      <div style="width:220px;height:150px;flex:0 0 220px">${ic}</div>
      <div><div class="k">${ar} ${w}</div><div class="de">${sm}</div><div class="fa" style="text-align:left;font-size:50px;color:#5E9FCB" ${at(S.e(cue) - 0.1, 'pop')}>${fa}</div></div></div>`;
    return `
  ${bub({ x: 80, y: 150, w: 980, side: 'r', who: 'Kunde', whoFa: 'مشتری', tx: mk('Kann ich mit Karte zahlen?', S.c(1)), a: S.start + 0.5, o: on(S.sp(0)) })}
  ${chip({ x: 80, y: 350, de: 'Ja', icon: IC.check(), a: S.w(2, 'ja'), u: S.c(3) })}
  ${chip({ x: 270, y: 350, de: 'Nein', icon: IC.cross(), a: S.w(2, 'nein'), u: S.c(3) })}
  ${bub({ x: 80, y: 340, w: 760, who: 'Verkäufer', whoFa: 'فروشنده', tx: 'Nur bar, bitte.', a: S.c(4) - 0.1, o: on(S.sp(4)) })}
  ${note({ x: 80, y: 560, w: 980, de: 'Auf die Antwort hören – bei Bedarf nachfragen.', fa: 'به پاسخ گوش بده و دوباره بپرس.', a: S.c(7) })}
  ${pay(150, IC.card(), 'die', 'Karte', 'mit Karte', 'با کارت', 5)}
  ${pay(460, IC.coins(), 'das', 'Bargeld', 'bar', 'نقدی', 6)}
  `;
  },

  // 09 Abschluss -------------------------------------------------------
  weekly_09: S => `
  ${photo(S, 'bakery.jpg', 'Symbolbild · Bäckerei in Berlin · Foto: Manish Jain / Pexels', '30% 50%')}
  ${bub({ x: PX, y: 136, w: 620, cls: 'tight', who: 'Verkäufer', whoFa: 'فروشنده', tx: 'Sonst noch etwas?', a: S.start + 0.5, o: on(S.sp(0), R(S.w(1, 'Möchtest'), S.e(1))) })}
  ${bub({ x: PX, y: 306, w: PW, cls: 'tight', side: 'r', who: 'Kunde', whoFa: 'مشتری', tx: 'Nein, danke.<br>Das ist alles.', a: S.c(3) - 0.1, o: on(S.sp(3)) })}
  ${bub({ x: PX, y: 532, w: PW, cls: 'tight', side: 'r', who: 'Kunde', whoFa: 'مشتری', tx: 'Vielen Dank!<br>Einen schönen Tag noch!', a: S.w(4, 'Vielen'), o: on(R(S.w(4, 'Vielen'), S.e(4))) })}
  `,

  // 10 Dialog zuhören (Chat mit Scroll) --------------------------------
  weekly_10: S => {
    const turns = S.sc.cues.filter(c => c.role);
    const html = `
    ${chip({ x: 80, y: 136, de: 'Beispieldialog', fa: 'مکالمهٔ نمونه', icon: IC.ear(), a: S.start + 0.3, cls: 'navy' })}
    <div class="abs" style="${pos(1180, 140, 660)};display:flex;gap:24px;justify-content:flex-end;font-family:Inter;font-weight:700;font-size:26px;color:#55607A" ${at(S.start + 0.5, 'fade')}>
      <span style="display:flex;align-items:center;gap:10px"><span style="width:46px;height:46px">${IC.person('#CFE7F7')}</span>Verkäufer</span>
      <span style="display:flex;align-items:center;gap:10px"><span style="width:46px;height:46px">${IC.person('#9FD0F0')}</span>Kunde</span></div>
    <div class="abs" id="chat" style="left:0;top:0;width:1920px;height:752px;overflow:hidden;clip-path:inset(214px 0 0 0)">
    ${turns.map(c => { const v = c.role === 'Verkäufer';
      return `<div class="bub dlg ${v ? 'l' : 'r'} glow" data-t="${f3(c.start - 0.15)}" style="${v ? 'left:80px' : 'right:80px'};top:0;max-width:1250px;opacity:0" ${on(R(c.start, c.end))}>
       <div class="who">${c.role} <span class="fa">${v ? 'فروشنده' : 'مشتری'}</span></div><div class="tx">${c.show}</div></div>`; }).join('')}
    </div>`;
    let hs = null;
    const tick = (t, root) => {
      const b = [...root.querySelectorAll('.dlg')];
      if (!hs) hs = b.map(e => e.offsetHeight);
      const P = b.map(e => easeOut(clamp((t - +e.dataset.t) / 0.45)));
      for (let j = 0; j < b.length; j++) {
        let y = 748 - hs[j];
        for (let k = j + 1; k < b.length; k++) y -= (hs[k] + 22) * P[k];
        const op = P[j] * clamp((y - 150) / 90);
        b[j].style.top = (y + (1 - P[j]) * 40).toFixed(2) + 'px';
        b[j].style.opacity = op.toFixed(3);
      }
    };
    return { html, tick };
  },

  // 11 Deine Rolle -----------------------------------------------------
  weekly_11: S => {
    const q = [3, 4, 5];
    const qs = q.map((c, k) => {
      const u = k < 2 ? S.c(q[k + 1]) - 0.1 : S.c(6) - 0.1, w = S.wait(c);
      return `${bub({ x: 80, y: 250, w: 980, who: 'Verkäufer', whoFa: 'فروشنده', tx: S.sc.cues[c].say, a: S.c(c) - 0.1, u, o: on(S.sp(c)) })}
      <div class="bub r" style="${pos(980, 450, 860, 220)}" ${at(w[0] - 0.2, 'up', u)}>
        <div class="who">Du <span class="fa">تو</span></div><div class="tx" style="color:#9FD0F0;font-size:80px;line-height:1">• • •</div>
        <div class="tf" style="text-align:left;direction:rtl">حالا تو جواب بده</div>
        ${ring({ x: 660, y: 40, s: 150, cd: w })}</div>`;
    }).join('');
    const ans = [8, 9, 10].map((c, k) => `<div class="abs glow" style="${pos(80, 236 + k * 172, 1760, 154)};display:flex;align-items:center;gap:28px;background:#FFFBF3;border-radius:30px;padding:0 34px;box-shadow:0 10px 24px rgba(40,25,10,.08)" ${at(S.c(c) - 0.15)} ${on(S.sp(c))}>
      <span style="width:66px;height:66px;flex:0 0 66px">${IC.check()}</span><span style="display:flex;flex-direction:column"><span style="font-family:Inter;font-weight:800;font-size:54px;letter-spacing:-.03em;white-space:nowrap;line-height:1.1">${S.sc.cues[c].say}</span>
      <span style="font-family:Lalezar;font-size:40px;color:#5E9FCB;direction:rtl;text-align:left;line-height:1.3">${S.sc.cues[c].fa}</span></span></div>`).join('');
    return `
    ${chip({ x: 80, y: 136, de: 'Du bist der Kunde', fa: 'تو مشتری هستی', icon: IC.roles(), a: S.c(0), cls: 'navy', u: S.c(7) - 0.2 })}
    ${chip({ x: 80, y: 136, de: 'Mögliche Antworten', fa: 'پاسخ‌های ممکن', icon: IC.check(), a: S.c(7), cls: 'navy' })}
    ${chip({ x: 80, y: 260, de: 'Antworte laut!', fa: 'با صدای بلند', icon: IC.speak(), a: S.c(2), u: S.c(3) - 0.2 })}
    ${qs}
    <div class="abs" style="${pos(660, 330, 600)};text-align:center" ${at(S.c(6), 'pop', S.c(7) - 0.1)}><div class="h1" style="font-size:96px">Sehr gut!</div><div class="h1f" style="text-align:center;font-size:52px">خیلی خوب</div></div>
    ${ans}
    `;
  },

  // 12 Unterwegs -------------------------------------------------------
  weekly_12: S => {
    const alt = (k, ic, de, fa, c) => `<div class="abs glow" style="${pos(PX, 540 + k * 106, PW, 96)};display:flex;align-items:center;gap:20px;background:#FFFBF3;border-radius:26px;padding:0 24px;box-shadow:0 10px 24px rgba(40,25,10,.08)" ${at(S.c(c) + 0.3, 'left')} ${on(R(S.c(c), S.e(c)))}>
      <span style="width:84px;height:70px;flex:0 0 84px">${ic}</span><span style="font-family:Inter;font-weight:800;font-size:54px;letter-spacing:-.03em;white-space:nowrap">${de}</span><span style="margin-left:auto;font-family:Lalezar;font-size:42px;color:#5E9FCB">${fa}</span></div>`;
    return `
  ${photo(S, 'metro_interior.jpg', 'Münchner U-Bahn (Symbolbild) · Foto: Maria Geller / Pexels', '50% 50%')}
  ${wc({ x: PX, y: 136, w: 345, h: 330, icon: IC.work(), ar: 'die', word: 'Arbeit', fa: 'کار', a: S.w(0, 'Arbeit'), u: S.c(2) - 0.1 })}
  ${wc({ x: PX + 375, y: 136, w: 345, h: 330, icon: IC.ubahn(), ar: 'die', word: 'U-Bahn', fa: 'مترو', a: S.w(1, 'U-Bahn'), u: S.c(2) - 0.1 })}
  <div class="abs pc glow" style="${pos(PX, 136, PW, 300)}" ${at(S.c(2))} ${on(S.sp(3))}>
    <div class="k">Unser Satz</div><div class="de s">Ich fahre<br>${mk('mit der U-Bahn', S.c(5))}<br>${mk('zur Arbeit', S.c(4))}.</div></div>
  <div class="abs" style="${pos(PX, 456, PW)};display:flex;gap:12px">
  ${chip({ de: 'Ziel', fa: 'مقصد', icon: IC.work(), a: S.c(4), fs: 30, o: on(S.sp(4)) })}
  ${chip({ de: 'Verkehrsmittel', fa: 'وسیله', icon: IC.ubahn(), a: S.c(5), fs: 30, o: on(S.sp(5)) })}</div>
  ${alt(0, IC.bus(), 'mit dem Bus', 'با اتوبوس', 6)}
  ${alt(1, IC.walk(), 'zu Fuß', 'پیاده', 7)}
  `;
  },

  // 13 Nach dem Weg fragen ---------------------------------------------
  weekly_13: S => {
    const dir = (k, d, de, fa, c) => `<div class="abs glow" style="${pos(PX + 290, 396 + k * 116, 410, 108)};display:flex;align-items:center;gap:18px;background:#F7F0E2;border-radius:24px;padding:0 18px" ${at(S.c(c) - 0.1, 'left')} ${on(R(S.c(c), S.pause(c)[1]))}>
      <span style="width:58px;height:58px;flex:0 0 58px">${IC.arrow(d)}</span><span style="display:flex;flex-direction:column;line-height:1"><span style="font-family:Inter;font-weight:800;font-size:54px;letter-spacing:-.03em">${de}</span>
      <span style="font-family:Lalezar;font-size:40px;color:#5E9FCB;margin-top:4px;line-height:1" ${at(S.e(c) - 0.05, 'pop')}>${fa}</span></span></div>`;
    return `
  ${photo(S, 'metro_interior.jpg', 'Münchner U-Bahn (Symbolbild) · Foto: Maria Geller / Pexels', '20% 40%')}
  ${bub({ x: PX, y: 136, w: PW, side: 'r', who: 'Du', whoFa: 'تو', tx: `${mk('Entschuldigung,', S.c(2))}<br>wo ist die U-Bahn?`, a: S.c(0) + 0.3, u: S.c(7) - 0.1, o: on(S.sp(1)) })}
  ${note({ x: PX, y: 136, w: PW, de: 'Nur ein Übungsbeispiel – keine echte Route.', fa: 'این مسیر فقط یک مثال آموزشی است.', a: S.c(7) })}
  <div class="abs pc" style="${pos(PX, 380, PW, 368)};padding:0" ${at(S.c(3) - 0.1)}>
    <svg class="abs" style="left:20px;top:20px;width:260px;height:328px" viewBox="0 0 260 328">
      <path d="M40,40 H220 M40,120 H220 M40,200 H220 M40,280 H220 M60,20 V310 M150,20 V310" stroke="#EFE4CF" stroke-width="10" stroke-linecap="round"/>
      <path d="M60,300 V120 H210" fill="none" stroke="#18263F" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" style="stroke-dashoffset:var(--d,1)" data-draw="${f3(S.w(3, 'Geradeaus'))},${f3(S.e(3) + 0.3)}"/>
      <circle cx="60" cy="300" r="16" fill="#5E9FCB"/><g transform="translate(190,92)"><rect width="56" height="56" rx="10" fill="#5E9FCB"/><path d="M17,13 V31 Q17,43 28,43 Q39,43 39,31 V13" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>
    </svg>
</div>
  ${dir(0, 'up', 'geradeaus', 'مستقیم', 4)}${dir(1, 'right', 'rechts', 'راست', 5)}${dir(2, 'left', 'links', 'چپ', 6)}
  `;
  },

  // 14 Bei der Arbeit --------------------------------------------------
  weekly_14: S => {
    const row = (de, fa, a, rng) => `<div class="r glow hlbg" ${at(a)} ${on(rng)}><div class="de">${de}</div><div class="fa">${fa}</div></div>`;
    return `
  ${chip({ x: 80, y: 136, de: 'Guten Morgen!', fa: 'صبح بخیر!', icon: IC.sun(), a: S.w(0, 'Guten'), o: on(R(S.w(0, 'Guten'), S.w(0, 'Wie'))) })}
   <div class="tbl" style="${pos(80, 226, 860)}" ${at(S.start + 0.6)}>
    <div class="hd"><b>du</b><span>informell</span><span class="fa">غیررسمی</span></div>
    ${row('Wie geht es dir?', 'حالت چطور است؟', S.w(0, 'Wie') - 0.1, R(S.w(0, 'Wie'), S.e(0)))}
    ${row('Gut, danke. Und dir?', 'خوبم، ممنون. و تو؟', S.w(2, 'Gut') - 0.1, R(S.w(2, 'Gut'), S.e(2)))}</div>
  <div class="tbl" style="${pos(980, 226, 860)}" ${at(S.start + 0.8)}>
    <div class="hd"><b>Sie</b><span>höflich</span><span class="fa">رسمی</span></div>
    ${row('Wie geht es Ihnen?', 'حال شما چطور است؟', S.w(1, 'Wie') - 0.1, R(S.w(1, 'Wie'), S.e(1)))}
    ${row('Gut, danke. Und Ihnen?', 'خوبم، ممنون. و شما؟', S.c(3), R(S.w(3, 'Und'), S.e(3)))}</div>
  <div class="note" style="${pos(80, 664, 1760)};padding:12px 32px" ${at(S.c(4))}>${IC.roles()}<div class="de">„du“ oder „Sie“? Das hängt von Person und Situation ab.</div></div>
  `;
  },

  // 15 Um Hilfe bitten -------------------------------------------------
  weekly_15: S => `
  <div class="abs pc row glow" style="${pos(80, 150, 1760, 216)}" ${at(S.w(0, 'Sage'))} ${on(S.sp(1))}>
    <div style="width:140px;height:140px;flex:0 0 140px">${IC.repeat()}</div>
    <div><div class="de" style="font-size:70px;white-space:nowrap">Können Sie das bitte ${mk('wiederholen', S.w(1, 'wiederholen'))}?</div><div class="fa" style="text-align:left">می‌توانید لطفاً آن را تکرار کنید؟</div></div></div>
  <div class="abs pc row glow" style="${pos(80, 400, 1760, 216)}" ${at(S.c(2))} ${on(S.sp(2))}>
    <div style="width:150px;height:130px;flex:0 0 150px">${IC.slow()}</div>
    <div><div class="de" style="font-size:70px;white-space:nowrap">Können Sie bitte ${mk('langsamer', S.w(2, 'langsamer'))} sprechen?</div><div class="fa" style="text-align:left">می‌توانید لطفاً آهسته‌تر صحبت کنید؟</div></div></div>
  ${chip({ x: 80, y: 660, de: 'Nachfragen ist Teil des Lernens', fa: 'بخشی از یادگیری', icon: IC.check(), a: S.c(3), o: on(S.sp(3)) })}
  `,

  // 16 Quiz ------------------------------------------------------------
  weekly_16: S => {
    const opt = (y, L, txt, a, u, ok, rev, xr = []) => `<div class="opt glow" style="${pos(80, y, 1460, 100)}" ${at(a, 'left', u)} ${ok ? on(R(rev, S.end + 5), xr) : `data-dim="${f3(rev)}"`}>
      <span class="L">${L}</span><span class="t">${txt}</span>${ok ? `<span class="ok" ${at(rev, 'pop', u)}>${IC.check()}</span>` : ''}</div>`;
    const u1 = S.c(7) - 0.2, w1 = S.wait(5), w2 = S.wait(7), r1 = S.c(6), r2 = S.c(8), q2 = S.c(7) + 0.4;
    return `
  ${chip({ x: 80, y: 136, de: 'Quiz 1/2', fa: 'آزمون', icon: IC.check(), a: S.start + 0.3, cls: 'navy', u: u1 })}
  ${chip({ x: 80, y: 136, de: 'Quiz 2/2', fa: 'آزمون', icon: IC.check(), a: S.c(7), cls: 'navy' })}
  <div class="abs" style="${pos(80, 250, 1760)};font-family:Inter;font-weight:800;font-size:56px;letter-spacing:-.03em;line-height:1.1" ${at(S.c(1), 'up', u1)}>Du möchtest einen Kaffee höflich bestellen.<br><span style="color:#5E9FCB">Welcher Satz passt?</span></div>
  ${opt(406, 'A', 'Ich hätte gern einen Kaffee, bitte.', S.c(3) - 0.1, u1, 1, r1, S.sp(3))}
  ${opt(514, 'B', 'Wo ist die U-Bahn?', S.c(4) - 0.1, u1, 0, r1)}
  ${opt(622, 'C', 'Wie geht es Ihnen?', S.c(5) - 0.1, u1, 0, r1)}
  <div ${at(w1[0] - 0.3, 'fade', u1)}>${ring({ x: 1620, y: 420, s: 200, cd: w1 })}</div>
  <div class="abs" style="${pos(80, 250, 1760)};font-family:Inter;font-weight:800;font-size:56px;letter-spacing:-.03em;line-height:1.1" ${at(S.c(7))}>Wie bittest du um eine <span style="color:#5E9FCB">Wiederholung</span>?</div>
  ${opt(406, 'A', 'Können Sie das bitte wiederholen?', q2 + 0.4, null, 1, r2, R(S.c(8), S.e(8)))}
  ${opt(514, 'B', 'Zum Mitnehmen, bitte.', q2 + 0.7, null, 0, r2)}
  ${opt(622, 'C', 'Was kostet das?', q2 + 1.0, null, 0, r2)}
  ${ring({ x: 1620, y: 420, s: 200, cd: w2 })}
  `;
  },

  // 17 Zusammenfassung und CTA -----------------------------------------
  weekly_17: S => {
    const u = S.c(4) - 0.1;
    const items = [['bestellen', 'سفارش', 'bestellt'], ['nach dem Preis fragen', 'پرسیدن قیمت', 'Preis'], ['bezahlen', 'پرداخت', 'bezahlt'], ['einen Weg beschreiben', 'مسیر', 'Weg']];
    return `
  <div class="abs pc" style="${pos(80, 136, 840, 612)}" ${at(S.start + 0.3, 'up', u)}>
    <div class="k">Heute geübt</div><div class="h1f" style="text-align:left;font-size:44px;margin:-6px 0 6px">امروز تمرین کردی</div>
    ${items.map(([de, fa, w]) => `<div class="glow" style="display:flex;align-items:center;gap:22px;height:104px;border-top:3px solid #EFE4CF;border-radius:20px;padding:0 10px" ${on(R(S.w(0, w), S.w(0, w) + 1.0))}>
      <span style="width:58px;height:58px;flex:0 0 58px" ${at(S.w(0, w), 'pop')}>${IC.check()}</span><span style="font-family:Inter;font-weight:800;font-size:46px;letter-spacing:-.03em;white-space:nowrap">${de}</span>
      <span style="margin-left:auto;font-family:Lalezar;font-size:40px;color:#5E9FCB;white-space:nowrap">${fa}</span></div>`).join('')}</div>
  <div class="abs pc row glow" style="${pos(960, 136, 880, 170)}" ${at(S.c(1), 'up', u)} ${on(S.sp(1))}>
    <div style="display:flex;gap:12px">${[1, 2, 3].map(n => `<span style="width:66px;height:66px;border-radius:50%;background:#18263F;color:#FFFBF3;font-family:Inter;font-weight:850;font-size:34px;display:grid;place-items:center">${n}</span>`).join('')}</div>
    <div><div class="de" style="font-size:54px">3 Sätze wählen</div><div class="fa" style="text-align:left;margin-top:0">سه جمله انتخاب کن</div></div></div>
  <div class="abs pc glow" style="${pos(960, 336, 880, 190)}" ${at(S.c(2), 'up', u)} ${on(S.sp(2))}>
    <div class="k" style="display:flex;align-items:center;gap:14px"><span style="width:44px;height:44px">${IC.comment()}</span>Kommentar · کامنت</div>
    <div style="border:3px solid #CFE7F7;border-radius:20px;padding:10px 22px;font-family:Inter;font-weight:800;font-size:56px;letter-spacing:-.03em;height:90px;white-space:nowrap"><span data-ty="${f3(S.w(2, 'Ich'))},${f3(S.w(2, 'Ich') + 1.2)}">Ich hätte gern …</span><span style="color:#5E9FCB">|</span></div></div>
  <div class="abs" style="${pos(960, 560, 880, 188)};display:flex;align-items:center;justify-content:center" ${at(S.c(3), 'pop', u)}>
    <div class="glow" style="display:flex;align-items:center;gap:22px;background:#18263F;color:#FFFBF3;border-radius:999px;padding:24px 46px 26px 30px;font-family:Inter;font-weight:850;font-size:54px" ${on(S.sp(3))}>
      <span style="width:70px;height:70px">${IC.bell()}</span>Abonnieren <span style="font-family:Lalezar;font-weight:400;font-size:48px;color:#9FD0F0">سابسکرایب</span></div></div>
  <div class="abs pc" style="${pos(160, 190, 1600, 500)};display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center" ${at(S.c(4) + 0.1, 'pop')}>
    <div class="de l" style="font-size:76px">Jeden Tag einen Schritt näher<br>an die ${mk('deutsche Sprache', S.w(4, 'deutsche'))}.</div>
    <div class="fa" style="text-align:center;font-size:52px;margin-top:22px">هر روز یک قدم به زبان آلمانی نزدیک‌تر.</div>
    <div class="logo" style="position:relative;margin-top:30px;transform:scale(1.2)">${DMF.logo()}</div></div>
  `;
  },
};
