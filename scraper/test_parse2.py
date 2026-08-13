"""Test script to parse hukumonline klinik page - find article structure."""
from curl_cffi import requests
from bs4 import BeautifulSoup
import json

BASE_URL = 'https://www.hukumonline.com/klinik/arsip'
session = requests.Session(impersonate='chrome124')
html = session.get(f'{BASE_URL}/page/1/', timeout=30).text

soup = BeautifulSoup(html, 'html.parser')

# Look for script tags with JSON data (Next.js typically stores SSR data in scripts)
scripts = soup.select('script[type="application/json"]')
print(f'Found {len(scripts)} JSON script tags')
for i, script in enumerate(scripts[:5]):
    try:
        data = json.loads(script.string)
        print(f'\n--- Script {i} ---')
        print(f'Keys: {list(data.keys()) if isinstance(data, dict) else type(data)}')
        if isinstance(data, dict):
            for k, v in list(data.items())[:3]:
                print(f'  {k}: {str(v)[:200]}')
    except:
        print(f'\n--- Script {i} ---')
        print(f'Content: {script.string[:200] if script.string else "None"}')

# Also check for __NEXT_DATA__
next_data = soup.select_one('#__NEXT_DATA__')
if next_data:
    print(f'\nFound __NEXT_DATA__')
    try:
        data = json.loads(next_data.string)
        print(f'Props keys: {list(data.get("props", {}).get("pageProps", {}).keys()) if data.get("props") else "No props"}')
    except Exception as e:
        print(f'Error parsing: {e}')
        print(f'Content: {next_data.string[:500] if next_data.string else "None"}')

# Look for any div with class containing article or post
divs = soup.select('div[class*="article"], div[class*="post"], div[class*="card"]')
print(f'\nFound {len(divs)} divs with article/post/card classes')
for div in divs[:5]:
    print(f'  class={div.get("class")} - text={div.get_text(strip=True)[:50]}')
