import os
import re

txt_path = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a\scratch\decrypted_wa_msgs.txt"

with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Look for targets and text blocks
targets = content.split("=== TARGET")
print(f"Total targets in decrypted_wa_msgs.txt: {len(targets)}")

products = []
for t in targets:
    if not t.strip():
        continue
    # Extract PT_TXT or text
    m_txt = re.search(r"PT_TXT:\s*(.*?)(?=\n===|\Z)", t, re.DOTALL)
    m_ctx = re.search(r"CTX:\s*(.*?)(?=\nPT_HEX|\Z)", t, re.DOTALL)
    
    txt = m_txt.group(1).strip() if m_txt else ""
    ctx = m_ctx.group(1).strip() if m_ctx else ""
    
    # Check if text contains MRP or Size or product keywords
    if "MRP" in txt or "Size" in txt or "SIZE" in txt or "D.NO" in txt or "SHRUHI" in txt:
        products.append({"text": txt, "context": ctx[:150]})

print(f"Found {len(products)} product text mentions in decrypted WA msgs:")
for i, p in enumerate(products):
    clean = " ".join(p["text"].split())
    print(f"{i+1:02d}: {clean[:120]}")
