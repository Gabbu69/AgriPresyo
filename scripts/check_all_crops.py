import glob
import numpy as np
from PIL import Image

for file in list(glob.glob("public/crops/*.png"))[:10]:
    img = Image.open(file).convert('RGBA')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    trans_pixels = np.sum(alpha == 0)
    print(f"{file}: Size {img.size}, Transparent pixels: {trans_pixels}")
