const WORDS = {
  strand: ["Sonne", "Muschel", "Welle", "Sandburg", "Palme", "Strand", "Meer", "Seestern", "D\u00fcnen", "Handtuch"],
  eis: ["Eis", "Waffel", "Ferien", "Limonade", "Sommer", "Kugel", "Sorte", "Pause", "Kirsche", "Vanille"],
  natur: ["Biene", "Frosch", "Igel", "Blatt", "Bach", "Wolke", "Nektar", "Spur", "K\u00e4fer", "Wiese"],
  abenteuer: ["Karte", "Schatz", "Kompass", "Team", "Ziel", "Start", "Lupe", "Mut", "R\u00e4tsel", "Pfad"]
};

const THEME_NAMES = {
  strand: "Strand & Meer",
  eis: "Eis & Ferien",
  natur: "Natur-Detektive",
  abenteuer: "Spiele & Abenteuer"
};

const THEME_MARKS = {
  strand: "SM",
  eis: "EF",
  natur: "ND",
  abenteuer: "SA"
};

const TITLES = {
  code: "Geheimschrift am Strand",
  wordsearch: "Wortsuche im Ferienfeld",
  math: "Zahlenr\u00e4tsel mit Eis",
  logic: "Detektiv-Spuren",
  draw: "Kreativauftrag: Sommerseite"
};

const INTROS = {
  code: "Knacke den Zahlen-Code. A = 1, B = 2, C = 3. Schreibe jedes Sommerwort in die Zeile.",
  wordsearch: "Finde alle versteckten W\u00f6rter. Sie laufen waagerecht oder senkrecht.",
  math: "Rechne dich von Station zu Station. Jede richtige Zahl bringt dich n\u00e4her zur Ferienbelohnung.",
  logic: "Lies die Hinweise genau und bringe die Fundstuecke in die richtige Reihenfolge.",
  draw: "Gestalte eine Bonusseite f\u00fcr dein Sommerbuch. Die Checkliste hilft dir beim Fertigwerden."
};

const elements = {
  deliveryMode: document.querySelector("#deliveryMode"),
  type: document.querySelector("#puzzleType"),
  theme: document.querySelector("#theme"),
  packSize: document.querySelector("#packSize"),
  words: document.querySelector("#words"),
  level: document.querySelector("#level"),
  solution: document.querySelector("#solution"),
  worksheet: document.querySelector("#worksheet"),
  title: document.querySelector("#sheetTitle"),
  deliveryMeta: document.querySelector("#deliveryMeta"),
  playTitle: document.querySelector("#playTitle"),
  playArea: document.querySelector("#playArea"),
  scoreLine: document.querySelector("#scoreLine"),
  generate: document.querySelector("#generate"),
  generateTop: document.querySelector("#generateTop"),
  printTop: document.querySelector("#printTop"),
  checkPlay: document.querySelector("#checkPlay"),
  resetPlay: document.querySelector("#resetPlay")
};

let currentPuzzle = null;
let wordSearchSelection = new Set();

[
  elements.deliveryMode,
  elements.type,
  elements.theme,
  elements.packSize,
  elements.words,
  elements.level,
  elements.solution
].forEach((input) => input.addEventListener("input", createDelivery));

elements.generate.addEventListener("click", createDelivery);
elements.generateTop.addEventListener("click", createDelivery);
elements.printTop.addEventListener("click", () => window.print());
elements.checkPlay.addEventListener("click", checkPlay);
elements.resetPlay.addEventListener("click", () => {
  renderPlay(currentPuzzle);
  elements.scoreLine.textContent = "Neu gestartet. Jetzt bist du dran.";
});

createDelivery();

function createDelivery() {
  const settings = getSettings();
  document.body.classList.toggle("mode-play", settings.deliveryMode === "play");
  currentPuzzle = buildPuzzle(settings);
  wordSearchSelection = new Set();
  renderWorksheet(currentPuzzle, settings);
  renderPlay(currentPuzzle);
  elements.scoreLine.textContent = "Bereit f\u00fcr die n\u00e4chste Lieferung.";
}

function getSettings() {
  const customWords = elements.words.value
    .split(/[,;\n]/)
    .map((word) => cleanWord(word))
    .filter(Boolean);

  const count = elements.level.value === "knifflig" ? 8 : elements.level.value === "leicht" ? 5 : 6;
  const words = (customWords.length ? customWords : WORDS[elements.theme.value]).slice(0, count);

  return {
    deliveryMode: elements.deliveryMode.value,
    type: elements.type.value,
    theme: elements.theme.value,
    packSize: Number(elements.packSize.value),
    level: elements.level.value,
    words,
    showSolution: elements.solution.checked
  };
}

function buildPuzzle(settings) {
  if (settings.type === "code") return buildCode(settings);
  if (settings.type === "wordsearch") return buildWordSearch(settings);
  if (settings.type === "math") return buildMath(settings);
  if (settings.type === "logic") return buildLogic(settings);
  return buildDraw(settings);
}

function buildCode(settings) {
  return {
    ...basePuzzle(settings),
    rows: settings.words.slice(0, 6).map((word) => ({
      prompt: encodeWord(word),
      answer: normalizeAnswer(word)
    }))
  };
}

function buildWordSearch(settings) {
  const words = settings.words.slice(0, 7).map((word) => normalizeAnswer(word));
  const grid = makeGrid(10);
  const placed = [];

  words.forEach((word, index) => {
    const horizontal = index % 2 === 0;
    const start = horizontal
      ? { row: (index * 2) % 10, col: Math.max(0, 9 - word.length) }
      : { row: Math.max(0, 9 - word.length), col: (index * 3) % 10 };

    for (let i = 0; i < word.length && i < 10; i += 1) {
      const row = horizontal ? start.row : start.row + i;
      const col = horizontal ? start.col + i : start.col;
      grid[row][col] = word[i];
    }
    placed.push(word);
  });

  fillGrid(grid, settings.theme);

  return {
    ...basePuzzle(settings),
    words: placed,
    grid
  };
}

function buildMath(settings) {
  const base = settings.level === "knifflig" ? 14 : settings.level === "leicht" ? 8 : 11;
  const modifiers = settings.level === "leicht" ? [3, 4, -2, 5, 2] : settings.level === "knifflig" ? [7, -4, 9, -5, 8, 6] : [5, -3, 7, 4, -2, 6];
  let value = base;
  const rows = modifiers.map((change, index) => {
    const before = value;
    value += change;
    return {
      label: `Station ${index + 1}`,
      prompt: `${before} ${change > 0 ? "+" : "-"} ${Math.abs(change)} =`,
      answer: String(value)
    };
  });

  return {
    ...basePuzzle(settings),
    start: base,
    rows
  };
}

function buildLogic(settings) {
  const items = settings.words.slice(0, 3);
  const order = [items[1], items[0], items[2]];

  return {
    ...basePuzzle(settings),
    items,
    order,
    clues: [
      `${items[0]} liegt direkt vor ${items[2]}.`,
      `${items[1]} liegt nicht in der Mitte.`,
      `${items[2]} liegt als Letztes.`
    ]
  };
}

function buildDraw(settings) {
  return {
    ...basePuzzle(settings),
    checklist: [
      "Male ein grosses Sommer-Symbol.",
      "Verstecke drei kleine W\u00f6rter im Bild.",
      "Erfinde einen Titel f\u00fcr die Seite.",
      "Setze ein Muster an den Rand."
    ]
  };
}

function basePuzzle(settings) {
  return {
    type: settings.type,
    theme: settings.theme,
    title: TITLES[settings.type],
    intro: INTROS[settings.type],
    themeName: THEME_NAMES[settings.theme],
    mark: THEME_MARKS[settings.theme],
    packSize: settings.packSize,
    level: settings.level,
    showSolution: settings.showSolution
  };
}

function renderWorksheet(puzzle, settings) {
  elements.title.textContent = puzzle.title;
  elements.deliveryMeta.textContent = `${settings.packSize} ${settings.packSize === 1 ? "Seite" : "Seiten"}`;
  elements.worksheet.innerHTML = `
    <header class="sheet-head">
      <div class="sheet-icon">${escapeHtml(puzzle.mark)}</div>
      <div>
        <h3>${escapeHtml(puzzle.title)}</h3>
        <p>${escapeHtml(puzzle.intro)}</p>
      </div>
    </header>
    <div class="sheet-meta">
      <span>${escapeHtml(puzzle.themeName)}</span>
      <span>${escapeHtml(capitalize(puzzle.level))}</span>
      <span>Extra-Seite ${settings.packSize > 1 ? "1 von " + settings.packSize : "1"}</span>
    </div>
    ${worksheetBody(puzzle)}
    ${settings.packSize > 1 ? renderMiniPages(puzzle, settings.packSize) : ""}
    ${puzzle.showSolution ? renderSolution(puzzle) : ""}
  `;
}

function worksheetBody(puzzle) {
  if (puzzle.type === "code") {
    return `
      <section class="task-box">
        ${puzzle.rows.map((row, index) => `
          <div class="task-row">
            <p><strong>${index + 1}.</strong> ${escapeHtml(row.prompt)}</p>
            <div class="answer-line"></div>
          </div>
        `).join("")}
      </section>
    `;
  }

  if (puzzle.type === "wordsearch") {
    return `
      <section class="task-box">
        <div class="letter-grid">
          ${puzzle.grid.flat().map((letter) => `<span>${letter}</span>`).join("")}
        </div>
        <div class="word-pills">${puzzle.words.map((word) => `<span>${escapeHtml(word)}</span>`).join("")}</div>
      </section>
    `;
  }

  if (puzzle.type === "math") {
    return `
      <section class="task-box math-ladder">
        <p><strong>Startzahl:</strong> ${puzzle.start}</p>
        ${puzzle.rows.map((row) => `
          <div class="task-row">
            <p><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(row.prompt)}</p>
            <div class="answer-line"></div>
          </div>
        `).join("")}
      </section>
    `;
  }

  if (puzzle.type === "logic") {
    return `
      <section class="task-box">
        <p>Gefunden wurden: <strong>${puzzle.items.map(escapeHtml).join(", ")}</strong>.</p>
        ${puzzle.clues.map((clue, index) => `<p><strong>Hinweis ${index + 1}:</strong> ${escapeHtml(clue)}</p>`).join("")}
        <div class="task-row"><p>Platz 1</p><div class="answer-line"></div></div>
        <div class="task-row"><p>Platz 2</p><div class="answer-line"></div></div>
        <div class="task-row"><p>Platz 3</p><div class="answer-line"></div></div>
      </section>
    `;
  }

  return `
    <section class="task-box">
      ${puzzle.checklist.map((item) => `<p><strong>[ ]</strong> ${escapeHtml(item)}</p>`).join("")}
      <div class="draw-field"></div>
      <p>Mein Titel:</p>
      <div class="answer-line"></div>
    </section>
  `;
}

function renderMiniPages(puzzle, packSize) {
  const extras = [
    "Bonus-Aufgabe: Schreibe drei eigene Sommerw\u00f6rter auf.",
    "Bonus-Aufgabe: Erfinde eine Frage zu diesem R\u00e4tsel.",
    "Bonus-Aufgabe: Tausche das Blatt mit jemandem und prueft euch gegenseitig.",
    "Bonus-Aufgabe: Male einen kleinen Fund am Rand.",
    "Bonus-Aufgabe: Gib deiner Lieferung einen lustigen Namen."
  ];

  return `
    <section class="task-box">
      <p><strong>Weitere Seiten dieser Lieferung</strong></p>
      ${Array.from({ length: packSize - 1 }, (_, index) => `
        <p><span class="mini-tag">Seite ${index + 2}</span> ${escapeHtml(extras[(index + puzzle.title.length) % extras.length])}</p>
        <div class="answer-line"></div>
      `).join("")}
    </section>
  `;
}

function renderSolution(puzzle) {
  let text = "Freie Kontrolle durch Kind oder Eltern.";
  if (puzzle.type === "code") text = puzzle.rows.map((row) => row.answer).join(", ");
  if (puzzle.type === "wordsearch") text = puzzle.words.join(", ");
  if (puzzle.type === "math") text = puzzle.rows.map((row) => row.answer).join(" -> ");
  if (puzzle.type === "logic") text = puzzle.order.join(" -> ");

  return `<section class="task-box"><strong>Loesung:</strong> ${escapeHtml(text)}</section>`;
}

function renderPlay(puzzle) {
  elements.playTitle.textContent = puzzle.type === "draw"
    ? "Hake die Kreativ-Schritte ab und sammle die fertige Seite."
    : "Tippe Antworten ein, markiere Buchstaben oder w\u00e4hle die Reihenfolge.";

  if (puzzle.type === "code") {
    elements.playArea.innerHTML = puzzle.rows.map((row, index) => `
      <label class="play-card" data-answer="${escapeHtml(row.answer)}">
        <strong>${index + 1}. ${escapeHtml(row.prompt)}</strong>
        <input type="text" autocomplete="off" placeholder="Antwort">
      </label>
    `).join("");
    return;
  }

  if (puzzle.type === "wordsearch") {
    elements.playArea.innerHTML = `
      <div class="play-card">
        <strong>Markiere gefundene Buchstaben.</strong>
        <div class="letter-grid">
          ${puzzle.grid.flat().map((letter, index) => `<button type="button" data-cell="${index}" aria-label="Buchstabe ${letter}">${letter}</button>`).join("")}
        </div>
        <div class="word-pills">${puzzle.words.map((word) => `<span>${escapeHtml(word)}</span>`).join("")}</div>
      </div>
    `;
    elements.playArea.querySelectorAll("[data-cell]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.cell;
        if (wordSearchSelection.has(id)) {
          wordSearchSelection.delete(id);
          button.classList.remove("is-selected");
        } else {
          wordSearchSelection.add(id);
          button.classList.add("is-selected");
        }
      });
    });
    return;
  }

  if (puzzle.type === "math") {
    elements.playArea.innerHTML = puzzle.rows.map((row) => `
      <label class="play-card" data-answer="${escapeHtml(row.answer)}">
        <strong>${escapeHtml(row.label)}: ${escapeHtml(row.prompt)}</strong>
        <input type="number" inputmode="numeric" placeholder="Zahl">
      </label>
    `).join("");
    return;
  }

  if (puzzle.type === "logic") {
    elements.playArea.innerHTML = `
      <div class="play-card">
        <strong>Hinweise</strong>
        ${puzzle.clues.map((clue) => `<p>${escapeHtml(clue)}</p>`).join("")}
      </div>
      ${[0, 1, 2].map((slot) => `
        <label class="play-card" data-answer="${escapeHtml(normalizeAnswer(puzzle.order[slot]))}">
          <strong>Platz ${slot + 1}</strong>
          <input type="text" autocomplete="off" placeholder="Fundstueck">
        </label>
      `).join("")}
    `;
    return;
  }

  elements.playArea.innerHTML = puzzle.checklist.map((item) => `
    <label class="play-card">
      <input type="checkbox">
      <strong>${escapeHtml(item)}</strong>
    </label>
  `).join("");
}

function checkPlay() {
  if (!currentPuzzle) return;

  if (currentPuzzle.type === "wordsearch") {
    const needed = currentPuzzle.words.join("").length;
    const selected = wordSearchSelection.size;
    elements.scoreLine.textContent = selected >= Math.min(needed, 22)
      ? "Stark: Du hast viele Buchstaben markiert. Druckbogen kann kontrolliert werden."
      : `Noch etwas suchen: ${selected} Buchstaben markiert.`;
    return;
  }

  if (currentPuzzle.type === "draw") {
    const checks = [...elements.playArea.querySelectorAll("input[type='checkbox']")];
    const done = checks.filter((input) => input.checked).length;
    elements.scoreLine.textContent = `${done} von ${checks.length} Kreativ-Schritten erledigt.`;
    return;
  }

  const cards = [...elements.playArea.querySelectorAll("[data-answer]")];
  let correct = 0;

  cards.forEach((card) => {
    const input = card.querySelector("input");
    const expected = normalizeAnswer(card.dataset.answer);
    const actual = normalizeAnswer(input.value);
    const good = actual === expected;
    card.classList.toggle("is-good", good);
    card.classList.toggle("is-bad", Boolean(actual) && !good);
    if (good) correct += 1;
  });

  elements.scoreLine.textContent = `${correct} von ${cards.length} Antworten richtig.`;
}

function encodeWord(word) {
  return normalizeAnswer(word)
    .split("")
    .map((letter) => letter.charCodeAt(0) - 64)
    .join("-");
}

function normalizeAnswer(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .replaceAll("Ä", "AE")
    .replaceAll("Ö", "OE")
    .replaceAll("Ü", "UE")
    .replaceAll("ß", "SS")
    .replace(/[^A-Z0-9]/g, "");
}

function cleanWord(value) {
  const word = String(value).trim();
  return word.length > 18 ? word.slice(0, 18) : word;
}

function makeGrid(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
}

function fillGrid(grid, theme) {
  const filler = normalizeAnswer(WORDS[theme].join(""));
  let index = 0;
  for (let row = 0; row < grid.length; row += 1) {
    for (let col = 0; col < grid[row].length; col += 1) {
      if (!grid[row][col]) {
        grid[row][col] = filler[index % filler.length];
        index += 1;
      }
    }
  }
}

function capitalize(value) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
