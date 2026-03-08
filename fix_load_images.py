
import re
import os

file_path = r'c:\Projects\chessTwo\chess2\src\loadImages.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'window.imagesLoaded =' in content:
    print("Already added")
else:
    # Find all image variable names
    # Pattern: const variableName = new Image();
    matches = re.findall(r'const\s+(\w+)\s*=\s*new\s+Image\(\);', content)

    if matches:
        # Create the array string
        images_array_str = "const allGameImages = [" + ", ".join(matches) + "];"
        
        # Logic to create the promise
        promise_logic = """
window.imagesLoaded = Promise.all(allGameImages.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve; // Resolve on error too so we don't hang
    });
}));
"""
        
        # Append to content
        new_content = content + "\n\n" + images_array_str + "\n" + promise_logic
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"Added tracking for {len(matches)} images.")
    else:
        print("No images found.")
