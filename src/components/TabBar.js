export function initTabBar(regions, onTabSwitch) {
  const container = document.getElementById("tabs");
  container.setAttribute("role", "tablist");

  const tabs = regions.map((region, i) => {
    const tab = document.createElement("div");
    tab.className = "tab" + (i === 0 ? " active" : "");
    tab.textContent = region.name;
    tab.dataset.index = i;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
    tab.setAttribute("tabindex", i === 0 ? "0" : "-1");

    tab.addEventListener("click", () => activate(i));
    container.appendChild(tab);
    return tab;
  });

  function activate(index) {
    tabs.forEach((t, j) => {
      t.classList.toggle("active", j === index);
      t.setAttribute("aria-selected", j === index ? "true" : "false");
      t.setAttribute("tabindex", j === index ? "0" : "-1");
    });
    onTabSwitch(index);
  }

  container.addEventListener("keydown", e => {
    const current = [...tabs].findIndex(t => t.getAttribute("aria-selected") === "true");
    if (e.key === "ArrowRight") activate((current + 1) % tabs.length);
    if (e.key === "ArrowLeft") activate((current - 1 + tabs.length) % tabs.length);
  });
}
