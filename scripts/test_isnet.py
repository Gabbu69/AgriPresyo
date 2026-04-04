import io
from PIL import Image
from rembg import remove, new_session
import numpy as np

src_path = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg\Atsal.png"
dst_path = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\bell-pepper-test-isnet.png"

def test():
    img = Image.open(src_path).convert("RGBA")
    
    # Crop exactly to the opaque region
    arr = np.array(img)
    alpha = arr[:, :, 3]
    active = alpha > 10
    rows = np.any(active, axis=1)
    cols = np.any(active, axis=0)
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    cropped = img.crop((cmin, rmin, cmax, rmax))
    
    buf = io.BytesIO()
    cropped.save(buf, "PNG")
    
    # Test with isnet-general-use
    session = new_session("isnet-general-use")
    res_data = remove(buf.getvalue(), session=session)
    
    res = Image.open(io.BytesIO(res_data))
    
    # Make a red background version to clearly see the mask! If it has dark green fringe, it'll show.
    w, h = res.size
    final = Image.new("RGB", (w, h), (255, 0, 0)) # bright red
    final.paste(res, mask=res.split()[3])
    
    final.save(dst_path, "PNG")

if __name__ == "__main__":
    test()
