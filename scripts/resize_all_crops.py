from PIL import Image
import os
import glob

def resize_to_full(img_path):
    print(f"Resizing {img_path} to max boundary...")
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"Failed to open {img_path}: {e}")
        return False

    # Find the bounding box of non-transparent areas
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        print(f"Skipping entirely transparent: {img_path}")
        return False
    
    # Crop to just the non-transparent
    cropped = img.crop(bbox)
    
    w, h = cropped.size
    max_dim = max(w, h)
    
    target_canvas = 512
    # Check if ratio is already perfect
    # We define "perfect" as max_dim taking 100% of target canvas size
    # and original size being 512x512
    orig_w, orig_h = img.size
    ratio = max_dim / float(max(orig_w, orig_h))
    
    if orig_w == 512 and orig_h == 512 and ratio > 0.98:# Almost touching the edges
        print(f"Already optimized: {img_path}")
        return False

    scale = target_canvas / float(max_dim)
    
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    if new_w > 0 and new_h > 0:
        resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        final_canvas = Image.new("RGBA", (target_canvas, target_canvas), (0, 0, 0, 0))
        offset_x = (target_canvas - new_w) // 2
        offset_y = (target_canvas - new_h) // 2
        
        final_canvas.paste(resized, (offset_x, offset_y), resized)
        final_canvas.save(img_path, "PNG")
        print(f"Successfully scaled {img_path}")
        return True
    return False

def main():
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    
    # Get all .png files directly inside crops_dir
    png_files = glob.glob(os.path.join(crops_dir, "*.png"))
    
    count = 0
    for file_path in png_files:
        if resize_to_full(file_path):
            count += 1
            
    print(f"\nFinished resizing {count} images in {crops_dir}!")

if __name__ == "__main__":
    main()
