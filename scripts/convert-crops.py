import os
from PIL import Image

crops_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/crops'))

if not os.path.exists(crops_dir):
    print(f"Directory {crops_dir} does not exist!")
    exit(1)

count = 0
saved_bytes = 0

for filename in os.listdir(crops_dir):
    if filename.lower().endswith('.png'):
        png_path = os.path.join(crops_dir, filename)
        webp_path = os.path.join(crops_dir, os.path.splitext(filename)[0] + '.webp')
        
        try:
            old_size = os.path.getsize(png_path)
            
            with Image.open(png_path) as img:
                img.save(webp_path, 'webp', quality=80)
            
            new_size = os.path.getsize(webp_path)
            saved = old_size - new_size
            saved_bytes += saved
            count += 1
            
            print(f"Converted {filename} to WebP. Saved {saved / 1024:.2f} KB")
            
            os.remove(png_path)
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")

print(f"\nSuccessfully converted {count} images.")
print(f"Total space saved: {saved_bytes / 1024 / 1024:.2f} MB")
