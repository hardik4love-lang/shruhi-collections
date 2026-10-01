import os, sys
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

base_dir = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections"
artifact_dir = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a"

sys.path.insert(0, base_dir)
from build_all_model_wearing_plates import (
    MODEL_FILES,
    get_shirt_mask,
    render_model_luxury_plate
)

def render_solid_model(model_key, rgb_color, texture_slub=True, flip=False):
    model_im = Image.open(MODEL_FILES[model_key]).convert("RGB")
    W, H = model_im.size
    mask = get_shirt_mask(model_key)

    arr = np.asarray(model_im, dtype=np.float32)
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

    shirt_vals = lum[mask > 0.5]
    base_lum = np.percentile(shirt_vals, 65) if len(shirt_vals) > 100 else 150.0

    # Shading profile
    shading = np.clip(lum / max(base_lum, 1.0), 0.35, 1.30)
    shading = np.power(shading, 0.95)[:, :, None]

    # Solid color base
    base_rgb = np.array(rgb_color, dtype=np.float32)[None, None, :]
    
    # Add subtle textile slub / micro-weave grain
    np.random.seed(42)
    grain = 1.0 + (np.random.randn(H, W, 1).astype(np.float32) * 0.035)
    
    colored_shirt = np.clip(base_rgb * shading * grain, 0, 255)

    m3 = mask[:, :, None]
    comp = arr * (1.0 - m3) + colored_shirt * m3
    out_im = Image.fromarray(comp.astype(np.uint8))
    if flip:
        out_im = ImageOps.mirror(out_im)
    return out_im

# Test MS-103 Solid Colors
test_colors = {
    "wine": [105, 32, 48],
    "navy": [32, 45, 75],
    "cream": [225, 218, 204],
    "sage": [115, 128, 108],
    "black": [35, 35, 38],
    "rust": [168, 85, 55],
}

test_dir = os.path.join(base_dir, "scratch", "test_solid_shirts")
os.makedirs(test_dir, exist_ok=True)

swatch_p = os.path.join(artifact_dir, "scratch", "wa_mens_shirts", "shirt_169_73b9aca20.jpg")

for name, rgb in test_colors.items():
    im = render_solid_model("ms108", rgb, flip=(name in ["navy", "sage"]))
    plate = render_model_luxury_plate(
        model_im=im,
        swatch_src_path=swatch_p,
        code="SHRUHI-MS-103",
        title="Signature Lycra 4-Way Stretch Solid Shirt",
        sub_title=f"12 Colours Available • Shown in Solid {name.capitalize()}",
        mrp="MRP ₹999",
        sizes="M, L, XL, 2XL (38–44)",
        is_hero=(name == "wine")
    )
    plate.save(os.path.join(test_dir, f"ms103_solid_{name}.jpg"), quality=94)
    print(f"Saved solid plate: ms103_solid_{name}.jpg")

print("All solid test plates generated successfully!")
