import os
import numpy as np
from PIL import Image
import colorsys
import time

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

def is_dark_green(r, g, b, tolerance=0.35):
    h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
    if v < 0.12:  # Very dark pixels
        return True
    if 0.15 < h < 0.50 and v < 0.45 and s > 0.15:  # Dark green
        return True
    return False

def flood_fill_remove(img_array, alpha, start_x, start_y, tolerance=60):
    h, w = img_array.shape[:2]
    if alpha[start_y, start_x] == 0:
        return
    
    ref_color = img_array[start_y, start_x, :3].astype(np.int32)
    visited = np.zeros((h, w), dtype=bool)
    stack = [(start_x, start_y)]
    
    while stack:
        x, y = stack.pop()
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        if visited[y, x]:
            continue
        if alpha[y, x] == 0:
            continue
        
        pixel = img_array[y, x, :3].astype(np.int32)
        diff = np.sqrt(np.sum((pixel - ref_color) ** 2))
        
        r, g, b = img_array[y, x, 0], img_array[y, x, 1], img_array[y, x, 2]
        is_bg = diff < tolerance or is_dark_green(r, g, b)
        
        if not is_bg:
            continue
        
        visited[y, x] = True
        alpha[y, x] = 0
        
        stack.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])

def process_image(src_path, dst_path):
    print(f"Processing: {os.path.basename(src_path)} -> {os.path.basename(dst_path)}")
    start_t = time.time()
    
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img)
    
    alpha = arr[:, :, 3]
    opaque_mask = alpha > 10
    rows = np.any(opaque_mask, axis=1)
    cols = np.any(opaque_mask, axis=0)
    if not np.any(rows) or not np.any(cols):
        return
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    margin = 5
    rmin = max(0, rmin - margin)
    rmax = min(arr.shape[0] - 1, rmax + margin)
    cmin = max(0, cmin - margin)
    cmax = min(arr.shape[1] - 1, cmax + margin)
    
    cropped = arr[rmin:rmax+1, cmin:cmax+1].copy()
    
    # Downscale heavily BEFORE flood fill to make it infinitely faster!!!
    # The original was doing slow python floodfill on 1000x1000 images taking 1 min per image.
    # We can scale down to 512x512 first, THEN flood fill!
    base_img = Image.fromarray(cropped)
    base_img.thumbnail((512, 512), Image.LANCZOS)
    cropped = np.array(base_img)
    
    h, w = cropped.shape[:2]
    cropped_alpha = cropped[:, :, 3]
    
    edge_points = []
    step = 20
    for x in range(0, w, step):
        edge_points.extend([(x, 10), (x, h - 10)])
    for y in range(0, h, step):
        edge_points.extend([(10, y), (w - 10, y)])
        
    inset = 30
    edge_points.extend([(inset, inset), (w-inset, inset), (inset, h-inset), (w-inset, h-inset)])
    
    for (x, y) in edge_points:
        x = min(max(0, x), w - 1)
        y = min(max(0, y), h - 1)
        if cropped_alpha[y, x] > 10:
            r, g, b = cropped[y, x, 0], cropped[y, x, 1], cropped[y, x, 2]
            if is_dark_green(r, g, b):
                flood_fill_remove(cropped, cropped_alpha, x, y, tolerance=65)
                
    for y in range(h):
        for x in range(w):
            if cropped_alpha[y, x] > 0:
                r, g, b = cropped[y, x, 0], cropped[y, x, 1], cropped[y, x, 2]
                brightness = (r * 0.299 + g * 0.587 + b * 0.114)
                if brightness < 25: 
                    cropped_alpha[y, x] = 0
                    
    cropped[:, :, 3] = cropped_alpha
    
    res_img = Image.fromarray(cropped)
    bbox = res_img.getbbox()
    if bbox:
        res_img = res_img.crop(bbox)
        
    rw, rh = res_img.size
    pad = int(max(rw, rh) * 0.08)
    new_w, new_h = rw + 2*pad, rh + 2*pad
    padded = Image.new("RGBA", (new_w, new_h), (0,0,0,0))
    padded.paste(res_img, (pad, pad))
    
    max_size = 512
    ratio = min(max_size/new_w, max_size/new_h)
    if ratio < 1:
        padded = padded.resize((int(new_w * ratio), int(new_h * ratio)), Image.LANCZOS)
        
    padded.save(dst_path, "PNG")
    print(f"  Saved: {dst_path} in {time.time() - start_t:.1f}s")

def main():
    for k, v in FILES_TO_PROCESS.items():
        src = os.path.join(SRC, k)
        dst = os.path.join(DST, v)
        if os.path.exists(src):
            try:
                process_image(src, dst)
            except Exception as e:
                print(f"Error on {k}: {e}")

if __name__ == "__main__":
    main()
