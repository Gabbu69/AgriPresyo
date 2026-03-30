import sys
import io
import os
import numpy as np
from PIL import Image

# Dummy wmi object to prevent cpuinfo from hanging
class DummyWMI:
    def exec_query(self, query):
        return []
sys.modules['wmi'] = type('wmi', (object,), {'WMI': lambda: DummyWMI()})

try:
    from rembg import remove, new_session
except ImportError as e:
    print(f"rembg import failed: {e}")

src = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pineapple.png"
dst = src

def fix_bg():
    print("Starting rembg processing on Pineapple to remove the baked-in background square...")
    try:
        with Image.open(src) as img:
            img = img.convert("RGBA")
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            
            # Remove background
            session = new_session("u2net")
            output_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)
            out = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            # Clean bounding box (excluding ghost shadows)
            arr = np.array(out)
            alpha = arr[:, :, 3]
            y, x = np.nonzero(alpha > 15)
            if len(x) > 0:
                out = out.crop((x.min(), y.min(), x.max(), y.max()))
            
            # Enlarge back to big and straight
            w, h = out.size
            scale = 510 / max(w, h)
            # Make it beautifully huge without the square background!
            new_w, new_h = int(w * scale), int(h * scale)
            out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
            offset_x = (512 - new_w) // 2
            offset_y = (512 - new_h) // 2
            canvas.paste(out, (offset_x, offset_y), out)
            
            canvas.save(dst, "PNG")
            print("Successfully processed and saved the transparent Pineapple!")
    except Exception as e:
        print(f"Failed to process with rembg: {e}")

if __name__ == "__main__":
    fix_bg()
