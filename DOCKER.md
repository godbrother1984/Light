# 🐳 Docker Setup สำหรับ Light Measurement System

## 📋 ข้อกำหนดเบื้องต้น

- Docker Desktop หรือ Docker Engine
- Docker Compose v3.8+

## 🚀 การรัน Development Environment

### 1. ใช้ Docker Compose (แนะนำ)
```bash
# Start development server
docker-compose up --build

# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### 2. ใช้ Script (Linux/Mac)
```bash
# Make script executable
chmod +x docker/dev.sh

# Run development script
./docker/dev.sh
```

### 3. ใช้ Docker โดยตรง
```bash
# Build image
docker build -t light-measurement .

# Run container
docker run -d -p 8080:80 --name light-app light-measurement
```

## 🏭 การรัน Production Environment

### ใช้ Production Profile
```bash
# Start with production proxy
docker-compose --profile production up --build -d

# หรือใช้ script
chmod +x docker/prod.sh
./docker/prod.sh
```

## 🌐 การเข้าถึงแอปพลิเคชัน

- **Development**: http://localhost:8080
- **Production**: http://localhost:80
- **Health Check**: http://localhost:80/health

## 📁 โครงสร้างไฟล์ Docker

```
docker/
├── nginx.conf          # Nginx configuration สำหรับ main app
├── proxy.conf          # Nginx reverse proxy configuration
├── dev.sh              # Development script
└── prod.sh             # Production script

Dockerfile              # Docker image definition
docker-compose.yml      # Docker Compose configuration
.dockerignore           # Files to exclude from Docker build
```

## ⚙️ การกำหนดค่า

### Environment Variables

สามารถกำหนดค่าผ่าน environment variables:

```bash
# Port configuration
NGINX_PORT=8080

# Firebase configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
```

### Custom Nginx Configuration

แก้ไขไฟล์ `docker/nginx.conf` เพื่อปรับแต่ง:
- Port numbers
- SSL certificates
- CORS headers
- Caching policies

## 🔧 Commands ที่มีประโยชน์

### Container Management
```bash
# Stop containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Restart specific service
docker-compose restart light-app

# View container status
docker-compose ps
```

### Logs และ Debugging
```bash
# View real-time logs
docker-compose logs -f light-app

# Execute shell in container
docker exec -it light-measurement-system sh

# Check container resource usage
docker stats light-measurement-system
```

### Image Management
```bash
# Build without cache
docker-compose build --no-cache

# Remove unused images
docker image prune

# List images
docker images light-measurement
```

## 🔒 Security Considerations

### Development Environment
- Volume mounting enabled สำหรับ live reload
- Debug logging enabled
- CORS headers permissive

### Production Environment
- Static file serving only
- Security headers enabled
- Nginx reverse proxy
- Rate limiting (สามารถเพิ่มได้)

## 📊 Performance Optimization

### Nginx Caching
- Static assets cached for 1 year
- Gzip compression enabled
- Browser caching headers

### Docker Image Optimization
- Multi-stage build (ถ้าต้องการ)
- Alpine Linux base image
- Minimal file copying

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 8080
netstat -an | grep 8080

# Use different port
NGINX_PORT=8081 docker-compose up
```

### Container Won't Start
```bash
# Check logs
docker-compose logs light-app

# Rebuild without cache
docker-compose build --no-cache light-app
```

### File Permission Issues
```bash
# Fix file permissions (Linux/Mac)
sudo chown -R $USER:$USER .
chmod -R 755 .
```

## 📈 Monitoring และ Health Checks

### Health Check Endpoint
```bash
# Check application health
curl http://localhost:80/health

# Expected response: "healthy"
```

### Container Health
```bash
# Docker health check
docker inspect --format='{{.State.Health.Status}}' light-measurement-system
```

## 🚢 Deployment

### Docker Hub
```bash
# Tag image
docker tag light-measurement your-username/light-measurement:latest

# Push to Docker Hub
docker push your-username/light-measurement:latest
```

### Cloud Deployment
- **AWS ECS**: ใช้ task definition จาก docker-compose.yml
- **Google Cloud Run**: Deploy container โดยตรง
- **Azure Container Instances**: ใช้ YAML configuration

## ⚡ Performance Tips

1. **Image Size**: ใช้ Alpine Linux และ multi-stage builds
2. **Caching**: กำหนด proper cache headers สำหรับ static assets
3. **Compression**: Enable Gzip สำหรับ text files
4. **CDN**: ใช้ CDN สำหรับ static files ใน production
5. **Health Checks**: กำหนด health check intervals ที่เหมาะสม