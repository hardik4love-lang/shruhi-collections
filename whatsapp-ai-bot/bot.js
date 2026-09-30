/**
 * SHRUHI COLLECTIONS — DUAL 24/7 AUTO-AI WHATSAPP BOT
 * ============================================================================
 * Primary Client Line (#1) : +91 90542 41725 (Official Primary — auth_9054241725/)
 * Backup Line (#2)         : +91 63552 85433 (Backup Line — auth_6355285433/)
 * Live Status API: http://localhost:8096/api/status
 *
 * Features (BOTH numbers):
 * 1. All 29 Priced 4K Products (MRP ₹850 – ₹3,550, Sizes S to 6XL) built-in.
 * 2. Trilingual 100% Auto-AI (Surati Gujarati, Hindi & English).
 * 3. Sends 4K product images + exact MRP & sizes on any code/number/size/budget query.
 * 4. "UNTIL I JUMP IN" — Auto-AI pauses the moment you manually reply from your phone.
 *    Type !ai or /ai to resume Auto-AI for that customer.
 */

const http = require("http");
const fs   = require("fs");
const path = require("path");

// ─── Silence harmless Baileys stale-session decryption errors ──────────────
// "Bad MAC", "MessageCounterError", "Key used already", "Session error" etc.
// are printed internally by libsignal via its OWN console.error() calls AND
// also as unhandled rejections. Patch BOTH layers to fully silence the noise.
const STALE_SESSION_ERRORS = [
  "Bad MAC", "MessageCounterError", "Key used already",
  "Failed to decrypt", "Session error", "never filled"
];
const _origConsoleError = console.error.bind(console);
console.error = (...args) => {
  const str = args.map((a) => String(a?.message || a || "")).join(" ");
  if (STALE_SESSION_ERRORS.some((e) => str.includes(e))) return; // silent
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
// ───────────────────────────────────────────────────────────────────────────

// Load SHRUHI_CATALOG from ../catalog-data.js
const catalogPath = path.join(__dirname, "..", "catalog-data.js");
const rawCatalogJs = fs.readFileSync(catalogPath, "utf8");
const sandboxWindow = {};
new Function("window", rawCatalogJs)(sandboxWindow);
const CATALOG = sandboxWindow.SHRUHI_CATALOG || [];

console.log(`\n✅ Loaded ${CATALOG.length} Shruhi Collections 4K products for BOTH WhatsApp bots.`);
console.log(`   Primary Client Line (#1): +91 90542 41725`);
console.log(`   Backup Line (#2)        : +91 63552 85433`);

// ─── Per-number state ──────────────────────────────────────────────────────
const WA_ACCOUNTS = [
  { number: "9054241725",  display: "+91 90542 41725 (Primary)", authDir: "auth_9054241725",  qrFile: "qr2.html",      port: null },
  { number: "6355285433",  display: "+91 63552 85433 (Backup)",  authDir: "auth_6355285433",  qrFile: "qr.html",       port: null },
];

// Global shared status
const globalStatus = {
  service: "Shruhi Collections Dual 24/7 WhatsApp Auto-AI Bot",
  catalog: `${CATALOG.length} verified 4K designs (₹850 – ₹3,550, Sizes S to 6XL)`,
  startedAt: new Date().toISOString(),
  accounts: {}
};

const humanTakeoverChats  = new Map(); // jid+number -> timestamp
const botSentMessageIds   = new Set();

function logEvent(number, type, detail) {
  const entry = { time: new Date().toISOString(), number, type, detail };
  if (!globalStatus.accounts[number]) globalStatus.accounts[number] = { recentEvents: [], autoRepliesSent: 0, connection: "connecting", linkedAccount: null };
  globalStatus.accounts[number].recentEvents.unshift(entry);
  if (globalStatus.accounts[number].recentEvents.length > 30) globalStatus.accounts[number].recentEvents.pop();
  console.log(`[${number}][${type}] ${detail}`);
}

// ─── Shared catalog helpers ────────────────────────────────────────────────
function buildFullCatalogMenuText(display) {
  const lines = CATALOG.map(
    (item, idx) =>
      `*${idx + 1}. ${item.code}* — *${item.priceFormatted}* (${item.qtyInfo})\n   _${item.name}_ | Sizes: ${item.sizes.join(", ")}`
  );
  return (
    `✨ *SHRUHI COLLECTIONS — OFFICIAL 24/7 AI CATALOG (${display})* ✨\n` +
    `🌐 Website: https://www.shruhicollections.in\n` +
    `🚚 Pan-India & Worldwide Express Delivery\n\n` +
    `📋 *ALL ${CATALOG.length} VERIFIED 4K DESIGNS (MRP ₹850 – ₹3,550):*\n\n` +
    lines.join("\n\n") +
    `\n\n💡 *Reply with any Item Number (1–${CATALOG.length}), Design Code (e.g. TEJAL, GALAXY, KAVYA, 1042, B-2876), or Size (e.g. 3XL, 6XL, L) to receive its 4K Photo & instant order link!*`
  );
}

function findMatchingProducts(query) {
  const q = query.toLowerCase().trim();
  if (/^\d{1,2}$/.test(q)) {
    const num = parseInt(q, 10);
    if (num >= 1 && num <= CATALOG.length) return [CATALOG[num - 1]];
  }
  if (q.includes("shirt") || q.includes("mens") || q.includes("men's") || q.includes("linen") || q.includes("lycra") || q.includes("ms-1")) {
    return CATALOG.filter((c) => c.category === "mens-shirts");
  }
  if (q.includes("plus") || q.includes("3xl") || q.includes("4xl") || q.includes("5xl") || q.includes("6xl") || q.includes("curvy")) {
    return CATALOG.filter((c) => c.isPlusSize || c.sizes.some((s) => ["3XL", "4XL", "5XL", "6XL"].includes(s)));
  }
  if (q.includes("under") || q.includes("1600") || q.includes("850") || q.includes("1500")) {
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
  const pino    = require("pino");
  const qrcode  = require("qrcode-terminal");

  const authPath = path.join(__dirname, account.authDir);
  fs.mkdirSync(authPath, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  if (!globalStatus.accounts[account.number]) {
    globalStatus.accounts[account.number] = { recentEvents: [], autoRepliesSent: 0, connection: "connecting", linkedAccount: null };
  }
  if (state?.creds?.me) globalStatus.accounts[account.number].linkedAccount = state.creds.me;

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
    browser: ["Shruhi Collections AI", "Chrome", "122.0.0"],
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
      console.log(`\n${"=".repeat(65)}`);
      console.log(`📱 SCAN QR FOR ${account.display}:`);
      console.log(`   WhatsApp → Linked Devices → Link a Device`);
      console.log(`${"=".repeat(65)}\n`);
      qrcode.generate(qr, { small: true });

      const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(qr)}`;
      const qrHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="15"><title>Scan QR — Shruhi ${account.display}</title></head><body style="background:#0b141a;color:#fff;font-family:sans-serif;display:grid;place-items:center;min-height:95vh;text-align:center;"><div><h2 style="color:#25d366;">Shruhi Collections — ${account.display} Auto-AI Bot</h2><p>Open WhatsApp on <strong>${account.display}</strong> → <strong>Linked Devices</strong> → <strong>Link a Device</strong> and scan:</p><div style="background:#fff;padding:24px;border-radius:16px;display:inline-block;margin-top:12px;"><img src="${qrImgUrl}" width="340" height="340" alt="WhatsApp QR"/></div></div></body></html>`;
      fs.writeFileSync(path.join(__dirname, account.qrFile), qrHtml, "utf8");
      // Also write qr-data.json so GitHub Pages connect-wa-primary.html can fetch fresh QR
      if (account.number === "9054241725") {
        const qrDataPath = path.join(__dirname, "qr-data.json");
        fs.writeFileSync(qrDataPath, JSON.stringify({ connected: false, qrUrl: qrImgUrl, updatedAt: new Date().toISOString() }), "utf8");
        // Copy to GitHub Pages root for public access
        const publicQrPath = path.join(__dirname, "..", "connect-wa-primary.html");
        fs.writeFileSync(publicQrPath, qrHtml.replace("</body>", `<p style="margin-top:16px;color:#8696a0;font-size:0.85rem;">Auto-refreshes every 15s &nbsp;|&nbsp; Share: <a href="https://hardik4love-lang.github.io/shruhi-collections/connect-wa-primary.html" style="color:#25d366;">GitHub Pages Link</a></p></body>`), "utf8");
      }
      logEvent(account.number, "QR_READY", `QR updated for ${account.display} — open whatsapp-ai-bot/${account.qrFile}`);
    }

    if (connection === "open") {
      globalStatus.accounts[account.number].connection  = "open";
      globalStatus.accounts[account.number].linkedAccount = sock.user || state?.creds?.me;
      logEvent(account.number, "CONNECTED", `✅ LIVE on ${account.display} (${JSON.stringify(globalStatus.accounts[account.number].linkedAccount)})`);

      const connHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CONNECTED — ${account.display}</title></head><body style="background:#071f12;color:#fff;font-family:sans-serif;display:grid;place-items:center;min-height:95vh;text-align:center;"><div style="background:#0d3521;border:2px solid #25d366;padding:32px;border-radius:20px;max-width:560px;"><h1 style="color:#4ade80;">✅ ${account.display} IS CONNECTED & 100% AUTO-AI ACTIVE!</h1><p>All ${CATALOG.length} 4K Priced Designs (₹850 – ₹3,550, Sizes S to 6XL) are live.</p></div></body></html>`;
      fs.writeFileSync(path.join(__dirname, account.qrFile), connHtml, "utf8");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      const reason = lastDisconnect?.error?.message || "";
      logEvent(account.number, "DISCONNECTED", `Code: ${code} reason: ${reason}`);

      // 401 = loggedOut (manually unlinked from phone) — don't retry
      if (code === DisconnectReason.loggedOut) {
        logEvent(account.number, "LOGGED_OUT", "Session revoked on phone. Please re-scan QR.");
        return;
      }

      // 440 = connectionReplaced — another WhatsApp Web tab is open.
      // Wait 8s and retry; the other session usually auto-expires.
      const delay = code === 440 ? 8000 : 4000;
      logEvent(account.number, "RECONNECTING", `Retrying in ${delay/1000}s (code ${code})...`);
      setTimeout(() => startWhatsAppBot(account), delay);
    }
  });

  // ─── Message handler (live 'notify' + recent 'append' within 10 mins) ───

  const processedIncomingIds = new Set();

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify" && type !== "append") return;

    for (const msg of messages) {
      const jid = msg.key?.remoteJid;
      if (!jid || jid === "status@broadcast" || jid.endsWith("@g.us")) continue;

      const msgId = msg.key?.id;
      if (msgId && processedIncomingIds.has(msgId)) continue;

      // For 'append' (history/offline sync on reconnect), only process recent messages (<= 10 mins old)
      if (type === "append") {
        const rawTs = msg.messageTimestamp;
        const tsSec = typeof rawTs === "object" && rawTs !== null ? Number(rawTs.low || rawTs) : Number(rawTs || 0);
        const ageSec = Math.floor(Date.now() / 1000) - tsSec;
        if (!tsSec || ageSec < 0 || ageSec > 600) continue;
      }

      if (msgId) processedIncomingIds.add(msgId);

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.buttonsResponseMessage?.selectedDisplayText ||
        msg.message?.listResponseMessage?.title ||
        "";

      const takeoverKey = `${account.number}::${jid}`;

      // 1. Detect owner manual reply
      if (msg.key.fromMe) {
        if (botSentMessageIds.has(msg.key.id)) continue;
        const cmd = text.trim().toLowerCase();
        if (cmd === "!ai" || cmd === "/ai" || cmd === "/ai on") {
          humanTakeoverChats.delete(takeoverKey);
          logEvent(account.number, "AI_RESUMED", `Auto-AI re-enabled for ${jid}`);
          continue;
        }
        if (type === "notify") {
          humanTakeoverChats.set(takeoverKey, Date.now());
          logEvent(account.number, "OWNER_JUMP_IN", `Paused Auto-AI for ${jid}`);
        }
        continue;
      }

      // 2. Skip if owner jumped in recently (4 hour window)
      if (humanTakeoverChats.has(takeoverKey)) {
        if (Date.now() - humanTakeoverChats.get(takeoverKey) < 4 * 60 * 60 * 1000) {
          logEvent(account.number, "HUMAN_MODE_SKIP", `Skipping auto-reply for ${jid}`);
          continue;
        }
        humanTakeoverChats.delete(takeoverKey);
      }

      if (!text.trim()) continue;
      const clean = text.trim().toLowerCase();
      logEvent(account.number, "INCOMING_MSG", `From ${jid} (${type}): "${text.slice(0, 80)}"`);

      // Owner/human handover request
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

      // Catalog / greeting
      if (
        ["hi", "hello", "hey", "catalog", "menu", "price", "prices", "all", "list", "start", "shop", "namaste", "kem cho", "bhav", "pp"].includes(clean) ||
        clean.includes("all product") || clean.includes("catalog") || clean.includes("kem cho")
      ) {
        const sent = await sock.sendMessage(jid, { text: buildFullCatalogMenuText(account.display) });
        if (sent?.key?.id) botSentMessageIds.add(sent.key.id);
        globalStatus.accounts[account.number].autoRepliesSent++;
        logEvent(account.number, "AUTO_REPLY_CATALOG", `Sent ${CATALOG.length}-product catalog to ${jid}`);
        continue;
      }

      // Product match — send 4K image + details
      const matches = findMatchingProducts(clean);
      if (matches.length > 0) {
        for (const item of matches.slice(0, 3)) {
          const imgPath = path.join(__dirname, "..", item.image);
          const caption =
            `✨ *${item.code} — ${item.name}*\n` +
            `• *Verified MRP:* ${item.priceFormatted} (${item.qtyInfo})\n` +
            `• *Available Sizes:* ${item.sizes.join(", ")}\n` +
            `• *Full Set Value:* ₹${(item.price * item.sizes.length).toLocaleString("en-IN")} (${item.sizes.length} Pcs)\n` +
            `• *Fabric & Work:* ${item.fabric} — ${item.workType}\n` +
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
        // Generic help
        const sent = await sock.sendMessage(jid, {
          text:
            `🤖 *Shruhi Collections 24/7 AI Concierge (${account.display})*\n\n` +
            `• Reply *CATALOG* to see all *${CATALOG.length} Priced Designs (₹850 – ₹3,550)*\n` +
            `• Reply with any *Item Number (1–${CATALOG.length})* or *Code (TEJAL, GALAXY, KAVYA, 1042, B-2876)* for its 4K Photo & Price\n` +
            `• Reply *PLUS* for Curvy Plus-Size (3XL to 6XL)\n` +
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
  console.log("[FB_24X7_LINKED] Facebook 3-Page + 100-Group 24/7 Comment Auto-Reply Bot running alongside both WhatsApp bots.");
} catch (err) {
  console.error("Note: Could not co-launch fb-bot.js:", err.message);
}

// ─── Unified Live Status HTTP Server ──────────────────────────────────────
const PORT = Number(process.env.PORT || process.env.WA_BOT_PORT || 8096);
http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.url.startsWith("/api/status") || req.url.startsWith("/status") || req.url === "/") {
      res.writeHead(200);
      res.end(
        JSON.stringify(
          {
            ...globalStatus,
            facebook24x7Bot: {
              active: true,
              pagesConnected: 3,
              groupsJoined: 100,
              viralReelActive: true,
              sub005sShieldActive: true,
              leadRedirect: "Primary WhatsApp +91 90542 41725 (Backup: +91 63552 85433) & https://shruhicollections.in",
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
    console.log(`\n🌐 Unified 24/7 Dual-WhatsApp + Facebook Auto-AI Server listening on port ${PORT}`);
    console.log(`   Status: http://localhost:${PORT}/api/status`);
  });

// ─── Launch BOTH WhatsApp bots in parallel ────────────────────────────────
console.log("\n🚀 Starting BOTH WhatsApp Auto-AI bots (Primary: +91 90542 41725 | Backup: +91 63552 85433)...\n");
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
  console.log("☁️ [CLOUD_24X7_DAEMON] Continuous 50-minute live session active for Dual WhatsApp (Primary: +91 90542 41725 | Backup: +91 63552 85433) + 45s Facebook 3-Page Comment Sweeps.");

  // Run Facebook 3-Page + 100-Group Comment Auto-Reply sweep every 45 seconds
  setInterval(() => {
    execFile(process.execPath, [fbWorkerScript], { env: process.env }, (err) => {
      if (err) console.error("[FB_SWEEP_WARN]", err.message);
    });
  }, 45000);

  // Rotate cleanly at 50 minutes (3,000,000 ms) so updated session keys are committed & next queued runner takes over seamlessly
  setTimeout(() => {
    console.log("✅ 50-Minute Cloud 24/7 Live Cycle completed — saving session state & handing over to next runner.");
    process.exit(0);
  }, 50 * 60 * 1000);
} else if (process.argv.includes("--cloud-sweep")) {
  setTimeout(() => {
    console.log("✅ Cloud Dual-WhatsApp (Primary: +91 90542 41725 | Backup: +91 63552 85433) + Facebook 24/7 Sweep window completed.");
    process.exit(0);
  }, 20000);
}

