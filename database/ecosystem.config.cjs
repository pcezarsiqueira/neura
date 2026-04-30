module.exports = {
  apps: [
    {
      name: "neura-frontend",
      script: "npx",
      args: "serve -s dist -l 8080",
      cwd: __dirname + "/..",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "neura-api",
      script: "server.js",
      cwd: __dirname + "/api-node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};