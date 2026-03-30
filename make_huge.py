import os
import cv2
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def make_huge(*args):
    for filename in args:
        path = os.path.join(CROPS_DIR, filename)
        if not os.path.exists(path):
            continue
            
        print(f"Making {filename} Huge...")
        img = Image.open(path).convert("RGBA")
        
        # crop strictly to pixel boundaries
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        w, h = img.size
        
        # Since these are long skinny crops, scaling them so their height/width touches the edges
        # of the 512 container (Target = 512) will make them look significantly thicker/bigger.
        target = 510
        
        scale = target / max(w, h)
        new_w, new_h = int(w * scale), int(h * scale)
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        offset_x = (512 - new_w) // 2
        offset_y = (512 - new_h) // 2
        canvas.paste(img, (offset_x, offset_y), img)
        
        canvas.save(path, "PNG")
        print(f"Saved {filename} with 510px bounding box!")

if __name__ == "__main__":
    make_huge("okra.png", "upo.png")
