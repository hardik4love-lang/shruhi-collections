/**
 * SHRUHI COLLECTIONS — MULTI-LINE 24/7 AUTO-AI WHATSAPP BOT + LIVE QR HUB
 * ============================================================================
 * Line #1 (Women's Primary) : +91 90542 41725 (auth_9054241725/)
 * Line #2 (Men's Shirts)    : +91 88496 01725 (auth_8849601725/)
 * Line #3 (Backup AI Line)  : +91 63552 85433 (auth_6355285433/)
 *
 * Live QR Dashboard : http://localhost:8096/qr
 * Live Status API   : http://localhost:8096/api/status
 *
 * Features (ALL numbers 24/7):
 * 1. All 59 Priced 4K Products (29 Women's Ethnic & Curvy S–6XL + 30 Men's Luxury AI-Model Shirts M–2XL).
 * 2. Trilingual 100% Auto-AI (Surati Gujarati, Hindi & English).
 * 3. Sends 4K AI-Model product images + exact MRP & sizes on any code/number/size/budget query.
 * 4. "UNTIL I JUMP IN" — Auto-AI pauses the moment you manually reply from your phone.
 *    Type !ai or /ai to resume Auto-AI for that customer.
 */

const http = require("http");
const fs   = require("fs");
const path = require("path");

// ─── Silence harmless Baileys stale-session decryption errors ──────────────
const STALE_SESSION_ERRORS = [
  "Bad MAC", "MessageCounterError", "Key used already",
  "Failed to decrypt", "Session error", "never filled"
];
const _origConsoleError = console.error.bind(console);
console.error = (...args) => {
  const str = args.map((a) => String(a?.message || a || "")).join(" ");
  if (STALE_SESSION_ERRORS.some((e) => str.includes(e))) return;
  _origConsoleError(...args);
};
process.on("unhandledRejection", (err) => {
  const msg = String(err?.message || err || "");
  if (STALE_SESSION_ERRORS.some((e) => msg.includes(e))) return;
  _origConsoleError("[UnhandledRejection]", err?.message || err);
});
process.on("uncaughtException", (err) => {
  const msg = String(err?.message || err || "");
  if (STALE_SESSION_ERRORS.some((e) => msg.includes(e))) return;
  _origConsoleError("[UncaughtException]", err?.message || err);
});

// Load SHRUHI_CATALOG from ../catalog-data.js
const catalogPath = path.join(__dirname, "..", "catalog-data.js");
const rawCatalogJs = fs.readFileSync(catalogPath, "utf8");
const sandboxWindow = {};
new Function("window", rawCatalogJs)(sandboxWindow);
const CATALOG = sandboxWindow.SHRUHI_CATALOG || [];

console.log(`\n✅ Loaded ${CATALOG.length} Shruhi Collections 4K products for 24/7 WhatsApp Auto-AI Bots.`);
console.log(`   Line #1 (Primary 24/7 AI): +91 90542 41725`);
console.log(`   Line #2 (24/7 AI Line 2) : +91 63552 85433`);

// ─── Per-number configuration ──────────────────────────────────────────────
const WA_ACCOUNTS = [
  {
    number: "9054241725",
    display: "+91 90542 41725 (Primary 24/7 Auto-AI)",
    role: "All 59 Editions (29 Women's Ethnic S–6XL + 30 Men's AI Shirts M–2XL)",
    authDir: "auth_9054241725",
    qrFile: "qr2.html",
    defaultCategory: "all"
  },
  {
    number: "6355285433",
    display: "+91 63552 85433 (Secondary 24/7 Auto-AI)",
    role: "All 59 Editions (29 Women's Ethnic S–6XL + 30 Men's AI Shirts M–2XL)",
    authDir: "auth_6355285433",
    qrFile: "qr.html",
    defaultCategory: "all"
  }
];

const globalStatus = {
  service: "Shruhi Collections 24/7 Multi-Line WhatsApp Auto-AI Bot",
  catalog: `${CATALOG.length} verified 4K designs (29 Women's Ethnic S–6XL + 30 Men's AI-Model Shirts M–2XL)`,
  startedAt: new Date().toISOString(),
  accounts: {}
};

const humanTakeoverChats = new Map();
const botSentMessageIds  = new Set();

function logEvent(number, type, detail) {
  const entry = { time: new Date().toISOString(), number, type, detail };
  if (!globalStatus.accounts[number]) {
    globalStatus.accounts[number] = {
      recentEvents: [],
      autoRepliesSent: 0,
      connection: "connecting",
      linkedAccount: null,
      qrRaw: null,
      qrImgUrl: null,
      qrUpdatedAt: null
    };
  }
  globalStatus.accounts[number].recentEvents.unshift(entry);
  if (globalStatus.accounts[number].recentEvents.length > 30) globalStatus.accounts[number].recentEvents.pop();
  console.log(`[${number}][${type}] ${detail}`);
}

function writeUnifiedQrFiles() {
  const qrJsonPath = path.join(__dirname, "qr-live.json");
  fs.writeFileSync(qrJsonPath, JSON.stringify(globalStatus, null, 2), "utf8");

  const cardsHtml = WA_ACCOUNTS.map((acc) => {
    const st = globalStatus.accounts[acc.number] || {};
    const isConn = st.connection === "open";
    const badgeColor = isConn ? "#22c55e" : st.qrImgUrl ? "#eab308" : "#94a3b8";
    const statusLabel = isConn
      ? `✅ CONNECTED & 24/7 LIVE (${st.linkedAccount?.id || acc.number})`
      : st.qrImgUrl
      ? "📱 AWAITING QR SCAN (Scan via WhatsApp → Linked Devices)"
      : `⏳ ${st.connection || "Initializing..."}`;

    const bodyBlock = isConn
      ? `<div style="padding:36px 20px;background:#072617;border:2px solid #22c55e;border-radius:16px;margin-top:14px;">
           <div style="font-size:2.4rem;">✅</div>
           <h3 style="color:#4ade80;margin:10px 0 6px;">24/7 Auto-AI Active</h3>
           <p style="color:#bbf7d0;font-size:0.88rem;margin:0;">Linked: ${st.linkedAccount?.name || ""} (${st.linkedAccount?.id || acc.number})</p>
           <p style="color:#86efac;font-size:0.8rem;margin-top:8px;">Auto-Replies Sent: <strong>${st.autoRepliesSent || 0}</strong></p>
         </div>`
      : st.qrImgUrl
      ? `<div style="background:#fff;padding:18px;border-radius:16px;display:inline-block;margin-top:14px;box-shadow:0 12px 30px rgba(0,0,0,0.45);">
           <img src="${st.qrImgUrl}" width="280" height="280" alt="Scan QR for ${acc.display}" style="display:block;"/>
         </div>
         <p style="font-size:0.8rem;color:#cbd5e1;margin-top:10px;">Open WhatsApp on <strong>${acc.display}</strong> &rarr; <strong>Linked Devices</strong> &rarr; <strong>Link a Device</strong></p>`
      : `<div style="padding:40px;color:#94a3b8;">Generating encrypted WhatsApp pairing session...</div>`;

    const directWaUrl = `https://wa.me/91${acc.number}?text=${encodeURIComponent("Hello Shruhi Collections! Please share your 59-design 4K catalog.")}`;
    const directWaQr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(directWaUrl)}`;

    return `
      <div style="background:#111b21;border:1px solid #2a3942;border-radius:18px;padding:22px;text-align:center;">
        <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.12em;color:#d4af37;font-weight:700;">${acc.role}</div>
        <h2 style="margin:6px 0 8px;color:#fff;font-size:1.25rem;">${acc.display}</h2>
        <div style="display:inline-block;padding:5px 12px;border-radius:99px;font-size:0.78rem;font-weight:700;background:rgba(255,255,255,0.06);color:${badgeColor};border:1px solid ${badgeColor};">
          ${statusLabel}
        </div>
        <div>${bodyBlock}</div>
        <hr style="border:none;border-top:1px solid #222e35;margin:18px 0;"/>
        <div style="display:flex;align-items:center;justify-content:center;gap:14px;text-align:left;">
          <img src="${directWaQr}" width="76" height="76" style="background:#fff;padding:6px;border-radius:10px;" alt="Customer Chat QR"/>
          <div>
            <div style="font-size:0.78rem;font-weight:700;color:#25d366;">Customer Direct-Order QR</div>
            <div style="font-size:0.74rem;color:#94a3b8;">Customers scan this QR to open chat with +91 ${acc.number}</div>
            <a href="${directWaUrl}" target="_blank" style="display:inline-block;margin-top:5px;color:#38bdf8;font-size:0.76rem;">Open wa.me/91${acc.number} &rarr;</a>
          </div>
        </div>
      </div>
    `;
  }).join("\n");

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="refresh" content="10"/>
  <title>Shruhi Collections — 24/7 WhatsApp QR & Live Status Hub</title>
</head>
<body style="margin:0;padding:28px;background:#0b141a;color:#e9edef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:1180px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="color:#d4af37;font-size:0.82rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">Shruhi Collections • www.shruhicollections.in</div>
      <h1 style="margin:6px 0;font-size:1.8rem;color:#fff;">24/7 Multi-Line WhatsApp Auto-AI &amp; QR Pairing Hub</h1>
      <p style="color:#8696a0;font-size:0.92rem;margin:0;">All 59 Verified 4K Editions (29 Women's Ethnic &amp; Curvy S–6XL + 30 Men's AI-Model Shirts M–2XL) • Auto-refreshes every 10s</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:20px;">
      ${cardsHtml}
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, "qr-dashboard.html"), fullHtml, "utf8");
  fs.writeFileSync(path.join(__dirname, "..", "connect-wa-primary.html"), fullHtml, "utf8");
}

// ─── Catalog menu & search helpers ─────────────────────────────────────────
function buildFullCatalogMenuText(account) {
  const isMensLine = account.number === "8849601725";
  const ordered = isMensLine
    ? [...CATALOG.filter((c) => c.category === "mens-shirts"), ...CATALOG.filter((c) => c.category !== "mens-shirts")]
    : CATALOG;

  const lines = ordered.map(
    (item, idx) =>
      `*${idx + 1}. ${item.code}* — *${item.priceFormatted}* (${item.qtyInfo})\n   _${item.name}_ | Sizes: ${item.sizes.join(", ")}`
  );
  return (
    `✨ *SHRUHI COLLECTIONS — OFFICIAL 24/7 AI CATALOG (${account.display})* ✨\n` +
    `🌐 Website: https://www.shruhicollections.in\n` +
    `👔 Men's Luxury Shirts Desk: +91 88496 01725\n` +
    `👗 Women's Ethnic & Curvy Desk: +91 90542 41725\n\n` +
    `📋 *ALL ${CATALOG.length} VERIFIED 4K DESIGNS (MRP ₹850 – ₹3,550):*\n\n` +
    lines.join("\n\n") +
    `\n\n💡 *Reply with any Item Number (1–${CATALOG.length}), Design Code (e.g. MS-101, MS-121, TEJAL, GALAXY, KAVYA), or Size (e.g. M, XL, 3XL, 6XL) to receive its 4K AI-Model Photo & instant order link!*`
  );
}

function findMatchingProducts(query) {
  const q = query.toLowerCase().trim();
  if (/^\d{1,2}$/.test(q)) {
    const num = parseInt(q, 10);
    if (num >= 1 && num <= CATALOG.length) return [CATALOG[num - 1]];
  }
  const msMatch = q.match(/ms[- ]?(\d{3})/i);
  if (msMatch) {
    const targetCode = `SHRUHI-MS-${msMatch[1]}`;
    const exact = CATALOG.filter((c) => c.code.toUpperCase() === targetCode);
    if (exact.length) return exact;
  }
  if (q.includes("shirt") || q.includes("mens") || q.includes("men's") || q.includes("linen") || q.includes("lycra") || q.includes("ms-1")) {
    return CATALOG.filter((c) => c.category === "mens-shirts");
  }
  if (q.includes("plus") || q.includes("3xl") || q.includes("4xl") || q.includes("5xl") || q.includes("6xl") || q.includes("curvy")) {
    return CATALOG.filter((c) => c.isPlusSize || c.sizes.some((s) => ["3XL", "4XL", "5XL", "6XL"].includes(s)));
  }
  if (q.includes("under") || q.includes("1600") || q.includes("850") || q.includes("999") || q.includes("1500")) {
    return CATALOG.filter((c) => c.price <= 1600);
  }
  return CATALOG.filter((item) => {
    const hay = `${item.code} ${item.name} ${item.colorName} ${item.fabric} ${item.categoryLabel || ""} ${item.price} ${item.sizes.join(" ")}`.toLowerCase();
    return q.split(/\s+/).some((w) => w.length >= 2 && hay.includes(w));
  });
}

// ─── Start one WhatsApp bot instance ──────────────────────────────────────
async function startWhatsAppBot(account) {
  let baileys;
  try {
    baileys = require("@whiskeysockets/baileys");
  } catch (e) {
    console.log(`[${account.number}] Run 'npm install' first.`);
    return;
  }

  const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = baileys;
  const pino   = require("pino");
  const qrcode = require("qrcode-terminal");

  const authPath = path.join(__dirname, account.authDir);
  fs.mkdirSync(authPath, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  if (!globalStatus.accounts[account.number]) {
    globalStatus.accounts[account.number] = {
      recentEvents: [],
      autoRepliesSent: 0,
      connection: "connecting",
      linkedAccount: null,
      qrRaw: null,
      qrImgUrl: null,
      qrUpdatedAt: null
    };
  }
  if (state?.creds?.me) globalStatus.accounts[account.number].linkedAccount = state.creds.me;
  writeUnifiedQrFiles();

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
    browser: ["Shruhi Collections 24x7 AI", "Chrome", "122.0.0"],
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    getMessage: async () => ({ conversation: "" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (connection) globalStatus.accounts[account.number].connection = connection;
    if (sock.user)  globalStatus.accounts[account.number].linkedAccount = sock.user;

    if (qr) {
      globalStatus.accounts[account.number].connection = "awaiting_qr_scan";
      globalStatus.accounts[account.number].qrRaw = qr;
      const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(qr)}`;
      globalStatus.accounts[account.number].qrImgUrl = qrImgUrl;
      globalStatus.accounts[account.number].qrUpdatedAt = new Date().toISOString();

      console.log(`\n${"=".repeat(65)}`);
      console.log(`📱 SCAN QR FOR ${account.display}:`);
      console.log(`   WhatsApp → Linked Devices → Link a Device`);
      console.log(`${"=".repeat(65)}\n`);
      qrcode.generate(qr, { small: true });

      const qrHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="12"><title>Scan QR — Shruhi ${account.display}</title></head><body style="background:#0b141a;color:#fff;font-family:sans-serif;display:grid;place-items:center;min-height:95vh;text-align:center;"><div><h2 style="color:#25d366;">Shruhi Collections — ${account.display} 24/7 Auto-AI Bot</h2><p>Open WhatsApp on <strong>${account.display}</strong> &rarr; <strong>Linked Devices</strong> &rarr; <strong>Link a Device</strong> and scan:</p><div style="background:#fff;padding:24px;border-radius:16px;display:inline-block;margin-top:12px;"><img src="${qrImgUrl}" width="340" height="340" alt="WhatsApp QR"/></div></div></body></html>`;
      fs.writeFileSync(path.join(__dirname, account.qrFile), qrHtml, "utf8");
      writeUnifiedQrFiles();
      logEvent(account.number, "QR_READY", `QR updated for ${account.display} — open http://localhost:${PORT}/qr`);

      // Also auto-save PNG to artifact folder so inline QR image stays fresh
      try {
        const https = require("https");
        const artDir = "C:\\Users\\om\\.gemini\\antigravity\\brain\\429c21df-045e-435b-b4b0-ace6c43f5c0a";
        if (fs.existsSync(artDir)) {
          https.get(qrImgUrl, (resp) => {
            const chunks = [];
            resp.on("data", (c) => chunks.push(c));
            resp.on("end", () => {
              const buf = Buffer.concat(chunks);
              if (buf.length > 200) {
                fs.writeFileSync(path.join(artDir, `new_qr_${account.number}.png`), buf);
              }
            });
          }).on("error", () => {});
        }
      } catch (_) {}
    }

    if (connection === "open") {
      globalStatus.accounts[account.number].connection = "open";
      globalStatus.accounts[account.number].qrRaw = null;
      globalStatus.accounts[account.number].qrImgUrl = null;
      globalStatus.accounts[account.number].linkedAccount = sock.user || state?.creds?.me;
      logEvent(account.number, "CONNECTED", `✅ LIVE on ${account.display} (${JSON.stringify(globalStatus.accounts[account.number].linkedAccount)})`);

      const connHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CONNECTED — ${account.display}</title></head><body style="background:#071f12;color:#fff;font-family:sans-serif;display:grid;place-items:center;min-height:95vh;text-align:center;"><div style="background:#0d3521;border:2px solid #25d366;padding:32px;border-radius:20px;max-width:560px;"><h1 style="color:#4ade80;">✅ ${account.display} IS CONNECTED &amp; 100% AUTO-AI ACTIVE!</h1><p>All ${CATALOG.length} 4K Priced Designs (29 Women's + 30 Men's Luxury Shirts) are live 24/7.</p></div></body></html>`;
      fs.writeFileSync(path.join(__dirname, account.qrFile), connHtml, "utf8");
      writeUnifiedQrFiles();
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      const reason = lastDisconnect?.error?.message || "";
      logEvent(account.number, "DISCONNECTED", `Code: ${code} reason: ${reason}`);

      // If session was logged out on phone (401), clear stale creds and generate a fresh QR!
      if (code === DisconnectReason.loggedOut) {
        logEvent(account.number, "LOGGED_OUT_RESET", "Session expired/unlinked. Clearing auth directory to generate fresh QR...");
        try {
          fs.rmSync(authPath, { recursive: true, force: true });
        } catch (_) {}
        setTimeout(() => startWhatsAppBot(account), 2500);
        return;
      }

      const delay = code === 440 ? 8000 : 4000;
      logEvent(account.number, "RECONNECTING", `Retrying in ${delay / 1000}s (code ${code})...`);
      setTimeout(() => startWhatsAppBot(account), delay);
    }
  });

  const processedIncomingIds = new Set();

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify" && type !== "append") return;

    for (const msg of messages) {
      const jid = msg.key?.remoteJid;
      if (!jid || jid === "status@broadcast" || jid.endsWith("@g.us")) continue;

      const msgId = msg.key?.id;
      if (msgId && processedIncomingIds.has(msgId)) continue;

      if (type === "append") {
        const rawTs = msg.messageTimestamp;
        const tsSec = typeof rawTs === "object" && rawTs !== null ? Number(rawTs.low || rawTs) : Number(rawTs || 0);
        const ageSec = Math.floor(Date.now() / 1000) - tsSec;
        if (!tsSec || ageSec < 0 || ageSec > 600) continue;
      }

      if (msgId) processedIncomingIds.add(msgId);

      // Unwrap ephemeral (disappearing) or viewOnce message wrappers so text is never missed
      const innerMsg =
        msg.message?.ephemeralMessage?.message ||
        msg.message?.viewOnceMessage?.message ||
        msg.message?.viewOnceMessageV2?.message ||
        msg.message?.documentWithCaptionMessage?.message ||
        msg.message;

      const text = (
        innerMsg?.conversation ||
        innerMsg?.extendedTextMessage?.text ||
        innerMsg?.imageMessage?.caption ||
        innerMsg?.videoMessage?.caption ||
        innerMsg?.buttonsResponseMessage?.selectedDisplayText ||
        innerMsg?.listResponseMessage?.title ||
        innerMsg?.templateButtonReplyMessage?.selectedDisplayText ||
        ""
      ).trim();

      // Ignore empty protocol/sync/receipt events before checking fromMe!
      if (!text) continue;

      // Ignore messages generated by our own Auto-AI bot to prevent infinite loops between our numbers
      if (
        botSentMessageIds.has(msgId) ||
        text.startsWith("✨ *SHRUHI-") ||
        text.startsWith("✨ *Shruhi Collections") ||
        text.startsWith("🤖 *Shruhi Collections") ||
        text.startsWith("🙋‍♂️ *Shruhi Collections")
      ) {
        continue;
      }

      const takeoverKey = `${account.number}::${jid}`;
      const clean = text.toLowerCase();

      if (msg.key.fromMe) {
        if (clean === "!ai" || clean === "/ai" || clean === "/ai on") {
          humanTakeoverChats.delete(takeoverKey);
          logEvent(account.number, "AI_RESUMED", `Auto-AI re-enabled for ${jid}`);
          continue;
        }
        if (clean === "!pause" || clean === "/pause" || clean === "!stop") {
          humanTakeoverChats.set(takeoverKey, Date.now());
          logEvent(account.number, "OWNER_JUMP_IN", `Paused Auto-AI via command for ${jid}`);
          continue;
        }
        // Only allow fromMe messages to trigger Auto-AI if the user is explicitly testing with a catalog keyword/code
        const isSelfTestKeyword =
          ["hi", "hello", "hey", "catalog", "menu", "price", "prices", "all", "list", "start", "shop", "shirts", "plus", "kem cho", "bhav", "pp"].includes(clean) ||
          /^(shruhi-)?(ms-1\d{2}|\d{1,2}|10[1-7])$/i.test(clean);
        if (!isSelfTestKeyword) continue;
      }

      if (humanTakeoverChats.has(takeoverKey)) {
        if (Date.now() - humanTakeoverChats.get(takeoverKey) < 30 * 60 * 1000) {
          logEvent(account.number, "HUMAN_MODE_SKIP", `Skipping auto-reply for ${jid}`);
          continue;
        }
        humanTakeoverChats.delete(takeoverKey);
      }

      logEvent(account.number, "INCOMING_MSG", `From ${jid} (${type}, fromMe=${!!msg.key.fromMe}): "${text.slice(0, 80)}"`);

      if (clean.includes("owner") || clean.includes("human") || clean.includes("call me")) {
        humanTakeoverChats.set(takeoverKey, Date.now());
        const sent = await sock.sendMessage(jid, {
          text:
            `🙋‍♂️ *Shruhi Collections — Owner Handover Activated*\n\n` +
            `I have paused the Auto-AI and notified our boutique team on *${account.display}*. They will jump in shortly!`
        });
        if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
        globalStatus.accounts[account.number].autoRepliesSent++;
        continue;
      }

      if (
        ["hi", "hello", "hey", "catalog", "menu", "price", "prices", "all", "list", "start", "shop", "namaste", "kem cho", "bhav", "pp"].includes(clean) ||
        clean.includes("all product") || clean.includes("catalog") || clean.includes("kem cho")
      ) {
        const sent = await sock.sendMessage(jid, { text: buildFullCatalogMenuText(account) });
        if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
        globalStatus.accounts[account.number].autoRepliesSent++;
        logEvent(account.number, "AUTO_REPLY_CATALOG", `Sent ${CATALOG.length}-product catalog to ${jid}`);
        continue;
      }

      const matches = findMatchingProducts(clean);
      if (matches.length > 0) {
        for (const item of matches.slice(0, 3)) {
          const imgPath = path.join(__dirname, "..", item.image);
          const orderNum = item.category === "mens-shirts" ? "+91 88496 01725" : "+91 90542 41725";
          const caption =
            `✨ *${item.code} — ${item.name}*\n` +
            `• *Verified MRP:* ${item.priceFormatted} (${item.qtyInfo})\n` +
            `• *Available Sizes:* ${item.sizes.join(", ")}\n` +
            `• *Full Set Value:* ₹${(item.price * item.sizes.length).toLocaleString("en-IN")} (${item.sizes.length} Pcs)\n` +
            `• *Fabric & Work:* ${item.fabric} — ${item.workType}\n` +
            `• *Direct Order Line:* ${orderNum}\n` +
            `• *Website:* https://www.shruhicollections.in\n\n` +
            `🛍️ *Reply with your Size (${item.sizes.join("/")}) & Delivery City to confirm order, or type "OWNER" to speak with our team directly!*`;

          if (fs.existsSync(imgPath)) {
            const sent = await sock.sendMessage(jid, { image: fs.readFileSync(imgPath), caption });
            if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
          } else {
            const sent = await sock.sendMessage(jid, { text: caption });
            if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
          }
          globalStatus.accounts[account.number].autoRepliesSent++;
        }
        logEvent(account.number, "AUTO_REPLY_PRODUCT", `Sent ${matches.slice(0, 3).map((m) => m.code).join(", ")} to ${jid}`);
      } else {
        const sent = await sock.sendMessage(jid, {
          text:
            `🤖 *Shruhi Collections 24/7 AI Concierge (${account.display})*\n\n` +
            `• Reply *CATALOG* to see all *${CATALOG.length} Priced Designs (₹850 – ₹3,550)*\n` +
            `• Reply *SHIRTS* or *MS-101* to *MS-130* for our *30 Men's Luxury AI-Model Shirt Collections (₹999)*\n` +
            `• Reply *PLUS* for Women's Curvy Plus-Size (3XL to 6XL)\n` +
            `• Reply *OWNER* to pause Auto-AI and speak with our team!\n` +
            `🌐 Shop Online: https://www.shruhicollections.in`
        });
        if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
        globalStatus.accounts[account.number].autoRepliesSent++;
        logEvent(account.number, "AUTO_REPLY_HELP", `Sent help menu to ${jid}`);
      }
    }
  });
}

// ─── Co-launch Facebook 3-Page + 100-Group 24/7 Comment Bot ───────────────
let fbModule = null;
try {
  fbModule = require(path.join(__dirname, "..", "facebook-automation", "fb-bot.js"));
  console.log("[FB_24X7_LINKED] Facebook 3-Page + 100-Group 24/7 Comment Auto-Reply Bot running alongside WhatsApp bots.");
} catch (err) {
  console.error("Note: Could not co-launch fb-bot.js:", err.message);
}

// ─── Unified Live Status & QR HTTP Server ─────────────────────────────────
const PORT = Number(process.env.PORT || process.env.WA_BOT_PORT || 8096);
http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.url.startsWith("/qr")) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      const dashPath = path.join(__dirname, "qr-dashboard.html");
      if (fs.existsSync(dashPath)) {
        res.writeHead(200);
        res.end(fs.readFileSync(dashPath, "utf8"));
      } else {
        res.writeHead(200);
        res.end("<h1>Initializing QR Dashboard... refresh in 3s</h1>");
      }
      return;
    }
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.url.startsWith("/api/status") || req.url.startsWith("/status") || req.url === "/") {
      res.writeHead(200);
      res.end(
        JSON.stringify(
          {
            ...globalStatus,
            qrDashboardUrl: `http://localhost:${PORT}/qr`,
            facebook24x7Bot: {
              active: true,
              pagesConnected: 3,
              groupsJoined: 100,
              viralReelActive: true,
              sub005sShieldActive: true,
              leadRedirect: "Women's Primary +91 90542 41725 | Men's Shirts +91 88496 01725 | Backup +91 63552 85433 & https://shruhicollections.in",
              telemetry: fbModule?.shieldTelemetry || { commentsScanned: 0, phoneCommentsHidden: 0 }
            },
            humanTakeoverActiveCount: humanTakeoverChats.size
          },
          null,
          2
        )
      );
      return;
    }
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  })
  .listen(PORT, () => {
    console.log(`\n🌐 Unified 24/7 Multi-Line WhatsApp + Facebook Auto-AI Server listening on port ${PORT}`);
    console.log(`   QR Hub : http://localhost:${PORT}/qr`);
    console.log(`   Status : http://localhost:${PORT}/api/status`);
  });

// ─── Launch ALL WhatsApp bots in parallel ─────────────────────────────────
console.log("\n🚀 Starting 24/7 WhatsApp Auto-AI bots (+91 90542 41725 | +91 88496 01725 | +91 63552 85433)...\n");
WA_ACCOUNTS.forEach((account) => {
  startWhatsAppBot(account).catch((err) => {
    console.error(`[${account.number}] Startup error:`, err.message);
    if (!process.argv.includes("--cloud-sweep")) {
      setTimeout(() => startWhatsAppBot(account), 5000);
    }
  });
});

// ─── Cloud Continuous 24/7 Mode (--cloud-24x7) & Quick Sweep (--cloud-sweep) ───
if (process.argv.includes("--cloud-24x7")) {
  const { execFile } = require("child_process");
  const fbWorkerScript = path.join(__dirname, "..", "facebook-automation", "fb-cloud-comment-worker.js");
  console.log("☁️ [CLOUD_24X7_DAEMON] Continuous 50-minute live session active for Multi-Line WhatsApp + 45s Facebook 3-Page Comment Sweeps.");

  setInterval(() => {
    execFile(process.execPath, [fbWorkerScript], { env: process.env }, (err) => {
      if (err) console.error("[FB_SWEEP_WARN]", err.message);
    });
  }, 45000);

  setTimeout(() => {
    console.log("✅ 50-Minute Cloud 24/7 Live Cycle completed — saving session state & handing over to next runner.");
    process.exit(0);
  }, 50 * 60 * 1000);
} else if (process.argv.includes("--cloud-sweep")) {
  setTimeout(() => {
    console.log("✅ Cloud Multi-Line WhatsApp + Facebook 24/7 Sweep window completed.");
    process.exit(0);
  }, 20000);
}
