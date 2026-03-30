import cv2
import numpy as np
import os
from PIL import Image

INPUT_PATH = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\upo.png"
OUTPUT_PATH = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\upo_processed.png"

def process_upo():
    if not os.path.exists(INPUT_PATH):
        print(f"Error: {INPUT_PATH} not found.")
        return

    # Load image
    img = cv2.imread(INPUT_PATH, cv2.IMREAD_UNCHANGED)
    if img is None:
        print("Failed to load image.")
        return
        
    print(f"Loaded image with shape: {img.shape}")

    # If it has alpha and there's a checkerboard, maybe it's just in the RGB channels.
    # Convert to BGR for processing
    if img.shape[2] == 4:
        # separate alpha
        bgr = img[:, :, :3]
        alpha = img[:, :, 3]
    else:
        bgr = img
        alpha = np.ones(bgr.shape[:2], dtype=np.uint8) * 255

    # Convert to HSV to isolate the dark green rounded square background
    # The Upo is light green. The background is dark green.
    # Let's use GrabCut to be safe and accurate.
    # We create an initial mask. The center is definite foreground.
    # The edges are definite background.
    
    h, w = bgr.shape[:2]
    mask = np.zeros((h, w), np.uint8)
    
    # Define bounding box for grabcut (x, y, w, h)
    # The upo is in the center. We'll leave a margin.
    margin_x = int(w * 0.25)
    margin_y = int(h * 0.15)
    rect = (margin_x, margin_y, w - 2 * margin_x, h - 2 * margin_y)
    
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    cv2.grabCut(bgr, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    
    mask2 = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
    
    # Smooth the mask
    kernel = np.ones((3,3), np.uint8)
    mask2 = cv2.morphologyEx(mask2, cv2.MORPH_CLOSE, kernel, iterations=2)
    
    rgba = cv2.cvtColor(bgr, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = mask2 * 255
    
    # Save temp so we can inspect
    cv2.imwrite("temp_grabcut.png", rgba)
    print("Saved temp_grabcut.png for inspection.")
    
if __name__ == "__main__":
    process_upo()
