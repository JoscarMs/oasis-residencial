const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 100, height: 100, deviceScaleFactor: 2 });

  // 1. VS Code Icon (Crisp Windows 11 style)
  const vscodeSvg = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; background:transparent; display:flex; align-items:center; justify-content:center; width:28px; height:28px;">
    <svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M192.5 24.3L142 66.8L183.5 101.5L232.8 77.2C240.2 73.5 245 65.9 245 57.6V39.2C245 28.5 233.9 22.1 224.8 26.6L192.5 24.3Z" fill="#0065A9"/>
      <path d="M192.5 231.7L142 189.2L183.5 154.5L232.8 178.8C240.2 182.5 245 190.1 245 198.4V216.8C245 227.5 233.9 233.9 224.8 229.4L192.5 231.7Z" fill="#007ACC"/>
      <path d="M232.8 77.2L183.5 101.5L142 66.8L61.6 1.8C54.4 -3.9 44.2 0.3 42.4 9.2L1.8 194.2C0.3 201 4.5 207.5 11.2 208.7L142 189.2L183.5 154.5L232.8 178.8C240.2 182.5 245 174.9 245 166.6V89.4C245 81.1 240.2 73.5 232.8 77.2Z" fill="#1F9CF0"/>
      <path d="M183.5 101.5L142 128L183.5 154.5V101.5Z" fill="#0065A9"/>
      <path d="M11.2 47.3L61.6 1.8L142 66.8L61.6 128L11.2 47.3Z" fill="#007ACC"/>
    </svg>
  </body>
  </html>`;
  await page.setContent(vscodeSvg);
  const vscEl = await page.$('body');
  await vscEl.screenshot({ path: path.resolve('c:/ING-Sistemas/Proyecto OASIS/evidence/icon_vscode.png'), omitBackground: true });

  // 2. Docker Icon
  const dockerSvg = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; background:transparent; display:flex; align-items:center; justify-content:center; width:28px; height:28px;">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.9 8.2h-1.8V6.4h1.8v1.8zm-2.2 0H9.9V6.4h1.8v1.8zm-2.2 0H7.7V6.4h1.8v1.8zm6.6 2.2h-1.8v-1.8h1.8v1.8zm-2.2 0h-1.8v-1.8h1.8v1.8zm-2.2 0H9.9v-1.8h1.8v1.8zm-2.2 0H7.7v-1.8h1.8v1.8zm-2.2 0H3.3v-1.8h1.8v1.8zm14.1 1.7c-.3-.2-1.3-.3-2.1.2-.2-.5-.6-1-1.1-1.3l-.4-.2-.3.3c-.5.5-.8 1.3-.8 2.2 0 .5.1 1 .4 1.4-.4.2-1 .3-1.6.3H2.3c-.2.7 0 1.9.5 2.9.7 1.4 1.8 2.3 3.3 2.7 3.5.9 7.2.9 10.7-.1 2.3-.7 4.1-2.4 4.7-4.7.7-2.5-.2-3.4-.6-3.7z" fill="#0DB7ED"/>
    </svg>
  </body>
  </html>`;
  await page.setContent(dockerSvg);
  const dockerEl = await page.$('body');
  await dockerEl.screenshot({ path: path.resolve('c:/ING-Sistemas/Proyecto OASIS/evidence/icon_docker.png'), omitBackground: true });

  await browser.close();
  console.log('ICONS_GENERATED_OK');
})();
