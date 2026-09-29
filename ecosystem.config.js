module.exports = {
  apps: [
    {
      name: "shruhi-unified-whatsapp-facebook-24x7",
      script: "./whatsapp-ai-bot/bot.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 8096,
        WA_BOT_PORT: 8096,
        FB_BOT_PORT: 8095,
        FB_PAGE_ID: "61586357894191",
        WHATSAPP_NUMBER: "916355285433"
      }
    }
  ]
};
