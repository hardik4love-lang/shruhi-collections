import os
import glob
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

BRAIN_DIR = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a"
UPLOAD_DIR = os.path.join(BRAIN_DIR, ".user_uploaded")
PROJECT_DIR = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections"
ASSETS_DIR = os.path.join(PROJECT_DIR, "assets", "products")
CATALOG_4K_DIR = os.path.join(PROJECT_DIR, "4K_Branded_Catalog")

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(CATALOG_4K_DIR, exist_ok=True)

TARGET_W, TARGET_H = 2880, 3840  # True 4K UHD Portrait (3:4)

FONT_DIR = r"C:\Windows\Fonts"
def get_font(name, size):
    path = os.path.join(FONT_DIR, name)
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    return ImageFont.truetype(os.path.join(FONT_DIR, "georgia.ttf"), size)


def upscale_and_sharpen_4k(pil_img, crop_box=None, denoise_strength=0):
    """Crops, denoises paper grain if needed, upscales to 2880x3840 (4K UHD), and applies studio sharpening."""
    if crop_box:
        pil_img = pil_img.crop(crop_box)

    if denoise_strength > 0:
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        cv_img = cv2.bilateralFilter(cv_img, d=7, sigmaColor=denoise_strength, sigmaSpace=denoise_strength)
        lab = cv2.cvtColor(cv_img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=1.35, tileGridSize=(8, 8))
        l = clahe.apply(l)
        cv_img = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)
        pil_img = Image.fromarray(cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB))

    src_w, src_h = pil_img.size
    target_ratio = TARGET_W / TARGET_H
    src_ratio = src_w / src_h

    if abs(src_ratio - target_ratio) > 0.02:
        if src_ratio > target_ratio:
            new_w = int(src_h * target_ratio)
            left = (src_w - new_w) // 2
            pil_img = pil_img.crop((left, 0, left + new_w, src_h))
        else:
            new_h = int(src_w / target_ratio)
            top = (src_h - new_h) // 2
            pil_img = pil_img.crop((0, top, src_w, top + new_h))

    img_4k = pil_img.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    img_4k = img_4k.filter(ImageFilter.UnsharpMask(radius=2.2, percent=135, threshold=3))
    img_4k = ImageEnhance.Color(img_4k).enhance(1.06)
    img_4k = ImageEnhance.Contrast(img_4k).enhance(1.04)
    return img_4k


def draw_diamond(draw, cx, cy, r, fill):
    draw.polygon([(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)], fill=fill)


def draw_luxury_brand_plaque(img_4k, subtitle_text, theme="ivory-plaque", custom_box=(1800, 90, 2800, 560)):
    """
    Renders a 4K ultra-crisp 'SHRUHI COLLECTIONS' editorial header plaque on images 14-19.
    """
    draw = ImageDraw.Draw(img_4k, "RGBA")

    f_brand = get_font("georgiab.ttf", 122)
    f_collect = get_font("georgia.ttf", 60)
    f_sub = get_font("palai.ttf", 44)
    f_crest = get_font("georgiab.ttf", 72)

    x1, y1, x2, y2 = custom_box
    cx = (x1 + x2) // 2
    cy = (y1 + y2) // 2

    if theme == "lock-tab":
        # Completely replaces the original white top-left badge tab in Image 14
        draw.rounded_rectangle([x1, y1, x2, y2], radius=80, fill=(242, 241, 237, 255))
        draw.rounded_rectangle([x1 + 24, y1 + 24, x2 - 24, y2 - 24], radius=64, fill=None, outline=(180, 131, 46, 190), width=4)
        text_main = (62, 15, 27, 255)
        text_gold = (165, 116, 34, 255)
        text_sub = (80, 60, 64, 255)
    elif theme == "wall-blend-light":
        # Erase any right-edge logo remnant on the light studio wall of Image 18 (5625) before drawing the plaque
        draw.rectangle([x1 - 20, y1 - 30, TARGET_W, y2 + 30], fill=(238, 239, 234, 255))
        draw.rounded_rectangle([x1, y1, x2, y2], radius=32, fill=(244, 243, 238, 255), outline=(180, 131, 46, 235), width=5)
        draw.rounded_rectangle([x1 + 14, y1 + 14, x2 - 14, y2 - 14], radius=22, fill=None, outline=(180, 131, 46, 120), width=2)
        text_main = (62, 15, 27, 255)
        text_gold = (165, 116, 34, 255)
        text_sub = (70, 55, 58, 255)
    elif theme == "ivory-plaque":
        # Solid 100% opaque luxury studio card with double gold hairline border
        draw.rounded_rectangle([x1, y1, x2, y2], radius=28, fill=(251, 247, 240, 255), outline=(180, 131, 46, 255), width=5)
        draw.rounded_rectangle([x1 + 16, y1 + 16, x2 - 16, y2 - 16], radius=20, fill=None, outline=(180, 131, 46, 140), width=2)
        text_main = (62, 15, 27, 255)
        text_gold = (165, 116, 34, 255)
        text_sub = (80, 60, 64, 255)
    elif theme == "dark-luxe":
        draw.rounded_rectangle([x1, y1, x2, y2], radius=28, fill=(26, 16, 20, 255), outline=(212, 175, 55, 255), width=5)
        draw.rounded_rectangle([x1 + 16, y1 + 16, x2 - 16, y2 - 16], radius=20, fill=None, outline=(212, 175, 55, 130), width=2)
        text_main = (250, 242, 228, 255)
        text_gold = (223, 192, 130, 255)
        text_sub = (235, 220, 200, 255)

    # Vertical layout centered around cy
    crest_r = 48
    crest_y = cy - 145
    draw.ellipse([cx - crest_r, crest_y - crest_r, cx + crest_r, crest_y + crest_r],
                 fill=(62, 15, 27, 255), outline=(212, 175, 55, 255), width=3)
    draw.text((cx, crest_y - 3), "S", font=f_crest, fill=(223, 192, 130, 255), anchor="mm")

    draw.text((cx, cy - 22), "SHRUHI", font=f_brand, fill=text_main, anchor="mm")
    draw.text((cx, cy + 70), "C O L L E C T I O N S", font=f_collect, fill=text_gold, anchor="mm")

    line_y = cy + 120
    draw.line([(x1 + 85, line_y), (x2 - 85, line_y)], fill=text_gold, width=3)
    draw_diamond(draw, cx, line_y, 8, text_gold)

    draw.text((cx, cy + 168), subtitle_text, font=f_sub, fill=text_sub, anchor="mm")
    return img_4k


def add_bottom_4k_signature_ribbon(img_4k, code_label):
    """Adds a clean luxury footer strip at the very bottom edge with domain & WhatsApp (no missing glyph boxes)."""
    draw = ImageDraw.Draw(img_4k, "RGBA")
    bar_h = 88
    y_top = TARGET_H - bar_h
    ym = y_top + bar_h // 2

    draw.rectangle([0, y_top, TARGET_W, TARGET_H], fill=(32, 12, 18, 245))
    draw.line([(0, y_top), (TARGET_W, y_top)], fill=(212, 175, 55, 235), width=4)

    f_bar = get_font("georgia.ttf", 36)
    f_bar_bold = get_font("georgiab.ttf", 38)

    gold_col = (223, 192, 130, 255)
    draw_diamond(draw, 64, ym, 10, gold_col)
    draw.text((92, ym), f"SHRUHI COLLECTIONS   |   {code_label}", font=f_bar_bold, fill=gold_col, anchor="lm")
    draw.text((TARGET_W // 2, ym), "www.shruhicollections.in", font=f_bar_bold, fill=(255, 255, 255, 255), anchor="mm")
    draw.text((TARGET_W - 92, ym), "WhatsApp / Inquiry: +91 63552 85433", font=f_bar, fill=gold_col, anchor="rm")
    draw_diamond(draw, TARGET_W - 64, ym, 10, gold_col)
    return img_4k


def find_generated_file(prefix):
    matches = glob.glob(os.path.join(BRAIN_DIR, f"{prefix}_*.jpg"))
    return sorted(matches)[-1] if matches else None


# 1. Process Images 1 to 13
ai_items = [
    ("01_SHRUHI_MEERA_4K.jpg", "meera-mustard-plus-size-suit.jpg", "shruhi_01_meera_4k", "DESIGN: MEERA (3XL-5XL)", (45, 45, 850, 1145)),
    ("02_SHRUHI_ASTHA_4K.jpg", "astha-maroon-aline-kurti-set.jpg", "shruhi_02_astha_4k", "DESIGN: ASTHA", None),
    ("03_SHRUHI_LAMEX_4K.jpg", "styleefik-lamex-bronze-suit.jpg", "shruhi_03_lamex_4k", "DESIGN: LAMEX", None),
    ("04_SHRUHI_TEJAL_4K.jpg", "styleefik-tejal-ochre-sharara-set.jpg", "shruhi_04_tejal_4k", "DESIGN: TEJAL", None),
    ("05_SHRUHI_MONI_4K.jpg", "moni-pastel-twin-suit-set.jpg", "shruhi_05_moni_4k", "DESIGN: MONI TWIN SET", (30, 30, 865, 1165)),
    ("06_SHRUHI_DNO1042_4K.jpg", "dno-1042-olive-teal-plus-size-suit.jpg", "shruhi_06_dno1042_4k", "DESIGN: D.NO 1042 (3XL-6XL)", None),
    ("07_SHRUHI_KITTYPARTY_4K.jpg", "styleefik-kitty-party-mustard-coord.jpg", "shruhi_07_kittyparty_4k", "DESIGN: KITTY PARTY CO-ORD", None),
    ("08_SHRUHI_MANIKA_4K.jpg", "styleefik-manika-mauve-suit.jpg", "shruhi_08_manika_4k", "DESIGN: MANIKA", None),
    ("09_SHRUHI_ALKAPURI_4K.jpg", "alkapuri-wine-palazzo-suit.jpg", "shruhi_09_alkapuri_4k", "DESIGN: ALKAPURI", None),
    ("10_SHRUHI_DNO1038_4K.jpg", "dno-1038-maroon-ajrakh-plus-size-suit.jpg", "shruhi_10_dno1038_4k", "DESIGN: D.NO 1038 (3XL-6XL)", None),
    ("11_SHRUHI_4781_4K.jpg", "mostyle-4781-ivory-floral-tunic.jpg", "shruhi_11_mostyle4781_4k", "DESIGN CODE: 4781", None),
    ("12_SHRUHI_5708_4K.jpg", "mostyle-5708-cream-floral-coord.jpg", "shruhi_12_mostyle5708_4k", "DESIGN CODE: 5708", None),
    ("13_SHRUHI_VALENTINA_4K.jpg", "valentina-magenta-patola-suit.jpg", "shruhi_13_valentina_4k", "DESIGN: VALENTINA", (12, 28, 868, 1168)),
]

for numbered_name, asset_name, prefix, code_label, crop_rel in ai_items:
    src_path = find_generated_file(prefix)
    if not src_path:
        continue
    im = Image.open(src_path).convert("RGB")
    w, h = im.size
    crop_box = None
    if crop_rel:
        sx, sy = w / 896.0, h / 1200.0
        crop_box = (int(crop_rel[0] * sx), int(crop_rel[1] * sy), int(crop_rel[2] * sx), int(crop_rel[3] * sy))

    img_4k = upscale_and_sharpen_4k(im, crop_box=crop_box, denoise_strength=0)
    img_4k = add_bottom_4k_signature_ribbon(img_4k, code_label)

    img_4k.save(os.path.join(ASSETS_DIR, asset_name), "JPEG", quality=95, subsampling=0, dpi=(300, 300))
    img_4k.save(os.path.join(CATALOG_4K_DIR, numbered_name), "JPEG", quality=95, subsampling=0, dpi=(300, 300))
    img_4k.save(os.path.join(BRAIN_DIR, numbered_name), "JPEG", quality=95, subsampling=0, dpi=(300, 300))


# 2. Process Images 14 to 19 with full coverage of old logos
studio_items = [
    {
        "numbered": "14_SHRUHI_LOCK_4K.jpg",
        "asset": "lock-coffee-brown-deer-motif-suit.jpg",
        "raw": "media_1790494610744.jpg",
        "crop": (60, 26, 746, 956),
        "theme": "lock-tab",
        "box": (25, -40, 775, 855),
        "subtitle": "Lock Edition • www.shruhicollections.in",
        "code_label": "DESIGN: LOCK",
        "denoise": 22
    },
    {
        "numbered": "15_SHRUHI_5810_4K.jpg",
        "asset": "mostyle-5810-black-paisley-midi-dress.jpg",
        "raw": "media_1790494610752.jpg",
        "crop": (54, 46, 742, 938),
        "theme": "ivory-plaque",
        "box": (1840, 80, 2810, 645),
        "subtitle": "Code: 5810 • www.shruhicollections.in",
        "code_label": "DESIGN CODE: 5810",
        "denoise": 18
    },
    {
        "numbered": "16_SHRUHI_B2876_FULL_4K.jpg",
        "asset": "mostyle-b2876-maroon-embroidered-coord.jpg",
        "raw": "media_1790494627127.jpg",
        "crop": (24, 42, 738, 966),
        "theme": "ivory-plaque",
        "box": (1840, 65, 2815, 535),
        "subtitle": "Code: B-2876 • www.shruhicollections.in",
        "code_label": "DESIGN CODE: B-2876",
        "denoise": 18
    },
    {
        "numbered": "17_SHRUHI_B2876_CLOSEUP_4K.jpg",
        "asset": "mostyle-b2876-maroon-embroidered-coord-closeup.jpg",
        "raw": "media_1790494627147.jpg",
        "crop": (18, 22, 755, 984),
        "theme": "ivory-plaque",
        "box": (1840, 65, 2815, 535),
        "subtitle": "Code: B-2876 • www.shruhicollections.in",
        "code_label": "DESIGN CODE: B-2876 (DETAIL)",
        "denoise": 18
    },
    {
        "numbered": "18_SHRUHI_5625_4K.jpg",
        "asset": "mostyle-5625-navy-botanical-tunic.jpg",
        "raw": "media_1790494627160.jpg",
        "crop": (28, 68, 725, 936),
        "theme": "wall-blend-light",
        "box": (1820, 140, 2835, 810),
        "subtitle": "Code: 5625 • www.shruhicollections.in",
        "code_label": "DESIGN CODE: 5625",
        "denoise": 18
    },
    {
        "numbered": "19_SHRUHI_5041_4K.jpg",
        "asset": "mostyle-5041-plum-chevron-kaftan-coord.jpg",
        "raw": "media_1790494627192.jpg",
        "crop": (30, 114, 722, 954),
        "theme": "dark-luxe",
        "box": (1820, 120, 2800, 690),
        "subtitle": "Code: 5041 • www.shruhicollections.in",
        "code_label": "DESIGN CODE: 5041",
        "denoise": 20
    },
]

for item in studio_items:
    raw_path = os.path.join(UPLOAD_DIR, item["raw"])
    im = Image.open(raw_path).convert("RGB")
    img_4k = upscale_and_sharpen_4k(im, crop_box=item["crop"], denoise_strength=item["denoise"])
    img_4k = draw_luxury_brand_plaque(
        img_4k,
        subtitle_text=item["subtitle"],
        theme=item["theme"],
        custom_box=item["box"]
    )
    img_4k = add_bottom_4k_signature_ribbon(img_4k, item["code_label"])

    img_4k.save(os.path.join(ASSETS_DIR, item["asset"]), "JPEG", quality=95, subsampling=0, dpi=(300, 300))
    img_4k.save(os.path.join(CATALOG_4K_DIR, item["numbered"]), "JPEG", quality=95, subsampling=0, dpi=(300, 300))
    img_4k.save(os.path.join(BRAIN_DIR, item["numbered"]), "JPEG", quality=95, subsampling=0, dpi=(300, 300))
    print(f"Updated 4K: {item['numbered']}")

print("ALL 19 4K BRANDED IMAGES UPDATED SUCCESSFULLY!")
