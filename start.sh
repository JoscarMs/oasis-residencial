#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE ARRANQUE PARA LINUX / MACOS - RESIDENCIA OASIS HEREDITAS
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$DIR/OasisModular"
FRONTEND_DIR="$DIR/OasisFrontend"
export RENIEC_API_TOKEN="sk_21338.mJbXANpbZ6idba5P32kodCOmMJTia5pS"

echo "=========================================================="
echo "       SISTEMA RESIDENCIAL OASIS HEREDITAS (UNIX)         "
echo "=========================================================="

# Validar node_modules
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "[!] Primera ejecución detectada: instalando dependencias de Angular..."
    cd "$FRONTEND_DIR" && npm install --legacy-peer-deps
fi

echo ""
echo "Seleccione modo de arranque:"
echo "  [1] Modo Local Standalone (Backend H2 + Frontend :4200)"
echo "  [2] Modo Docker Compose (Todo containerizado)"
echo "  [3] Detener servicios"
read -p "Opción [1-3]: " opt

case $opt in
  1)
    echo "Levantando Backend Spring Boot..."
    cd "$BACKEND_DIR"
    chmod +x mvnw
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=local -DskipTests &
    
    echo "Levantando Frontend Angular..."
    cd "$FRONTEND_DIR"
    npx ng serve --port 4200 &
    
    echo "Servicios arrancados en segundo plano."
    echo "Frontend: http://localhost:4200"
    echo "Swagger:  http://localhost:8080/swagger-ui/index.html"
    ;;
  2)
    echo "Iniciando contenedores con Docker Compose..."
    cd "$DIR"
    docker compose up -d --build
    ;;
  3)
    bash "$DIR/stop.sh"
    ;;
  *)
    echo "Saliendo."
    ;;
esac
