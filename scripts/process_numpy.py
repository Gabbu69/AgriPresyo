import os
import numpy as np
from PIL import Image
from skimage.color import rgb2lab
from skimage.morphology import binary_closing, binary_dilation, disk
from skimage.measure import label

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
    print(f"Processing: {os.path.basename(src_path)} -> {os.path.basename(dst_path)}")
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img)
    
    # 1. Crop to opaque region
    alpha = arr[:, :, 3]
    active = alpha > 10
    rows = np.any(active, axis=1)
    cols = np.any(active, axis=0)
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    cropped = arr[rmin:rmax+1, cmin:cmax+1].copy()
    
    # 2. Convert to LAB color space for better perceptual color difference
    lab = rgb2lab(cropped[:, :, :3] / 255.0)
    
    # Sample background colors from the edges (inset by 10 pixels to avoid anti-aliasing)
    inset = 10
    h, w = lab.shape[:2]
    
    # Collect border pixels
    pts = []
    for x in range(inset, w - inset, 10):
        pts.extend([lab[inset, x], lab[h-1-inset, x]])
    for y in range(inset, h - inset, 10):
        pts.extend([lab[y, inset], lab[y, w-1-inset]])
        
    pts = np.array(pts)
    bg_color = np.median(pts, axis=0)
    
    # Calculate color distance to median background color
    diff = np.sqrt(np.sum((lab - bg_color)**2, axis=2))
    
    # 3. Create initial mask based on distance threshold
    # Experimentally: distance < 15 to 20 in LAB space is a good threshold for "same color"
    # Also include pixels that are very dark overall (L < 15)
    L = lab[:, :, 0]
    bg_mask = (diff < 20) | (L < 15)
    
    # 4. Only keep background mask components that touch the edge
    labeled = label(bg_mask)
    border_labels = set(labeled[0, :]) | set(labeled[-1, :]) | set(labeled[:, 0]) | set(labeled[:, -1])
    border_labels.discard(0)
    final_bg_mask = np.isin(labeled, list(border_labels))
    
    # Dilate the background mask slightly to eat into the edges and avoid halos
    final_bg_mask = binary_dilation(final_bg_mask, disk(3))
    
    # 5. Apply the mask
    cropped[final_bg_mask, 3] = 0
    
    # 6. Crop again to final bounds & pad
    result = Image.fromarray(cropped)
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
        
    rw, rh = result.size
    pad = int(max(rw, rh) * 0.08)
    new_w, new_h = rw + 2*pad, rh + 2*pad
    padded = Image.new("RGBA", (new_w, new_h), (0,0,0,0))
    padded.paste(result, (pad, pad))
    
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
