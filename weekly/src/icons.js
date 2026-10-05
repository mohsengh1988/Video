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
