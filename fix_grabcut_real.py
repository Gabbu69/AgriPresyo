import os
import cv2
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
UPO_SRC = r"c:\Users\gabri\.gemini\antigravity\brain\38e74002-8293-4e72-b777-ad5cb76bf9b3\media__1774782529739.jpg"

def fix_upo_clean():
    if not os.path.exists(UPO_SRC):
        print(f"Error: {UPO_SRC} not found")
        return
        
    print(f"Processing actual UPO image: {UPO_SRC}")
    
    img = cv2.imread(UPO_SRC)
    if img is None:
        print("Could not read image")
        return
        
    h, w = img.shape[:2]
    
    mask = np.zeros((h, w), np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    # Grabcut rectangle around the Upo.
    # PREVIOUS: rect = (int(w * 0.25), int(h * 0.1), int(w * 0.5), int(h * 0.8))  --> cut tips!
    # NEW: use almost the full height so we don't cut the tip or bottom!
    # x = 25%, y = 2%, width = 50%, height = 96%
    rect = (int(w * 0.25), int(h * 0.02), int(w * 0.5), int(h * 0.96))
    
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 7, cv2.GC_INIT_WITH_RECT)
    
    mask2 = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
    
    kernel = np.ones((3,3), np.uint8)
    mask2 = cv2.morphologyEx(mask2, cv2.MORPH_OPEN, kernel, iterations=1)
    mask2 = cv2.morphologyEx(mask2, cv2.MORPH_CLOSE, kernel, iterations=2)
    
    alpha = mask2 * 255
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    
    b, g, r = cv2.split(img)
    rgba = cv2.merge([r, g, b, alpha])
    
    out = Image.fromarray(rgba)
    
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
        
    out = out.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
        
    out = out.transpose(Image.FLIP_LEFT_RIGHT)
    
    w_out, h_out = out.size
    scale = 480 / max(w_out, h_out)
    new_w, new_h = int(w_out * scale), int(h_out * scale)
    out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(out, (offset_x, offset_y), out)
    
    out_path = os.path.join(CROPS_DIR, "upo.png")
    out_debug = os.path.join(CROPS_DIR, "upo_debug_grab.png")
    canvas.save(out_path, "PNG")
    canvas.save(out_debug, "PNG")
    print("Done GrabCut for ACTUAL Upo with full height!")

if __name__ == "__main__":
    fix_upo_clean()
