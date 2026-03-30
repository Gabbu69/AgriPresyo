"""
Process uploaded crop images - simplified approach:
1. Crop to opaque card area
2. Downscale to small size for rembg
3. Flatten onto white bg
4. Run rembg WITHOUT alpha matting (causes OOM)
"""
import os
import numpy as np
from PIL import Image
from rembg import remove, new_session
import io

SRC = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg"
DST = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

FILES_TO_PROCESS = {
    "Atsal.png": "bell-pepper.png",
    "Upo.png": "upo.png",
    "Kalabasa (Squash).png": "kalabasa.png",
    "Poncan.png": "poncan.png",
    "Fuji Apple.png": "apple.png",
    "Grapes.png": "grapes.png",
}

SESSION = new_session("isnet-general-use")

def process_image(src_path, dst_path):
    print(f"Processing: {os.path.basename(src_path)} -> {os.path.basename(dst_path)}")
    
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img)
    
    # Find opaque card bounding box
    alpha = arr[:, :, 3]
    opaque = alpha > 10
    rows = np.any(opaque, axis=1)
    cols = np.any(opaque, axis=0)
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    # Crop to card
    card = img.crop((cmin, rmin, cmax + 1, rmax + 1))
    
    # Downscale to 512px for processing
    w, h = card.size
    max_dim = 512
    ratio = min(max_dim / w, max_dim / h, 1.0)
    if ratio < 1:
        card = card.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)
    
    # Flatten onto white bg
    rgb = Image.new("RGB", card.size, (255, 255, 255))
    rgb.paste(card, mask=card.split()[3])
    
    # Run rembg - NO alpha matting
    buf = io.BytesIO()
    rgb.save(buf, "PNG")
    
    output_data = remove(
        buf.getvalue(),
        session=SESSION,
        alpha_matting=False,
    )
    
    result = Image.open(io.BytesIO(output_data)).convert("RGBA")
    
    # Crop to content
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
    
    # Add padding
    w, h = result.size
    pad = int(max(w, h) * 0.08)
    padded = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    padded.paste(result, (pad, pad))
    
    padded.save(dst_path, "PNG")
    print(f"  Saved: {dst_path} ({padded.size[0]}x{padded.size[1]})")

def main():
    for src_name, dst_name in FILES_TO_PROCESS.items():
        src_path = os.path.join(SRC, src_name)
        dst_path = os.path.join(DST, dst_name)
        if not os.path.exists(src_path):
            print(f"  SKIPPED: {src_name}")
            continue
        try:
            process_image(src_path, dst_path)
        except Exception as e:
            import traceback
            print(f"  ERROR: {e}")
            traceback.print_exc()
    print("\nDone!")

if __name__ == "__main__":
    main()
