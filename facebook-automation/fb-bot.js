/**
 * SHRUHI COLLECTIONS — 100% AUTO-AI FACEBOOK PAGE, COMMENT & MESSENGER BOT
 * ============================================================================
 * Official Domain: https://shruhicollections.in
 * Official WhatsApp & 24/7 AI Line: +91 63552 85433
 *
 * What this server automates 100%:
 * 1. AUTO-POSTS ALL 29 4K PRICED PRODUCTS (plus the Pinned 9-Grid Lookbook)
 *    to the Shruhi Collections Facebook Page with 4K images, verified MRP
 *    (₹850 – ₹3,550), sizes (S to 6XL), and direct WhatsApp checkout links.
 * 2. 100% AUTO-COMMENT REPLY + PRIVATE MESSENGER DM:
 *    Whenever any user comments "PP", "Price?", "3XL?", "Details", or a design
 *    code on a Facebook Page post, the bot automatically replies to the comment
 *    AND sends them a private DM with the exact MRP, sizes, and order link.
 * 3. 100% AUTO-AI FACEBOOK MESSENGER BOT ("UNTIL I JUMP IN"):
 *    Answers all incoming Facebook Page Messenger messages 24/7 with all 29
 *    products listed, 4K photos, and prices — and AUTOMATICALLY PAUSES AI for
 *    that customer the moment YOU reply manually from Facebook Page Inbox /
 *    Meta Business Suite (`message.is_echo === true` not sent by bot).
 *    Send `!ai` in that chat anytime to resume 100% Auto-AI.
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

// Load all 29 Shruhi Collections products from ../catalog-data.js
const catalogPath = path.join(__dirname, "..", "catalog-data.js");
const rawCatalogJs = fs.readFileSync(catalogPath, "utf8");
const sandboxWindow = {};
new Function("window", rawCatalogJs)(sandboxWindow);
const CATALOG = sandboxWindow.SHRUHI_CATALOG || [];

// Load optional config from fb-config.json or environment variables
const configPath = path.join(__dirname, "fb-config.json");
let fbConfig = {
  PAGE_ID: process.env.FB_PAGE_ID || "",
  PAGE_ACCESS_TOKEN: process.env.FB_PAGE_ACCESS_TOKEN || "",
  VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN || "shruhi_collections_verify_2026",
  PORT: Number(process.env.FB_BOT_PORT || 8095),
  PUBLIC_SITE_URL: "https://shruhicollections.in",
  WHATSAPP_NUMBER: "916355285433",
  WHATSAPP_DISPLAY: "+91 63552 85433"
};
if (fs.existsSync(configPath)) {
  try {
    fbConfig = { ...fbConfig, ...JSON.parse(fs.readFileSync(configPath, "utf8")) };
  } catch (_) {}
}

// Track Messenger chats where the human owner has jumped in (senderPsid -> timestamp)
const humanTakeoverPsids = new Map();
// Track message mids sent by the AI bot so we can distinguish owner manual replies (`is_echo`) from bot replies
const botSentMids = new Set();

function buildProductCaption(item) {
  const waLink = `https://wa.me/916355285433?text=${encodeURIComponent(
    `Hello Shruhi Collections! I saw *${item.code}* (${item.priceFormatted}) on your Facebook Page and want to order.`
  )}`;
  return (
    `✨ NEW ARRIVAL AT SHRUHI COLLECTIONS — ${item.code} ✨\n\n` +
    `• Outfit: ${item.name}\n` +
    `• Verified Boutique MRP: ${item.priceFormatted} (${item.qtyInfo})\n` +
    `• Available Sizes: ${item.sizes.join(", ")}\n` +
    `• Full Set Value: ₹${(item.price * item.sizes.length).toLocaleString("en-IN")} (${item.sizes.length} Pcs)\n` +
    `• Fabric & Craft: ${item.fabric} — ${item.workType}\n\n` +
    `${item.description}\n\n` +
    `💬 Instant WhatsApp & 24/7 AI Order (+91 63552 85433):\n${waLink}\n\n` +
    `🌐 Shop All 29 Designs Online: https://shruhicollections.in\n` +
    `📍 Flagship Showroom: 214/215, Prime Arcade, Anand Mahal Road, Adajan, Surat – 395009, Gujarat\n\n` +
    `#ShruhiCollections #${item.code.replace(/[^A-Za-z0-9]/g, "")} #SuratBoutique #EthnicWearIndia #PlusSizeCouture #DesignerSuits`
  );
}

function buildMasterCatalogMenu() {
  const rows = CATALOG.map(
    (item, i) => `${i + 1}. ${item.code} — ${item.priceFormatted} | Sizes: ${item.sizes.join(", ")}`
  );
  return (
    `✨ SHRUHI COLLECTIONS — ALL ${CATALOG.length} PRICED DESIGNS (S to 6XL) ✨\n` +
    `🌐 Shop Online: https://shruhicollections.in\n` +
    `💬 WhatsApp 24/7 AI: https://wa.me/916355285433\n\n` +
    rows.join("\n") +
    `\n\nReply with any Design Code (e.g. TEJAL, GALAXY, KAVYA, 1042, B-2876), Item Number (1–${CATALOG.length}), or Size (S to 6XL) for its 4K Photo & Instant Order Link!`
  );
}

function findMatchingProducts(query) {
  const q = (query || "").toLowerCase().trim();
  if (!q) return [];

  if (/^\d{1,2}$/.test(q)) {
    const n = parseInt(q, 10);
    if (n >= 1 && n <= CATALOG.length) return [CATALOG[n - 1]];
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

function generateAiReply(text) {
  const clean = (text || "").trim().toLowerCase();

  if (clean.includes("owner") || clean.includes("human") || clean.includes("call")) {
    return {
      pauseAi: true,
      text:
        `🙋‍♂️ Shruhi Collections — Owner Handover Activated!\n\n` +
        `I have paused the Auto-AI assistant so our boutique owner can reply to you personally here or on WhatsApp +91 63552 85433 (https://wa.me/916355285433).`,
      items: []
    };
  }

  if (
    ["hi", "hello", "hey", "catalog", "menu", "all", "list", "shop"].includes(clean) ||
    clean.includes("all product")
  ) {
    return {
      pauseAi: false,
      text: buildMasterCatalogMenu(),
      items: CATALOG.slice(0, 3)
    };
  }

  const matches = findMatchingProducts(clean);
  if (matches.length > 0) {
    const top = matches.slice(0, 3);
    const details = top
      .map(
        (item) =>
          `✨ ${item.code} — ${item.name}\n` +
          `• MRP: ${item.priceFormatted} (${item.qtyInfo})\n` +
          `• Available Sizes: ${item.sizes.join(", ")}\n` +
          `• Full Set (${item.sizes.length} Pcs): ₹${(item.price * item.sizes.length).toLocaleString("en-IN")}\n` +
          `• Order on WhatsApp: https://wa.me/916355285433?text=${encodeURIComponent(
            `Hello Shruhi Collections! I want to order ${item.code} (${item.priceFormatted}).`
          )}`
      )
      .join("\n\n");
    return {
      pauseAi: false,
      text:
        `Here are the verified Shruhi Collections details:\n\n${details}\n\n` +
        `🌐 Full 4K Catalog: https://shruhicollections.in\n` +
        `(Reply with your Size & City to order, or type OWNER for personal assistance!)`,
      items: top
    };
  }

  // Default helpful response for "PP", "Price?", "Cost", etc.
  return {
    pauseAi: false,
    text:
      `Namaste from Shruhi Collections, Surat! ✨\n\n` +
      `• All 29 Designer Suits, Co-ord Sets & Plus-Size Outfits (Sizes S to 6XL) are priced from MRP ₹850 to ₹3,550.\n` +
      `• Browse all 29 4K outfits with prices: https://shruhicollections.in\n` +
      `• Direct WhatsApp & 24/7 AI Catalog: https://wa.me/916355285433 (+91 63552 85433)\n\n` +
      `Reply with any Design Code (TEJAL, GALAXY, KAVYA, 1042, B-2876), Size (S to 6XL), or type CATALOG to see all 29 prices right here!`,
    items: [CATALOG[3], CATALOG[20], CATALOG[28]].filter(Boolean)
  };
}

// Helper to call Facebook Graph API v19.0
function callGraphApi(endpoint, method, payload) {
  return new Promise((resolve, reject) => {
    if (!fbConfig.PAGE_ACCESS_TOKEN) {
      return resolve({ simulated: true, endpoint, payload });
    }
    const bodyStr = JSON.stringify({ ...payload, access_token: fbConfig.PAGE_ACCESS_TOKEN });
    const req = https.request(
      {
        hostname: "graph.facebook.com",
        path: `/v19.0/${endpoint}`,
        method,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(bodyStr)
        }
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (_) {
            resolve({ raw: data });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

// Auto-publish all 29 4K products + Pinned 9-Grid Lookbook to the Facebook Page
async function publishAll29ProductsToFacebookPage() {
  console.log(`\n🚀 Starting Facebook Page Auto-Publisher for all ${CATALOG.length} Shruhi Collections 4K products...`);
  const results = [];

  // 1. Pinned 9-Grid Lookbook Post
  const pinnedImgUrl = `${fbConfig.PUBLIC_SITE_URL}/assets/social/shruhi-fb-pinned-catalog-post-option2.jpg`;
  const pinnedCaption =
    `✨ WELCOME TO SHRUHI COLLECTIONS — OFFICIAL 2026 4K LOOKBOOK ✨\n\n` +
    `Explore our complete collection of 29+ Designer 3-Piece Suits, Luxury Co-ord Sets, and Curvy Plus-Size Couture tailored from Size S to 6XL (MRP ₹850 – ₹3,550)!\n\n` +
    `🛍️ Shop Live Website: https://shruhicollections.in\n` +
    `💬 Official WhatsApp & 24/7 Auto-AI Line: https://wa.me/916355285433 (+91 63552 85433)\n` +
    `📍 Flagship Showroom: 214/215, Prime Arcade, Anand Mahal Road, Adajan, Surat – 395009`;

  const pinnedRes = await callGraphApi(`${fbConfig.PAGE_ID || "me"}/photos`, "POST", {
    url: pinnedImgUrl,
    caption: pinnedCaption,
    published: true
  });
  results.push({ code: "PINNED_9_GRID_LOOKBOOK", imageUrl: pinnedImgUrl, result: pinnedRes });
  console.log(`✓ Prepared/Published Pinned 9-Grid Lookbook Post`);

  // 2. All 29 Priced 4K Products
  for (let i = 0; i < CATALOG.length; i++) {
    const item = CATALOG[i];
    const imageUrl = `${fbConfig.PUBLIC_SITE_URL}/${item.image}`;
    const caption = buildProductCaption(item);
    const res = await callGraphApi(`${fbConfig.PAGE_ID || "me"}/photos`, "POST", {
      url: imageUrl,
      caption,
      published: true
    });
    results.push({ index: i + 1, code: item.code, price: item.priceFormatted, sizes: item.sizes, imageUrl, result: res });
    console.log(`✓ [${i + 1}/${CATALOG.length}] ${item.code} (${item.priceFormatted} • ${item.sizes.join(", ")})`);
  }

  const outFile = path.join(__dirname, "published-29-fb-posts-manifest.json");
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2), "utf8");
  console.log(`\n✅ Saved complete 30-post Facebook Page publish manifest to: ${outFile}\n`);
  return results;
}

if (process.argv.includes("--post-all")) {
  publishAll29ProductsToFacebookPage().then(() => process.exit(0));
} else {
  // Start 24/7 Webhook & Local API Server for Facebook Comments, Messenger Auto-AI, and Dashboard
  const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    const urlObj = new URL(req.url, `http://localhost:${fbConfig.PORT}`);

    // 1. Meta Webhook Verification (GET /webhook)
    if (req.method === "GET" && urlObj.pathname === "/webhook") {
      const mode = urlObj.searchParams.get("hub.mode");
      const token = urlObj.searchParams.get("hub.verify_token");
      const challenge = urlObj.searchParams.get("hub.challenge");
      if (mode === "subscribe" && token === fbConfig.VERIFY_TOKEN) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end(challenge);
      }
      res.writeHead(403);
      return res.end("Forbidden");
    }

    // 2. Meta Webhook Event Receiver (POST /webhook) — Comments & Messenger DMs
    if (req.method === "POST" && urlObj.pathname === "/webhook") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", async () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ received: true }));

        try {
          const payload = JSON.parse(body);
          for (const entry of payload.entry || []) {
            // A. Handle Facebook Messenger Events (+ Automatic "Until I Jump In" Owner Detection)
            for (const messagingEvent of entry.messaging || []) {
              const senderId = messagingEvent.sender?.id;
              const recipientId = messagingEvent.recipient?.id;
              const msg = messagingEvent.message;
              if (!msg) continue;

              // Detect when the human owner replies from Facebook Page Inbox / Business Suite (`is_echo === true`)
              if (msg.is_echo) {
                if (botSentMids.has(msg.mid)) continue;
                const txt = (msg.text || "").trim().toLowerCase();
                if (txt === "!ai" || txt === "/ai") {
                  humanTakeoverPsids.delete(recipientId);
                  console.log(`[FB MESSENGER AI RESUMED] Re-enabled Auto-AI for customer ${recipientId}`);
                } else {
                  humanTakeoverPsids.set(recipientId, Date.now());
                  console.log(`[FB OWNER JUMPED IN] Paused Messenger Auto-AI for customer ${recipientId}`);
                }
                continue;
              }

              // Skip Auto-AI if owner has jumped in for this customer
              if (humanTakeoverPsids.has(senderId)) {
                console.log(`[FB HUMAN MODE] Skipping Auto-AI for ${senderId} (Owner is chatting)`);
                continue;
              }

              const reply = generateAiReply(msg.text || "");
              if (reply.pauseAi) {
                humanTakeoverPsids.set(senderId, Date.now());
              }

              const sent = await callGraphApi("me/messages", "POST", {
                recipient: { id: senderId },
                message: { text: reply.text }
              });
              if (sent?.message_id) botSentMids.add(sent.message_id);

              // Also send 4K product image attachment for top matched item
              if (reply.items && reply.items.length > 0) {
                const topItem = reply.items[0];
                const imgSent = await callGraphApi("me/messages", "POST", {
                  recipient: { id: senderId },
                  message: {
                    attachment: {
                      type: "image",
                      payload: {
                        url: `${fbConfig.PUBLIC_SITE_URL}/${topItem.image}`,
                        is_reusable: true
                      }
                    }
                  }
                });
                if (imgSent?.message_id) botSentMids.add(imgSent.message_id);
              }
            }

            // B. Handle Facebook Page Post Comments (Auto-Reply to Comment + Send Private DM!)
            for (const change of entry.changes || []) {
              if (change.field === "feed" && change.value?.item === "comment" && change.value?.verb === "add") {
                const commentId = change.value.comment_id;
                const commentText = change.value.message || "";
                const fromId = change.value.from?.id;

                // Don't reply to our own Page's comments
                if (fromId && fromId === fbConfig.PAGE_ID) continue;

                const reply = generateAiReply(commentText);
                const publicCommentReply =
                  `✨ Thank you for your interest in Shruhi Collections! ` +
                  (reply.items?.[0]
                    ? `${reply.items[0].code} (${reply.items[0].name}) is verified MRP ${reply.items[0].priceFormatted} in Sizes ${reply.items[0].sizes.join(", ")}. `
                    : `All 29 designs (Sizes S to 6XL, MRP ₹850 – ₹3,550) are live at https://shruhicollections.in. `) +
                  `We have also sent the 4K details to your Messenger & you can order 24/7 on WhatsApp +91 63552 85433 (https://wa.me/916355285433)!`;

                await callGraphApi(`${commentId}/comments`, "POST", { message: publicCommentReply });
                await callGraphApi("me/messages", "POST", {
                  recipient: { comment_id: commentId },
                  message: { text: reply.text }
                });
                console.log(`[FB COMMENT AUTO-REPLIED] Comment ${commentId}: "${commentText}"`);
              }
            }
          }
        } catch (err) {
          console.error("Webhook error:", err.message);
        }
      });
      return;
    }

    // 3. Local Status & Test Endpoint (GET /status, POST /simulate)
    if (req.method === "GET" && urlObj.pathname === "/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          status: "ONLINE",
          brand: "Shruhi Collections",
          domain: fbConfig.PUBLIC_SITE_URL,
          whatsapp: fbConfig.WHATSAPP_DISPLAY,
          totalProductsListed: CATALOG.length,
          activeHumanTakeoverChats: humanTakeoverPsids.size
        })
      );
    }

    if (req.method === "POST" && urlObj.pathname === "/simulate") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        const { text } = JSON.parse(body || "{}");
        const reply = generateAiReply(text || "");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(reply));
      });
      return;
    }

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Shruhi Collections 24/7 Facebook Auto-AI Server is LIVE on port " + fbConfig.PORT);
  });

  server.listen(fbConfig.PORT, () => {
    console.log(`\n========================================================================`);
    console.log(`📘 SHRUHI COLLECTIONS 24/7 FACEBOOK AUTO-AI SERVER IS LIVE (PORT ${fbConfig.PORT})`);
    console.log(`========================================================================`);
    console.log(`• All ${CATALOG.length} Priced 4K Products Loaded (MRP ₹850 – ₹3,550 | Sizes S to 6XL)`);
    console.log(`• Official Website: ${fbConfig.PUBLIC_SITE_URL}`);
    console.log(`• Official WhatsApp & AI Line: ${fbConfig.WHATSAPP_DISPLAY}`);
    console.log(`• Auto Comment Replier + Private Messenger DM: ACTIVE`);
    console.log(`• Messenger 100% Auto-AI ("Pauses Until Owner Jumps In"): ACTIVE\n`);
  });
}
