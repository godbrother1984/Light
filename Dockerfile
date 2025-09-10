# ใช้ Nginx เป็น base image สำหรับ serve static files
FROM nginx:alpine

# ลบไฟล์ default ของ nginx
RUN rm -rf /usr/share/nginx/html/*

# คัดลอกไฟล์โปรเจกต์ทั้งหมดไปยัง nginx directory
COPY . /usr/share/nginx/html/

# คัดลอก nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# เปิด port 80
EXPOSE 80

# รัน nginx
CMD ["nginx", "-g", "daemon off;"]