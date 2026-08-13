"""
Scraper for hukumonline.com/klinik — extracts legal Q&A articles.
Uses curl_cffi to bypass Cloudflare protection.
Parses Next.js SSR data from __NEXT_DATA__ script tag.
Outputs JSON summary + raw HTML per article.
"""

import json
import os
import re
import time
import random
from urllib.parse import urljoin

from curl_cffi import requests as cffi_requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_URL = "https://www.hukumonline.com/klinik/arsip"
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "hukumonline_klinik_articles.json")
RAW_HTML_DIR = os.path.join(os.path.dirname(__file__), "raw_html")
TOTAL_PAGES = 5
REQUEST_DELAY = (2.0, 3.0)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def sanitize_filename(title: str) -> str:
    """Turn an article title into a safe filesystem filename."""
    title = re.sub(r'[<>:"/\\|?*]', "_", title)
    title = re.sub(r"\s+", "_", title).strip("_")
    return title[:180]


def fetch_page(page_number: int, session: cffi_requests.Session) -> str | None:
    """Fetch a single Klinik archive page using curl_cffi."""
    url = f"{BASE_URL}/page/{page_number}/"
    try:
        resp = session.get(url, impersonate="chrome124", timeout=30)
        resp.raise_for_status()
        return resp.text
    except Exception as exc:
        print(f"  [WARN] Could not fetch page {page_number}: {exc}")
        return None


def extract_articles_from_next_data(html: str, page_number: int) -> list[dict]:
    """Parse Next.js __NEXT_DATA__ to extract article data."""
    soup = BeautifulSoup(html, "html.parser")
    
    # Get __NEXT_DATA__
    next_data = soup.select_one('#__NEXT_DATA__')
    if not next_data or not next_data.string:
        return []
    
    try:
        data = json.loads(next_data.string)
    except json.JSONDecodeError:
        return []
    
    # Navigate to queries
    queries = data.get('props', {}).get('pageProps', {}).get('dehydratedState', {}).get('queries', [])
    
    articles = []
    seen_slugs: set[str] = set()
    
    for q in queries:
        state = q.get('state', {})
        query_data = state.get('data', {})
        
        if not isinstance(query_data, dict):
            continue
            
        items = query_data.get('data', [])
        if not isinstance(items, list):
            continue
        
        for item in items:
            slug = item.get('slug', '')
            if not slug or slug in seen_slugs:
                continue
            seen_slugs.add(slug)
            
            # Extract author name
            author = ""
            author_obj = item.get('author', {})
            if isinstance(author_obj, dict):
                author = author_obj.get('name', '')
            
            # Extract category
            category = ""
            cat_obj = item.get('category', {})
            if isinstance(cat_obj, dict):
                category = cat_obj.get('title', '')
            
            # Extract title
            title = item.get('title', '')
            
            # Extract date
            date = item.get('published_at', '')
            
            # Extract question/excerpt (HTML content)
            question = item.get('question', '')
            # Strip HTML tags for plain text excerpt
            excerpt = re.sub(r'<[^>]+>', '', question).strip() if question else ''
            
            # Build full URL - use the key (guid) in the path
            guid = item.get('guid', '')
            full_url = f"https://www.hukumonline.com/klinik/{slug}"
            
            articles.append({
                "title": title,
                "url": full_url,
                "category": category,
                "date": date,
                "author": author,
                "excerpt": excerpt,
                "_source_page": page_number,
            })
    
    return articles


def save_raw_html(article: dict, html: str) -> None:
    """Save the raw HTML for a single article page."""
    slug = sanitize_filename(article["title"])
    path = os.path.join(RAW_HTML_DIR, f"{slug}.html")
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
    except OSError as exc:
        print(f"  [WARN] Could not save raw HTML for '{article['title']}': {exc}")


def fetch_article_page(url: str, session: cffi_requests.Session) -> str | None:
    """Fetch a single article page."""
    try:
        resp = session.get(url, impersonate="chrome124", timeout=30)
        resp.raise_for_status()
        return resp.text
    except Exception as exc:
        print(f"    [WARN] Could not fetch article page: {exc}")
        return None


def enrich_article(article: dict, html: str) -> None:
    """Try to pull richer metadata from the individual article page."""
    soup = BeautifulSoup(html, "html.parser")
    
    # Extract from __NEXT_DATA__
    next_data = soup.select_one('#__NEXT_DATA__')
    if next_data and next_data.string:
        try:
            data = json.loads(next_data.string)
            queries = data.get('props', {}).get('pageProps', {}).get('dehydratedState', {}).get('queries', [])
            
            for q in queries:
                state = q.get('state', {})
                query_data = state.get('data', {})
                
                if isinstance(query_data, dict) and 'data' in query_data:
                    items = query_data['data']
                    if isinstance(items, list) and len(items) > 0:
                        item = items[0]
                        
                        # Update fields if empty
                        if not article["author"]:
                            author_obj = item.get('author', {})
                            if isinstance(author_obj, dict):
                                article["author"] = author_obj.get('name', '')
                        
                        if not article["category"]:
                            cat_obj = item.get('category', {})
                            if isinstance(cat_obj, dict):
                                article["category"] = cat_obj.get('title', '')
                        
                        if not article["date"]:
                            article["date"] = item.get('published_at', '')
                        
                        if not article["excerpt"]:
                            question = item.get('question', '')
                            article["excerpt"] = re.sub(r'<[^>]+>', '', question).strip() if question else ''
        except:
            pass


def main() -> None:
    os.makedirs(RAW_HTML_DIR, exist_ok=True)
    
    # Create session with curl_cffi for Cloudflare bypass
    session = cffi_requests.Session(impersonate="chrome124")
    
    all_articles: list[dict] = []
    
    print(f"Scraping hukumonline.com/klinik (pages 1-{TOTAL_PAGES}) ...\n")
    
    for page in range(1, TOTAL_PAGES + 1):
        print(f"--- Page {page} ---")
        html = fetch_page(page, session)
        if html is None:
            continue
        
        # Save full page HTML for debugging
        debug_path = os.path.join(RAW_HTML_DIR, f"_page_{page}_source.html")
        with open(debug_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  Saved page source -> _page_{page}_source.html")
        
        articles = extract_articles_from_next_data(html, page)
        print(f"  Found {len(articles)} article(s)")
        
        for art in articles:
            print(f"    [>] {art['title'][:60]}")
            # Fetch individual article page for richer data
            art_html = fetch_article_page(art["url"], session)
            if art_html:
                save_raw_html(art, art_html)
                enrich_article(art, art_html)
            all_articles.append(art)
        
        # Respectful delay between pages
        if page < TOTAL_PAGES:
            delay = random.uniform(REQUEST_DELAY[0], REQUEST_DELAY[1])
            print(f"  Waiting {delay:.1f}s before next page ...\n")
            time.sleep(delay)
    
    # De-duplicate by URL across pages
    deduped: dict[str, dict] = {}
    for art in all_articles:
        deduped.setdefault(art["url"], art)
    final = list(deduped.values())
    
    print(f"\n{'='*60}")
    print(f"Total unique articles scraped: {len(final)}")
    print(f"Output JSON: {OUTPUT_JSON}")
    print(f"Raw HTML dir: {RAW_HTML_DIR}")
    
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(final, f, ensure_ascii=False, indent=2)
    
    # Print sample
    if final:
        print(f"\n-- Sample (first 5 articles) --")
        for i, art in enumerate(final[:5], 1):
            print(f"\n  [{i}] {art['title']}")
            print(f"      URL   : {art['url']}")
            print(f"      Cat   : {art['category']}")
            print(f"      Date  : {art['date']}")
            print(f"      Author: {art['author']}")
            excerpt_preview = art['excerpt'][:100] + '...' if len(art['excerpt']) > 100 else art['excerpt']
            print(f"      Excerpt: {excerpt_preview}")


if __name__ == "__main__":
    main()
