import cv2
import numpy as np
import io
import os
from PIL import Image
from rembg import remove, new_session

img_paths = [
    r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134560.jpg",
    r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134938.jpg"
]

session = new_session("u2net")

for idx, path in enumerate(img_paths):
    name = "poncan" if "560.jpg" in path else "pickle"
    print(f"Processing {name}...")
    
    # Read with opencv
    img = cv2.imread(path)
    
    # the image has a grid and a green center box. 
    # Let's crop to the center 60% to avoid the grid before passing to rembg
    h, w, _ = img.shape
    margin_y = int(h * 0.15)
    margin_x = int(w * 0.15)
    
    cropped = img[margin_y:h-margin_y, margin_x:w-margin_x]
    
    # Save cropped to check it
    cv2.imwrite(f"C:/Users/gabri/.gemini/antigravity/scratch/AgriPresyo/public/crops/{name}_cropped.png", cropped)
    
    # Convert cropped to PIL for rembg
    cropped_pil = Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
    
    img_byte_arr = io.BytesIO()
    cropped_pil.save(img_byte_arr, format='PNG')
    
    out_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)
    out_img = Image.open(io.BytesIO(out_data)).convert("RGBA")
    
    alpha = out_img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
        
    w_out, h_out = out_img.size
    max_dim = max(w_out, h_out)
    padding = int(max_dim * 0.18)
    target_size = max_dim + (padding * 2)
    
    squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    offset_x = (target_size - w_out) // 2
    offset_y = (target_size - h_out) // 2
    
    squared_img.paste(out_img, (offset_x, offset_y), out_img)
    
    tgt_path = f"C:/Users/gabri/.gemini/antigravity/scratch/AgriPresyo/public/crops/{name}.png"
    squared_img.save(tgt_path, "PNG")
    print(f"Saved {name} to {tgt_path}")

