import os
import cv2
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def straighten_item(filename, target_size=510):
    path = os.path.join(CROPS_DIR, filename)
    if not os.path.exists(path):
        print(f"{filename} not found.")
        return
        
    print(f"Straightening {filename}...")
    img = Image.open(path).convert("RGBA")
    
    arr = np.array(img)
    alpha = arr[:, :, 3]
    y, x = np.nonzero(alpha > 10)
    
    if len(x) == 0:
        return
        
    pts = np.vstack((x, y)).T
    
    # Find bounding rect
    rect = cv2.minAreaRect(pts.astype(np.float32))
    (cx, cy), (box_w, box_h), angle = rect
    
    if box_w < box_h:
        straight_angle = angle
    else:
        straight_angle = angle - 90
        
    # Rotate to make it vertical
    img = img.rotate(straight_angle, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Ensure it is vertical
    alpha2 = np.array(img)[:, :, 3]
    y2, x2 = np.nonzero(alpha2 > 10)
    if len(x2) > 0:
        width = x2.max() - x2.min()
        height = y2.max() - y2.min()
        
        if width > height:
            img = img.rotate(90, resample=Image.Resampling.BICUBIC, expand=True)
            
    print(f"{filename} is now mathematically vertical!")
    
    # Crop exactly to new pixel boundaries
    bbox = img.split()[-1].getbbox()
    if bbox: img = img.crop(bbox)
        
    # Scale and center
    w_out, h_out = img.size
    scale = target_size / max(w_out, h_out)
    new_w, new_h = int(w_out * scale), int(h_out * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print(f"Saved {filename} perfectly straight!")

if __name__ == "__main__":
    straighten_item("upo.png")
    straighten_item("potato.png")
