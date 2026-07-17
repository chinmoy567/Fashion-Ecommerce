@echo off
echo Starting FashionHub E-Commerce Platform...
echo.
echo ========================================
echo Backend Server (Port 5000)
echo ========================================
start cmd /k "cd backend && npm run dev"
echo.
timeout /t 3
echo.
echo ========================================
echo Frontend Server (Port 5173)
echo ========================================
start cmd /k "cd frontend && npm run dev"
echo.
echo Both servers starting...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
pause
