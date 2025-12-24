/* -----------------------------
   APP DATA
----------------------------- */

const categories = {
  "Recenti": [],
  "Streaming": [
    { name: "Rivestream", url: "https://rivestream.org", icon: "icons/rivestream.svg" },
    { name: "StreamingUnity", url: "https://streamingunity.so", icon: "icons/streamingunity.svg" },
    { name: "YouTube", url: "https://youtube.com", icon: "icons/youtube.svg" }
  ],
  "Anime": [
    { name: "AnimeUnity", url: "https://animeunity.so", icon: "icons/animeunity.svg" }
  ],
  "Tools": [
    { name: "IMDn", url: "https://imdb.com", icon: "icons/imdb.svg" },
    { name: "StreamIndex", url: "https://streamindex.org", icon: "icons/streamindex.svg" }
  ]
};

let recent = JSON.parse(localStorage.getItem("recent")) || [];

/* -----------------------------
   CLOCK
----------------------------- */

function updateClock() {
  const now = new Date();
  const t = now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("clock").textContent = t;
  document.getElementById("screensaverClock").textContent = t;
}
setInterval(updateClock, 1000);
updateClock();

/* -----------------------------
   BUILD ROWS
----------------------------- */

function buildRows() {
  const container = document.getElementById("rows");
  container.innerHTML = "";

  if (recent.length > 0) {
    categories["Recenti"] = recent;
  }

  for (const [title, apps] of Object.entries(categories)) {
    const h = document.createElement("div");
    h.className = "row-title";
    h.textContent = title;

    const row = document.createElement("div");
    row.className = "row";

    apps.forEach(app => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.tabIndex = -1;

      tile.innerHTML = `
        <img src="${app.icon}">
        <span>${app.name}</span>
      `;

      tile.onclick = () => openApp(app);

      row.appendChild(tile);
    });

    container.appendChild(h);
    container.appendChild(row);
  }
}

buildRows();

/* -----------------------------
   OPEN APP + RECENT
----------------------------- */

function openApp(app) {
  window.open(app.url, "_blank");

  recent = [app, ...recent.filter(a => a.url !== app.url)].slice(0, 5);
  localStorage.setItem("recent", JSON.stringify(recent));

  buildRows();
}

/* -----------------------------
   REMOTE NAVIGATION
----------------------------- */

let focusRow = 0;
let focusCol = 0;

function getRows() {
  return [...document.querySelectorAll(".row")];
}

function focusTile(r, c) {
  const rows = getRows();
  if (!rows[r]) return;

  const tiles = [...rows[r].children];
  if (!tiles[c]) return;

  tiles[c].focus();
}

document.addEventListener("keydown", e => {
  const rows = getRows();

  if (e.key === "ArrowDown") {
    focusRow = Math.min(focusRow + 1, rows.length - 1);
    focusCol = 0;
  }
  if (e.key === "ArrowUp") {
    focusRow = Math.max(focusRow - 1, 0);
    focusCol = 0;
  }
  if (e.key === "ArrowRight") {
    const tiles = rows[focusRow].children;
    focusCol = Math.min(focusCol + 1, tiles.length - 1);
  }
  if (e.key === "ArrowLeft") {
    focusCol = Math.max(focusCol - 1, 0);
  }
  if (e.key === "Enter") {
    const tile = rows[focusRow].children[focusCol];
    tile.click();
  }

  focusTile(focusRow, focusCol);
});

/* -----------------------------
   SEARCH
----------------------------- */

document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  document.querySelectorAll(".tile").forEach(tile => {
    const name = tile.innerText.toLowerCase();
    tile.style.display = name.includes(q) ? "flex" : "none";
  });
});

/* -----------------------------
   THEME TOGGLE
----------------------------- */

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dim");
};

/* -----------------------------
   SCREENSAVER
----------------------------- */

let idleTimer;

function resetIdle() {
  clearTimeout(idleTimer);
  document.getElementById("screensaver").classList.add("hidden");

  idleTimer = setTimeout(() => {
    document.getElementById("screensaver").classList.remove("hidden");
  }, 120000);
}

document.onmousemove = document.onkeydown = resetIdle;
resetIdle();
