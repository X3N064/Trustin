# Node.js 14 기반 이미지 사용
FROM node:14

# 컨테이너 작업 디렉토리 설정
WORKDIR /api

# C++ 컴파일러 설치 (g++)
RUN apt update && apt install -y g++

# package.json 복사 후 npm 패키지 설치
COPY package.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# ✅ C++ 실행파일 빌드 (Windows에서 빌드된 .exe 사용하지 않음)
RUN g++ -o matching_engine matching_engine.cpp

# 실행 권한 추가
RUN chmod +x matching_engine

# 컨테이너 실행시 Node 서버 시작
CMD ["node", "server.js"]

# API 포트 오픈
EXPOSE 3000
