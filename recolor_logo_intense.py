import os
from PIL import Image

def recolor_image(src_path, dest_path, target_rgb=(128, 0, 32)):
    img = Image.open(src_path).convert('RGB')
    width, height = img.size
    pixels = img.load()
    
    # 1. Find the darkest non-white pixel
    max_d = 0
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            gray = (r + g + b) // 3
            d = 255 - gray
            if d > max_d:
                max_d = d
                
    if max_d == 0:
        max_d = 1
        
    # 2. Apply recoloring with intensity scaling (multiply by 3)
    new_img = Image.new('RGB', (width, height), (255, 255, 255))
    new_pixels = new_img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            gray = (r + g + b) // 3
            d = 255 - gray
            
            # Boost the difference to make the lines more intense
            t = (d / max_d) * 3.0
            t = max(0.0, min(1.0, t))
            
            # Interpolate
            nr = int(255 - (255 - target_rgb[0]) * t)
            ng = int(255 - (255 - target_rgb[1]) * t)
            nb = int(255 - (255 - target_rgb[2]) * t)
            
            new_pixels[x, y] = (nr, ng, nb)
            
    # Save to destination
    new_img.save(dest_path)
    print(f"Recolored and boosted {src_path} -> {dest_path} successfully (Target: {target_rgb})")

if __name__ == '__main__':
    src = r'd:\tmp\antigraviti\salvadora\caso1\imagenes\logo\logo.png'
    dest = r'd:\tmp\antigraviti\salvadora\caso1\public\imagenes\logo\logo.png'
    recolor_image(src, dest)
