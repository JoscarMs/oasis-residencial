const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const evidenceDir = path.resolve('c:/ING-Sistemas/Proyecto OASIS/evidence');
if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

(async () => {
  try {
    console.log('Iniciando navegador Chrome...');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 1. Listado Completo de Habitaciones con Nombre del Tipo Padre
    console.log('1. Navegando al listado general...');
    await page.goto('http://localhost:4200/alojamiento/habitaciones', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(evidenceDir, 's08_01_habitaciones_list.png') });
    console.log('Evidencia 1 capturada: Listado general con datos del padre');

    // 2. Filtro de Habitaciones por Entidad Padre (Filtro por Tipo)
    console.log('2. Aplicando filtro por Tipo Padre...');
    // Seleccionar la opcion con valor 1 (Individual Basica) o 4 (Suite)
    await page.select('#filtroTipo', '4');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(evidenceDir, 's08_02_habitaciones_filtradas.png') });
    console.log('Evidencia 2 capturada: Filtro por entidad padre aplicado');

    // 3. Formulario Nuevo con Dropdown dependiente y placeholder disabled
    console.log('3. Navegando al formulario de nueva habitacion...');
    await page.goto('http://localhost:4200/alojamiento/habitaciones/nueva', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(evidenceDir, 's08_03_form_nuevo_vacio.png') });
    console.log('Evidencia 3 capturada: Formulario vacio con placeholder deshabilitado');

    // 4. Validacion multinivel: intentar guardar sin seleccionar tipo valido
    console.log('4. Provocando validacion de dependencia...');
    await page.type('#numero', '501');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(evidenceDir, 's08_04_error_validacion_dependencia.png') });
    console.log('Evidencia 4 capturada: Error de validacion de tipo dependiente');

    // 5. Completar Formulario con Datos Validos
    console.log('5. Llenando formulario completo...');
    await page.evaluate(() => {
      document.querySelector('#piso').value = '';
    });
    await page.type('#piso', '5');
    // Seleccionar tipo 4 (Suite) en el select
    await page.select('#tipoHabitacionId', '4');
    await page.evaluate(() => {
      document.querySelector('#precio').value = '';
    });
    await page.type('#precio', '850.00');
    await page.screenshot({ path: path.join(evidenceDir, 's08_05_form_lleno.png') });
    console.log('Evidencia 5 capturada: Formulario lleno con clave foranea');

    // 6. Guardar y verificar habitacion creada en el listado
    console.log('6. Guardando habitacion...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(evidenceDir, 's08_06_creada_en_lista.png') });
    console.log('Evidencia 6 capturada: Habitacion creada mostrada en listado');

    // 7. Edicion de habitacion: verificar preseleccion del tipo padre en el select [ngValue]
    // Buscamos la habitacion recien creada (501) o ID 1
    console.log('7. Abriendo formulario de edicion...');
    // Obtenemos el link de editar de la primera fila o del 501
    const editLinks = await page.$$('a.btn-outline');
    if (editLinks.length > 0) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        editLinks[0].click()
      ]);
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(evidenceDir, 's08_07_form_editar_preseleccionado.png') });
      console.log('Evidencia 7 capturada: Edicion con tipo padre preseleccionado');
    }

    // 8. Eliminacion exitosa
    console.log('8. Probando eliminacion...');
    await page.goto('http://localhost:4200/alojamiento/habitaciones', { waitUntil: 'networkidle0' });
    page.on('dialog', async dialog => {
      console.log('Dialogo confirmado:', dialog.message());
      await dialog.accept();
    });
    // Hacemos click en eliminar de la ultima habitacion registrada
    const deleteButtons = await page.$$('button.btn-danger');
    if (deleteButtons.length > 0) {
      await deleteButtons[deleteButtons.length - 1].click();
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(evidenceDir, 's08_08_eliminacion_exitosa.png') });
      console.log('Evidencia 8 capturada: Eliminacion exitosa con mensaje de confirmacion');
    }

    await browser.close();
    console.log('TODAS_LAS_CAPTURAS_COMPLETADAS_CON_EXITO');
  } catch (err) {
    console.error('Error durante la captura:', err);
    process.exit(1);
  }
})();
