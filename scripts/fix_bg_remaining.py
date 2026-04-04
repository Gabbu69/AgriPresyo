import os, io
from PIL import Image
from rembg import remove, new_session

def clear_bg():
    session = new_session("u2net")
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    
    for name in ["banana.png", "onion.png"]:
        p = os.path.join(crops_dir, name)
        if os.path.exists(p):
            print(f"Removing background for {name}...")
            try:
                with open(p, "rb") as f:
                    in_data = f.read()
                out_data = remove(in_data, session=session, post_process_mask=True)
                img = Image.open(io.BytesIO(out_data)).convert("RGBA")
                
                # Crop to tight bounding box
                alpha = img.split()[-1]
                bbox = alpha.getbbox()
                if bbox: img = img.crop(bbox)
                
                # Re-center
                w, h = img.size
                max_dim = max(w, h)
                if max_dim > 0:
                    scale = 512 / float(max_dim) * 0.85
                    new_w, new_h = int(w * scale), int(h * scale)
                    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                    final = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
                    final.paste(img, ((512 - new_w) // 2, (512 - new_h) // 2), img)
                    final.save(p, "PNG")
                    print(f"  Fixed {name}")
            except Exception as e:
                print(f"  Error {name}:", e)

if __name__ == "__main__":
    clear_bg()
