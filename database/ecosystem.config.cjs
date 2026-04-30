module.exports = {
  apps: [
    {
      name: "neura-frontend",
      script: "npm",
      args: "run preview -- --host 0.0.0.0 --port 8080",
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