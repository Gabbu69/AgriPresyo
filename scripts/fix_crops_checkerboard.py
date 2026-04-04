import os
from rembg import remove, new_session
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

session = new_session("u2net")

print("Starting Premium Padded + Center-Cropped Processor!")

for src, tgt in mapping.items():
    src_path = os.path.join(source_dir, src)
    tgt_path = os.path.join(target_dir, tgt)
    
    if not os.path.exists(src_path):
        continue

    print(f"Processing {src} -> {tgt}...")
    try:
        with Image.open(src_path) as img:
            if img.mode != 'RGB' and img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            w, h = img.size
            # 1. CROP out the fake checkerboard and outer green box!
            # The fruit is safely inside the middle 50%.
            crop_w = int(w * 0.22)
            crop_h = int(h * 0.22)
            box = (crop_w, crop_h, w - crop_w, h - crop_h)
            img = img.crop(box)
            
            # Standardize sizes before rembg
            img.thumbnail((512, 512), Image.Resampling.LANCZOS)
            
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            input_data = img_byte_arr.getvalue()
            
            # 2. Extract strictly the fruit from the now-solid green background
            output_data = remove(input_data, session=session, post_process_mask=True)
            
            out_img = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            # 3. Crop to the perfect bounding box of the fruit itself
            alpha = out_img.split()[-1]
            bbox = alpha.getbbox()
            if bbox:
                out_img = out_img.crop(bbox)
            
            # 4. Perfectly pad it back identically to the Watermelon UI scaling!
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

print("All fruits impeccably restored and perfectly padded!")
