import os
import cv2
import numpy as np
from PIL import Image

CROPS_DIR = r"c:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
UPO_SRC = r"c:\Users\gabri\.gemini\antigravity\brain\38e74002-8293-4e72-b777-ad5cb76bf9b3\media__1774782529739.jpg"

def fix_upo_careful():
    print(f"Loading {UPO_SRC}")
    img = cv2.imread(UPO_SRC)
    if img is None:
        print("Could not read image")
        return
        
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # We want to broadly capture the Upo AND its stem!
    # The stem is probably brownish/dark green. Let's include darker values!
    # Hue 15 to 95, Saturation 20 to 255, Value 40 to 255.
    lower_upo = np.array([15, 20, 30])
    upper_upo = np.array([95, 255, 255])
    
    mask = cv2.inRange(hsv, lower_upo, upper_upo)
    
    # DO NOT use MORPH_OPEN because it destroys the stem.
    # Instead, we just find the largest contour and draw it.
    # There may be noise outside, but the largest continuous blob is the Upo + stem!
    
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("Could not find any contour!")
        return
        
    largest_contour = max(contours, key=cv2.contourArea)
    
    final_mask = np.zeros_like(mask)
    cv2.drawContours(final_mask, [largest_contour], -1, 255, thickness=cv2.FILLED)
    
    # Let's cleanly apply GrabCut using this exact mask to refine the edges!
    # We mark the mask as PR_FGD, outside as BGD.
    h, w = img.shape[:2]
    gc_mask = np.where(final_mask == 255, cv2.GC_PR_FGD, cv2.GC_BGD).astype('uint8')
    
    # We can mark the very center of the largest contour as SURE foreground to help GrabCut!
    M = cv2.moments(largest_contour)
    if M["m00"] != 0:
        cX = int(M["m10"] / M["m00"])
        cY = int(M["m01"] / M["m00"])
        cv2.circle(gc_mask, (cX, cY), 20, cv2.GC_FGD, -1)
        
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    cv2.grabCut(img, gc_mask, None, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_MASK)
    
    out_mask = np.where((gc_mask==2)|(gc_mask==0), 0, 1).astype('uint8')
    
    # Soften the edges of the mask
    final_alpha = out_mask * 255
    final_alpha = cv2.GaussianBlur(final_alpha, (3,3), 0)
    
    b, g, r = cv2.split(img)
    rgba = cv2.merge([r, g, b, final_alpha])
    
    out = Image.fromarray(rgba)
    
    # Now we automatically straighten it! (Merging straightener logic)
    arr = np.array(out)
    alpha = arr[:, :, 3]
    y, x = np.nonzero(alpha > 10)
    
    if len(x) > 0:
        pts = np.vstack((x, y)).T
        rect = cv2.minAreaRect(pts.astype(np.float32))
        (cx, cy), (box_w, box_h), angle = rect
        
        if box_w < box_h:
            straight_angle = angle
        else:
            straight_angle = angle - 90
            
        out = out.rotate(straight_angle, resample=Image.Resampling.BICUBIC, expand=True)
        
        alpha2 = np.array(out)[:, :, 3]
        y2, x2 = np.nonzero(alpha2 > 10)
        if len(x2) > 0:
            width = x2.max() - x2.min()
            height = y2.max() - y2.min()
            if width > height:
                out = out.rotate(90, resample=Image.Resampling.BICUBIC, expand=True)
                
    # Crop perfectly
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
        
    # Make it BIG
    w_out, h_out = out.size
    scale = 510 / max(w_out, h_out)
    new_w, new_h = int(w_out * scale), int(h_out * scale)
    out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas.paste(out, (offset_x, offset_y), out)
    
    dst = os.path.join(CROPS_DIR, "upo.png")
    canvas.save(dst, "PNG")
    print("Perfect UPO generated with tip saved, straight, and large!")

if __name__ == "__main__":
    fix_upo_careful()
