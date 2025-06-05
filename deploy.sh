#!/bin/bash

# Hassaniya Transcription App Deployment Script

echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run tests (optional)
echo "🧪 Running tests..."
npm test -- --coverage --watchAll=false

if [ $? -ne 0 ]; then
    echo "⚠️  Tests failed, but continuing with deployment..."
fi

# Build for production
echo "🏗️  Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build files are in the 'build' directory"
echo "🌐 Ready for deployment to your hosting service"

# Optional: Deploy to specific services
read -p "Do you want to deploy to a specific service? (vercel/netlify/none): " service

case $service in
    vercel)
        echo "🚀 Deploying to Vercel..."
        npx vercel --prod
        ;;
    netlify)
        echo "🚀 Deploying to Netlify..."
        npx netlify deploy --prod --dir=build
        ;;
    none|*)
        echo "✅ Deployment script completed. Manual deployment required."
        ;;
esac