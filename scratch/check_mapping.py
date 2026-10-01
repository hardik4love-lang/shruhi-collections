import sys
import os

sys.path.insert(0, r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a\scratch")
from process_all_mens_wear_with_ai_models import ALL_30_MENS_WEAR

d = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a\scratch\wa_mens_shirts"
all_102_files = set(os.listdir(d))

mapped_files = set()
print(f"Total collections defined: {len(ALL_30_MENS_WEAR)}")
for item in ALL_30_MENS_WEAR:
    g_files = [os.path.basename(f) for f in item.get("gallery_files", [])]
    mapped_files.update(g_files)
    print(f"{item['code']}: {item['title']} -> {len(g_files)} photos ({', '.join(g_files[:3])}...)")

unmapped = all_102_files - mapped_files
# filter out grid_part, etc.
shirt_unmapped = [f for f in unmapped if f.startswith("shirt_")]
print(f"\nTotal files in 30 collections: {len(mapped_files)}")
print(f"Shirt files unmapped in 30 collections: {len(shirt_unmapped)}")
if shirt_unmapped:
    print("Unmapped shirt files:", sorted(shirt_unmapped))
