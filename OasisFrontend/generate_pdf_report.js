const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = path.resolve(__dirname, '..', 'evidence');
const OUTPUT_PDF_1 = path.resolve(__dirname, '..', 'S07_LP2_Equipo04_MenaSarmientoJoseCarlos.pdf');
const OUTPUT_HTML = path.resolve(__dirname, '..', 'S07_Informe_Arquitectura_SPA_OASIS.html');

function getBase64(filename) {
  const p = path.join(EVIDENCE_DIR, filename);
  if (fs.existsSync(p)) {
    const data = fs.readFileSync(p);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

const imgList = getBase64('framed_01_list.png');
const imgFormNuevo = getBase64('framed_02_form_nuevo.png');
const imgFormLleno = getBase64('framed_03_form_lleno.png');
const imgCreado = getBase64('framed_04_creado_en_lista.png');
const imgEditar = getBase64('framed_05_form_editar.png');
const imgErrorFk = getBase64('framed_06_error_fk.png');
const imgAvisos = getBase64('framed_07_avisos_nav.png');
const imgEliminado = getBase64('framed_08_eliminado.png');

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>S07 - Creación y Arquitectura de la SPA - Oasis</title>
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
      font-size: 12.5pt;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 2px 0;
    }
    .doc-subtitle {
      font-size: 7.6pt;
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
      font-size: 9.6pt;
      color: #0f172a;
      border-left: 3.5px solid #0d9488;
      padding-left: 6px;
      margin-top: 6px;
      margin-bottom: 4px;
      font-weight: 800;
    }
    h3 {
      font-size: 8.4pt;
      color: #0f766e;
      margin-top: 5px;
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
      max-height: 188px;
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
      padding: 6px 8px;
      border-radius: 4px;
      font-size: 6.8pt;
      line-height: 1.28;
      margin: 4px 0;
    }

    .footer {
      margin-top: 4px;
      padding-top: 3px;
      border-top: 1px solid #e2e8f0;
      font-size: 6.5pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- HOJA 1: DATOS, ARQUITECTURA Y PROYECTO     -->
  <!-- ========================================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">Universidad Peruana Unión</div>
          <div class="inst-sub">Facultad de Ingeniería y Arquitectura &bull; Escuela Profesional de Ingeniería de Sistemas</div>
        </div>
        <div class="badge-unit">
          LP2 &bull; U2: SPA MODULAR SEGURA<br>
          <span style="font-size: 6.6pt; font-weight: normal; color: #ccfbf1;">Sesión S07 &bull; Actividad Autónoma</span>
        </div>
      </div>

      <div class="doc-title-box">
        <div class="doc-category">Informe Oficial de Laboratorio y Evidencia de Aprendizaje</div>
        <h1 class="doc-main-title">S07: Creación y Arquitectura de la SPA</h1>
        <p class="doc-subtitle">Frontend Modular Angular 22 &bull; Consumo REST de Tabla Independiente (TipoHabitacion - Oasis)</p>
      </div>

      <div class="student-card">
        <div class="student-item"><strong>Estudiante:</strong> José Carlos Mena Sarmiento</div>
        <div class="student-item"><strong>Usuario Sistema / Git:</strong> JOSCAR / sullondev</div>
        <div class="student-item"><strong>Equipo:</strong> Equipo 04 &bull; Residencia Habitacional OASIS</div>
        <div class="student-item"><strong>Sesión:</strong> S07 - Creación y Arquitectura SPA</div>
        <div class="student-item"><strong>Rol / Aporte:</strong> Programador 1 &bull; Módulo Alojamiento (CRUD TipoHabitacion, SPA Base, Layout, Routing, ApiService)</div>
        <div class="student-item"><strong>Repositorio GitHub:</strong> <code>https://github.com/262ciclo4/bomerp</code></div>
      </div>

      <h2>1. Proyecto y Arquitectura</h2>
      <p>
        En cumplimiento de los lineamientos oficiales de la Sesión S07, se generó un nuevo proyecto frontend SPA utilizando <strong>Angular 22.1.8</strong> en modalidad <strong>Zoneless</strong> (sin Zone.js, detección reactiva basada en Signals) y arquitectura moderna de <strong>componentes standalone</strong> (sin <code>NgModule</code>). La estructura de directorios se organizó estrictamente por funcionalidad empresarial en tres capas delimitadas:
      </p>
      <ul style="margin: 2px 0 4px 14px; padding: 0; font-size: 7.6pt;">
        <li><strong><code>core/</code></strong>: Componentes estructurales y servicios de infraestructura transversales. Incluye <code>Layout</code> (encabezado, sidebar y <code>router-outlet</code>) y <code>ApiService</code> (servicio inyectable para resolución centralizada de URLs base del backend).</li>
        <li><strong><code>shared/</code></strong>: Reservada para componentes, directivas, pipes y utilitarios comunes reutilizables por múltiples funcionalidades.</li>
        <li><strong><code>features/</code></strong>: Agrupa verticalmente los módulos de negocio de la Residencia OASIS: <code>features/alojamiento/tipo-habitacion/</code> (con su modelo, servicio HTTP, componente de listado y formulario) y <code>features/comunicacion/aviso/</code> para la segunda ruta.</li>
      </ul>

      <div class="callout">
        <strong>Configuración Zoneless y Providers Globales (<code>app.config.ts</code>):</strong><br>
        La aplicación se configuró con <code>provideZonelessChangeDetection()</code>, <code>provideRouter(routes)</code> y <code>provideHttpClient()</code>. Toda reactividad de la vista descansa en <code>signal()</code> explícitos en lugar de interceptores asíncronos pesados.
      </div>

      <pre><code>// OasisFrontend/src/app/app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient()
  ],
};</code></pre>
    </div>

    <div class="footer">
      <div>Informe S07 &bull; José Carlos Mena Sarmiento (JOSCAR) &bull; Equipo 04 - OASIS</div>
      <div>Página 1 de 6</div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- HOJA 2: LAYOUT Y NAVEGACIÓN                -->
  <!-- ========================================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">Universidad Peruana Unión</div>
          <div class="inst-sub">Facultad de Ingeniería y Arquitectura &bull; LP2 Ciclo 4</div>
        </div>
        <div class="badge-unit">S07 &bull; EVIDENCIA TÉCNICA</div>
      </div>

      <h2>2. Layout y Navegación Principal</h2>
      <p>
        El diseño separa la navegación global de las pantallas de negocio. El componente raíz <code>app.html</code> se redujo a <code>&lt;router-outlet /&gt;</code>, delegando todo el layout visual a <code>core/layout/Layout</code>. Este último encapsula:
      </p>
      <ul style="margin: 2px 0 4px 14px; padding: 0; font-size: 7.5pt;">
        <li><strong>Encabezado Institucional:</strong> Identificador corporativo de <em>Residencia OASIS</em>, credenciales de rol y avatar del desarrollador (<em>José Carlos Mena Sarmiento</em>).</li>
        <li><strong>Sidebar Modular Dinámico:</strong> Agrupación por módulos (<code>MÓDULO ALOJAMIENTO</code> y <code>MÓDULO COMUNICACIÓN</code>), enlaces con <code>routerLinkActive="active"</code> para retroalimentación visual, y monitor de conectividad hacia el backend (<code>:8080/api/v1</code>).</li>
        <li><strong>Área de Contenido (<code>router-outlet</code> interno):</strong> Contenedor donde se montan dinámicamente las rutas hijas mediante carga perezosa (<code>loadComponent</code>), garantizando transiciones fluidas sin recargas de página.</li>
      </ul>

      <div class="evidence-block">
        <div class="evidence-title">
          <span>Captura 1: Layout en Ejecución con Módulo Alojamiento Activo</span>
          <span class="evidence-tag">Ruta 1: /alojamiento/tipos-habitacion</span>
        </div>
        <img src="${imgList}" class="evidence-img" alt="Layout y Lista de Tipos de Habitación" />
        <div class="evidence-caption">
          <strong>Descripción:</strong> SPA en ejecución en <code>http://localhost:4200</code>. Se aprecia el layout completo (header superior, sidebar lateral con branding institucional y barra de Windows con reloj 27/09/2026 11:15 p. m. y usuario JOSCAR). En el sidebar se resalta en verde esmeralda la ruta activa <em>Tipos de Habitación</em>.
        </div>
      </div>

      <div class="evidence-block">
        <div class="evidence-title">
          <span>Captura 2: Navegación Exitosa hacia la Segunda Ruta sin Recarga</span>
          <span class="evidence-tag">Ruta 2: /comunicacion/avisos</span>
        </div>
        <img src="${imgAvisos}" class="evidence-img" alt="Navegación Segunda Ruta Avisos" />
        <div class="evidence-caption">
          <strong>Descripción:</strong> Navegación fluida dentro del mismo layout hacia la segunda ruta obligatoria (<em>Tablón de Avisos Comunitarios</em>). La barra lateral actualiza el estado activo sin reconstruir el encabezado ni el sidebar, consumiendo el endpoint <code>/api/v1/avisos</code>.
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Informe S07 &bull; José Carlos Mena Sarmiento (JOSCAR) &bull; Equipo 04 - OASIS</div>
      <div>Página 2 de 6</div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- HOJA 3: SERVICIOS HTTP Y DESACOPLAMIENTO   -->
  <!-- ========================================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">Universidad Peruana Unión</div>
          <div class="inst-sub">Facultad de Ingeniería y Arquitectura &bull; LP2 Ciclo 4</div>
        </div>
        <div class="badge-unit">S07 &bull; EVIDENCIA TÉCNICA</div>
      </div>

      <h2>3. Servicio HTTP Dedicado y Conectividad Backend</h2>
      <p>
        Se implementó un desacoplamiento estricto en dos niveles entre la infraestructura y el dominio de negocio, prohibiendo categóricamente que cualquier componente invoque <code>HttpClient</code> de forma directa:
      </p>

      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Capa / Servicio</th>
            <th style="width: 35%;">Ubicación y Responsabilidad</th>
            <th style="width: 40%;">Principio Arquitectónico</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Infraestructura (<code>ApiService</code>)</strong></td>
            <td><code>src/app/core/services/api-service.ts</code><br>Lee <code>environment.apiBaseUrl</code> (<code>http://localhost:8080</code>) y normaliza los endpoints.</td>
            <td>Desacopla el host/puerto de la lógica de negocio. Si el backend migra a producción, solo se edita <code>environment.ts</code>.</td>
          </tr>
          <tr>
            <td><strong>Dominio (<code>TipoHabitacionService</code>)</strong></td>
            <td><code>src/app/features/alojamiento/tipo-habitacion/tipo-habitacion-service.ts</code><br>Expone métodos CRUD (<code>listar</code>, <code>obtener</code>, <code>crear</code>, <code>actualizar</code>, <code>eliminar</code>).</td>
            <td>Encapsula la semántica REST de <code>/api/v1/tipos-habitacion</code>. Los componentes solo reciben <code>Observable&lt;TipoHabitacion&gt;</code>.</td>
          </tr>
        </tbody>
      </table>

      <h3>Habilitación de CORS en el Backend Spring Boot (<code>CorsConfig.java</code>)</h3>
      <p>
        Para permitir la comunicación entre el origen SPA (<code>http://localhost:4200</code>) y la API REST en Spring Boot 4.0.7 (<code>http://localhost:8080</code>), se registró un componente <code>WebMvcConfigurer</code>:
      </p>
      <pre><code>// OasisModular/src/main/java/pe/edu/upeu/oasis/config/CorsConfig.java
package pe.edu.upeu.oasis.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*").allowCredentials(true).maxAge(3600);
    }
}</code></pre>

      <div class="evidence-block">
        <div class="evidence-title">
          <span>Captura 3: Formulario Reactivo Vacío para Nuevo Registro</span>
          <span class="evidence-tag">Ruta: /alojamiento/tipos-habitacion/nuevo</span>
        </div>
        <img src="${imgFormNuevo}" class="evidence-img" alt="Formulario Nuevo Tipo Vacío" />
        <div class="evidence-caption">
          <strong>Descripción:</strong> Formulario de creación con validaciones integradas en Reactive Forms (<code>Validators.required</code>, <code>min(1)</code>, <code>maxLength(100)</code>).
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Informe S07 &bull; José Carlos Mena Sarmiento (JOSCAR) &bull; Equipo 04 - OASIS</div>
      <div>Página 3 de 6</div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- HOJA 4: CRUD COMPLETO (CREACIÓN)           -->
  <!-- ========================================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">Universidad Peruana Unión</div>
          <div class="inst-sub">Facultad de Ingeniería y Arquitectura &bull; LP2 Ciclo 4</div>
        </div>
        <div class="badge-unit">S07 &bull; EVIDENCIA TÉCNICA</div>
      </div>

      <h2>4. CRUD de Tabla Independiente</h2>
      <p>
        La entidad <strong><code>TipoHabitacion</code></strong> constituye el catálogo base e independiente del módulo <code>alojamiento</code> asignado a <strong>José Carlos Mena Sarmiento</strong>. No posee dependencias de llaves foráneas para crearse (a diferencia de <code>Habitacion</code> en S08, que dependerá de elegir un tipo). A continuación se documenta el ciclo de vida completo de las operaciones CRUD ejecutadas en tiempo real:
      </p>

      <div class="evidence-block">
        <div class="evidence-title">
          <span>Operación 1: Llenado de Formulario con Validaciones Reactivas</span>
          <span class="evidence-tag">Formulario Completo</span>
        </div>
        <img src="${imgFormLleno}" class="evidence-img" alt="Formulario Lleno" />
        <div class="evidence-caption">
          <strong>Descripción:</strong> Ingreso de datos para "Suite Presidencial Oasis" con tarifa de S/. 850.00 y capacidad de 2 personas. El botón "Guardar Tipo" se habilita dinámicamente al satisfacer las validaciones síncronas.
        </div>
      </div>

      <div class="evidence-block">
        <div class="evidence-title">
          <span>Operación 2: Creación Exitosa (POST) y Reflejo Inmediato en la Lista</span>
          <span class="evidence-tag">Item #5 Creado</span>
        </div>
        <img src="${imgCreado}" class="evidence-img" alt="Item Creado en la Lista" />
        <div class="evidence-caption">
          <strong>Descripción:</strong> Tras emitir la petición <code>POST</code> hacia el backend, la SPA redirige a la lista, donde se refleja el nuevo registro como item <strong>#5</strong> (Suite Presidencial Oasis &bull; S/ 850) incrementando el contador a 5 registros sin recargar el navegador.
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Informe S07 &bull; José Carlos Mena Sarmiento (JOSCAR) &bull; Equipo 04 - OASIS</div>
      <div>Página 4 de 6</div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- HOJA 5: EDICIÓN Y ELIMINACIÓN CONTROLADA   -->
  <!-- ========================================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">Universidad Peruana Unión</div>
          <div class="inst-sub">Facultad de Ingeniería y Arquitectura &bull; LP2 Ciclo 4</div>
        </div>
        <div class="badge-unit">S07 &bull; EVIDENCIA TÉCNICA</div>
      </div>

      <h2>4. CRUD Independiente (Continuación: Edición y Eliminación)</h2>

      <div class="evidence-block">
        <div class="evidence-title">
          <span>Operación 3: Edición con Carga de Datos Previos (GET por ID + PUT)</span>
          <span class="evidence-tag">Ruta: /alojamiento/tipos-habitacion/1/editar</span>
        </div>
        <img src="${imgEditar}" class="evidence-img" alt="Formulario Editar Datos Cargados" />
        <div class="evidence-caption">
          <strong>Descripción:</strong> Al hacer clic en <em>Editar</em> en el registro #1, el formulario unificado detecta el parámetro <code>:id</code> en la ruta activa, consulta el backend mediante <code>obtener(1)</code> y parchea los campos reactivos automáticamente.
        </div>
      </div>

      <div class="evidence-block">
        <div class="evidence-title">
          <span>Operación 4: Eliminación con Manejo de Restricción Referencial (DELETE)</span>
          <span class="evidence-tag">Control de Error FK y Eliminación Limpia</span>
        </div>
        <img src="${imgErrorFk}" class="evidence-img" style="margin-bottom: 4px;" alt="Error Llave Foranea al Eliminar" />
        <img src="${imgEliminado}" class="evidence-img" alt="Eliminación Exitosa Item Huérfano" />
        <div class="evidence-caption">
          <strong>Descripción:</strong> (Arriba) Al intentar eliminar el Tipo #1 (asociado a 4 habitaciones físicas), el backend emite una violación de integridad referencial (HTTP 500/409). El componente captura el error con <code>HttpErrorResponse</code> y muestra una alerta amigable sin romper la SPA. (Abajo) Al eliminar el Tipo #5 (creado sin habitaciones hijas), la petición <code>DELETE</code> concluye con éxito (HTTP 204) y el registro desaparece inmediatamente.
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Informe S07 &bull; José Carlos Mena Sarmiento (JOSCAR) &bull; Equipo 04 - OASIS</div>
      <div>Página 5 de 6</div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- HOJA 6: HALLAZGOS, REFLEXIÓN Y FEEDBACK    -->
  <!-- ========================================== -->
  <div class="sheet">
    <div>
      <div class="header-banner">
        <div>
          <div class="inst-title">Universidad Peruana Unión</div>
          <div class="inst-sub">Facultad de Ingeniería y Arquitectura &bull; LP2 Ciclo 4</div>
        </div>
        <div class="badge-unit">S07 &bull; ANÁLISIS & FEEDBACK</div>
      </div>

      <h2>5. Diagnóstico de Error y Hallazgo Real</h2>
      <div class="callout callout-warning">
        <strong>Diagnóstico del Hallazgo:</strong> Durante la integración de los servicios TypeScript mediante scripts de automatización de consola, se produjo un fallo de compilación <code>TS1161 / TS2592 (Cannot find name '$')</code> en <code>api-service.ts</code> y <code>tipo-habitacion-service.ts</code>.<br>
        <strong>Causa Raíz:</strong> Los comandos ejecutados en PowerShell con delimitadores de cadena de doble comilla (<code>@" ... "@</code>) interpretaron erróneamente las plantillas literales de TypeScript (<code>\${this.baseUrl}</code> y <code>\${this.resource}</code>) como variables nativas del shell, vaciando el texto.<br>
        <strong>Solución Implementada:</strong> Se corrigieron los scripts adoptando la sintaxis literal de comilla simple (<code>@' ... '@</code>) y se validó la integridad sintáctica con <code>ng build</code>, obteniendo compilación limpia en 1.6 segundos. Adicionalmente, se configuró el filtro CORS en el backend de Spring Boot para desbloquear las peticiones cruzadas originadas desde <code>localhost:4200</code>.
      </div>

      <h2>6. Reflexión Técnica Breve</h2>
      <p style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 8px; border-radius: 4px; font-style: italic; font-size: 7.4pt; margin: 4px 0;">
        <strong>¿Por qué separar TipoHabitacionService del componente que lo usa facilita un cambio futuro en la URL o en la forma de consumir el backend?</strong><br>
        Separar <code>TipoHabitacionService</code> de los componentes de presentación (<code>TipoHabitacionList</code> y <code>TipoHabitacionForm</code>) cumple el principio de responsabilidad única (SRP) y garantiza un desacoplamiento arquitectónico fundamental. Si en el futuro la API de la Residencia OASIS evoluciona de versión (por ejemplo, a <code>/api/v2/habitaciones/tipos</code>), migra su protocolo a GraphQL/WebSockets, o traslada su dominio a un servidor en la nube, dicha modificación se realiza en un único archivo de servicio centralizado sin alterar una sola línea de código en las plantillas ni en la lógica de los formularios. Asimismo, esta abstracción permite aislar las pruebas unitarias mediante inyección de dependencias simuladas (Mocks), evitando llamadas HTTP reales durante la ejecución de tests automatizados.
      </p>

      <h2>7. Anexo: Feedback de la Sesión</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 50%;">Pregunta de Evaluación</th>
            <th style="width: 50%;">Respuesta del Estudiante (José Carlos Mena)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. ¿Cuál es el aprendizaje más importante que te llevas de la clase de hoy?</strong></td>
            <td>La estructuración modular de la SPA en Angular 22 zoneless con Signals, comprendiendo cómo desacoplar el Layout principal de las pantallas hijas mediante <code>router-outlet</code> sin recargar la página.</td>
          </tr>
          <tr>
            <td><strong>2. ¿Qué punto de la clase te resultó más confuso o te dejó con dudas?</strong></td>
            <td>La sincronización de Signals con las peticiones asíncronas de <code>HttpClient</code> en lugar del clásico <code>subscribe()</code> con Zone.js, y cómo tipar apropiadamente el <code>HttpErrorResponse</code>.</td>
          </tr>
          <tr>
            <td><strong>3. ¿Tienes alguna pregunta que te gustaría que sea respondida la siguiente clase?</strong></td>
            <td>¿Cómo manejar la carga de listas desplegables dependientes en S08 cuando el formulario de <code>Habitacion</code> requiera seleccionar obligatoriamente un <code>TipoHabitacion</code> activo?</td>
          </tr>
          <tr>
            <td><strong>4. Nivel de comprensión de la clase de hoy</strong></td>
            <td><strong>☑ ¡Entendido! - Lo domino y podría explicarlo.</strong></td>
          </tr>
          <tr>
            <td><strong>5. ¿Cómo puedo ayudarte a comprender mejor el tema?</strong></td>
            <td>Profundizando en interceptores HTTP y gestión centralizada de notificaciones tipo Toast ante errores 409 y 500.</td>
          </tr>
          <tr>
            <td><strong>6. Autoevaluación de participación y esfuerzo</strong></td>
            <td><strong>☑ Muy Comprometido/a: Me esforcé al máximo.</strong></td>
          </tr>
          <tr>
            <td><strong>7. Satisfacción con la sesión (1 al 10)</strong></td>
            <td><strong>10 / 10</strong> &bull; Excelente guía metodológica y correlación directa con la arquitectura modular de Spring Boot.</td>
          </tr>
        </tbody>
      </table>

      <h2>8. Respuestas a las Preguntas de Defensa (Sección 4.5)</h2>
      <ul style="font-size: 7.2pt; line-height: 1.25; padding-left: 12px; margin: 3px 0;">
        <li><strong>1. Layout separado de pantallas:</strong> Evita duplicar el shell (header/sidebar) en cada vista y permite que el Angular Router renderice solo el componente activo en el <code>router-outlet</code> sin recrear el DOM.</li>
        <li><strong>2. Por tipo vs por funcionalidad:</strong> Organizar por funcionalidad (<code>core/shared/features</code>) agrupa modelos, servicios y componentes de un mismo negocio juntos, permitiendo carga perezosa (Lazy Loading) y alta cohesión.</li>
        <li><strong>3. Por qué no exponer HttpClient a componentes:</strong> Para que los componentes no dependan de detalles de red ni protocolos HTTP, delegando esa responsabilidad al servicio inyectable.</li>
        <li><strong>4. Entidad independiente vs dependiente:</strong> <code>TipoHabitacion</code> no requiere claves foráneas para existir. <code>Habitacion</code> (S08) es dependiente porque su formulario exige elegir previamente un tipo de habitación.</li>
        <li><strong>5. Por qué ApiService no sabe de TipoHabitacion:</strong> Porque <code>ApiService</code> es de infraestructura transversal; solo resuelve la URL base del entorno para que todos los módulos de OASIS lo reutilicen.</li>
        <li><strong>6. Validaciones respetadas en el formulario:</strong> <code>@NotBlank</code> en nombre (máx 100 caracteres), <code>@Positive</code> en precio base (> 0) y <code>@Min(1)</code> en capacidad de huéspedes.</li>
      </ul>
    </div>

    <div class="footer">
      <div>Informe S07 &bull; José Carlos Mena Sarmiento (JOSCAR) &bull; Equipo 04 - OASIS</div>
      <div>Página 6 de 6</div>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, htmlContent, 'utf8');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '6mm',
        bottom: '6mm',
        left: '8mm',
        right: '8mm'
      }
    };

    await page.pdf({ ...pdfOptions, path: OUTPUT_PDF_1 });
    console.log('PDF_OK: ' + OUTPUT_PDF_1);

    await browser.close();
    console.log('REGENERATION_DONE');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();