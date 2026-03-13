@echo off
setlocal

REM Convenience launcher from repository root
call "%~dp0scripts\setup-windows.bat"
exit /b %errorlevel%
