#!/bin/bash

# Container startup script for BharatAid Copilot

echo "🚀 Starting BharatAid Copilot..."

# Create data directory if it doesn't exist
mkdir -p /app/data

# Set proper permissions
chown -R nextjs:nodejs /app/data

# Initialize database if needed (will be done automatically by health check)
echo "📊 Database will be auto-initialized on first health check"

echo "✅ BharatAid Copilot is ready!"
exec "$@"