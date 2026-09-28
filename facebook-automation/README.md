# Shruhi Collections — Facebook Page Automation & 100% Auto-AI Suite (`+91 63552 85433`)

Complete 24/7 Facebook Page & Messenger Automation system for **Shruhi Collections, Surat** (`https://shruhicollections.in`).

---

## ✨ Key Features

1. **100% Auto-Post All 29 4K Priced Outfits + Pinned 9-Grid Lookbook (30 Posts Total)**
   - Every post includes the 4K branded studio photograph (`enhanced-4k-branded/`), verified MRP (`₹850 – ₹3,550`), full size breakdown (`S` to `6XL` with Combo & Single options), Surat showroom address (`214/215, Prime Arcade, Anand Mahal Road, Adajan, Surat – 395009`), and direct WhatsApp checkout (`+91 63552 85433`) + website (`https://shruhicollections.in`).

2. **24/7 Facebook Post Comment Auto-Reply + Instant Private DM**
   - When any shopper comments `"PP"`, `"Price?"`, `"Rate"`, `"Cost"`, `"Available?"`, `"3XL?"`, `"5XL?"`, or any design code on a Facebook post:
     - **Public Comment Reply**: Instantly replies to their comment with the exact MRP, available sizes, and WhatsApp/Website link.
     - **Private Messenger DM**: Automatically sends a private Messenger reply (`recipient: { comment_id }`) with the product details and direct WhatsApp `+91 63552 85433` order link.

3. **100% Auto-AI Facebook Messenger Bot ("Until I Jump In")**
   - Answers all Facebook Page Messenger DMs 24/7 with all 29 products, sizes (`S` to `6XL`), fabrics, and pricing.
   - **Automatic Human Handover ("Until I Jump In")**: The instant you reply manually to a customer from **Meta Business Suite** or the **Facebook Page Inbox**, the webhook detects your manual reply (`message.is_echo === true` without the bot signature) and **immediately pauses the AI for that customer** so you can chat personally without interruption.
   - Send `/ai on` in the chat (or click **Resume AI** in the dashboard) to re-enable 100% Auto-AI for that customer.

---

## 🚀 Quick Start Commands

### 1. Start the 24/7 Facebook Auto-AI Server + REST API (`Port 8095`)
```powershell
cd C:\Users\om\.gemini\antigravity\scratch\shruhi-collections\facebook-automation
node fb-bot.js
```
- **Live Status & API**: `http://localhost:8095/api/status`
- **All 30 Ready-to-Publish Posts JSON**: `http://localhost:8095/api/posts`
- **Meta Webhook Endpoint**: `http://localhost:8095/webhook` (Verify Token: `shruhi_fb_verify_2026`)

### 2. Generate / Auto-Publish All 30 4K Posts
```powershell
node fb-bot.js --post-all
```
- Always generates `published-29-fb-posts-manifest.json` with all 30 ready-to-publish 4K posts and captions.
- If `FB_PAGE_ID` and `FB_PAGE_ACCESS_TOKEN` are set in your environment, it automatically uploads all 30 4K photos + captions directly to your live Facebook Page via the Meta Graph API (`v19.0`).

### 3. Launch Microsoft Edge Browser Autopilot (Zero Meta App Review Needed)
```powershell
node fb-browser-autopilot.js --create-page
```
Opens Facebook Page Creation in Microsoft Edge with your bio copied to clipboard and launches the interactive **Facebook Automation Control Center** (`http://localhost:8090/facebook-page.html#automation`).
