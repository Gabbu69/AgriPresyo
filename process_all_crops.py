import os
from rembg import remove, new_session
from PIL import Image
import io

crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
session = new_session("u2net")

def process_file(file_path):
    print(f"Processing {os.path.basename(file_path)}...")
    try:
        # Load the image and convert to RGB (removes alpha if present to help rembg)
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
            
        # Add beautiful 20% padding to match watermelon style
        w, h = img_cropped.size
        max_dim = max(w, h)
        padding = int(max_dim * 0.20)
        target_size = max_dim + (padding * 2)
        
        squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
        
        offset_x = (target_size - w) // 2
        offset_y = (target_size - h) // 2
        
        squared_img.paste(img_cropped, (offset_x, offset_y), img_cropped)
        
        # Save beautifully formatted icon back
        squared_img.save(file_path, "PNG")
        print(f"-> Success: {os.path.basename(file_path)}")
        
    except Exception as e:
        print(f"Error on {os.path.basename(file_path)}: {e}")

processed = 0
for filename in os.listdir(crops_dir):
    if filename.endswith(".png") and filename != "watermelon.png":
        file_path = os.path.join(crops_dir, filename)
        process_file(file_path)
        processed += 1

print(f"Total processed: {processed}")
