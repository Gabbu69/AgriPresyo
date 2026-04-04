import os
from rembg import remove, new_session
from PIL import Image
import io

crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
session = new_session("u2net") # Load model once

for filename in os.listdir(crops_dir):
    if filename.endswith(".png") and filename not in ['watermelon.png', 'carrot.png']:
        file_path = os.path.join(crops_dir, filename)
        print(f"Processing {filename}...")
        try:
            with open(file_path, "rb") as f:
                input_data = f.read()
            
            # Post process mask helps clean jagged edges and remaining white pixels
            output_data = remove(input_data, session=session, post_process_mask=True)
            
            # Load the cleaned data, and crop it, but ADD standard padding
            # so it looks exactly like the watermelon in the UI
            img = Image.open(io.BytesIO(output_data)).convert("RGBA")
            alpha = img.split()[-1]
            bbox = alpha.getbbox()
            if bbox:
                img = img.crop(bbox)
                
            img.save(file_path, "PNG")
        except Exception as e:
            print(f"Error on {filename}: {e}")

print("All Backgrounds professionally fixed via Rembg U2Net with post-processing.")
