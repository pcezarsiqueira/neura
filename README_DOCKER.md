# NEURA — Docker com Frontend + Backend + MySQL

Este pacote foi ajustado para rodar o projeto em uma única stack Docker Compose:

- `frontend`: React/Vite compilado e servido pelo Nginx
- `api`: Node/Express com MySQL
- `mysql`: banco MySQL 8 com schema inicial

## Como subir

```bash
cp .env.example .env
nano .env

docker compose up -d --build
```

A aplicação ficará disponível em:

```bash
http://SEU_IP:8080
```

A API é acessada internamente pelo frontend em:

```bash
/api/diagnostics
```

O Nginx do frontend encaminha `/api/*` para o container `api`, então não precisa expor a porta 3001 publicamente.

## Se for usar Traefik

No `docker-compose.yml`, comente:

```yaml
ports:
  - "8080:80"
```

E descomente/ajuste as labels do serviço `frontend`, principalmente:

```yaml
traefik.http.routers.neura.rule=Host(`seu-dominio.com.br`)
traefik.http.routers.neura.tls.certresolver=mytlschallenge
```

Também descomente a rede externa `root_default`, caso esse seja o nome da rede do seu Traefik.

## Banco de dados

Na primeira inicialização, o MySQL executa automaticamente:

```bash
db/schema.mysql.sql
```

Se você já subiu antes e quiser recriar o banco do zero:

```bash
docker compose down -v
docker compose up -d --build
```

Atenção: `down -v` apaga os dados do volume MySQL.

## O que foi alterado

- Removidas dependências de TanStack Start/Lovable/Cloudflare que estavam quebrando o build.
- Convertido o frontend para Vite React padrão.
- Criado `index.html` e `src/main.tsx`.
- Ajustada a rota root para SPA, sem SSR.
- Criado Nginx com fallback para rotas React e proxy `/api`.
- Separado backend em Dockerfile próprio.
- Criado `docker-compose.yml` com frontend, API e MySQL.
