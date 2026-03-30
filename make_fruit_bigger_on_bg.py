import sys
import io
import os
import numpy as np
from PIL import Image

class DummyWMI:
    def exec_query(self, query):
        return []
sys.modules['wmi'] = type('wmi', (object,), {'WMI': lambda: DummyWMI()})

try:
    from rembg import remove, new_session
except ImportError as e:
    pass

src = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pineapple.png"
dst = src

def make_bigger_on_bg():
    print("Fixing the pineapple: enlarging the fruit without touching the dark green square background...")
    try:
        with Image.open(src) as img:
            base_bg = img.convert("RGBA")
            img_byte_arr = io.BytesIO()
            base_bg.save(img_byte_arr, format='PNG')
            
            # Extract just the pineapple
            session = new_session("u2net")
            output_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)
            fruit = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            # Tight crop the extracted fruit
            arr = np.array(fruit)
            alpha = arr[:, :, 3]
            y, x = np.nonzero(alpha > 15)
            if len(x) > 0:
                fruit = fruit.crop((x.min(), y.min(), x.max(), y.max()))
                
            w, h = fruit.size
            
            # Make the fruit huge to cover the old one! Target height = 500
            scale = 500.0 / max(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            fruit = fruit.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            # Paste the huge fruit over the original background
            offset_x = (512 - new_w) // 2
            offset_y = (512 - new_h) // 2
            
            # We composite it over the base_bg
            final_canvas = base_bg.copy()
            final_canvas.paste(fruit, (offset_x, offset_y), fruit)
            
            final_canvas.save(dst, "PNG")
            print("Successfully made the pineapple huge while preserving the dark green rounded square background!")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    make_bigger_on_bg()
