import cv2
import numpy as np
from PIL import Image

src_path = r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134938.jpg"
tgt_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle_fixed.png"

# Read image
img = cv2.imread(src_path)
h, w = img.shape[:2]

# The image is a JPG with a centered pickle.
# The dark green background is around RGB(30, 50, 20) and the pickle is bright green RGB(140, 150, 60).
# The grid outside is white/gray.

# Convert to HSV
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Pickle color range in HSV.
# Light/bright greens and yellows.
# Value (brightness) of the pickle is generally high > 80.
# The dark green background has low value < 70.
# The white grid has low saturation < 20.
# The pickle has high saturation > 50 and high value > 80.

lower_pickle = np.array([20, 60, 80])
upper_pickle = np.array([55, 255, 255])

mask = cv2.inRange(hsv, lower_pickle, upper_pickle)

# Morphological operations to clean the mask
kernel = np.ones((5,5), np.uint8)
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

# Keep only the largest contour in the center
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
if contours:
    largest_contour = max(contours, key=cv2.contourArea)
    clean_mask = np.zeros_like(mask)
    cv2.drawContours(clean_mask, [largest_contour], -1, 255, -1)
    
    # Smooth the edges slightly
    clean_mask = cv2.GaussianBlur(clean_mask, (5, 5), 0)
    
    # Apply to image
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = clean_mask
    
    # Convert to PIL
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
    print(f"Pickle cleanly extracted and saved to {tgt_path}")
else:
    print("Could not detect pickle with HSV threshold.")
