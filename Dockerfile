FROM node:20-alpine

WORKDIR /app

# Copy unified catalog, assets, WhatsApp 24/7 bot (with pre-linked +91 63552 85433 auth), and Facebook 24/7 bot
COPY catalog-data.js /app/catalog-data.js
COPY assets /app/assets
COPY whatsapp-ai-bot/package*.json /app/whatsapp-ai-bot/
RUN cd /app/whatsapp-ai-bot && npm install --production

COPY whatsapp-ai-bot /app/whatsapp-ai-bot
COPY facebook-automation /app/facebook-automation

ENV PORT=8096
ENV FB_BOT_PORT=8095
EXPOSE 8096 8095

# Starts BOTH WhatsApp (+91 63552 85433) 24/7 Auto-AI AND Facebook 3-Page + 100-Group 24/7 Comment Bot
CMD ["node", "/app/whatsapp-ai-bot/bot.js"]
