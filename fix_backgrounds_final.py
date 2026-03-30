import os
import io
import cv2
import numpy as np
from PIL import Image
from rembg import remove, new_session

SRC = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg"
DST = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

FILES_TO_PROCESS = {
    "Atsal.png": "bell-pepper.png",
    "Upo.png": "upo.png",
    "Kalabasa (Squash).png": "kalabasa.png",
    "Poncan.png": "poncan.png",
    "Fuji Apple.png": "apple.png",
    "Grapes.png": "grapes.png",
    "fresh okra.png": "okra.png",
}

# The u2net session is generally best
session = new_session("u2net")

def process_image(src_name, dst_name):
    src_path = os.path.join(SRC, src_name)
    dst_path = os.path.join(DST, dst_name)
    
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        return
        
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img)
    h, w = arr.shape[:2]
    
    # Pre-processing for OKRA to isolate the center one BEFORE background removal
    if dst_name == "okra.png":
        left_cutoff = int(w * 0.35)
        right_cutoff = int(w * 0.65)
        
        # Make pixels outside the center column completely white, so rembg ignores them
        arr[:, :left_cutoff, :3] = 255
        arr[:, right_cutoff:, :3] = 255
        img = Image.fromarray(arr)

    # Convert the green background to pure white/pink floodfill to help rembg!
    # A wild, unnatural background color makes rembg extremely confident.
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGBA2BGR)
    mask = np.zeros((h + 2, w + 2), np.uint8)
    # FloodFill from top center (margin 10)
    cv2.floodFill(bgr, mask, (w//2, 10), (255, 0, 255), (40, 40, 40), (40, 40, 40), cv2.FLOODFILL_FIXED_RANGE)
    # Also floodfill from the 4 corners just in case
    cv2.floodFill(bgr, mask, (10, 10), (255, 0, 255), (40, 40, 40), (40, 40, 40), cv2.FLOODFILL_FIXED_RANGE)
    cv2.floodFill(bgr, mask, (w-10, h-10), (255, 0, 255), (40, 40, 40), (40, 40, 40), cv2.FLOODFILL_FIXED_RANGE)
    
    buf = io.BytesIO()
    Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).save(buf, "PNG")
    
    # REMBG to remove the background!
    res_data = remove(buf.getvalue(), session=session, post_process_mask=True)
    res_img = Image.open(io.BytesIO(res_data))
    
    # We crop the transparent bounding box exactly
    alpha = res_img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        res_img = res_img.crop(bbox)
        
    # Apply alpha erosion to remove the 1px white/green fringe exactly
    res_arr = np.array(res_img)
    alpha_chan = res_arr[:,:,3]
    kernel = np.ones((3,3), np.uint8)
    eroded_alpha = cv2.erode(alpha_chan, kernel, iterations=1)
    eroded_alpha = cv2.GaussianBlur(eroded_alpha, (3,3), 0)
    res_arr[:,:,3] = np.where(eroded_alpha > 0, eroded_alpha, 0)
    res_img = Image.fromarray(res_arr)
    
    # Add 18% transparent padding so all crops look uniform in size
    rw, rh = res_img.size
    max_dim = max(rw, rh)
    pad = int(max_dim * 0.18)
    target_size = max_dim + 2*pad
    
    padded = Image.new("RGBA", (target_size, target_size), (0,0,0,0))
    offset_x = (target_size - rw) // 2
    offset_y = (target_size - rh) // 2
    padded.paste(res_img, (offset_x, offset_y))
    
    # Resize to standard size
    padded = padded.resize((512, 512), Image.Resampling.LANCZOS)
    
    padded.save(dst_path, "PNG")
    print(f"Successfully processed and padded {dst_name}")

def main():
    for k, v in FILES_TO_PROCESS.items():
        try:
            process_image(k, v)
        except Exception as e:
            print(f"Error processing {k}: {e}")

if __name__ == "__main__":
    main()
