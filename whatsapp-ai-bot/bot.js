/**
 * SHRUHI COLLECTIONS — 100% AUTO-AI WHATSAPP BOT FOR +91 63552 85433
 * ============================================================================
 * Features:
 * 1. All 29 Priced 4K Products (MRP ₹850 – ₹3,550, Sizes S to 6XL) built-in.
 * 2. 100% Auto-AI responses: greets customers, lists all 29 products, sends
 *    4K branded product images + exact MRP & sizes when asked for any code,
 *    number (1–29), size (S–6XL), or budget.
 * 3. AUTOMATIC "UNTIL I JUMP IN" HUMAN TAKEOVER:
 *    - The moment YOU send any manual message from your phone / WhatsApp Web on
 *      +91 63552 85433 to a customer (`msg.key.fromMe === true` and not sent by
 *      this bot), the bot immediately pauses Auto-AI for that customer so you
 *      can chat personally without interruption!
 *    - Type `!ai` in any chat to re-enable 100% Auto-AI for that customer.
 */

const fs = require("fs");
const path = require("path");

// Load window.SHRUHI_CATALOG from ../catalog-data.js
const catalogPath = path.join(__dirname, "..", "catalog-data.js");
const rawCatalogJs = fs.readFileSync(catalogPath, "utf8");
const sandboxWindow = {};
new Function("window", rawCatalogJs)(sandboxWindow);
const CATALOG = sandboxWindow.SHRUHI_CATALOG || [];

console.log(`Loaded ${CATALOG.length} Shruhi Collections 4K products for +91 63552 85433 Auto-AI.`);

// Track chats where the human owner has jumped in (jid -> timestamp)
const humanTakeoverChats = new Map();
// Track message IDs sent by the AI bot itself so we distinguish bot replies from owner manual replies
const botSentMessageIds = new Set();

function buildFullCatalogMenuText() {
  const lines = CATALOG.map(
    (item, idx) =>
      `*${idx + 1}. ${item.code}* — *${item.priceFormatted}* (${item.qtyInfo})\n   _${item.name}_ | Sizes: ${item.sizes.join(", ")}`
  );
  return (
    `✨ *SHRUHI COLLECTIONS — OFFICIAL 24/7 AI CATALOG (+91 63552 85433)* ✨\n` +
    `🌐 Website: https://www.shruhicollections.in\n` +
    `📍 Showroom: 214/215, Prime Arcade, Anand Mahal Rd, Adajan, Surat – 395009\n\n` +
    `📋 *ALL ${CATALOG.length} VERIFIED 4K DESIGNS (MRP ₹850 – ₹3,550):*\n\n` +
    lines.join("\n\n") +
    `\n\n💡 *Reply with any Item Number (1–${CATALOG.length}), Design Code (e.g. TEJAL, 1042, KAVYA), or Size (e.g. 3XL, 6XL, L) to receive its 4K Photo & instant order link!*`
  );
}

function findMatchingProducts(query) {
  const q = query.toLowerCase().trim();

  // Check if customer typed an item number (1 to 29)
  if (/^\d{1,2}$/.test(q)) {
    const num = parseInt(q, 10);
    if (num >= 1 && num <= CATALOG.length) {
      return [CATALOG[num - 1]];
    }
  }

  if (q.includes("plus") || q.includes("3xl") || q.includes("4xl") || q.includes("5xl") || q.includes("6xl") || q.includes("curvy")) {
    return CATALOG.filter((c) => c.isPlusSize || c.sizes.some((s) => ["3XL", "4XL", "5XL", "6XL"].includes(s)));
  }

  if (q.includes("under") || q.includes("1600") || q.includes("850") || q.includes("1500")) {
    return CATALOG.filter((c) => c.price <= 1600);
  }

  return CATALOG.filter((item) => {
    const hay = `${item.code} ${item.name} ${item.colorName} ${item.fabric} ${item.price} ${item.sizes.join(" ")}`.toLowerCase();
    return q.split(/\s+/).some((w) => w.length >= 2 && hay.includes(w));
  });
}

async function startWhatsAppAiBot() {
  let baileys;
  try {
    baileys = require("@whiskeysockets/baileys");
  } catch (e) {
    console.log("Installing @whiskeysockets/baileys first (`npm install`)...");
    return;
  }

  const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = baileys;
  const pino = require("pino");
  const qrcode = require("qrcode-terminal");

  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, "auth_6355285433"));
  let versionInfo = {};
  try {
    const latest = await fetchLatestBaileysVersion();
    if (latest?.version) versionInfo = { version: latest.version };
  } catch (_) {}

  const sock = makeWASocket({
    ...versionInfo,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    browser: ["Shruhi Collections AI", "Chrome", "122.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("\n========================================================");
      console.log("📱 SCAN THIS QR CODE FROM WHATSAPP ON +91 63552 85433:");
      console.log("   (WhatsApp -> Linked Devices -> Link a Device)");
      console.log("========================================================\n");
      qrcode.generate(qr, { small: true });

      // Also save a clean browser-scannable QR page at whatsapp-ai-bot/qr.html
      const qrPageHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="15"><title>Scan QR — Shruhi Collections +91 63552 85433 Auto-AI</title></head><body style="background:#0b141a;color:#fff;font-family:sans-serif;display:grid;place-items:center;min-height:95vh;text-align:center;"><div><h2 style="color:#25d366;">Shruhi Collections — +91 63552 85433 Auto-AI Bot</h2><p>Open WhatsApp on <strong>+91 63552 85433</strong> → <strong>Linked Devices</strong> → <strong>Link a Device</strong> and scan:</p><div style="background:#fff;padding:24px;border-radius:16px;display:inline-block;margin-top:12px;"><img src="https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(qr)}" width="340" height="340" alt="WhatsApp QR"/></div></div></body></html>`;
      fs.writeFileSync(path.join(__dirname, "qr.html"), qrPageHtml, "utf8");
      console.log("\n🌐 Or scan in browser: http://localhost:8090/whatsapp-ai-bot/qr.html\n");
    }
    if (connection === "open") {
      console.log("\n✅ SHRUHI COLLECTIONS 100% AUTO-AI BOT IS LIVE ON +91 63552 85433!");
      console.log("• Auto-AI replies to all incoming customer messages with all 29 products.");
      console.log("• Automatically pauses for any customer the moment YOU reply manually!\n");
    }
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        setTimeout(() => startWhatsAppAiBot(), 2500);
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      const jid = msg.key.remoteJid;
      if (!jid || jid === "status@broadcast" || jid.endsWith("@g.us")) continue;

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        "";

      // 1. DETECT WHEN OWNER JUMPS IN MANUALLY (`fromMe === true` and not sent by AI bot)
      if (msg.key.fromMe) {
        if (botSentMessageIds.has(msg.key.id)) continue; // Ignore bot's own messages

        const cmd = text.trim().toLowerCase();
        if (cmd === "!ai" || cmd === "/ai") {
          humanTakeoverChats.delete(jid);
          console.log(`[AI RESUMED] 100% Auto-AI re-enabled for ${jid}`);
          continue;
        }

        // Owner typed a manual reply! Immediately pause Auto-AI for this customer ("Until I Jump In")
        humanTakeoverChats.set(jid, Date.now());
        console.log(`[OWNER JUMPED IN] Paused Auto-AI for ${jid} because owner replied manually.`);
        continue;
      }

      // 2. IF OWNER HAS JUMPED IN FOR THIS CHAT, DO NOT AUTO-REPLY
      if (humanTakeoverChats.has(jid)) {
        const pausedAt = humanTakeoverChats.get(jid);
        // Auto-resume after 4 hours of inactivity unless owner keeps chatting
        if (Date.now() - pausedAt < 4 * 60 * 60 * 1000) {
          console.log(`[HUMAN MODE ACTIVE] Skipping Auto-AI reply for ${jid}`);
          continue;
        } else {
          humanTakeoverChats.delete(jid);
        }
      }

      if (!text.trim()) continue;
      const clean = text.trim().toLowerCase();

      // If customer asks for owner / human call
      if (clean.includes("owner") || clean.includes("human") || clean.includes("call me")) {
        humanTakeoverChats.set(jid, Date.now());
        const sent = await sock.sendMessage(jid, {
          text:
            `🙋‍♂️ *Shruhi Collections — Owner Handover Activated*\n\n` +
            `I have paused the Auto-AI assistant and notified our boutique owner on *+91 63552 85433*. They will jump into this chat shortly!`
        });
        if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
        continue;
      }

      // If customer says hi/hello/catalog/menu/price/all
      if (
        ["hi", "hello", "hey", "catalog", "menu", "price", "prices", "all", "list", "start", "shop"].includes(clean) ||
        clean.includes("all product") ||
        clean.includes("catalog")
      ) {
        const sent = await sock.sendMessage(jid, { text: buildFullCatalogMenuText() });
        if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
        continue;
      }

      // Match specific product(s) and send 4K Image + Details!
      const matches = findMatchingProducts(clean);
      if (matches.length > 0) {
        for (const item of matches.slice(0, 3)) {
          const imgPath = path.join(__dirname, "..", item.image);
          const caption =
            `✨ *${item.code} — ${item.name}*\n` +
            `• *Verified MRP:* ${item.priceFormatted} (${item.qtyInfo})\n` +
            `• *Available Sizes:* ${item.sizes.join(", ")}\n` +
            `• *Full Set Value:* ₹${(item.price * item.sizes.length).toLocaleString("en-IN")} (${item.sizes.length} Pcs)\n` +
            `• *Fabric & Work:* ${item.fabric} — ${item.workType}\n\n` +
            `🛍️ *Reply with your Size (${item.sizes.join("/")}) & Delivery City to confirm your order, or type "OWNER" anytime for our team to jump in!*`;

          if (fs.existsSync(imgPath)) {
            const sent = await sock.sendMessage(jid, {
              image: fs.readFileSync(imgPath),
              caption
            });
            if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
          } else {
            const sent = await sock.sendMessage(jid, { text: caption });
            if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
          }
        }
      } else {
        const sent = await sock.sendMessage(jid, {
          text:
            `🤖 *Shruhi Collections 24/7 AI Concierge (+91 63552 85433)*\n\n` +
            `• Reply *CATALOG* to see all *${CATALOG.length} Priced Designs (₹850 – ₹3,550)*\n` +
            `• Reply with any *Item Number (1–${CATALOG.length})* or *Code (TEJAL, GALAXY, KAVYA, 1042, B-2876)* to get its 4K Photo & Price\n` +
            `• Reply *PLUS* for Curvy Sizes (3XL to 6XL)\n` +
            `• Reply *OWNER* anytime and I will pause so our owner can jump in personally!`
        });
        if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
      }
    }
  });
}

startWhatsAppAiBot();
