const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const names = process.argv.slice(2);
  if (!names.length) throw new Error('Pass one or more HTML filenames');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  let failed = false;

  for (const name of names) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    const filePath = path.resolve(__dirname, name);
    await page.goto(`file://${filePath}`, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: filePath.replace(/\.html$/, '.png'), fullPage: false });
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      title: document.title,
      textLength: document.body.innerText.length,
    }));
    console.log(JSON.stringify({ name, errors, dimensions }));
    if (errors.length || dimensions.textLength < 200) failed = true;
    await page.close();
  }

  await browser.close();
  if (failed) process.exitCode = 1;
})();
