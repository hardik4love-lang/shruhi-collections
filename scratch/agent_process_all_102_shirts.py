"""
Batch script executing ProductMediaAgent across all 102 real factory shirt samples.
Preserves 100% authentic design, pattern, and color.
Eliminates pattern mismatch and legal/consumer risk.
"""
import os
import sys
import json

PROJECT_ROOT = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections"
sys.path.insert(0, PROJECT_ROOT)

from product_media_agent.agent import ProductMediaAgent

SAMPLES_DIR = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a\scratch\wa_mens_shirts"
PROD_MENS_DIR = os.path.join(PROJECT_ROOT, "assets", "products", "mens")
CATALOG_4K_DIR = os.path.join(PROJECT_ROOT, "4K_Branded_Catalog")
VIDEOS_DIR = os.path.join(PROJECT_ROOT, "assets", "videos")

agent = ProductMediaAgent(
    output_products_dir=PROD_MENS_DIR,
    output_catalog_dir=CATALOG_4K_DIR,
    output_videos_dir=VIDEOS_DIR
)

# Get all 102 shirt files
all_shirt_files = sorted([f for f in os.listdir(SAMPLES_DIR) if f.startswith("shirt_") and f.endswith(".jpg")])
print(f"Found {len(all_shirt_files)} real shirt photos to process with ProductMediaAgent.")

processed_records = []

for idx, fn in enumerate(all_shirt_files):
    sample_p = os.path.join(SAMPLES_DIR, fn)
    num = 101 + idx
    code = f"SHRUHI-MS-{num}"

    # Generate video for the first 10 flagship editions, and 4K images for ALL 102
    gen_video = (idx < 5)

    print(f"[{idx+1}/{len(all_shirt_files)}] Agent processing {code} ({fn})...")
    res = agent.process_sample(
        sample_path=sample_p,
        code=code,
        mrp_num=999,
        sizes="M, L, XL, 2XL (38–44)",
        phone="+91 88496 01725",
        create_video=gen_video
    )
    res["source_file"] = fn
    processed_records.append(res)

manifest_out = os.path.join(PROD_MENS_DIR, "all_102_processed_shirts_manifest.json")
with open(manifest_out, "w", encoding="utf-8") as f:
    json.dump(processed_records, f, indent=2)

print(f"\n🎉 Successfully processed all {len(processed_records)} shirts with ProductMediaAgent!")
print(f"Manifest written to: {manifest_out}")
