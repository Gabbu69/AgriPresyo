import os
from PIL import Image
import io

try:
    from rembg import remove, new_session
except ImportError:
    pass

CROPS_DIR = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
UPO_SRC = r"c:\Users\gabri\.gemini\antigravity\brain\38e74002-8293-4e72-b777-ad5cb76bf9b3\media__1774782529739.jpg"

def fix_real():
    print(f"Loading {UPO_SRC}")
    with open(UPO_SRC, 'rb') as f:
        input_data = f.read()

    print("Running rembg on Real Upo image...")
    # u2net is usually better than isnet for common isolated objects
    session = new_session("u2net")
    output_data = remove(input_data, session=session, post_process_mask=True)
    
    out = Image.open(io.BytesIO(output_data)).convert("RGBA")
    
    # Crop to bounding box of the non-transparent part
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
        
    out = out.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
    
    out = out.transpose(Image.FLIP_LEFT_RIGHT)
    
    w_out, h_out = out.size
    scale = 480 / max(w_out, h_out)
    new_w, new_h = int(w_out * scale), int(h_out * scale)
    out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(out, (offset_x, offset_y), out)
    
    out_path = os.path.join(CROPS_DIR, "upo.png")
    canvas.save(out_path, "PNG")
    print("Done fixing REAL Upo! Re-saved to upo.png")

if __name__ == "__main__":
    fix_real()
