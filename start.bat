@echo off
title VOID SMP store
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js was not found. Install the LTS version from https://nodejs.org
  echo then close this window and double-click start.bat again.
  echo.
  pause
  exit /b 1
)
if not exist server.js (
  echo.
  echo server.js was not found next to start.bat. Re-extract the full ZIP and try again.
  echo.
  pause
  exit /b 1
)
set OPEN_BROWSER=1
node server.js
echo.
echo The server stopped. If you see an error above, copy it and send it to me.
pause
