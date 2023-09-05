# ระบุ base image
FROM node:16.14.1

# ตั้งค่า directory ที่จะทำงาน
WORKDIR /home/share/web-sos-patient

# คัดลอกไฟล์ที่เกี่ยวข้องไปยัง Docker image
COPY Frontend/dist /home/share/web-sos-patient
COPY server.js /home/share/web-sos-patient
COPY package*.json ./
# ติดตั้ง dependencies
RUN npm install

# ระบุ port ที่ Docker จะ "เปิด" เมื่อ application ทำงาน
EXPOSE 3002

# ระบุ command ที่จะทำงานเมื่อ container ถูกสร้าง
CMD [ "node", "server.js" ]
