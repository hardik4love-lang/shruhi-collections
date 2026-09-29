/**
 * SHRUHI COLLECTIONS — MICROSOFT EDGE BROWSER FACEBOOK AUTOPILOT
 * ===============================================================
 * No Meta Developer App review required!
 * Opens Microsoft Edge, navigates to your Facebook Page (or Facebook Page Creation screen),
 * pre-fills Page info, and assists/automates uploading all 30 4K Shruhi Collections posts
 * (1 Pinned 9-Grid Lookbook + 29 Verified 4K Outfits) with full captions, MRP, sizes,
 * and WhatsApp +91 63552 85433 / https://shruhicollections.in links.
 *
 * Usage:
 *   node fb-browser-autopilot.js --create-page
 *   node fb-browser-autopilot.js --publish-posts
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const MANIFEST_PATH = path.join(__dirname, 'published-29-fb-posts-manifest.json');
const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');
const ENHANCED_DIR = path.resolve(__dirname, '..', 'enhanced-4k-branded');

const PAGE_DETAILS = {
  name: 'Shruhi Collections',
  handle: '@shruhicollections',
  category1: "Women's Clothing Store",
  category2: 'Boutique',
  category3: 'Apparel & Clothing',
  bio: "Premier Ethnic & Fusion Couture House ✨ Anarkalis, Cord-Sets, Shararas & Designer Suits (Sizes S to 6XL). Direct Boutique Pricing! WhatsApp 24/7 AI: +91 63552 85433 | Web: shruhicollections.in",
  website: 'https://shruhicollections.in',
  phone: '+91 63552 85433',
  whatsapp: 'https://wa.me/916355285433',
  coverPhoto: path.join(ASSETS_DIR, 'shruhi-fb-cover-option2-4k.jpg'),
  profilePhoto: path.join(ASSETS_DIR, 'shruhi-fb-profile-option2-4k.jpg'),
  gridLookbook: path.join(ASSETS_DIR, 'shruhi-fb-grid-post-4k.jpg')
};

function printBanner() {
  console.log('\n====================================================================');
  console.log('   SHRUHI COLLECTIONS — FACEBOOK EDGE BROWSER AUTOPILOT');
  console.log('   Official Domain   : https://shruhicollections.in');
  console.log('   Official WhatsApp : +91 63552 85433 (24/7 Auto-AI)');
  console.log('====================================================================\n');
}

function openInEdge(url) {
  try {
    spawn('cmd.exe', ['/c', 'start', 'msedge', url], { detached: true, stdio: 'ignore' }).unref();
  } catch (err) {
    console.error('Could not launch Microsoft Edge automatically:', err.message);
  }
}

function copyToClipboardWindows(text) {
  try {
    execSync('clip', { input: text, encoding: 'utf16le' });
    return true;
  } catch (e) {
    try {
      execSync('clip', { input: text });
      return true;
    } catch {
      return false;
    }
  }
}

async function runInteractiveAutopilot() {
  printBanner();

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.log('Generating 30-post manifest first via fb-bot.js --post-all...');
    execSync('node fb-bot.js --post-all', { cwd: __dirname, stdio: 'inherit' });
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const args = process.argv.slice(2);

  console.log('📌 FACEBOOK PAGE CONFIGURATION DETAILS:');
  console.log(`   • Page Name      : ${PAGE_DETAILS.name}`);
  console.log(`   • Username       : ${PAGE_DETAILS.handle}`);
  console.log(`   • Categories     : ${PAGE_DETAILS.category1} | ${PAGE_DETAILS.category2} | ${PAGE_DETAILS.category3}`);
  console.log(`   • Bio            : ${PAGE_DETAILS.bio}`);
  console.log(`   • Website        : ${PAGE_DETAILS.website}`);
  console.log(`   • WhatsApp (AI)  : ${PAGE_DETAILS.phone}`);
  console.log(`   • Address        : ${PAGE_DETAILS.address}, ${PAGE_DETAILS.city} – ${PAGE_DETAILS.zip}`);
  console.log(`   • 4K Cover Photo : ${PAGE_DETAILS.coverPhoto}`);
  console.log(`   • 4K Profile Pic : ${PAGE_DETAILS.profilePhoto}`);
  console.log(`   • Total 4K Posts : ${manifest.totalPosts} Posts Ready (1 Pinned Lookbook + 29 Priced Outfits)\n`);

  if (args.includes('--create-page')) {
    console.log('🚀 Opening Facebook Page Creation in Microsoft Edge & Local Automation Control Center...');
    copyToClipboardWindows(PAGE_DETAILS.bio);
    console.log('📋 Copied Shruhi Collections Bio to your Windows Clipboard!');
    openInEdge('https://www.facebook.com/pages/create');
    openInEdge('http://localhost:8090/facebook-page.html#automation');
    return;
  }

  console.log('🚀 Opening Shruhi Collections Facebook Automation Control Center in Microsoft Edge...');
  copyToClipboardWindows(manifest.posts[0].caption);
  console.log('📋 Copied Post #1 (Pinned 9-Grid Lookbook Caption) to your Windows Clipboard!');
  openInEdge('http://localhost:8090/facebook-page.html#automation');
}

runInteractiveAutopilot();
