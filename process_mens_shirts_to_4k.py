import os, sys
sys.stdout.reconfigure(encoding="utf-8")
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

in_dir = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a\scratch\wa_mens_shirts"
prod_dir = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections\assets\products\mens"
cat_4k_dir = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections\4K_Branded_Catalog"

os.makedirs(prod_dir, exist_ok=True)
os.makedirs(cat_4k_dir, exist_ok=True)

def get_font(names, size):
    for name in names:
        p = os.path.join(r"C:\Windows\Fonts", name)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

f_crest_title = get_font(["georgiab.ttf", "timesbd.ttf", "arialbd.ttf"], 32)
f_crest_sub = get_font(["georgia.ttf", "times.ttf", "arial.ttf"], 19)
f_code = get_font(["arialbd.ttf", "georgiab.ttf"], 27)
f_mrp = get_font(["georgiab.ttf", "arialbd.ttf"], 28)
f_footer_b = get_font(["georgiab.ttf", "arialbd.ttf"], 26)
f_footer = get_font(["arial.ttf", "calibri.ttf"], 22)
f_badge = get_font(["georgiab.ttf", "arialbd.ttf"], 22)

# 20 Curated Men's Shirt Products covering all unique designs & galleries from +91 70417 37566
MENS_SHIRTS_SPEC = [
    {
        "num": 32,
        "code": "SHRUHI-MS-101",
        "slug": "ms-101-tartan-checks-collection",
        "title": "Wisteria Tartan & Windowpane Check Casual Shirt",
        "sub": "100% Pure Cotton • Half-Sleeve • 12 Colourways",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_151_73b9aca0e.jpg",
            "shirt_163_73b9aca1a.jpg",
            "shirt_152_73b9aca0f.jpg",
            "shirt_155_73b9aca12.jpg",
            "shirt_157_73b9aca14.jpg",
            "shirt_158_73b9aca15.jpg",
            "shirt_159_73b9aca16.jpg",
            "shirt_161_73b9aca18.jpg",
            "shirt_223_73b9aca56.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 33,
        "code": "SHRUHI-MS-102",
        "slug": "ms-102-pastel-flannel-checks",
        "title": "Pastel Brushed Cotton Check Casual Shirt (3-Shade Pack)",
        "sub": "Soft Brushed Twill • Sage, Mauve & Sky Checks",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_166_73b9aca1d.jpg",
            "shirt_164_73b9aca1b.jpg",
            "shirt_165_73b9aca1c.jpg",
            "shirt_167_73b9aca1e.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 34,
        "code": "SHRUHI-MS-103",
        "slug": "ms-103-lycra-stretch-12-colours",
        "title": "Signature Lycra 4-Way Stretch Solid Shirt (12 Colours)",
        "sub": "Imported Lycra Stretch • Tailored Fit • 12-Shade Chart",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_169_73b9aca20.jpg",
            "shirt_170_73b9aca21.jpg",
        ],
        # Cover red "Laycara" sticker in bottom-left of shirt_169
        "cover_red_stickers": [(0.04, 0.80, 0.34, 0.92, "4-WAY LYCRA STRETCH")],
    },
    {
        "num": 35,
        "code": "SHRUHI-MS-104",
        "slug": "ms-104-vintage-madras-check-trio",
        "title": "Vintage Madras & Windowpane Check Shirt Trio",
        "sub": "Pure Combed Cotton • 6 Heritage Check Shades",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_174_73b9aca25.jpg",
            "shirt_172_73b9aca23.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 36,
        "code": "SHRUHI-MS-105",
        "slug": "ms-105-micro-gingham-5pc-pack",
        "title": "Executive Micro-Gingham Check Shirt (5-Colour Pack)",
        "sub": "Fine Gingham Weave • Sky, Blush, Slate, Aqua & Taupe",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_173_73b9aca24.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 37,
        "code": "SHRUHI-MS-106",
        "slug": "ms-106-imported-linen-10-colours",
        "title": "Imported Slub Linen Solid Casual Shirt (10 Colours)",
        "sub": "Imported Textured Linen • Chest Crest Detail • 10 Shades",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_176_73b9aca27.jpg",
            "shirt_177_73b9aca28.jpg",
        ],
        # Cover red "Imp lilan" sticker in bottom-left of shirt_176
        "cover_red_stickers": [(0.01, 0.89, 0.28, 0.99, "IMPORTED SLUB LINEN")],
    },
    {
        "num": 38,
        "code": "SHRUHI-MS-107",
        "slug": "ms-107-designer-lookbook-full-sleeve-checks",
        "title": "Designer Studio Full-Sleeve Check Shirt Collection",
        "sub": "Tailored Roll-Up Full Sleeve • 16 Signature Plaids",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_178_73b9aca29.jpg",
            "shirt_179_73b9aca2a.jpg",
            "shirt_180_73b9aca2b.jpg",
            "shirt_181_73b9aca2c.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 39,
        "code": "SHRUHI-MS-108",
        "slug": "ms-108-pure-linen-crest-12-colours",
        "title": "Pure Linen Embroidered-Crest Shirt (12 Colours)",
        "sub": "Breathable Pure Linen • Embroidered Chest Crest",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_190_73b9aca35.jpg",
            "shirt_191_73b9aca36.jpg",
            "shirt_193_73b9aca38.jpg",
            "shirt_185_73b9aca30.jpg",
            "shirt_192_73b9aca37.jpg",
        ],
        # Cover red "Lilan" sticker in bottom-left of shirt_190
        "cover_red_stickers": [(0.03, 0.85, 0.26, 0.96, "100% PURE LINEN")],
    },
    {
        "num": 40,
        "code": "SHRUHI-MS-109",
        "slug": "ms-109-royal-linen-13-colours",
        "title": "Royal Linen Resort Solid Shirt (13-Colour Master Chart)",
        "sub": "Luxury Resort Linen • Pastel & Jewel Tones • 13 Colours",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_194_73b9aca39.jpg",
        ],
        # Cover red "Royal Linan" sticker in bottom-left of shirt_194
        "cover_red_stickers": [(0.0, 0.86, 0.28, 0.98, "ROYAL RESORT LINEN")],
    },
    {
        "num": 41,
        "code": "SHRUHI-MS-110",
        "slug": "ms-110-dual-pocket-cargo-shirt",
        "title": "Dual-Flap Pocket Utility Casual Shirt (White & Black)",
        "sub": "Heavy Twill Cotton • Dual Chest Flap Pockets",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_199_73b9aca3e.jpg",
            "shirt_160_73b9aca17.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 42,
        "code": "SHRUHI-MS-111",
        "slug": "ms-111-mandarin-collar-linen-solids",
        "title": "Mandarin Bandhgala Collar Slub-Linen Solid Shirt",
        "sub": "Contemporary Chinese Collar • 8 Earthy & Jewel Shades",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_209_73b9aca48.jpg",
            "shirt_207_73b9aca46.jpg",
            "shirt_214_73b9aca4d.jpg",
            "shirt_215_73b9aca4e.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 43,
        "code": "SHRUHI-MS-112",
        "slug": "ms-112-dno301-graph-check-executive-trio",
        "title": "D.No 301 Executive Graph-Check Shirt (Half & Full Sleeve)",
        "sub": "Available in H/S & F/S • Cream, Ice Blue & Blush Pink",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "files": [
            "shirt_225_73b9aca58.jpg",
        ],
        # Cover top-left "Hls Fls" and bottom-right "301" red stickers
        "cover_red_stickers": [(0.0, 0.0, 0.19, 0.12, "H/S & F/S"), (0.80, 0.90, 0.95, 1.0, "D.NO 301")],
    },
    {
        "num": 44,
        "code": "SHRUHI-MS-113",
        "slug": "ms-113-vertical-pinstripe-linen-trio",
        "title": "Tailored Vertical Pinstripe Linen-Cotton Shirt Trio",
        "sub": "Fine Woven Pinstripes • Slate Blue, Rose & Lavender",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "files": [
            "shirt_228_73b9aca5b.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 45,
        "code": "SHRUHI-MS-114",
        "slug": "ms-114-monochrome-overcheck-shirt",
        "title": "Monochrome Ivory & Charcoal Overcheck Casual Shirt",
        "sub": "Crisp Woven Cotton • 3-Tone Overcheck Series",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_237_73b9aca64.jpg",
            "shirt_234_73b9aca61.jpg",
            "shirt_235_73b9aca62.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 46,
        "code": "SHRUHI-MS-115",
        "slug": "ms-115-mandarin-botanical-resort-prints",
        "title": "Mandarin-Collar Botanical & Tropical Resort Printed Shirt",
        "sub": "12 Designer Holiday Prints • Soft Combed Cotton",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_269_73b9aca84.jpg",
            "shirt_262_73b9aca7d.jpg",
            "shirt_265_73b9aca80.jpg",
            "shirt_267_73b9aca82.jpg",
            "shirt_270_73b9aca85.jpg",
            "shirt_271_73b9aca86.jpg",
            "shirt_291_73b9aca9a.jpg",
            "shirt_292_73b9aca9b.jpg",
            "shirt_296_73b9aca9f.jpg",
            "shirt_297_73b9acaa0.jpg",
            "shirt_298_73b9acaa1.jpg",
            "shirt_263_73b9aca7e.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 47,
        "code": "SHRUHI-MS-116",
        "slug": "ms-116-shadow-plaid-ombre-checks",
        "title": "Shadow-Plaid & Ombré Brushed Check Casual Shirt",
        "sub": "10 Signature Ombré & Shadow Check Colorways",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_276_73b9aca8b.jpg",
            "shirt_273_73b9aca88.jpg",
            "shirt_274_73b9aca89.jpg",
            "shirt_277_73b9aca8c.jpg",
            "shirt_278_73b9aca8d.jpg",
            "shirt_279_73b9aca8e.jpg",
            "shirt_280_73b9aca8f.jpg",
            "shirt_281_73b9aca90.jpg",
            "shirt_282_73b9aca91.jpg",
            "shirt_284_73b9aca93.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 48,
        "code": "SHRUHI-MS-117",
        "slug": "ms-117-heritage-tartan-houndstooth-checks",
        "title": "Heritage Tartan & Micro-Houndstooth Check Shirt",
        "sub": "10 Classic Tartan, Houndstooth & Windowpane Checks",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_285_73b9aca94.jpg",
            "shirt_283_73b9aca92.jpg",
            "shirt_286_73b9aca95.jpg",
            "shirt_287_73b9aca96.jpg",
            "shirt_289_73b9aca98.jpg",
            "shirt_290_73b9aca99.jpg",
            "shirt_293_73b9aca9c.jpg",
            "shirt_294_73b9aca9d.jpg",
            "shirt_295_73b9aca9e.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 49,
        "code": "SHRUHI-MS-118",
        "slug": "ms-118-textured-popcorn-vertical-stripes",
        "title": "Textured Popcorn-Weave & Ribbed Vertical Stripe Shirt",
        "sub": "Artisanal Popcorn & Corduroy Rib Texture • 6 Colorways",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_356_73b9acadb.jpg",
            "shirt_357_73b9acadc.jpg",
            "shirt_358_73b9acadd.jpg",
            "shirt_360_73b9acadf.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 50,
        "code": "SHRUHI-MS-119",
        "slug": "ms-119-linen-chambray-nautical-collection",
        "title": "Linen-Chambray & Nautical Breton Stripe Casual Shirt",
        "sub": "Olive Khaki, Periwinkle Chambray & Sand Breton Stripes",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_361_73b9acae0.jpg",
            "shirt_365_73b9acae4.jpg",
        ],
        "cover_red_stickers": [],
    },
    {
        "num": 51,
        "code": "SHRUHI-MS-120",
        "slug": "ms-120-jacquard-woven-panel-shirt",
        "title": "Artisanal Jacquard Vertical-Panel Motif Casual Shirt",
        "sub": "Woven Geometric Tapestry Panels • Silver & Dusty Rose",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL",
        "files": [
            "shirt_374_73b9acaed.jpg",
            "shirt_377_73b9acaf0.jpg",
        ],
        "cover_red_stickers": [],
    },
]

def fine_tune_shirt_image(src_path, code, title, sub, mrp, sizes, cover_rects=None):
    im = Image.open(src_path).convert("RGB")
    w, h = im.size

    # Trim outer 1.5% edge to remove any stray phone camera border
    mx, my = int(w * 0.015), int(h * 0.015)
    im = im.crop((mx, my, w - mx, h - my))
    w, h = im.size

    # Cleanly replace any raw WhatsApp red sticker boxes with a luxury Shruhi gold-bordered badge
    if cover_rects:
        for rect in cover_rects:
            rx1, ry1, rx2, ry2 = rect[0], rect[1], rect[2], rect[3]
            badge_text = rect[4] if len(rect) > 4 else "SHRUHI LUXURY"
            x1, y1, x2, y2 = int(rx1 * w), int(ry1 * h), int(rx2 * w), int(ry2 * h)
            dr = ImageDraw.Draw(im)
            dr.rounded_rectangle([x1, y1, x2, y2], radius=12, fill=(22, 12, 17), outline=(212, 175, 55), width=3)
            # Center gold badge text inside the plaque
            bbox = dr.textbbox((0, 0), badge_text, font=f_badge)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            tx = x1 + max(8, (x2 - x1 - tw) // 2)
            ty = y1 + max(4, (y2 - y1 - th) // 2 - 2)
            dr.text((tx, ty), badge_text, font=f_badge, fill=(238, 206, 122))

    # Studio color & sharpness enhancement
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.04)
    im = ImageEnhance.Sharpness(im).enhance(1.22)

    # Target luxury studio canvas: 1440 x 1920 (3:4 portrait) with obsidian-maroon luxury frame
    CW, CH = 1440, 1920
    canvas = Image.new("RGB", (CW, CH), (16, 11, 14))
    draw = ImageDraw.Draw(canvas)

    # Top header area (130px) + Bottom footer area (115px) -> image viewport = 1440 x 1675
    vp_top = 130
    vp_h = CH - vp_top - 115
    vp_w = CW - 40

    # Fit image nicely into viewport; if landscape (e.g. 3-shirt flatlay), center on dark studio velvet mat with gold border
    img_ratio = w / h
    vp_ratio = vp_w / vp_h
    if img_ratio > vp_ratio:
        new_w = vp_w
        new_h = int(vp_w / img_ratio)
    else:
        new_h = vp_h
        new_w = int(vp_h * img_ratio)

    im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
    px = (CW - new_w) // 2
    py = vp_top + (vp_h - new_h) // 2

    # Subtle gold frame around the photo
    draw.rounded_rectangle([px - 4, py - 4, px + new_w + 4, py + new_h + 4], radius=14, outline=(196, 158, 72), width=3)
    canvas.paste(im_resized, (px, py))

    # Top Luxury Header Bar
    draw.rectangle([0, 0, CW, 122], fill=(22, 12, 17))
    draw.line([(0, 122), (CW, 122)], fill=(212, 175, 55), width=3)

    # Top-Left Brand Title
    draw.text((32, 22), "SHRUHI COLLECTIONS  •  MEN'S LUXURY EDITION", font=f_crest_title, fill=(238, 206, 122))
    draw.text((34, 68), f"{title}  ({sub})", font=f_crest_sub, fill=(235, 225, 210))

    # Top-Right Code & MRP Pill
    pill_x1, pill_y1, pill_x2, pill_y2 = CW - 445, 18, CW - 26, 104
    draw.rounded_rectangle([pill_x1, pill_y1, pill_x2, pill_y2], radius=14, fill=(92, 16, 40), outline=(230, 192, 104), width=2)
    draw.text((pill_x1 + 20, pill_y1 + 14), f"{code}  •  {mrp}", font=f_code, fill=(255, 248, 225))
    draw.text((pill_x1 + 20, pill_y1 + 52), f"SIZES: {sizes}", font=f_footer, fill=(238, 206, 122))

    # Bottom Luxury Footer Bar
    fy = CH - 108
    draw.rectangle([0, fy, CW, CH], fill=(22, 12, 17))
    draw.line([(0, fy), (CW, fy)], fill=(212, 175, 55), width=3)
    draw.text((32, fy + 20), f"SHRUHI MENSWEAR  •  {code}  •  {mrp}  •  Sizes: {sizes}", font=f_footer_b, fill=(242, 212, 132))
    draw.text((32, fy + 58), "www.shruhicollections.in   |   WhatsApp Order: +91 90542 41725   |   100% Quality Assured", font=f_footer, fill=(215, 205, 195))

    return canvas

total_generated = 0
for item in MENS_SHIRTS_SPEC:
    gallery_paths = []
    for idx, src_fn in enumerate(item["files"]):
        src_p = os.path.join(in_dir, src_fn)
        if not os.path.exists(src_p):
            print("Missing:", src_p)
            continue
        stickers = item["cover_red_stickers"] if idx == 0 else []
        canvas = fine_tune_shirt_image(
            src_p,
            item["code"],
            item["title"],
            item["sub"],
            item["mrp"],
            item["sizes"],
            stickers,
        )
        suffix = "" if idx == 0 else f"-view-{idx + 1}"
        out_name = f"{item['slug']}{suffix}.jpg"
        out_path = os.path.join(prod_dir, out_name)
        canvas.save(out_path, quality=92, optimize=True)
        gallery_paths.append(f"assets/products/mens/{out_name}")
        total_generated += 1

        if idx == 0:
            # Also save to 4K_Branded_Catalog
            cat_fn = f"{item['num']:02d}_{item['code'].replace('-', '_')}_4K.jpg"
            canvas.save(os.path.join(cat_4k_dir, cat_fn), quality=94)

    print(f"✅ Fine-tuned {item['code']} ({item['title']}): {len(gallery_paths)} studio plates")

print(f"\n🎉 Total fine-tuned Men's Shirt studio images generated: {total_generated}")
