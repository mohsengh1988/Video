// Rendering mit Playwright/Chromium.
//   node scripts/render.js stills 1.5,20,33        -> out/qc/still_<t>.png
//   node scripts/render.js scene <index>           -> build/seg/<NN>.mp4 (Bilder direkt in ffmpeg, keine Einzelbilder auf Platte)
//   node scripts/render.js all [workers] [--force] -> alle Szenen parallel; vorhandene Segmente werden übersprungen (Wiederaufnahme)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'build/timeline.json'), 'utf8'));
const FPS = 30, W = 1920, H = 1080;
const PAGE = 'file://' + path.join(ROOT, 'src/video.html');

async function open() {
  const b = await chromium.launch({ args: ['--disable-web-security', '--font-render-hinting=none'] });
  const pg = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  pg.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });
  pg.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  // keine Netzwerkzugriffe: nur file://
  await pg.route(/^(?!file:)/, r => r.abort());
  await pg.goto(PAGE); await pg.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  return { b, pg };
}

async function stills(list, outDir = path.join(ROOT, 'out/qc')) {
  fs.mkdirSync(outDir, { recursive: true });
  const { b, pg } = await open();
  for (const t of list) {
    await pg.evaluate(t => render(t), t);
    const f = path.join(outDir, `still_${t.toFixed(2).padStart(7, '0')}.png`);
    await pg.screenshot({ path: f }); console.log('wrote', f);
  }
  await b.close();
}

async function scene(i) {
  const sc = TL.scenes[i];
  const n0 = Math.round(sc.start * FPS), n1 = i === TL.scenes.length - 1 ? Math.round(TL.duration * FPS) : Math.round(TL.scenes[i + 1].start * FPS);
  const dir = path.join(ROOT, 'build/seg'); fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, String(i + 1).padStart(2, '0') + '.mp4'), tmp = out + '.part.mp4';
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS),
    '-g', '60', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
  const { b, pg } = await open();
  const st = Date.now();
  for (let n = n0; n < n1; n++) {
    await pg.evaluate(t => render(t), n / FPS);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await done; await b.close();
  fs.renameSync(tmp, out);
  console.log(`scene ${i + 1} ${sc.id}: ${n1 - n0} frames in ${((Date.now() - st) / 1000).toFixed(0)} s -> ${path.relative(ROOT, out)}`);
}

async function all(workers = 3, force = false) {
  const todo = TL.scenes.map((s, i) => i).filter(i => force || !fs.existsSync(path.join(ROOT, 'build/seg', String(i + 1).padStart(2, '0') + '.mp4')));
  // längste Szenen zuerst
  todo.sort((a, b) => (TL.scenes[b].end - TL.scenes[b].start) - (TL.scenes[a].end - TL.scenes[a].start));
  console.log('to render:', todo.map(i => i + 1).join(' ') || '(nothing)');
  const run = i => new Promise((res, rej) => { const p = spawn(process.execPath, [__filename, 'scene', String(i)], { stdio: 'inherit' }); p.on('close', c => c === 0 ? res() : rej(new Error('scene ' + (i + 1) + ' failed'))); });
  const q = [...todo];
  await Promise.all(Array.from({ length: workers }, async () => { while (q.length) await run(q.shift()); }));
}

(async () => {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'stills') await stills(a.split(',').map(Number));
  else if (cmd === 'scene') await scene(+a);
  else if (cmd === 'all') await all(+(a || 3), process.argv.includes('--force'));
  else { console.log('usage: stills t1,t2 | scene i | all [workers] [--force]'); process.exit(2); }
})().catch(e => { console.error(e); process.exit(1); });
