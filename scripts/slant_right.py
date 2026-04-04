import os
import cv2
import math
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
UPO_SRC = r"c:\Users\gabri\.gemini\antigravity\brain\38e74002-8293-4e72-b777-ad5cb76bf9b3\media__1774782529739.jpg"

def fix_upo_right_slant():
    print("Extracting Upo and slanting right...")
    img = cv2.imread(UPO_SRC)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    lower_upo = np.array([20, 40, 70])
    upper_upo = np.array([90, 255, 255])
    mask = cv2.inRange(hsv, lower_upo, upper_upo)
    
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_contour = max(contours, key=cv2.contourArea)
    
    final_mask = np.zeros_like(mask)
    cv2.drawContours(final_mask, [largest_contour], -1, 255, thickness=cv2.FILLED)
    final_mask = cv2.GaussianBlur(final_mask, (5,5), 0)
    
    b, g, r = cv2.split(img)
    rgba = cv2.merge([r, g, b, final_mask])
    out = Image.fromarray(rgba)
    
    bbox = out.split()[-1].getbbox()
    if bbox: out = out.crop(bbox)
        
    # Original is perfectly straight.
    # Rotate RIGHT (clockwise) by 25 degrees. Negative angle is clockwise.
    out = out.rotate(-25, resample=Image.Resampling.BICUBIC, expand=True)
    
    bbox = out.split()[-1].getbbox()
    if bbox: out = out.crop(bbox)
    
    w, h = out.size
    scale = 510 / max(w, h) # HUGE
    new_w, new_h = int(w * scale), int(h * scale)
    out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    canvas.paste(out, ((512 - new_w)//2, (512 - new_h)//2), out)
    canvas.save(os.path.join(CROPS_DIR, "upo.png"), "PNG")

def fix_okra_right_slant():
    path = os.path.join(CROPS_DIR, "okra.png")
    if not os.path.exists(path): return
        
    print(f"Straightening and slanting right for Okra...")
    img = Image.open(path).convert("RGBA")
    
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if bbox: img = img.crop(bbox)
    
    arr = np.array(img)
    alpha_arr = arr[:, :, 3]
    
    y, x = np.nonzero(alpha_arr > 10)
    pts = np.vstack((x, y)).T
    mean = np.empty((0))
    res = cv2.PCACompute(pts.astype(np.float32), mean)
    dx, dy = res[1][0]
    
    # Calculate angle from vertical (Y-axis)
    angle_from_y = math.degrees(math.atan2(dx, dy))
    
    # We want to rotate it mathematically back to straight (angle_from_y)
    # Then subtract 25 degrees so it rotates clockwise (to the right).
    final_rotation = angle_from_y - 25
    
    rotated = img.rotate(final_rotation, resample=Image.Resampling.BICUBIC, expand=True)
    
    alpha_rot = rotated.split()[-1]
    bbox2 = alpha_rot.getbbox()
    if bbox2: rotated = rotated.crop(bbox2)
        
    w, h = rotated.size
    scale = 510 / max(w, h) # HUGE
    new_w, new_h = int(w * scale), int(h * scale)
    rotated = rotated.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    canvas.paste(rotated, ((512 - new_w)//2, (512 - new_h)//2), rotated)
    canvas.save(path, "PNG")

if __name__ == "__main__":
    fix_upo_right_slant()
    fix_okra_right_slant()
