const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = path.resolve('c:/ING-Sistemas/Proyecto OASIS/evidence');
const OUTPUT_PDF = path.resolve('c:/ING-Sistemas/Proyecto OASIS/S08_LP2_Equipo04_MenaSarmientoJoseCarlos.pdf');
const OUTPUT_HTML = path.resolve('c:/ING-Sistemas/Proyecto OASIS/S08_Informe_CRUD_Dependiente_OASIS.html');

function getBase64(filename) {
  const p = path.join(EVIDENCE_DIR, filename);
  if (fs.existsSync(p)) {
    const data = fs.readFileSync(p);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  console.warn('No existe imagen:', filename);
  return '';
}

const imgList = getBase64('framed_s08_01_list.png');
const imgFiltradas = getBase64('framed_s08_02_filtradas.png');
const imgFormNuevo = getBase64('framed_s08_03_form_nuevo.png');
const imgErrorDep = getBase64('framed_s08_04_error_dep.png');
const imgFormLleno = getBase64('framed_s08_05_form_lleno.png');
const imgCreada = getBase64('framed_s08_06_creada.png');
const imgEditar = getBase64('framed_s08_07_form_editar.png');
const imgEliminada = getBase64('framed_s08_08_eliminada.png');

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>S08 - CRUD de Tablas Dependientes - Oasis</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 8mm 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.35;
      font-size: 8pt;
      margin: 0;
      padding: 0;
    }

    .sheet {
      page-break-after: always;
      height: 275mm;
      max-height: 275mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    .sheet:last-child {
      page-break-after: avoid;
    }

    /* Cabecera Académica */
    .header-banner {
      border-bottom: 2px solid #0d9488;
      padding-bottom: 4px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .inst-title {
      font-size: 9.8pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .inst-sub {
      font-size: 7.2pt;
      color: #475569;
      font-weight: 600;
    }
    .badge-unit {
      background: #0d9488;
      color: white;
      padding: 3px 7px;
      border-radius: 4px;
      font-size: 7.2pt;
      font-weight: 700;
      text-align: right;
    }

    /* Banner Principal */
    .doc-title-box {
      background: linear-gradient(135deg, #042f2e 0%, #0f766e 100%);
      color: white;
      padding: 8px 12px;
      border-radius: 5px;
      margin-bottom: 8px;
    }
    .doc-category {
      font-size: 6.8pt;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #99f6e4;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .doc-main-title {
      font-size: 12pt;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 2px 0;
    }
    .doc-subtitle {
      font-size: 7.5pt;
      color: #ccfbf1;
      margin: 0;
    }

    /* Tarjetas de Datos del Estudiante */
    .student-card {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 5px;
      padding: 6px 10px;
      margin-bottom: 8px;
      border-left: 4px solid #0d9488;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4px 10px;
      font-size: 7.8pt;
    }
    .student-item strong {
      color: #0f172a;
    }

    /* Encabezados */
    h2 {
      font-size: 9.5pt;
      color: #0f172a;
      border-left: 3.5px solid #0d9488;
      padding-left: 6px;
      margin-top: 6px;
      margin-bottom: 4px;
      font-weight: 800;
    }
    h3 {
      font-size: 8.3pt;
      color: #0f766e;
      margin-top: 4px;
      margin-bottom: 3px;
      font-weight: 700;
    }

    p {
      margin: 0 0 4px 0;
      text-align: justify;
    }

    .callout {
      border-left: 3px solid #0d9488;
      background-color: #f0fdfa;
      padding: 5px 8px;
      border-radius: 0 4px 4px 0;
      margin: 4px 0;
      font-size: 7.5pt;
    }
    .callout-warning {
      border-left-color: #f59e0b;
      background-color: #fffbeb;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.3pt;
      margin: 4px 0 6px 0;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 4px 6px;
      text-align: left;
      vertical-align: middle;
    }
    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Contenedor de Evidencia Visual */
    .evidence-block {
      margin: 4px 0 6px 0;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 5px;
      background-color: #ffffff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .evidence-title {
      font-size: 7.8pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .evidence-tag {
      font-size: 6.5pt;
      background: #ccfbf1;
      color: #0f766e;
      padding: 1px 4px;
      border-radius: 3px;
      font-weight: 700;
    }
    .evidence-img {
      width: 100%;
      max-height: 182px;
      object-fit: contain;
      border-radius: 3px;
      border: 1px solid #cbd5e1;
      display: block;
      margin: 0 auto;
    }
    .evidence-caption {
      font-size: 7pt;
      color: #475569;
      margin-top: 3px;
      text-align: justify;
      line-height: 1.25;
    }

    pre, code {
      font-family: 'Consolas', 'Courier New', monospace;
    }
    code {
      font-size: 7.2pt;
      background-color: #f1f5f9;
      padding: 1px 3px;
      border-radius: 3px;
      color: #0f766e;
    }
    pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 5px 8px;
      border-radius: 4px;
      font-size: 6.7pt;
      line-height: 1.28;
      margin: 4px 0;
    }

    .footer {
      margin-top: 4px;
      padding-top: 3px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 6.8pt;
      color: #64748b;
    }

    /* Grillas y Columnas */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .badge-pill {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 10px;
      font-size: 6.5pt;
      font-weight: 700;
    }
    .badge-green { background-color: #dcfce7; color: #166534; }
    .badge-blue { background-color: #dbeafe; color: #1e40af; }
    .badge-amber { background-color: #fef3c7; color: #92400e; }
  </style>
</head>
<body>

  <!-- ==================== PÁGINA 1 ==================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">UNIVERSIDAD PERUANA UNIÓN — SEDE CENTRAL</div>
          <div class="inst-sub">FACULTAD DE INGENIERÍA Y ARQUITECTURA • E.P. INGENIERÍA DE SISTEMAS</div>
        </div>
        <div class="badge-unit">
          LP2 — UNIDAD II<br>
          <span style="font-size: 6.5pt; font-weight: normal;">MONOLITO MODULAR SPA</span>
        </div>
      </div>

      <div class="doc-title-box">
        <div class="doc-category">EVIDENCIA TÉCNICA DE ACTIVIDAD AUTÓNOMA — SESIÓN S08</div>
        <h1 class="doc-main-title">CRUD DE TABLAS DEPENDIENTES — RESIDENCIA UNIVERSITARIA OASIS</h1>
        <p class="doc-subtitle">Implementación de formularios dependientes con selección foránea mediante listas desplegables, validación multinivel y presentación de información relacionada en Angular 19 y Spring Boot.</p>
      </div>

      <div class="student-card">
        <div class="student-item"><strong>Estudiante:</strong> José Carlos Mena Sarmiento</div>
        <div class="student-item"><strong>Equipo:</strong> Equipo 04</div>
        <div class="student-item"><strong>Asignatura:</strong> Lenguaje de Programación II (LP2)</div>
        <div class="student-item"><strong>Rol de Desarrollo:</strong> Programador 1 — Módulo Alojamiento</div>
        <div class="student-item"><strong>Docente:</strong> Ing. Angel Sullon Macalupu (@asullom)</div>
        <div class="student-item"><strong>Repositorio:</strong> <code>https://github.com/asullom/oasis-frontend</code></div>
      </div>

      <div class="callout">
        <strong>Contexto del Dominio OASIS:</strong> En la gestión operativa de residencias universitarias, las unidades físicas (<code>Habitacion</code>) representan una tabla dependiente crítica cuya existencia y tarifario base dependen obligatoriamente del catálogo de categorías (<code>TipoHabitacion</code>). Un usuario administrativo no debe interactuar con números enteros crudos (FKs), sino elegir categorías reales con validación estricta de integridad referencial.
      </div>

      <h2>1. Modelos y Servicios HTTP</h2>
      <p>
        Para respetar la separación de responsabilidades y la disciplina de tipos de TypeScript, se implementaron <strong>dos modelos desacoplados</strong>: uno para la respuesta del servidor que incluye datos aplanados del padre (<code>tipoHabitacionNombre</code>), y un contrato de petición que únicamente transmite el identificador foráneo numérico (<code>tipoHabitacionId</code>), evitando la sobrecarga de transportar el objeto padre anidado completo en operaciones de mutación (POST/PUT).
      </p>

      <div class="grid-2">
        <div>
          <h3>Modelos TypeScript (habitacion.model.ts)</h3>
          <pre><code>// 1. Modelo de Recepción (Backend -> Frontend)
export interface Habitacion {
  id?: number;
  numero: string;
  piso: number;
  precio: number;
  estado: string;
  tipoHabitacionId: number;
  tipoHabitacionNombre?: string; // Nombre resuelto del padre
}

// 2. Modelo de Envío (Frontend -> Backend POST/PUT)
export interface HabitacionRequest {
  numero: string;
  piso: number;
  precio: number;
  estado: string;
  tipoHabitacionId: number; // Solo clave foránea numérica
}</code></pre>
        </div>

        <div>
          <h3>Servicio Especializado (habitacion-service.ts)</h3>
          <pre><code>@Injectable({ providedIn: 'root' })
export class HabitacionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly resource = '/api/v1/habitaciones';

  // Filtro opcional por entidad padre resuelto en servidor
  listar(tipoHabitacionId?: number): Observable&lt;Habitacion[]&gt; {
    let params = new HttpParams();
    if (tipoHabitacionId && tipoHabitacionId > 0) {
      params = params.set('tipoHabitacionId', tipoHabitacionId.toString());
    }
    return this.http.get&lt;Habitacion[]&gt;(this.api.buildUrl(this.resource), { params });
  }
  // obtener(id), crear(req), actualizar(id, req), eliminar(id)...
}</code></pre>
        </div>
      </div>

      <p style="margin-top: 4px;">
        <strong>Principio de Encapsulamiento y Reutilización:</strong> Los componentes <code>HabitacionList</code> y <code>HabitacionForm</code> nunca ejecutan llamadas directas a <code>HttpClient</code>. La carga del combo dependiente se realiza inyectando y reutilizando el servicio padre ya construido en la sesión anterior (<code>TipoHabitacionService.listar()</code>), centralizando los endpoints y asegurando que las opciones del formulario reflejen fielmente el catálogo vigente.
      </p>

      <table>
        <thead>
          <tr>
            <th>Artefacto / Capa</th>
            <th>Ruta del Recurso</th>
            <th>Responsabilidad Arquitectónica</th>
            <th>Tipo de Intercambio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>TipoHabitacionService</code></td>
            <td><code>/api/v1/tipos-habitacion</code></td>
            <td>Proveer catálogo padre independiente (Categorías y Tarifas)</td>
            <td>Observable&lt;TipoHabitacion[]&gt;</td>
          </tr>
          <tr>
            <td><code>HabitacionService</code></td>
            <td><code>/api/v1/habitaciones</code></td>
            <td>CRUD operativo dependiente de cuartos físicos y filtros</td>
            <td>Observable&lt;Habitacion[]&gt;</td>
          </tr>
          <tr>
            <td><code>HabitacionController</code></td>
            <td><code>GET /api/v1/habitaciones?tipoHabitacionId=X</code></td>
            <td>Endpoint REST Spring Boot con query param opcional</td>
            <td>ResponseEntity&lt;List&lt;HabitacionResponse&gt;&gt;</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <span>Sesión S08: CRUD de Tablas Dependientes • Monolito Modular OASIS</span>
      <span>Estudiante: José Carlos Mena Sarmiento • Equipo 04</span>
      <span>Página 1 de 6</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 2 ==================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">UNIVERSIDAD PERUANA UNIÓN — SEDE CENTRAL</div>
          <div class="inst-sub">FACULTAD DE INGENIERÍA Y ARQUITECTURA • E.P. INGENIERÍA DE SISTEMAS</div>
        </div>
        <div class="badge-unit">LP2 — SESIÓN S08</div>
      </div>

      <h2>2. Lista con Información Relacionada y Filtro por Entidad Padre</h2>
      <p>
        La presentación de datos dependientes exige humanizar las referencias foráneas. En lugar de desplegar <code>tipo_habitacion_id: 1</code>, la tabla de la SPA expone visualmente el nombre real mediante insignias destacadas (<code>tipoHabitacionNombre</code>), permitiendo a la administración identificar de inmediato la categoría, el piso y la tarifa mensual de cada cuarto físico.
      </p>

      <!-- Evidencia 1: Listado General -->
      <div class="evidence-block">
        <div class="evidence-title">
          <span>Evidencia 1: Inventario General de Habitaciones Físicas con Datos del Padre</span>
          <span class="evidence-tag">VERIFICADO EN VIVO — http://localhost:4200/alojamiento/habitaciones</span>
        </div>
        <img src="${imgList}" class="evidence-img" alt="Listado General de Habitaciones">
        <div class="evidence-caption">
          <strong>Figura 2.1.</strong> Pantalla de listado operativo en Angular 19 conectada al backend Spring Boot. Se visualizan las 24 habitaciones precargadas en Oracle/H2 distribuidas en 4 pisos. En la columna "Tipo Asignado (Padre)" se presenta el nombre textual de la entidad relacionada (Individual Estándar, Individual Básica, Doble Compartida, Suite Ejecutiva) junto al estado operativo y precio mensual formateado.
        </div>
      </div>

      <!-- Evidencia 2: Filtro por Entidad Padre -->
      <div class="evidence-block">
        <div class="evidence-title">
          <span>Evidencia 2: Filtrado por Entidad Padre Resuelto en el Servidor REST</span>
          <span class="evidence-tag">QUERY PARAM: ?tipoHabitacionId=4</span>
        </div>
        <img src="${imgFiltradas}" class="evidence-img" alt="Habitaciones Filtradas por Tipo">
        <div class="evidence-caption">
          <strong>Figura 2.2.</strong> Ejecución del filtro por tipo de habitación seleccionando "Suite Universitaria / Ejecutiva" (ID 4). La SPA despacha la petición <code>GET /api/v1/habitaciones?tipoHabitacionId=4</code>, reduciendo inmediatamente la vista a las únicas 4 habitaciones Suite del complejo (106, 206, 306 y 406). Este filtrado se procesa en el motor de base de datos relacional y no en la memoria del navegador.
        </div>
      </div>

      <div class="callout">
        <strong>Justificación Técnica de Filtrado en Servidor:</strong> Filtrar en el navegador (usando <code>Array.prototype.filter()</code> en cliente) solo es viable con unas pocas decenas de registros. En una residencia o cadena hotelera real con miles de cuartos históricos y reservas, transferir la base de datos completa por HTTP satura el ancho de banda y la memoria del cliente. La consulta delegada <code>repository.findByTipoHabitacionId(...)</code> resuelve el filtrado mediante índices B-Tree en microsegundos.
      </div>
    </div>

    <div class="footer">
      <span>Sesión S08: CRUD de Tablas Dependientes • Monolito Modular OASIS</span>
      <span>Estudiante: José Carlos Mena Sarmiento • Equipo 04</span>
      <span>Página 2 de 6</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 3 ==================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">UNIVERSIDAD PERUANA UNIÓN — SEDE CENTRAL</div>
          <div class="inst-sub">FACULTAD DE INGENIERÍA Y ARQUITECTURA • E.P. INGENIERÍA DE SISTEMAS</div>
        </div>
        <div class="badge-unit">LP2 — SESIÓN S08</div>
      </div>

      <h2>3. Lista Desplegable y Formulario Reactivo</h2>
      <p>
        La creación de entidades dependientes requiere que el usuario seleccione obligatoriamente un registro padre preexistente. En <code>HabitacionForm</code>, se utilizó un control <code>&lt;select&gt;</code> enlazado mediante la directiva <code>[ngValue]</code> de Angular, junto con un placeholder inicial deshabilitado con valor <code>0</code> para impedir selecciones accidentales.
      </p>

      <!-- Evidencia 3: Formulario Nuevo -->
      <div class="evidence-block">
        <div class="evidence-title">
          <span>Evidencia 3: Formulario de Alta con Dropdown Poblado Dinámicamente desde Catálogo Padre</span>
          <span class="evidence-tag">RUTA: /alojamiento/habitaciones/nueva</span>
        </div>
        <img src="${imgFormNuevo}" class="evidence-img" alt="Formulario Nuevo de Habitación">
        <div class="evidence-caption">
          <strong>Figura 3.1.</strong> Formulario reactivo al iniciar la creación. El combo selector ejecuta automáticamente <code>TipoHabitacionService.listar()</code> durante el ciclo <code>ngOnInit</code>, desplegando los nombres de tipos con su tarifa base y capacidad de huéspedes. Se aprecia la opción por defecto deshabilitada <code>[ngValue]="0"</code> con texto guía "-- Seleccione un Tipo de Habitación del Catálogo --".
        </div>
      </div>

      <div class="grid-2">
        <!-- Evidencia 5: Formulario Lleno -->
        <div class="evidence-block" style="margin-top: 0;">
          <div class="evidence-title">
            <span>Evidencia 5: Formulario Lleno (Hab. 501)</span>
            <span class="evidence-tag">PAYLOAD LISTO</span>
          </div>
          <img src="${imgFormLleno}" class="evidence-img" style="max-height: 155px;" alt="Formulario Lleno">
          <div class="evidence-caption">
            <strong>Figura 3.2.</strong> Registro de la habitación 501 (Piso 5), vinculada a la categoría Suite (tarifa operativa S/ 850.00, estado DISPONIBLE).
          </div>
        </div>

        <!-- Evidencia 6: Creada en Lista -->
        <div class="evidence-block" style="margin-top: 0;">
          <div class="evidence-title">
            <span>Evidencia 6: Habitación Registrada en Lista</span>
            <span class="evidence-tag">PERSISTENCIA ACID</span>
          </div>
          <img src="${imgCreada}" class="evidence-img" style="max-height: 155px;" alt="Habitacion Creada en Lista">
          <div class="evidence-caption">
            <strong>Figura 3.3.</strong> Retorno al inventario tras el POST exitoso. La unidad física #25 (Hab. 501) aparece en el piso 5 con su insignia de Suite Ejecutiva.
          </div>
        </div>
      </div>

      <div class="callout">
        <strong>Directiva <code>[ngValue]</code> vs Atributo <code>[value]</code>:</strong> En HTML estándar, el atributo <code>value</code> siempre serializa las entradas a tipo string (<code>"4"</code>). Si el modelo TypeScript define la clave foránea como número (<code>tipoHabitacionId: number</code>), la comparación en tiempo de edición falla silenciosamente (<code>4 !== "4"</code>). La directiva <code>[ngValue]</code> de Angular preserva el tipo primitivo exacto y permite la comparación estricta mediante el <code>SelectControlValueAccessor</code>.
      </div>
    </div>

    <div class="footer">
      <span>Sesión S08: CRUD de Tablas Dependientes • Monolito Modular OASIS</span>
      <span>Estudiante: José Carlos Mena Sarmiento • Equipo 04</span>
      <span>Página 3 de 6</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 4 ==================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">UNIVERSIDAD PERUANA UNIÓN — SEDE CENTRAL</div>
          <div class="inst-sub">FACULTAD DE INGENIERÍA Y ARQUITECTURA • E.P. INGENIERÍA DE SISTEMAS</div>
        </div>
        <div class="badge-unit">LP2 — SESIÓN S08</div>
      </div>

      <h2>3.1 Preselección Automática en Edición y 4. Validación de Dependencias</h2>
      <p>
        Uno de los mayores retos en pantallas dependientes es garantizar que, al entrar en modo edición (<code>/alojamiento/habitaciones/:id/editar</code>), el formulario recupere y preseleccione en el combo la categoría exacta a la que pertenece la habitación, sin que el control vuelva a colocarse en la opción en blanco.
      </p>

      <!-- Evidencia 7: Edición con preselección -->
      <div class="evidence-block">
        <div class="evidence-title">
          <span>Evidencia 7: Edición de Habitación Existente con Preselección del Tipo Padre</span>
          <span class="evidence-tag">RUTA: /alojamiento/habitaciones/1/editar</span>
        </div>
        <img src="${imgEditar}" class="evidence-img" alt="Edición con Preselección">
        <div class="evidence-caption">
          <strong>Figura 4.1.</strong> Formulario en modo edición de la Habitación 101. El observable <code>HabitacionService.obtener(1)</code> recupera la entidad y alimenta el formulario mediante <code>patchValue()</code>. Gracias a que tanto las opciones como el control manejan tipos numéricos primitivos idénticos vía <code>[ngValue]</code>, Angular selecciona automáticamente "Individual Estándar" sin intervención imperativa.
        </div>
      </div>

      <div class="grid-2">
        <!-- Evidencia 4: Error de validacion -->
        <div class="evidence-block" style="margin-top: 0;">
          <div class="evidence-title">
            <span>Evidencia 4: Validación de Dependencia</span>
            <span class="evidence-tag">NIVEL 1 Y 2</span>
          </div>
          <img src="${imgErrorDep}" class="evidence-img" style="max-height: 155px;" alt="Error de Validación Dependiente">
          <div class="evidence-caption">
            <strong>Figura 4.2.</strong> Al intentar guardar con la opción placeholder (<code>id: 0</code>), <code>Validators.min(1)</code> y la comprobación de componente bloquean el envío y presentan el error específico "Debe seleccionar obligatoriamente un tipo de habitación válido del catálogo".
          </div>
        </div>

        <!-- Evidencia 8: Eliminacion exitosa -->
        <div class="evidence-block" style="margin-top: 0;">
          <div class="evidence-title">
            <span>Evidencia 8: Eliminación Operativa</span>
            <span class="evidence-tag">FLUJO COMPLETO</span>
          </div>
          <img src="${imgEliminada}" class="evidence-img" style="max-height: 155px;" alt="Eliminación Exitosa">
          <div class="evidence-caption">
            <strong>Figura 4.3.</strong> Confirmación modal de eliminación con diálogo nativo y remoción de la habitación física #25 (Hab. 501), mostrando el banner verde de confirmación "Habitación N° 501 eliminada exitosamente del inventario".
          </div>
        </div>
      </div>

      <div class="callout callout-warning">
        <strong>Estrategia de Validación Defensiva Multinivel:</strong>
        <br>• <strong>Nivel 1 (UI / Angular):</strong> Comprobación de estado <code>invalid</code> y <code>touched</code> impidiendo que el formulario se envíe sin datos mínimos obligatorios.
        <br>• <strong>Nivel 2 (Lógica Cliente):</strong> Verificación de integridad de negocio (comprobar que la clave foránea numérica sea estrictamente mayor a 0).
        <br>• <strong>Nivel 3 (Backend REST):</strong> Detección de fallos de integridad referencial (<code>404 Not Found</code> cuando el tipo padre fue eliminado concurrentemente, o <code>409 Conflict</code> si se intenta borrar un cuarto con contratos activos).
      </div>
    </div>

    <div class="footer">
      <span>Sesión S08: CRUD de Tablas Dependientes • Monolito Modular OASIS</span>
      <span>Estudiante: José Carlos Mena Sarmiento • Equipo 04</span>
      <span>Página 4 de 6</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 5 ==================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">UNIVERSIDAD PERUANA UNIÓN — SEDE CENTRAL</div>
          <div class="inst-sub">FACULTAD DE INGENIERÍA Y ARQUITECTURA • E.P. INGENIERÍA DE SISTEMAS</div>
        </div>
        <div class="badge-unit">LP2 — SESIÓN S08</div>
      </div>

      <h2>5. Diagnóstico de Error o Hallazgo Técnico Real</h2>
      <p>
        Durante el desarrollo integral del CRUD dependiente de habitaciones físicas, se diagnosticaron tres hallazgos técnicos reales cuya resolución fortaleció la estabilidad y robustez de la arquitectura:
      </p>

      <table>
        <thead>
          <tr>
            <th>Caso / Hallazgo</th>
            <th>Causa Raíz Identificada</th>
            <th>Impacto en la Aplicación</th>
            <th>Solución Técnica Aplicada</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Deselección en Modo Editar (Value vs NgValue)</strong></td>
            <td>El template utilizaba <code>&lt;option [value]="tipo.id"&gt;</code>, convirtiendo el ID en string (<code>"1"</code>), mientras que el modelo entregaba <code>number</code> (<code>1</code>).</td>
            <td>Al abrir el formulario de edición de una habitación, el combo aparecía en blanco o reseteado al placeholder.</td>
            <td>Se reemplazó por la directiva <code>[ngValue]="tipo.id"</code>, permitiendo que Angular compare por identidad primitiva estricta en <code>patchValue()</code>.</td>
          </tr>
          <tr>
            <td><strong>2. Falla NG8004 en Compilación de Frontend</strong></td>
            <td>Se usó la tubería <code>| number:'1.2-2'</code> en <code>habitacion-list.html</code> sin declarar <code>DecimalPipe</code> en el array <code>imports</code> del componente standalone.</td>
            <td>Error fatal de compilación Angular al ejecutar <code>ng build</code>: "No pipe found with name 'number'".</td>
            <td>Se importó <code>DecimalPipe</code> desde <code>@angular/common</code> en los imports de <code>HabitacionList</code>, resolviendo el bundling de Vite.</td>
          </tr>
          <tr>
            <td><strong>3. Compatibilidad de Parámetros Opcionales en Spring</strong></td>
            <td>El endpoint <code>GET /api/v1/habitaciones</code> requería soportar listado global y filtrado por categoría sin crear rutas redundantes.</td>
            <td>Si el cliente no enviaba <code>tipoHabitacionId</code>, el backend podía arrojar error de parámetro obligatorio.</td>
            <td>Se declaró <code>@RequestParam(required = false) Long tipoHabitacionId</code> y sobrecarga de servicio delegando a <code>findByTipoHabitacionId</code>.</td>
          </tr>
        </tbody>
      </table>

      <h2>6. Reflexión Técnica Breve</h2>
      <div class="callout">
        <strong>¿Por qué el formulario valida que se haya elegido una categoría si el backend ya rechaza una categoría inexistente — y qué pasaría si solo existiera una de las dos validaciones?</strong>
        <br><br>
        El formulario valida la selección de categoría para optimizar la experiencia de usuario (UX) y evitar tráfico de red innecesario, ofreciendo feedback visual inmediato antes del envío HTTP. Por su parte, el backend valida la clave foránea como barrera inviolable de seguridad e integridad relacional (ACID). Si solo existiera la validación del frontend, cualquier cliente externo (Swagger, Postman, scripts maliciosos) podría corromper la base de datos insertando habitaciones con categorías huérfanas o inexistentes. Si solo existiera la validación del backend, la interfaz obligaría al usuario a esperar una respuesta asíncrona de error 400/404 para enterarse de una omisión evitable, degradando la usabilidad y saturando el servidor con peticiones defectuosas.
      </div>

      <h2>7. Banco de Respuestas a Preguntas de Defensa</h2>
      <p style="font-size: 7.2pt; margin-bottom: 2px;">
        <strong>1. ¿Por qué el backend devuelve la categoría anidada pero recibe solo el ID?</strong> Porque en lectura la pantalla necesita desplegar el nombre y propiedades del padre para el usuario humano, pero en escritura solo se necesita la referencia foránea; separar los modelos evita que el frontend intente mutar datos del padre por error.
      </p>
      <p style="font-size: 7.2pt; margin-bottom: 2px;">
        <strong>2. ¿Qué diferencia hay entre [value] y [ngValue]?</strong> <code>[value]</code> es un atributo HTML que convierte cualquier dato a string (<code>"4"</code>), provocando desajuste de tipos con variables numéricas. <code>[ngValue]</code> es una directiva de Angular que preserva tipos de datos complejos y números primitivos (<code>4</code>), garantizando la preselección en edición.
      </p>
      <p style="font-size: 7.2pt; margin-bottom: 2px;">
        <strong>3. ¿Por qué el filtro por categoría se hace en el servidor y no en el navegador?</strong> Por escalabilidad y rendimiento: transferir miles de cuartos a la memoria del navegador para filtrarlos con JavaScript satura el cliente y desperdicia ancho de banda, mientras que la base de datos resuelve el filtro con índices en milisegundos.
      </p>
      <p style="font-size: 7.2pt; margin-bottom: 2px;">
        <strong>4. ¿Por qué ambos validan la misma dependencia y cuál protege los datos?</strong> El backend protege los datos de manera definitiva e inviolable (capa autoritativa); el frontend protege la experiencia del usuario y optimiza el consumo de recursos de cómputo en red.
      </p>
      <p style="font-size: 7.2pt; margin-bottom: 2px;">
        <strong>5. ¿Por qué ProductoForm / HabitacionForm no vuelve a escribir llamadas a la tabla padre?</strong> Por el principio DRY (Don't Repeat Yourself) y alta cohesión: <code>TipoHabitacionService</code> ya implementa la URL base, manejo de tipos y caché institucional del catálogo padre.
      </p>
      <p style="font-size: 7.2pt; margin-bottom: 2px;">
        <strong>6. ¿Qué ocurre si un compañero elimina la categoría mientras el formulario está abierto?</strong> El backend rechaza la persistencia respondiendo HTTP 404 (o 400); la pantalla captura el error en <code>error.subscribe()</code>, notifica que la categoría ya no existe, resetea el control a 0 y recarga el combo.
      </p>
      <p style="font-size: 7.2pt; margin-bottom: 2px;">
        <strong>7. En el dominio OASIS, ¿qué cambiaría si la relación fuera opcional?</strong> <code>Habitacion</code> depende de <code>TipoHabitacion</code>. Si fuera opcional (por ejemplo, cuartos en remodelación sin clasificar), <code>tipoHabitacionId</code> admitiría valores nulos en BD, el combo incluiría la opción "Sin Categoría Asignada", y se omitiría <code>Validators.min(1)</code>.
      </p>
    </div>

    <div class="footer">
      <span>Sesión S08: CRUD de Tablas Dependientes • Monolito Modular OASIS</span>
      <span>Estudiante: José Carlos Mena Sarmiento • Equipo 04</span>
      <span>Página 5 de 6</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 6 ==================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">UNIVERSIDAD PERUANA UNIÓN — SEDE CENTRAL</div>
          <div class="inst-sub">FACULTAD DE INGENIERÍA Y ARQUITECTURA • E.P. INGENIERÍA DE SISTEMAS</div>
        </div>
        <div class="badge-unit">
          ANEXO FINAL<br>
          <span style="font-size: 6.5pt; font-weight: normal;">EVALUACIÓN Y METACOGNICIÓN</span>
        </div>
      </div>

      <div class="doc-title-box">
        <div class="doc-category">CIERRE PEDAGÓGICO DE LA ACTIVIDAD</div>
        <h1 class="doc-main-title" style="font-size: 11pt;">ANEXO: FEEDBACK DE LA SESIÓN S08 — CRUD DE TABLAS DEPENDIENTES</h1>
        <p class="doc-subtitle">Instrumento de metacognición individual para consolidar el aprendizaje sobre gestión de relaciones foráneas, componentes reactivos y validaciones defensivas.</p>
      </div>

      <div class="student-card">
        <div class="student-item"><strong>Estudiante Evaluado:</strong> José Carlos Mena Sarmiento</div>
        <div class="student-item"><strong>Equipo de Trabajo:</strong> Equipo 04 (OASIS)</div>
        <div class="student-item"><strong>Sesión Correspondiente:</strong> S08 — CRUD de Tablas Dependientes</div>
        <div class="student-item"><strong>Fecha de Consolidación:</strong> 29 de septiembre de 2026</div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">N°</th>
            <th style="width: 250px;">Pregunta del Instrumento de Feedback</th>
            <th>Respuesta y Valoración del Estudiante</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center; font-weight: 700;">1</td>
            <td><strong>¿Cuál es el aprendizaje más importante que te llevas de la clase de hoy?</strong></td>
            <td>
              Comprender a profundidad la diferencia fundamental entre el atributo nativo <code>[value]</code> y la directiva de Angular <code>[ngValue]</code> en elementos <code>&lt;select&gt;</code>. Entendí cómo el manejo de tipos primitivos (números vs cadenas) impacta directamente en el <code>SelectControlValueAccessor</code> para lograr la preselección automática y transparente de claves foráneas en formularios de edición.
            </td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 700;">2</td>
            <td><strong>¿Qué punto de la clase te resultó más confuso o te dejó con dudas?</strong></td>
            <td>
              El manejo de la sincronización asíncrona cuando un registro padre es eliminado de forma concurrente desde otra sesión mientras el usuario mantiene abierto el formulario de creación. La diferenciación precisa del código HTTP 404 entre "recurso dependiente inexistente" y "entidad padre eliminada" requirió analizar a fondo el cuerpo del error devuelto por Spring Boot.
            </td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 700;">3</td>
            <td><strong>¿Tienes alguna pregunta que te gustaría que sea respondida la siguiente clase?</strong></td>
            <td>
              En la sesión S09 (formularios transaccionales cabecera-detalle como Contratos o Ventas), ¿cómo se gestiona eficientemente el estado reactivo cuando una fila de detalle se añade dinámicamente y cada ítem requiere su propio combo selector dependiente sin saturar la red con peticiones repetidas al backend?
            </td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 700;">4</td>
            <td><strong>Sobre tu nivel de comprensión de la clase de hoy, marca una opción:</strong></td>
            <td>
              <span class="badge-pill badge-green">☑ ¡Entendido! — Lo domino y podría explicarlo.</span><br>
              <span style="color: #64748b; font-size: 6.8pt;">☐ Más o menos. — Entendí la idea general, pero tengo dudas.<br>☐ Necesito ayuda. — Me siento perdido/a con este tema.</span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 700;">5</td>
            <td><strong>¿Cómo puedo ayudarte a comprender mejor el tema?</strong></td>
            <td>
              Continuar con el enfoque de casos prácticos reales y errores frecuentes en vivo, especialmente mostrando cómo inspeccionar la pestaña <em>Network</em> de DevTools para diagnosticar discrepancias de carga entre JSON de petición y respuesta en arquitecturas desacopladas.
            </td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 700;">6</td>
            <td><strong>Pensando en tu participación y esfuerzo en la clase de hoy, ¿cómo te autoevaluarías?</strong></td>
            <td>
              <span class="badge-pill badge-green">☑ Muy Comprometido/a: Me esforcé al máximo.</span><br>
              <span style="color: #64748b; font-size: 6.8pt;">☐ Comprometido/a: Sé que podría haberme esforzado un poco más.<br>☐ Poco Comprometido/a: Hoy no di mi mejor esfuerzo.</span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 700;">7</td>
            <td><strong>Mi satisfacción con la clase fue... (califica del 1 al 10):</strong></td>
            <td>
              <span class="badge-pill badge-blue" style="font-size: 7.8pt; padding: 2px 8px;">10 / 10 — Muy Satisfecho</span>
              <p style="margin: 2px 0 0 0; font-size: 6.8pt; color: #475569;">
                La articulación de Angular 19 con Spring Boot mediante DTOs específicos y directivas de control de formularios reactivos representa un estándar industrial de alta calidad.
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="callout" style="margin-top: 8px;">
        <strong>Declaración de Autenticidad del Informe Académico:</strong> Certifico que la totalidad del código fuente, modelos, servicios, controladores, validaciones multinivel y capturas de pantalla integradas en este informe fueron desarrollados y verificados de manera autónoma en mi entorno de desarrollo Windows 11 (usuario local <code>JOSCAR</code>), conectado en tiempo real al monolito modular backend de la Residencia OASIS.
      </div>

      <div style="margin-top: 15px; display: flex; justify-content: space-around; text-align: center;">
        <div>
          <div style="width: 180px; border-bottom: 1px solid #475569; margin-bottom: 4px;"></div>
          <strong style="font-size: 7.2pt; color: #0f172a;">José Carlos Mena Sarmiento</strong><br>
          <span style="font-size: 6.6pt; color: #64748b;">Estudiante — Programador 1 (Equipo 04)</span>
        </div>
        <div>
          <div style="width: 180px; border-bottom: 1px solid #475569; margin-bottom: 4px;"></div>
          <strong style="font-size: 7.2pt; color: #0f172a;">Ing. Angel Sullon Macalupu</strong><br>
          <span style="font-size: 6.6pt; color: #64748b;">Docente del Curso LP2 — UPeU</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>Sesión S08: CRUD de Tablas Dependientes • Monolito Modular OASIS</span>
      <span>Estudiante: José Carlos Mena Sarmiento • Equipo 04</span>
      <span>Página 6 de 6</span>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, htmlContent, 'utf8');
console.log('HTML generado exitosamente en:', OUTPUT_HTML);

(async () => {
  try {
    console.log('Generando PDF con Puppeteer...');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: OUTPUT_PDF,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '8mm',
        right: '10mm',
        bottom: '8mm',
        left: '10mm'
      }
    });
    await browser.close();
    console.log('PDF generado exitosamente en:', OUTPUT_PDF);
  } catch (err) {
    console.error('Error al generar PDF:', err);
    process.exit(1);
  }
})();
