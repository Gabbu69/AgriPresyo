from PIL import Image, ImageDraw

def floodfill_transparency(img_path):
    try:
        with Image.open(img_path) as img:
            img = img.convert("RGBA")
            width, height = img.size
            if width == 0 or height == 0: return False
            
            # Use ImageDraw.floodfill which uses C extension
            # To remove light backgrounds near corners
            # We treat pixels with r,g,b > 220 as background
            
            # Since floodfill in PIL uses strict equality or exact value matching with thresh,
            # we need to be careful. Thresh is a Manhattan distance threshold for RGB.
            # E.g. (255, 255, 255) thresh 35 covers down to roughly ~220
            
            # Let's check corner pixels. If they are light enough, floodfill them
            corners = [(0, 0), (0, height-1), (width-1, 0), (width-1, height-1)]
            
            changed = False
            for cx, cy in corners:
                pixel = img.getpixel((cx, cy))
                if pixel[3] > 0 and pixel[0] > 200 and pixel[1] > 200 and pixel[2] > 200:
                    ImageDraw.floodfill(img, (cx, cy), (0, 0, 0, 0), thresh=50)
                    changed = True
                    
            if changed:
                # Also crop the bounding box again, since we removed pixels
                alpha = img.split()[-1]
                bbox = alpha.getbbox()
                if bbox:
                    img = img.crop(bbox)
                img.save(img_path, "PNG")
            
            return True
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        return False

import os

crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
count = 0
for filename in os.listdir(crops_dir):
    if filename.endswith(".png") and filename not in ['watermelon.png', 'carrot.png']:
        file_path = os.path.join(crops_dir, filename)
        if floodfill_transparency(file_path):
            count += 1
            
print(f"Successfully processed {count} images with PIL floodfill.")
