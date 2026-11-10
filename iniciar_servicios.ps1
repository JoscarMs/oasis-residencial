# ==============================================================================
# SCRIPT DE CONTROL Y ARRANQUE - RESIDENCIA OASIS HEREDITAS
# ==============================================================================

$BASE_DIR = $PSScriptRoot
$BACKEND_DIR = Join-Path $BASE_DIR "OasisModular"
$FRONTEND_DIR = Join-Path $BASE_DIR "OasisFrontend"
$TOKEN_RENIEC = "sk_21338.mJbXANpbZ6idba5P32kodCOmMJTia5pS"

Write-Host "==========================================================" -ForegroundColor DarkCyan
Write-Host "     SISTEMA RESIDENCIAL OASIS HEREDITAS (JULIACA)       " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor DarkCyan

Write-Host "`nSeleccione el modo de arranque:" -ForegroundColor White
Write-Host "  [1] Modo Completo con Docker (Keycloak :38080 + Oracle :1521)" -ForegroundColor Green
Write-Host "  [2] Modo Local Ligero Standalone (Backend H2 memoria + Frontend :4200)" -ForegroundColor Cyan
Write-Host "  [3] Solo Obtener Token de Acceso Admin" -ForegroundColor Yellow
Write-Host "  [4] Salir" -ForegroundColor Gray

$opcion = Read-Host "`nIngrese opcion (1-4)"

switch ($opcion) {
    "1" {
        Write-Host "`n[1/3] Iniciando Keycloak en Docker..." -ForegroundColor Cyan
        # Iniciar Docker Desktop si no esta abierto
        if (-not (Get-Process -Name "*docker*" -ErrorAction SilentlyContinue)) {
            $dockerExe = "C:\Users\JOSCAR\AppData\Local\Programs\DockerDesktop\Docker Desktop.exe"
            if (Test-Path $dockerExe) {
                Write-Host "Iniciando Docker Desktop..." -ForegroundColor Yellow
                Start-Process $dockerExe
                Write-Host "Esperando 15 segundos a que Docker levante..."
                Start-Sleep -Seconds 15
            }
        }
        
        # Iniciar o crear contenedor Keycloak
        docker start oasis-keycloak 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Creando contenedor oasis-keycloak en puerto 38080..." -ForegroundColor Yellow
            docker run -d --name oasis-keycloak -p 38080:8080 `
                -e KEYCLOAK_ADMIN=admin `
                -e KEYCLOAK_ADMIN_PASSWORD=admin123 `
                quay.io/keycloak/keycloak:26.0.0 start-dev
        }

        # Iniciar Backend en nueva ventana
        Write-Host "[2/3] Levantando Backend Spring Boot (puerto 8080)..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:RENIEC_API_TOKEN='$TOKEN_RENIEC'; Set-Location '$BACKEND_DIR'; .\mvnw.cmd spring-boot:run"

        # Iniciar Frontend en nueva ventana
        Write-Host "[3/3] Levantando Frontend Angular (puerto 4200)..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$FRONTEND_DIR'; npx ng serve --port 4200"

        Write-Host "`nTodo levantado! URLs disponibles:" -ForegroundColor Green
        Write-Host "  - Frontend: http://localhost:4200" -ForegroundColor White
        Write-Host "  - Backend Swagger: http://localhost:8080/swagger-ui/index.html" -ForegroundColor White
        Write-Host "  - Keycloak Admin: http://localhost:38080 (admin / admin123)" -ForegroundColor White
    }

    "2" {
        Write-Host "`n[1/2] Levantando Backend en Modo Local (Base de datos H2 en memoria)..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:RENIEC_API_TOKEN='$TOKEN_RENIEC'; Set-Location '$BACKEND_DIR'; .\mvnw.cmd spring-boot:run '-Dspring-boot.run.profiles=local' -DskipTests"

        Write-Host "[2/2] Levantando Frontend Angular (puerto 4200)..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$FRONTEND_DIR'; npx ng serve --port 4200"

        Write-Host "`nServicios en ejecucion!" -ForegroundColor Green
        Write-Host "  - Frontend: http://localhost:4200" -ForegroundColor White
        Write-Host "  - Backend Swagger: http://localhost:8080/swagger-ui/index.html" -ForegroundColor White
        Write-Host "  (En modo local, cualquier texto en el candadito de Swagger otorga rol ADMIN)" -ForegroundColor Yellow
    }

    "3" {
        $tokenScript = Join-Path $BASE_DIR "obtener_token_admin.ps1"
        if (Test-Path $tokenScript) {
            & $tokenScript
        } else {
            Write-Host "Script obtener_token_admin.ps1 no encontrado." -ForegroundColor Yellow
        }
    }

    Default {
        Write-Host "Operacion cancelada." -ForegroundColor Gray
    }
}
