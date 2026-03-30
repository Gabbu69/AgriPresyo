import os
from PIL import Image

def crop_transparent(image_path):
    try:
        with Image.open(image_path) as img:
            img = img.convert("RGBA")
            # Get bounding box of non-transparent content
            # The getbbox() method returns the bounding box of non-zero regions.
            # We need to extract the alpha channel first
            alpha = img.split()[-1]
            bbox = alpha.getbbox()
            
            if bbox:
                # Crop the image to the bounding box
                cropped_img = img.crop(bbox)
                
                # Resize if it's too big, though cropping makes it smaller.
                # Maybe make it square if needed? Actually just cropping is fine.
                cropped_img.save(image_path, "PNG")
                return True
            else:
                return False
    except Exception as e:
        print(f"Failed to process {image_path}: {e}")
        return False

crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

count = 0
for filename in os.listdir(crops_dir):
    if filename.endswith(".png"):
        file_path = os.path.join(crops_dir, filename)
        if crop_transparent(file_path):
            count += 1

print(f"Successfully cropped {count} images in {crops_dir}")
