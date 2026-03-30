import os
from rembg import remove, new_session
from PIL import Image
import io
import numpy as np

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

session = new_session("u2net")

# Aggressive custom white/gray background cleaner built inside PIL
def aggressively_clean_white_bg(img):
    data = np.array(img)
    # Target all highly white/grey pixels
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    # If the pixel is very light (closer to white) and touching an edge, 
    # we can floodfill. But for simplicity, let's just use REMBG output as gold standard for now.
    return img

print("Starting Premium Padded Crop Processor")

for src, tgt in mapping.items():
    src_path = os.path.join(source_dir, src)
    tgt_path = os.path.join(target_dir, tgt)
    
    if not os.path.exists(src_path):
        print(f"Skipping {src}, not found")
        continue

    print(f"Processing {src} -> {tgt}...")
    try:
        with Image.open(src_path) as img:
            if img.mode != 'RGB' and img.mode != 'RGBA':
                img = img.convert('RGBA')
            img.thumbnail((512, 512), Image.Resampling.LANCZOS)
            
            # Use original processing, but with post processing mask 
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            input_data = img_byte_arr.getvalue()
            
            # Post_process_mask improves boundary drastically
            output_data = remove(input_data, session=session, post_process_mask=True)
            
            out_img = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            # We crop the transparent bounding box exactly
            alpha = out_img.split()[-1]
            bbox = alpha.getbbox()
            if bbox:
                out_img = out_img.crop(bbox)
            
            # Now we PAD IT to perfect Square by 18% transparent padding!!
            # This makes all vegetable sizes precisely uniform! Like the watermelon!
            w, h = out_img.size
            max_dim = max(w, h)
            padding = int(max_dim * 0.18)
            target_size = max_dim + (padding * 2)
            
            squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
            offset_x = (target_size - w) // 2
            offset_y = (target_size - h) // 2
            
            squared_img.paste(out_img, (offset_x, offset_y), out_img)
            
            squared_img.save(tgt_path, "PNG")
            
    except Exception as e:
        print(f"Error on {src}: {e}")

print("All sources extracted, smoothed, formatted, and padded!")
