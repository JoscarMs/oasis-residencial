@echo off
title Sistema Residencial OASIS Hereditas - Iniciar
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0iniciar_servicios.ps1"
pause
