import os
import re

d = r"C:\Users\om\.gemini\antigravity\brain\429c21df-045e-435b-b4b0-ace6c43f5c0a\scratch\wa_mens_shirts"
files = sorted([f for f in os.listdir(d) if f.startswith("shirt_")])
print(f"Total shirt files found: {len(files)}")

# Let's inspect the distribution of filenames
numbers = []
for f in files:
    m = re.match(r"shirt_(\d+)_", f)
    if m:
        numbers.append(int(m.group(1)))

print(f"File numbers range from {min(numbers)} to {max(numbers)}")
print("All files:")
for i, f in enumerate(files):
    print(f"{i+1:03d}: {f}")
