import os
import glob
import cv2
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def get_newest_upload():
    uploads_dir = os.path.join(CROPS_DIR, "new_uploads")
    if not os.path.exists(uploads_dir): return None
    files = glob.glob(os.path.join(uploads_dir, "media__*.png"))
    if not files: return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

def fix_upo_clean():
    path = get_newest_upload()
    if not path:
        print("No image found.")
        return
        
    print(f"Using {path}")
    
    img = cv2.imread(path)
    if img is None:
        print("Failed to load image.")
        return
        
    h, w = img.shape[:2]
    
    mask = np.zeros((h, w), np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    # x, y, width, height
    rect = (int(w * 0.35), int(h * 0.15), int(w * 0.3), int(h * 0.7))
    
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 7, cv2.GC_INIT_WITH_RECT)
    
    mask2 = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
    
    # Refine the mask to remove jagged edges
    kernel = np.ones((3,3), np.uint8)
    mask2 = cv2.morphologyEx(mask2, cv2.MORPH_OPEN, kernel, iterations=1)
    mask2 = cv2.morphologyEx(mask2, cv2.MORPH_CLOSE, kernel, iterations=2)
    
    # Gaussian blur the alpha slightly for anti-aliasing
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
    scale = 440 / max(w_out, h_out)
    new_w, new_h = int(w_out * scale), int(h_out * scale)
    out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(out, (offset_x, offset_y), out)
    
    out_path = os.path.join(CROPS_DIR, "upo.png")
    canvas.save(out_path, "PNG")
    print("Done GrabCut for Upo!")

if __name__ == "__main__":
    fix_upo_clean()
