import os
import numpy as np
from PIL import Image
from rembg import remove, new_session
import io

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

SESSION = new_session("u2net")

def get_border_median_color(arr, border_size=15):
    h, w = arr.shape[:2]
    pts = []
    # top
    pts.append(arr[0:border_size, :])
    # bottom
    pts.append(arr[h-border_size:h, :])
    # left
    pts.append(arr[:, 0:border_size])
    # right
    pts.append(arr[:, w-border_size:w])
    
    # concat all points
    border_pts = np.concatenate([p.reshape(-1, 4) for p in pts])
    
    # filter to only mostly opaque points
    opaque_pts = border_pts[border_pts[:, 3] > 200]
    
    if len(opaque_pts) > 0:
        return np.median(opaque_pts[:, :3], axis=0)
    else:
        # fallback to a known dark green if nothing opaque is on the border
        return np.array([40, 70, 50])

def process_image(src_path, dst_path):
    print(f"Processing: {os.path.basename(src_path)} -> {os.path.basename(dst_path)}")
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img).astype(np.float32)
    
    # 1. Identify background by sampling the border
    # Crop to actual opaque data to avoid the pure transparent fuzzy borders from messing up the sample
    alpha = arr[:, :, 3]
    active = alpha > 10
    rows = np.any(active, axis=1)
    cols = np.any(active, axis=0)
    if not np.any(rows) or not np.any(cols):
        return # empty image?
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    cropped_for_sample = arr[rmin:rmax+1, cmin:cmax+1]
    bg_color = get_border_median_color(cropped_for_sample, border_size=5)
    
    # 2. Calculate euclidean distance to background color
    rgb = arr[:, :, :3]
    dist = np.sqrt(np.sum((rgb - bg_color)**2, axis=2))
    
    # 3. Create mask for pixels close to background color OR very very dark pixels (which are usually the border shadow)
    is_bg = dist < 55
    is_very_dark = np.max(rgb, axis=2) < 30
    bg_mask = (is_bg | is_very_dark)
    
    # 4. Turn masked pixels to WHITE so rembg can see a pristine white background
    pre_rembg = arr.copy()
    pre_rembg[bg_mask, 0:4] = [255, 255, 255, 255]
    # transparent border to white as well
    pre_rembg[alpha <= 10, 0:4] = [255, 255, 255, 255]
    
    pre_rembg_img = Image.fromarray(pre_rembg.astype(np.uint8))
    
    # 5. Pass to rembg
    buf = io.BytesIO()
    pre_rembg_img.save(buf, format="PNG")
    out_data = remove(buf.getvalue(), session=SESSION, alpha_matting=False)
    
    out_img = Image.open(io.BytesIO(out_data)).convert("RGBA")
    out_arr = np.array(out_img)
    final_alpha = out_arr[:, :, 3]
    
    # 6. Composite the original image with the new alpha mask
    final_arr = arr.copy()
    final_arr[:, :, 3] = final_alpha
    
    res = Image.fromarray(final_arr.astype(np.uint8))
    
    # 7. Crop, pad, and resize
    bbox = res.getbbox()
    if bbox:
        res = res.crop(bbox)
        
    w, h = res.size
    pad = int(max(w, h) * 0.08)
    new_w, new_h = w + 2*pad, h + 2*pad
    padded = Image.new("RGBA", (new_w, new_h), (0,0,0,0))
    padded.paste(res, (pad, pad))
    
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
