import os
from rembg import remove, new_session
from PIL import Image
import io

media_files = [
    r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134560.jpg",
    r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134938.jpg"
]

session = new_session("isnet-general-use")

def process_file(src_path, tgt_name):
    print(f"Processing {tgt_name} from {src_path}...")
    try:
        with Image.open(src_path) as img:
            if img.mode != 'RGB' and img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # Use original size if not too big to keep quality before extraction
            img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
            
            # The green background might be tricky, let's just see how rembg does
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            input_data = img_byte_arr.getvalue()
            
            output_data = remove(input_data, session=session, post_process_mask=True)
            
            out_img = Image.open(io.BytesIO(output_data)).convert("RGBA")
            
            # Auto-crop the transparent bounds
            alpha = out_img.split()[-1]
            bbox = alpha.getbbox()
            if bbox:
                out_img = out_img.crop(bbox)
            
            # Pad and square
            w, h = out_img.size
            max_dim = max(w, h)
            padding = int(max_dim * 0.18)
            target_size = max_dim + (padding * 2)
            
            squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
            offset_x = (target_size - w) // 2
            offset_y = (target_size - h) // 2
            
            squared_img.paste(out_img, (offset_x, offset_y), out_img)
            
            tgt_path = os.path.join(r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops", f"{tgt_name}.png")
            squared_img.save(tgt_path, "PNG")
            print(f"Saved to {tgt_path}")
    except Exception as e:
        print(f"Error: {e}")

# Just run them and name them temp1, temp2 so we can see which is which or just name them poncan and pickle
process_file(media_files[0], "poncan")
process_file(media_files[1], "pickle")

