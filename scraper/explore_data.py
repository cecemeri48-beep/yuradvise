"""Explore hukumonline data structure."""
from curl_cffi import requests
from bs4 import BeautifulSoup
import json

session = requests.Session(impersonate='chrome124')
html = session.get('https://www.hukumonline.com/klinik/arsip/page/1/', timeout=30).text

soup = BeautifulSoup(html, 'html.parser')
nd = soup.select_one('#__NEXT_DATA__')
d = json.loads(nd.string)

queries = d['props']['pageProps']['dehydratedState']['queries']
print(f'Queries: {len(queries)}')

for q in queries:
    state = q.get('state', {})
    data = state.get('data', {})
    print(f'\nQuery keys: {list(data.keys())}')
    
    if isinstance(data, dict) and 'data' in data:
        items = data['data']
        print(f'Items type: {type(items)}')
        
        if isinstance(items, list):
            print(f'Articles count: {len(items)}')
            for i, art in enumerate(items[:2]):
                print(f'\n--- Article {i+1} ---')
                print(json.dumps(art, ensure_ascii=False, indent=2)[:1500])
        elif isinstance(items, dict):
            print(f'Items keys: {list(items.keys())[:10]}')
            for k, v in list(items.items())[:3]:
                print(f'  {k}: {type(v)} = {str(v)[:100]}')
