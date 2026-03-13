@echo off
setlocal

REM Build Windows installer (.exe) for bolt.diy
cd /d "%~dp0\.."

echo [INFO] Building Windows installer (.exe)...
call pnpm electron:build:exe
if %errorlevel% neq 0 (
  echo [ERROR] Build failed. Check logs above.
  exit /b 1
)

echo [SUCCESS] Build completed.
echo [INFO] Look for installer in the dist folder (usually *-setup.exe).
exit /b 0
