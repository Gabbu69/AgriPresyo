import os
import cv2
import math
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def force_backslash_slant(filename, enlarge=False):
    path = os.path.join(CROPS_DIR, filename)
    if not os.path.exists(path):
        print(f"{filename} not found.")
        return
        
    print(f"Analyzing {filename}...")
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    alpha = arr[:, :, 3]
    
    y, x = np.nonzero(alpha > 10)
    if len(x) == 0:
        print(f"  Image is empty!")
        return
    
    # Use PCA to find the principal axis of the pixel cluster
    pts = np.vstack((x, y)).T
    mean = np.empty((0))
    res = cv2.PCACompute(pts.astype(np.float32), mean)
    # OpenCV newer versions return (mean, eigenvectors), older might return 3. 
    eigenvectors = res[1]
    
    # principal axis vector
    dx, dy = eigenvectors[0]
    
    # Calculate slope in screen coordinates.
    # A '\' slant means top-left to bottom-right, which is a positive slope in screen coords (since Y grows downwards).
    # A '/' slant means top-right to bottom-left, which is a negative slope in screen coords.
    
    slope = dy / (dx + 1e-8)
    
    # We ignore slopes close to 0 (horizontal) or infinity (vertical)
    if abs(slope) > 0.1 and abs(slope) < 10:
        if slope < 0:
            print(f"  Detected '/' slant (slope: {slope:.2f}). Flipping to '\\'.")
            img = img.transpose(Image.FLIP_LEFT_RIGHT)
        else:
            print(f"  Detected '\\' slant (slope: {slope:.2f}). No flip needed.")
    else:
        print(f"  Image appears mostly vertical/horizontal. Enforcing a slight '\\' slant manually.")
        img = img.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
        
    # Extra check specifically for Upo: if it was perfectly vertical and we relied on the previous flip, let's just make sure it's rotated.
    # Actually, let's just use the crop and scale logic
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    w, h = img.size
    
    # Target scale
    target = 500 if enlarge else 450
    scale = target / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print(f"  Saved {filename} with corrected slant and size!")

if __name__ == "__main__":
    force_backslash_slant("okra.png", enlarge=False)
    force_backslash_slant("upo.png", enlarge=True)
