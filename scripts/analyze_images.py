import os
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def analyze(filename):
    path = os.path.join(CROPS_DIR, filename)
    if not os.path.exists(path):
        return
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    alpha = arr[:, :, 3]
    y, x = np.nonzero(alpha > 15)
    if len(x) > 0:
        w = x.max() - x.min()
        h = y.max() - y.min()
        print(f"{filename}: bbox width={w}, height={h}, img size={img.size}")
    else:
        print(f"{filename}: completely transparent")

if __name__ == "__main__":
    analyze("watermelon.png")
    analyze("potato.png")
    analyze("pineapple.png")
