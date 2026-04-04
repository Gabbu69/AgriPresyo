import os
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def make_bigger(*args):
    for filename in args:
        path = os.path.join(CROPS_DIR, filename)
        if not os.path.exists(path):
            print(f"{filename} not found.")
            continue
            
        print(f"Enlarging {filename}...")
        img = Image.open(path).convert("RGBA")
        
        # crop strictly to pixel boundaries to clear out empty space
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        w, h = img.size
        
        # Maximize the size to fill the 512x512 canvas almost entirely.
        target = 490
        
        scale = target / max(w, h)
        new_w, new_h = int(w * scale), int(h * scale)
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        offset_x = (512 - new_w) // 2
        offset_y = (512 - new_h) // 2
        canvas.paste(img, (offset_x, offset_y), img)
        
        canvas.save(path, "PNG")
        print(f"Saved {filename} enormously enlarged!")

if __name__ == "__main__":
    make_bigger("pineapple.png", "onion.png")
