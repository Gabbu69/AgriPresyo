import os
import io
from PIL import Image
from rembg import remove, new_session

# Test on Atsal.png
src_path = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg\Atsal.png"
dst_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\bell-pepper-cropped.png"

def test_crop_then_rembg():
    img = Image.open(src_path).convert("RGBA")
    
    # 1. heavily crop so the subject touches edges
    # Atsal is 1024x1024. The pepper itself is in the central region.
    # Let's crop it from (200, 150) to (824, 850)
    cropped = img.crop((200, 150, 820, 850))
    
    # 2. Add padding on a WHITE background so rembg sees the dark green corners as background
    w, h = cropped.size
    white_bg = Image.new("RGB", (w+100, h+100), (255,255,255))
    white_bg.paste(cropped, (50, 50), cropped.split()[3])
    
    # 3. remove bg
    buf = io.BytesIO()
    white_bg.save(buf, "PNG")
    session = new_session("u2net")
    res_data = remove(buf.getvalue(), session=session)
    
    res_img = Image.open(io.BytesIO(res_data))
    
    # Save
    res_img.save(dst_path, "PNG")

if __name__ == "__main__":
    test_crop_then_rembg()
