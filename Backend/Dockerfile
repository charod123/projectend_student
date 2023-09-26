FROM node:16.14.1

WORKDIR /home/share/service

# คัดลอก package*.json และติดตั้ง dependencies ก่อน
COPY package*.json ./
RUN npm install

# คัดลอกไฟล์ที่เหลือจาก directory ปัจจุบัน
COPY . .

EXPOSE 3001 3003 3000

CMD [ "node", "server.js" ]
