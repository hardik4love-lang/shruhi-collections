"""
Configuration & Luxury Brand Standards for Product Media Agent
"""
import os
from PIL import ImageFont

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ASSETS_DIR = os.path.join(PROJECT_ROOT, "assets")
PRODUCTS_MENS_DIR = os.path.join(ASSETS_DIR, "products", "mens")
CATALOG_4K_DIR = os.path.join(PROJECT_ROOT, "4K_Branded_Catalog")
VIDEOS_DIR = os.path.join(ASSETS_DIR, "videos")
INCOMING_DIR = os.path.join(os.path.dirname(__file__), "incoming_samples")

os.makedirs(PRODUCTS_MENS_DIR, exist_ok=True)
os.makedirs(CATALOG_4K_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(INCOMING_DIR, exist_ok=True)

# Luxury Brand Color Palette
COLOR_OBSIDIAN = (16, 11, 14)       # Deep luxury studio background
COLOR_OXBLOOD = (122, 20, 54)       # Shruhi Signature Crimson Oxblood
COLOR_OXBLOOD_DARK = (46, 12, 22)   # Header / footer base
COLOR_GOLD_BRIGHT = (245, 217, 142) # 24K Burnished Gold
COLOR_GOLD_MID = (212, 172, 92)     # Classic Gold Accent
COLOR_TEXT_IVORY = (255, 248, 235)  # Crisp readable ivory
COLOR_TEXT_TAUPE = (185, 175, 168)  # Subtle specifications text
COLOR_WA_GREEN = (37, 211, 102)     # Official WhatsApp CTA Green

# Image & Video Dimensions
STUDIO_PORTRAIT_W = 1440
STUDIO_PORTRAIT_H = 1920
VIDEO_REEL_W = 1080
VIDEO_REEL_H = 1920
VIDEO_FPS = 30

# Font loader utility
def load_font(font_names, size):
    windows_fonts = r"C:\Windows\Fonts"
    for name in font_names:
        full_p = os.path.join(windows_fonts, name)
        if os.path.exists(full_p):
            try:
                return ImageFont.truetype(full_p, size)
            except Exception:
                pass
    return ImageFont.load_default()

FONTS = {
    "title_serif": load_font(["georgiab.ttf", "timesbd.ttf", "arialbd.ttf"], 32),
    "sub_serif": load_font(["georgia.ttf", "times.ttf", "arial.ttf"], 20),
    "code_bold": load_font(["arialbd.ttf", "segoeuib.ttf"], 28),
    "mrp_bold": load_font(["georgiab.ttf", "arialbd.ttf"], 28),
    "badge": load_font(["georgiab.ttf", "arialbd.ttf"], 20),
    "footer_bold": load_font(["georgiab.ttf", "arialbd.ttf"], 25),
    "footer_sub": load_font(["arial.ttf", "segoeui.ttf"], 21),
    # Video Fonts
    "video_title": load_font(["georgiab.ttf", "arialbd.ttf"], 64),
    "video_hook": load_font(["segoeuib.ttf", "arialbd.ttf"], 48),
    "video_sub": load_font(["segoeuib.ttf", "arialbd.ttf"], 36),
    "video_price": load_font(["georgiab.ttf", "arialbd.ttf"], 60),
    "video_badge": load_font(["segoeuib.ttf", "arialbd.ttf"], 32),
    "video_cta": load_font(["segoeuib.ttf", "arialbd.ttf"], 40),
}
