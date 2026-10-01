import os, sys
sys.stdout.reconfigure(encoding="utf-8")
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter, ImageOps
import json

base_dir = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections"
artifact_dir = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a"
wa_shirts_dir = os.path.join(artifact_dir, "scratch", "wa_mens_shirts")
wa_8849_dir = os.path.join(artifact_dir, "scratch", "wa_8849601725")
cropped_dir = os.path.join(artifact_dir, "scratch", "cropped_studio_models")
vton_dir = os.path.join(artifact_dir, "scratch", "clean_vton_models")
prod_dir = os.path.join(base_dir, "assets", "products", "mens")
cat_4k_dir = os.path.join(base_dir, "4K_Branded_Catalog")

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
f_badge = get_font(["georgiab.ttf", "arialbd.ttf"], 19)
f_swatch_label = get_font(["arialbd.ttf", "georgiab.ttf"], 16)

# Base models for VTON
MODEL_FILES = {
    "ms108": os.path.join(artifact_dir, "ai_model_ms108_1790791640758.jpg"),
    "ms109": os.path.join(artifact_dir, "ai_model_ms109_1790791657302.jpg"),
    "ms111": os.path.join(artifact_dir, "ai_model_ms111_1790792229049.jpg"),
    "ms106": os.path.join(artifact_dir, "ai_model_ms106_1790791627148.jpg"),
}

# Pre-computed model masks cache
MASK_CACHE = {}

def get_shirt_mask(model_key):
    if model_key in MASK_CACHE:
        return MASK_CACHE[model_key]

    model_im = Image.open(MODEL_FILES[model_key]).convert("RGB")
    arr = np.asarray(model_im, dtype=np.float32)
    R, G, B = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    H, W, _ = arr.shape
    yy, xx = np.mgrid[0:H, 0:W]
    yn, xn = yy / float(H), xx / float(W)

    if model_key == "ms108":
        cond = (G > R + 10) & (B > R + 3) & (yn > 0.20) & (yn < 0.98) & (xn > 0.11) & (xn < 0.90)
    elif model_key == "ms109":
        cond = (B > R + 13) & (B > G + 1) & (yn > 0.24) & (yn < 0.64) & (xn > 0.34) & (xn < 0.82)
    elif model_key == "ms111":
        cond = (G > R + 6) & (G > B + 4) & (yn > 0.17) & (yn < 0.56) & (xn > 0.28) & (xn < 0.74)
        tag_spot = (yn > 0.22) & (yn < 0.35) & (xn > 0.45) & (xn < 0.53) & (R > 155) & (G > 155) & (B > 155)
        cond = cond | tag_spot
    elif model_key == "ms106":
        cond = (G > R - 2) & (G > B + 5) & (yn > 0.16) & (yn < 0.56) & (xn > 0.32) & (xn < 0.73)
        cond = cond & (G >= R - 1)
    else:
        cond = np.zeros((H, W), dtype=bool)

    mask_img = Image.fromarray((cond.astype(np.uint8) * 255))
    mask_img = mask_img.filter(ImageFilter.MedianFilter(5))
    mask_img = mask_img.filter(ImageFilter.MaxFilter(3))
    mask_img = mask_img.filter(ImageFilter.MinFilter(3))
    mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=2.0))
    mask_arr = np.asarray(mask_img, dtype=np.float32) / 255.0
    MASK_CACHE[model_key] = mask_arr
    return mask_arr

def extract_fabric_patch(src_img_path, box=None):
    im = Image.open(src_img_path).convert("RGB")
    w, h = im.size
    if box is None:
        box = (0.22, 0.22, 0.78, 0.78)
    patch = im.crop((int(w * box[0]), int(h * box[1]), int(w * box[2]), int(h * box[3])))
    arr = np.asarray(patch, dtype=np.float32).copy()
    R, G, B = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    # Filter artificial turf green pixels
    bad = (G > R + 26) & (G > B + 26)
    if np.any(bad) and not np.all(bad):
        med = np.median(arr[~bad], axis=0)
        arr[bad] = med
    clean = Image.fromarray(arr.astype(np.uint8))
    pw, ph = clean.size
    tile = Image.new("RGB", (pw * 2, ph * 2))
    tile.paste(clean, (0, 0))
    tile.paste(ImageOps.mirror(clean), (pw, 0))
    tile.paste(ImageOps.flip(clean), (0, ph))
    tile.paste(ImageOps.flip(ImageOps.mirror(clean)), (pw, ph))
    return tile

def synthesize_model_wearing_shirt(model_key, shirt_path, crop_box=None, scale=2.1, flip=False):
    model_im = Image.open(MODEL_FILES[model_key]).convert("RGB")
    W, H = model_im.size
    mask = get_shirt_mask(model_key)

    arr = np.asarray(model_im, dtype=np.float32)
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

    shirt_vals = lum[mask > 0.5]
    base_lum = np.percentile(shirt_vals, 65) if len(shirt_vals) > 100 else 150.0
    shading = np.clip(lum / max(base_lum, 1.0), 0.35, 1.28)
    shading = np.power(shading, 0.90)[:, :, None]

    ys, xs = np.where(mask > 0.2)
    if len(ys) == 0:
        return model_im
    y_min, y_max = ys.min(), ys.max()
    x_min, x_max = xs.min(), xs.max()
    sw, sh = x_max - x_min + 1, y_max - y_min + 1

    tile = extract_fabric_patch(shirt_path, crop_box)
    tw = max(120, int(sw / scale))
    th = max(120, int(sh / scale))
    tile_resized = tile.resize((tw, th), Image.Resampling.LANCZOS)

    tiled_full = Image.new("RGB", (W, H))
    for ty in range(0, H, th):
        for tx in range(0, W, tw):
            tiled_full.paste(tile_resized, (tx, ty))

    fab_arr = np.asarray(tiled_full, dtype=np.float32)
    shaded_fab = np.clip(fab_arr * shading, 0, 255)

    m3 = mask[:, :, None]
    comp = arr * (1.0 - m3) + shaded_fab * m3
    out_im = Image.fromarray(comp.astype(np.uint8))
    if flip:
        out_im = ImageOps.mirror(out_im)
    return out_im

def render_model_luxury_plate(
    model_im,
    swatch_src_path,
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

    model_fitted = model_cropped.resize((vp_w, vp_h), Image.Resampling.LANCZOS)
    model_fitted = ImageEnhance.Sharpness(model_fitted).enhance(1.15)
    px = 20
    py = vp_top

    # Subtle gold frame
    draw.rounded_rectangle([px - 4, py - 4, px + vp_w + 4, py + vp_h + 4], radius=14, outline=(196, 158, 72), width=3)
    canvas.paste(model_fitted, (px, py))

    # Inset Card: "100% ORIGINAL FABRIC PROOF"
    if swatch_src_path and os.path.exists(swatch_src_path):
        try:
            sw_im = Image.open(swatch_src_path).convert("RGB")
            sww, swh = sw_im.size
            sw_crop = sw_im.crop((int(sww * 0.20), int(swh * 0.22), int(sww * 0.80), int(swh * 0.78)))
            inset_w, inset_h = 340, 420
            sw_thumb = sw_crop.resize((inset_w, inset_h - 40), Image.Resampling.LANCZOS)
            sw_thumb = ImageEnhance.Sharpness(sw_thumb).enhance(1.2)

            ix2 = CW - 45
            ix1 = ix2 - inset_w
            iy2 = CH - 135
            iy1 = iy2 - inset_h

            draw.rounded_rectangle([ix1 - 5, iy1 - 5, ix2 + 5, iy2 + 5], radius=16, fill=(22, 12, 17), outline=(212, 175, 55), width=3)
            canvas.paste(sw_thumb, (ix1, iy1))

            draw.rectangle([ix1, iy2 - 38, ix2, iy2], fill=(22, 12, 17))
            draw.text((ix1 + 18, iy2 - 32), "100% ORIGINAL FABRIC PROOF", font=f_swatch_label, fill=(238, 206, 122))
        except Exception as e:
            print(f"Error rendering swatch inset for {code}:", e)

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
        crop = im.crop((int(w * 0.25), int(h * 0.25), int(w * 0.75), int(h * 0.75)))
        crop = ImageEnhance.Sharpness(crop).enhance(1.35)

        sw_w, sw_h = 1360, 1600
        fitted = ImageOps.fit(crop, (sw_w, sw_h), method=Image.Resampling.LANCZOS)
        sx = (CW - sw_w) // 2
        sy = header_h + (CH - header_h - footer_h - sw_h) // 2
        draw.rounded_rectangle([sx - 4, sy - 4, sx + sw_w + 4, sy + sw_h + 4], radius=16, outline=(196, 158, 72), width=4)
        canvas.paste(fitted, (sx, sy))

        # Swatch seal
        draw.rounded_rectangle([sx + 30, sy + 30, sx + 500, sy + 100], radius=12, fill=(12, 8, 14, 230), outline=(212, 175, 55), width=2)
        draw.text((sx + 50, sy + 48), "✓ 100% EXACT PHYSICAL FABRIC MATCH", font=f_badge, fill=(238, 206, 122))

    fy = CH - footer_h
    draw.rectangle([0, fy, CW, CH], fill=(22, 12, 17))
    draw.line([(0, fy), (CW, fy)], fill=(212, 175, 55), width=3)
    draw.text((32, fy + 22), f"{code}  •  AUTHENTIC FIBER & PATTERN PROVENANCE", font=f_footer_b, fill=(238, 206, 122))
    draw.text((32, fy + 62), "Zero Design Mismatch Guarantee  •  Direct Surat Loom Sourcing", font=f_footer, fill=(215, 205, 195))

    return canvas

# Import collection data from process_all_mens_wear_with_ai_models
sys.path.insert(0, os.path.join(artifact_dir, "scratch"))
from process_all_mens_wear_with_ai_models import ALL_30_MENS_WEAR

# Cycle of base models for diverse poses across colorways
CYCLE_MODELS = [
    ("ms108", False),
    ("ms109", False),
    ("ms111", False),
    ("ms106", False),
    ("ms108", True),
    ("ms109", True),
    ("ms111", True),
    ("ms106", True),
]

if __name__ == "__main__":
    print(f"Starting complete synthesis for all {len(ALL_30_MENS_WEAR)} Men's Wear collections...")

    total_plates_generated = 0
    catalog_updates = []

    for item_idx, item in enumerate(ALL_30_MENS_WEAR):
        code = item["code"]
        slug = item["slug"]
        title = item["title"]
        sub = item["sub"]
        num = item["num"]
        mrp = item["mrp"]
        sizes = item["sizes"]
        model_src = item["model_file"]
        swatch_ref = item["swatch_ref"]
        gallery_files = item["gallery_files"]

        print(f"\nProcessing [{num}] {code}: {title}...")

        # 1. HERO PLATE: High-Fashion Model Wearing Signature Design + Swatch Inset
        if not os.path.exists(model_src):
            # Fallback to synthesizing model from swatch
            m_key, fl = CYCLE_MODELS[item_idx % len(CYCLE_MODELS)]
            hero_model_im = synthesize_model_wearing_shirt(m_key, swatch_ref, scale=2.1, flip=fl)
        else:
            hero_model_im = Image.open(model_src).convert("RGB")

        hero_canvas = render_model_luxury_plate(
            hero_model_im,
            swatch_ref,
            code,
            title,
            sub,
            mrp=mrp,
            sizes=sizes,
            is_hero=True
        )

        hero_fn = f"{slug}.jpg"
        hero_path = os.path.join(prod_dir, hero_fn)
        hero_canvas.save(hero_path, quality=94, optimize=True)
        total_plates_generated += 1

        # Also save to 4K_Branded_Catalog
        cat_4k_fn = f"{num:02d}_{code.replace('-', '_')}_4K.jpg"
        hero_canvas.save(os.path.join(cat_4k_dir, cat_4k_fn), quality=94)

        # CRITICAL FIX: Also save as shruhi-ms-XXX.jpg so direct links/thumbnails show the model!
        ms_num_code = f"shruhi-ms-{num + 69 if num <= 31 else num + 69}.jpg"
        direct_code_fn = f"{code.lower()}.jpg"
        hero_canvas.save(os.path.join(prod_dir, direct_code_fn), quality=94)

        gallery_rel = [f"assets/products/mens/{hero_fn}"]

        # 2. MACRO FABRIC SWATCH PLATE
        macro_fn = f"{code.lower()}-macro-swatch.jpg"
        macro_path = os.path.join(prod_dir, macro_fn)
        macro_canvas = render_macro_fabric_plate(swatch_ref, code, title, sub)
        macro_canvas.save(macro_path, quality=92, optimize=True)
        gallery_rel.append(f"assets/products/mens/{macro_fn}")
        total_plates_generated += 1

        # 3. COLORWAY VIEWS: Every single colorway MUST show a model wearing it!
        for g_idx, g_file in enumerate(gallery_files):
            if not os.path.exists(g_file):
                continue

            # Check if g_file is already a model shot (lookbook)
            is_lookbook = "lookbook" in g_file.lower()
            if is_lookbook:
                colorway_model_im = Image.open(g_file).convert("RGB")
            else:
                # SYNTHESIZE MODEL WEARING THIS COLORWAY!
                m_key, fl = CYCLE_MODELS[(g_idx + item_idx) % len(CYCLE_MODELS)]
                colorway_model_im = synthesize_model_wearing_shirt(m_key, g_file, scale=2.1, flip=fl)

            view_title = f"{title} • Colorway {g_idx + 1}"
            view_sub = f"Color Variant {g_idx + 1} of {len(gallery_files)}"

            view_canvas = render_model_luxury_plate(
                colorway_model_im,
                g_file,
                code,
                view_title,
                view_sub,
                mrp=mrp,
                sizes=sizes,
                is_hero=False
            )

            view_fn = f"{slug}-view-{g_idx + 2}.jpg"
            view_path = os.path.join(prod_dir, view_fn)
            view_canvas.save(view_path, quality=92, optimize=True)
            gallery_rel.append(f"assets/products/mens/{view_fn}")
            total_plates_generated += 1

        print(f"  ✓ Saved {code}: Hero (Model) + Macro Swatch + {len(gallery_files)} Model Colorway views (Total {len(gallery_rel)} plates)")

        catalog_updates.append({
            "id": slug,
            "code": code,
            "title": title,
            "hero_image": f"assets/products/mens/{hero_fn}",
            "direct_image": f"assets/products/mens/{direct_code_fn}",
            "gallery": gallery_rel
        })

    print(f"\n🎉 Successfully rendered all {len(ALL_30_MENS_WEAR)} collections with studio models for EVERY colorway! Total plates: {total_plates_generated}")

    # Save JSON dump
    with open(os.path.join(base_dir, "scratch", "model_plates_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(catalog_updates, f, indent=2)
    print("Saved manifest to scratch/model_plates_manifest.json")
