"""
Fix the slant direction of long crop images to match ube/gabi.

Ube/Gabi: thick/top end at upper-RIGHT, tapered end at lower-LEFT
         visually: top-right to bottom-left like \

Current problem: many images have the opposite orientation.
Fix: horizontally flip them so they match ube/gabi direction.
"""

import os
import numpy as np
from PIL import Image

CROPS_DIR = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
CANVAS_SIZE = 512

def get_real_bbox(img, threshold=15):
    np_img = np.array(img)
    alpha = np_img[:, :, 3]
    y_indices, x_indices = np.where(alpha > threshold)
    if len(y_indices) == 0:
        return None
    return (x_indices.min(), y_indices.min(), x_indices.max(), y_indices.max())

def flip_and_recenter(img_path):
    """Horizontally flip image and re-center on 512x512 canvas."""
    print(f"  Flipping: {os.path.basename(img_path)}")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"    Error: {e}")
        return

    # Flip horizontally to reverse the slant direction
    img = img.transpose(Image.FLIP_LEFT_RIGHT)
    
    # Crop tight
    bbox = get_real_bbox(img, threshold=25)
    if bbox:
        img = img.crop(bbox)

    # Re-center on 512x512 canvas
    w, h = img.size
    max_dim = max(w, h)
    if max_dim > 0:
        scale = CANVAS_SIZE / float(max_dim)
        new_w, new_h = int(w * scale), int(h * scale)
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        final = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        offset_x = (CANVAS_SIZE - new_w) // 2
        offset_y = (CANVAS_SIZE - new_h) // 2
        final.paste(resized, (offset_x, offset_y), resized)
        final.save(img_path, "PNG")
        print(f"    Done!")

def main():
    # These images are slanting the wrong way (/) and need to be flipped to match (\)
    targets = [
        "carrot.png",
        "eggplant.png",
        "ampalaya.png",
        "okra.png",
        "sitaw.png",
        "pickle_ultimate.png",
        "pickle_final.png",
    ]

    print("=" * 50)
    print("Flipping long images to match ube/gabi \\ slant")
    print("=" * 50)
    
    for filename in targets:
        path = os.path.join(CROPS_DIR, filename)
        if os.path.exists(path):
            flip_and_recenter(path)
        else:
            print(f"  Skipping {filename} (not found)")

    print("\nDone! All images should now match the \\ direction.")

if __name__ == "__main__":
    main()
