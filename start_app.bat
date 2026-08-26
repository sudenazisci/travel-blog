@echo off
echo Starting Travel Blog Application...
cd /d "%~dp0"

if not exist "%~dp0data\db" mkdir "%~dp0data\db"
start "MongoDB Database" cmd /k ""C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "%~dp0data\db" --port 27017"
timeout /t 3 /nobreak >nul

start "Travel Blog Backend" cmd /k "cd /d "%~dp0backend" && npm start"
timeout /t 2 /nobreak >nul

start "Travel Blog Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Application started!
echo Frontend URL: http://localhost:5173
echo Backend URL: http://localhost:5000
