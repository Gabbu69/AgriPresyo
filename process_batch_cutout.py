import os
import cv2
import numpy as np
from PIL import Image
from rembg import remove, new_session
import io

src_dir = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg"
dst_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

tasks = [
    # src_filename, target_filename
    ("Rambutan.png", "rambutan.png"),
    ("fresh okra.png", "okra.png"),
    ("Pechay.png", "pechay.png"),
    ("Upo.png", "upo.png"),
    ("Kalabasa (Squash).png", "kalabasa.png"),
    ("Atsal.png", "bell-pepper.png"),
    ("Fuji Apple.png", "apple.png"),
    ("Grapes.png", "grapes.png"),
    ("Poncan.png", "poncan.png")
]

def apply_defringe(image_bytes, erode_iter=2, blur_kernel=5):
    """
    Takes rembg output bytes, decodes, and erodes the alpha edge heavily
    to remove green fringe, then blurs the alpha for a smooth finish.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    arr = np.array(img)
    
    # Extract RGB and Alpha
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    
    # 1. Shrink the mask to eliminate jagged background halos (the 'green fringe')
    kernel = np.ones((3, 3), np.uint8)
    shrunk_alpha = cv2.erode(alpha, kernel, iterations=erode_iter)
    
    # 2. Re-blur the edge so it isn't an aliased pixel staircase
    smooth_alpha = cv2.GaussianBlur(shrunk_alpha, (blur_kernel, blur_kernel), 0)
    
    # Construct final
    res_arr = np.zeros_like(arr)
    res_arr[:, :, :3] = rgb
    res_arr[:, :, 3] = smooth_alpha
    
    return Image.fromarray(res_arr)

def process_all():
    session = new_session("isnet-general-use")
    
    for src_file, dst_file in tasks:
        src_path = os.path.join(src_dir, src_file)
        dst_path = os.path.join(dst_dir, dst_file)
        
        if not os.path.exists(src_path):
            print(f"Skipping {src_file} - Not found in {src_dir}")
            continue
            
        print(f"Processing {src_file} -> {dst_file}...")
        
        # Load and potentially assist the model by flood-filling corners to white
        img = Image.open(src_path).convert("RGBA")
        arr = np.array(img)
        bgr = cv2.cvtColor(arr, cv2.COLOR_RGBA2BGR)
        h, w = bgr.shape[:2]
        
        # We can try to flood-fill the background if it's uniquely dark green, 
        # but ISNET usually correctly identifies the primary object shape.
        buf = io.BytesIO()
        img.save(buf, "PNG")
        
        # Run standard rembg
        res_bytes = remove(buf.getvalue(), session=session)
        
        # Apply intense defringe and alpha smoothing
        # If it's still leaving green edges, we could increase iterations
        final_img = apply_defringe(res_bytes, erode_iter=3, blur_kernel=5)
        
        # Optional: Resize to standard 512x512 bounded box
        bounds = final_img.getbbox()
        if bounds:
            cropped = final_img.crop(bounds)
            # Paste into a centered 512x512
            cw, ch = cropped.size
            max_dim = max(cw, ch)
            if max_dim > 0:
                scale = 400.0 / max_dim # leave some padding
                new_w = int(cw * scale)
                new_h = int(ch * scale)
                resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
                
                final_canvas = Image.new("RGBA", (512, 512), (0,0,0,0))
                paste_x = (512 - new_w) // 2
                paste_y = (512 - new_h) // 2
                final_canvas.paste(resized, (paste_x, paste_y), resized)
                final_img = final_canvas
        
        final_img.save(dst_path)
        print(f"-> Saved {dst_path}")
        
if __name__ == "__main__":
    process_all()
