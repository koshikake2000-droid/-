const CATEGORY_CLASS = {
  "観光地・名所": "cat-tourist",
  "飲食店・カフェ": "cat-food",
  "アクティビティ": "cat-activity",
  "ショッピング": "cat-shopping",
  "穴場": "cat-hidden"
};

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

export function createSpotCard(spot, onSelect) {
  const card = document.createElement("article");
  card.className = "spot-card";
  if (spot.lat && spot.lng) card.classList.add("selectable");

  const catClass = CATEGORY_CLASS[spot.category] || "cat-tourist";

  card.appendChild(createEl("div", "spot-name", spot.name));
  card.appendChild(createEl("span", `category-badge ${catClass}`, spot.category));
  card.appendChild(createEl("div", "spot-location", spot.location));

  if (spot.address) card.appendChild(createEl("div", "spot-address", spot.address));
  if (spot.access)  card.appendChild(createEl("div", "spot-access", spot.access));

  card.appendChild(createEl("p", "spot-description", spot.description));
  card.appendChild(createEl("div", "spot-reason", spot.reason));

  if (spot.lat && spot.lng && onSelect) {
    card.addEventListener("click", () => {
      const isSelected = card.classList.contains("selected");
      onSelect(isSelected ? null : spot, isSelected ? null : card);
    });
  }

  return card;
}
