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

    // 1. Listado inicial
    await page.goto('http://localhost:4200/alojamiento/tipos-habitacion', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '..', 'evidence', '01_tipos_list.png') });
    console.log('1. Listado capturado');

    // 2. Formulario Nuevo
    await page.goto('http://localhost:4200/alojamiento/tipos-habitacion/nuevo', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '..', 'evidence', '02_nuevo_form_vacio.png') });
    console.log('2. Formulario nuevo capturado');

    // 3. Llenar Formulario y Guardar
    await page.type('#nombre', 'Suite Presidencial Oasis');
    await page.evaluate(() => {
      document.querySelector('#precioBase').value = '';
    });
    await page.type('#precioBase', '850.00');
    await page.evaluate(() => {
      document.querySelector('#capacidadPersonas').value = '';
    });
    await page.type('#capacidadPersonas', '2');
    await page.type('#descripcion', 'Suite de alta gama con sala de estar, frigobar, terraza panorámica y baño privado de lujo.');
    await page.screenshot({ path: path.resolve(__dirname, '..', 'evidence', '03_nuevo_form_lleno.png') });
    console.log('3. Formulario lleno capturado');

    // Clic en Guardar
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);
    await page.screenshot({ path: path.resolve(__dirname, '..', 'evidence', '04_list_con_nuevo_tipo.png') });
    console.log('4. Listado con nuevo tipo capturado');

    // 5. Formulario Editar (Editar el tipo #1)
    await page.goto('http://localhost:4200/alojamiento/tipos-habitacion/1/editar', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '..', 'evidence', '05_editar_form_cargado.png') });
    console.log('5. Formulario editar capturado');

    // 6. Probar eliminación de un tipo con habitaciones asociadas (tipo #1 tiene cuartos 103, 203, 303, 403)
    await page.goto('http://localhost:4200/alojamiento/tipos-habitacion', { waitUntil: 'networkidle0' });
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    // Click en el primer boton eliminar
    const deleteBtns = await page.$$('.btn-danger');
    if (deleteBtns.length > 0) {
      await deleteBtns[0].click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.resolve(__dirname, '..', 'evidence', '06_error_fk_asociada.png') });
      console.log('6. Error FK capturado');
    }

    // 7. Navegación a la segunda ruta: Avisos Comunitarios
    await page.goto('http://localhost:4200/comunicacion/avisos', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '..', 'evidence', '07_avisos_segunda_ruta.png') });
    console.log('7. Avisos segunda ruta capturado');

    await browser.close();
    console.log('ALL_CAPTURES_SUCCESS');
  } catch (err) {
    console.error('ERROR_DURING_CAPTURE:', err);
    process.exit(1);
  }
})();