import os, re, json, sys
sys.path.insert(0, os.getcwd())
from fix_solid_and_clean_all_plates import SOLID_COLLECTIONS

cat_path = "catalog-data.js"
with open(cat_path, "r", encoding="utf-8") as f:
    text = f.read()

prod_dir = r"assets\products\mens"

for code, spec in SOLID_COLLECTIONS.items():
    slug = spec["slug"]
    views = [f"assets/products/mens/{slug}.jpg", f"assets/products/mens/{code.lower()}-macro-swatch.jpg"]
    # find all view-X files
    view_files = sorted(
        [f for f in os.listdir(prod_dir) if f.startswith(f"{slug}-view-") and f.endswith(".jpg")],
        key=lambda x: int(x.split("-view-")[1].replace(".jpg", ""))
    )
    for vf in view_files:
        views.append(f"assets/products/mens/{vf}")

    # Replace gallery in catalog-data.js for this id
    pattern = rf'("id":\s*"{slug}".*?"gallery":\s*\[)(.*?)(\])'
    m = re.search(pattern, text, re.DOTALL)
    if m:
        gallery_json = json.dumps(views, indent=6)
        # trim outer brackets
        gallery_body = "\n" + gallery_json[1:-1] + "\n    "
        replacement = m.group(1) + gallery_body + m.group(3)
        text = text[:m.start()] + replacement + text[m.end():]
        print(f"Updated gallery for {code} ({slug}): {len(views)} plates")
    else:
        print(f"Could not find gallery for {slug}")

with open(cat_path, "w", encoding="utf-8") as f:
    f.write(text)

print("catalog-data.js updated successfully!")
