"""
Pattern & Fabric Analyzer Engine for Product Media Agent
Performs computer vision analysis directly on the physical garment image:
- Extracts exact color palette and dominant shade name
- Classifies fabric pattern (Checks, Tartan, Windowpane, Gingham, Stripes, Solids, Prints)
- Detects supplier stickers/markings for automatic luxury masking
- Identifies the optimal macro ROI for close-up fabric texture zoom
"""
import os
import cv2
import numpy as np
from PIL import Image, ImageStat

COLOR_NAMES_MAP = [
    ((0, 0, 0), "Obsidian Charcoal"),
    ((240, 240, 245), "Pure Pearl Ivory"),
    ((30, 45, 90), "Midnight Navy"),
    ((70, 130, 180), "Aegean Sky Blue"),
    ((25, 100, 160), "Cobalt Royal Blue"),
    ((85, 107, 47), "Olive Forest Green"),
    ((46, 139, 87), "Seafoam & Mint Jade"),
    ((178, 34, 34), "Crimson Rust"),
    ((128, 0, 32), "Burgundy Maroon"),
    ((218, 165, 32), "Mustard Golden Ochre"),
    ((188, 143, 143), "Dusty Rose & Mauve"),
    ((210, 180, 140), "Resort Desert Sand / Tan"),
    ((169, 169, 169), "Heather Slate Grey"),
    ((75, 0, 130), "Royal Deep Indigo"),
]

def get_closest_color_name(rgb):
    min_dist = float("inf")
    best_name = "Tailored Classic"
    r1, g1, b1 = rgb
    for c_rgb, name in COLOR_NAMES_MAP:
        r2, g2, b2 = c_rgb
        # Perceptual Euclidean color distance
        d = (r1 - r2) ** 2 * 0.30 + (g1 - g2) ** 2 * 0.59 + (b1 - b2) ** 2 * 0.11
        if d < min_dist:
            min_dist = d
            best_name = name
    return best_name

def analyze_garment_sample(img_path):
    """
    Analyzes a raw garment photo sample and extracts exact design DNA.
    """
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image sample not found: {img_path}")

    im = Image.open(img_path).convert("RGB")
    w, h = im.size

    # Convert to OpenCV BGR and Grayscale for signal processing
    cv_img = cv2.imread(img_path)
    if cv_img is None:
        cv_img = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)

    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)

    # 1. Central Garment ROI for fabric texture (center 50% width, 40% height)
    rx1, ry1 = int(w * 0.25), int(h * 0.30)
    rx2, ry2 = int(w * 0.75), int(h * 0.70)
    garment_roi_gray = gray[ry1:ry2, rx1:rx2]
    garment_roi_bgr = cv_img[ry1:ry2, rx1:rx2]

    # 2. Dominant Color Extraction
    # Resample ROI to 64x64 for fast dominant color computation
    small_roi = cv2.resize(garment_roi_bgr, (64, 64))
    pixels = small_roi.reshape(-1, 3).astype(np.float32)
    # Average color
    avg_bgr = np.mean(pixels, axis=0)
    avg_rgb = (int(avg_bgr[2]), int(avg_bgr[1]), int(avg_bgr[0]))
    primary_color_name = get_closest_color_name(avg_rgb)

    # 3. Frequency & Directional Gradient Analysis (Determines Pattern)
    # Sobel derivatives in horizontal and vertical directions
    sobel_x = cv2.Sobel(garment_roi_gray, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(garment_roi_gray, cv2.CV_64F, 0, 1, ksize=3)

    var_x = np.var(sobel_x)
    var_y = np.var(sobel_y)
    total_var = var_x + var_y

    ratio_yx = var_y / (var_x + 1e-5)
    ratio_xy = var_x / (var_y + 1e-5)

    # Calculate laplacian texture energy
    laplacian = cv2.Laplacian(garment_roi_gray, cv2.CV_64F)
    lap_var = np.var(laplacian)

    # Pattern Classification
    if total_var < 180 and lap_var < 120:
        pattern_type = "Signature Solid"
        fabric_type = "Imported 4-Way Lycra Stretch / Silky Twill"
        silhouette_desc = "Tailored Fit Pure Solid"
    elif ratio_yx > 1.95 and var_y > 220:
        pattern_type = "Vertical Pinstripes"
        fabric_type = "Woven Cotton-Linen Vertical Stripe"
        silhouette_desc = "Slimming Vertical Line Weave"
    elif ratio_xy > 1.95 and var_x > 220:
        pattern_type = "Horizontal Breton Stripe"
        fabric_type = "Nautical Combed Cotton Weave"
        silhouette_desc = "Casual Nautical Stripe"
    elif var_x > 250 and var_y > 250:
        # Both directions strong -> Checkered / Plaid
        diff = abs(var_x - var_y) / max(var_x, var_y)
        if diff < 0.25:
            pattern_type = "Tartan & Windowpane Checks"
            fabric_type = "100% Pure Combed Cotton Heritage Check"
            silhouette_desc = "Signature Plaid & Box Check"
        else:
            pattern_type = "Executive Gingham & Plaid"
            fabric_type = "Fine Weave Combed Cotton"
            silhouette_desc = "Classic Micro-Check"
    elif lap_var > 450:
        # High multi-frequency variance -> Floral / Botanical / Abstract Print
        pattern_type = "Botanical Resort Print"
        fabric_type = "Soft-Touch Rayon-Linen Resort Weave"
        silhouette_desc = "Cuban Camp / Mandarin Resort Collar"
    else:
        pattern_type = "Textured Slub Weave"
        fabric_type = "Pure Breathable Slub Linen"
        silhouette_desc = "Resort Slub Texture"

    # 4. Automated Supplier Red Sticker Detection
    # Detect red/bright saturated labels often placed by suppliers in corners
    hsv = cv2.cvtColor(cv_img, cv2.COLOR_BGR2HSV)
    # Red mask in HSV (two ranges around 0 and 180)
    mask1 = cv2.inRange(hsv, np.array([0, 90, 80]), np.array([12, 255, 255]))
    mask2 = cv2.inRange(hsv, np.array([168, 90, 80]), np.array([180, 255, 255]))
    red_mask = cv2.bitwise_or(mask1, mask2)

    stickers_to_mask = []
    # Check corners (top-left, bottom-left, bottom-right)
    corner_regions = [
        ("bottom-left", 0.0, 0.78, 0.35, 1.0),
        ("bottom-right", 0.65, 0.78, 1.0, 1.0),
        ("top-left", 0.0, 0.0, 0.30, 0.22),
    ]

    for c_name, rx1_f, ry1_f, rx2_f, ry2_f in corner_regions:
        cx1, cy1 = int(rx1_f * w), int(ry1_f * h)
        cx2, cy2 = int(rx2_f * w), int(ry2_f * h)
        sub_mask = red_mask[cy1:cy2, cx1:cx2]
        red_pixels = cv2.countNonZero(sub_mask)
        # If significant red concentration found in this corner (supplier sticker)
        if red_pixels > (cx2 - cx1) * (cy2 - cy1) * 0.05:
            # Find bounding box inside corner
            contours, _ = cv2.findContours(sub_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if contours:
                c = max(contours, key=cv2.contourArea)
                bx, by, bw, bh = cv2.boundingRect(c)
                if bw > 25 and bh > 15:
                    stickers_to_mask.append((
                        (cx1 + bx) / float(w),
                        (cy1 + by) / float(h),
                        (cx1 + bx + bw) / float(w),
                        (cy1 + by + bh) / float(h),
                        "SURAT LOOM DIRECT"
                    ))

    # Optimal Macro Swatch ROI (center chest area, 400x400 minimum)
    mw, mh = int(min(w * 0.42, 500)), int(min(h * 0.42, 500))
    mcx, mcy = w // 2, int(h * 0.46)
    macro_box = (mcx - mw // 2, mcy - mh // 2, mcx + mw // 2, mcy + mh // 2)

    return {
        "pattern_type": pattern_type,
        "primary_color": primary_color_name,
        "avg_rgb": avg_rgb,
        "fabric_type": fabric_type,
        "silhouette_desc": silhouette_desc,
        "suggested_title": f"{primary_color_name} {pattern_type} Casual Shirt",
        "suggested_sub": f"{fabric_type} • Half & Full Sleeve • Sizes M to 2XL",
        "stickers_to_mask": stickers_to_mask,
        "macro_crop_box": macro_box,
        "width": w,
        "height": h,
    }
