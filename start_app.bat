@echo off
echo Starting Travel Blog Application...

start "Travel Blog Backend" cmd /k "cd backend && npm start"
start "Travel Blog Frontend" cmd /k "cd frontend && npm run dev"

echo Application started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
