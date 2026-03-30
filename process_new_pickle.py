import io
from PIL import Image
from rembg import remove, new_session
import cv2
import numpy as np

img_path = r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760390047.png"
tgt_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\pickle_final.png"

# Load image
img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
h, w = img.shape[:2]

# The image is a square with a translucent/empty outer region and a green rounded box in the center.
# Crop deeply into the green box to guarantee the borders and transparent parts are gone,
# leaving ONLY dark green background and the pickle in the very center.

crop_margin_y = int(h * 0.20)
crop_margin_x = int(w * 0.25)
cropped = img[crop_margin_y:h-crop_margin_y, crop_margin_x:w-crop_margin_x]

# OpenCV image to PIL
cropped_pil = Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGRA2RGBA))

session = new_session("isnet-general-use")

img_byte_arr = io.BytesIO()
cropped_pil.save(img_byte_arr, format='PNG')
out_data = remove(img_byte_arr.getvalue(), session=session, post_process_mask=True)

out_img = Image.open(io.BytesIO(out_data)).convert("RGBA")

# Crop out the transparent space left over from rembg
alpha = out_img.split()[-1]
bbox = alpha.getbbox()
if bbox:
    out_img = out_img.crop(bbox)

# Add 18% padding to match all other crops
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
print("Processed perfectly using new image crop strategy!")
