@echo off
setlocal
title Daily Planner
cd /d "%~dp0"

if /I "%~1"=="--no-open" (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-daily-planner.ps1" -NoOpen
) else (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-daily-planner.ps1"
)
if errorlevel 1 pause
endlocal
