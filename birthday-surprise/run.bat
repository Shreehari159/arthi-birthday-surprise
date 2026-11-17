@echo off
title Birthday Surprise - Arthi
echo ========================================================
echo        Starting Birthday Surprise for Arthi 
echo ========================================================
echo.
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

node run.js
pause
