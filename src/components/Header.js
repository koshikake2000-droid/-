export function initHeader(weekLabel) {
  document.getElementById("weekLabel").textContent = weekLabel;
}

export function initCategoryFilter(categories, onFilter) {
  const container = document.getElementById("category-filter");
  if (!container) return;

  const all = document.createElement("button");
  all.className = "filter-btn active";
  all.textContent = "すべて";
  all.addEventListener("click", () => {
    container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    all.classList.add("active");
    onFilter(null);
  });
  container.appendChild(all);

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      onFilter(cat);
    });
    container.appendChild(btn);
  });
}
