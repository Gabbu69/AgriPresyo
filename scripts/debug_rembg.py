import traceback
from PIL import Image
from rembg import remove, new_session
import sys

img = Image.open('public/crops/ampalaya.png').convert('RGB')
session = new_session('u2net')
try:
    remove(img, session=session, post_process_mask=True, alpha_matting=True)
except Exception as e:
    traceback.print_exc()
