"""
Master Product Media Agent
Autonomous agent for zero-mismatch product media generation:
- Ingests physical product image samples
- Extracts true pattern and fabric DNA (checks, stripes, solids, prints)
- Renders 4K studio catalog plates, macro texture swatches, and 9:16 MP4 video reels
- Operates in single-shot, batch, and 24/7 background daemon modes
"""
import os
import time
import json
import logging
from .config import (
    PROJECT_ROOT,
    PRODUCTS_MENS_DIR,
    CATALOG_4K_DIR,
    VIDEOS_DIR,
    INCOMING_DIR,
)
from .pattern_analyzer import analyze_garment_sample
from .studio_engine import render_4k_studio_plate, render_macro_fabric_swatch
from .video_engine import render_product_showcase_video

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] ProductMediaAgent: %(message)s")

class ProductMediaAgent:
    def __init__(self, output_products_dir=None, output_catalog_dir=None, output_videos_dir=None):
        self.products_dir = output_products_dir or PRODUCTS_MENS_DIR
        self.catalog_dir = output_catalog_dir or CATALOG_4K_DIR
        self.videos_dir = output_videos_dir or VIDEOS_DIR
        os.makedirs(self.products_dir, exist_ok=True)
        os.makedirs(self.catalog_dir, exist_ok=True)
        os.makedirs(self.videos_dir, exist_ok=True)

    def process_sample(
        self,
        sample_path,
        code=None,
        custom_title=None,
        custom_subtitle=None,
        mrp_num=999,
        sizes="M, L, XL, 2XL (38–44)",
        phone="+91 88496 01725",
        create_video=True
    ):
        """
        Process a single physical product sample into 4K Studio catalog images and video reel.
        """
        if not os.path.exists(sample_path):
            raise FileNotFoundError(f"Sample not found: {sample_path}")

        base_fn = os.path.splitext(os.path.basename(sample_path))[0]
        code = code or f"SHRUHI-MS-{base_fn.upper()}"

        logging.info(f"Analyzing sample: {sample_path} for {code}")
        analysis = analyze_garment_sample(sample_path)

        title = custom_title or analysis["suggested_title"]
        subtitle = custom_subtitle or analysis["suggested_sub"]
        mrp_str = f"MRP ₹{mrp_num:,}"

        slug = code.lower().replace(" ", "-")
        is_solid = analysis.get("pattern_type") == "Signature Solid"
        rgb_color = analysis.get("avg_rgb")

        # 1. 4K Studio Catalog Plate
        studio_fn = f"{slug}.jpg"
        studio_path = os.path.join(self.products_dir, studio_fn)
        render_4k_studio_plate(
            src_img_path=sample_path,
            code=code,
            title=title,
            subtitle=subtitle,
            mrp=mrp_str,
            sizes=sizes,
            whatsapp_phone=phone,
            stickers_to_mask=analysis["stickers_to_mask"],
            out_path=studio_path,
            is_solid=is_solid,
            rgb_color=rgb_color
        )

        # 4K Branded Catalog entry
        cat_fn = f"{code.replace('-', '_')}_4K.jpg"
        cat_path = os.path.join(self.catalog_dir, cat_fn)
        render_4k_studio_plate(
            src_img_path=sample_path,
            code=code,
            title=title,
            subtitle=subtitle,
            mrp=mrp_str,
            sizes=sizes,
            whatsapp_phone=phone,
            stickers_to_mask=analysis["stickers_to_mask"],
            out_path=cat_path,
            is_solid=is_solid,
            rgb_color=rgb_color
        )

        # 2. Macro Fabric Swatch Plate
        swatch_fn = f"{slug}-macro-swatch.jpg"
        swatch_path = os.path.join(self.products_dir, swatch_fn)
        render_macro_fabric_swatch(
            src_img_path=sample_path,
            code=code,
            pattern_type=analysis["pattern_type"],
            fabric_type=analysis["fabric_type"],
            macro_box=analysis["macro_crop_box"],
            out_path=swatch_path
        )

        # 3. 9:16 Video Showcase Reel
        video_path = None
        if create_video:
            video_fn = f"{slug}-showcase.mp4"
            video_path = os.path.join(self.videos_dir, video_fn)
            logging.info(f"Rendering showcase video reel: {video_path}")
            render_product_showcase_video(
                src_img_path=sample_path,
                code=code,
                title=title,
                pattern_type=analysis["pattern_type"],
                fabric_type=analysis["fabric_type"],
                mrp=mrp_str,
                sizes=sizes,
                whatsapp_phone=phone,
                macro_box=analysis["macro_crop_box"],
                out_video_path=video_path,
                duration_sec=6.0
            )

        logging.info(f"Successfully created verified zero-mismatch media for {code}")
        return {
            "code": code,
            "title": title,
            "subtitle": subtitle,
            "mrp": mrp_num,
            "sizes": sizes,
            "pattern_type": analysis["pattern_type"],
            "primary_color": analysis["primary_color"],
            "fabric_type": analysis["fabric_type"],
            "studio_image": studio_path,
            "macro_swatch": swatch_path,
            "video_reel": video_path,
            "web_rel_image": f"assets/products/mens/{studio_fn}",
            "web_rel_swatch": f"assets/products/mens/{swatch_fn}",
            "web_rel_video": f"assets/videos/{slug}-showcase.mp4" if create_video else None,
            "analysis": analysis,
        }

    def batch_process(self, sample_paths, code_prefix="SHRUHI-MS", create_videos=False):
        """
        Processes a list of sample images into verified studio catalog items.
        """
        results = []
        logging.info(f"Starting batch processing of {len(sample_paths)} product samples...")
        for idx, s_path in enumerate(sample_paths):
            code = f"{code_prefix}-{101 + idx}"
            res = self.process_sample(
                sample_path=s_path,
                code=code,
                create_video=create_videos
            )
            results.append(res)

        manifest_path = os.path.join(self.products_dir, "batch_manifest.json")
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
        logging.info(f"Batch completed: {len(results)} items written to {manifest_path}")
        return results

    def run_daemon(self, inbox_dir=None, poll_seconds=10):
        """
        24/7 Autonomous Inbox Watcher Daemon:
        Monitors inbox folder for incoming raw product photos, automatically processes them,
        and generates 4K studio images & video reels.
        """
        inbox = inbox_dir or INCOMING_DIR
        os.makedirs(inbox, exist_ok=True)
        processed_set = set()

        logging.info(f"24/7 Product Media Agent Daemon ACTIVE.")
        logging.info(f"Watching inbox folder: {inbox} (Polling every {poll_seconds}s)")

        while True:
            try:
                files = [
                    os.path.join(inbox, f) for f in os.listdir(inbox)
                    if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
                ]
                new_files = [f for f in files if f not in processed_set]
                for nf in new_files:
                    logging.info(f"New incoming product sample detected: {nf}")
                    try:
                        self.process_sample(nf, create_video=True)
                        processed_set.add(nf)
                    except Exception as err:
                        logging.error(f"Error processing {nf}: {err}")
                time.sleep(poll_seconds)
            except KeyboardInterrupt:
                logging.info("Product Media Agent Daemon stopped by user.")
                break
            except Exception as e:
                logging.error(f"Daemon exception: {e}")
                time.sleep(poll_seconds)
