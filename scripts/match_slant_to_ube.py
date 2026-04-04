"""
Match the slant of long crop images to follow the ube/gabi diagonal direction.

Ube and Gabi slant like \ (top-left to bottom-right, clockwise lean).
Currently many long images are either vertical or horizontal.
This script rotates them to match that \ diagonal.

Strategy:
- For vertical images (okra, eggplant, ampalaya, chili, cassava): rotate -35 degrees (CW)
- For horizontal images (carrot, upo, pickle, sitaw): rotate to get the same \ diagonal
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
    x_min, x_max = x_indices.min(), x_indices.max()
    y_min, y_max = y_indices.min(), y_indices.max()
    return (x_min, y_min, x_max, y_max)

def get_orientation(img):
    """Determine if image content is vertical, horizontal, or roughly square."""
    bbox = get_real_bbox(img)
    if bbox is None:
        return "unknown", 1.0
    x_min, y_min, x_max, y_max = bbox
    w = x_max - x_min
    h = y_max - y_min
    ratio = h / max(w, 1)
    if ratio > 1.3:
        return "vertical", ratio
    elif ratio < 0.77:
        return "horizontal", ratio
    else:
        return "square", ratio

def apply_slant(img_path, rotation_angle):
    """
    Rotate image by the given angle, crop tight, and re-center on 512x512 canvas.
    Positive angle = CCW, negative = CW in PIL.
    """
    print(f"\nProcessing: {os.path.basename(img_path)}")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"  Error opening: {e}")
        return

    orientation, ratio = get_orientation(img)
    print(f"  Orientation: {orientation} (ratio h/w = {ratio:.2f})")
    print(f"  Rotating by {rotation_angle} degrees...")

    # Rotate with expand to avoid clipping
    rotated = img.rotate(rotation_angle, expand=True, resample=Image.BICUBIC)

    # Crop to tight bounding box
    bbox = get_real_bbox(rotated, threshold=25)
    if bbox:
        rotated = rotated.crop(bbox)

    # Scale to fill canvas
    w, h = rotated.size
    max_dim = max(w, h)

    if max_dim > 0:
        scale = CANVAS_SIZE / float(max_dim)
        new_w, new_h = int(w * scale), int(h * scale)
        resized = rotated.resize((new_w, new_h), Image.Resampling.LANCZOS)

        final = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        offset_x = (CANVAS_SIZE - new_w) // 2
        offset_y = (CANVAS_SIZE - new_h) // 2
        final.paste(resized, (offset_x, offset_y), resized)
        final.save(img_path, "PNG")
        print(f"  Saved successfully!")
    else:
        print(f"  Skipped (empty image)")

def main():
    # Target: match ube/gabi \ slant (leaning from top-left toward bottom-right)
    #
    # For VERTICAL images: need to tilt clockwise (~-35°) to go from | to \
    # For HORIZONTAL images: need to tilt to go from — to \
    #   Horizontal images pointing right need CCW rotation (~+55°) to go from — to \
    #   But some horizontal images may point left, so we check case by case.
    
    # Images and their needed rotation to achieve \ slant
    # Negative = clockwise, Positive = counter-clockwise (PIL convention)
    tasks = {
        # Currently vertical — rotate CW to make \  
        "okra.png": -35,
        "eggplant.png": -35,
        "ampalaya.png": -35,
        "chili.png": -35,
        "cassava.png": -35,

        # Currently horizontal — rotate to make \
        # Carrot points left-to-right, tip on left, thick on right
        # To make \ (top-left to bottom-right): rotate CW by ~55°
        "carrot.png": -55,
        # Upo points left-to-right, stem on right
        "upo.png": -55,
        # Pickle is horizontal
        "pickle_ultimate.png": -55,
        "pickle_final.png": -55,
        # Sitaw is horizontal bundle  
        "sitaw.png": -35,
    }

    print("=" * 60)
    print("Matching slant to Ube/Gabi direction (\\)")
    print("=" * 60)

    for filename, angle in tasks.items():
        path = os.path.join(CROPS_DIR, filename)
        if os.path.exists(path):
            # First check current orientation to adjust angle
            img = Image.open(path).convert("RGBA")
            orientation, ratio = get_orientation(img)
            img.close()
            
            apply_slant(path, angle)
        else:
            print(f"\n  Skipping {filename} (not found)")

    print("\n" + "=" * 60)
    print("Done! All long images now match the \\ slant direction.")
    print("=" * 60)

if __name__ == "__main__":
    main()
