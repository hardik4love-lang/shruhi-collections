import os, sys
sys.stdout.reconfigure(encoding="utf-8")
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter, ImageOps

base_dir = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections"
artifact_dir = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a"
wa_shirts_dir = os.path.join(artifact_dir, "scratch", "wa_mens_shirts")
wa_8849_dir = os.path.join(artifact_dir, "scratch", "wa_8849601725")
prod_dir = os.path.join(base_dir, "assets", "products", "mens")
cat_4k_dir = os.path.join(base_dir, "4K_Branded_Catalog")

sys.path.insert(0, base_dir)
from build_all_model_wearing_plates import (
    MODEL_FILES,
    get_shirt_mask,
    render_model_luxury_plate,
    render_macro_fabric_plate,
    f_crest_title,
    f_crest_sub,
    f_code,
    f_footer_b,
    f_footer,
    f_swatch_label
)

def render_solid_model(model_key, rgb_color, flip=False):
    model_im = Image.open(MODEL_FILES[model_key]).convert("RGB")
    W, H = model_im.size
    mask = get_shirt_mask(model_key)

    arr = np.asarray(model_im, dtype=np.float32)
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

    shirt_vals = lum[mask > 0.5]
    base_lum = np.percentile(shirt_vals, 65) if len(shirt_vals) > 100 else 150.0

    shading = np.clip(lum / max(base_lum, 1.0), 0.35, 1.30)
    shading = np.power(shading, 0.95)[:, :, None]

    base_rgb = np.array(rgb_color, dtype=np.float32)[None, None, :]
    np.random.seed(42)
    grain = 1.0 + (np.random.randn(H, W, 1).astype(np.float32) * 0.035)

    colored_shirt = np.clip(base_rgb * shading * grain, 0, 255)

    m3 = mask[:, :, None]
    comp = arr * (1.0 - m3) + colored_shirt * m3
    out_im = Image.fromarray(comp.astype(np.uint8))
    if flip:
        out_im = ImageOps.mirror(out_im)
    return out_im

# Master specifications for SOLID collections to guarantee zero design mismatch
SOLID_COLLECTIONS = {
    "SHRUHI-MS-103": {
        "slug": "ms-103-lycra-stretch-12-colours",
        "title": "Signature Lycra 4-Way Stretch Solid Shirt (12 Colours)",
        "sub": "Imported Lycra Stretch • Tailored Regular Fit • 12-Shade Chart",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "swatch": os.path.join(wa_shirts_dir, "shirt_169_73b9aca20.jpg"),
        "colors": [
            ("Wine / Burgundy", [105, 32, 48], "ms108", False),
            ("Classic Slate Navy", [32, 45, 75], "ms108", True),
            ("Pristine Cream / Ivory", [225, 218, 204], "ms108", False),
            ("Dusty Olive Sage", [115, 128, 108], "ms108", True),
            ("Executive Jet Black", [35, 35, 38], "ms108", False),
            ("Terracotta Rust", [168, 85, 55], "ms108", True),
        ]
    },
    "SHRUHI-MS-106": {
        "slug": "ms-106-imported-linen-10-colours",
        "title": "Imported Slub Linen Solid Casual Shirt (10 Colours)",
        "sub": "Textured Pure Slub Linen • Embroidered Crest • 10 Shades",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "swatch": os.path.join(wa_shirts_dir, "shirt_176_73b9aca27.jpg"),
        "colors": [
            ("Crisp White", [235, 230, 222], "ms106", False),
            ("Sage Olive Green", [118, 135, 115], "ms106", True),
            ("Powder Sky Blue", [120, 145, 175], "ms106", False),
            ("Desert Khaki Sand", [195, 175, 150], "ms106", True),
        ]
    },
    "SHRUHI-MS-108": {
        "slug": "ms-108-pure-linen-crest-12-colours",
        "title": "Pure Linen Embroidered-Crest Shirt (12 Colours)",
        "sub": "Breathable Pure Linen • Embroidered Laurel Crest",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "swatch": os.path.join(wa_shirts_dir, "shirt_185_73b9aca30.jpg"),
        "colors": [
            ("Emerald Teal", [25, 105, 100], "ms108", False),
            ("Powder Blue", [115, 145, 180], "ms108", True),
            ("Coral Salmon", [215, 115, 95], "ms108", False),
            ("Pearl Ivory", [230, 225, 215], "ms108", True),
            ("Lavender Lilac", [145, 125, 165], "ms108", False),
        ]
    },
    "SHRUHI-MS-109": {
        "slug": "ms-109-royal-linen-13-colours",
        "title": "Royal Linen Resort Solid Shirt (13-Colour Master Chart)",
        "sub": "Luxury Resort Linen • Pastel & Jewel Palette • 13 Colours",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "swatch": os.path.join(wa_shirts_dir, "shirt_194_73b9aca39.jpg"),
        "colors": [
            ("Sky Blue", [110, 150, 195], "ms109", False),
            ("Mint Olive", [130, 160, 140], "ms109", True),
            ("Dusty Rose", [195, 135, 145], "ms109", False),
            ("French Navy", [35, 50, 80], "ms109", True),
        ]
    },
    "SHRUHI-MS-110": {
        "slug": "ms-110-dual-pocket-cargo-shirt",
        "title": "Dual-Flap Pocket Utility Casual Shirt (White & Black)",
        "sub": "Heavy Twill Cotton • Dual Buttoned Chest Flap Pockets",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "swatch": os.path.join(wa_shirts_dir, "shirt_199_73b9aca3e.jpg"),
        "colors": [
            ("Crisp White", [240, 238, 235], "ms108", False),
            ("Jet Black", [32, 32, 36], "ms108", True),
        ]
    },
    "SHRUHI-MS-111": {
        "slug": "ms-111-mandarin-collar-linen-solids",
        "title": "Mandarin Bandhgala Collar Slub-Linen Solid Shirt",
        "sub": "Contemporary Chinese Collar • 8 Earthy & Jewel Shades",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "swatch": os.path.join(wa_shirts_dir, "shirt_209_73b9aca48.jpg"),
        "colors": [
            ("Mint Sage Green", [135, 165, 145], "ms111", False),
            ("Midnight Navy", [30, 42, 70], "ms111", True),
            ("Mustard Ochre", [195, 150, 60], "ms111", False),
            ("Rust Terracotta", [165, 80, 50], "ms111", True),
        ]
    },
    "SHRUHI-MS-130": {
        "slug": "ms-130-minimalist-dual-pocket-resort-camp-shirt",
        "title": "Minimalist Dual-Pocket Resort Camp Shirt (White & Black)",
        "sub": "Clean Short-Sleeve Resort Fit • Twin Buttoned Chest Pockets",
        "mrp": "MRP ₹999",
        "sizes": "M, L, XL, 2XL (38–44)",
        "swatch": os.path.join(wa_8849_dir, "ord_553_73b9acb34_D05E3448FE.jpg"),
        "colors": [
            ("Sage Olive", [120, 132, 112], "ms108", False),
            ("Pure White", [240, 238, 235], "ms108", True),
            ("Jet Black", [32, 32, 36], "ms108", False),
            ("Oatmeal Beige", [205, 195, 180], "ms108", True),
        ]
    }
}

print("Regenerating all SOLID collections with pristine tailored models and zero design mismatch...")

for code, spec in SOLID_COLLECTIONS.items():
    slug = spec["slug"]
    title = spec["title"]
    sub = spec["sub"]
    mrp = spec["mrp"]
    sizes = spec["sizes"]
    swatch_p = spec["swatch"]
    colors = spec["colors"]

    print(f"\nProcessing Solid Collection: {code} ({len(colors)} colors)...")

    # 1. Hero Plate = First Color
    hero_name, hero_rgb, hero_model, hero_fl = colors[0]
    hero_im = render_solid_model(hero_model, hero_rgb, flip=hero_fl)
    hero_plate = render_model_luxury_plate(
        model_im=hero_im,
        swatch_src_path=swatch_p,
        code=code,
        title=title,
        sub_title=f"{sub} • Shown in {hero_name}",
        mrp=mrp,
        sizes=sizes,
        is_hero=True
    )

    hero_fn = f"{slug}.jpg"
    hero_plate.save(os.path.join(prod_dir, hero_fn), quality=94, optimize=True)
    hero_plate.save(os.path.join(prod_dir, f"{code.lower()}.jpg"), quality=94)
    print(f"  ✓ Saved Hero: {hero_fn} ({hero_name})")

    # 2. Macro Swatch
    macro_fn = f"{code.lower()}-macro-swatch.jpg"
    macro_plate = render_macro_fabric_plate(swatch_p, code, title, sub)
    macro_plate.save(os.path.join(prod_dir, macro_fn), quality=92, optimize=True)

    # 3. Colorway Gallery Plates (Views 2, 3, 4...)
    # Delete any old extra view files that might have been generated
    for old_v in range(len(colors) + 2, 12):
        old_p = os.path.join(prod_dir, f"{slug}-view-{old_v}.jpg")
        if os.path.exists(old_p):
            os.remove(old_p)

    for c_idx, (c_name, c_rgb, c_model, c_fl) in enumerate(colors[1:]):
        c_im = render_solid_model(c_model, c_rgb, flip=c_fl)
        c_plate = render_model_luxury_plate(
            model_im=c_im,
            swatch_src_path=swatch_p,
            code=code,
            title=title,
            sub_title=f"{c_name} Variant • Color {c_idx + 2} of {len(colors)}",
            mrp=mrp,
            sizes=sizes,
            is_hero=False
        )
        view_fn = f"{slug}-view-{c_idx + 2}.jpg"
        c_plate.save(os.path.join(prod_dir, view_fn), quality=93, optimize=True)
        print(f"  ✓ Saved Colorway: {view_fn} ({c_name})")

print("\n🎉 All SOLID collections have been perfectly regenerated!")
