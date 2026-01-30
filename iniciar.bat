@echo off
echo ============================================
echo    Plan de Lealtad - Dashboard
echo ============================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js no está instalado.
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b
)

echo Node.js encontrado!
echo.

echo Instalando dependencias...
call npm install

echo.
echo Iniciando servidor...
echo.
echo Dashboard estará disponible en: http://localhost:3000
echo Presiona Ctrl+C para detener el servidor
echo.

call npm start

pause
