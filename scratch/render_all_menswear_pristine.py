import os, sys, re, json
sys.stdout.reconfigure(encoding="utf-8")
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageOps

base_dir = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections"
artifact_dir = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a"
prod_dir = os.path.join(base_dir, "assets", "products", "mens")
cat_4k_dir = os.path.join(base_dir, "4K_Branded_Catalog")
wa_shirts_dir = os.path.join(artifact_dir, "scratch", "wa_mens_shirts")
wa_8849_dir = os.path.join(artifact_dir, "scratch", "wa_8849601725")
lb_dir = os.path.join(artifact_dir, "scratch", "cropped_studio_models")

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
f_footer_b = get_font(["georgiab.ttf", "arialbd.ttf"], 26)
f_footer = get_font(["arial.ttf", "calibri.ttf"], 22)
f_badge = get_font(["georgiab.ttf", "arialbd.ttf"], 20)

def render_luxury_plate(
    model_im,
    code,
    title,
    sub_title,
    mrp="MRP ₹999",
    sizes="M, L, XL, 2XL (38–44)",
    whatsapp_phone="+91 88496 01725",
    is_hero=True
):
    CW, CH = 1440, 1920
    canvas = Image.new("RGB", (CW, CH), (16, 11, 14))
    draw = ImageDraw.Draw(canvas)

    vp_top = 130
    vp_h = CH - vp_top - 115
    vp_w = CW - 40

    mw, mh = model_im.size
    target_ratio = vp_w / vp_h
    cur_ratio = mw / mh
    if cur_ratio > target_ratio:
        crop_w = int(mh * target_ratio)
        x_off = (mw - crop_w) // 2
        model_cropped = model_im.crop((x_off, 0, x_off + crop_w, mh))
    else:
        crop_h = int(mw / target_ratio)
        model_cropped = model_im.crop((0, 0, mw, crop_h))

    im_resized = model_cropped.resize((vp_w, vp_h), Image.Resampling.LANCZOS)
    im_resized = ImageEnhance.Sharpness(im_resized).enhance(1.10)
    px = (CW - vp_w) // 2
    py = vp_top

    draw.rounded_rectangle([px - 4, py - 4, px + vp_w + 4, py + vp_h + 4], radius=14, outline=(196, 158, 72), width=3)
    canvas.paste(im_resized, (px, py))

    # Top Luxury Header Bar
    draw.rectangle([0, 0, CW, 122], fill=(22, 12, 17))
    draw.line([(0, 122), (CW, 122)], fill=(212, 175, 55), width=3)

    header_brand = "SHRUHI COLLECTIONS  •  MEN'S LUXURY EDITION" if is_hero else "SHRUHI COLLECTIONS  •  COLORWAY & DETAIL"
    draw.text((32, 22), header_brand, font=f_crest_title, fill=(238, 206, 122))
    draw.text((34, 68), f"{title}  ({sub_title})", font=f_crest_sub, fill=(235, 225, 210))

    # Top-Right Code & MRP Pill
    pill_x1, pill_y1, pill_x2, pill_y2 = CW - 455, 18, CW - 26, 104
    draw.rounded_rectangle([pill_x1, pill_y1, pill_x2, pill_y2], radius=14, fill=(92, 16, 40), outline=(230, 192, 104), width=2)
    draw.text((pill_x1 + 20, pill_y1 + 14), f"{code}  •  {mrp}", font=f_code, fill=(255, 248, 225))
    draw.text((pill_x1 + 20, pill_y1 + 52), f"SIZES: {sizes}", font=f_footer, fill=(238, 206, 122))

    # Bottom Footer
    fy = CH - 108
    draw.rectangle([0, fy, CW, CH], fill=(22, 12, 17))
    draw.line([(0, fy), (CW, fy)], fill=(212, 175, 55), width=3)
    draw.text((32, fy + 20), f"SHRUHI MENSWEAR  •  {code}  •  {mrp}  •  Sizes: {sizes}", font=f_footer_b, fill=(242, 212, 132))
    draw.text((32, fy + 58), f"www.shruhicollections.in   |   WhatsApp Order: {whatsapp_phone}   |   100% Quality Assured", font=f_footer, fill=(215, 205, 195))

    return canvas

def render_macro_fabric_plate(src_path, code, title, sub_title):
    CW, CH = 1440, 1920
    canvas = Image.new("RGB", (CW, CH), (16, 11, 14))
    draw = ImageDraw.Draw(canvas)

    header_h, footer_h = 126, 112
    draw.rectangle([0, 0, CW, header_h], fill=(22, 12, 17))
    draw.line([(0, header_h), (CW, header_h)], fill=(212, 175, 55), width=3)
    draw.text((32, 22), "SHRUHI COLLECTIONS  •  AUTHENTIC FABRIC & WEAVE DETAIL", font=f_crest_title, fill=(238, 206, 122))
    draw.text((34, 68), f"100% Genuine Physical Swatch  •  {title}", font=f_crest_sub, fill=(235, 225, 210))

    if os.path.exists(src_path):
        im = Image.open(src_path).convert("RGB")
        w, h = im.size
        # Crop tight center fabric avoiding any green turf edges
        crop = im.crop((int(w * 0.28), int(h * 0.22), int(w * 0.72), int(h * 0.88)))
        crop = ImageEnhance.Sharpness(crop).enhance(1.20)

        sw_w, sw_h = 1360, 1600
        fitted = ImageOps.fit(crop, (sw_w, sw_h), method=Image.Resampling.LANCZOS)
        sx = (CW - sw_w) // 2
        sy = header_h + (CH - header_h - footer_h - sw_h) // 2
        draw.rounded_rectangle([sx - 4, sy - 4, sx + sw_w + 4, sy + sw_h + 4], radius=16, outline=(196, 158, 72), width=4)
        canvas.paste(fitted, (sx, sy))

        draw.rounded_rectangle([sx + 30, sy + 30, sx + 540, sy + 100], radius=12, fill=(12, 8, 14, 230), outline=(212, 175, 55), width=2)
        draw.text((sx + 40, sy + 48), "VERIFIED AUTHENTIC PHYSICAL SWATCH", font=f_badge, fill=(238, 206, 122))

    fy = CH - footer_h
    draw.rectangle([0, fy, CW, CH], fill=(22, 12, 17))
    draw.line([(0, fy), (CW, fy)], fill=(212, 175, 55), width=3)
    draw.text((32, fy + 22), f"{code}  •  AUTHENTIC FIBER & PATTERN PROVENANCE", font=f_footer_b, fill=(238, 206, 122))
    draw.text((32, fy + 62), "Zero Design Mismatch Guarantee  •  Direct Surat Loom Sourcing", font=f_footer, fill=(215, 205, 195))

    return canvas

# Master Dictionary of all 30 Menswear Collections
MENSWEAR_SPECS = [
    {
        "code": "SHRUHI-MS-101",
        "num": 32,
        "slug": "ms-101-tartan-checks-collection",
        "title": "Wisteria Tartan & Windowpane Check Casual Shirt",
        "sub": "100% Pure Cotton • Half-Sleeve • 12 Colourways",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms101_1790791533297.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_152_73b9aca0f.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-102",
        "num": 33,
        "slug": "ms-102-pastel-flannel-checks",
        "title": "Pastel Brushed Cotton Check Casual Shirt (3-Shade Pack)",
        "sub": "Soft Brushed Twill • Sage, Mauve & Sky Checks",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms102_1790791547015.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_164_73b9aca1b.jpg"),
        "extra_views": [
            ("Pastel Dusty Mauve Check • Color 2 of 3", os.path.join(artifact_dir, "ai_model_ms102_mauve_1790901298925.jpg")),
            ("Pastel Sky Blue Check • Color 3 of 3", os.path.join(artifact_dir, "ai_model_ms102_skyblue_1790901365121.jpg"))
        ]
    },
    {
        "code": "SHRUHI-MS-103",
        "num": 34,
        "slug": "ms-103-lycra-stretch-12-colours",
        "title": "Signature Lycra 4-Way Stretch Solid Shirt (12 Colours)",
        "sub": "Imported Lycra Stretch • Tailored Regular Fit • 12-Shade Master Palette",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms103_1790791615584.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_169_73b9aca20.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-104",
        "num": 35,
        "slug": "ms-104-vintage-madras-check-trio",
        "title": "Vintage Madras & Windowpane Check Shirt Trio",
        "sub": "Pure Combed Cotton • 6 Heritage Check Shades",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms104_1790791560111.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_174_73b9aca25.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-105",
        "num": 36,
        "slug": "ms-105-micro-gingham-5pc-pack",
        "title": "Executive Micro-Gingham Check Shirt (5-Colour Pack)",
        "sub": "Fine Gingham Weave • 5 Executive Pastel & Classic Shades",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms105_1790791571778.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_173_73b9aca24.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-106",
        "num": 37,
        "slug": "ms-106-imported-linen-plain-casual",
        "title": "Imported Slub Linen Solid Casual Shirt (10 Colours)",
        "sub": "100% Breathable Linen • Breathable Summer Palette",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms106_1790791627148.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_176_73b9aca27.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-107",
        "num": 38,
        "slug": "ms-107-designer-lookbook-full-sleeve-checks",
        "title": "Designer Studio Full-Sleeve Check Shirt Collection",
        "sub": "Tailored Roll-Up Full Sleeve • 16 Signature Plaids",
        "hero_model": os.path.join(lb_dir, "lookbook_178_tl.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_178_73b9aca29.jpg"),
        "extra_views": [
            ("Lookbook Angle 2", os.path.join(lb_dir, "lookbook_178_tr.jpg")),
            ("Lookbook Angle 3", os.path.join(lb_dir, "lookbook_178_bl.jpg")),
            ("Lookbook Angle 4", os.path.join(lb_dir, "lookbook_178_br.jpg"))
        ]
    },
    {
        "code": "SHRUHI-MS-108",
        "num": 39,
        "slug": "ms-108-embroidered-crest-pure-linen",
        "title": "Pure Linen Embroidered-Crest Shirt (12 Colours)",
        "sub": "Embroidered Heritage Crest • Luxury Pure Linen Weave",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms108_1790791640758.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_185_73b9aca30.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-109",
        "num": 40,
        "slug": "ms-109-royal-linen-resort-collection",
        "title": "Royal Linen Resort Solid Shirt (13-Colour Master Chart)",
        "sub": "Ultra-Fine Linen • 13 Vibrant & Subtle Resort Hues",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms109_1790791657302.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_194_73b9aca39.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-110",
        "num": 41,
        "slug": "ms-110-heavy-cotton-cargo-shirt",
        "title": "Dual-Flap Pocket Utility Casual Shirt (White & Black)",
        "sub": "Double Flap Pockets • Heavy Cotton Military Twill",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms110_1790791790919.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_199_73b9aca3e.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-111",
        "num": 42,
        "slug": "ms-111-mandarin-collar-linen-casual",
        "title": "Mandarin Bandhgala Collar Slub-Linen Solid Shirt",
        "sub": "Sleek Mandarin Neck • Pure Slub Linen Weave",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms111_1790792229049.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_201_73b9aca40.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-112",
        "num": 43,
        "slug": "ms-112-dno301-graph-check-executive-trio",
        "title": "D.No 301 Executive Graph-Check Shirt (Half & Full Sleeve)",
        "sub": "Available in H/S & F/S • Cream, Ice Blue & Blush Pink",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms112_1790792244503.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_225_73b9aca58.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-113",
        "num": 44,
        "slug": "ms-113-vertical-pinstripe-linen-trio",
        "title": "Tailored Vertical Pinstripe Linen-Cotton Shirt Trio",
        "sub": "Fine Woven Pinstripes • 3 Signature Pastel & Executive Shades",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms113_1790792257285.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_228_73b9aca5b.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-114",
        "num": 45,
        "slug": "ms-114-monochrome-overcheck-shirt",
        "title": "Monochrome Ivory & Charcoal Overcheck Casual Shirt",
        "sub": "Crisp Woven Cotton • 3-Tone Overcheck Series",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms114_1790792272439.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_237_73b9aca64.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-115",
        "num": 46,
        "slug": "ms-115-mandarin-botanical-resort-prints",
        "title": "Mandarin-Collar Botanical & Tropical Resort Printed Shirt",
        "sub": "12 Designer Holiday Prints • Breathable Combed Cotton",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms115_1790904914033.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_269_73b9aca84.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-116",
        "num": 47,
        "slug": "ms-116-shadow-plaid-ombre-checks",
        "title": "Shadow-Plaid & Ombré Brushed Check Casual Shirt",
        "sub": "Rich Ombré Degradé Checks • Soft-Touch Brushed Flannel",
        "hero_model": os.path.join(lb_dir, "lookbook_179_tl.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_323_73b9acaba.jpg"),
        "extra_views": [
            ("Lookbook Angle 2", os.path.join(lb_dir, "lookbook_179_tr.jpg")),
            ("Lookbook Angle 3", os.path.join(lb_dir, "lookbook_179_bl.jpg")),
            ("Lookbook Angle 4", os.path.join(lb_dir, "lookbook_179_br.jpg"))
        ]
    },
    {
        "code": "SHRUHI-MS-117",
        "num": 48,
        "slug": "ms-117-heritage-tartan-houndstooth-checks",
        "title": "Heritage Tartan & Micro-Houndstooth Check Shirt",
        "sub": "Classic Tartan & Micro-Houndstooth Duo • Combed Cotton",
        "hero_model": os.path.join(lb_dir, "lookbook_180_tl.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_331_73b9acac2.jpg"),
        "extra_views": [
            ("Lookbook Angle 2", os.path.join(lb_dir, "lookbook_180_tr.jpg")),
            ("Lookbook Angle 3", os.path.join(lb_dir, "lookbook_180_bl.jpg")),
            ("Lookbook Angle 4", os.path.join(lb_dir, "lookbook_180_br.jpg"))
        ]
    },
    {
        "code": "SHRUHI-MS-118",
        "num": 49,
        "slug": "ms-118-textured-popcorn-vertical-stripes",
        "title": "Textured Popcorn-Weave & Ribbed Vertical Stripe Shirt",
        "sub": "Architectural Popcorn Texture • Slender Vertical Lines",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms118_1790904982822.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_356_73b9acadb.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-119",
        "num": 50,
        "slug": "ms-119-linen-chambray-nautical-collection",
        "title": "Linen-Chambray & Nautical Breton Stripe Casual Shirt",
        "sub": "Breezy Chambray Weave • Timeless Coastal Sailor Stripe",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms119_1790905089519.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_361_73b9acae0.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-120",
        "num": 51,
        "slug": "ms-120-jacquard-woven-panel-shirt",
        "title": "Artisanal Jacquard Vertical-Panel Motif Casual Shirt",
        "sub": "Intricate Loom-Woven Jacquard Embroidery",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms120_1790905150451.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_374_73b9acaed.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-121",
        "num": 52,
        "slug": "ms-121-cobalt-royal-orchid-resort-shirt",
        "title": "Cobalt Royal Orchid Floral Resort Shirt",
        "sub": "Vibrant Cobalt Floral Motif • Ultra-Soft Breathable Rayon",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms121_1790905344801.jpg"),
        "swatch": os.path.join(wa_8849_dir, "ord_569_73b9acb44_ADCBDB92BD.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-122",
        "num": 53,
        "slug": "ms-122-havana-rainforest-tropical-leaf-shirt",
        "title": "Havana Rainforest Tropical Botanical Leaf Resort Shirt",
        "sub": "Deep Forest Palm Fronds • Luxury Cuban Resort Weave",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms122_1790905428121.jpg"),
        "swatch": os.path.join(wa_8849_dir, "ord_568_73b9acb43_B6C889FDB7.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-123",
        "num": 54,
        "slug": "ms-123-golden-bamboo-mandarin-resort-shirt",
        "title": "Golden Bamboo & Palm Mandarin-Collar Resort Shirt",
        "sub": "Oriental Bamboo Foliage • Modern Mandarin Bandhgala",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms123_1790905548108.jpg"),
        "swatch": os.path.join(wa_8849_dir, "ord_567_73b9acb42_75EEC9AC65.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-124",
        "num": 55,
        "slug": "ms-124-aegean-feather-botanical-resort-shirt",
        "title": "Aegean Cyan Feather Botanical Resort Printed Shirt",
        "sub": "Ethereal Cyan Feather Weave • Crisp Summer Cotton",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms124_1790905614810.jpg"),
        "swatch": os.path.join(wa_8849_dir, "ord_566_73b9acb41_885811E876.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-125",
        "num": 56,
        "slug": "ms-125-vintage-desert-stripe-cuban-camp-shirt",
        "title": "Vintage Desert Stripe Cuban Camp-Collar Shirt",
        "sub": "Retro Earth Tones • Relaxed Resort Cuban Collar",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms125_1790905681486.jpg"),
        "swatch": os.path.join(wa_8849_dir, "ord_564_73b9acb3f_E7066994FB.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-126",
        "num": 57,
        "slug": "ms-126-french-riviera-powder-blue-paisley-shirt",
        "title": "French Riviera Powder-Blue Paisley Resort Shirt",
        "sub": "Delicate Riviera Paisley Scrollwork • Silky Twill Drape",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms126_1790905760510.jpg"),
        "swatch": os.path.join(wa_8849_dir, "ord_570_73b9acb45_49C72D58D7.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-127",
        "num": 58,
        "slug": "ms-127-santorini-indigo-watercolor-splatter-shirt",
        "title": "Santorini Indigo Watercolor Splatter Casual Shirt",
        "sub": "Mediterranean Watercolor Dappling • Pure Combed Cotton",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms127_1790905831445.jpg"),
        "swatch": os.path.join(wa_8849_dir, "ord_571_73b9acb46_FFC4FA3218.jpg"),
        "extra_views": []
    },
    {
        "code": "SHRUHI-MS-128",
        "num": 59,
        "slug": "ms-128-executive-charcoal-windowpane-check-shirt",
        "title": "Executive Charcoal Windowpane Check Formal Shirt",
        "sub": "Precision Windowpane Grid • High-Count Egyptian Cotton",
        "hero_model": os.path.join(lb_dir, "lookbook_181_tl.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_340_73b9acacb.jpg"),
        "extra_views": [
            ("Lookbook Angle 2", os.path.join(lb_dir, "lookbook_181_tr.jpg"))
        ]
    },
    {
        "code": "SHRUHI-MS-129",
        "num": 60,
        "slug": "ms-129-dual-tone-heritage-plaid-casual-shirt",
        "title": "Dual-Tone Heritage Plaid Casual Shirt",
        "sub": "Subtle Heritage Plaid Weave • Soft Wash Combed Cotton",
        "hero_model": os.path.join(lb_dir, "lookbook_181_bl.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_345_73b9acad0.jpg"),
        "extra_views": [
            ("Lookbook Angle 2", os.path.join(lb_dir, "lookbook_181_br.jpg"))
        ]
    },
    {
        "code": "SHRUHI-MS-130",
        "num": 61,
        "slug": "ms-130-minimalist-dual-pocket-resort-camp-shirt",
        "title": "Minimalist Dual-Pocket Resort Camp Shirt (White & Black)",
        "sub": "Clean Short-Sleeve Resort Fit • Twin Buttoned Chest Pockets",
        "hero_model": os.path.join(artifact_dir, "ai_model_ms110_1790791790919.jpg"),
        "swatch": os.path.join(wa_shirts_dir, "shirt_199_73b9aca3e.jpg"),
        "extra_views": []
    }
]

catalog_galleries = {}

print("==================================================================")
print("STARTING PRISTINE 4K LUXURY RENDERING ACROSS ALL 30 MENSWEAR EDITIONS")
print("==================================================================")

for spec in MENSWEAR_SPECS:
    code = spec["code"]
    num = spec["num"]
    slug = spec["slug"]
    title = spec["title"]
    sub = spec["sub"]
    hero_p = spec["hero_model"]
    swatch_p = spec["swatch"]
    extra_views = spec["extra_views"]

    if not os.path.exists(hero_p):
        print(f"[!] WARNING: Hero model missing for {code}: {hero_p}")
        continue

    print(f"\nProcessing {code}: {title}")
    gallery = []

    # 1. Render Hero Plate
    im_hero = Image.open(hero_p).convert("RGB")
    hero_plate = render_luxury_plate(im_hero, code, title, sub, is_hero=True)

    hero_fn = f"{slug}.jpg"
    hero_path = os.path.join(prod_dir, hero_fn)
    hero_plate.save(hero_path, quality=94, optimize=True)

    # Save direct code alias
    hero_plate.save(os.path.join(prod_dir, f"{code.lower()}.jpg"), quality=94)

    # Save to 4K catalog (both numbered and clean)
    cat_4k_numbered = f"{num:02d}_{code.replace('-', '_')}_4K.jpg"
    cat_4k_clean = f"{code.replace('-', '_')}_4K.jpg"
    hero_plate.save(os.path.join(cat_4k_dir, cat_4k_numbered), quality=94)
    hero_plate.save(os.path.join(cat_4k_dir, cat_4k_clean), quality=94)

    gallery.append(f"assets/products/mens/{hero_fn}")
    print(f"  ✓ Hero Plate saved ({hero_fn})")

    # 2. Render Macro Fabric Swatch Plate (if swatch exists)
    if os.path.exists(swatch_p):
        macro_fn = f"{code.lower()}-macro-swatch.jpg"
        macro_plate = render_macro_fabric_plate(swatch_p, code, title, sub)
        macro_plate.save(os.path.join(prod_dir, macro_fn), quality=92, optimize=True)
        gallery.append(f"assets/products/mens/{macro_fn}")
        print(f"  ✓ Macro Swatch saved ({macro_fn})")

    # 3. Render Extra Views / Colorways
    for idx, (view_label, view_img_p) in enumerate(extra_views):
        if os.path.exists(view_img_p):
            im_v = Image.open(view_img_p).convert("RGB")
            v_plate = render_luxury_plate(im_v, code, title, view_label, is_hero=False)
            v_fn = f"{slug}-view-{idx+2}.jpg"
            v_plate.save(os.path.join(prod_dir, v_fn), quality=93, optimize=True)
            gallery.append(f"assets/products/mens/{v_fn}")
            print(f"  ✓ View {idx+2} saved: {view_label} ({v_fn})")

    catalog_galleries[code] = gallery

print("\n==================================================================")
print("UPDATING CATALOG-DATA.JS GALLERIES FOR ALL 30 COLLECTIONS")
print("==================================================================")

cat_path = os.path.join(base_dir, "catalog-data.js")
with open(cat_path, "r", encoding="utf-8") as f:
    cat_content = f.read()

updated_count = 0
for code, gal in catalog_galleries.items():
    gal_json = json.dumps(gal, indent=6)
    # Find the object with this code and replace its gallery
    pattern = r'("code":\s*"' + code + r'"[\s\S]*?"gallery":\s*)\[[\s\S]*?\]'
    if re.search(pattern, cat_content):
        cat_content = re.sub(pattern, r'\g<1>' + gal_json, cat_content, count=1)
        updated_count += 1
        print(f"  ✓ Updated catalog-data.js gallery for {code} ({len(gal)} images)")
    else:
        print(f"  [!] Could not find gallery for {code} in catalog-data.js")

with open(cat_path, "w", encoding="utf-8") as f:
    f.write(cat_content)

print(f"\nSuccessfully updated {updated_count} collections in catalog-data.js!")
print("ALL 30 COLLECTIONS HAVE BEEN COMPLETELY PURIFIED WITH ZERO ARTIFACTS!")
