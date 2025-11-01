#!/usr/bin/env bash
set -e
REPO_DIR="${HOME}/aprendiendo-redes"
cd "$REPO_DIR"
git pull origin main
cd backend
npm ci
pm2 restart aprendiendo-backend || pm2 start src/index.js --name aprendiendo-backend
cd ../frontend
npm ci
npm run build || true
sudo systemctl restart nginx || true
echo "Deployed"
