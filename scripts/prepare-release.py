#!/usr/bin/env python3
"""Synchronize release identifiers. Run from any directory with a new semver."""
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if len(sys.argv) != 2 or not re.fullmatch(r'\d+\.\d+\.\d+', sys.argv[1]):
    raise SystemExit('Usage: python3 scripts/prepare-release.py <major.minor.patch>')
version = sys.argv[1]
build_path = ROOT / 'build.json'
build = json.loads(build_path.read_text())
if build['version'] == version:
    raise SystemExit('Version must differ from the current release')
# Validate every input and compute all changes before writing any files.
changes = {}
for html in ROOT.glob('*.html'):
    content = html.read_text()
    content, count = re.subn(r'data-build="[^"]+"', f'data-build="{version}"', content, count=1)
    if count != 1:
        raise SystemExit(f'Missing data-build in {html.name}')
    content = re.sub(r'(assets-(?:css|js)-[^\s"\']+\.(?:css|js)\?v=)[\w.-]+', lambda m: m.group(1) + version, content)
    content = re.sub(r'((?:src|href|poster)="(?:/Onyx_Meridian_project/)?assets-img-[^"?]+\?v=)[\w.-]+', lambda m: m.group(1) + version, content)
    changes[html] = content
for name in ('assets-css-style.css', 'assets-css-legacy.css', 'manifest.json'):
    asset = ROOT / name
    changes[asset] = re.sub(r'(assets-(?:fonts|img)-[^\s"\'()]+\?v=)[\w.-]+', lambda m: m.group(1) + version, asset.read_text())
sw = ROOT / 'sw.js'
s, count = re.subn(r"const CACHE = 'om-site-v[^']+';", f"const CACHE = 'om-site-v{version}';", sw.read_text(), count=1)
if count != 1:
    raise SystemExit('Missing cache name in sw.js')
changes[sw] = re.sub(r'(assets-(?:css|js)-[^\s"\']+\.(?:css|js)\?v=)[\w.-]+', lambda m: m.group(1) + version, s)
build.update(version=version, built=date.today().isoformat(), date=date.today().isoformat())
changes[build_path] = json.dumps(build, indent=2, ensure_ascii=False) + '\n'
for path, content in changes.items():
    path.write_text(content)
print('Prepared', version, '— review changes, then run the tests before publishing.')
