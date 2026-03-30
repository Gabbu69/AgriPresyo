import cv2
import numpy as np
import io
import os
from PIL import Image
from rembg import remove, new_session

def main():
    img_path = r"C:\Users\gabri\.gemini\antigravity\brain\1a59ed54-5459-40bb-82f2-3dc500fa59d5\media__1774765126133.jpg"
    
    print("Processing poncan...")
    img = cv2.imread(img_path)
    if img is None:
        print("Failed to read image")
        return
        
    # Crop center 20% to remove checkerboard & card edges
    h, w, _ = img.shape
    margin_y = int(h * 0.20)
    margin_x = int(w * 0.20)
    
    cropped = img[margin_y:h-margin_y, margin_x:w-margin_x]
    
    # Convert to PIL
    cropped_pil = Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
    
    img_byte_arr = io.BytesIO()
    cropped_pil.save(img_byte_arr, format='PNG')
    
    # Use isnet-general-use session for high quality edge detection
    session = new_session("isnet-general-use")
    out_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)
    out_img = Image.open(io.BytesIO(out_data)).convert("RGBA")
    
    # Crop to the actual transparent bounding box
    alpha = out_img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
        
    # Standardize size: 512x512 canvas, fruit takes ~80%
    w_out, h_out = out_img.size
    max_dim = max(w_out, h_out)
    
    target_canvas = 512
    # ensure it fits in ~80% 
    scale = (target_canvas * 0.8) / max_dim
    new_w = int(w_out * scale)
    new_h = int(h_out * scale)
    
    # Resize high quality
    out_img = out_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create final 512x512 transparent canvas
    final_canvas = Image.new("RGBA", (target_canvas, target_canvas), (0, 0, 0, 0))
    offset_x = (target_canvas - new_w) // 2
    offset_y = (target_canvas - new_h) // 2
    
    final_canvas.paste(out_img, (offset_x, offset_y), out_img)
    
    # Save directly to the public/crops directory so the UI automatically updates
    out_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    
    out_path_final = os.path.join(out_dir, "poncan_final.png")
    
    final_canvas.save(out_path_final, "PNG")
    
    print(f"Saved successfully to {out_path_final}")

if __name__ == "__main__":
    main()
