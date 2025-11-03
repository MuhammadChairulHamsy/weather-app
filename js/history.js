export function addHistory(city) {
  let history = JSON.parse(localStorage.getItem("Weather History")) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 10) history.pop();
    localStorage.setItem("Weather History", JSON.stringify(history));
  }
  renderHistory();
}

export function renderHistory() {
  const historyList = document.getElementById("history-list");
  const clearHistoryBtn = document.getElementById("clear-history");
  let history = JSON.parse(localStorage.getItem("Weather History")) || [];

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = '<div class="empty-state">Belum ada riwayat pencarian</div>';
    clearHistoryBtn.style.display = "none";
    return;
  }

  clearHistoryBtn.style.display = "block";

  history.forEach((city, index) => {
    const li = document.createElement("li");
    li.classList = "history-item";
    li.style.cursor = "pointer";
    li.innerHTML = `
      <div class="history-item-content">
        <span class="history-city-name">${city}</span>
      </div>
      <button class="delete-btn" onclick="deleteHistoryItem(${index}); event.stopPropagation();">×</button>
    `;
    li.onclick = (e) => {
      if (!e.target.classList.contains("delete-btn")) {
        document.getElementById("text-input").value = city;
        document.getElementById("search-weather").click();
      }
    };
    historyList.appendChild(li);
  });
}

export function deleteHistoryItem(index) {
  let history = JSON.parse(localStorage.getItem("Weather History")) || [];
  history.splice(index, 1);
  localStorage.setItem("Weather History", JSON.stringify(history));
  renderHistory();
}

export function clearHistory() {
  if (confirm("Apakah Anda yakin ingin menghapus semua riwayat?")) {
    localStorage.removeItem("Weather History");
    renderHistory();
  }
}
