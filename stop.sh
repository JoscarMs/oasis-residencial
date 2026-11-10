#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE APAGADO PARA LINUX / MACOS - RESIDENCIA OASIS HEREDITAS
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Deteniendo contenedores Docker..."
cd "$DIR" && docker compose down 2>/dev/null

echo "Liberando puertos 8080 y 4200..."
fuser -k 8080/tcp 2>/dev/null || true
fuser -k 4200/tcp 2>/dev/null || true

echo "Servicios apagados exitosamente."
