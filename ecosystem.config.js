module.exports = {
  apps: [
    {
      name: "demoapp.echo-nusantara",
      script: "npm",
      args: "start",
    },
  ],

  deploy: {
    user: "admiNoc",
    host: "172.30.102.21",
    ref: "origin/master",
    repo: "https://gitlab.elga.net.id/achmad.hammam/echo-nusantara",
    path: "/var/www/html/benerit-website-v2/.next",
    "pre-deploy-local": "",
    "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production",
    "pre-setup": "",
  },
};
