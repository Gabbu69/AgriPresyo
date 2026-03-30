import os
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def slant_enlarge(filename, angle=-35, target_canvas=510):
    path = os.path.join(CROPS_DIR, filename)
    if not os.path.exists(path):
        print(f"{filename} not found.")
        return
        
    print(f"Slanting {filename} by {-angle} degrees to make it HUGE...")
    img = Image.open(path).convert("RGBA")
    
    # Slant it
    img = img.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Use numpy to find tight bounding box excluding ghost/shadow pixels
    arr = np.array(img)
    alpha = arr[:, :, 3]
    y_indices, x_indices = np.nonzero(alpha > 15)
    
    if len(x_indices) > 0:
        x_min, x_max = x_indices.min(), x_indices.max()
        y_min, y_max = y_indices.min(), y_indices.max()
        
        # crop to this tight box
        img = img.crop((x_min, y_min, x_max, y_max))
        
    w, h = img.size
    
    # Scale up max dim to target_canvas
    scale = target_canvas / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    
    # We use LANCZOS for high quality enlargement
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print(f"Saved {filename} maxed out on a diagonal!")

if __name__ == "__main__":
    slant_enlarge("pineapple.png", angle=-35)
