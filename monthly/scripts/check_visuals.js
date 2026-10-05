// Prüft alle Szenen-Layouts ohne Browser (Wort-Zeitmarken, Cue-Indizes, Syntax).
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const ctx = { window: {}, document: { getElementById: () => ({}) }, console };
ctx.window.addEventListener = () => {};
vm.createContext(ctx);
vm.runInContext(R('src/lib.js') + '\n' + R('src/icons.js') + '\nwindow.TL=' + R('build/timeline.json') + ';\n' + R('src/visuals.js') + '\n' + R('src/engine.js').replace(/window\.addEventListener[\s\S]*$/, '') + '\nthis.VIS=VIS;this.helpers=helpers;this.TL=TL;', ctx);
let bad = 0;
for (const sc of ctx.TL.scenes) {
  if (!ctx.VIS[sc.id]) { console.log('MISSING', sc.id); bad++; continue; }
  try { ctx.VIS[sc.id](ctx.helpers(sc)); } catch (e) { console.log(sc.id, e.message); bad++; }
}
console.log(bad ? bad + ' problem(s)' : 'all scenes ok');
process.exit(bad ? 1 : 0);
