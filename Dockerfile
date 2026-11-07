FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package.json /app/package.json
RUN npm install --omit=dev --no-audit --no-fund

# Copy storefront web files, styles, collections, assets, and scripts
COPY server.js /app/server.js
COPY index.html /app/index.html
COPY styles.css /app/styles.css
COPY catalog-data.js /app/catalog-data.js
COPY ai-bot-widget.js /app/ai-bot-widget.js
COPY app.js /app/app.js
COPY robots.txt /app/robots.txt
COPY sitemap.xml /app/sitemap.xml
COPY favicon.svg /app/favicon.svg
COPY collections /app/collections
COPY assets /app/assets
COPY whatsapp-ai-bot /app/whatsapp-ai-bot
COPY facebook-automation /app/facebook-automation

ENV PORT=8096
ENV NODE_ENV=production
EXPOSE 8096

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8096/health || exit 1

CMD ["node", "/app/server.js"]
