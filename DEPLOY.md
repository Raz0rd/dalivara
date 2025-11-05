# Guia de Deploy - Nacional Açaí
## Ubuntu Server + Nginx + PM2 + Certbot

---

## 1. ATUALIZAR SISTEMA

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. INSTALAR NODE.JS (v20 LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

```bash
sudo apt install -y nodejs
```

```bash
node -v
```

```bash
npm -v
```

---

## 3. INSTALAR PM2

```bash
sudo npm install -g pm2
```

```bash
pm2 -v
```

---

## 4. INSTALAR NGINX

```bash
sudo apt install -y nginx
```

```bash
sudo systemctl status nginx
```

```bash
sudo systemctl enable nginx
```

---

## 5. INSTALAR CERTBOT

```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 6. CLONAR PROJETO

```bash
cd /var/www
```

```bash
sudo mkdir nacional-acai
```

```bash
sudo chown -R $USER:$USER /var/www/nacional-acai
```

```bash
cd /var/www
```

```bash
git clone https://github.com/Raz0rd/dalivara.git nacional-acai
```

```bash
cd /var/www/nacional-acai
```

---

## 7. INSTALAR DEPENDÊNCIAS DO PROJETO

```bash
cd /var/www/nacional-acai
```

```bash
npm install
```

---

## 8. BUILD DO PROJETO

```bash
npm run build
```

---

## 9. CONFIGURAR PM2

```bash
pm2 start npm --name "nacional-acai" -- start
```

```bash
pm2 save
```

```bash
pm2 startup
```

**Copie e execute o comando que aparecer (será algo como):**
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u seu-usuario --hp /home/seu-usuario
```

```bash
pm2 list
```

---

## 10. CONFIGURAR NGINX (ANTES DO CERTBOT)

```bash
sudo nano /etc/nginx/sites-available/nacional-acai
```

**Cole esta configuração:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name nacional-acai.click www.nacional-acai.click;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Salvar: CTRL+O, Enter, CTRL+X**

```bash
sudo ln -s /etc/nginx/sites-available/nacional-acai /etc/nginx/sites-enabled/
```

```bash
sudo nginx -t
```

```bash
sudo systemctl reload nginx
```

---

## 11. GERAR CERTIFICADO SSL (SEM CLOUDFLARE PROXY)

**IMPORTANTE: Desative o proxy (nuvem laranja) no Cloudflare antes de executar**

```bash
sudo certbot --nginx -d nacional-acai.click -d www.nacional-acai.click --register-unsafely-without-email --agree-tos
```

**Escolha opção 2 (Redirect HTTP to HTTPS)**

---

## 12. CONFIGURAR NGINX (DEPOIS DO CERTBOT)

```bash
sudo nano /etc/nginx/sites-available/nacional-acai
```

**Substitua TODO o conteúdo por:**

```nginx
# Redirect www to non-www
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.nacional-acai.click;

    ssl_certificate /etc/letsencrypt/live/nacional-acai.click/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nacional-acai.click/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://nacional-acai.click$request_uri;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name nacional-acai.click;

    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name nacional-acai.click;

    ssl_certificate /etc/letsencrypt/live/nacional-acai.click/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nacional-acai.click/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public files
    location /public {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

**Salvar: CTRL+O, Enter, CTRL+X**

```bash
sudo nginx -t
```

```bash
sudo systemctl reload nginx
```

---

## 13. ATIVAR PROXY NO CLOUDFLARE

**Agora você pode ativar o proxy (nuvem laranja) no Cloudflare**

**Configurações do Cloudflare:**
- SSL/TLS: Full (Strict) ✅
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON
- Minimum TLS Version: 1.2

---

## 14. RENOVAÇÃO AUTOMÁTICA DO CERTBOT

```bash
sudo certbot renew --dry-run
```

**O certbot já configura renovação automática. Verificar:**

```bash
sudo systemctl status certbot.timer
```

---

## 15. COMANDOS ÚTEIS

### Ver logs do PM2
```bash
pm2 logs nacional-acai
```

### Reiniciar aplicação
```bash
pm2 restart nacional-acai
```

### Parar aplicação
```bash
pm2 stop nacional-acai
```

### Ver status
```bash
pm2 status
```

### Monitorar recursos
```bash
pm2 monit
```

### Ver logs do Nginx
```bash
sudo tail -f /var/log/nginx/access.log
```

```bash
sudo tail -f /var/log/nginx/error.log
```

### Testar configuração do Nginx
```bash
sudo nginx -t
```

### Recarregar Nginx
```bash
sudo systemctl reload nginx
```

### Reiniciar Nginx
```bash
sudo systemctl restart nginx
```

---

## 16. FIREWALL (OPCIONAL MAS RECOMENDADO)

```bash
sudo ufw allow 22/tcp
```

```bash
sudo ufw allow 80/tcp
```

```bash
sudo ufw allow 443/tcp
```

```bash
sudo ufw enable
```

```bash
sudo ufw status
```

---

## 17. ADICIONAR NOVO SITE NO FUTURO

### Criar nova configuração
```bash
sudo nano /etc/nginx/sites-available/novo-site
```

### Ativar site
```bash
sudo ln -s /etc/nginx/sites-available/novo-site /etc/nginx/sites-enabled/
```

### Testar e recarregar
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Iniciar com PM2 em outra porta
```bash
cd /var/www/novo-site
pm2 start npm --name "novo-site" -- start -- -p 3001
pm2 save
```

---

## 18. VARIÁVEIS DE AMBIENTE

**Criar arquivo .env.local:**

```bash
nano /var/www/nacional-acai/.env.local
```

**Adicionar suas variáveis:**
```
NEXT_PUBLIC_API_URL=https://nacional-acai.click
# Outras variáveis...
```

**Reiniciar PM2:**
```bash
pm2 restart nacional-acai
```

---

## 19. ATUALIZAR PROJETO

```bash
cd /var/www/nacional-acai
```

```bash
git pull
```
**ou faça upload dos novos arquivos**

```bash
npm install
```

```bash
npm run build
```

```bash
pm2 restart nacional-acai
```

---

## 20. VERIFICAÇÃO FINAL

### Testar site
```bash
curl -I https://nacional-acai.click
```

### Verificar PM2
```bash
pm2 list
```

### Verificar Nginx
```bash
sudo systemctl status nginx
```

### Verificar SSL
```bash
sudo certbot certificates
```

---

## TROUBLESHOOTING

### Site não carrega
```bash
pm2 logs nacional-acai --lines 50
sudo tail -f /var/log/nginx/error.log
```

### Erro 502 Bad Gateway
```bash
pm2 restart nacional-acai
sudo systemctl reload nginx
```

### Erro de permissão
```bash
sudo chown -R $USER:$USER /var/www/nacional-acai
```

### Porta 3000 já em uso
```bash
sudo lsof -i :3000
pm2 delete all
pm2 start npm --name "nacional-acai" -- start
```

---

## CHECKLIST FINAL

- [ ] Node.js instalado
- [ ] PM2 instalado e configurado
- [ ] Nginx instalado e rodando
- [ ] Projeto clonado em /var/www/nacional-acai
- [ ] Dependências instaladas (npm install)
- [ ] Build realizado (npm run build)
- [ ] PM2 rodando na porta 3000
- [ ] Nginx configurado (antes do Certbot)
- [ ] Certbot executado (proxy Cloudflare OFF)
- [ ] Nginx reconfigurado (depois do Certbot)
- [ ] Proxy Cloudflare ativado
- [ ] SSL Full (Strict) no Cloudflare
- [ ] Site acessível via HTTPS
- [ ] PM2 configurado para auto-start

---

## SUPORTE

Se algo der errado, verifique:
1. Logs do PM2: `pm2 logs`
2. Logs do Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Status dos serviços: `pm2 status` e `sudo systemctl status nginx`
4. Configuração do Nginx: `sudo nginx -t`

---

**Deploy criado em:** 05/11/2025
**Domínio:** nacional-acai.click
**Porta:** 3000
**PM2 Process:** nacional-acai
