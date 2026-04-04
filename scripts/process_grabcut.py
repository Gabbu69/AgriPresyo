import os
import numpy as np
import cv2
from PIL import Image

SRC = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg"
DST = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

FILES_TO_PROCESS = {
    "Atsal.png": "bell-pepper.png",
    "Upo.png": "upo.png",
    "Kalabasa (Squash).png": "kalabasa.png",
    "Poncan.png": "poncan.png",
    "Fuji Apple.png": "apple.png",
    "Grapes.png": "grapes.png",
}

def process_image(src_path, dst_path):
    print(f"Processing (GrabCut): {os.path.basename(src_path)} -> {os.path.basename(dst_path)}")
    
    # Read the image
    img_pil = Image.open(src_path).convert("RGBA")
    arr = np.array(img_pil)
    
    # 1. Crop out obvious transparent borders to isolate the card
    alpha = arr[:, :, 3]
    active = alpha > 10
    rows = np.any(active, axis=1)
    cols = np.any(active, axis=0)
    if not np.any(rows) or not np.any(cols):
        return
        
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    cropped = arr[rmin:rmax+1, cmin:cmax+1].copy()
    h, w = cropped.shape[:2]
    
    # Working image (RGB) for GrabCut
    img_bgr = cv2.cvtColor(cropped, cv2.COLOR_RGBA2BGR)
    
    # Create mask initialized to 0 (cv2.GC_BGD)
    mask = np.zeros((h, w), np.uint8)
    
    # 2. Rectangle strategy: the border 10% is background
    bx = int(w * 0.10)
    by = int(h * 0.10)
    
    # First, mark everything as definite background
    mask[:] = cv2.GC_BGD
    
    # Then mark the inner rect as probable foreground
    mask[by:h-by, bx:w-bx] = cv2.GC_PR_FGD
    
    # 3. Add color heuristics to the mask
    # Find the median border color to classify similar colors as definitive background
    border_pixels = []
    border_pixels.append(img_bgr[0:by//2, :])
    border_pixels.append(img_bgr[h-by//2:h, :])
    border_pixels.append(img_bgr[:, 0:bx//2])
    border_pixels.append(img_bgr[:, w-bx//2:w])
    border_pts = np.concatenate([p.reshape(-1, 3) for p in border_pixels])
    bg_bgr = np.median(border_pts, axis=0)
    
    # If a pixel inside the probable foreground is very close to the background color, mark it as bg
    diff = np.sqrt(np.sum((img_bgr - bg_bgr)**2, axis=2))
    mask[diff < 40] = cv2.GC_BGD
    
    # GrabCut variables
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    # Run GrabCut
    rect = (bx, by, w - 2*bx, h - 2*by)
    cv2.grabCut(img_bgr, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_MASK)
    
    # Modify mask such that all 1-pixels (def fg) and 3-pixels (prob fg) are set to 1, rest to 0
    mask2 = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
    
    # Create final alpha channel
    final_alpha = cropped[:, :, 3] * mask2
    
    # Apply alpha
    cropped[:, :, 3] = final_alpha
    
    # Result PILLOW
    res = Image.fromarray(cropped)
    
    # Crop to new bounds
    bbox = res.getbbox()
    if bbox:
        res = res.crop(bbox)
        
    rw, rh = res.size
    pad = int(max(rw, rh) * 0.08)
    new_w, new_h = rw + 2*pad, rh + 2*pad
    padded = Image.new("RGBA", (new_w, new_h), (0,0,0,0))
    padded.paste(res, (pad, pad))
    
    # Resize
    max_size = 512
    ratio = min(max_size/new_w, max_size/new_h)
    if ratio < 1:
        padded = padded.resize((int(new_w * ratio), int(new_h * ratio)), Image.LANCZOS)
        
    padded.save(dst_path, "PNG")

def main():
    for k, v in FILES_TO_PROCESS.items():
        src = os.path.join(SRC, k)
        dst = os.path.join(DST, v)
        if os.path.exists(src):
            process_image(src, dst)

if __name__ == "__main__":
    main()
