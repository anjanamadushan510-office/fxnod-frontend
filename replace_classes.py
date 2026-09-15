import os
import re

directories_to_scan = [
    r"E:\ajantha\fxnod-frontend\src\app\(dashboard)",
    r"E:\ajantha\fxnod-frontend\src\components\layout",
    r"E:\ajantha\fxnod-frontend\src\components\home",
    r"E:\ajantha\fxnod-frontend\src\app\home",
    r"E:\ajantha\fxnod-frontend\src\app\wallet",
    r"E:\ajantha\fxnod-frontend\src\app\tools",
]

replacements = {
    # Backgrounds
    r"bg-\[\#080C16\]": "bg-bg",
    r"bg-\[\#101827\]": "bg-surface",
    r"bg-\[\#0d1322\]": "bg-surface",
    r"bg-\[\#1A263D\]": "bg-surface-2",
    
    # Borders
    r"border-\[\#24344F\]": "border-line",
    r"border-\[\#3A5075\]": "border-line-2",
    
    # Text
    r"text-white": "text-ink",
    r"text-black": "text-surface",
    r"text-zinc-500": "text-ink-3",
    r"text-zinc-400": "text-ink-2",
    r"text-zinc-300": "text-ink-2",
    r"text-zinc-600": "text-ink-3",
    r"bg-white\s+text-black": "bg-ink text-surface",
    
    # Hover States
    r"hover:bg-white/\[0\.02\]": "hover:bg-surface-2",
    r"hover:bg-white/\[0\.06\]": "hover:bg-surface-2",
    r"hover:bg-white/5": "hover:bg-surface-2",
    r"hover:bg-white/10": "hover:bg-surface-2",
    r"hover:text-white": "hover:text-ink",
    
    # Background transparencies
    r"bg-white/\[0\.06\]": "bg-surface-2",
    r"bg-white/5": "bg-surface-2",
    r"bg-zinc-800/20": "bg-surface-2",
    r"bg-zinc-800": "bg-surface-2",
    r"hover:bg-zinc-800": "hover:bg-surface-2",
    r"hover:bg-zinc-200": "hover:opacity-80 transition-opacity",
    r"border-zinc-500": "border-ink-2",
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

for d in directories_to_scan:
    if not os.path.exists(d):
        continue
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

print("Done replacing hardcoded classes.")
