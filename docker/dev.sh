#!/bin/bash

# Development Docker Script สำหรับ Light Measurement System

echo "🚀 Starting Light Measurement System in Development Mode..."

# Build and start development environment
docker-compose up --build -d light-app

echo "✅ Light Measurement System is running!"
echo "📄 Access the application at: http://localhost:8080"
echo "🔧 Development mode with live reload enabled"

# Show logs
echo ""
echo "📋 Showing logs (Ctrl+C to exit logs, container will keep running):"
docker-compose logs -f light-app