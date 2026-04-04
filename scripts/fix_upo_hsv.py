import os
import cv2
import numpy as np
from PIL import Image

src = r"c:\Users\gabri\.gemini\antigravity\brain\38e74002-8293-4e72-b777-ad5cb76bf9b3\media__1774782529739.jpg"
dst = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\upo.png"

def perfect_upo():
    print(f"Loading {src}")
    img = cv2.imread(src)
    if img is None:
        print("Could not read image")
        return
        
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Upo is a bright/light green. 
    # Background is dark green, which has very low Value/Brightness.
    # Checkerboard is white/grey which has very low Saturation.
    # We can isolate the Upo easily.
    
    # Hue: 25 to 85 covers most greens and yellow-greens.
    # Saturation: > 40 ignores gray/white checkerboard.
    # Value: > 70 ignores the dark green background.
    lower_upo = np.array([20, 40, 70])
    upper_upo = np.array([90, 255, 255])
    
    mask = cv2.inRange(hsv, lower_upo, upper_upo)
    
    # Morphological operations to clean up noise
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # Find the largest contour which should be the Upo
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("Could not find any bright green Upo contour!")
        return
        
    largest_contour = max(contours, key=cv2.contourArea)
    
    final_mask = np.zeros_like(mask)
    cv2.drawContours(final_mask, [largest_contour], -1, 255, thickness=cv2.FILLED)
    
    # Soften the edges of the mask to prevent jagged pixels
    final_mask = cv2.GaussianBlur(final_mask, (5,5), 0)
    
    b, g, r = cv2.split(img)
    rgba = cv2.merge([r, g, b, final_mask])
    
    out = Image.fromarray(rgba)
    
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
        
    # Rotate slightly and flip
    out = out.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
        
    out = out.transpose(Image.FLIP_LEFT_RIGHT)
    
    # Resize up to 480 max dimension
    w, h_img = out.size
    scale = 480 / max(w, h_img)
    new_w, new_h = int(w * scale), int(h_img * scale)
    out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    canvas.paste(out, ((512 - new_w)//2, (512 - new_h)//2), out)
    
    canvas.save(dst, "PNG")
    print("Perfect UPO mask extracted and saved!")

if __name__ == "__main__":
    perfect_upo()
