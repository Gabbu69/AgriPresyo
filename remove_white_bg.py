"""Remove white backgrounds from crop images to make them transparent.
These images have clean white backgrounds that need to be made transparent
to blend with the dark theme of the application."""

from PIL import Image
import numpy as np

def remove_white_bg(input_path, output_path, threshold=240, edge_feather=3):
    """Remove near-white background from an image and make it transparent."""
    img = Image.open(input_path).convert('RGBA')
    arr = np.array(img, dtype=np.float32)
    
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    
    # Detect white/near-white pixels
    is_white = (r > threshold) & (g > threshold) & (b > threshold)
    
    # Use flood-fill approach from corners to find background
    # This prevents removing white parts of the subject (like pechay stems)
    h, w = is_white.shape
    visited = np.zeros_like(is_white, dtype=bool)
    bg_mask = np.zeros_like(is_white, dtype=bool)
    
    # Start flood fill from all edge pixels that are white
    from collections import deque
    queue = deque()
    
    # Add all white edge pixels
    for x in range(w):
        if is_white[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_white[h-1, x]:
            queue.append((h-1, x))
            visited[h-1, x] = True
    for y in range(h):
        if is_white[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_white[y, w-1]:
            queue.append((y, w-1))
            visited[y, w-1] = True
    
    # BFS flood fill - only spread through white pixels
    while queue:
        cy, cx = queue.popleft()
        bg_mask[cy, cx] = True
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)]:
            ny, nx = cy+dy, cx+dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and is_white[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))
    
    # Also catch near-white pixels adjacent to background (light gray edges)
    from scipy import ndimage
    # Dilate the background mask slightly to catch edge pixels
    bg_dilated = ndimage.binary_dilation(bg_mask, iterations=edge_feather)
    
    # For pixels in the dilated region but not original bg, create feathered alpha
    edge_region = bg_dilated & ~bg_mask
    
    # Create new alpha channel
    new_alpha = a.copy()
    new_alpha[bg_mask] = 0  # Full transparent for background
    
    # For edge pixels, compute distance-based alpha for smooth transition
    if edge_feather > 0:
        # Simple: set edge pixels to semi-transparent based on how white they are
        brightness = (r + g + b) / 3
        edge_alpha = np.where(edge_region, 
                              np.clip((255 - brightness) * 3, 0, 255),
                              new_alpha)
        new_alpha = np.where(edge_region, edge_alpha, new_alpha)
    
    arr[:,:,3] = new_alpha
    result = Image.fromarray(arr.astype(np.uint8))
    
    # Trim transparent pixels
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
    
    # Center on transparent canvas with padding
    max_dim = max(result.size)
    pad = int(max_dim * 0.08)
    canvas_size = max_dim + pad * 2
    canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    offset_x = (canvas_size - result.size[0]) // 2
    offset_y = (canvas_size - result.size[1]) // 2
    canvas.paste(result, (offset_x, offset_y))
    
    # Resize to 512x512 for consistency
    canvas = canvas.resize((512, 512), Image.LANCZOS)
    canvas.save(output_path, 'PNG')
    print(f"Processed: {output_path}")

if __name__ == '__main__':
    crops_dir = r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\public\crops"
    
    images_to_process = [
        'okra.png',
        'pechay.png',
        'kalabasa.png',
        'apple.png',
        'grapes.png',
        'pickle.png',
    ]
    
    import os
    for img_name in images_to_process:
        input_path = os.path.join(crops_dir, img_name)
        output_path = input_path  # Overwrite
        print(f"Processing {img_name}...")
        remove_white_bg(input_path, output_path, threshold=235, edge_feather=2)
    
    print("\nAll images processed!")
