import os, sys
sys.path.insert(0, r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections")
from build_all_model_wearing_plates import ALL_30_MENS_WEAR

for item in ALL_30_MENS_WEAR:
    code = item["code"]
    title = item["title"]
    sw = os.path.basename(item["swatch_ref"])
    gals = [os.path.basename(f) for f in item["gallery_files"]]
    print(f"{code:15} | {title[:45]:45} | Swatch: {sw} | Gallery: {len(gals)} files")
