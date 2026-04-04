import io
import os
import cv2
import numpy as np
from PIL import Image
from rembg import remove, new_session

# Test with Atsal (Bell Pepper) - a difficult green-on-green image
src_path = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg\Atsal.png"
dst_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\test_atsal_matting.png"

def test_alpha_matting():
    if not os.path.exists(src_path):
        print(f"Source not found: {src_path}")
        return
        
    img = Image.open(src_path).convert("RGBA")
    
    # 1. To help the AI, we can optionally flood-fill the background corners to a distinct color (white)
    # Convert simply to numpy
    arr = np.array(img)
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGBA2BGR)
    h, w = bgr.shape[:2]
    
    # FloodFill from top center to help separation
    mask = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(bgr, mask, (w//2, 10), (255, 255, 255), (20, 20, 20), (20, 20, 20), cv2.FLOODFILL_FIXED_RANGE)
    cv2.floodFill(bgr, mask, (10, h//2), (255, 255, 255), (20, 20, 20), (20, 20, 20), cv2.FLOODFILL_FIXED_RANGE)
    cv2.floodFill(bgr, mask, (w-10, h//2), (255, 255, 255), (20, 20, 20), (20, 20, 20), cv2.FLOODFILL_FIXED_RANGE)
    
    flood_img = Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    
    # Run rembg with HIGH QUALITY settings + Alpha Matting
    session = new_session("isnet-general-use")
    
    buf = io.BytesIO()
    flood_img.save(buf, "PNG")
    
    print("Running rembg with alpha matting...")
    res_data = remove(
        buf.getvalue(), 
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=8
    )
    
    res = Image.open(io.BytesIO(res_data))
    
    # Optional: post-process the mask slightly to remove any remaining tiny floaters
    res_arr = np.array(res)
    alpha = res_arr[:, :, 3]
    # Keep only largest connected component in alpha channel
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(alpha, connectivity=8)
    if num_labels > 1:
        largest_label = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        alpha[labels != largest_label] = 0
    res_arr[:, :, 3] = alpha
    
    Image.fromarray(res_arr).save(dst_path)
    print(f"Saved optimized matted image: {dst_path}")
    
if __name__ == "__main__":
    test_alpha_matting()
