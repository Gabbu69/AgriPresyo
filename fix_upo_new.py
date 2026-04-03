import os
import glob
from PIL import Image
import io

try:
    from rembg import remove, new_session
except ImportError:
    pass

CROPS_DIR = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def get_newest_upload():
    uploads_dir = os.path.join(CROPS_DIR, "new_uploads")
    if not os.path.exists(uploads_dir): return None
    files = glob.glob(os.path.join(uploads_dir, "media__*.png"))
    if not files: return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

def do_upo():
    src = get_newest_upload()
    if not src:
        # Fallback to the original source if new_uploads is somehow empty
        src = r"c:\Users\gabri\.gemini\antigravity\brain\38e74002-8293-4e72-b777-ad5cb76bf9b3\media__1774782529739.jpg"
        if not os.path.exists(src):
            print("No source image found")
            return

    print(f"Processing image: {src}")
    dst = os.path.join(CROPS_DIR, "upo.png")

    try:
        with Image.open(src) as img:
            img = img.convert("RGBA")
            img.thumbnail((768, 768), Image.Resampling.LANCZOS)
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            
            # Using u2net session for rembg
            session = new_session("u2net")
            output_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)
            out = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            # Crop to bounding box
            alpha = out.split()[-1]
            bbox = alpha.getbbox()
            if bbox:
                out = out.crop(bbox)
            
            # Additional transformations based on previous scripts
            out = out.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
            bbox = out.split()[-1].getbbox()
            if bbox:
                out = out.crop(bbox)
                
            out = out.transpose(Image.FLIP_LEFT_RIGHT)
            
            w, h = out.size
            scale = 480 / max(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
            canvas.paste(out, ((512 - new_w)//2, (512 - new_h)//2), out)
            
            canvas.save(dst, "PNG")
            print("Successfully processed and saved Upo! The tip is preserved.")
    except Exception as e:
        print(f"Failed to process with rembg: {e}")

if __name__ == "__main__":
    do_upo()
