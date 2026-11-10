# OASIS Backend Modular (oasismodular)

Backend monolítico modular empresarial para el **Sistema de Gestión de Residencias Universitarias OASIS**.
Construido sobre **Spring Boot 4.0.7**, **Java 21 LTS**, **Spring Modulith 2.0.7**, **Oracle Database 23ai Free** y **MapStruct 1.6.3**, siguiendo estrictamente la metodología y arquitectura de **BomERP (LP2)**.

---

## 🏛️ Arquitectura y Responsabilidades de Módulos

El sistema está organizado como un monolito modular con límites arquitectónicos estrictos verificados automáticamente mediante `ModularityTests` de Spring Modulith:

| Módulo | Responsable | Entidades Principales | Funcionalidad |
|---|---|---|---|
| `alojamiento` | **José Carlos Mena Sarmiento** | `TipoHabitacion`, `Habitacion` | Inventario de 24 habitaciones (pisos 1 al 4: 101-106, 201-206, 301-306, 401-406), tarifas y estados (DISPONIBLE, OCUPADA, MANTENIMIENTO, RESERVADA). |
| `residentes` | **José Carlos Mena Sarmiento** | `Huesped`, `ContactoApoderado` | Registro de huéspedes universitarios, menores de edad con apoderados legales, egresados y extranjeros con pasaporte. |
| `pagos` | **José Carlos Mena Sarmiento** | `Pago` | Gestión transaccional de pagos (alquiler, garantía, servicios, penalidades) y métodos (YAPE, PLIN, Transferencia, Efectivo). |
| `contratos` | **Ronald Alex Solorzano Saya** | `Contrato`, `DetalleContrato` | Contratos semestrales/anuales, asignación de habitaciones, firma y política de descuentos por familiaridad. |
| `comunicacion` | **Ronald Alex Solorzano Saya** | `Aviso` | Tablón de anuncios comunitarios, eventos institucionales y notificaciones por perfil. |
| `seguridad` | **Ronald Alex Solorzano Saya** | `CuentaUsuario` | Cuentas de acceso con roles (ADMIN, RECEPCION, MANTENIMIENTO, SEGURIDAD, RESIDENTE) y auditoría. |

---

## 📋 Prerrequisitos

- **Java 21 LTS** (Eclipse Temurin recomendado).
- **Docker / Docker Desktop** (para el contenedor de Oracle Database y ejecución en contenedores).
- No requiere instalar Maven: el repositorio incluye Maven Wrapper (`mvnw` / `mvnw.cmd` v3.9.9).

---

## 🚀 Opciones de Despliegue y Ejecución

### Opción 1: Desarrollo Local Estándar (Estilo BomERP S1)
*Oracle corre en contenedor Docker y la aplicación Spring Boot corre directamente en tu máquina host con Hot-Reload (DevTools).*

1. **Levantar base de datos Oracle:**
   ```powershell
   docker compose -f compose-dev.yml up -d
   ```
   *Levanta el contenedor `bomerp-oracle` (`gvenzl/oracle-free:23-slim`) en el puerto `1521` con usuario `BOMERP_APP` (contraseña `123456`).*

2. **Ejecutar el backend:**
   ```powershell
   # Windows PowerShell
   .\mvnw.cmd spring-boot:run

   # Linux / macOS
   ./mvnw spring-boot:run
   ```
   *Usa el perfil `dev` por defecto y conecta a `jdbc:oracle:thin:@localhost:1521/FREEPDB1`.*

---

### Opción 2: Contenedorización Completa (Docker Compose Full Stack)
*Tanto la base de datos Oracle como el backend Spring Boot se ejecutan dentro de contenedores Docker aislados en una red compartida.*

1. **Construir y levantar todo el stack:**
   ```powershell
   docker compose up --build -d
   ```

2. **Verificar el estado de los contenedores:**
   ```powershell
   docker compose ps
   ```

3. **Ver logs de la aplicación:**
   ```powershell
   docker compose logs -f backend
   ```

4. **Detener el stack:**
   ```powershell
   docker compose down
   ```

---

## 🧪 Pruebas Automatizadas y Verificación Arquitectónica

Para ejecutar toda la suite de pruebas unitarias, de integración y de arquitectura modular:

```powershell
# Windows
.\mvnw.cmd clean test

# Linux / macOS
./mvnw clean test
```

### Pruebas que se ejecutan:
- **`ModularityTests`**: Valida con Spring Modulith que ningún módulo viole los límites arquitectónicos (un módulo solo accede a servicios públicos de otro, nunca a sus entidades ni repositorios internos).
- **`HabitacionControllerTest`**: CRUD y validaciones del módulo `alojamiento`.
- **`HuespedControllerTest`**: Registro y búsqueda de huéspedes y apoderados (`residentes`).
- **`PagoControllerTest`**: Verificación de cobros y transacciones (`pagos`).
- **`ContratoControllerTest`**: Ciclo de vida de contratos y asignación de habitaciones (`contratos`).
- **`AvisoControllerTest`**: Emisión y consulta de anuncios comunitarios (`comunicacion`).
- **`CuentaUsuarioControllerTest`**: Autenticación y gestión de roles (`seguridad`).
- **`HelloControllerTest`**: Endpoint de verificación y salud de la API.

---

## 📖 Documentación Interactiva (Swagger / OpenAPI)

Una vez iniciada la aplicación (vía Opción 1 u Opción 2), accede a la documentación interactiva en:

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI v3 JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- **Endpoint de verificación**: [http://localhost:8080/api/v1/hello](http://localhost:8080/api/v1/hello)
- **Health check (Actuator)**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
