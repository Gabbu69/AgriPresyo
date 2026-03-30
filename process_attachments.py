import os
from rembg import remove, new_session
from PIL import Image
import shutil

session = new_session("u2net")

task_dir = r"C:\Users\gabri\.gemini\antigravity\brain\17e8ac80-88de-4521-86f4-a0feffc1f92e"
target_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

mapping = {
    "media__1774700953038.jpg": "bell-pepper.png",
    "media__1774700966120.jpg": "grapes.png",
    "media__1774700966447.jpg": "orange.png",
    "media__1774700967520.jpg": "pechay.png",
    "media__1774700969657.jpg": "apple.png"
}

def process_file(source_file, target_file):
    print(f"Processing {source_file} to {os.path.basename(target_file)}...")
    try:
        img_orig = Image.open(source_file).convert("RGB")
        output_img = remove(img_orig, session=session, post_process_mask=True)
        alpha = output_img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            img_cropped = output_img.crop(bbox)
        else:
            img_cropped = output_img
            
        w, h = img_cropped.size
        max_dim = max(w, h)
        padding = int(max_dim * 0.20)
        target_size = max_dim + (padding * 2)
        
        squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
        offset_x = (target_size - w) // 2
        offset_y = (target_size - h) // 2
        squared_img.paste(img_cropped, (offset_x, offset_y), img_cropped)
        
        squared_img.save(target_file, "PNG")
        print(f"-> Success: {os.path.basename(target_file)}")
        
    except Exception as e:
        print(f"Error on {os.path.basename(target_file)}: {e}")

for source_name, target_name in mapping.items():
    source_path = os.path.join(task_dir, source_name)
    target_path = os.path.join(target_dir, target_name)
    if os.path.exists(source_path):
        process_file(source_path, target_path)
    else:
        print(f"Source file {source_path} not found.")

print("Done processing user provided images.")
