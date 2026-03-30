import os
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def flip_carrot():
    path = os.path.join(CROPS_DIR, "carrot.png")
    if not os.path.exists(path):
        print("carrot.png not found")
        return
        
    print("Flipping Carrot...")
    img = Image.open(path).convert("RGBA")
    
    # Flip horizontally
    img = img.transpose(Image.FLIP_LEFT_RIGHT)
    
    # Crop and re-center to make sure it's perfect
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    w, h = img.size
    
    # Keep its original scale basically, let's max it to 480 so it's consistent
    scale = 480 / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    
    canvas.save(path, "PNG")
    print("Saved reversed Carrot successfully!")

if __name__ == "__main__":
    flip_carrot()
