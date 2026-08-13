"""
YurAdvise — Seed Data Loader
Memasukkan 50 kasus yurisprudensi ke database PostgreSQL.
Jalankan: python -m backend.seed_loader
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Tambahkan root project ke sys.path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di .env")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


def load_seed_data() -> list[dict]:
    """Muat seed data dari JSON."""
    seed_path = Path(__file__).parent.parent / "seed_data" / "yurisprudensi_seed.json"
    with open(seed_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["jurisprudence"]


def seed_jurisprudence():
    """Inputkan semua yurisprudensi ke database."""
    cases = load_seed_data()
    db = SessionLocal()

    try:
        inserted = 0
        skipped = 0

        for case in cases:
            # Cek apakah sudah ada berdasarkan case_number
            existing = db.execute(
                text("SELECT id FROM jurisprudence WHERE case_number = :cn"),
                {"cn": case["case_number"]}
            ).fetchone()

            if existing:
                skipped += 1
                continue

            db.execute(
                text("""
                    INSERT INTO jurisprudence
                        (case_number, court, date, summary, keywords, source_url, scraped_at)
                    VALUES
                        (:case_number, :court, :date, :summary, :keywords, :source_url, :scraped_at)
                """),
                {
                    "case_number": case["case_number"],
                    "court": case["court"],
                    "date": case["date"],
                    "summary": case["summary"],
                    "keywords": json.dumps(case["keywords"]),
                    "source_url": case.get("source_url", ""),
                    "scraped_at": datetime.utcnow(),
                }
            )
            inserted += 1

        db.commit()
        print(f"✅ Seed selesai: {inserted} kasus dimasukkan, {skipped} sudah ada.")
        print(f"   Total kasus di tabel jurisprudence sekarang: {db.execute(text('SELECT COUNT(*) FROM jurisprudence')).scalar()}")

    except Exception as e:
        db.rollback()
        print(f"❌ Gagal seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_jurisprudence()
