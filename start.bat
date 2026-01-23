@echo off
title Gesture Whiteboard Starter
echo ================================
echo   Starting Gesture Whiteboard
echo ================================

REM Go to project root
cd /d D:\gesture-whiteboard

echo.
echo [1/3] Starting BACKEND...
start "Backend Server" cmd /k "cd /d D:\gesture-whiteboard\backend && node server.js"

echo.
echo [2/3] Starting FRONTEND...
start "Frontend Server" cmd /k "cd /d D:\gesture-whiteboard\frontend && npm run dev"

echo.
echo [3/3] Opening browser...
timeout /t 3 >nul
start http://localhost:5173

echo.
echo ✅ All services started!
echo Backend  -> http://localhost:5000
echo Frontend -> http://localhost:5173
pause
