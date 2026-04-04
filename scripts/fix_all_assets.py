import os
import io
import glob
import numpy as np
from PIL import Image
from rembg import remove, new_session

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def get_newest_upload():
    uploads_dir = os.path.join(CROPS_DIR, "new_uploads")
    if not os.path.exists(uploads_dir):
        return None
    files = glob.glob(os.path.join(uploads_dir, "media__*.png"))
    if not files:
        return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

def fix_upo():
    path = get_newest_upload()
    if not path:
        print("No new uploads found for Upo.")
        return
        
    print(f"Processing Upo from: {path}")
    session = new_session("u2net")
    with Image.open(path) as img:
        img = img.convert("RGBA")
        img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        input_data = img_byte_arr.getvalue()
        
        output_data = remove(input_data, session=session, post_process_mask=True)
        out_img = Image.open(io.BytesIO(output_data)).convert("RGBA")
        
        alpha = out_img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            out_img = out_img.crop(bbox)
            
        # Rotate by -15 degrees clockwise for an aesthetic slant
        out_img = out_img.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
        
        # crop again after rotation
        alpha = out_img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            out_img = out_img.crop(bbox)
            
        w_out, h_out = out_img.size
        # Make largest dimension 440 to fit comfortably inside 512
        target_max = 440
        scale = target_max / max(w_out, h_out)
        new_w, new_h = int(w_out * scale), int(h_out * scale)
        out_img = out_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Flip visually to match the other long crops which were flipped recently
        out_img = out_img.transpose(Image.FLIP_LEFT_RIGHT)
        
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        offset_x = (512 - new_w) // 2
        offset_y = (512 - new_h) // 2
        canvas.paste(out_img, (offset_x, offset_y), out_img)
        
        out_path = os.path.join(CROPS_DIR, "upo.png")
        canvas.save(out_path, "PNG")
        print(f"Saved Upo to {out_path}")

def fix_pineapple():
    path = os.path.join(CROPS_DIR, "pineapple.png")
    if not os.path.exists(path):
        print("Pineapple image not found.")
        return
        
    print(f"Enlarging Pineapple...")
    with Image.open(path) as img:
        img = img.convert("RGBA")
        
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        w_out, h_out = img.size
        # Enlarge to take up most of the 512 space
        target_max = 470
        scale = target_max / max(w_out, h_out)
        new_w, new_h = int(w_out * scale), int(h_out * scale)
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        offset_x = (512 - new_w) // 2
        offset_y = (512 - new_h) // 2
        canvas.paste(img, (offset_x, offset_y), img)
        
        canvas.save(path, "PNG")
        print(f"Saved Enlarged Pineapple to {path}")

def fix_grapes():
    path = os.path.join(CROPS_DIR, "grapes.png")
    if not os.path.exists(path):
        print("Grapes image not found.")
        return
        
    print(f"Fixing Grapes white background...")
    with Image.open(path) as img:
        img = img.convert("RGBA")
        arr = np.array(img)
        
        r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
        
        # Identify pixels that are quite light/white and have alpha
        # A white fringe usually has R>180, G>180, B>180 and some alpha mapping onto it
        white_mask = (r > 190) & (g > 190) & (b > 190) & (a > 5)
        
        a[white_mask] = 0
        arr[:, :, 3] = a
        
        out = Image.fromarray(arr)
        
        alpha = out.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            out = out.crop(bbox)
            
        w_out, h_out = out.size
        target_max = 440
        scale = target_max / max(w_out, h_out)
        new_w, new_h = int(w_out * scale), int(h_out * scale)
        out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        offset_x = (512 - new_w) // 2
        offset_y = (512 - new_h) // 2
        canvas.paste(out, (offset_x, offset_y), out)
        
        canvas.save(path, "PNG")
        print(f"Saved fixed Grapes to {path}")

if __name__ == "__main__":
    fix_upo()
    fix_pineapple()
    fix_grapes()
