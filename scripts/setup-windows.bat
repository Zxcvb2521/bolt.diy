@echo off
setlocal EnableDelayedExpansion

REM bolt.diy automated Windows setup script
REM Installs common prerequisites (Git, Node.js, pnpm) and project dependencies.

cd /d "%~dp0\.."

echo.
echo ============================================
echo         bolt.diy Windows Setup
ECHO ============================================
echo.

where git >nul 2>&1
if %errorlevel% neq 0 (
  echo [INFO] Git is not installed.
) else (
  echo [OK] Git is already installed.
)

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [INFO] Node.js is not installed.
) else (
  for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
  echo [OK] Node.js is already installed: !NODE_VERSION!
)

where winget >nul 2>&1
if %errorlevel% equ 0 (
  echo [INFO] Using winget for dependency installation...

  where git >nul 2>&1
  if %errorlevel% neq 0 (
    winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements
  )

  where node >nul 2>&1
  if %errorlevel% neq 0 (
    winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
  )
) else (
  where choco >nul 2>&1
  if %errorlevel% equ 0 (
    echo [INFO] winget not found. Using Chocolatey...

    where git >nul 2>&1
    if %errorlevel% neq 0 (
      choco install git -y
    )

    where node >nul 2>&1
    if %errorlevel% neq 0 (
      choco install nodejs-lts -y
    )
  ) else (
    echo [WARN] Neither winget nor choco found.
    echo [WARN] Please install Git and Node.js manually, then re-run this script.
  )
)

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] Node.js is required but was not found after installation step.
  exit /b 1
)

where corepack >nul 2>&1
if %errorlevel% equ 0 (
  echo [INFO] Enabling corepack and activating pnpm...
  call corepack enable
  call corepack prepare pnpm@9.14.4 --activate
) else (
  echo [WARN] corepack not found. Installing pnpm globally via npm...
  call npm install -g pnpm@9.14.4
)

where pnpm >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] pnpm installation failed.
  exit /b 1
)

echo [INFO] Installing project dependencies with pnpm...
call pnpm install
if %errorlevel% neq 0 (
  echo [ERROR] pnpm install failed.
  exit /b 1
)

echo.
echo [SUCCESS] Environment setup complete.
echo [NEXT] Run: pnpm run dev:fast
exit /b 0
