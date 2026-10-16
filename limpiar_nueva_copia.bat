@echo off
chcp 65001 >nul
setlocal

echo =======================================================
echo   Limpieza de archivos innecesarios / temporales
echo =======================================================
echo.
echo RUTA QUE SE VA A LIMPIAR:
echo   %CD%
echo.
echo ADVERTENCIA: 
echo   Este script eliminará de forma IRREVERSIBLE:
echo   - La caché de Next (.next)
echo   - La carpeta de dependencias (node_modules)
echo   - El historial de Git (.git)
echo   - La base de datos local (dev.db)
echo   - Los vídeos compilados de remotion (remotion-ad\out)
echo   - Archivos de configuración local (.env, tsconfig.tsbuildinfo)
echo.

set /p CONFIRM="¿Desea proceder con la limpieza? Escriba SI en mayúsculas para confirmar: "
if not "%CONFIRM%"=="SI" (
    echo.
    echo [INFO] Operación cancelada por seguridad. No se borró nada.
    echo.
    pause
    exit /b
)

echo.
echo [1/6] Eliminando caché de compilación (.next)...
if exist .next (
    rmdir /s /q .next
    echo OK.
) else (
    echo No existe.
)

echo [2/6] Eliminando módulos de dependencias (node_modules)...
if exist node_modules (
    rmdir /s /q node_modules
    echo OK.
) else (
    echo No existe.
)

echo [3/6] Eliminando historial de control de versiones (.git)...
if exist .git (
    rmdir /s /q .git
    echo OK.
) else (
    echo No existe.
)

echo [4/6] Eliminando archivos de build y temporales...
if exist tsconfig.tsbuildinfo (
    del /f /q tsconfig.tsbuildinfo
    echo tsconfig.tsbuildinfo eliminado.
)
if exist remotion-ad\out (
    rmdir /s /q remotion-ad\out
    echo remotion-ad\out eliminado.
)

echo [5/6] Eliminando base de datos SQLite de desarrollo (dev.db)...
if exist dev.db (
    del /f /q dev.db
    echo dev.db eliminado.
)

echo [6/6] Eliminando variables de entorno locales (.env)...
if exist .env (
    del /f /q .env
    echo .env eliminado.
)

echo.
echo =======================================================
echo   ¡Limpieza completada con éxito!
echo   Para trabajar aquí de nuevo, abre la terminal y ejecuta:
echo     npm install
echo     npx prisma db push
echo =======================================================
echo.
pause
