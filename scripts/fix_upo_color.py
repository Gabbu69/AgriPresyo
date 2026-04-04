import cv2
import numpy as np
from PIL import Image
import os
import glob
from rembg import remove, new_session

CROPS_DIR = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"

def get_newest_upload():
    uploads_dir = os.path.join(CROPS_DIR, "new_uploads")
    if not os.path.exists(uploads_dir): return None
    files = glob.glob(os.path.join(uploads_dir, "media__*.png"))
    if not files: return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

def fix_smart():
    path = get_newest_upload()
    if not path:
        print("No image")
        return
        
    print(f"Loading {path}")
    img_pil = Image.open(path).convert("RGBA")
    
    # The image is an icon with a solid dark-green rounded square on a transparent background
    # Let's crop it tightly to the transparent background so the green touches the edges!
    bbox = img_pil.split()[-1].getbbox()
    if bbox:
        img_pil = img_pil.crop(bbox)
        
    # Now that the dark green is on the edges (or very close),
    # let's make a new image where the transparent parts are filled with the dark green color!
    # Pick a pixel near the edge that is not transparent, to get the background color.
    # Actually, we can just use rembg directly on this cropped image.
    img_np = np.array(img_pil)
    
    # We skip rembg and just do value thresholding!
    
    # Try Grabcut if this fails? No, let's just do value thresholding!
    # The Upo is light, the background is dark green.
    img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGBA2BGR)
    img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    
    # Find all pixels that are dark green
    # Dark green: H ~ 30-90, S ~ 20-255, V ~ 0-100
    # Light Upo: H ~ 20-80, S ~ 20-255, V ~ 120-255
    # Since background is distinctly dark, let's threshold on V > 100!
    _, val_mask = cv2.threshold(img_hsv[:,:,2], 80, 255, cv2.THRESH_BINARY)
    
    kernel = np.ones((5,5), np.uint8)
    val_mask = cv2.morphologyEx(val_mask, cv2.MORPH_OPEN, kernel, iterations=1)
    val_mask = cv2.morphologyEx(val_mask, cv2.MORPH_CLOSE, kernel, iterations=3)
    
    # Keep only the largest contour
    contours, _ = cv2.findContours(val_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        clean_mask = np.zeros_like(val_mask)
        cv2.drawContours(clean_mask, [largest_contour], -1, 255, -1)
        
        # Apply mask to original
        alpha_channel = clean_mask
        alpha_channel = cv2.GaussianBlur(alpha_channel, (5, 5), 0)
        
        b, g, r, a_orig = cv2.split(img_np)
        
        # Combine masks
        final_alpha = cv2.bitwise_and(alpha_channel, a_orig)
        
        final_rgba = cv2.merge([b, g, r, final_alpha])
        out = Image.fromarray(final_rgba)
        
        bbox = out.split()[-1].getbbox()
        if bbox:
            out = out.crop(bbox)
            
        out = out.rotate(-15, resample=Image.Resampling.BICUBIC, expand=True)
        bbox = out.split()[-1].getbbox()
        if bbox:
            out = out.crop(bbox)
        
        out = out.transpose(Image.FLIP_LEFT_RIGHT)
        
        w_out, h_out = out.size
        scale = 480 / max(w_out, h_out)
        new_w, new_h = int(w_out * scale), int(h_out * scale)
        out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        offset_x = (512 - new_w) // 2
        offset_y = (512 - new_h) // 2
        canvas.paste(out, (offset_x, offset_y), out)
        
        out.save(os.path.join(CROPS_DIR, "upo_thresh.png"))
        canvas.save(os.path.join(CROPS_DIR, "upo.png"))
        print("Done thresholding Upo!")
    else:
        print("Failed to find upo")

if __name__ == "__main__":
    fix_smart()
