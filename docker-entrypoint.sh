#!/bin/sh
set -e

# Sobe a API Node em background (porta interna 3001)
PORT=3001 node /app/server.js &
API_PID=$!

# Encerra a API se o Caddy cair
trap "kill $API_PID 2>/dev/null || true" EXIT INT TERM

# Caddy em foreground (porta 3300, exposta ao Traefik)
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
