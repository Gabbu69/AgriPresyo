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

# The latest user uploaded image
src = r"C:\Users\gabri\.gemini\antigravity\brain\f569a168-fe18-42be-856c-b26a1c80a258\media__1774785722605.png"
dst = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pineapple.png"

def process_latest_pineapple():
    print(f"Reading user newly uploaded image from {src}...")
    try:
        with Image.open(src) as img:
            base_img = img.convert("RGBA")
            img_byte_arr = io.BytesIO()
            base_img.save(img_byte_arr, format='PNG')
            
            print("Removing the background using rembg...")
            session = new_session("u2net")
            output_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)
            fruit = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            # Tight crop the extracted fruit to remove ghost pixels
            arr = np.array(fruit)
            alpha = arr[:, :, 3]
            y, x = np.nonzero(alpha > 15)
            if len(x) > 0:
                fruit = fruit.crop((x.min(), y.min(), x.max(), y.max()))
                
            w, h = fruit.size
            
            # Make the transparent fruit perfectly fit the 512x512 canvas
            target_h = 510
            scale = float(target_h) / max(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            print(f"Scaling exactly to {new_w}x{new_h}...")
            fruit = fruit.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
            offset_x = (512 - new_w) // 2
            offset_y = (512 - new_h) // 2
            
            canvas.paste(fruit, (offset_x, offset_y), fruit)
            canvas.save(dst, "PNG")
            
            print("Successfully recovered the realistic pineapple, removed its bg, made it transparent and HUGE, and saved to public/crops!")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    process_latest_pineapple()
