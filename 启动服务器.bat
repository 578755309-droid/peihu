@echo off
rem 安科邦陪护原型 - 本地预览服务器一键启动
cd /d %~dp0
netstat -ano | findstr "LISTENING" | findstr ":5173" >nul && (echo 服务器已在运行： http://localhost:5173 & pause & exit /b 0)
start "" /min node dev-server.js
timeout /t 2 >nul
echo 服务器已启动： http://localhost:5173
pause
