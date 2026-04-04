import io
from PIL import Image
from rembg import remove, new_session

img_paths = [
    r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134560.jpg",
    r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134938.jpg"
]

session = new_session("u2net")

for path in img_paths:
    is_poncan = "560.jpg" in path
    name = "poncan" if is_poncan else "pickle_fixed"
    
    print(f"Processing {name} without any pre-crop...")
    
    with Image.open(path) as img:
        img = img.convert("RGBA")
        # resize for u2net memory efficiency
        img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        input_data = img_byte_arr.getvalue()
        
        output_data = remove(input_data, session=session, post_process_mask=True)
        out_img = Image.open(io.BytesIO(output_data)).convert("RGBA")
        
        alpha = out_img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            out_img = out_img.crop(bbox)
            
        w_out, h_out = out_img.size
        max_dim = max(w_out, h_out)
        padding = int(max_dim * 0.18)
        target_size = max_dim + (padding * 2)
        
        squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
        offset_x = (target_size - w_out) // 2
        offset_y = (target_size - h_out) // 2
        squared_img.paste(out_img, (offset_x, offset_y), out_img)
        
        tgt_path = f"C:/Users/gabri/.gemini/antigravity/scratch/AgriPresyo/public/crops/{name}.png"
        squared_img.save(tgt_path, "PNG")
        print(f"Saved {name} to {tgt_path}")

