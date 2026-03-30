import os
import numpy as np
from PIL import Image

def get_real_bbox(img, threshold=15):
    np_img = np.array(img)
    alpha = np_img[:, :, 3]
    y_indices, x_indices = np.where(alpha > threshold)
    if len(y_indices) == 0:
        return None
    x_min, x_max = x_indices.min(), x_indices.max()
    y_min, y_max = y_indices.min(), y_indices.max()
    return (x_min, y_min, x_max, y_max)

def straighten_image(img_path):
    print(f"Straightening {img_path}...")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening {img_path}: {e}")
        return

    # Assuming current state is slanted at / (approx +45 degrees).
    # Rotate by -45 degrees (CW) to move back to vertical.
    img = img.rotate(-45, expand=True, resample=Image.BICUBIC)
        
    # Re-crop tight
    bbox = get_real_bbox(img, threshold=25)
    if bbox:
        img = img.crop(bbox)
        
    # Scale to fill 512x512
    w, h = img.size
    max_dim = max(w, h)
    target_canvas = 512
    
    if max_dim > 0:
        scale = target_canvas / float(max_dim)
        new_w, new_h = int(w * scale), int(h * scale)
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        final = Image.new("RGBA", (target_canvas, target_canvas), (0, 0, 0, 0))
        offset_x, offset_y = (target_canvas - new_w) // 2, (target_canvas - new_h) // 2
        final.paste(resized, (offset_x, offset_y), resized)
        final.save(img_path, "PNG")
        print(f"Successfully straightened {img_path}")

def main():
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    
    targets = [
        "okra.png",
        "eggplant.png",
        "ampalaya.png",
        "chili.png",
        "cassava.png",
        "upo.png",
        "sitaw.png",
        "banana.png",
        "pickle_ultimate.png",
        "pickle_final.png",
        "carrot.png"
    ]
    
    for filename in targets:
        path = os.path.join(crops_dir, filename)
        if os.path.exists(path):
            straighten_image(path)

if __name__ == "__main__":
    main()
