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

    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Delete item #5 (the last one)
    const deleteBtns = await page.$$('.btn-danger');
    if (deleteBtns.length > 4) {
      await deleteBtns[deleteBtns.length - 1].click();
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.resolve(__dirname, '..', 'evidence', '08_eliminacion_exitosa.png') });
      console.log('8. Eliminacion exitosa capturada');
    }
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();