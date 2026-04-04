import os
import glob
import numpy as np
import colorsys
from PIL import Image

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

def is_dark_green(r, g, b):
    h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
    # The Upo background is a dark forest green.
    if v < 0.2: 
        return True
    if 0.15 < h < 0.50 and v < 0.45 and s > 0.15:
        return True
    return False

def fix_upo_fast():
    path = get_newest_upload()
    if not path:
        print("No new uploads found for Upo.")
        return
        
    print(f"Processing Upo from: {path} (Fast Method)")
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    
    # We will use the flood fill approach around the edges.
    h, w = arr.shape[:2]
    alpha = arr[:, :, 3]
    
    # Identify background by checking the border.
    # Upo is in the center. We can just set any dark-green pixel to transparent.
    for y in range(h):
        for x in range(w):
            if alpha[y, x] > 0:
                r, g, b = arr[y, x, 0], arr[y, x, 1], arr[y, x, 2]
                if is_dark_green(r, g, b):
                    alpha[y, x] = 0
                    
    arr[:, :, 3] = alpha
    
    # Let's clean up any noise: keep only the largest connected component if necessary.
    # But usually color threshold is enough for this specific image.
    out = Image.fromarray(arr)
    
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
        
    # Apply slant and flip
    out = out.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
    
    out = out.transpose(Image.FLIP_LEFT_RIGHT)
    
    w_out, h_out = out.size
    target_max = 440
    scale = target_max / max(w_out, h_out)
    new_w, new_h = int(w_out * scale), int(h_out * scale)
    out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(out, (offset_x, offset_y), out)
    
    out_path = os.path.join(CROPS_DIR, "upo.png")
    canvas.save(out_path, "PNG")
    print(f"Saved Upo to {out_path}")

def fix_pineapple_fast():
    path = os.path.join(CROPS_DIR, "pineapple.png")
    if not os.path.exists(path):
        return
        
    print(f"Enlarging Pineapple...")
    img = Image.open(path).convert("RGBA")
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    w_out, h_out = img.size
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

def fix_grapes_fast():
    path = os.path.join(CROPS_DIR, "grapes.png")
    if not os.path.exists(path):
        return
        
    print(f"Fixing Grapes white background...")
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    
    # White background fringe removal
    # Typically R,G,B > 180 and alpha > 0
    white_mask = (r > 180) & (g > 180) & (b > 180) & (a > 3)
    
    # Also fade the very borders
    arr[white_mask, 3] = 0
    
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
    fix_upo_fast()
    fix_pineapple_fast()
    fix_grapes_fast()
