with open('catalog-data.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'SHRUHI-MS-130' in line:
            print(f'Line {i+1}: {line.strip()[:100]}')
