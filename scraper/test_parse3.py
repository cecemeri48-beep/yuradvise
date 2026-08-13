"""Parse hukumonline klinik page using Next.js data."""
from curl_cffi import requests
from bs4 import BeautifulSoup
import json

BASE_URL = 'https://www.hukumonline.com/klinik/arsip'
session = requests.Session(impersonate='chrome124')
html = session.get(f'{BASE_URL}/page/1/', timeout=30).text

soup = BeautifulSoup(html, 'html.parser')

# Get __NEXT_DATA__
next_data = soup.select_one('#__NEXT_DATA__')
if next_data and next_data.string:
    data = json.loads(next_data.string)
    queries = data.get('props', {}).get('pageProps', {}).get('dehydratedState', {}).get('queries', [])
    
    print(f'Found {len(queries)} queries')
    
    for q in queries:
        state = q.get('state', {})
        query_data = state.get('data', {})
        
        if isinstance(query_data, dict) and 'data' in query_data:
            articles = query_data['data']
            print(f'\nFound {len(articles)} articles in query')
            
            for i, art in enumerate(articles[:5]):
                print(f'\n--- Article {i+1} ---')
                for k, v in art.items():
                    if k == 'author':
                        print(f'  Author: {v.get("name", "")}')
                    elif k == 'category':
                        print(f'  Category: {v.get("name", "")}')
                    elif k == 'title':
                        print(f'  Title: {v}')
                    elif k == 'slug':
                        print(f'  Slug: {v}')
                    elif k == 'excerpt':
                        print(f'  Excerpt: {v[:100]}...' if len(v) > 100 else f'  Excerpt: {v}')
                    elif k == 'published_at':
                        print(f'  Date: {v}')
                    elif isinstance(v, str) and len(v) < 200:
                        print(f'  {k}: {v}')
                    elif isinstance(v, dict):
                        print(f'  {k}: {json.dumps(v, ensure_ascii=False)[:100]}')
