import os, sys
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageOps

base_dir = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections"
artifact_dir = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a"
prod_dir = os.path.join(base_dir, "assets", "products", "mens")
cat_4k_dir = os.path.join(base_dir, "4K_Branded_Catalog")

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
f_badge = get_font(["georgiab.ttf", "arialbd.ttf"], 19)

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
        # Crop tight center fabric avoiding the green turf edges
        crop = im.crop((int(w * 0.25), int(h * 0.30), int(w * 0.75), int(h * 0.85)))
        crop = ImageEnhance.Sharpness(crop).enhance(1.25)

        sw_w, sw_h = 1360, 1600
        fitted = ImageOps.fit(crop, (sw_w, sw_h), method=Image.Resampling.LANCZOS)
        sx = (CW - sw_w) // 2
        sy = header_h + (CH - header_h - footer_h - sw_h) // 2
        draw.rounded_rectangle([sx - 4, sy - 4, sx + sw_w + 4, sy + sw_h + 4], radius=16, outline=(196, 158, 72), width=4)
        canvas.paste(fitted, (sx, sy))

        draw.rounded_rectangle([sx + 30, sy + 30, sx + 500, sy + 100], radius=12, fill=(12, 8, 14, 230), outline=(212, 175, 55), width=2)
        draw.text((sx + 50, sy + 48), "✓ 100% EXACT PHYSICAL FABRIC MATCH", font=f_badge, fill=(238, 206, 122))

    fy = CH - footer_h
    draw.rectangle([0, fy, CW, CH], fill=(22, 12, 17))
    draw.line([(0, fy), (CW, fy)], fill=(212, 175, 55), width=3)
    draw.text((32, fy + 22), f"{code}  •  AUTHENTIC FIBER & PATTERN PROVENANCE", font=f_footer_b, fill=(238, 206, 122))
    draw.text((32, fy + 62), "Zero Design Mismatch Guarantee  •  Direct Surat Loom Sourcing", font=f_footer, fill=(215, 205, 195))

    return canvas

# Paths to models for MS-102
sage_model_p = os.path.join(artifact_dir, "ai_model_ms102_1790791547015.jpg")
mauve_model_p = os.path.join(artifact_dir, "ai_model_ms102_mauve_1790901298925.jpg")
skyblue_model_p = os.path.join(artifact_dir, "ai_model_ms102_skyblue_1790901365121.jpg")
swatch_src = os.path.join(artifact_dir, "scratch", "wa_mens_shirts", "shirt_164_73b9aca1b.jpg")

code = "SHRUHI-MS-102"
slug = "ms-102-pastel-flannel-checks"
title = "Pastel Brushed Cotton Check Casual Shirt (3-Shade Pack)"
sub = "Soft Brushed Twill • Sage, Mauve & Sky Checks"

print("Rendering MS-102 Hero (Sage Olive Check)...")
im_sage = Image.open(sage_model_p).convert("RGB")
hero_plate = render_luxury_plate(im_sage, code, title, f"{sub} • Pastel Sage Olive Check", is_hero=True)
hero_plate.save(os.path.join(prod_dir, f"{slug}.jpg"), quality=94, optimize=True)
hero_plate.save(os.path.join(prod_dir, f"{code.lower()}.jpg"), quality=94)
hero_plate.save(os.path.join(cat_4k_dir, "33_SHRUHI_MS_102_4K.jpg"), quality=94)

print("Rendering MS-102 Colorway 2 (Pastel Dusty Mauve Check)...")
im_mauve = Image.open(mauve_model_p).convert("RGB")
v2_plate = render_luxury_plate(im_mauve, code, title, "Pastel Dusty Mauve Check • Color 2 of 3", is_hero=False)
v2_plate.save(os.path.join(prod_dir, f"{slug}-view-2.jpg"), quality=94, optimize=True)

print("Rendering MS-102 Colorway 3 (Pastel Sky Blue Check)...")
im_skyblue = Image.open(skyblue_model_p).convert("RGB")
v3_plate = render_luxury_plate(im_skyblue, code, title, "Pastel Sky Blue Check • Color 3 of 3", is_hero=False)
v3_plate.save(os.path.join(prod_dir, f"{slug}-view-3.jpg"), quality=94, optimize=True)

print("Rendering MS-102 Macro Fabric Swatch Plate...")
macro_plate = render_macro_fabric_plate(swatch_src, code, title, sub)
macro_plate.save(os.path.join(prod_dir, f"{code.lower()}-macro-swatch.jpg"), quality=93, optimize=True)

print("All MS-102 plates rendered successfully!")
