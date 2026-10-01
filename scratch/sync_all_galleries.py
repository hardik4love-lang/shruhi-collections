import os, sys, json, re
sys.stdout.reconfigure(encoding="utf-8")

base_dir = r"C:\Users\om\.gemini\antigravity\scratch\shruhi-collections"
manifest_p = os.path.join(base_dir, "scratch", "clean_galleries_manifest.json")
with open(manifest_p, "r", encoding="utf-8") as f:
    manifest = json.load(f)

print(f"Total collections in manifest: {len(manifest)}")

cat_p = os.path.join(base_dir, "catalog-data.js")
with open(cat_p, "r", encoding="utf-8") as f:
    cat_text = f.read()

updated_count = 0
for code, gallery_rel in manifest.items():
    # Match block containing "code": "SHRUHI-MS-XXX" ... "gallery": [ ... ]
    patt = re.compile(r'(\"code\":\s*\"' + re.escape(code) + r'\"[\s\S]*?\"gallery\":\s*\[)([\s\S]*?)(\])')
    m = patt.search(cat_text)
    if m:
        new_gal_inner = "\n" + ",\n".join([f'      "{p}"' for p in gallery_rel]) + "\n    "
        cat_text = cat_text[:m.start(2)] + new_gal_inner + cat_text[m.end(2):]
        updated_count += 1
        print(f"  + Updated gallery for {code}: {len(gallery_rel)} images")
    else:
        print(f"  - Could not find code: {code} in catalog-data.js")

with open(cat_p, "w", encoding="utf-8") as f:
    f.write(cat_text)

print(f"\nSuccessfully updated {updated_count} collections in catalog-data.js!")
