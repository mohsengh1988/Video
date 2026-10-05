// out/thumbnail.jpg (1280x720) aus src/thumbnail.html
const { chromium } = require('playwright'); const path = require('path'); const { execFileSync } = require('child_process');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('file://' + path.resolve(__dirname, '../src/thumbnail.html')); await p.waitForFunction(() => window.__ready === true);
  const png = path.resolve(__dirname, '../build/thumbnail.png'); await p.screenshot({ path: png }); await b.close();
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-q:v', '2', path.resolve(__dirname, '../out/thumbnail.jpg')]);
  console.log('wrote out/thumbnail.jpg');
})();
