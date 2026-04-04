import cv2
import numpy as np
import os

def remove_background_and_crop(image_path, out_path):
    try:
        # Load image (unchanged means with alpha if exists)
        img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
        if img is None:
            return False

        # If it doesn't have an alpha channel, add one
        if img.shape[2] == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

        h, w = img.shape[:2]
        
        # We will flood fill starting from the 4 corners
        # Create a mask for floodFill
        mask = np.zeros((h + 2, w + 2), np.uint8)
        corners = [(0, 0), (0, h-1), (w-1, 0), (w-1, h-1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]
        
        # Color difference allowed (tolerance)
        lo_diff = (40, 40, 40, 40)
        up_diff = (40, 40, 40, 40)
        
        for corner in corners:
            pixel = img[corner[1], corner[0]]
            # If corner is not transparent and is fairly light
            if pixel[3] > 0 and pixel[0] > 200 and pixel[1] > 200 and pixel[2] > 200:
                cv2.floodFill(img, mask, corner, (0, 0, 0, 0), lo_diff, up_diff, flags=8)

        # Now find the bounding box of non-transparent pixels to crop
        alpha_channel = img[:, :, 3]
        coords = cv2.findNonZero(alpha_channel)
        if coords is not None:
            x, y, w_box, h_box = cv2.boundingRect(coords)
            img = img[y:y+h_box, x:x+w_box]

        # Now save the result
        cv2.imwrite(out_path, img)
        return True

    except Exception as e:
        print(f"Error on {image_path}: {e}")
        return False

crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
count = 0
for filename in os.listdir(crops_dir):
    if filename.endswith(".png") and filename not in ['watermelon.png', 'carrot.png']:
        file_path = os.path.join(crops_dir, filename)
        if remove_background_and_crop(file_path, file_path):
            count += 1

print(f"Done! Flood-filled background and cropped on {count} images.")
