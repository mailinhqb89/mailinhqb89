// Chụp ảnh demo: node demo/screenshot.js  (cần Playwright)
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const out = path.join(__dirname, '..', 'images');
  const shots = [
    ['web.html', 'web-trading.png', 1600],
    ['app.html', 'mobile-app.png', 1480],
  ];
  for (const [file, png, width] of shots) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
    await page.goto('file://' + path.join(__dirname, file));
    await page.screenshot({ path: path.join(out, png), fullPage: true });
    await page.close();
  }
  await browser.close();
})();
