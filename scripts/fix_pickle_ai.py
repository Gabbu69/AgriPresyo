import cv2
import numpy as np
import io
from PIL import Image
from rembg import remove, new_session

img_path = r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134938.jpg"
tgt_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle_final.png"

img = cv2.imread(img_path)

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Threshold to find the central box. 
# The outer region is black/dark, there's a dashed white line, and then a dark green box.
# Instead of guessing the box, let's just heavily crop the center.
# The user's screenshot showing the bad crop indicates the pickle is very small in the center!
# Let's crop to the central 30% of the image!
h, w = img.shape[:2]

# Pickle is vertical. 
# Center Y: 30% from top, 30% from bottom
# Center X: 35% from left, 35% from right
crop_y1 = int(h * 0.30)
crop_y2 = int(h * 0.70)
crop_x1 = int(w * 0.35)
crop_x2 = int(w * 0.65)

cropped_img = img[crop_y1:crop_y2, crop_x1:crop_x2]

# Save intermediate crop to verify it has NO grid
cv2.imwrite(r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle_debug_crop.jpg", cropped_img)

# Send to rembg
session = new_session("isnet-general-use")

# Convert to PIL
cropped_pil = Image.fromarray(cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB))
img_byte_arr = io.BytesIO()
cropped_pil.save(img_byte_arr, format='PNG')
out_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)

out_img = Image.open(io.BytesIO(out_data)).convert("RGBA")
alpha = out_img.split()[-1]
bbox = alpha.getbbox()
if bbox:
    out_img = out_img.crop(bbox)

w_out, h_out = out_img.size
max_dim = max(w_out, h_out)
padding = int(max_dim * 0.18)
target_size = max_dim + (padding * 2)

squared_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
offset_x = (target_size - w_out) // 2
offset_y = (target_size - h_out) // 2

squared_img.paste(out_img, (offset_x, offset_y), out_img)

if squared_img.width > 512:
    squared_img = squared_img.resize((512, 512), Image.Resampling.LANCZOS)

squared_img.save(tgt_path, "PNG")
print("Cleanly extracted using rembg on center crop!")
