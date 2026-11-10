const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:4200/alojamiento/tipos-habitacion', { waitUntil: 'networkidle0' });
    const target = path.resolve(__dirname, '..', 'evidence', '01_tipos_list.png');
    await page.screenshot({ path: target });
    console.log('SCREENSHOT_OK: ' + target);
    await browser.close();
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
})();