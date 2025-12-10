module.exports = {
  apps: [
    {
      name: "anan-client",
      cwd: "/home/deploy/anan-client",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
