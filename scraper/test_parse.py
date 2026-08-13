"""Test script to parse hukumonline klinik page."""
from curl_cffi import requests
from bs4 import BeautifulSoup
import json

BASE_URL = 'https://www.hukumonline.com/klinik/arsip'
session = requests.Session(impersonate='chrome124')
html = session.get(f'{BASE_URL}/page/1/', timeout=30).text

soup = BeautifulSoup(html, 'html.parser')

# Find all links with /klinik/ in href
links = soup.select('a[href*="klinik"]')
print(f'Found {len(links)} links with klinik')
for link in links[:10]:
    href = link.get('href', '')
    title = link.get_text(strip=True)
    print(f'  {href} - {title[:50]}')

# Also try to find article items
articles = soup.select('article')
print(f'\nFound {len(articles)} article tags')

# Save full HTML for inspection
with open(r'C:\Users\MSI Modern\Downloads\yuradvise\scraper\raw_html\_page_1_test.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('\nSaved full HTML to _page_1_test.html')
