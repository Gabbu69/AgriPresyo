import os
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def rotate_180(filename):
    path = os.path.join(CROPS_DIR, filename)
    if not os.path.exists(path):
        print(f"{filename} not found.")
        return
        
    print(f"Rotating {filename} 180 degrees...")
    img = Image.open(path).convert("RGBA")
    
    img = img.rotate(180, expand=True)
    
    # Quick clean bounding box center just in case
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    w, h = img.size
    scale = 510 / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print(f"Saved {filename} rotated 180 degrees!")

if __name__ == "__main__":
    rotate_180("upo.png")
