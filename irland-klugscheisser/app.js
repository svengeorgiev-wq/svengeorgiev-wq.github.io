const STORAGE_KEY = "irland-klugscheisser-bonus-v1";

const spots = [
  {
    id: "dublin",
    title: "Dublin",
    county: "County Dublin",
    region: "Osten",
    type: "Stadt",
    x: 69,
    y: 47,
    fact: "Dublin war lange zweigeteilt: suedlich der Liffey galt als feiner, noerdlich als rauer. Heute ist diese Grenze eher Running Gag als Stadtgesetz.",
    line: "Wenn jemand nur Temple Bar kennt, frag nach der Liffey-Seite.",
    mission: "Merke dir einen Ort noerdlich und einen suedlich der Liffey.",
    question: "Welche Linie trennt Dublin in vielen Stadtgespraechen symbolisch?",
    options: ["Der Fluss Liffey", "Die Ring of Kerry Road", "Der Shannon"],
    answer: "Der Fluss Liffey",
    explanation: "Die Liffey laeuft quer durch Dublin und liefert Stoff fuer alte Nord-Sued-Klischees."
  },
  {
    id: "galway",
    title: "Galway",
    county: "County Galway",
    region: "Westen",
    type: "Musik",
    x: 31,
    y: 45,
    fact: "Galway ist nicht nur Postkartenstadt, sondern eine Hochburg fuer Strassenmusik. Die Shop Street klingt an guten Tagen wie ein kostenloses Festival.",
    line: "Galway erkennt man oft erst mit den Ohren.",
    mission: "Suche einen irischen Songtitel und notiere, ob er aus Trauer oder Trotz funktioniert.",
    question: "Wofuer ist Galways Shop Street besonders bekannt?",
    options: ["Strassenmusik", "Whiskeybrennereien", "Vulkansteine"],
    answer: "Strassenmusik",
    explanation: "Galway lebt von Pub-Kultur, Festivals und vielen Musikerinnen und Musikern auf der Strasse."
  },
  {
    id: "dingle",
    title: "Dingle",
    county: "County Kerry",
    region: "Suedwesten",
    type: "Sprache",
    x: 24,
    y: 70,
    fact: "Die Dingle-Halbinsel gehoert zu den Gegenden, in denen Irisch im Alltag noch sichtbar und hoerbar ist.",
    line: "Auf Dingle bestellst du nicht nur Aussicht, sondern Gaeltacht-Flair.",
    mission: "Praege dir ein irisches Wort ein: slainte heisst sinngemaess Prost.",
    question: "Was bezeichnet eine Gaeltacht?",
    options: ["Ein irischsprachiges Gebiet", "Eine alte Hafensteuer", "Ein Bergpass"],
    answer: "Ein irischsprachiges Gebiet",
    explanation: "Gaeltacht-Regionen sind Gebiete, in denen die irische Sprache eine besondere Rolle spielt."
  },
  {
    id: "cork",
    title: "Cork",
    county: "County Cork",
    region: "Sueden",
    type: "Stolz",
    x: 43,
    y: 78,
    fact: "Cork nennt sich gern die wahre Hauptstadt Irlands. Das ist halb Witz, halb lokale Religion.",
    line: "In Cork sagt man nicht Hauptstadtkomplex, sondern Selbstbewusstsein.",
    mission: "Finde heraus, warum Cork im Unabhaengigkeitskampf so wichtig war.",
    question: "Wie wird Cork augenzwinkernd oft genannt?",
    options: ["Die wahre Hauptstadt", "Die stille Mitte", "Das Tor zum Norden"],
    answer: "Die wahre Hauptstadt",
    explanation: "Viele Corkonians pflegen diesen stolzen Spitznamen mit sehr trockenem Humor."
  },
  {
    id: "kilkenny",
    title: "Kilkenny",
    county: "County Kilkenny",
    region: "Suedosten",
    type: "Mittelalter",
    x: 62,
    y: 67,
    fact: "Kilkenny wirkt wie ein begehbares Mittelalter-Set: Burg, Gassen, Steinmauern und genug Geschichte fuer mehrere Pub-Abende.",
    line: "Kilkenny ist der Ort, an dem Kopfsteinpflaster wie Quellenmaterial wirkt.",
    mission: "Merke dir den Begriff Medieval Mile.",
    question: "Welcher Begriff passt besonders gut zu Kilkenny?",
    options: ["Medieval Mile", "Atlantic Surf Ring", "Titanic Quarter"],
    answer: "Medieval Mile",
    explanation: "Die Medieval Mile verbindet zentrale historische Orte der Stadt."
  },
  {
    id: "belfast",
    title: "Belfast",
    county: "County Antrim",
    region: "Nordosten",
    type: "Industrie",
    x: 62,
    y: 19,
    fact: "Belfast war ein industrielles Kraftzentrum. Die Titanic wurde hier gebaut, was die Stadt heute sehr viel eleganter erzaehlt als frueher.",
    line: "Titanic-Wissen beginnt nicht im Atlantik, sondern in Belfast.",
    mission: "Notiere dir: Harland & Wolff.",
    question: "Welche beruehmte Verbindung hat Belfast?",
    options: ["Titanic-Werft", "Roemisches Kolosseum", "Alpenpass"],
    answer: "Titanic-Werft",
    explanation: "Die Titanic entstand in der Belfaster Werft Harland & Wolff."
  },
  {
    id: "causeway",
    title: "Giant's Causeway",
    county: "County Antrim",
    region: "Nordkueste",
    type: "Natur",
    x: 53,
    y: 10,
    fact: "Die Basaltsaeulen des Giant's Causeway sehen aus, als haette jemand Natur im Hexagon-Modus gebaut.",
    line: "Geologie, aber mit Mythenbonus.",
    mission: "Merke dir Finn McCool als Sagenfigur zum Ort.",
    question: "Welche Form praegt viele Steine am Giant's Causeway?",
    options: ["Sechsecke", "Kreise", "Dreiecke"],
    answer: "Sechsecke",
    explanation: "Die markanten Basaltsaeulen bilden haeufig sechseckige Strukturen."
  },
  {
    id: "aran",
    title: "Aran Islands",
    county: "County Galway",
    region: "Atlantik",
    type: "Inseln",
    x: 22,
    y: 48,
    fact: "Die Aran Islands sind beruehmt fuer Steinmauern, raues Wetter und Pullover, die aussehen, als koennten sie Familiengeschichten speichern.",
    line: "Aran ist kein Filter, sondern Wind, Stein und Ausdauer.",
    mission: "Merke dir Inis Mor als groesste der drei Inseln.",
    question: "Welche Insel ist die groesste der Aran Islands?",
    options: ["Inis Mor", "Skellig Michael", "Rathlin"],
    answer: "Inis Mor",
    explanation: "Inis Mor ist die groesste und bekannteste der drei Aran Islands."
  }
];

const state = {
  activeSpotId: spots[0].id,
  activeView: "map",
  quizIndex: 0,
  answered: false,
  data: loadState()
};

const elements = {
  visitedCount: document.querySelector("#visitedCount"),
  favoriteCount: document.querySelector("#favoriteCount"),
  scoreText: document.querySelector("#scoreText"),
  startRouteButton: document.querySelector("#startRouteButton"),
  randomFactButton: document.querySelector("#randomFactButton"),
  resetButton: document.querySelector("#resetButton"),
  stationList: document.querySelector("#stationList"),
  pinLayer: document.querySelector("#pinLayer"),
  spotMeta: document.querySelector("#spotMeta"),
  spotTitle: document.querySelector("#spotTitle"),
  spotFact: document.querySelector("#spotFact"),
  spotLine: document.querySelector("#spotLine"),
  spotMission: document.querySelector("#spotMission"),
  nextSpotButton: document.querySelector("#nextSpotButton"),
  favoriteButton: document.querySelector("#favoriteButton"),
  quizMeta: document.querySelector("#quizMeta"),
  quizProgress: document.querySelector("#quizProgress"),
  quizQuestion: document.querySelector("#quizQuestion"),
  answerGrid: document.querySelector("#answerGrid"),
  quizFeedback: document.querySelector("#quizFeedback"),
  nextQuestionButton: document.querySelector("#nextQuestionButton"),
  restartQuizButton: document.querySelector("#restartQuizButton"),
  notesInput: document.querySelector("#notesInput"),
  saveState: document.querySelector("#saveState"),
  savedList: document.querySelector("#savedList"),
  clearFavoritesButton: document.querySelector("#clearFavoritesButton"),
  tabs: document.querySelectorAll(".tab-button"),
  views: document.querySelectorAll(".view")
};

init();

function init() {
  elements.notesInput.value = state.data.notes;
  renderAll();
  bindEvents();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function bindEvents() {
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });

  elements.startRouteButton.addEventListener("click", () => {
    const firstOpen = spots.find((spot) => !state.data.visited.includes(spot.id)) ?? spots[0];
    selectSpot(firstOpen.id);
    setView("map");
    scrollToWorkspace();
  });

  elements.randomFactButton.addEventListener("click", () => {
    const index = Math.floor(Math.random() * spots.length);
    selectSpot(spots[index].id);
    setView("map");
    scrollToWorkspace();
  });

  elements.nextSpotButton.addEventListener("click", () => {
    const current = spots.findIndex((spot) => spot.id === state.activeSpotId);
    const next = spots[(current + 1) % spots.length];
    selectSpot(next.id);
  });

  elements.favoriteButton.addEventListener("click", toggleFavorite);
  elements.nextQuestionButton.addEventListener("click", nextQuestion);
  elements.restartQuizButton.addEventListener("click", restartQuiz);
  elements.clearFavoritesButton.addEventListener("click", clearFavorites);
  elements.resetButton.addEventListener("click", resetProgress);

  elements.notesInput.addEventListener("input", () => {
    state.data.notes = elements.notesInput.value;
    saveState();
    elements.saveState.textContent = "Gespeichert.";
    window.setTimeout(() => {
      elements.saveState.textContent = "Automatisch lokal gespeichert.";
    }, 900);
  });
}

function renderAll() {
  renderSpot();
  renderStats();
  renderStations();
  renderPins();
  renderQuiz();
  renderSaved();
}

function renderStats() {
  elements.visitedCount.textContent = `${state.data.visited.length}/${spots.length}`;
  elements.favoriteCount.textContent = String(state.data.favorites.length);
  elements.scoreText.textContent = String(state.data.quizScore);
}

function renderStations() {
  elements.stationList.innerHTML = "";

  spots.forEach((spot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "station-button";
    button.classList.toggle("is-active", spot.id === state.activeSpotId);
    button.classList.toggle("is-visited", state.data.visited.includes(spot.id));
    button.innerHTML = `
      <span class="station-button__number">${String(index + 1).padStart(2, "0")}</span>
      <span>
        <span class="station-button__title">${escapeHtml(spot.title)}</span>
        <span class="station-button__meta">${escapeHtml(spot.county)} / ${escapeHtml(spot.type)}</span>
      </span>
    `;
    button.addEventListener("click", () => selectSpot(spot.id));
    elements.stationList.append(button);
  });
}

function renderPins() {
  elements.pinLayer.innerHTML = "";

  spots.forEach((spot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-pin";
    button.classList.toggle("is-active", spot.id === state.activeSpotId);
    button.classList.toggle("is-visited", state.data.visited.includes(spot.id));
    button.style.left = `${spot.x}%`;
    button.style.top = `${spot.y}%`;
    button.setAttribute("aria-label", spot.title);
    button.textContent = String(index + 1);
    button.addEventListener("click", () => selectSpot(spot.id));
    elements.pinLayer.append(button);
  });
}

function renderSpot() {
  const spot = getActiveSpot();
  markVisited(spot.id);

  elements.spotMeta.textContent = `${spot.county} / ${spot.region} / ${spot.type}`;
  elements.spotTitle.textContent = spot.title;
  elements.spotFact.textContent = spot.fact;
  elements.spotLine.textContent = spot.line;
  elements.spotMission.textContent = spot.mission;

  const isFavorite = state.data.favorites.includes(spot.id);
  elements.favoriteButton.classList.toggle("is-selected", isFavorite);
  elements.favoriteButton.innerHTML = `
    <span data-lucide="star"></span>
    ${isFavorite ? "Gemerkt" : "Merken"}
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderQuiz() {
  const spot = spots[state.quizIndex];
  elements.quizMeta.textContent = `Frage ${state.quizIndex + 1}`;
  elements.quizProgress.textContent = `${state.quizIndex + 1}/${spots.length}`;
  elements.quizQuestion.textContent = spot.question;
  elements.quizFeedback.hidden = true;
  elements.quizFeedback.className = "quiz-feedback";
  elements.answerGrid.innerHTML = "";
  elements.nextQuestionButton.disabled = !state.answered;

  spot.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = option;
    button.disabled = state.answered;
    button.addEventListener("click", () => checkAnswer(option));
    elements.answerGrid.append(button);
  });
}

function renderSaved() {
  elements.savedList.innerHTML = "";

  if (state.data.favorites.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Noch kein Fakt gemerkt.";
    elements.savedList.append(empty);
    return;
  }

  state.data.favorites
    .map((id) => spots.find((spot) => spot.id === id))
    .filter(Boolean)
    .forEach((spot) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "saved-item";
      item.innerHTML = `
        <span class="saved-item__title">${escapeHtml(spot.title)}</span>
        <span>${escapeHtml(spot.line)}</span>
      `;
      item.addEventListener("click", () => {
        selectSpot(spot.id);
        setView("map");
      });
      elements.savedList.append(item);
    });
}

function selectSpot(id) {
  state.activeSpotId = id;
  markVisited(id);
  renderStats();
  renderStations();
  renderPins();
  renderSpot();
}

function markVisited(id) {
  if (!state.data.visited.includes(id)) {
    state.data.visited.push(id);
    saveState();
  }
}

function toggleFavorite() {
  const id = state.activeSpotId;
  if (state.data.favorites.includes(id)) {
    state.data.favorites = state.data.favorites.filter((item) => item !== id);
  } else {
    state.data.favorites.push(id);
  }
  saveState();
  renderStats();
  renderSpot();
  renderSaved();
}

function checkAnswer(option) {
  if (state.answered) return;

  const spot = spots[state.quizIndex];
  const correct = option === spot.answer;
  state.answered = true;

  if (correct) {
    state.data.quizScore += 1;
    elements.quizFeedback.textContent = `Richtig. ${spot.explanation}`;
    elements.quizFeedback.classList.add("is-success");
  } else {
    elements.quizFeedback.textContent = `Fast. ${spot.explanation}`;
    elements.quizFeedback.classList.add("is-warning");
  }

  elements.quizFeedback.hidden = false;
  saveState();
  renderStats();

  [...elements.answerGrid.children].forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-correct", button.textContent === spot.answer);
    button.classList.toggle("is-wrong", button.textContent === option && !correct);
  });

  elements.nextQuestionButton.disabled = false;
}

function nextQuestion() {
  state.quizIndex = (state.quizIndex + 1) % spots.length;
  state.answered = false;
  renderQuiz();
}

function restartQuiz() {
  state.quizIndex = 0;
  state.answered = false;
  state.data.quizScore = 0;
  saveState();
  renderStats();
  renderQuiz();
}

function clearFavorites() {
  state.data.favorites = [];
  saveState();
  renderStats();
  renderSpot();
  renderSaved();
}

function resetProgress() {
  state.data.visited = [];
  saveState();
  renderStats();
  renderStations();
  renderPins();
  renderSpot();
}

function setView(view) {
  state.activeView = view;
  elements.tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === view);
  });
  elements.views.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === view);
  });
}

function scrollToWorkspace() {
  document.querySelector(".workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function getActiveSpot() {
  return spots.find((spot) => spot.id === state.activeSpotId) ?? spots[0];
}

function loadState() {
  const fallback = {
    visited: [],
    favorites: [],
    quizScore: 0,
    notes: ""
  };

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
