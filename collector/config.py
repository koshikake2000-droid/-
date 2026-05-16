import os
from pathlib import Path

BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
LOG_DIR = BASE_DIR / "logs"

REGIONS = {
    "hokkaido-tohoku": "北海道・東北",
    "kanto": "関東",
    "chubu-hokuriku": "中部・北陸",
    "kinki": "近畿",
    "chugoku-shikoku": "中国・四国",
    "kyushu-okinawa": "九州・沖縄",
}

CATEGORIES = ["観光地・名所", "飲食店・カフェ", "ショッピング", "アクティビティ", "穴場"]

SCRAPE_TARGETS = {
    "hokkaido-tohoku": [
        "https://www.jalan.net/kankou/prf1/",
        "https://www.jalan.net/kankou/prf2/",
    ],
    "kanto": [
        "https://www.jalan.net/kankou/prf13/",
        "https://www.jalan.net/kankou/prf14/",
    ],
}

REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; WeeklySpotBot/1.0; +https://example.com/bot)",
}
REQUEST_TIMEOUT = 10
RATE_LIMIT_SECONDS = 2.0
