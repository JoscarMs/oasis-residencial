@echo off
title Sistema Residencial OASIS Hereditas - Apagar
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0detener_servicios.ps1"
pause
