FROM node:18-alpine

# 앱 디렉토리 생성
WORKDIR /usr/src/project

# Express 설치 및 기본 서버 파일 생성
RUN npm init -y && npm install express dotenv

# 기본 서버 파일 복사
COPY server.js .

# 컨테이너 포트 오픈
EXPOSE 3000

# 서버 실행
CMD ["node", "server.js"]
