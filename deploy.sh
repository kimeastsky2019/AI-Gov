#!/bin/bash
# ============================================================
# AIGov Pro 배포 스크립트
# 대상 서버: 34.64.248.144 (www.gngmeta.com)
# ============================================================

set -e

# --- 설정 ---
SERVER_IP="34.64.248.144"
SERVER_USER="root"            # 서버 SSH 사용자 (적절히 변경)
DEPLOY_DIR="/var/www/aigov-platform"
NGINX_CONF="/etc/nginx/sites-available/www.gngmeta.com.conf"

echo "=== 1단계: 프론트엔드 빌드 ==="
npm run build

echo ""
echo "=== 2단계: 서버 백엔드 빌드 ==="
cd server && npm run build && cd ..

echo ""
echo "=== 3단계: 서버로 파일 전송 ==="
echo "다음 명령을 서버(${SERVER_IP})에서 실행하세요:"
echo ""
echo "# 1) 배포 디렉토리 생성"
echo "ssh ${SERVER_USER}@${SERVER_IP} 'mkdir -p ${DEPLOY_DIR}/{dist,server}'"
echo ""
echo "# 2) 프론트엔드 빌드 파일 전송"
echo "scp -r dist/* ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/dist/"
echo ""
echo "# 3) 서버 코드 전송"
echo "scp -r server/dist server/package.json server/package-lock.json server/.env ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/server/"
echo ""
echo "# 4) 서버 데이터 디렉토리 전송"
echo "scp -r server/data ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/server/"
echo ""
echo "# 5) Nginx 설정 전송"
echo "scp nginx/www.gngmeta.com.conf ${SERVER_USER}@${SERVER_IP}:${NGINX_CONF}"
echo ""

echo "=== 4단계: 서버에서 실행할 명령 ==="
echo ""
echo "# --- 서버에 SSH 접속 후 ---"
echo "ssh ${SERVER_USER}@${SERVER_IP}"
echo ""
echo "# 1) Node.js 의존성 설치"
echo "cd ${DEPLOY_DIR}/server && npm install --production"
echo ""
echo "# 2) SSL 인증서 발급 (www.gngmeta.com)"
echo "sudo certbot certonly --webroot -w /var/www/certbot -d www.gngmeta.com -d gngmeta.com"
echo ""
echo "# 3) Nginx 설정 활성화"
echo "sudo ln -sf ${NGINX_CONF} /etc/nginx/sites-enabled/"
echo "sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "# 4) PM2로 백엔드 서버 실행"
echo "cd ${DEPLOY_DIR}/server"
echo "pm2 start dist/index.js --name aigov-api"
echo "pm2 save"
echo ""
echo "=== 배포 완료 후 확인 ==="
echo "https://www.gngmeta.com 에서 서비스 확인"
echo ""
