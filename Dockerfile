FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

WORKDIR /app/database/api-node
RUN npm install

RUN npm install -g pm2

WORKDIR /app

EXPOSE 8080
EXPOSE 3001

CMD ["pm2-runtime", "database/ecosystem.config.cjs"]