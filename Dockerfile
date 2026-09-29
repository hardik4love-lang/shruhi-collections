FROM node:20-alpine

WORKDIR /app

# Install production dependencies first (Baileys for WhatsApp, etc.)
COPY package.json /app/package.json
RUN npm install --production

# Copy unified catalog, assets, and both 24/7 bots
COPY catalog-data.js /app/catalog-data.js
COPY assets /app/assets
COPY whatsapp-ai-bot /app/whatsapp-ai-bot
COPY facebook-automation /app/facebook-automation

ENV PORT=8096
ENV NODE_ENV=production
EXPOSE 8096

# Starts BOTH WhatsApp (+91 63552 85433) 24/7 Auto-AI AND Facebook 3-Page + 100-Group 24/7 Comment Bot
CMD ["node", "/app/whatsapp-ai-bot/bot.js"]
