import os
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def make_bigger(filename, target_size=512):
    path = os.path.join(CROPS_DIR, filename)
    if not os.path.exists(path):
        print(f"{filename} not found.")
        return
        
    print(f"Enlarging {filename} to {target_size}px...")
    img = Image.open(path).convert("RGBA")
    
    # crop strictly to pixel boundaries
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    w, h = img.size
    
    scale = target_size / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print(f"Saved {filename} enlarged!")

def rotate_180(filename):
    path = os.path.join(CROPS_DIR, filename)
    if not os.path.exists(path):
        print(f"{filename} not found.")
        return
        
    print(f"Rotating {filename} 180 degrees...")
    img = Image.open(path).convert("RGBA")
    
    img = img.rotate(180, expand=True)
    
    # Crop to transparent bounding box and keep it nicely formatted?
    # Actually, spinning a 512x512 image 180 degrees is the same as just .rotate(180).
    # Just in case it shifts, we can recreate the clean center:
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    w, h = img.size
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - w) // 2
    offset_y = (512 - h) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print(f"Saved {filename} rotated 180 degrees!")

if __name__ == "__main__":
    make_bigger("pineapple.png", 512)
    rotate_180("okra.png")
