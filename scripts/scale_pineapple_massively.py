import os
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def make_massive(filename, scale_factor=1.35):
    path = os.path.join(CROPS_DIR, filename)
    if not os.path.exists(path):
        print(f"{filename} not found.")
        return
        
    print(f"Making {filename} massively huge by sacrificing top/bottom...")
    img = Image.open(path).convert("RGBA")
    
    # 1. Clean the image to a tight bounding box
    arr = np.array(img)
    alpha = arr[:, :, 3]
    y_indices, x_indices = np.nonzero(alpha > 15)
    
    if len(x_indices) > 0:
        x_min, x_max = x_indices.min(), x_indices.max()
        y_min, y_max = y_indices.min(), y_indices.max()
        img = img.crop((x_min, y_min, x_max, y_max))
        
    w, h = img.size
    
    # 2. Scale artificially bigger
    ideal_scale = 512 / max(w, h)
    massive_scale = ideal_scale * scale_factor
    
    new_w, new_h = int(w * massive_scale), int(h * massive_scale)
    
    # 3. Resize and paste in center (overflowing top/bottom will be cropped)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    
    # Shift slightly downwards since pineapple leaves are usually longer than the base
    # offset_y = (512 - new_h) // 2
    # To keep more of the body and chop more leaves, let's just center or shift.
    # Let's crop mostly from the top:
    offset_y = (512 - new_h) // 2 + 30 
    
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print(f"Saved {filename} perfectly straight and huge!")

if __name__ == "__main__":
    make_massive("pineapple.png", scale_factor=1.45)
