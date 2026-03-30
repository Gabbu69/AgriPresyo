import sys
import io
import os
from PIL import Image

# Dummy wmi object to prevent cpuinfo from hanging
class DummyWMI:
    def exec_query(self, query):
        return []
sys.modules['wmi'] = type('wmi', (object,), {'WMI': lambda: DummyWMI()})

try:
    from rembg import remove, new_session
except ImportError:
    pass

src = r"c:\Users\gabri\.gemini\antigravity\brain\38e74002-8293-4e72-b777-ad5cb76bf9b3\media__1774782529739.jpg"
dst = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\upo.png"

def do_rembg():
    print("Starting rembg processing on Upo...")
    try:
        with Image.open(src) as img:
            img = img.convert("RGBA")
            img.thumbnail((768, 768), Image.Resampling.LANCZOS)
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            
            session = new_session("u2net")
            output_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)
            out = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            alpha = out.split()[-1]
            bbox = alpha.getbbox()
            if bbox:
                out = out.crop(bbox)
            
            # Apply slant and flip
            out = out.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
            bbox = out.split()[-1].getbbox()
            if bbox:
                out = out.crop(bbox)
            out = out.transpose(Image.FLIP_LEFT_RIGHT)
            
            # They want it ENLARGED. Make it very large on the canvas.
            w, h = out.size
            scale = 480 / max(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
            canvas.paste(out, ((512 - new_w)//2, (512 - new_h)//2), out)
            
            canvas.save(dst, "PNG")
            print("Successfully processed and saved Upo!")
    except Exception as e:
        print(f"Failed to process with rembg: {e}")

if __name__ == "__main__":
    do_rembg()
