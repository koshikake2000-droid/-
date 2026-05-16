import os
import logging
from typing import Any
import requests
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)


class BaseApiClient:
    def __init__(self, base_url: str, api_key: str | None = None) -> None:
        self.base_url = base_url
        self.session = requests.Session()
        if api_key:
            self.session.headers["Authorization"] = f"Bearer {api_key}"

    def _get(self, path: str, params: dict | None = None) -> dict | None:
        try:
            resp = self.session.get(f"{self.base_url}{path}", params=params, timeout=10)
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            logger.warning("API request failed: %s", e)
            return None

    def normalize(self, raw: Any) -> dict:
        raise NotImplementedError


class GooglePlacesClient(BaseApiClient):
    def __init__(self) -> None:
        super().__init__(
            base_url="https://maps.googleapis.com/maps/api/place",
            api_key=os.getenv("GOOGLE_PLACES_API_KEY"),
        )

    def search_spots(self, region_id: str, category: str) -> list[dict]:
        # Maps region_id to a Japanese place query
        region_queries = {
            "hokkaido-tohoku": "北海道 観光",
            "kanto": "関東 観光",
            "chubu-hokuriku": "中部北陸 観光",
            "kinki": "近畿 観光",
            "chugoku-shikoku": "中国四国 観光",
            "kyushu-okinawa": "九州沖縄 観光",
        }
        query = region_queries.get(region_id, "日本 観光")
        data = self._get("/textsearch/json", params={
            "query": f"{query} {category}",
            "language": "ja",
            "key": os.getenv("GOOGLE_PLACES_API_KEY", ""),
        })
        if not data:
            return []
        return [self.normalize(r) for r in data.get("results", [])]

    def normalize(self, raw: dict) -> dict:
        return {
            "name": raw.get("name", ""),
            "category": "観光地・名所",
            "location": raw.get("formatted_address", ""),
            "description": raw.get("editorial_summary", {}).get("overview", ""),
            "reason": "",
        }


class HotpepperClient(BaseApiClient):
    def __init__(self) -> None:
        super().__init__(
            base_url="https://webservice.recruit.co.jp/hotpepper/gourmet/v1",
            api_key=os.getenv("HOTPEPPER_API_KEY"),
        )

    def search_spots(self, region_id: str, category: str) -> list[dict]:
        data = self._get("/", params={
            "key": os.getenv("HOTPEPPER_API_KEY", ""),
            "keyword": region_id,
            "format": "json",
            "count": 10,
        })
        if not data:
            return []
        shops = data.get("results", {}).get("shop", [])
        return [self.normalize(s) for s in shops]

    def normalize(self, raw: dict) -> dict:
        return {
            "name": raw.get("name", ""),
            "category": "飲食店・カフェ",
            "location": raw.get("address", ""),
            "description": raw.get("catch", ""),
            "reason": "",
        }
