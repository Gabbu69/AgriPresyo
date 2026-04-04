import os
import glob
import numpy as np
from PIL import Image

def get_real_bbox(img, threshold=15):
    # img is PIL Image
    np_img = np.array(img)
    alpha = np_img[:, :, 3]
    y_indices, x_indices = np.where(alpha > threshold)
    if len(y_indices) == 0:
        return None
    x_min, x_max = x_indices.min(), x_indices.max()
    y_min, y_max = y_indices.min(), y_indices.max()
    return (x_min, y_min, x_max, y_max)

def process_image(img_path, slanted=False):
    print(f"Processing {'[SLANTED] ' if slanted else ''}{img_path}...")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"Failed to open {img_path}: {e}")
        return False

    # 1. Real crop
    bbox = get_real_bbox(img, threshold=25) # Use 25 to be safe from rembg noise
    if not bbox:
        print(f"Skipping entirely transparent: {img_path}")
        return False
    
    img = img.crop(bbox)

    # 2. Rotate if needed
    if slanted:
        # Rotate -45 degrees (clockwise). Expand=True so we don't clip corners
        img = img.rotate(-45, expand=True, resample=Image.BICUBIC)
        # Re-crop after rotation just to be perfectly tight
        bbox = get_real_bbox(img, threshold=20)
        if bbox:
            img = img.crop(bbox)
        
    # 3. Maximize bounds to 512
    w, h = img.size
    max_dim = max(w, h)
    
    target_canvas = 512
    # Ensure it's not dividing by zero
    if max_dim == 0:
        return False
        
    scale = target_canvas / float(max_dim)
    
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    if new_w > 0 and new_h > 0:
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        final_canvas = Image.new("RGBA", (target_canvas, target_canvas), (0, 0, 0, 0))
        offset_x = (target_canvas - new_w) // 2
        offset_y = (target_canvas - new_h) // 2
        
        final_canvas.paste(resized, (offset_x, offset_y), resized)
        final_canvas.save(img_path, "PNG")
        print(f"Successfully optimized {img_path}")
        return True
    return False

def main():
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    
    # List of files user mentioned to enlarge
    targets = [
        "pineapple.png",
        "banana.png",
        "coconut.png",
        "rambutan.png",
        "lanzones.png",
        "okra.png",
        "cabbage.png",
        "eggplant.png",
        "kangkong.png",
        "ampalaya.png",
        "sitaw.png",
        "pechay.png",
        "ginger.png",
        "chili.png",
        "lemongrass.png",
        "potato.png",
        "carrot.png",
        "cassava.png",
        "upo.png",
        "grapes.png",
        "pickle_ultimate.png",
        "pickle_final.png",
        "pickle_cropped.png"
    ]
    
    long_crops = {
        "okra.png",
        "eggplant.png",
        "sitaw.png",
        "ampalaya.png",
        "chili.png",
        "lemongrass.png",
        "carrot.png",
        "cassava.png",
        "upo.png",
        "banana.png",
        "pickle_ultimate.png",
        "pickle_final.png",
        "pickle_cropped.png"
    }

    # Instead of just the ones mentioned, maybe apply the real-bounds to ALL pngs safely
    all_pngs = glob.glob(os.path.join(crops_dir, "*.png"))
    
    count = 0
    for file_path in all_pngs:
        filename = os.path.basename(file_path).lower()
        
        # Determine if it should be slanted
        slanted = filename in long_crops
        
        if process_image(file_path, slanted=slanted):
            count += 1
            
    print(f"\nFinished optimizing {count} images in {crops_dir}!")

if __name__ == "__main__":
    main()
