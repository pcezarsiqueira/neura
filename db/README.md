# NEURA Corporativo — Banco de dados

O app suporta dois modos de armazenamento, controlados em
`src/lib/storage/index.ts` (ou via variáveis `VITE_*` no `.env`):

| Driver  | Onde os dados ficam        | Quando usar                        |
|---------|----------------------------|------------------------------------|
| `local` | `localStorage` do browser  | Padrão / demo / sem backend        |
| `http`  | API REST → MySQL no VPS    | Produção, multi-dispositivo, BI    |

## 1. Subir o MySQL no VPS

```bash
mysql -u root -p
CREATE DATABASE neura_corp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'neura'@'%' IDENTIFIED BY 'TROQUE_ESTA_SENHA';
GRANT ALL PRIVILEGES ON neura_corp.* TO 'neura'@'%';
FLUSH PRIVILEGES;
USE neura_corp;
SOURCE schema.mysql.sql;
```

## 2. Subir a API HTTP

Use o exemplo pronto em `server-examples/mysql-api.example.js`:

```bash
mkdir neura-api && cd neura-api
npm init -y
npm install express mysql2 cors
cp ../server-examples/mysql-api.example.js index.js

DB_HOST=localhost \
DB_USER=neura DB_PASSWORD=TROQUE_ESTA_SENHA \
DB_NAME=neura_corp \
API_KEY=um-segredo-qualquer \
PORT=3001 \
node index.js
```

Recomenda-se rodar atrás de Nginx + HTTPS + PM2 / systemd.

## 3. Apontar o front-end para a API

Crie um `.env` na raiz do projeto:

```
VITE_STORAGE_DRIVER=http
VITE_API_BASE_URL=https://api.seudominio.com
VITE_API_KEY=um-segredo-qualquer
```

Pronto — todos os diagnósticos passam a ir para o MySQL e o `/admin` lê de lá.

## 4. Trocar para outro banco (Postgres, SQLite, Supabase…)

Crie um novo arquivo em `src/lib/storage/` implementando a interface
`StorageDriver` (ver `src/lib/storage/types.ts`) e registre-o no `switch`
de `src/lib/storage/index.ts`. Nenhuma outra parte do app precisa mudar.
