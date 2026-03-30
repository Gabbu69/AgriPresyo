import re

def remove_redundant_crops(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    redundants = [
        "'talong'", "'chayote-new'", "'batong'", "'okra-new'", 
        "'pechay-new'", "'pechay-chinese'", "'bombay'", "'ahos'", 
        "'kamatis-new'", "'luya'", "'lemonsito'", "'pinya'", 
        "'mangga-new'", "'pomelo-new'", "'watermelon-new'", "'saging-tundan'"
    ]
    
    # We will look for   { id: 'talong', ... },
    # The regex approach: find { block } where id is in reduandants.
    # A block starts with "  {" and ends with "  }," or "  }" if last.
    
    # Split content by "  {"
    parts = content.split('\n  {\n')
    
    new_parts = [parts[0]]
    for part in parts[1:]:
        # check if it starts with id: '...' in redundants
        match = re.search(r'^\s*id:\s*([^,]+),', part)
        if match:
            crop_id = match.group(1).strip()
            if crop_id in redundants:
                continue # Skip this block!
        new_parts.append(part)
        
    final_content = '\n  {\n'.join(new_parts)
    
    # Clean up trailing comma on the very last item in MOCK_CROPS if we removed the last one.
    # In typescript: saging-tundan was the very last one. So the one before it now has "    ]\n  }\n];"
    # Actually wait, the last item ends with "  }\n];", not "  },\n".
    # Let's just fix any trailing comma before "];"
    final_content = re.sub(r',\s*\];', '\n];', final_content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final_content)

remove_redundant_crops(r"C:\Users\gabri\.gemini\antigravity\scratch\AgriPresyo\constants.tsx")
print("Removed redundant crops safely!")
