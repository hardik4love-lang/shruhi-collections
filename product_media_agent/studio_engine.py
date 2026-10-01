"""
4K Studio Image & Macro Swatch Engine
Transforms raw product samples into branded luxury studio catalog plates and macro fabric texture swatches.
Preserves the exact physical garment design, weave, and pattern.
"""
import os
from PIL import Image, ImageDraw, ImageEnhance, ImageOps
from .config import (
    COLOR_OBSIDIAN,
    COLOR_OXBLOOD,
    COLOR_OXBLOOD_DARK,
    COLOR_GOLD_BRIGHT,
    COLOR_GOLD_MID,
    COLOR_TEXT_IVORY,
    COLOR_TEXT_TAUPE,
    STUDIO_PORTRAIT_W,
    STUDIO_PORTRAIT_H,
    FONTS,
)

def render_4k_studio_plate(
    src_img_path,
    code,
    title,
    subtitle,
    mrp="MRP ₹999",
    sizes="M, L, XL, 2XL (38–44)",
    whatsapp_phone="+91 88496 01725",
    stickers_to_mask=None,
    out_path=None
):
    """
    Renders an ultra-high-definition 1440x1920 Studio Catalog Plate
    with royal obsidian-maroon frame and gold-embossed typography.
    """
    im = Image.open(src_img_path).convert("RGB")
    w, h = im.size

    # 1. Clean outer phone border
    mx, my = int(w * 0.015), int(h * 0.015)
    im = im.crop((mx, my, w - mx, h - my))
    w, h = im.size

    # 2. Mask supplier stickers with 24K Gold luxury plaques
    if stickers_to_mask:
        dr = ImageDraw.Draw(im)
        for rect in stickers_to_mask:
            rx1, ry1, rx2, ry2 = rect[0], rect[1], rect[2], rect[3]
            badge_text = rect[4] if len(rect) > 4 else "SURAT LOOM DIRECT"
            x1, y1 = max(0, int(rx1 * w) - 4), max(0, int(ry1 * h) - 4)
            x2, y2 = min(w, int(rx2 * w) + 4), min(h, int(ry2 * h) + 4)
            # Luxury plaque
            dr.rounded_rectangle([x1, y1, x2, y2], radius=10, fill=COLOR_OXBLOOD_DARK, outline=COLOR_GOLD_MID, width=2)
            # Text inside plaque
            bbox = dr.textbbox((0, 0), badge_text, font=FONTS["badge"])
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            tx = x1 + max(6, (x2 - x1 - tw) // 2)
            ty = y1 + max(3, (y2 - y1 - th) // 2 - 2)
            dr.text((tx, ty), badge_text, font=FONTS["badge"], fill=COLOR_GOLD_BRIGHT)

    # 3. Studio lighting, fiber sharpness and micro-contrast enhancement
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.04)
    im = ImageEnhance.Sharpness(im).enhance(1.20)

    # 4. Composite onto luxury 1440x1920 studio portrait canvas
    canvas = Image.new("RGB", (STUDIO_PORTRAIT_W, STUDIO_PORTRAIT_H), COLOR_OBSIDIAN)
    draw = ImageDraw.Draw(canvas)

    header_h = 126
    footer_h = 112
    vp_top = header_h
    vp_h = STUDIO_PORTRAIT_H - header_h - footer_h
    vp_w = STUDIO_PORTRAIT_W - 40

    # Check if a human model is already present
    from .model_synthesizer import has_human_model, synthesize_model_wearing_garment
    is_model = has_human_model(im)

    if not is_model:
        # User requirement: If pic doesn't contain a model, ADD ONE!
        model_im = synthesize_model_wearing_garment(im, model_pose="athletic_tailored")
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
        im_resized = ImageEnhance.Sharpness(im_resized).enhance(1.15)
        px = (STUDIO_PORTRAIT_W - vp_w) // 2
        py = vp_top

        draw.rounded_rectangle(
            [px - 4, py - 4, px + vp_w + 4, py + vp_h + 4],
            radius=14,
            outline=COLOR_GOLD_MID,
            width=3
        )
        canvas.paste(im_resized, (px, py))

        # Bottom-Right Inset Card: "100% ORIGINAL FABRIC PROOF"
        try:
            sww, swh = im.size
            sw_crop = im.crop((int(sww * 0.20), int(swh * 0.22), int(sww * 0.80), int(swh * 0.78)))
            inset_w, inset_h = 340, 420
            sw_thumb = sw_crop.resize((inset_w, inset_h - 40), Image.Resampling.LANCZOS)
            sw_thumb = ImageEnhance.Sharpness(sw_thumb).enhance(1.2)

            ix2 = STUDIO_PORTRAIT_W - 45
            ix1 = ix2 - inset_w
            iy2 = STUDIO_PORTRAIT_H - 135
            iy1 = iy2 - inset_h

            draw.rounded_rectangle([ix1 - 5, iy1 - 5, ix2 + 5, iy2 + 5], radius=16, fill=(22, 12, 17), outline=COLOR_GOLD_BRIGHT, width=3)
            canvas.paste(sw_thumb, (ix1, iy1))

            draw.rectangle([ix1, iy2 - 38, ix2, iy2], fill=(22, 12, 17))
            draw.text((ix1 + 18, iy2 - 32), "100% ORIGINAL FABRIC PROOF", font=FONTS["badge"], fill=COLOR_GOLD_BRIGHT)
        except Exception as e:
            pass
    else:
        img_ratio = w / h
        vp_ratio = vp_w / vp_h
        if img_ratio > vp_ratio:
            new_w = vp_w
            new_h = int(vp_w / img_ratio)
        else:
            new_h = vp_h
            new_w = int(vp_h * img_ratio)

        im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        px = (STUDIO_PORTRAIT_W - new_w) // 2
        py = vp_top + (vp_h - new_h) // 2

        # Hairline 24K Gold Frame around garment
        draw.rounded_rectangle(
            [px - 4, py - 4, px + new_w + 4, py + new_h + 4],
            radius=14,
            outline=COLOR_GOLD_MID,
            width=3
        )
        canvas.paste(im_resized, (px, py))

    # Top Luxury Header Bar
    draw.rectangle([0, 0, STUDIO_PORTRAIT_W, header_h], fill=COLOR_OXBLOOD_DARK)
    draw.line([(0, header_h), (STUDIO_PORTRAIT_W, header_h)], fill=COLOR_GOLD_BRIGHT, width=3)

    # Top Brand Title
    draw.text((32, 22), "SHRUHI COLLECTIONS  •  MEN'S LUXURY EDITION", font=FONTS["title_serif"], fill=COLOR_GOLD_BRIGHT)
    draw.text((34, 68), f"{title}  ({subtitle})", font=FONTS["sub_serif"], fill=COLOR_TEXT_IVORY)

    # Top-Right Code & MRP Pill
    pill_w = 460
    pill_x1 = STUDIO_PORTRAIT_W - pill_w - 24
    pill_y1 = 16
    pill_x2 = STUDIO_PORTRAIT_W - 24
    pill_y2 = 108
    draw.rounded_rectangle([pill_x1, pill_y1, pill_x2, pill_y2], radius=14, fill=COLOR_OXBLOOD, outline=COLOR_GOLD_BRIGHT, width=2)
    draw.text((pill_x1 + 18, pill_y1 + 14), f"{code}  •  {mrp}", font=FONTS["code_bold"], fill=COLOR_TEXT_IVORY)
    draw.text((pill_x1 + 18, pill_y1 + 54), f"SIZES: {sizes}", font=FONTS["footer_sub"], fill=COLOR_GOLD_BRIGHT)

    # Bottom Luxury Footer Bar
    fy = STUDIO_PORTRAIT_H - footer_h
    draw.rectangle([0, fy, STUDIO_PORTRAIT_W, STUDIO_PORTRAIT_H], fill=COLOR_OXBLOOD_DARK)
    draw.line([(0, fy), (STUDIO_PORTRAIT_W, fy)], fill=COLOR_GOLD_BRIGHT, width=3)
    draw.text((32, fy + 20), f"SHRUHI MENSWEAR  •  {code}  •  {mrp}  •  Sizes: {sizes}", font=FONTS["footer_bold"], fill=COLOR_GOLD_BRIGHT)
    draw.text(
        (32, fy + 60),
        f"www.shruhicollections.in   |   WhatsApp Order: {whatsapp_phone}   |   Surat Loom Provenance",
        font=FONTS["footer_sub"],
        fill=COLOR_TEXT_TAUPE
    )

    if out_path:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        canvas.save(out_path, quality=94, optimize=True)

    return canvas

def render_macro_fabric_swatch(
    src_img_path,
    code,
    pattern_type,
    fabric_type,
    macro_box=None,
    out_path=None
):
    """
    Renders a high-magnification macro swatch plate proving 100% genuine fabric texture match.
    """
    im = Image.open(src_img_path).convert("RGB")
    w, h = im.size

    if not macro_box:
        mw, mh = int(w * 0.45), int(h * 0.45)
        cx, cy = w // 2, int(h * 0.48)
        macro_box = (cx - mw // 2, cy - mh // 2, cx + mw // 2, cy + mh // 2)

    crop = im.crop(macro_box)
    crop = ImageEnhance.Sharpness(crop).enhance(1.35)

    CW, CH = STUDIO_PORTRAIT_W, STUDIO_PORTRAIT_H
    canvas = Image.new("RGB", (CW, CH), COLOR_OBSIDIAN)
    draw = ImageDraw.Draw(canvas)

    header_h = 126
    footer_h = 112
    draw.rectangle([0, 0, CW, header_h], fill=COLOR_OXBLOOD_DARK)
    draw.line([(0, header_h), (CW, header_h)], fill=COLOR_GOLD_BRIGHT, width=3)
    draw.text((32, 22), "SHRUHI COLLECTIONS  •  AUTHENTIC FABRIC & WEAVE DETAIL", font=FONTS["title_serif"], fill=COLOR_GOLD_BRIGHT)
    draw.text((34, 68), f"100% Genuine Physical Swatch  •  {pattern_type} ({fabric_type})", font=FONTS["sub_serif"], fill=COLOR_TEXT_IVORY)

    # Central large macro window (1360 x 1600)
    sw_w, sw_h = 1360, 1600
    fitted = ImageOps.fit(crop, (sw_w, sw_h), method=Image.Resampling.LANCZOS)
    sx = (CW - sw_w) // 2
    sy = header_h + (CH - header_h - footer_h - sw_h) // 2
    draw.rounded_rectangle([sx - 4, sy - 4, sx + sw_w + 4, sy + sw_h + 4], radius=16, outline=COLOR_GOLD_MID, width=4)
    canvas.paste(fitted, (sx, sy))

    # Swatch authenticity seal
    draw.rounded_rectangle([sx + 30, sy + 30, sx + 480, sy + 100], radius=12, fill=(12, 8, 14, 230), outline=COLOR_GOLD_BRIGHT, width=2)
    draw.text((sx + 50, sy + 48), "✓ 100% EXACT PHYSICAL FABRIC MATCH", font=FONTS["badge"], fill=COLOR_GOLD_BRIGHT)

    # Footer
    fy = CH - footer_h
    draw.rectangle([0, fy, CW, CH], fill=COLOR_OXBLOOD_DARK)
    draw.line([(0, fy), (CW, fy)], fill=COLOR_GOLD_BRIGHT, width=3)
    draw.text((32, fy + 22), f"{code}  •  AUTHENTIC FIBER & PATTERN PROVENANCE", font=FONTS["footer_bold"], fill=COLOR_GOLD_BRIGHT)
    draw.text((32, fy + 62), "Zero Design Mismatch Guarantee  •  Direct Surat Loom Sourcing", font=FONTS["footer_sub"], fill=COLOR_TEXT_TAUPE)

    if out_path:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        canvas.save(out_path, quality=92, optimize=True)

    return canvas
