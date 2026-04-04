import os
from rembg import remove, new_session
from PIL import Image

brain_dir = r"C:\Users\gabri\.gemini\antigravity\brain\a1d5a735-88de-411c-9230-fe7e36f67046"
out_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\new_uploads"

os.makedirs(out_dir, exist_ok=True)
session = new_session("u2net")

media_files = [f for f in os.listdir(brain_dir) if f.startswith("media__") and f.endswith(".jpg")]

for filename in media_files:
    file_path = os.path.join(brain_dir, filename)
    print(f"Processing {filename}...")
    try:
        img_orig = Image.open(file_path).convert("RGB")
        
        # Remove background using rembg
        output_img = remove(img_orig, session=session, post_process_mask=True)
        
        # Find exact bounding box of the non-transparent pixels
        alpha = output_img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            img_cropped = output_img.crop(bbox)
        else:
            img_cropped = output_img
            
        # Add beautiful 20% padding
        w, h = img_cropped.size
        max_dim = max(w, h)
        padding = int(max_dim * 0.20)
        target_size = max_dim + (padding * 2)
        
        squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
        
        offset_x = (target_size - w) // 2
        offset_y = (target_size - h) // 2
        
        squared_img.paste(img_cropped, (offset_x, offset_y), img_cropped)
        
        out_path = os.path.join(out_dir, filename.replace(".jpg", ".png"))
        squared_img.save(out_path, "PNG")
        print(f"-> Success: saved to {out_path}")
        
    except Exception as e:
        print(f"Error on {filename}: {e}")
