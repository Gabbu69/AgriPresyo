import io
import os
from PIL import Image
from rembg import remove, new_session

src = r"D:\Users\gabri\Downloads\AgriPresyo_Frut&Veg\Rambutan.png"
dst = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops\test_sam.png"

def test():
    if not os.path.exists(src):
        print(f"File not found: {src}")
        return
        
    img = Image.open(src)
    session = new_session("sam")
    
    buf = io.BytesIO()
    img.save(buf, "PNG")
    
    print("Running SAM...")
    res_data = remove(buf.getvalue(), session=session)
    
    res = Image.open(io.BytesIO(res_data))
    
    # Save with a white background for clear visibility in testing
    final = Image.new("RGBA", res.size, (255, 255, 255, 255))
    final.paste(res, mask=res)
    final.save(dst)
    print(f"Saved to {dst}")

if __name__ == "__main__":
    test()
