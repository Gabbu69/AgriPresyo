import os
from rembg import remove, new_session
from PIL import Image
import io

src_path = r"C:\Users\gabri\.gemini\antigravity\brain\c3c671f5-be61-4842-8958-fef22e0b8cfa\media__1774758928968.png"
tgt_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle.png"

session = new_session("u2net")

print(f"Processing pickle...")
try:
    with Image.open(src_path) as img:
        if img.mode != 'RGB' and img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        img.thumbnail((512, 512), Image.Resampling.LANCZOS)
        
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        input_data = img_byte_arr.getvalue()
        
        output_data = remove(input_data, session=session, post_process_mask=True)
        
        out_img = Image.open(io.BytesIO(output_data)).convert("RGBA")
        
        alpha = out_img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            out_img = out_img.crop(bbox)
        
        w, h = out_img.size
        max_dim = max(w, h)
        padding = int(max_dim * 0.18)
        target_size = max_dim + (padding * 2)
        
        squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
        offset_x = (target_size - w) // 2
        offset_y = (target_size - h) // 2
        
        squared_img.paste(out_img, (offset_x, offset_y), out_img)
        
        squared_img.save(tgt_path, "PNG")
        print("Pickle processed and saved successfully to " + tgt_path)
except Exception as e:
    print(f"Error: {e}")
