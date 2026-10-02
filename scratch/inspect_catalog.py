import json, re

with open('catalog-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

for code in ['SHRUHI-MS-103', 'SHRUHI-MS-106', 'SHRUHI-MS-108', 'SHRUHI-MS-109', 'SHRUHI-MS-110', 'SHRUHI-MS-111', 'SHRUHI-MS-130']:
    m = re.search(r'id:\s*[\'"]' + code + r'[\'"],[\s\S]*?image:\s*[\'"]([^\'"]+)[\'"][\s\S]*?gallery:\s*(\[[^\]]+\])', text)
    if m:
        print(code, 'image:', m.group(1))
        print('   gallery:', m.group(2)[:120], '...\n')
