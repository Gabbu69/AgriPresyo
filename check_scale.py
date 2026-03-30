import sys
from PIL import Image

def analyze(path):
    try:
        img = Image.open(path).convert("RGBA")
        w, h = img.size
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            bx1, by1, bx2, by2 = bbox
            bw = bx2 - bx1
            bh = by2 - by1
            max_dim = max(bw, bh)
            ratio = max_dim / float(max(w, h))
            return f"{path}: size={w}x{h}, max bounding dim={max_dim}, ratio={ratio:.2f}\n"
    except Exception as e:
        pass
    return ""

if __name__ == "__main__":
    out = ""
    out += analyze(r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\watermelon.png")
    out += analyze(r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle_ultimate.png")
    
    with open("scale_output.txt", "w", encoding="utf-8") as f:
        f.write(out)
