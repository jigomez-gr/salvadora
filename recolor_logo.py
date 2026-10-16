import os
from PIL import Image

def recolor_image(img_path, target_rgb=(128, 0, 32)):
    img = Image.open(img_path).convert('RGB')
    width, height = img.size
    pixels = img.load()
    
    # 1. Find the darkest non-white pixel to normalize the intensity scale
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
        
    # 2. Apply recoloring based on the antialiased tinting algorithm
    new_img = Image.new('RGB', (width, height), (255, 255, 255))
    new_pixels = new_img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            gray = (r + g + b) // 3
            d = 255 - gray
            t = d / max_d
            
            # Clamp t to [0.0, 1.0] just in case
            t = max(0.0, min(1.0, t))
            
            # Interpolate between white (255, 255, 255) and target_rgb
            nr = int(255 - (255 - target_rgb[0]) * t)
            ng = int(255 - (255 - target_rgb[1]) * t)
            nb = int(255 - (255 - target_rgb[2]) * t)
            
            new_pixels[x, y] = (nr, ng, nb)
            
    # Save the recolored image
    new_img.save(img_path)
    print(f"Recolored {img_path} successfully to RGB{target_rgb}")

if __name__ == '__main__':
    logo_path = r'd:\tmp\antigraviti\salvadora\caso1\public\imagenes\logo\logo.png'
    recolor_image(logo_path)
