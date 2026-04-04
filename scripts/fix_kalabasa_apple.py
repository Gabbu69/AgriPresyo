import cv2
import numpy as np
import io
import os
from PIL import Image
from rembg import remove, new_session

def process_file(img_path, session):
    print(f"Processing {img_path}...")
    img = cv2.imread(img_path)
    if img is None:
        print(f"Failed to read image: {img_path}")
        return
        
    h, w, _ = img.shape
    margin_y = int(h * 0.20)
    margin_x = int(w * 0.20)
    
    cropped = img[margin_y:h-margin_y, margin_x:w-margin_x]
    
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
    
    target_canvas = 512
    scale = (target_canvas * 0.8) / max_dim
    new_w = int(w_out * scale)
    new_h = int(h_out * scale)
    
    out_img = out_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    final_canvas = Image.new("RGBA", (target_canvas, target_canvas), (0, 0, 0, 0))
    offset_x = (target_canvas - new_w) // 2
    offset_y = (target_canvas - new_h) // 2
    
    final_canvas.paste(out_img, (offset_x, offset_y), out_img)
    
    final_canvas.save(img_path, "PNG")
    print(f"Saved successfully to {img_path}")

def main():
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    files = ["kalabasa.png", "apple.png"]
    session = new_session("isnet-general-use")
    
    for f in files:
        process_file(os.path.join(crops_dir, f), session)

if __name__ == "__main__":
    main()
