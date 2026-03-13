@echo off
setlocal

REM Convenience launcher from repository root
call "%~dp0scripts\build-exe.bat"
exit /b %errorlevel%
