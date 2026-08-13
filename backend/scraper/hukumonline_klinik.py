"""
YurAdvise Scraper - Hukumonline Klinik
Mengambil artikel hukum gratis dari hukumonline.com/klinik
Target: 50+ artikel untuk database berita hukum
"""

import json
import re
import time
from datetime import datetime
from pathlib import Path
from typing import list, dict, Optional
import requests
from bs4 import BeautifulSoup


class HukumonlineScraper:
    """Scraper untuk hukumonline.com/klinik (gratis)."""
    
    BASE_URL = "https://www.hukumonline.com"
    KLINIK_URL = f"{BASE_URL}/klinik"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    }
    
    def __init__(self, max_pages: int = 10, delay: float = 2.0):
        self.max_pages = max_pages
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
    
    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Ambil halaman dan parse HTML."""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.text, "html.parser")
        except Exception as e:
            print(f"  ❌ Error fetching {url}: {e}")
            return None
    
    def get_total_pages(self, soup: BeautifulSoup) -> int:
        """Hitung total halaman dari pagination."""
        pagination = soup.find("div", class_="pagination") or soup.find("nav", class_=re.compile("pagination"))
        if not pagination:
            return self.max_pages
        
        pages = pagination.find_all("a")
        max_page = 1
        for page in pages:
            href = page.get("href", "")
            match = re.search(r"page/(\d+)", href)
            if match:
                max_page = max(max_page, int(match.group(1)))
        return min(max_page, self.max_pages)
    
    def extract_articles(self, soup: BeautifulSoup) -> list[dict]:
        """Extract artikel dari halaman klinik."""
        articles = []
        
        # Cari semua container artikel
        article_containers = soup.find_all("article") or soup.find_all("div", class_=re.compile("article|item|post"))
        
        for container in article_containers:
            article = self._parse_article(container)
            if article:
                articles.append(article)
        
        return articles
    
    def _parse_article(self, container: BeautifulSoup) -> Optional[dict]:
        """Parse satu artikel."""
        try:
            # Ambil link
            link_elem = container.find("a", href=True)
            if not link_elem:
                return None
            
            href = link_elem.get("href", "")
            if not href.startswith("http"):
                href = self.BASE_URL + href
            
            # Ambil judul
            title_elem = container.find("h2") or container.find("h3") or container.find("title")
            title = title_elem.get_text(strip=True) if title_elem else ""
            
            if not title or len(title) < 10:
                return None
            
            # Ambil kategori
            category_elem = container.find(class_=re.compile("category|tag"))
            category = category_elem.get_text(strip=True) if category_elem else "umum"
            
            # Ambil tanggal
            date_elem = container.find(class_=re.compile("date|time"))
            date_str = date_elem.get_text(strip=True) if date_elem else datetime.now().strftime("%Y-%m-%d")
            
            return {
                "title": title,
                "url": href,
                "category": category,
                "date": date_str,
                "source": "hukumonline_klinik",
            }
        except Exception as e:
            return None
    
    def fetch_article_content(self, url: str) -> Optional[dict]:
        """Ambil konten lengkap artikel."""
        soup = self.fetch_page(url)
        if not soup:
            return None
        
        # Ambil judul
        title = soup.find("h1") or soup.find("title")
        title_text = title.get_text(strip=True) if title else ""
        
        # Ambil konten utama
        content_elem = soup.find("div", class_=re.compile("content|article-content|entry-content"))
        if not content_elem:
            content_elem = soup.find("article") or soup.find("main")
        
        content = content_elem.get_text(strip=True) if content_elem else ""
        
        # Ambil author
        author_elem = soup.find(class_=re.compile("author|writer"))
        author = author_elem.get_text(strip=True) if author_elem else "Si Pokrol"
        
        return {
            "title": title_text,
            "content": content[:5000],  # Batasi 5000 karakter
            "author": author,
            "url": url,
            "scraped_at": datetime.utcnow().isoformat(),
        }
    
    def scrape_klinik(self, category: Optional[str] = None) -> list[dict]:
        """Scrape semua halaman klinik."""
        all_articles = []
        
        # Tentukan base URL berdasarkan kategori
        if category:
            base_url = f"{self.KLINIK_URL}/{category}/"
        else:
            base_url = f"{self.KLINIK_URL}/arsip/"
        
        print(f"📰 Scraping: {base_url}")
        
        for page_num in range(1, self.max_pages + 1):
            if page_num == 1:
                url = base_url
            else:
                url = f"{base_url}page/{page_num}/"
            
            print(f"  📄 Halaman {page_num}...")
            soup = self.fetch_page(url)
            
            if not soup:
                continue
            
            articles = self.extract_articles(soup)
            all_articles.extend(articles)
            print(f"     → Ditemukan {len(articles)} artikel")
            
            time.sleep(self.delay)
        
        print(f"\n✅ Total artikel ditemukan: {len(all_articles)}")
        return all_articles
    
    def scrape_full_content(self, articles: list[dict], max_articles: int = 30) -> list[dict]:
        """Ambil konten lengkap dari beberapa artikel."""
        results = []
        
        for i, article in enumerate(articles[:max_articles]):
            print(f"  📖 Mengambil konten: {article['title'][:50]}...")
            content = self.fetch_article_content(article["url"])
            
            if content:
                results.append(content)
            
            time.sleep(self.delay)
        
        return results
    
    def save_results(self, articles: list[dict], path: Path):
        """Simpan hasil scraping ke JSON."""
        path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(path, "w", encoding="utf-8") as f:
            json.dump({
                "scraped_at": datetime.utcnow().isoformat(),
                "total_articles": len(articles),
                "articles": articles,
            }, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Disimpan ke: {path}")


def main():
    """Entry point untuk scraper."""
    output_dir = Path(__file__).parent.parent / "data" / "scraper"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    scraper = HukumonlineScraper(max_pages=10, delay=1.5)
    
    # 1. Scrape semua artikel
    all_articles = scraper.scrape_klinik()
    
    # 2. Simpan daftar artikel
    list_path = output_dir / "articles_list.json"
    scraper.save_results(all_articles, list_path)
    
    # 3. Ambil konten lengkap (opsional, ambil 20 artikel pertama)
    print("\n📥 Mengambil konten lengkap...")
    full_contents = scraper.scrape_full_content(all_articles, max_articles=20)
    
    content_path = output_dir / "articles_content.json"
    scraper.save_results(full_contents, content_path)
    
    print("\n✅ Scraping selesai!")
    print(f"   Daftar artikel: {list_path}")
    print(f"   Konten lengkap: {content_path}")


if __name__ == "__main__":
    main()
