import cv2
import numpy as np
import io
import os
from PIL import Image
from rembg import remove, new_session

def process_file(in_path, out_path, session):
    print(f"Processing {in_path} to {out_path}...")
    img = cv2.imread(in_path)
    if img is None:
        print(f"Failed to read image: {in_path}")
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
    
    final_canvas.save(out_path, "PNG")
    print(f"Saved successfully to {out_path}")

def main():
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    input_dir = r"C:\Users\gabri\.gemini\antigravity\brain\1a59ed54-5459-40bb-82f2-3dc500fa59d5"
    
    files = {
        "media__1774765629448.jpg": "apple.png",
        "media__1774765644114.jpg": "kalabasa.png"
    }

    session = new_session("isnet-general-use")
    
    for in_name, out_name in files.items():
        process_file(os.path.join(input_dir, in_name), os.path.join(crops_dir, out_name), session)

if __name__ == "__main__":
    main()
