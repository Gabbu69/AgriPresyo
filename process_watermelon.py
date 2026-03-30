import os
from rembg import remove
from PIL import Image
import io

water_in = r"C:\Users\gabri\.gemini\antigravity\brain\4988e4fd-8d8e-4c54-881a-42779a4f5a2b\watermelon_icon_1774669024339.png"
water_out = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\watermelon.png"

with Image.open(water_in) as img:
    if img.mode != 'RGB' and img.mode != 'RGBA':
        img = img.convert('RGBA')
    max_size = 512
    if img.width > max_size or img.height > max_size:
        img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    output_data = remove(img_byte_arr.getvalue())
    with open(water_out, "wb") as o:
        o.write(output_data)
        
print("Processed new watermelon icon")
