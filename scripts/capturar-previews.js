/*
 * Gera as imagens de prévia usadas no catálogo (assets/previews/*.jpg).
 * Rode depois de alterar o visual de alguma landing page:
 *   npm install && npx playwright install chromium && npm run previews
 */
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'previews');
// Modelos do repositório e a cópia de demonstração da SBC Dev (tem tela de carregamento).
const PAGES = [
  { slug: 'bastiao', url: pathToFileURL(path.join(ROOT, 'landing-pages', 'bastiao', 'index.html')).href },
  { slug: 'sbc', url: pathToFileURL(path.join(ROOT, 'landing-pages', 'sbc', 'index.html')).href, settle: 9000 },
  { slug: 'vetor', url: pathToFileURL(path.join(ROOT, 'landing-pages', 'vetor', 'index.html')).href },
];
const SHOTS = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 / 3 }, // 960 × 600
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 0.75 }, // 293 × 633
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  for (const { slug, url, settle = 0 } of PAGES) {
    for (const shot of SHOTS) {
      // Sem animações: a captura sai no estado final, igual para todo mundo.
      const page = await browser.newPage({
        viewport: shot.viewport,
        deviceScaleFactor: shot.deviceScaleFactor,
        reducedMotion: 'reduce',
      });
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // A SBC Dev tem tela de carregamento e animações próprias: espera terminarem.
      if (settle) await page.waitForTimeout(settle);
      const file = path.join(OUT_DIR, `${slug}-${shot.name}.jpg`);
      await page.screenshot({ path: file, type: 'jpeg', quality: 82 });
      console.log(`✓ ${path.relative(ROOT, file)}`);
      await page.close();
    }
  }
  await browser.close();
})();
