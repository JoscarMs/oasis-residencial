# 🏨 OASIS Hereditas — Sistema de Gestión Residencial Estudiantil

Sistema integral para la administración inteligente de residencias estudiantiles, alojamientos, contratos de arrendamiento, control financiero con pagos, servicios extras, mantenimiento y padrón de residentes con consulta automatizada de identidad vía RENIEC y SUNAT.

---

## 🚀 Arquitectura Tecnológica

- **Frontend**: Angular 19 / 22 con Signals reactivos, componentes Standalone, interceptores JWT y control de acceso RBAC/ABAC.
- **Backend**: Spring Boot 3 / Java 21 LTS con arquitectura modular (`pe.edu.upeu.oasis`), Spring Security, JPA/Hibernate y validación Jakarta.
- **Base de Datos**: Oracle Database 23c Free (Producción / Dev) / H2 Database en memoria (Modo Local Ligero).
- **Seguridad**: Autenticación híbrida compatible con Keycloak 26 (OAuth2 / OIDC PKCE) y JWT RS256 interno.
- **Servicio de Identidad**: Integración directa con API Decolecta (RENIEC para DNI de 8 dígitos y SUNAT para RUC de 11 dígitos).

---

## 📋 Requisitos Previos

Solo necesita tener instalado en su computadora:
1. **Java 21 LTS** o superior (`java -version`).
2. **Node.js 20+** o superior (`node -v`).
3. *(Opcional)* **Docker Desktop** si desea ejecutar con Oracle Database y Keycloak en contenedores.

---

## ⚡ Cómo Iniciar el Sistema (En 1 Solo Comando)

### Opción A: En Windows (Recomendado)
Puede iniciar con cualquiera de estos dos métodos:
- **Doble clic** en el archivo:
  ```cmd
  iniciar.bat
  ```
- O desde la consola **PowerShell**:
  ```powershell
  .\iniciar_servicios.ps1
  ```
> **Nota automática:** El script verifica automáticamente si es la primera vez que clona el proyecto; si no encuentra `node_modules`, ejecutará `npm install` automáticamente antes de levantar el frontend.

### Opción B: Con Docker Compose (Todo Contenerizado)
```bash
docker compose up -d --build
```

### Opción C: En Linux / macOS
```bash
chmod +x start.sh stop.sh
./start.sh
```

---

## 🛑 Cómo Apagar el Sistema

- **En Windows**: Doble clic en `detener.bat` o ejecutar en PowerShell:
  ```powershell
  .\detener_servicios.ps1
  ```
- **En Linux / macOS**:
  ```bash
  ./stop.sh
  ```
- **Con Docker**:
  ```bash
  docker compose down
  ```

---

## 🌐 URLs y Servicios Disponibles

| Servicio | URL | Descripción |
| :--- | :--- | :--- |
| **Frontend Web** | [http://localhost:4200](http://localhost:4200) | Aplicación SPA completa Angular |
| **Backend API (Swagger)** | [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) | Documentación interactiva OpenAPI |
| **Keycloak Admin Console** | [http://localhost:38080](http://localhost:38080) | Servidor de identidad (admin / admin123) |
| **Consola Base de Datos H2** | [http://localhost:8080/h2-console](http://localhost:8080/h2-console) | `jdbc:h2:mem:oasisdev` (usuario `sa`, clave vacía) |

---

## 👥 Cuentas de Acceso de Prueba (Contraseña Unificada: `123456`)

Todas las cuentas del entorno de prueba están preconfiguradas con la contraseña base **`123456`**:

| Rol | Usuario | Contraseña | Titular / Descripción |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin` | `123456` | Administrador General (Gestión total y credenciales) |
| **📋 SUPERVISOR** | `supervisor` | `123456` | Supervisor de Operaciones y Reportes |
| **🛎️ RECEPCIONISTA** | `recepcion` | `123456` | Atención al cliente, contratos y reservas |
| **🎓 RESIDENTE** | `74808134` | `123456` | José Carlos Mena Sarmiento (Titular Hab. 101) |
| **🎓 RESIDENTE** | `71234567` | `123456` | Juan Carlos Mena Sarmiento (Hab. 101) |
| **🎓 RESIDENTE** | `72345678` | `123456` | Ronald Alex Solorzano Saya (Hab. 201) |
| **🎓 RESIDENTE** | `45678901` | `123456` | Andrea Ramos Flores (Hab. 106) |
| **🎓 RESIDENTE** | `78901234` | `123456` | Sofia Valentina Morales (Hab. 302) |
| **🎓 RESIDENTE** | `75123456` | `123456` | Mateo Sebastian Torres (Hab. 103) |
| **🎓 RESIDENTE** | `76234567` | `123456` | Camila Luciana Vega (Hab. 104) |

> 🔒 **Gestión de Credenciales:** Solo el rol `ADMIN` tiene acceso a la pantalla `/seguridad/cuentas` para ver las contraseñas base y restablecer accesos si un residente olvida su contraseña.
> 🔑 **Cambio de Contraseña:** Cualquier usuario autenticado puede cambiar su contraseña personal en cualquier momento mediante el botón **"🔑 Cambiar Clave"** en la cabecera.

---

## 📁 Estructura del Repositorio

```text
OASIS/
├── OasisModular/            # Backend Spring Boot 3 (Java 21)
│   ├── src/                 # Código fuente Java y recursos de configuración
│   ├── mvnw, mvnw.cmd       # Maven Wrapper portable (no requiere instalar Maven)
│   ├── pom.xml              # Dependencias Spring Boot, Security, JPA, Oracle/H2
│   └── Dockerfile           # Multi-stage build Eclipse Temurin 21 JRE
├── OasisFrontend/           # Frontend Angular 19
│   ├── src/                 # Componentes, signals, guards y servicios HTTP
│   ├── public/              # Logos e imágenes estáticas
│   ├── angular.json         # Configuración del CLI de Angular
│   ├── package.json         # Dependencias NPM de Angular y librerías
│   ├── Dockerfile           # Multi-stage build Node 20 + Nginx Alpine
│   └── nginx.conf           # Configuración Nginx con proxy reverso y rutas SPA
├── docker-compose.yml       # Orquestación de Oracle, Keycloak, Backend y Frontend
├── iniciar_servicios.ps1    # Script PowerShell con menú interactivo de arranque
├── iniciar.bat              # Script Windows 1-Click para iniciar todo
├── detener_servicios.ps1    # Script PowerShell para apagar servicios y liberar puertos
├── detener.bat              # Script Windows 1-Click para apagar todo
├── start.sh                 # Script bash para entornos Linux y macOS
├── stop.sh                  # Script bash para apagar en Linux y macOS
├── .gitignore               # Exclusión de node_modules, target, logs y binarios
└── README.md                # Guía y documentación del proyecto
```

---

## 💻 Pasos para Subir este Repositorio a GitHub

1. Abra una terminal en la carpeta `OASIS`:
   ```bash
   cd "C:\ING-Sistemas\Proyecto OASIS\OASIS"
   ```
2. Inicialice el repositorio Git:
   ```bash
   git init
   git branch -M main
   ```
3. Agregue todos los archivos limpios:
   ```bash
   git add .
   git commit -m "feat: initial commit sistema residencial oasis"
   ```
4. Vincule su repositorio de GitHub y suba el código:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```
