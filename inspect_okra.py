from PIL import Image
import numpy as np

img = Image.open('public/crops/okra.png')
print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
arr = np.array(img)
if arr.shape[-1] == 4:
    alpha = arr[:,:,3]
    print(f"Transparent pixels: {np.sum(alpha == 0)}")
else:
    print("No alpha channel")
