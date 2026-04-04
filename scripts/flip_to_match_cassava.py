"""
Flip all long crop images horizontally to match the cassava direction.
Cassava is the ONLY correctly-facing image. All others need to be flipped.
Do NOT touch cassava.
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
    name = os.path.basename(img_path)
    print(f"  Flipping: {name}")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"    Error: {e}")
        return

    # Flip horizontally
    img = img.transpose(Image.FLIP_LEFT_RIGHT)
    
    # Crop tight
    bbox = get_real_bbox(img, threshold=25)
    if bbox:
        img = img.crop(bbox)

    # Re-center on canvas
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
    # ALL long images EXCEPT cassava need flipping
    targets = [
        "carrot.png",
        "eggplant.png",
        "okra.png",
        "ampalaya.png",
        "chili.png",
        "upo.png",
        "sitaw.png",
        "pickle_ultimate.png",
        "pickle_final.png",
        "banana.png",
    ]

    print("=" * 50)
    print("Flipping all long images to match CASSAVA direction")
    print("(Cassava is NOT touched)")
    print("=" * 50)
    
    for filename in targets:
        path = os.path.join(CROPS_DIR, filename)
        if os.path.exists(path):
            flip_and_recenter(path)
        else:
            print(f"  Skipping {filename} (not found)")

    print("\nDone!")

if __name__ == "__main__":
    main()
