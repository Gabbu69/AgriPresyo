from PIL import Image
import os
import shutil

def resize_to_full(img_path):
    print(f"Resizing {img_path} to 100% scale...")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"Failed to open {img_path}: {e}")
        return

    # Find the bounding box of non-transparent areas
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        print(f"Image {img_path} is completely transparent!")
        return
    
    # Crop to just the fruit
    cropped = img.crop(bbox)
    
    w, h = cropped.size
    max_dim = max(w, h)
    
    target_canvas = 512
    # Scale to exactly 100% (or say 98% to prevent edge-bleeding issues in CSS)
    # The user asked for it to look like watermelon (ratio 1.0)
    scale = target_canvas / float(max_dim)
    
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    final_canvas = Image.new("RGBA", (target_canvas, target_canvas), (0, 0, 0, 0))
    offset_x = (target_canvas - new_w) // 2
    offset_y = (target_canvas - new_h) // 2
    
    final_canvas.paste(resized, (offset_x, offset_y), resized)
    final_canvas.save(img_path, "PNG")
    print(f"Successfully scaled {img_path}")

def main():
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    files_to_resize = [
        "pickle_ultimate.png",
        "poncan_final.png",
        "kalabasa.png",
        "apple.png"
    ]
    
    for f in files_to_resize:
        resize_to_full(os.path.join(crops_dir, f))
        
    # Copy pickle_ultimate.png to pickle_final.png since both are used
    shutil.copy(os.path.join(crops_dir, "pickle_ultimate.png"), os.path.join(crops_dir, "pickle_final.png"))

if __name__ == "__main__":
    main()
