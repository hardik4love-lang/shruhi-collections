import os, sys
artifact_dir = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a"
sys.path.insert(0, os.path.join(artifact_dir, "scratch"))
from process_all_mens_wear_with_ai_models import ALL_30_MENS_WEAR

for p in ALL_30_MENS_WEAR:
    code = p["code"]
    if code in ["SHRUHI-MS-103", "SHRUHI-MS-106", "SHRUHI-MS-108", "SHRUHI-MS-109", "SHRUHI-MS-110", "SHRUHI-MS-111", "SHRUHI-MS-130", "SHRUHI-MS-107", "SHRUHI-MS-116", "SHRUHI-MS-117", "SHRUHI-MS-128", "SHRUHI-MS-129"]:
        continue
    print(f"=== {code}: {p['title']} ===")
    print("  Model file:", os.path.basename(p.get("model_file", "None")))
    print("  Swatch ref:", os.path.basename(p.get("swatch_ref", "None")))
    print("  Gallery count:", len(p.get("gallery_files", [])))
    for gf in p.get("gallery_files", []):
        print("    -", os.path.basename(gf), "(exists:", os.path.exists(gf), ")")
