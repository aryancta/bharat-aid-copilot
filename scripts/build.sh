#!/bin/bash

# Production build script for BharatAid Copilot

echo "🏗️  Building BharatAid Copilot for production..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next

# Type check
echo "🔍 Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Please fix TypeScript errors."
  exit 1
fi

# Build application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please check the errors above."
  exit 1
fi

echo "✅ Build completed successfully!"
echo "🚀 You can now run 'npm start' to start the production server."