// Eigene SVG-Illustrationen (Markenpalette). Keine fremden Grafiken.
const C = { navy: '#18263F', blue: '#9FD0F0', light: '#CFE7F7', acc: '#5E9FCB', paper: '#FFFBF3', cream: '#F7F0E2', grey: '#55607A', crust: '#B8682A', crust2: '#8A4712', crumb: '#F3D5A4' };
let _iid = 0;
const uid = p => p + (++_iid);
const svg = (vb, inner, cls = 'ic') => `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

const IC = {
  roll: () => { const g = uid('rl'); return svg('0 0 200 140', `<defs><radialGradient id="${g}" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#E9A35A"/><stop offset=".7" stop-color="${C.crust}"/><stop offset="1" stop-color="${C.crust2}"/></radialGradient></defs>
    <ellipse cx="100" cy="122" rx="78" ry="10" fill="#3b2210" opacity=".18"/>
    <path d="M22,92 C18,48 60,22 100,22 C140,22 182,48 178,92 C176,112 150,120 100,120 C50,120 24,112 22,92 Z" fill="url(#${g})"/>
    <path d="M100,30 C96,60 98,90 104,114" stroke="${C.crumb}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M62,44 C70,58 76,72 80,86" stroke="#F0C48A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>`); },
  coffee: () => svg('0 0 200 200', `<ellipse cx="96" cy="176" rx="80" ry="12" fill="#3b2210" opacity=".16"/>
    <path d="M70,28 C60,42 80,50 70,64 M100,22 C90,38 110,46 100,62 M130,28 C120,42 140,50 130,64" stroke="${C.acc}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M150,96 C186,96 186,140 148,140" stroke="${C.navy}" stroke-width="12" fill="none"/>
    <path d="M36,80 L156,80 L148,152 C146,166 134,172 120,172 L72,172 C58,172 46,166 44,152 Z" fill="${C.paper}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M44,96 L148,96" stroke="${C.blue}" stroke-width="10"/>
    <ellipse cx="96" cy="82" rx="58" ry="7" fill="#6B3A1A"/>`),
  togo: () => svg('0 0 200 220', `<ellipse cx="100" cy="206" rx="56" ry="9" fill="#3b2210" opacity=".16"/>
    <path d="M52,52 L148,52 L134,200 L66,200 Z" fill="${C.paper}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M58,104 L142,104 L136,160 L64,160 Z" fill="${C.blue}"/>
    <rect x="42" y="30" width="116" height="24" rx="8" fill="${C.navy}"/>
    <rect x="58" y="18" width="84" height="16" rx="6" fill="${C.acc}"/>`),
  mug: () => svg('0 0 200 200', `<ellipse cx="96" cy="180" rx="80" ry="10" fill="#3b2210" opacity=".16"/>
    <path d="M70,30 C60,44 80,52 70,66 M104,24 C94,40 114,48 104,64" stroke="${C.acc}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M148,96 C188,96 188,148 146,148" stroke="${C.navy}" stroke-width="12" fill="none"/>
    <rect x="36" y="76" width="118" height="100" rx="18" fill="${C.light}" stroke="${C.navy}" stroke-width="7"/>
    <rect x="52" y="92" width="22" height="64" rx="10" fill="#fff" opacity=".6"/>`),
  card: () => svg('0 0 240 160', `<rect x="14" y="20" width="212" height="128" rx="18" fill="${C.navy}"/>
    <rect x="14" y="48" width="212" height="22" fill="#0d1628"/>
    <rect x="34" y="88" width="44" height="32" rx="6" fill="#E8C66A"/><path d="M34,104 H78 M56,88 V120" stroke="#b3923c" stroke-width="2"/>
    <rect x="100" y="112" width="100" height="10" rx="5" fill="${C.blue}"/>`),
  coins: () => svg('0 0 240 160', `<rect x="18" y="34" width="150" height="86" rx="12" fill="#BFE0C9" stroke="${C.navy}" stroke-width="6"/>
    <circle cx="93" cy="77" r="24" fill="none" stroke="${C.navy}" stroke-width="5"/>
    <g stroke="${C.navy}" stroke-width="6"><ellipse cx="184" cy="122" rx="40" ry="14" fill="#E8C66A"/><path d="M144,122 V106" /><path d="M224,122 V106"/><ellipse cx="184" cy="106" rx="40" ry="14" fill="#F2D88A"/></g>`),
  ear: () => svg('0 0 120 120', `<path d="M40,52 C40,26 62,12 80,16 C100,20 108,40 102,56 C96,70 84,72 82,86 C80,102 64,108 54,100" fill="none" stroke="${C.navy}" stroke-width="9" stroke-linecap="round"/>
    <path d="M62,52 C62,40 76,36 82,46 C86,54 78,60 72,62" fill="none" stroke="${C.acc}" stroke-width="8" stroke-linecap="round"/>
    <path d="M18,44 C12,56 12,70 18,82" stroke="${C.blue}" stroke-width="7" fill="none" stroke-linecap="round"/>`),
  read: () => svg('0 0 120 120', `<path d="M12,28 C34,20 50,22 60,32 C70,22 86,20 108,28 L108,94 C86,86 70,88 60,98 C50,88 34,86 12,94 Z" fill="${C.paper}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M60,32 V98" stroke="${C.navy}" stroke-width="5"/><path d="M24,46 H48 M24,60 H48 M72,46 H96 M72,60 H96 M72,74 H90" stroke="${C.acc}" stroke-width="6" stroke-linecap="round"/>`),
  speak: () => svg('0 0 120 120', `<path d="M14,22 H86 Q96,22 96,32 V68 Q96,78 86,78 H46 L26,96 V78 H24 Q14,78 14,68 V32 Q14,22 24,22 Z" fill="${C.light}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M34,50 Q42,40 50,50 T66,50 T82,50" stroke="${C.acc}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M104,40 Q112,52 104,64" stroke="${C.navy}" stroke-width="6" fill="none" stroke-linecap="round"/>`),
  pause: () => svg('0 0 120 120', `<circle cx="60" cy="60" r="46" fill="${C.light}" stroke="${C.navy}" stroke-width="7"/><rect x="42" y="38" width="12" height="44" rx="4" fill="${C.navy}"/><rect x="66" y="38" width="12" height="44" rx="4" fill="${C.navy}"/>`),
  roles: () => svg('0 0 120 120', `<path d="M8,18 H62 Q70,18 70,26 V52 Q70,60 62,60 H30 L16,72 V60 H16 Q8,60 8,52 V26 Q8,18 16,18 Z" fill="${C.paper}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M112,52 H58 Q50,52 50,60 V86 Q50,94 58,94 H90 L104,106 V94 H104 Q112,94 112,86 V60 Q112,52 104,52 Z" fill="${C.blue}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>`),
  sun: () => { let r = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; r += `<path d="M${60 + Math.cos(a) * 34},${60 + Math.sin(a) * 34} L${60 + Math.cos(a) * 50},${60 + Math.sin(a) * 50}" stroke="#E9B44C" stroke-width="7" stroke-linecap="round"/>`; }
    return svg('0 0 120 120', `${r}<circle cx="60" cy="60" r="24" fill="#F6CF6A" stroke="#E9B44C" stroke-width="5"/>`); },
  metro: () => svg('0 0 200 200', `<rect x="40" y="20" width="120" height="150" rx="28" fill="${C.light}" stroke="${C.navy}" stroke-width="8"/>
    <rect x="58" y="42" width="84" height="56" rx="10" fill="${C.paper}" stroke="${C.navy}" stroke-width="6"/>
    <circle cx="70" cy="132" r="9" fill="${C.navy}"/><circle cx="130" cy="132" r="9" fill="${C.navy}"/>
    <path d="M62,170 L46,192 M138,170 L154,192" stroke="${C.navy}" stroke-width="8" stroke-linecap="round"/>`),
  ubahn: () => svg('0 0 120 120', `<rect x="10" y="10" width="100" height="100" rx="16" fill="${C.acc}"/><path d="M38,30 V66 Q38,88 60,88 Q82,88 82,66 V30" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/>`),
  bus: () => svg('0 0 220 180', `<rect x="20" y="24" width="180" height="122" rx="22" fill="${C.blue}" stroke="${C.navy}" stroke-width="8"/>
    <rect x="38" y="44" width="62" height="44" rx="8" fill="${C.paper}" stroke="${C.navy}" stroke-width="5"/><rect x="118" y="44" width="62" height="44" rx="8" fill="${C.paper}" stroke="${C.navy}" stroke-width="5"/>
    <circle cx="64" cy="150" r="16" fill="${C.navy}"/><circle cx="160" cy="150" r="16" fill="${C.navy}"/><rect x="34" y="110" width="152" height="10" rx="5" fill="${C.navy}" opacity=".3"/>`),
  walk: () => svg('0 0 160 180', `<circle cx="86" cy="26" r="16" fill="${C.navy}"/>
    <path d="M82,48 L72,98 L96,126 L102,168 M72,98 L56,132 L38,166 M80,60 L52,80 L42,104 M82,60 L108,84 L128,92" fill="none" stroke="${C.navy}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`),
  work: () => svg('0 0 200 170', `<rect x="20" y="50" width="160" height="104" rx="18" fill="${C.light}" stroke="${C.navy}" stroke-width="8"/>
    <path d="M72,50 V34 Q72,24 82,24 H118 Q128,24 128,34 V50" fill="none" stroke="${C.navy}" stroke-width="8"/><path d="M20,96 H180" stroke="${C.navy}" stroke-width="6"/><rect x="88" y="86" width="24" height="22" rx="5" fill="${C.acc}"/>`),
  check: (c = C.acc) => svg('0 0 100 100', `<circle cx="50" cy="50" r="44" fill="${c}"/><path d="M28,52 L44,67 L73,36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`),
  cross: () => svg('0 0 100 100', `<circle cx="50" cy="50" r="44" fill="${C.grey}"/><path d="M34,34 L66,66 M66,34 L34,66" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`),
  repeat: () => svg('0 0 120 120', `<path d="M26,58 A34,34 0 0 1 90,42" fill="none" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/><path d="M80,24 L94,44 L72,52" fill="none" stroke="${C.navy}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M94,62 A34,34 0 0 1 30,78" fill="none" stroke="${C.acc}" stroke-width="10" stroke-linecap="round"/><path d="M40,96 L26,76 L48,68" fill="none" stroke="${C.acc}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`),
  slow: () => svg('0 0 140 120', `<path d="M12,96 H122" stroke="${C.navy}" stroke-width="6" stroke-linecap="round"/>
    <path d="M30,94 C26,60 48,38 74,38 C100,38 114,60 108,94 Z" fill="${C.light}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M70,94 C56,86 54,66 70,60 C84,56 92,70 82,78 C76,82 70,76 74,72" fill="none" stroke="${C.acc}" stroke-width="6" stroke-linecap="round"/>
    <path d="M108,80 C120,76 126,66 122,56 M120,58 L128,46 M114,58 L114,44" stroke="${C.navy}" stroke-width="6" fill="none" stroke-linecap="round"/>`),
  comment: () => svg('0 0 120 120', `<path d="M16,20 H104 V82 H48 L24,102 V82 H16 Z" fill="none" stroke="${C.navy}" stroke-width="8" stroke-linejoin="round"/><path d="M36,44 H84 M36,60 H70" stroke="${C.acc}" stroke-width="7" stroke-linecap="round"/>`),
  bell: () => svg('0 0 120 120', `<path d="M60,16 C36,16 30,36 30,56 V76 L18,92 H102 L90,76 V56 C90,36 84,16 60,16 Z" fill="${C.paper}" stroke="${C.paper}" stroke-width="2"/><circle cx="60" cy="102" r="10" fill="${C.paper}"/>`),
  person: (c = C.blue) => svg('0 0 120 120', `<circle cx="60" cy="60" r="56" fill="${c}"/><circle cx="60" cy="46" r="18" fill="${C.navy}"/><path d="M26,98 C30,74 90,74 94,98" fill="${C.navy}"/>`),
  info: () => svg('0 0 100 100', `<circle cx="50" cy="50" r="44" fill="${C.light}" stroke="${C.navy}" stroke-width="6"/><circle cx="50" cy="30" r="7" fill="${C.navy}"/><rect x="43" y="44" width="14" height="34" rx="6" fill="${C.navy}"/>`),
  think: () => svg('0 0 220 180', `<path d="M40,96 C10,96 10,50 44,50 C46,20 92,10 108,34 C124,12 170,18 172,50 C206,50 210,96 178,98 C180,126 140,134 126,116 C112,136 70,134 66,114 C48,118 34,108 40,96 Z" fill="${C.paper}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="52" cy="140" r="12" fill="${C.paper}" stroke="${C.navy}" stroke-width="6"/><circle cx="30" cy="164" r="7" fill="${C.paper}" stroke="${C.navy}" stroke-width="5"/>
    <text x="110" y="96" text-anchor="middle" font-family="Inter" font-weight="850" font-size="64" fill="${C.acc}">… ?</text>`),
  tag: () => DMF.tag('? €', uid('tg')),
  pretzel: () => DMF.pretzel(uid('pz'), 31),
  arrow: dir => { const rot = { up: 0, right: 90, left: -90, down: 180 }[dir] || 0;
    return svg('0 0 100 100', `<g transform="rotate(${rot} 50 50)"><path d="M50,86 V20 M24,44 L50,16 L76,44" fill="none" stroke="${C.navy}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></g>`); },
};

// ---- Monatsvideo: zusätzliche Motive (eigene, schematische SVGs) ----
Object.assign(IC, {
  skyline: () => svg('0 0 220 160', `<path d="M10,150 H210" stroke="${C.navy}" stroke-width="7" stroke-linecap="round"/>
    <rect x="22" y="78" width="40" height="72" fill="${C.light}" stroke="${C.navy}" stroke-width="6"/><path d="M22,78 L42,58 L62,78" fill="${C.blue}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="70" y="40" width="34" height="110" fill="${C.paper}" stroke="${C.navy}" stroke-width="6"/><path d="M70,40 L87,12 L104,40" fill="${C.acc}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="114" y="40" width="34" height="110" fill="${C.paper}" stroke="${C.navy}" stroke-width="6"/><path d="M114,40 L131,12 L148,40" fill="${C.acc}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="158" y="70" width="44" height="80" fill="${C.light}" stroke="${C.navy}" stroke-width="6"/>
    <path d="M80,62 h14 M80,84 h14 M124,62 h14 M124,84 h14 M168,90 h24 M168,112 h24" stroke="${C.navy}" stroke-width="5"/>`),
  tower: () => svg('0 0 120 160', `<rect x="38" y="44" width="44" height="108" fill="${C.paper}" stroke="${C.navy}" stroke-width="7"/><path d="M38,44 L60,8 L82,44" fill="${C.acc}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/><circle cx="60" cy="72" r="11" fill="${C.light}" stroke="${C.navy}" stroke-width="5"/><rect x="52" y="112" width="16" height="40" fill="${C.navy}"/>`),
  window: () => svg('0 0 120 140', `<path d="M24,130 V50 Q24,14 60,14 Q96,14 96,50 V130 Z" fill="${C.light}" stroke="${C.navy}" stroke-width="7"/><path d="M60,16 V130 M24,70 H96" stroke="${C.navy}" stroke-width="6"/>`),
  facade: () => svg('0 0 160 140', `<path d="M14,132 V48 L44,20 L74,48 L104,20 L146,48 V132 Z" fill="${C.paper}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/>${[34, 68, 102].map(x => `<rect x="${x}" y="62" width="22" height="24" fill="${C.blue}" stroke="${C.navy}" stroke-width="4"/><rect x="${x}" y="98" width="22" height="24" fill="${C.blue}" stroke="${C.navy}" stroke-width="4"/>`).join('')}`),
  square: () => svg('0 0 160 120', `<ellipse cx="80" cy="74" rx="70" ry="34" fill="${C.light}" stroke="${C.navy}" stroke-width="6"/><circle cx="80" cy="66" r="10" fill="${C.acc}"/><path d="M80,66 V30" stroke="${C.navy}" stroke-width="6"/><path d="M30,74 h14 M116,74 h14 M60,96 h10 M92,96 h10" stroke="${C.navy}" stroke-width="5" stroke-linecap="round"/>`),
  tree: () => svg('0 0 140 160', `<rect x="62" y="96" width="16" height="56" rx="4" fill="#8A5A30"/><circle cx="70" cy="64" r="46" fill="#9CCB8E" stroke="${C.navy}" stroke-width="6"/><circle cx="52" cy="54" r="12" fill="#BFE0B3"/>`),
  rotunda: () => svg('0 0 180 160', `<path d="M20,150 H160" stroke="${C.navy}" stroke-width="7" stroke-linecap="round"/><path d="M36,138 H144 V128 H36 Z" fill="${C.light}" stroke="${C.navy}" stroke-width="5"/>
    ${[48, 70, 92, 114, 132].map(x => `<rect x="${x}" y="62" width="10" height="66" fill="${C.paper}" stroke="${C.navy}" stroke-width="4"/>`).join('')}
    <path d="M34,62 H146 L140,52 H40 Z" fill="${C.paper}" stroke="${C.navy}" stroke-width="5" stroke-linejoin="round"/><path d="M44,52 Q90,6 136,52 Z" fill="${C.acc}" stroke="${C.navy}" stroke-width="5"/>`),
  bike: () => svg('0 0 200 130', `<circle cx="46" cy="88" r="32" fill="none" stroke="${C.navy}" stroke-width="8"/><circle cx="154" cy="88" r="32" fill="none" stroke="${C.navy}" stroke-width="8"/>
    <path d="M46,88 L82,40 L132,40 L154,88 M82,40 L104,88 L132,40 M104,88 H46 M74,28 H96 M126,22 L132,40 L148,30" fill="none" stroke="${C.acc}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`),
  station: () => svg('0 0 200 160', `<path d="M10,150 H190" stroke="${C.navy}" stroke-width="7" stroke-linecap="round"/><path d="M24,150 V70 L100,24 L176,70 V150" fill="${C.paper}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="76" y="92" width="48" height="58" rx="6" fill="${C.light}" stroke="${C.navy}" stroke-width="6"/><circle cx="100" cy="62" r="16" fill="#fff" stroke="${C.navy}" stroke-width="5"/><path d="M100,52 V62 H108" stroke="${C.navy}" stroke-width="4" fill="none"/>
    <rect x="38" y="96" width="24" height="24" fill="${C.blue}" stroke="${C.navy}" stroke-width="4"/><rect x="138" y="96" width="24" height="24" fill="${C.blue}" stroke="${C.navy}" stroke-width="4"/>`),
  stop: () => svg('0 0 120 170', `<rect x="54" y="60" width="12" height="104" fill="${C.grey}"/><circle cx="60" cy="48" r="40" fill="#F6CF6A" stroke="${C.navy}" stroke-width="6"/><text x="60" y="64" text-anchor="middle" font-family="Inter" font-weight="850" font-size="48" fill="#2E7D4F">H</text>`),
  factory: () => svg('0 0 200 160', `<path d="M14,150 V78 L58,56 V78 L102,56 V78 L146,56 V150 Z" fill="${C.light}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/><rect x="152" y="24" width="30" height="126" fill="${C.paper}" stroke="${C.navy}" stroke-width="7"/>
    <path d="M10,150 H190" stroke="${C.navy}" stroke-width="7"/><rect x="34" y="100" width="22" height="22" fill="${C.blue}"/><rect x="78" y="100" width="22" height="22" fill="${C.blue}"/><rect x="118" y="100" width="22" height="22" fill="${C.blue}"/>`),
  office: () => svg('0 0 140 170', `<rect x="24" y="16" width="92" height="146" rx="8" fill="${C.paper}" stroke="${C.navy}" stroke-width="7"/>${[0, 1, 2, 3, 4].map(r => [0, 1, 2].map(c => `<rect x="${38 + c * 24}" y="${30 + r * 24}" width="14" height="14" fill="${C.blue}"/>`).join('')).join('')}<rect x="56" y="134" width="28" height="28" fill="${C.navy}"/>`),
  flask: () => svg('0 0 140 160', `<path d="M52,14 H88 M58,14 V60 L22,136 Q16,150 32,150 H108 Q124,150 118,136 L82,60 V14" fill="${C.paper}" stroke="${C.navy}" stroke-width="7" stroke-linejoin="round"/><path d="M36,112 H104 L116,140 Q118,146 108,146 H32 Q22,146 24,140 Z" fill="${C.blue}"/><circle cx="62" cy="126" r="6" fill="#fff"/><circle cx="80" cy="132" r="4" fill="#fff"/>`),
  gradcap: () => svg('0 0 180 140', `<path d="M90,20 L170,54 L90,88 L10,54 Z" fill="${C.navy}"/><path d="M42,68 V104 Q90,132 138,104 V68 L90,88 Z" fill="${C.light}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/><path d="M160,58 V100" stroke="${C.acc}" stroke-width="6"/><circle cx="160" cy="104" r="8" fill="${C.acc}"/>`),
  culture: () => svg('0 0 160 150', `<path d="M14,40 H146 L80,10 Z" fill="${C.acc}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/><rect x="14" y="40" width="132" height="12" fill="${C.paper}" stroke="${C.navy}" stroke-width="5"/>
    ${[28, 60, 92, 120].map(x => `<rect x="${x}" y="56" width="12" height="70" fill="${C.paper}" stroke="${C.navy}" stroke-width="4"/>`).join('')}<rect x="8" y="126" width="144" height="14" fill="${C.light}" stroke="${C.navy}" stroke-width="5"/>`),
  gear: () => { let t = ''; for (let i = 0; i < 8; i++) t += `<rect x="64" y="6" width="22" height="30" rx="4" fill="${C.acc}" transform="rotate(${i * 45} 75 75)"/>`;
    return svg('0 0 150 150', `${t}<circle cx="75" cy="75" r="46" fill="${C.acc}" stroke="${C.navy}" stroke-width="6"/><circle cx="75" cy="75" r="18" fill="${C.paper}" stroke="${C.navy}" stroke-width="6"/>`); },
  camera: () => svg('0 0 160 130', `<rect x="12" y="34" width="136" height="86" rx="14" fill="${C.light}" stroke="${C.navy}" stroke-width="7"/><path d="M50,34 L60,16 H100 L110,34" fill="${C.paper}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/><circle cx="80" cy="77" r="26" fill="${C.paper}" stroke="${C.navy}" stroke-width="7"/><circle cx="80" cy="77" r="11" fill="${C.acc}"/>`),
  moon: () => svg('0 0 120 120', `<path d="M78,14 A48,48 0 1 0 106,86 A40,40 0 1 1 78,14 Z" fill="#F6CF6A" stroke="#E9B44C" stroke-width="5"/><circle cx="96" cy="26" r="4" fill="#E9B44C"/><circle cx="104" cy="52" r="3" fill="#E9B44C"/>`),
  pin: () => svg('0 0 100 130', `<path d="M50,124 C50,124 12,74 12,48 A38,38 0 0 1 88,48 C88,74 50,124 50,124 Z" fill="${C.acc}" stroke="${C.navy}" stroke-width="6"/><circle cx="50" cy="48" r="15" fill="${C.paper}"/>`),
  eye: () => svg('0 0 140 90', `<path d="M8,45 Q70,-10 132,45 Q70,100 8,45 Z" fill="${C.paper}" stroke="${C.navy}" stroke-width="7"/><circle cx="70" cy="45" r="20" fill="${C.acc}"/><circle cx="70" cy="45" r="8" fill="${C.navy}"/>`),
  star: () => svg('0 0 120 120', `<path d="M60,10 L74,44 L110,46 L82,68 L92,104 L60,84 L28,104 L38,68 L10,46 L46,44 Z" fill="#F6CF6A" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>`),
  bookmark: () => svg('0 0 100 120', `<path d="M22,10 H78 V110 L50,88 L22,110 Z" fill="${C.acc}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>`),
  layers: () => svg('0 0 140 120', `<path d="M70,10 L130,40 L70,70 L10,40 Z" fill="${C.acc}" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/><path d="M10,62 L70,92 L130,62" fill="none" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/><path d="M10,82 L70,112 L130,82" fill="none" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>`),
  land: () => svg('0 0 140 120', `<rect x="10" y="10" width="120" height="100" rx="26" fill="${C.cream}" stroke="${C.navy}" stroke-width="7"/><rect x="34" y="30" width="72" height="60" rx="16" fill="${C.light}" stroke="${C.navy}" stroke-width="5" opacity=".5"/>`),
  state: () => svg('0 0 140 120', `<rect x="10" y="10" width="120" height="100" rx="26" fill="none" stroke="${C.navy}" stroke-width="5" stroke-dasharray="8 8" opacity=".5"/><rect x="30" y="26" width="80" height="68" rx="18" fill="${C.light}" stroke="${C.navy}" stroke-width="7"/>`),
  city: () => svg('0 0 140 120', `<rect x="10" y="10" width="120" height="100" rx="26" fill="none" stroke="${C.navy}" stroke-width="4" stroke-dasharray="8 8" opacity=".4"/><rect x="30" y="26" width="80" height="68" rx="18" fill="none" stroke="${C.navy}" stroke-width="4" stroke-dasharray="8 8" opacity=".5"/><circle cx="70" cy="60" r="20" fill="${C.acc}" stroke="${C.navy}" stroke-width="7"/>`),
});
