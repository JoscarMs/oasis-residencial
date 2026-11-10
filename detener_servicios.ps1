# ==============================================================================
# SCRIPT DE APAGADO Y LIMPIEZA - RESIDENCIA OASIS HEREDITAS
# ==============================================================================

$BASE_DIR = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Red
Write-Host "     DETENIENDO SERVICIOS DE RESIDENCIA OASIS HEREDITAS   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Red

# 1. Detener Contenedores Docker (si existen)
Write-Host "`n[1/3] Verificando y deteniendo contenedores Docker..." -ForegroundColor Cyan
try {
    Push-Location $BASE_DIR
    docker compose down 2>$null
    Pop-Location
} catch {}

$dockerContainers = @("oasis-keycloak", "oasis-oracle", "oasis-backend", "oasis-frontend", "bomerp-oracle")
foreach ($c in $dockerContainers) {
    docker stop $c 2>$null
}
Write-Host "  OK Contenedores Docker detenidos." -ForegroundColor Green

# 2. Liberar Puertos Locales (8080 Backend y 4200 Frontend)
Write-Host "`n[2/3] Liberando puertos locales de red (8080, 4200)..." -ForegroundColor Cyan
$puertos = @(8080, 4200)

foreach ($p in $puertos) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
        if ($conns) {
            foreach ($conn in $conns) {
                $procId = $conn.OwningProcess
                if ($procId -gt 0) {
                    Write-Host "  Deteniendo proceso PID $procId en puerto $p..." -ForegroundColor Yellow
                    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                }
            }
        } else {
            Write-Host "  Puerto $p ya se encuentra libre." -ForegroundColor Gray
        }
    } catch {
        # Fallback netstat
        $lines = netstat -ano | Select-String ":$p\s"
        foreach ($line in $lines) {
            $parts = $line.ToString().Trim() -split '\s+'
            $pid = $parts[-1]
            if ($pid -match '^\d+$') {
                Stop-Process -Id [int]$pid -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# 3. Detener instancias huerfanas de node/ng o java en caso de ejecucion residual
Write-Host "`n[3/3] Comprobando procesos residuales..." -ForegroundColor Cyan
Get-Process -Name "node", "ng" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*oasis*" -or $_.CommandLine -like "*oasis*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "       TODOS LOS SERVICIOS HAN SIDO APAGADOS CON EXITO    " -ForegroundColor Green
Write-Host "==========================================================`n" -ForegroundColor Green
