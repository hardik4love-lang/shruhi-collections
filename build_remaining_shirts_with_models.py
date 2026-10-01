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

manifest_path = os.path.join(prod_dir, "all_102_processed_shirts_manifest.json")
if not os.path.exists(manifest_path):
    print("Manifest not found:", manifest_path)
    sys.exit(0)

with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Import helper functions from build_all_model_wearing_plates
sys.path.insert(0, base_dir)
from build_all_model_wearing_plates import (
    synthesize_model_wearing_shirt,
    render_model_luxury_plate,
    render_macro_fabric_plate,
    CYCLE_MODELS
)

print(f"Loaded manifest with {len(manifest)} items. Processing shirts #131 to #202...")

updated_count = 0
for idx, entry in enumerate(manifest):
    # Process items 131 to 202 (index 30 onwards)
    if idx < 30:
        continue

    code = entry["code"]
    title = entry["title"]
    sub = entry["subtitle"]
    mrp = f"MRP ₹{entry['mrp']}"
    sizes = entry["sizes"]
    src_fn = entry.get("source_file", "")

    # Locate source file
    src_path = None
    if os.path.exists(os.path.join(wa_shirts_dir, src_fn)):
        src_path = os.path.join(wa_shirts_dir, src_fn)
    elif os.path.exists(os.path.join(wa_8849_dir, src_fn)):
        src_path = os.path.join(wa_8849_dir, src_fn)

    if not src_path or not os.path.exists(src_path):
        print(f"Source file not found for {code}: {src_fn}")
        continue

    m_key, fl = CYCLE_MODELS[idx % len(CYCLE_MODELS)]
    model_im = synthesize_model_wearing_shirt(m_key, src_path, scale=2.1, flip=fl)

    plate = render_model_luxury_plate(
        model_im=model_im,
        swatch_src_path=src_path,
        code=code,
        title=title,
        sub_title=sub,
        mrp=mrp,
        sizes=sizes,
        is_hero=True
    )

    plate_fn = f"{code.lower()}.jpg"
    out_path = os.path.join(prod_dir, plate_fn)
    plate.save(out_path, quality=93, optimize=True)

    # 4K branded
    cat_4k_fn = f"{code.replace('-', '_')}_4K.jpg"
    plate.save(os.path.join(cat_4k_dir, cat_4k_fn), quality=93)

    updated_count += 1
    if updated_count % 10 == 0:
        print(f"  Processed {updated_count} shirts... latest: {code}")

print(f"🎉 Successfully rendered models wearing shirts #131 to #202! Total updated: {updated_count}")
