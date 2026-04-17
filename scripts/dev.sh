#!/bin/bash

# Development helper script for BharatAid Copilot

echo "🚀 Starting BharatAid Copilot Development Environment..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Initialize database if it doesn't exist
if [ ! -f "data/app.db" ]; then
  echo "🗄️  Initializing database..."
  mkdir -p data
  npm run seed
fi

# Check database health
echo "🔍 Checking database status..."
npm run seed stats

echo "✅ Development environment ready!"
echo "🌐 Starting Next.js development server..."

npm run dev