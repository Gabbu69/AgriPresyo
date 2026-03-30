import cv2
import numpy as np
import io
from PIL import Image
from rembg import remove, new_session

img_path = r"C:\Users\gabri\.gemini\antigravity\brain\e8b46d05-a46d-4f2b-904c-e54547a95dfc\media__1774760134560.jpg"
tgt_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\poncan_final.png"

img = cv2.imread(img_path)

# Same aggressive crop for the poncan, as it was also in a green box with grid
h, w = img.shape[:2]

crop_y1 = int(h * 0.30)
crop_y2 = int(h * 0.70)
crop_x1 = int(w * 0.30)
crop_x2 = int(w * 0.70)

cropped_img = img[crop_y1:crop_y2, crop_x1:crop_x2]

session = new_session("isnet-general-use")

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
print("Cleanly extracted poncan using rembg on center crop!")
