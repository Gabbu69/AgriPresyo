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

def fix_image(img_path, desired_slant):
    # desired_slant: 0 for straight, 1 for forward slash slant /
    print(f"Fixing {img_path} (Slant type {desired_slant})...")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening {img_path}: {e}")
        return

    # Current state: most were rotated -45 (CW) like \
    # We want to move them to what the user likes.
    # Ube looks like / (CCW).
    
    # We'll rotate them contextually. 
    # If it was -45, and we want 45, rotate by 90.
    # If it was -45, and we want 0, rotate by 45.
    
    rotation = 0
    if desired_slant == 0:
        # Straighten from \ (-45) -> 0. Rotate by 45.
        rotation = 45
    elif desired_slant == 1:
        # Move from \ (-45) -> / (+40ish). Rotate by approx 85?
        # Let's just do 90 to be standard.
        rotation = 90
        
    if rotation != 0:
        img = img.rotate(rotation, expand=True, resample=Image.BICUBIC)
        
    # Re-crop tight
    bbox = get_real_bbox(img, threshold=25)
    if bbox:
        img = img.crop(bbox)
        
    # Scale to fill 512x512
    w, h = img.size
    max_dim = max(w, h)
    target_canvas = 512
    
    if max_dim > 0:
        # To avoid edge bleeding, we'll use a tiny margin (98% of 512 or so, or just 512).
        # User said "make them larger like watermelon", watermelon was 1.0 ratio.
        scale = target_canvas / float(max_dim)
        new_w, new_h = int(w * scale), int(h * scale)
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        final = Image.new("RGBA", (target_canvas, target_canvas), (0, 0, 0, 0))
        offset_x, offset_y = (target_canvas - new_w) // 2, (target_canvas - new_h) // 2
        final.paste(resized, (offset_x, offset_y), resized)
        final.save(img_path, "PNG")
        print(f"Successfully fixed {img_path}")

def main():
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    
    # Slant 1 = forward slash /
    # Slant 0 = straight
    
    tasks = {
        "lemongrass.png": 0,    # Dont slant Tanglad
        "okra.png": 1,          # Fix slant Okra
        "eggplant.png": 1,      # Fix slant Long Eggplant
        "ampalaya.png": 1,      # Fix slant Ampalaya
        "chili.png": 1,         # Fix slant Siling labuyo
        "cassava.png": 1,       # Fix slant Fresh cassava
        "upo.png": 1,           # Implicit long ones
        "sitaw.png": 1,
        "banana.png": 1,
        "pickle_ultimate.png": 1,
        "pickle_final.png": 1,
        "carrot.png": 1
    }
    
    for filename, slant_type in tasks.items():
        path = os.path.join(crops_dir, filename)
        if os.path.exists(path):
            fix_image(path, slant_type)

if __name__ == "__main__":
    main()
