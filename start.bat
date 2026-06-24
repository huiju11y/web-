@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════╗
echo ║   📷 CameraHub 启动脚本                ║
echo ╚════════════════════════════════════════╝
echo.

:: 查找 Node.js
set NODE_PATH=
if exist "C:\Users\admin\.workbuddy\binaries\node\versions\20.18.0.installing.4644.__extract_temp__\node-v20.18.0-win-x64\node.exe" (
    set "NODE_PATH=C:\Users\admin\.workbuddy\binaries\node\versions\20.18.0.installing.4644.__extract_temp__\node-v20.18.0-win-x64"
)

if "%NODE_PATH%"=="" (
    echo [ERROR] 未找到 Node.js，请先安装 Node.js
    echo         下载地址: https://nodejs.org/
    pause
    exit /b 1
)

set "PATH=%NODE_PATH%;%PATH%"

echo [OK] Node.js 版本:
node --version
echo.
echo [启动] 后端服务 + 前端静态文件...
echo        地址: http://localhost:3456
echo        短信: 模拟模式（验证码打印在下方控制台）
echo.

node server.js

pause
