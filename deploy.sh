#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/eduardo/calculadora"
NGINX_AVAIL="/etc/nginx/sites-available/calculadora.mirandastack.com"
NGINX_ENABLED="/etc/nginx/sites-enabled/calculadora.mirandastack.com"

echo "===== Projeto ====="
mkdir -p "$PROJECT_DIR"
cp -a index.html styles.css app.js "$PROJECT_DIR/"

echo "===== Permissões ====="
chmod 755 /home/eduardo
find "$PROJECT_DIR" -type d -exec chmod 755 {} \;
find "$PROJECT_DIR" -type f -exec chmod 644 {} \;

echo "===== Nginx ====="
sudo cp nginx-calculadora.mirandastack.com.conf "$NGINX_AVAIL"
sudo ln -sfn "$NGINX_AVAIL" "$NGINX_ENABLED"
sudo nginx -t
sudo systemctl reload nginx

echo
printf 'Projeto publicado em: %s\n' "$PROJECT_DIR"
printf 'Domínio esperado: https://calculadora.mirandastack.com\n'
printf 'Próximo passo: emitir/validar certificado TLS após o DNS apontar para a VPS.\n'
