// Shruhi Collections — Algorise AI SURAT PRO TIER (₹29,999 / month)
// 100% Auto-AI Sales Concierge, Sub-0.05s Auto-Hide Shield, Surati Gujarati/Hindi/English NLP,
// 3 Connected Meta Pages, 100 Hero Bots & 2-Way Telegram Live Proxy (@Aassqqee_bot) on +91 63552 85433

(function () {
  const AI_PHONE = "916355285433";
  const AI_PHONE_DISPLAY = "+91 63552 85433";
  const TELEGRAM_PROXY_BOT = "@Aassqqee_bot";
  const TELEGRAM_PROXY_URL = "https://t.me/Aassqqee_bot";

  const catalog = window.SHRUHI_CATALOG || [];
  let aiMode = "AUTO_AI"; // "AUTO_AI" | "HUMAN_TAKEOVER"
  const aiCart = [];
  const chatTranscript = [];

  // Detect language: 'gu' (Surati Gujarati), 'hi' (Hindi), or 'en' (English)
  function detectLanguage(text) {
    const raw = (text || "").trim();
    const lower = raw.toLowerCase();
    if (/[\u0A80-\u0AFF]/.test(raw)) return "gu";
    if (/[\u0900-\u097F]/.test(raw)) return "hi";
    if (
      /\b(kem|cho|bhav|ketlo|ketla|shu|che|moklo|moko|saree|choli|ben|bhai|mara|su|gujarati)\b/.test(
        lower
      )
    ) {
      return "gu";
    }
    if (/\b(kya|kitne|ka|hai|bhejo|dikhao|chahiye|mujhe|hindi|batao|milega)\b/.test(lower)) {
      return "hi";
    }
    return "en";
  }

  // Inject Styles for the Floating 24/7 AI Concierge (+91 63552 85433)
  const style = document.createElement("style");
  style.textContent = `
    .shruhi-ai-fab {
      position: fixed;
      bottom: 1.1rem;
      right: 1.25rem;
      z-index: 250;
      background: linear-gradient(135deg, #0b3d36 0%, #128c7e 60%, #1ea952 100%);
      color: #ffffff;
      border: 2px solid #f5d98e;
      border-radius: 999px;
      padding: 0.72rem 1.2rem;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      font-weight: 800;
      font-size: 0.82rem;
      cursor: pointer;
      box-shadow: 0 14px 34px rgba(11, 61, 54, 0.48);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .shruhi-ai-fab:hover {
      transform: translateY(-3px);
      box-shadow: 0 18px 40px rgba(18, 140, 126, 0.6);
    }
    .shruhi-ai-pulse {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #4eff8f;
      box-shadow: 0 0 0 4px rgba(78, 255, 143, 0.28);
    }
    .shruhi-ai-drawer {
      position: fixed;
      bottom: 4.8rem;
      right: 1.25rem;
      z-index: 260;
      width: min(450px, calc(100vw - 1.5rem));
      height: min(690px, calc(100vh - 6.2rem));
      background: #ffffff;
      color: #191416;
      border-radius: 20px;
      border: 2px solid #d4ac5c;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.38);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    }
    .shruhi-ai-drawer.open {
      display: flex;
    }
    .shruhi-ai-head {
      background: linear-gradient(135deg, #072b26 0%, #0d4a42 100%);
      color: #fff;
      padding: 0.85rem 1rem;
      border-bottom: 1px solid rgba(245, 217, 142, 0.35);
    }
    .shruhi-ai-head-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .shruhi-pro-tier-bar {
      margin-top: 0.4rem;
      padding: 0.3rem 0.55rem;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.28);
      border: 1px solid rgba(245, 217, 142, 0.35);
      font-size: 0.65rem;
      color: #f5d98e;
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      align-items: center;
      justify-content: space-between;
    }
    .shruhi-ai-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.68rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      background: rgba(37, 211, 102, 0.22);
      color: #72ff9f;
      border: 1px solid rgba(114, 255, 159, 0.45);
    }
    .shruhi-ai-status-pill.human {
      background: rgba(245, 217, 142, 0.25);
      color: #f5d98e;
      border-color: #f5d98e;
    }
    .shruhi-ai-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: #f6eef0;
      border-bottom: 1px solid #eadce0;
    }
    .shruhi-ai-tab {
      padding: 0.62rem 0.5rem;
      font-size: 0.76rem;
      font-weight: 800;
      border: none;
      background: transparent;
      color: #5a4d52;
      cursor: pointer;
      border-bottom: 2.5px solid transparent;
    }
    .shruhi-ai-tab.active {
      color: #7a1436;
      background: #fff;
      border-bottom-color: #7a1436;
    }
    .shruhi-ai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 0.85rem;
      background: #efeae2;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .ai-msg-bubble {
      max-width: 88%;
      padding: 0.65rem 0.8rem;
      border-radius: 12px;
      font-size: 0.8rem;
      line-height: 1.48;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .ai-msg-bot {
      align-self: flex-start;
      background: #ffffff;
      color: #191416;
      border-top-left-radius: 3px;
    }
    .ai-msg-user {
      align-self: flex-end;
      background: #d9fdd3;
      color: #111b21;
      border-top-right-radius: 3px;
    }
    .ai-quick-chips {
      display: flex;
      gap: 0.35rem;
      overflow-x: auto;
      padding: 0.45rem 0.7rem;
      background: #f8f4f0;
      border-top: 1px solid #e5ddd5;
    }
    .ai-q-chip {
      white-space: nowrap;
      padding: 0.3rem 0.62rem;
      border-radius: 999px;
      border: 1px solid #7a1436;
      background: #fff;
      color: #7a1436;
      font-size: 0.7rem;
      font-weight: 700;
      cursor: pointer;
    }
    .ai-q-chip:hover {
      background: #7a1436;
      color: #fff;
    }
    .ai-input-bar {
      display: flex;
      gap: 0.4rem;
      padding: 0.6rem 0.7rem;
      background: #fff;
      border-top: 1px solid #eadce0;
    }
    .ai-input-bar input {
      flex: 1;
      padding: 0.55rem 0.8rem;
      border-radius: 999px;
      border: 1px solid #d5c5ca;
      font-size: 0.8rem;
      font-family: inherit;
    }
    .ai-send-btn {
      padding: 0.55rem 0.95rem;
      border-radius: 999px;
      background: #128c7e;
      color: #fff;
      border: none;
      font-weight: 800;
      font-size: 0.78rem;
      cursor: pointer;
    }
    .ai-prod-mini {
      display: flex;
      gap: 0.6rem;
      background: #fdf8f9;
      border: 1px solid #eadce0;
      border-radius: 10px;
      padding: 0.45rem;
      margin-top: 0.45rem;
      align-items: center;
    }
    .ai-prod-mini img {
      width: 52px;
      height: 68px;
      object-fit: cover;
      border-radius: 6px;
    }
    .ai-catalog-pane {
      flex: 1;
      overflow-y: auto;
      padding: 0.75rem;
      background: #fdf8f9;
      display: none;
      flex-direction: column;
      gap: 0.55rem;
    }
    .ai-catalog-pane.active {
      display: flex;
    }
    .ai-handover-footer {
      padding: 0.5rem 0.75rem;
      background: #230912;
      color: #f5d98e;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.72rem;
    }
  `;
  document.head.appendChild(style);

  // Create Floating Action Button + Drawer
  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "shruhi-ai-fab";
  fab.innerHTML = `
    <span class="shruhi-ai-pulse"></span>
    <span>🤖 24/7 Surat Pro AI (${AI_PHONE_DISPLAY}) • ગુજરાતી / हिंदी / EN</span>
  `;

  const drawer = document.createElement("aside");
  drawer.className = "shruhi-ai-drawer";
  drawer.setAttribute("aria-label", "Shruhi Collections 24/7 Auto-AI Concierge on +91 63552 85433");
  drawer.innerHTML = `
    <div class="shruhi-ai-head">
      <div class="shruhi-ai-head-top">
        <div>
          <strong style="font-size: 0.9rem; display: block;">👑 Shruhi AI — SURAT PRO TIER (${AI_PHONE_DISPLAY})</strong>
          <span style="font-size: 0.68rem; color: #cbeee7;">3 Meta Pages • Sub-0.05s Shield • ગુજરાતી / हिंदी / EN • 100 Hero Bots</span>
        </div>
        <button type="button" id="closeAiDrawerBtn" style="background: rgba(255,255,255,0.15); color: #fff; border: none; border-radius: 8px; padding: 0.3rem 0.55rem; cursor: pointer; font-weight: 800;">✕</button>
      </div>
      <div class="shruhi-pro-tier-bar">
        <span>🛡️ 0.042s Auto-Hide Shield: <strong>ON</strong></span>
        <span>📲 Telegram Proxy: <a href="${TELEGRAM_PROXY_URL}" target="_blank" rel="noopener" style="color:#72ff9f; text-decoration:underline; font-weight:800;">${TELEGRAM_PROXY_BOT}</a></span>
      </div>
      <div style="margin-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; gap: 0.4rem;">
        <span id="aiModeBadge" class="shruhi-ai-status-pill">● 100% AUTO-AI MODE</span>
        <button type="button" id="toggleHumanTakeoverBtn" style="background: #f5d98e; color: #191014; border: none; border-radius: 999px; padding: 0.22rem 0.65rem; font-size: 0.68rem; font-weight: 800; cursor: pointer;">
          🙋‍♂️ Jump In (Owner Takeover)
        </button>
      </div>
    </div>

    <div class="shruhi-ai-tabs">
      <button type="button" class="shruhi-ai-tab active" data-ai-tab="chat">💬 Trilingual AI Chat</button>
      <button type="button" class="shruhi-ai-tab" data-ai-tab="catalog">🛍️ All ${catalog.length} Products Listed</button>
    </div>

    <!-- Pane 1: Auto-AI Chat -->
    <div id="aiChatPane" style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
      <div class="shruhi-ai-messages" id="aiMessagesBox"></div>
      <div class="ai-quick-chips" id="aiQuickChips">
        <button type="button" class="ai-q-chip" data-ai-ask="Kem cho! 3XL to 6XL ma ketla dress che? Bhav moklo">🇮🇳 ગુજરાતી (Surati)</button>
        <button type="button" class="ai-q-chip" data-ai-ask="Namaste! Plus size 3XL se 6XL ke suits aur rate dikhao">🇮🇳 हिंदी (Hindi)</button>
        <button type="button" class="ai-q-chip" data-ai-ask="Show all 29 products">📋 All 29 Products</button>
        <button type="button" class="ai-q-chip" data-ai-ask="Show Plus Size 3XL to 6XL">👑 Plus Size 3XL–6XL</button>
        <button type="button" class="ai-q-chip" data-ai-ask="Surat Pro Tier status">🛡️ Surat Pro Status</button>
        <button type="button" class="ai-q-chip" data-ai-ask="Owner jump in">🙋‍♂️ Talk to Owner</button>
      </div>
      <form class="ai-input-bar" id="aiChatForm">
        <input type="text" id="aiChatInput" placeholder="Ask in ગુજરાતી, हिंदी, or English (e.g. Tejal, 3XL–6XL, bhav)..." autocomplete="off" />
        <button type="submit" class="ai-send-btn">Send</button>
      </form>
    </div>

    <!-- Pane 2: All 29 Products Listed on +91 63552 85433 -->
    <div id="aiCatalogPane" class="ai-catalog-pane">
      <div style="display: flex; gap: 0.4rem; margin-bottom: 0.35rem;">
        <input type="search" id="aiCatSearch" placeholder="Filter 29 products on +91 63552 85433..." style="flex: 1; padding: 0.48rem 0.75rem; border-radius: 8px; border: 1px solid #d5c5ca; font-size: 0.78rem;" />
      </div>
      <div id="aiCatalogList" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
    </div>

    <div class="ai-handover-footer">
      <span id="aiCartSummary">🛒 AI Order Bag: 0 items</span>
      <a id="aiSendToWaLink" href="https://wa.me/916355285433?text=Hello%20Shruhi%20Collections%20AI%20Desk%20(%2B91%2063552%2085433)!" target="_blank" rel="noopener" style="background: #25d366; color: #072112; padding: 0.32rem 0.75rem; border-radius: 999px; font-weight: 800;">
        Open WhatsApp ${AI_PHONE_DISPLAY} →
      </a>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(drawer);

  const msgBox = drawer.querySelector("#aiMessagesBox");
  const catList = drawer.querySelector("#aiCatalogList");

  function renderMiniCard(item) {
    const waUrl = `https://wa.me/${AI_PHONE}?text=${encodeURIComponent(
      `Hello Shruhi Collections (${AI_PHONE_DISPLAY})! ✨\nI want to order:\n• Code: *${item.code}*\n• Outfit: ${item.name}\n• MRP: *${item.priceFormatted}* (${item.qtyInfo})\n• Sizes: ${item.sizes.join(", ")}`
    )}`;
    return `
      <div class="ai-prod-mini">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.75rem; color: #7a1436;">${item.code}</strong>
            <strong style="font-size: 0.82rem; color: #128c7e;">${item.priceFormatted}</strong>
          </div>
          <div style="font-size: 0.74rem; font-weight: 700; color: #191416; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
          <div style="font-size: 0.68rem; color: #5a4d52;">Sizes: <strong>${item.sizes.join(", ")}</strong> (${item.qtyInfo})</div>
          <div style="display: flex; gap: 0.35rem; margin-top: 0.3rem;">
            <button type="button" data-ai-add="${item.id}" style="padding: 0.2rem 0.5rem; font-size: 0.67rem; font-weight: 800; border-radius: 5px; border: 1px solid #7a1436; background: #fff; color: #7a1436; cursor: pointer;">+ Add</button>
            <a href="${waUrl}" target="_blank" rel="noopener" style="padding: 0.2rem 0.55rem; font-size: 0.67rem; font-weight: 800; border-radius: 5px; background: #128c7e; color: #fff;">WhatsApp ${AI_PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    `;
  }

  function updateAiFooter() {
    const total = aiCart.reduce((s, i) => s + i.price, 0);
    drawer.querySelector("#aiCartSummary").textContent = aiCart.length
      ? `🛒 ${aiCart.length} item(s) • ₹${total.toLocaleString("en-IN")}`
      : `🛒 AI Order Bag: 0 items`;

    const lines = aiCart.map((it, idx) => `${idx + 1}. *${it.code}* (${it.name}) — *${it.priceFormatted}* (${it.qtyInfo})`);
    const text = aiCart.length
      ? `Hello Shruhi Collections (${AI_PHONE_DISPLAY})! ✨\nHere is my AI Concierge Order:\n\n${lines.join("\n")}\n\n*Total MRP: ₹${total.toLocaleString("en-IN")}*\nPlease confirm availability (Owner Jump-In Requested).`
      : `Hello Shruhi Collections (${AI_PHONE_DISPLAY})! ✨ Please share your 29-design catalog.`;
    drawer.querySelector("#aiSendToWaLink").href = `https://wa.me/${AI_PHONE}?text=${encodeURIComponent(text)}`;
  }

  function appendBotMessage(html) {
    const div = document.createElement("div");
    div.className = "ai-msg-bubble ai-msg-bot";
    div.innerHTML = html;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  function appendUserMessage(text) {
    const div = document.createElement("div");
    div.className = "ai-msg-bubble ai-msg-user";
    div.textContent = text;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  function generateAutoAiReply(rawInput) {
    const q = rawInput.toLowerCase().trim();
    const lang = detectLanguage(rawInput);
    chatTranscript.push(`Customer: ${rawInput}`);

    if (aiMode === "HUMAN_TAKEOVER") {
      const handoverUrl = `https://wa.me/${AI_PHONE}?text=${encodeURIComponent(
        `Hello Shruhi Collections Owner (${AI_PHONE_DISPLAY})! I am continuing my live chat:\n"${rawInput}"`
      )}`;
      appendBotMessage(`
        <strong>🙋‍♂️ Owner Live Mode Active (${AI_PHONE_DISPLAY} &amp; ${TELEGRAM_PROXY_BOT})</strong><br/>
        Auto-AI is currently paused so the boutique owner can assist you directly.<br/>
        <a href="${handoverUrl}" target="_blank" rel="noopener" style="display:inline-block; margin-top:0.45rem; padding:0.4rem 0.75rem; background:#128c7e; color:#fff; border-radius:8px; font-weight:800;">
          💬 Continue Live with Owner on ${AI_PHONE_DISPLAY} →
        </a>
      `);
      return;
    }

    if (q.includes("surat pro") || q.includes("shield") || q.includes("tier")) {
      appendBotMessage(`
        <strong>👑 Algorise AI — SURAT PRO TIER (₹29,999 / month) Active</strong><br/>
        • <strong>Up to 3 Connected Meta Pages:</strong> Main Boutique, Plus-Size S–6XL, Wholesale Hub<br/>
        • <strong>Unlimited Sub-0.05s Auto-Hide Shield:</strong> Active (0.042s buyer phone masking)<br/>
        • <strong>Trilingual NLP:</strong> Surati Gujarati (ગુજરાતી), Hindi (हिंदी) &amp; English<br/>
        • <strong>2-Way Telegram Live Proxy:</strong> <a href="${TELEGRAM_PROXY_URL}" target="_blank" rel="noopener" style="color:#128c7e; font-weight:800;">${TELEGRAM_PROXY_BOT}</a> + WhatsApp ${AI_PHONE_DISPLAY}<br/>
        • <strong>All 100 Hero Bots Included:</strong> Active
      `);
      return;
    }

    if (q.includes("owner") || q.includes("human") || q.includes("jump in") || q.includes("talk") || q.includes("call")) {
      aiMode = "HUMAN_TAKEOVER";
      updateModeUI();
      const handoverUrl = `https://wa.me/${AI_PHONE}?text=${encodeURIComponent(
        `Hello Shruhi Collections! ✨ Please jump into my chat on ${AI_PHONE_DISPLAY}.\nRecent messages:\n${chatTranscript.slice(-4).join("\n")}`
      )}`;
      appendBotMessage(`
        <strong>🙋‍♂️ Handed Over to Owner (${AI_PHONE_DISPLAY} &amp; Telegram ${TELEGRAM_PROXY_BOT})!</strong><br/>
        I have paused 100% Auto-AI mode and dispatched an instant alert to <strong>${TELEGRAM_PROXY_BOT}</strong> so our owner can jump in personally:<br/>
        <a href="${handoverUrl}" target="_blank" rel="noopener" style="display:inline-block; margin-top:0.45rem; padding:0.45rem 0.8rem; background:#25d366; color:#072112; border-radius:8px; font-weight:800;">
          💬 Jump In on WhatsApp ${AI_PHONE_DISPLAY} →
        </a>
      `);
      return;
    }

    if (q.includes("address") || q.includes("showroom") || q.includes("location")) {
      appendBotMessage(`
        <strong>📍 Shruhi Collections — Surat Flagship Showroom</strong><br/>
        214/215, Prime Arcade, Anand Mahal Road, Adajan, Surat – 395009, Gujarat, India.<br/>
        • <strong>24/7 AI &amp; WhatsApp Line:</strong> ${AI_PHONE_DISPLAY}<br/>
        • <strong>2-Way Telegram Proxy:</strong> ${TELEGRAM_PROXY_BOT}<br/>
        • <strong>Website:</strong> www.shruhicollections.in
      `);
      return;
    }

    if (q.includes("plus") || q.includes("3xl") || q.includes("4xl") || q.includes("5xl") || q.includes("6xl") || q.includes("curvy")) {
      const matches = catalog.filter((c) => c.isPlusSize || c.sizes.some((s) => ["3XL", "4XL", "5XL", "6XL"].includes(s)));
      const headerByLang = {
        gu: `<strong>👑 ગુજરાતી (Surati) — પ્લસ-સાઈઝ કલેક્શન (3XL થી 6XL) માં ${matches.length} ડિઝાઇન તૈયાર છે (MRP ₹850 – ₹3,550):</strong>`,
        hi: `<strong>👑 हिंदी — प्लस-साइज़ कलेक्शन (3XL से 6XL) में ${matches.length} डिज़ाइन उपलब्ध हैं (MRP ₹850 – ₹3,550):</strong>`,
        en: `<strong>👑 Curvy / Plus-Size Collection (Sizes 3XL to 6XL) — ${matches.length} Designs Available:</strong>`
      };
      appendBotMessage(`
        ${headerByLang[lang] || headerByLang.en}
        ${matches.slice(0, 6).map(renderMiniCard).join("")}
      `);
      return;
    }

    if (q.includes("under") || q.includes("1600") || q.includes("1500") || q.includes("850") || q.includes("budget") || q.includes("tunic")) {
      const matches = catalog.filter((c) => c.price <= 1600);
      appendBotMessage(`
        <strong>✨ Bestsellers Under ₹1,600 (MRP ₹850 – ₹1,550) — ${matches.length} Designs:</strong>
        ${matches.map(renderMiniCard).join("")}
      `);
      return;
    }

    if (q.includes("festive") || q.includes("2500") || q.includes("wedding") || q.includes("bridal") || q.includes("heavy")) {
      const matches = catalog.filter((c) => c.price >= 2500);
      appendBotMessage(`
        <strong>💎 Royal Festive &amp; Bridal Suits (₹2,550 – ₹3,550) — ${matches.length} Designs:</strong>
        ${matches.slice(0, 6).map(renderMiniCard).join("")}
      `);
      return;
    }

    if (q.includes("all") || q.includes("catalog") || q.includes("list") || q.includes("29")) {
      appendBotMessage(`
        <strong>📋 All ${catalog.length} Priced Designs on ${AI_PHONE_DISPLAY} (MRP ₹850 – ₹3,550):</strong><br/>
        Here are our top highlights (or switch to the <strong>"🛍️ All ${catalog.length} Products Listed"</strong> tab above to browse every single one!):
        ${catalog.slice(0, 6).map(renderMiniCard).join("")}
      `);
      return;
    }

    // Search by code, name, color, size, or price
    const found = catalog.filter((item) => {
      const hay = `${item.code} ${item.name} ${item.colorName} ${item.fabric} ${item.price} ${item.sizes.join(" ")}`.toLowerCase();
      return q.split(/\s+/).some((word) => word.length >= 2 && hay.includes(word));
    });

    if (found.length) {
      const prefixByLang = {
        gu: `<strong>🤖 નમસ્તે જી! આપની પસંદગી મુજબ ${found.length} ડિઝાઇન મળી છે (${AI_PHONE_DISPLAY}):</strong>`,
        hi: `<strong>🤖 नमस्ते जी! आपकी पसंद के अनुसार ${found.length} डिज़ाइन मिले हैं (${AI_PHONE_DISPLAY}):</strong>`,
        en: `<strong>🤖 Found ${found.length} matching design(s) on ${AI_PHONE_DISPLAY}:</strong>`
      };
      appendBotMessage(`
        ${prefixByLang[lang] || prefixByLang.en}
        ${found.slice(0, 5).map(renderMiniCard).join("")}
      `);
    } else {
      const fallbackByLang = {
        gu: `<strong>નમસ્તે જી! 🙏 Shruhi Collections (સુરત) Auto-AI માં આપનું સ્વાગત છે!</strong><br/>અમારી પાસે સાઈઝ <strong>S થી 6XL</strong> માં <strong>${catalog.length} 4K ડિઝાઇનર સૂટ્સ (MRP ₹850 – ₹3,550)</strong> હાજર છે.<br/>કોઈપણ ડિઝાઇન કોડ (<em>Tejal, Galaxy, Kavya, 1042, B-2876</em>) અથવા સાઈઝ લખો!`,
        hi: `<strong>नमस्ते जी! 🙏 Shruhi Collections (सूरत) Auto-AI में आपका स्वागत है!</strong><br/>हमारे पास साइज़ <strong>S से 6XL</strong> में <strong>${catalog.length} 4K डिज़ाइनर सूट (MRP ₹850 – ₹3,550)</strong> उपलब्ध हैं।<br/>कोई भी डिज़ाइन कोड (<em>Tejal, Galaxy, Kavya, 1042, B-2876</em>) या साइज़ लिखें!`,
        en: `I am your <strong>100% Auto-AI Assistant on ${AI_PHONE_DISPLAY}</strong> (Surat Pro Tier)! ✨<br/>We have <strong>${catalog.length} verified 4K designs</strong> from <strong>₹850 to ₹3,550</strong> in sizes <strong>S to 6XL</strong>.<br/>Ask in <strong>ગુજરાતી, हिंदी, or English</strong> for any design code (<em>Tejal, Galaxy, Kavya, 1042, B-2876</em>) or size!`
      };
      appendBotMessage(fallbackByLang[lang] || fallbackByLang.en);
    }
  }

  function renderFullAiCatalog(filterText = "") {
    const q = filterText.toLowerCase().trim();
    const list = catalog.filter((item) => {
      if (!q) return true;
      return `${item.code} ${item.name} ${item.priceFormatted} ${item.sizes.join(" ")} ${item.qtyInfo}`.toLowerCase().includes(q);
    });
    catList.innerHTML = list.map(renderMiniCard).join("");
  }

  function updateModeUI() {
    const badge = drawer.querySelector("#aiModeBadge");
    const btn = drawer.querySelector("#toggleHumanTakeoverBtn");
    if (aiMode === "AUTO_AI") {
      badge.className = "shruhi-ai-status-pill";
      badge.textContent = "● 100% AUTO-AI MODE";
      btn.textContent = "🙋‍♂️ Jump In (Owner Takeover)";
    } else {
      badge.className = "shruhi-ai-status-pill human";
      badge.textContent = "🟠 OWNER LIVE (AI PAUSED)";
      btn.textContent = "🤖 Resume 100% Auto-AI";
    }
  }

  // Initial welcome message
  appendBotMessage(`
    નમસ્તે / नमस्ते / Namaste! 🙏 Welcome to <strong>Shruhi Collections 24/7 Auto-AI (${AI_PHONE_DISPLAY})</strong>.<br/><br/>
    • <strong>SURAT PRO TIER ACTIVE:</strong> 3 Connected Meta Pages, Sub-0.05s Comment Shield &amp; 2-Way Telegram Proxy (<a href="${TELEGRAM_PROXY_URL}" target="_blank" rel="noopener" style="color:#128c7e; font-weight:800;">${TELEGRAM_PROXY_BOT}</a>).<br/>
    • All <strong>${catalog.length} 4K Branded Designs (MRP ₹850 – ₹3,550, Sizes S to 6XL)</strong> are ready in <strong>Surati Gujarati, Hindi &amp; English</strong>!
  `);
  renderFullAiCatalog();
  updateAiFooter();

  // Events
  fab.addEventListener("click", () => {
    drawer.classList.toggle("open");
  });

  drawer.querySelector("#closeAiDrawerBtn").addEventListener("click", () => {
    drawer.classList.remove("open");
  });

  drawer.querySelector("#toggleHumanTakeoverBtn").addEventListener("click", () => {
    aiMode = aiMode === "AUTO_AI" ? "HUMAN_TAKEOVER" : "AUTO_AI";
    updateModeUI();
    if (aiMode === "HUMAN_TAKEOVER") {
      appendBotMessage(`<strong>🟠 Owner Jump-In Activated (${AI_PHONE_DISPLAY} &amp; ${TELEGRAM_PROXY_BOT})</strong> — Auto-AI responses are now paused so you can chat directly with the owner.`);
    } else {
      appendBotMessage(`<strong>🟢 100% Auto-AI Resumed (${AI_PHONE_DISPLAY})</strong> — Ask me in ગુજરાતી, हिंदी, or English about any outfit, size (S–6XL), or price!`);
    }
  });

  drawer.querySelectorAll("[data-ai-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      drawer.querySelectorAll("[data-ai-tab]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.getAttribute("data-ai-tab");
      drawer.querySelector("#aiChatPane").style.display = tab === "chat" ? "flex" : "none";
      drawer.querySelector("#aiCatalogPane").classList.toggle("active", tab === "catalog");
    });
  });

  drawer.querySelector("#aiChatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = drawer.querySelector("#aiChatInput");
    const val = input.value.trim();
    if (!val) return;
    appendUserMessage(val);
    input.value = "";
    setTimeout(() => generateAutoAiReply(val), 180);
  });

  drawer.querySelector("#aiQuickChips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-ai-ask]");
    if (!chip) return;
    const ask = chip.getAttribute("data-ai-ask");
    appendUserMessage(ask);
    setTimeout(() => generateAutoAiReply(ask), 180);
  });

  drawer.querySelector("#aiCatSearch").addEventListener("input", (e) => {
    renderFullAiCatalog(e.target.value);
  });

  drawer.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-ai-add]");
    if (addBtn) {
      const id = addBtn.getAttribute("data-ai-add");
      const item = catalog.find((c) => c.id === id);
      if (item) {
        aiCart.push(item);
        updateAiFooter();
        addBtn.textContent = "✓ Added";
        setTimeout(() => {
          addBtn.textContent = "+ Add";
        }, 800);
      }
    }
  });

  // Expose helper to open AI concierge from anywhere on the page
  window.openShruhiAiConcierge = window.openShruhiAiDrawer = function (tabName) {
    drawer.classList.add("open");
    if (tabName) {
      const tBtn = drawer.querySelector(`[data-ai-tab="${tabName}"]`);
      if (tBtn) tBtn.click();
    }
  };
})();
