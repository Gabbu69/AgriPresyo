import cv2
import numpy as np
from PIL import Image

src_path = r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134560.jpg"
tgt_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\poncan.png"

img = cv2.imread(src_path)
h, w = img.shape[:2]

hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Orange poncan color range
# Lower and upper limits to catch orange body and green stem.
# Better yet, since there's a green stem on the orange, 
# let's mask out the dark green background and white grid instead!
# Background is dark green. White grid has low sat.
# Mask anything that has either low Saturation (grid) or low Value (dark background).

# We want high saturation and high value.
# The dark green bg has value < 70 roughly.
# The white grid has sat < 20.
S = hsv[:, :, 1]
V = hsv[:, :, 2]

# Keep pixels with Saturation > 40 and Value > 70
mask = np.where((S > 40) & (V > 70), 255, 0).astype(np.uint8)

kernel = np.ones((5,5), np.uint8)
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
if contours:
    largest_contour = max(contours, key=cv2.contourArea)
    clean_mask = np.zeros_like(mask)
    cv2.drawContours(clean_mask, [largest_contour], -1, 255, -1)
    
    clean_mask = cv2.GaussianBlur(clean_mask, (5, 5), 0)
    
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = clean_mask
    
    out_img = Image.fromarray(cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA))
    
    bbox = out_img.split()[-1].getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
        
    w_out, h_out = out_img.size
    max_dim = max(w_out, h_out)
    padding = int(max_dim * 0.18)
    target_size = max_dim + (padding * 2)
    
    squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    offset_x = (target_size - w_out) // 2
    offset_y = (target_size - h_out) // 2
    
    squared_img.paste(out_img, (offset_x, offset_y), out_img)
    if squared_img.width > 512:
        squared_img = squared_img.resize((512, 512), Image.Resampling.LANCZOS)
    squared_img.save(tgt_path, "PNG")
    print(f"Poncan cleanly extracted and saved to {tgt_path}")
else:
    print("Could not detect poncan.")
