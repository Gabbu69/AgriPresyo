import cv2
import numpy as np
from PIL import Image

src_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle_cropped.png"
tgt_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle.png"

def process():
    # Read image
    img = cv2.imread(src_path)
    if img is None:
        print("Could not read image")
        return

    # Grab background color from top left
    bg_color = img[0, 0].astype(int)
    
    # Calculate difference from background color
    diff = np.abs(img.astype(int) - bg_color)
    dist = np.max(diff, axis=2)
    
    # Create mask where difference > 25
    mask = np.where(dist > 25, 255, 0).astype(np.uint8)
    
    # Clean up mask
    kernel = np.ones((5,5),np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # fill any holes inside the pickle contour
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("No contours found")
        return
        
    largest_contour = max(contours, key=cv2.contourArea)
    clean_mask = np.zeros_like(mask)
    cv2.drawContours(clean_mask, [largest_contour], -1, 255, -1)
    
    # Blur edges for smoothness
    clean_mask = cv2.GaussianBlur(clean_mask, (3, 3), 0)
    
    # Convert back to RGBA and apply mask
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = clean_mask
    
    from PIL import Image
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
    squared_img.save(tgt_path, "PNG")
    print(f"Pickle processed and saved to {tgt_path}")

process()
