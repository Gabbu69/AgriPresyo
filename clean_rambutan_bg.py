"""Remove the dark green rounded-rect card background from the rambutan image."""

from PIL import Image
import numpy as np

def clean_card_bg(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    arr = np.array(img, dtype=np.float32)
    
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    brightness = (r + g + b) / 3
    
    # Dark green card background detection
    is_dark_green = (
        (brightness < 100) &
        (g > r * 0.7) &
        (g > b) &
        (r < 120) &
        (b < 100) &
        (a > 200)
    )
    
    new_alpha = a.copy()
    new_alpha[is_dark_green] = 0
    arr[:,:,3] = new_alpha
    
    result = Image.fromarray(arr.astype(np.uint8))
    
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
    
    max_dim = max(result.size)
    pad = int(max_dim * 0.1)
    canvas_size = max_dim + pad * 2
    canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    offset_x = (canvas_size - result.size[0]) // 2
    offset_y = (canvas_size - result.size[1]) // 2
    canvas.paste(result, (offset_x, offset_y))
    
    canvas = canvas.resize((512, 512), Image.LANCZOS)
    canvas.save(output_path, 'PNG')
    print(f"Saved cleaned image to {output_path}")

if __name__ == '__main__':
    clean_card_bg(
        r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\rambutan.png",
        r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\rambutan_cleaned.png"
    )
