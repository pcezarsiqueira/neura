# Frontend React/Vite — build estático servido pelo Caddy (atrás do Traefik)
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG VITE_STORAGE_DRIVER=http
ARG VITE_API_BASE_URL=/api
ENV VITE_STORAGE_DRIVER=$VITE_STORAGE_DRIVER
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80
