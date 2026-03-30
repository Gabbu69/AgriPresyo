import io
from PIL import Image
from rembg import remove, new_session
import cv2
import numpy as np

img_path = r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760390047.png"
tgt_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle_final.png"

# Since this is a perfect PNG with true alpha and no fake checkerboard pixels,
# u2net is specifically designed to find the salient object (the pickle) 
# against the flat background (the green card).

with Image.open(img_path) as img:
    img = img.convert("RGBA")
    
    # We flatten the transparent regions to match the dark green card background 
    # to eliminate the "card" border entirely so the AI only sees a pickle on a green canvas!
    # Card background color in the user's screenshot is roughly rgb(27, 50, 31).
    bg = Image.new("RGBA", img.size, (27, 50, 31, 255))
    flattened = Image.alpha_composite(bg, img)
    # Convert flattened to RGB because u2net with RGB is more reliable when we synthesized background
    flattened = flattened.convert("RGB")
    
    session = new_session("isnet-general-use")
    
    img_byte_arr = io.BytesIO()
    flattened.save(img_byte_arr, format='PNG')
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
    
    if squared_img.width > 512:
        squared_img = squared_img.resize((512, 512), Image.Resampling.LANCZOS)
        
    squared_img.save(tgt_path, "PNG")
    print("Flawlessly extracted from the pure PNG by synthesizing a continuous background canvas!")
