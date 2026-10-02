import re

with open('catalog-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'\{\s*"id":\s*"[^"]*",\s*"code":\s*"SHRUHI-MS-130"[\s\S]*?\n\s*\},', text)
if m:
    print(m.group(0))
