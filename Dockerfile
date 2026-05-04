# Imagem única: Frontend (Caddy) + API (Node) no mesmo container.
# Caddy escuta na porta 3300, serve o build estático e faz reverse proxy
# de /api/* para a API Node rodando em localhost:3001.

# ---------- Stage 1: build do frontend ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ARG VITE_STORAGE_DRIVER=http
ARG VITE_API_BASE_URL=/api
ENV VITE_STORAGE_DRIVER=$VITE_STORAGE_DRIVER
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ---------- Stage 2: runtime (Node + Caddy) ----------
FROM node:20-alpine
RUN apk add --no-cache caddy

WORKDIR /app

# API Node
COPY database/api-node/package.json ./
RUN npm install --omit=dev
COPY database/api-node/server.js ./

# Frontend estático
COPY --from=frontend-build /app/dist /srv

# Caddy + entrypoint
COPY Caddyfile /etc/caddy/Caddyfile
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3300

CMD ["/usr/local/bin/docker-entrypoint.sh"]
