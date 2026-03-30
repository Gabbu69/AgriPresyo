import os
from rembg import remove
from PIL import Image
import io

source_dir = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg"
target_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

mapping = {
    "Ampalaya.png": "ampalaya.png",
    "Baguio Strawberries.png": "strawberry.png",
    "Buko (Young Coconut).png": "coconut.png",
    "Cabage.png": "cabbage.png",
    "Calamansi.png": "calamansi.png",
    "Carabao Mango.png": "mango.png",
    "Cassava.png": "cassava.png",
    "Davao Pomelo.png": "pomelo.png",
    "Gabi (Taro).png": "taro.png",
    "Hass Avocado.png": "avocado.png",
    "Ilocos Garlic.png": "garlic.png",
    "Kamote.png": "kamote.png",
    "Kangkong.png": "kangkong.png",
    "Lakatan Banana.png": "banana.png",
    "Long Eggplant.png": "eggplant.png",
    "Native Tomato.png": "tomato.png",
    "Pechay.png": "pechay.png",
    "Pineapple (Formosa).png": "pineapple.png",
    "Potato.png": "potato.png",
    "Red Onion.png": "onion.png",
    "Siling Labuyo.png": "chili.png",
    "Sitaw.png": "sitaw.png",
    "Solo Papaya.png": "papaya.png",
    "Tanglad.png": "lemongrass.png",
    "Ube.png": "ube.png",
    "Yellow Ginger.png": "ginger.png",
    "fresh okra.png": "okra.png",
    "Black Pepper.png": "black-pepper.png",
    "Lanzones.png": "lanzones.png",
    "Rambutan.png": "rambutan.png",
    "Sayote.png": "sayote.png"
}

os.makedirs(target_dir, exist_ok=True)

success_count = 0
for src, tgt in mapping.items():
    src_path = os.path.join(source_dir, src)
    tgt_path = os.path.join(target_dir, tgt)
    
    if os.path.exists(tgt_path):
        print(f"Skipping {tgt}, already exists.")
        continue
    
    if os.path.exists(src_path):
        print(f"Processing {src} -> {tgt}...")
        try:
            # Open the image using PIL
            with Image.open(src_path) as img:
                # Convert to RGB to ensure compatibility
                if img.mode != 'RGB' and img.mode != 'RGBA':
                    img = img.convert('RGBA')
                
                # Resize if the image is too large (max 512x512) to speed up rembg processing
                max_size = 512
                if img.width > max_size or img.height > max_size:
                    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
                # Convert back to bytes for rembg
                img_byte_arr = io.BytesIO()
                img.save(img_byte_arr, format='PNG')
                input_data = img_byte_arr.getvalue()
                
                # Remove background
                output_data = remove(input_data)
                
                # Save the result
                with open(tgt_path, "wb") as o:
                    o.write(output_data)
            success_count += 1
        except Exception as e:
            print(f"Error processing {src}: {e}")
    else:
        print(f"File not found: {src_path}")
        
print(f"Successfully processed {success_count} images.")
