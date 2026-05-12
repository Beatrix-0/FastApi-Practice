import os, re

exports = open('node_modules/lucide-react/dist/lucide-react.d.ts').read()
exported_icons = set(re.findall(r'export declare const ([a-zA-Z0-9_]+):', exports))
exported_icons.update(re.findall(r'([a-zA-Z0-9_]+) as [a-zA-Z0-9_]+', exports))

bad_icons = set()
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.js')):
            path = os.path.join(root, file)
            content = open(path).read()
            match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', content)
            if match:
                icons = [i.strip() for i in match.group(1).split(',')]
                for icon in icons:
                    if not icon: continue
                    if icon not in exported_icons and icon + 'Icon' not in exported_icons:
                        print(f'Missing {icon} in {path}')
                        bad_icons.add(icon)

if not bad_icons:
    print('All icons verified safe.')
