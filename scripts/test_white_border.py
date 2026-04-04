import io
import os
from PIL import Image, ImageDraw
from rembg import remove, new_session
import numpy as np

src = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg\Rambutan.png"
dst = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\test_rambutan.png"

def test():
    if not os.path.exists(src):
        print(f"File not found: {src}")
        return
        
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    
    # Crop to the inner subject by painting a massive white border.
    # The green card is 1024x1024. The subject is mostly in the center 60%.
    # If we paint pure white outside the center 60%, rembg will easily see the center.
    margin_w = int(w * 0.15)
    margin_h = int(h * 0.15)
    
    # But wait, Rambutan might touch the edges. Let's see.
    # Instead of painting white over it, let's just use floodFill to make the green background pure pink!
    # A wild, unnatural background color makes rembg extremely confident.
    
    import cv2
    arr = np.array(img)
    # Convert RGBA to BGR
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGBA2BGR)
    
    # We know top-center is background.
    mask = np.zeros((h + 2, w + 2), np.uint8)
    # FloodFill from top center (margin 10)
    # Tolerance: dark green can vary. Let's use 30,30,30
    cv2.floodFill(bgr, mask, (w//2, 10), (255, 0, 255), (30, 30, 30), (30, 30, 30), cv2.FLOODFILL_FIXED_RANGE)
    
    # Convert back to uint8 image
    Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).save(dst.replace(".png", "_flooded.png"))
    
    # Now run rembg on the flooded image!
    buf = io.BytesIO()
    Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).save(buf, "PNG")
    
    session = new_session("u2net")
    res_data = remove(buf.getvalue(), session=session)
    res = Image.open(io.BytesIO(res_data))
    
    # Let's see if rembg is smart enough now!
    res.save(dst)
    print(f"Saved to {dst}")

if __name__ == "__main__":
    test()
