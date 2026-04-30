module.exports = {
  apps: [
    {
      name: "neura-frontend",
      script: "npx",
      args: "serve -s /app/dist -l 8080",
      cwd: "/app",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "neura-api",
      script: "server.js",
      cwd: "/app/database/api-node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};