import cv2
import numpy as np
from PIL import Image

def process_okra():
    img_path = 'public/crops/okra.png'
    img = Image.open(img_path).convert('RGBA')
    arr = np.array(img)
    
    alpha = arr[:,:,3]
    h, w = alpha.shape
    
    _, labels, stats, centroids = cv2.connectedComponentsWithStats((alpha > 50).astype(np.uint8))
    
    # background is label 0.
    center_idx = -1
    min_dist = 999999
    
    for i in range(1, len(stats)):
        cx, cy = centroids[i]
        dist = (cx - w/2)**2 + (cy - h/2)**2
        if dist < min_dist and stats[i, cv2.CC_STAT_AREA] > 500:
            min_dist = dist
            center_idx = i
            
    if center_idx == -1:
        print("Failed to find middle okra")
        return
        
    # keep only that label
    mask = (labels == center_idx).astype(np.uint8) * 255
    
    # Apply mask
    arr[:,:,3] = np.minimum(arr[:,:,3], mask)
    
    new_img = Image.fromarray(arr)
    
    # Get bounding box of this new mask to crop tightly
    bbox = new_img.getbbox()
    if bbox:
        new_img = new_img.crop(bbox)
        
    # Add 18% padding and make square
    nw, nh = new_img.size
    max_dim = max(nw, nh)
    padding = int(max_dim * 0.18)
    target_size = max_dim + (padding * 2)
    
    squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    offset_x = (target_size - nw) // 2
    offset_y = (target_size - nh) // 2
    
    squared_img.paste(new_img, (offset_x, offset_y), new_img)
    
    # Save original size too, standard is 512x512 if possible, padding makes it square.
    # We can just save it. Wait, the premium format scripts use arbitrary target size, then they are used dynamically. Let's just resize to 512x512 to be safe.
    squared_img = squared_img.resize((512, 512), Image.Resampling.LANCZOS)
    squared_img.save("public/crops/okra.png", "PNG")
    print("Okra successfully cropped to central single okra!")

if __name__ == '__main__':
    process_okra()
