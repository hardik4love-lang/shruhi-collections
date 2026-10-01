"""
Showcase Video Reel Engine for Product Media Agent
Produces a 9:16 Vertical 1080x1920 MP4 Video Showcase Reel for any product sample.
Features Ken Burns zoom, authentic macro fabric pan, luxury typography, and WhatsApp ordering dock.
"""
import os
import math
import wave
import struct
import subprocess
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageOps, ImageEnhance
from .config import (
    COLOR_OBSIDIAN,
    COLOR_OXBLOOD,
    COLOR_GOLD_BRIGHT,
    COLOR_GOLD_MID,
    COLOR_WA_GREEN,
    VIDEO_REEL_W,
    VIDEO_REEL_H,
    VIDEO_FPS,
    FONTS,
)

W, H = VIDEO_REEL_W, VIDEO_REEL_H
FPS = VIDEO_FPS

def generate_luxury_audio_track(wav_path, duration_sec):
    """
    Synthesizes a pleasant ambient luxury chime/synth audio track.
    """
    sample_rate = 44100
    total_samples = int(sample_rate * duration_sec)
    notes = [261.63, 329.63, 392.00, 523.25]  # C Major chord notes
    samples = []

    for i in range(total_samples):
        t = i / float(sample_rate)
        # Gentle oscillating harmonics
        envelope = min(1.0, t * 2.0) * max(0.0, 1.0 - (t / duration_sec) ** 0.8)
        val = 0.0
        for idx, freq in enumerate(notes):
            weight = 1.0 / (idx + 1.2)
            val += weight * math.sin(2.0 * math.pi * freq * t + 0.3 * math.sin(2.0 * math.pi * 3.0 * t))
        audio_val = int(val * envelope * 9000.0)
        audio_val = max(-32767, min(32767, audio_val))
        samples.append(audio_val)

    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        raw_data = struct.pack(f"<{len(samples)}h", *samples)
        wf.writeframes(raw_data)

def render_reel_frame(
    im_full,
    im_macro,
    code,
    title,
    pattern_type,
    fabric_type,
    mrp="MRP ₹999",
    sizes="M, L, XL, 2XL",
    whatsapp_phone="+91 88496 01725",
    frame_idx=0,
    total_frames=180
):
    """
    Renders a single 1080x1920 video frame.
    """
    canvas = Image.new("RGB", (W, H), COLOR_OBSIDIAN)
    draw = ImageDraw.Draw(canvas)

    t = frame_idx / float(max(1, total_frames - 1))

    # Phase 1: 0.0 - 0.45 (Full garment reveal with smooth Ken Burns zoom)
    # Phase 2: 0.45 - 0.75 (Macro weave pan demonstrating zero mismatch)
    # Phase 3: 0.75 - 1.0 (Specification & instant order card)

    card_x, card_y, card_w, card_h = 45, 230, 990, 1260

    if t < 0.45:
        phase_t = t / 0.45
        zoom = 1.0 + 0.08 * phase_t
        pw, ph = im_full.size
        crop_w = int(pw / zoom)
        crop_h = int(ph / zoom)
        left = (pw - crop_w) // 2
        top = int((ph - crop_h) * 0.20)
        cropped = im_full.crop((left, top, left + crop_w, top + crop_h))
        fitted = ImageOps.fit(cropped, (card_w, card_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.25))
        canvas.paste(fitted, (card_x, card_y))
        tag_text = "★ 100% AUTHENTIC FACTORY SAMPLE"
    elif t < 0.75:
        phase_t = (t - 0.45) / 0.30
        mw, mh = im_macro.size
        # Smooth horizontal pan across fabric weave
        pan_x = int((mw - 800) * (0.3 + 0.4 * phase_t))
        pan_y = int((mh - 800) * 0.5)
        cropped = im_macro.crop((max(0, pan_x), max(0, pan_y), min(mw, pan_x + 800), min(mh, pan_y + 800)))
        fitted = ImageOps.fit(cropped, (card_w, card_h), method=Image.Resampling.LANCZOS)
        canvas.paste(fitted, (card_x, card_y))
        tag_text = f"★ AUTHENTIC WEAVE: {pattern_type.upper()}"
    else:
        # Final spec view
        fitted = ImageOps.fit(im_full, (card_w, card_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.20))
        canvas.paste(fitted, (card_x, card_y))
        tag_text = "★ SURAT ATELIER • ZERO MISMATCH GUARANTEE"

    # Gold frame around card
    draw.rounded_rectangle([card_x - 4, card_y - 4, card_x + card_w + 4, card_y + card_h + 4], radius=20, outline=COLOR_GOLD_BRIGHT, width=4)

    # Top Header
    draw.rectangle([0, 0, W, 210], fill=COLOR_OXBLOOD)
    draw.line([(0, 210), (W, 210)], fill=COLOR_GOLD_BRIGHT, width=4)
    draw.text((W // 2, 54), "SHRUHI COLLECTIONS  •  MEN'S LUXURY EDITION", font=FONTS["video_badge"], fill=COLOR_GOLD_BRIGHT, anchor="mm")
    draw.text((W // 2, 115), title[:38], font=FONTS["video_hook"], fill=(255, 255, 255), anchor="mm")
    draw.text((W // 2, 168), f"{fabric_type}  •  Surat Direct", font=FONTS["video_sub"], fill=COLOR_GOLD_BRIGHT, anchor="mm")

    # Floating Tag
    draw.rounded_rectangle([card_x + 25, card_y + 25, card_x + 720, card_y + 90], radius=18, fill=(16, 11, 14, 235), outline=COLOR_GOLD_BRIGHT, width=2)
    draw.text((card_x + 45, card_y + 44), tag_text, font=FONTS["video_badge"], fill=COLOR_GOLD_BRIGHT)

    # Pulsing Price Badge (bottom right of product card)
    pulse = int(5 * math.sin(frame_idx * 0.35))
    px1, py1, px2, py2 = card_x + card_w - 380 - pulse, card_y + card_h - 130 - pulse, card_x + card_w - 20 + pulse, card_y + card_h - 20 + pulse
    draw.rounded_rectangle([px1, py1, px2, py2], radius=18, fill=COLOR_GOLD_BRIGHT, outline=(255, 255, 255), width=3)
    draw.text(((px1 + px2) // 2, (py1 + py2) // 2), mrp, font=FONTS["video_price"], fill=(20, 10, 16), anchor="mm")

    # Bottom Call-To-Action Dock
    dock_y = 1515
    draw.rectangle([0, dock_y, W, H], fill=COLOR_OBSIDIAN)
    draw.line([(0, dock_y), (W, dock_y)], fill=COLOR_GOLD_MID, width=2)

    # WhatsApp Order Button
    draw.rounded_rectangle([45, dock_y + 20, W - 45, dock_y + 130], radius=20, fill=COLOR_WA_GREEN, outline=(255, 255, 255), width=3)
    draw.text((W // 2, dock_y + 75), f"WHATSAPP ORDER: {whatsapp_phone}", font=FONTS["video_cta"], fill=(8, 30, 15), anchor="mm")

    # Sizing & Code bar
    draw.rounded_rectangle([45, dock_y + 150, W - 45, dock_y + 240], radius=16, fill=(35, 14, 24), outline=COLOR_GOLD_BRIGHT, width=2)
    draw.text((W // 2, dock_y + 195), f"CODE: {code}  •  SIZES: {sizes}  •  DIRECT SURAT DISPATCH", font=FONTS["video_badge"], fill=COLOR_GOLD_BRIGHT, anchor="mm")

    draw.text((W // 2, dock_y + 290), "www.shruhicollections.in  •  Radical Price Transparency", font=FONTS["video_badge"], fill=(235, 225, 215), anchor="mm")

    return canvas

def render_product_showcase_video(
    src_img_path,
    code,
    title,
    pattern_type,
    fabric_type,
    mrp="MRP ₹999",
    sizes="M, L, XL, 2XL",
    whatsapp_phone="+91 88496 01725",
    macro_box=None,
    out_video_path=None,
    duration_sec=6.0
):
    """
    Renders the complete MP4 video showcase reel with motion and audio.
    """
    im_full = Image.open(src_img_path).convert("RGB")
    fw, fh = im_full.size

    # Clean outer edge
    im_full = im_full.crop((int(fw * 0.015), int(fh * 0.015), int(fw * 0.985), int(fh * 0.985)))
    fw, fh = im_full.size

    if not macro_box:
        mw, mh = int(fw * 0.45), int(fh * 0.45)
        cx, cy = fw // 2, int(fh * 0.48)
        macro_box = (cx - mw // 2, cy - mh // 2, cx + mw // 2, cy + mh // 2)

    im_macro = im_full.crop(macro_box)

    total_frames = int(duration_sec * FPS)

    if not out_video_path:
        out_video_path = os.path.join(os.path.dirname(src_img_path), f"{code}_showcase.mp4")

    os.makedirs(os.path.dirname(out_video_path), exist_ok=True)
    temp_avi = out_video_path.replace(".mp4", "_temp.mp4")
    wav_path = out_video_path.replace(".mp4", "_audio.wav")

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(temp_avi, fourcc, FPS, (W, H))

    for frame_i in range(total_frames):
        pil_frame = render_reel_frame(
            im_full,
            im_macro,
            code,
            title,
            pattern_type,
            fabric_type,
            mrp=mrp,
            sizes=sizes,
            whatsapp_phone=whatsapp_phone,
            frame_idx=frame_i,
            total_frames=total_frames
        )
        bgr = cv2.cvtColor(np.array(pil_frame), cv2.COLOR_RGB2BGR)
        writer.write(bgr)

    writer.release()

    # Generate audio
    generate_luxury_audio_track(wav_path, duration_sec)

    # Merge audio & video via FFmpeg
    try:
        cmd = [
            "ffmpeg", "-y",
            "-i", temp_avi,
            "-i", wav_path,
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "128k",
            "-shortest",
            out_video_path
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        # Clean up temporary files
        if os.path.exists(temp_avi):
            os.remove(temp_avi)
        if os.path.exists(wav_path):
            os.remove(wav_path)
    except Exception as e:
        # Fallback: keep temp mp4 if ffmpeg muxing has an issue
        if os.path.exists(temp_avi):
            if os.path.exists(out_video_path):
                os.remove(out_video_path)
            os.rename(temp_avi, out_video_path)

    return out_video_path
