@echo off
echo 🚀 Starting deployment process...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

:: Install dependencies
echo 📦 Installing dependencies...
npm ci
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

:: Build for production
echo 🏗️ Building for production...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Build files are in the 'build' directory
echo 🌐 Ready for deployment to your hosting service

set /p service=Do you want to deploy to a specific service? (vercel/netlify/none): 

if /i "%service%"=="vercel" (
    echo 🚀 Deploying to Vercel...
    npx vercel --prod
) else if /i "%service%"=="netlify" (
    echo 🚀 Deploying to Netlify...
    npx netlify deploy --prod --dir=build
) else (
    echo ✅ Deployment script completed. Manual deployment required.
)

pause