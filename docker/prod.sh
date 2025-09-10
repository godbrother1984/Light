#!/bin/bash

# Production Docker Script สำหรับ Light Measurement System

echo "🏭 Starting Light Measurement System in Production Mode..."

# Build and start production environment with proxy
docker-compose --profile production up --build -d

echo "✅ Light Measurement System is running in Production Mode!"
echo "🌐 Access the application at: http://localhost:80"
echo "🔒 Nginx reverse proxy enabled"
echo "📊 Health check available at: http://localhost:80/health"

# Show logs
echo ""
echo "📋 Showing logs (Ctrl+C to exit logs, containers will keep running):"
docker-compose --profile production logs -f