@echo off
rem Double-click to open the Darkroom editor (edit photo titles and places).
rem Keep this window open while editing; close it to stop the editor.
setlocal
cd /d "%~dp0.."
chcp 65001 >nul
set PYTHONIOENCODING=utf-8

if exist "%USERPROFILE%\anaconda3\python.exe" (
  "%USERPROFILE%\anaconda3\python.exe" tools\photo_editor.py
  goto done
)
where py >nul 2>nul
if not errorlevel 1 (
  py -3 tools\photo_editor.py
  goto done
)
where python >nul 2>nul
if not errorlevel 1 (
  python tools\photo_editor.py
  goto done
)
echo Python 3 was not found. Install it from https://www.python.org/ and try again.
pause
exit /b 1

:done
if errorlevel 1 pause
