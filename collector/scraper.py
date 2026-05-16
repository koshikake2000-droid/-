import time
import logging
from typing import Optional
import requests
from bs4 import BeautifulSoup
from config import REQUEST_HEADERS, REQUEST_TIMEOUT, RATE_LIMIT_SECONDS

logger = logging.getLogger(__name__)


class BaseScraper:
    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update(REQUEST_HEADERS)

    def _get(self, url: str) -> Optional[BeautifulSoup]:
        try:
            resp = self.session.get(url, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
            time.sleep(RATE_LIMIT_SECONDS)
            return BeautifulSoup(resp.text, "lxml")
        except requests.RequestException as e:
            logger.warning("Failed to fetch %s: %s", url, e)
            return None

    def _to_spot(self, name: str, category: str, location: str,
                 description: str, reason: str) -> dict:
        return {
            "name": name,
            "category": category,
            "location": location,
            "description": description,
            "reason": reason,
        }


class JalanScraper(BaseScraper):
    """Scraper for jalan.net spot listings.

    Selector notes (as of 2026-05):
      - spot name:     .cassette_title a
      - address:       .cassette_address
      - description:   .cassette_description
    These selectors may break if jalan.net updates its markup.
    """

    def scrape_region(self, url: str, region_id: str) -> list[dict]:
        soup = self._get(url)
        if soup is None:
            return []
        spots = []
        for card in soup.select(".cassette_title"):  # placeholder selector
            name = card.get_text(strip=True)
            spots.append(self._to_spot(
                name=name,
                category="観光地・名所",
                location="",
                description="",
                reason="",
            ))
        return spots


class KankoScraper(BaseScraper):
    """Generic scraper for regional tourism association sites."""

    def scrape(self, url: str, name_selector: str,
               description_selector: str) -> list[dict]:
        soup = self._get(url)
        if soup is None:
            return []
        spots = []
        names = soup.select(name_selector)
        descs = soup.select(description_selector)
        for name_el, desc_el in zip(names, descs):
            spots.append(self._to_spot(
                name=name_el.get_text(strip=True),
                category="観光地・名所",
                location="",
                description=desc_el.get_text(strip=True),
                reason="",
            ))
        return spots
