
import os
import sys

def rename_files():
    with open('files_to_rename.txt', 'r') as f:
        lines = [line.strip() for line in f.readlines()]

    # Already sorted by length descending, so we process children before parents
    for filepath in lines:
        if not os.path.exists(filepath):
            print(f"Skipping {filepath}, not found")
            continue

        dirname, basename = os.path.split(filepath)
        
        # Replace 'setor' with 'sector' (lowercase)
        new_basename = basename.replace('setor', 'sector')
        # Replace 'Setor' with 'Sector' (title case)
        new_basename = new_basename.replace('Setor', 'Sector')
        # Replace 'SETOR' with 'SECTOR' (upper case - unlikely but good practice)
        new_basename = new_basename.replace('SETOR', 'SECTOR')

        if new_basename != basename:
            new_path = os.path.join(dirname, new_basename)
            print(f"Renaming: {filepath} -> {new_path}")
            try:
                os.rename(filepath, new_path)
            except OSError as e:
                print(f"Error renaming {filepath}: {e}")

if __name__ == "__main__":
    rename_files()
