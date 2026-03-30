import os
import numpy as np
from PIL import Image

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

def process_image(src_path, dst_path):
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img).astype(np.float32)
    
    # 1. We just grab the center as a perfect circle and softly feather the immediate edge.
    h, w = arr.shape[:2]
    
    # Let's crop it to a square first to make a circle mask easy.
    size = min(h, w)
    
    # Crop to center square
    sy = (h - size) // 2
    sx = (w - size) // 2
    square = arr[sy:sy+size, sx:sx+size].copy()
    
    # Center
    cy, cx = size / 2.0, size / 2.0
    
    # Create coordinate grids
    y, x = np.ogrid[:size, :size]
    
    # Calculate relative distance from center in a perfect circle
    dist = np.sqrt(((x - cx) / cx)**2 + ((y - cy) / cy)**2)
    
    # For a perfect circular mask that completely hides the rounded rect corners:
    # Corners of the rect are typically at ~0.8 to 0.9 relative radius.
    # We set core to 0.85, and outer to 0.95.
    core_radius = 0.80
    outer_radius = 0.95
    
    multiplier = np.clip((outer_radius - dist) / (outer_radius - core_radius), 0.0, 1.0)
    multiplier = multiplier * multiplier * (3 - 2 * multiplier) # smoothstep
    
    square[:, :, 3] *= multiplier
    
    res = Image.fromarray(square.astype(np.uint8))
    
    # Resize to 512
    res = res.resize((512, 512), Image.LANCZOS)
    res.save(dst_path, "PNG")

def main():
    for k, v in FILES_TO_PROCESS.items():
        src = os.path.join(SRC, k)
        dst = os.path.join(DST, v)
        if os.path.exists(src):
            process_image(src, dst)

if __name__ == "__main__":
    main()
