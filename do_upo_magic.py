import os
import cv2
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
UPO_SRC = r"c:\Users\gabri\.gemini\antigravity\brain\38e74002-8293-4e72-b777-ad5cb76bf9b3\media__1774782529739.jpg"

def magic():
    img = cv2.imread(UPO_SRC)
    h, w = img.shape[:2]
    
    mask = np.zeros((h, w), np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    # Very tight horizontal bounding box.
    # The Upo is dead center.
    # We want x from 38% to 62%, y from 2% to 98%.
    rect = (int(w * 0.38), int(h * 0.02), int(w * 0.24), int(h * 0.96))
    
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 7, cv2.GC_INIT_WITH_RECT)
    
    out_mask = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
    
    # Instead of MORPH_OPEN which destroys the stem, we just smooth the edge!
    # A tiny median blur removes isolated noise pixels.
    out_mask = cv2.medianBlur(out_mask, 5)
    
    # Find largest contour to drop floating background chunks
    contours, _ = cv2.findContours(out_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        largest = max(contours, key=cv2.contourArea)
        clean_mask = np.zeros_like(out_mask)
        cv2.drawContours(clean_mask, [largest], -1, 1, -1)
        out_mask = clean_mask
        
    alpha = out_mask * 255
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    
    b, g, r = cv2.split(img)
    rgba = cv2.merge([r, g, b, alpha])
    
    out = Image.fromarray(rgba)
    
    # Straighten logic
    arr = np.array(out)
    alpha_ch = arr[:, :, 3]
    y, x = np.nonzero(alpha_ch > 10)
    
    if len(x) > 0:
        pts = np.vstack((x, y)).T
        rect_min = cv2.minAreaRect(pts.astype(np.float32))
        (cx, cy), (box_w, box_h), angle = rect_min
        
        if box_w < box_h:
            straight_angle = angle
        else:
            straight_angle = angle - 90
            
        out = out.rotate(straight_angle, resample=Image.Resampling.BICUBIC, expand=True)
        
        alpha2 = np.array(out)[:, :, 3]
        y2, x2 = np.nonzero(alpha2 > 10)
        if len(x2) > 0:
            width = x2.max() - x2.min()
            height = y2.max() - y2.min()
            if width > height:
                out = out.rotate(90, resample=Image.Resampling.BICUBIC, expand=True)
                
    # Crop perfectly
    bbox = out.split()[-1].getbbox()
    if bbox: out = out.crop(bbox)
        
    w_out, h_out = out.size
    print(f"Final aspect ratio (h/w): {h_out/w_out:.2f}")  # Should be > 2.0 for a long Upo!
    
    # Make it big
    scale = 510 / max(w_out, h_out)
    new_w, new_h = int(w_out * scale), int(h_out * scale)
    out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    canvas.paste(out, ((512 - new_w)//2, (512 - new_h)//2), out)
    
    dst = os.path.join(CROPS_DIR, "upo.png")
    canvas.save(dst, "PNG")

if __name__ == "__main__":
    magic()
