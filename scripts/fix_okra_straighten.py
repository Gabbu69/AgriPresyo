import os
import cv2
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def real_straighten_okra():
    path = os.path.join(CROPS_DIR, "okra.png")
    if not os.path.exists(path):
        print("okra.png not found")
        return
        
    print("Straightening Okra using minAreaRect...")
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
    
    # In newer OpenCV, angle is between [0, 90). The width corresponds to the first edge.
    if box_w < box_h:
        straight_angle = angle
    else:
        straight_angle = angle - 90
        
    # Rotate to make it vertically straight
    img = img.rotate(straight_angle, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Sometime OpenCV minAreaRect can make it horizontal depending on angle convention.
    # Let's verify by checking the new bounding box.
    alpha = np.array(img)[:, :, 3]
    y, x = np.nonzero(alpha > 10)
    width = x.max() - x.min()
    height = y.max() - y.min()
    
    if width > height:
        print("  Oops, it's horizontal. Rotating 90 degrees...")
        img = img.rotate(90, resample=Image.Resampling.BICUBIC, expand=True)
        
    print("Okra is now mathematically vertical!")
        
    # Rotate clockwise to point to the right ( "/")
    print("Slanting -25 degrees to the right...")
    img = img.rotate(-25, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Crop to exact pixels
    bbox = img.split()[-1].getbbox()
    if bbox: img = img.crop(bbox)
        
    # Enlarge
    w_out, h_out = img.size
    scale = 510 / max(w_out, h_out)
    new_w, new_h = int(w_out * scale), int(h_out * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print("Saved Okra successfully!")

if __name__ == "__main__":
    real_straighten_okra()
