# ==============================================================================
# SCRIPT DE CONTROL Y ARRANQUE PORTABLE - RESIDENCIA OASIS HEREDITAS
# Compatible con cualquier computadora (Windows PowerShell)
# ==============================================================================

$ErrorActionPreference = "Continue"
$BASE_DIR = $PSScriptRoot
$BACKEND_DIR = Join-Path $BASE_DIR "OasisModular"
$FRONTEND_DIR = Join-Path $BASE_DIR "OasisFrontend"
$TOKEN_RENIEC = "sk_21338.mJbXANpbZ6idba5P32kodCOmMJTia5pS"

Write-Host "==========================================================" -ForegroundColor DarkCyan
Write-Host "       SISTEMA RESIDENCIAL OASIS HEREDITAS 2026           " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor DarkCyan
Write-Host "Directorio base: $BASE_DIR`n" -ForegroundColor Gray

# 1. Comprobacion de Requisitos Basicos
Write-Host "[1/3] Verificando entorno de ejecucion..." -ForegroundColor Cyan

# Validar Java
try {
    $javaVer = java -version 2>&1 | Select-String "version"
    Write-Host "  OK Java detectado: $javaVer" -ForegroundColor Green
} catch {
    Write-Host "  [!] ADVERTENCIA: Java 21 no detectado en el PATH. Para ejecutar el backend local requiere Java 21 LTS." -ForegroundColor Yellow
}

# Validar Node.js
try {
    $nodeVer = node -v
    Write-Host "  OK Node.js detectado: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "  [!] ERROR: Node.js no encontrado. Debe instalar Node.js 20+ para correr el frontend." -ForegroundColor Red
}

# Validar dependencias de Frontend (si recien fue clonado)
$frontendNodeModules = Join-Path $FRONTEND_DIR "node_modules"
if (-not (Test-Path $frontendNodeModules)) {
    Write-Host "`n[!] Primera ejecucion detectada: no existe 'node_modules'." -ForegroundColor Yellow
    Write-Host "    Instalando dependencias de Angular automaticamente (esto toma un minuto)..." -ForegroundColor Yellow
    Push-Location $FRONTEND_DIR
    npm install --legacy-peer-deps
    Pop-Location
    Write-Host "    OK Dependencias de frontend instaladas exitosamente." -ForegroundColor Green
}

# 2. Menu de Arranque
Write-Host "`nSeleccione el modo de arranque deseado:" -ForegroundColor White
Write-Host "  [1] Modo Local Ligero Standalone (Backend H2/Oracle + Frontend :4200 - SIN NECESIDAD DE DOCKER) [Recomendado]" -ForegroundColor Green
Write-Host "  [2] Modo Completo con Docker Compose (Oracle 23c + Keycloak 26 + Backend + Frontend)" -ForegroundColor Cyan
Write-Host "  [3] Solo Frontend Angular (:4200)" -ForegroundColor White
Write-Host "  [4] Solo Backend Spring Boot (:8080)" -ForegroundColor White
Write-Host "  [5] Detener todos los servicios activos" -ForegroundColor Red
Write-Host "  [6] Salir" -ForegroundColor Gray

$opcion = Read-Host "`nIngrese una opcion (1-6)"

switch ($opcion) {
    "1" {
        Write-Host "`n[1/2] Iniciando Backend Spring Boot en nueva ventana..." -ForegroundColor Cyan
        $mvnCmd = if ($IsWindows -or $env:OS -like "*Windows*") { ".\mvnw.cmd" } else { "./mvnw" }
        $backendScript = "`$env:RENIEC_API_TOKEN='$TOKEN_RENIEC'; Set-Location '$BACKEND_DIR'; $mvnCmd spring-boot:run '-Dspring-boot.run.profiles=local' -DskipTests"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

        Write-Host "[2/2] Iniciando Frontend Angular en nueva ventana..." -ForegroundColor Cyan
        $frontendScript = "Set-Location '$FRONTEND_DIR'; npx ng serve --port 4200"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

        Write-Host "`n==========================================================" -ForegroundColor Green
        Write-Host "   SISTEMA EN EJECUCION EXITOSA (MODO LOCAL STANDALONE)   " -ForegroundColor Green
        Write-Host "==========================================================" -ForegroundColor Green
        Write-Host "  * Aplicacion Web (Frontend): http://localhost:4200" -ForegroundColor White
        Write-Host "  * API Swagger UI (Backend):   http://localhost:8080/swagger-ui/index.html" -ForegroundColor White
        Write-Host "  * Base de Datos H2 Consola:   http://localhost:8080/h2-console" -ForegroundColor White
        Write-Host "`n  USUARIOS DE ACCESO BASE (CONTRASENA: 123456):" -ForegroundColor Yellow
        Write-Host "    - Admin:       admin        / 123456" -ForegroundColor Yellow
        Write-Host "    - Supervisor:  supervisor   / 123456" -ForegroundColor Yellow
        Write-Host "    - Recepcion:   recepcion    / 123456" -ForegroundColor Yellow
        Write-Host "    - Residente:   74808134     / 123456 (o su DNI)" -ForegroundColor Yellow
        Write-Host "==========================================================`n" -ForegroundColor Green
    }

    "2" {
        Write-Host "`n[Docker] Levantando todos los contenedores con Docker Compose..." -ForegroundColor Cyan
        Push-Location $BASE_DIR
        docker compose up -d --build
        Pop-Location

        Write-Host "`nServicios Docker iniciados en segundo plano!" -ForegroundColor Green
        Write-Host "  * Frontend:       http://localhost:4200" -ForegroundColor White
        Write-Host "  * Backend API:    http://localhost:8080/swagger-ui/index.html" -ForegroundColor White
        Write-Host "  * Keycloak Admin: http://localhost:38080 (admin / admin123)" -ForegroundColor White
        Write-Host "  * Oracle DB:      localhost:1521 (BOMERP_APP / 123456)" -ForegroundColor White
    }

    "3" {
        Write-Host "`nLevantando solo Frontend Angular..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$FRONTEND_DIR'; npx ng serve --port 4200"
    }

    "4" {
        Write-Host "`nLevantando solo Backend Spring Boot..." -ForegroundColor Cyan
        $mvnCmd = if ($IsWindows -or $env:OS -like "*Windows*") { ".\mvnw.cmd" } else { "./mvnw" }
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:RENIEC_API_TOKEN='$TOKEN_RENIEC'; Set-Location '$BACKEND_DIR'; $mvnCmd spring-boot:run '-Dspring-boot.run.profiles=local' -DskipTests"
    }

    "5" {
        & (Join-Path $BASE_DIR "detener_servicios.ps1")
    }

    Default {
        Write-Host "Operacion finalizada." -ForegroundColor Gray
    }
}
