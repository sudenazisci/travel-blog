import os
import re

src = r'C:\Users\suden\.gemini\antigravity-ide\scratch\travel-blog\frontend\src'

for root, dirs, files in os.walk(src):
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for fname in files:
        if not (fname.endswith('.jsx') or fname.endswith('.js')):
            continue
        if fname == 'api.js':
            continue

        path = os.path.join(root, fname)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Fix: `${API_BASE}/api/...' -> `${API_BASE}/api/...`
        # Template literal opened with backtick but closed with single quote
        # Pattern: backtick + ${API_BASE} + path + single-quote
        content = re.sub(
            r"`(\$\{API_BASE\}[^'`]*)'",
            r"`\1`",
            content
        )

        if content != original:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed closing quote: {fname}')

print('Done!')
