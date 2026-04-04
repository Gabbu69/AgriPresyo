import os
from rembg import remove, new_session
from PIL import Image, ImageChops
import io
import numpy as np

crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
session = new_session("u2net") # Load model once

def process_file(file_path):
    print(f"Processing {os.path.basename(file_path)}...")
    try:
        with open(file_path, "rb") as f:
            input_data = f.read()
        
        # 1. Remove background cleanly with post_process_mask to clean jagged edges
        output_data = remove(input_data, session=session, post_process_mask=True, alpha_matting=True)
        
        # 2. Add professional padding to make it identical to the watermelon!
        img = Image.open(io.BytesIO(output_data)).convert("RGBA")
        
        # Find pure bounding box
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            img = img.crop(bbox)
        
        # 3. Create a perfect padded square to frame it beautifully in the UI
        w, h = img.size
        max_dim = max(w, h)
        
        # Calculate padding (e.g. 20% of the image size so it breathes nicely)
        padding = int(max_dim * 0.20)
        target_size = max_dim + (padding * 2)
        
        # Create a new transparent image with the target size
        squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
        
        # Calculate exact center placement
        offset_x = (target_size - w) // 2
        offset_y = (target_size - h) // 2
        
        squared_img.paste(img, (offset_x, offset_y), img)
        
        # Save beautifully formatted icon back
        squared_img.save(file_path, "PNG")
        print(f"-> Success: {os.path.basename(file_path)}")
        
    except Exception as e:
        print(f"Error on {os.path.basename(file_path)}: {e}")

for filename in os.listdir(crops_dir):
    if filename.endswith(".png") and filename not in ['watermelon.png', 'carrot.png']:
        file_path = os.path.join(crops_dir, filename)
        process_file(file_path)

print("All crop images have been re-processed, background cleaned, and padded professionally!")
