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
  draw: "Kreativauftrag: Sommerseite",
  scramble: "Buchstabensalat",
  syllables: "Silben-Puzzle",
  sequence: "Zahlenreihe",
  sudoku: "Mini-Sudoku",
  maze: "Sommer-Labyrinth"
};

const INTROS = {
  code: "Knacke den Zahlen-Code. A = 1, B = 2, C = 3. Schreibe jedes Sommerwort in die Zeile.",
  wordsearch: "Finde alle versteckten W\u00f6rter. Sie laufen waagerecht oder senkrecht.",
  math: "Rechne dich von Station zu Station. Jede richtige Zahl bringt dich n\u00e4her zur Ferienbelohnung.",
  logic: "Lies die Hinweise genau und bringe die Fundst\u00fccke in die richtige Reihenfolge.",
  draw: "Gestalte eine Bonusseite f\u00fcr dein Sommerbuch. Die Checkliste hilft dir beim Fertigwerden.",
  scramble: "Sortiere die durcheinandergeratenen Buchstaben und finde die Sommerw\u00f6rter.",
  syllables: "Setze die Silben aus der Wortbank zu richtigen Sommerw\u00f6rtern zusammen.",
  sequence: "Erkenne das Muster und trage die fehlenden Zahlen ein.",
  sudoku: "F\u00fclle die leeren Felder. In jeder Zeile, Spalte und Box stehen 1 bis 4 genau einmal.",
  maze: "Finde den Weg vom Start zum Ziel. Auf Papier mit Stift, am Handy per Antippen."
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
  guideTop: document.querySelector("#guideTop"),
  guideModal: document.querySelector("#guideModal"),
  guideClose: document.querySelector("#guideClose"),
  checkPlay: document.querySelector("#checkPlay"),
  resetPlay: document.querySelector("#resetPlay")
};

let currentPuzzle = null;
let wordSearchSelection = new Set();
let mazeSelection = new Set();
let deliverySeed = Math.floor(Date.now() % 997);

[
  elements.deliveryMode,
  elements.type,
  elements.theme,
  elements.packSize,
  elements.words,
  elements.level,
  elements.solution
].forEach((input) => input.addEventListener("input", createDelivery));

elements.generate.addEventListener("click", newDelivery);
elements.generateTop.addEventListener("click", newDelivery);
elements.printTop.addEventListener("click", () => window.print());
elements.guideTop.addEventListener("click", openGuide);
elements.guideClose.addEventListener("click", closeGuide);
elements.guideModal.addEventListener("click", (event) => {
  if (event.target === elements.guideModal) closeGuide();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.guideModal.hidden) closeGuide();
});
elements.checkPlay.addEventListener("click", checkPlay);
elements.resetPlay.addEventListener("click", () => {
  renderPlay(currentPuzzle);
  elements.scoreLine.textContent = "Neu gestartet. Jetzt bist du dran.";
});

createDelivery();

function newDelivery() {
  deliverySeed += 1;
  createDelivery();
  elements.scoreLine.textContent = "Neue Lieferung erstellt.";
  document.querySelector(".worksheet-wrap").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openGuide() {
  elements.guideModal.hidden = false;
  elements.guideClose.focus();
}

function closeGuide() {
  elements.guideModal.hidden = true;
  elements.guideTop.focus();
}

function createDelivery() {
  const settings = getSettings();
  document.body.classList.toggle("mode-play", settings.deliveryMode === "play");
  currentPuzzle = buildPuzzle(settings);
  wordSearchSelection = new Set();
  mazeSelection = new Set();
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
  const sourceWords = customWords.length ? customWords : WORDS[elements.theme.value];
  const words = rotateWords(sourceWords, deliverySeed).slice(0, count);

  return {
    deliveryMode: elements.deliveryMode.value,
    type: elements.type.value,
    theme: elements.theme.value,
    packSize: Number(elements.packSize.value),
    level: elements.level.value,
    seed: deliverySeed,
    words,
    showSolution: elements.solution.checked
  };
}

function buildPuzzle(settings) {
  if (settings.type === "code") return buildCode(settings);
  if (settings.type === "wordsearch") return buildWordSearch(settings);
  if (settings.type === "math") return buildMath(settings);
  if (settings.type === "logic") return buildLogic(settings);
  if (settings.type === "scramble") return buildScramble(settings);
  if (settings.type === "syllables") return buildSyllables(settings);
  if (settings.type === "sequence") return buildSequence(settings);
  if (settings.type === "sudoku") return buildSudoku(settings);
  if (settings.type === "maze") return buildMaze(settings);
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
    const horizontal = (index + settings.seed) % 2 === 0;
    const start = horizontal
      ? { row: (index * 2 + settings.seed) % 10, col: Math.max(0, 9 - word.length - (settings.seed % 2)) }
      : { row: Math.max(0, 9 - word.length - (settings.seed % 2)), col: (index * 3 + settings.seed) % 10 };

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
  const seedOffset = settings.seed % 5;
  const base = (settings.level === "knifflig" ? 14 : settings.level === "leicht" ? 8 : 11) + seedOffset;
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
  const order = settings.seed % 2 === 0 ? [items[1], items[0], items[2]] : [items[2], items[1], items[0]];

  return {
    ...basePuzzle(settings),
    items,
    order,
    clues: logicClues(order)
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

function buildScramble(settings) {
  return {
    ...basePuzzle(settings),
    rows: settings.words.slice(0, 7).map((word, index) => ({
      prompt: shuffleWord(normalizeAnswer(word), index + settings.seed),
      answer: normalizeAnswer(word)
    }))
  };
}

function buildSyllables(settings) {
  const rows = settings.words.slice(0, 5).map((word) => ({
    parts: splitWord(word),
    answer: normalizeAnswer(word)
  }));
  const bank = rotateWords(rows.flatMap((row) => row.parts), settings.seed).sort((a, b) => {
    const left = (a.length + settings.seed) % 3;
    const right = (b.length + settings.seed) % 3;
    return left - right || a.localeCompare(b);
  });

  return {
    ...basePuzzle(settings),
    rows,
    bank
  };
}

function buildSequence(settings) {
  const start = (settings.level === "knifflig" ? 4 : settings.level === "leicht" ? 2 : 3) + (settings.seed % 4);
  const steps = rotateWords(settings.level === "knifflig" ? [4, 6, 8, 10] : settings.level === "leicht" ? [2, 3, 4, 5] : [3, 5, 7, 9], settings.seed);
  const rows = steps.map((step, index) => {
    const values = Array.from({ length: 5 }, (_, spot) => start + index + step * spot);
    const blankIndex = (index + settings.seed + 2) % values.length;
    return {
      values,
      blankIndex,
      answer: String(values[blankIndex])
    };
  });

  return {
    ...basePuzzle(settings),
    rows
  };
}

function buildSudoku(settings) {
  const shift = ((settings.theme === "eis" ? 1 : settings.theme === "natur" ? 2 : settings.theme === "abenteuer" ? 3 : 0) + settings.seed) % 4;
  const solution = Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: 4 }, (_, col) => ((row * 2 + Math.floor(row / 2) + col + shift) % 4) + 1)
  );
  const givens = settings.level === "leicht"
    ? new Set(["0-0", "0-2", "1-1", "1-3", "2-0", "2-2", "3-1", "3-3"])
    : settings.level === "knifflig"
      ? new Set(["0-1", "1-2", "2-0", "3-3"])
      : new Set(["0-0", "0-3", "1-1", "2-2", "3-0", "3-3"]);

  return {
    ...basePuzzle(settings),
    solution,
    givens
  };
}

function buildMaze(settings) {
  const size = settings.level === "knifflig" ? 8 : 7;
  const middle = Math.max(2, Math.floor(size / 2) - (settings.seed % 2));
  const path = [];
  for (let col = 0; col < size; col += 1) path.push(`0-${col}`);
  for (let row = 1; row < size; row += 1) path.push(`${row}-${size - 1}`);
  for (let col = size - 2; col >= middle; col -= 1) path.push(`${size - 1}-${col}`);
  for (let row = size - 2; row >= 2; row -= 1) path.push(`${row}-${middle}`);
  for (let col = middle - 1; col >= 0; col -= 1) path.push(`2-${col}`);
  for (let row = 3; row < size; row += 1) path.push(`${row}-0`);
  const pathSet = new Set(path);
  const blocked = new Set();

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const id = `${row}-${col}`;
      if (!pathSet.has(id) && (row + col + settings.theme.length + settings.seed) % 3 === 0) blocked.add(id);
    }
  }

  return {
    ...basePuzzle(settings),
    size,
    path,
    pathSet,
    blocked,
    start: path[0],
    end: path[path.length - 1]
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
      <span>Variante ${settings.seed % 1000}</span>
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

  if (puzzle.type === "scramble") {
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

  if (puzzle.type === "syllables") {
    return `
      <section class="task-box">
        <p><strong>Silbenbank:</strong></p>
        <div class="word-pills">${puzzle.bank.map((part) => `<span>${escapeHtml(part)}</span>`).join("")}</div>
        ${puzzle.rows.map((row, index) => `
          <div class="task-row">
            <p><strong>Wort ${index + 1}:</strong> ${row.parts.map(() => "__").join(" + ")}</p>
            <div class="answer-line"></div>
          </div>
        `).join("")}
      </section>
    `;
  }

  if (puzzle.type === "sequence") {
    return `
      <section class="task-box">
        ${puzzle.rows.map((row, index) => `
          <div class="sequence-row">
            <strong>Reihe ${index + 1}</strong>
            <div class="sequence-cells">
              ${row.values.map((value, spot) => `<span>${spot === row.blankIndex ? "?" : value}</span>`).join("")}
            </div>
          </div>
        `).join("")}
      </section>
    `;
  }

  if (puzzle.type === "sudoku") {
    return `
      <section class="task-box">
        <div class="sudoku-grid">
          ${puzzle.solution.flatMap((row, rowIndex) => row.map((value, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            return `<span class="${puzzle.givens.has(key) ? "is-given" : ""}">${puzzle.givens.has(key) ? value : ""}</span>`;
          })).join("")}
        </div>
      </section>
    `;
  }

  if (puzzle.type === "maze") {
    return `
      <section class="task-box">
        <div class="maze-grid" style="--maze-size: ${puzzle.size}">
          ${renderMazeCells(puzzle, false)}
        </div>
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
  if (puzzle.type === "scramble") text = puzzle.rows.map((row) => row.answer).join(", ");
  if (puzzle.type === "syllables") text = puzzle.rows.map((row) => row.answer).join(", ");
  if (puzzle.type === "sequence") text = puzzle.rows.map((row) => row.answer).join(", ");
  if (puzzle.type === "sudoku") text = puzzle.solution.map((row) => row.join(" ")).join(" / ");
  if (puzzle.type === "maze") text = "Weg: Start oben links, Ziel unten links.";

  return `<section class="task-box"><strong>L\u00f6sung:</strong> ${escapeHtml(text)}</section>`;
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

  if (puzzle.type === "scramble") {
    elements.playArea.innerHTML = puzzle.rows.map((row, index) => `
      <label class="play-card" data-answer="${escapeHtml(row.answer)}">
        <strong>${index + 1}. ${escapeHtml(row.prompt)}</strong>
        <input type="text" autocomplete="off" placeholder="Sommerwort">
      </label>
    `).join("");
    return;
  }

  if (puzzle.type === "syllables") {
    elements.playArea.innerHTML = `
      <div class="play-card">
        <strong>Silbenbank</strong>
        <div class="word-pills">${puzzle.bank.map((part) => `<span>${escapeHtml(part)}</span>`).join("")}</div>
      </div>
      ${puzzle.rows.map((row, index) => `
        <label class="play-card" data-answer="${escapeHtml(row.answer)}">
          <strong>Wort ${index + 1}</strong>
          <input type="text" autocomplete="off" placeholder="Zusammengesetztes Wort">
        </label>
      `).join("")}
    `;
    return;
  }

  if (puzzle.type === "sequence") {
    elements.playArea.innerHTML = puzzle.rows.map((row, index) => `
      <label class="play-card" data-answer="${escapeHtml(row.answer)}">
        <strong>Reihe ${index + 1}: ${row.values.map((value, spot) => spot === row.blankIndex ? "?" : value).join(" - ")}</strong>
        <input type="number" inputmode="numeric" placeholder="Fehlende Zahl">
      </label>
    `).join("");
    return;
  }

  if (puzzle.type === "sudoku") {
    elements.playArea.innerHTML = `
      <div class="play-card">
        <strong>F\u00fclle die leeren Felder.</strong>
        <div class="sudoku-grid">
          ${puzzle.solution.flatMap((row, rowIndex) => row.map((value, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            if (puzzle.givens.has(key)) return `<span class="is-given">${value}</span>`;
            return `<input type="number" min="1" max="4" inputmode="numeric" data-answer="${value}" aria-label="Sudoku Feld ${rowIndex + 1}-${colIndex + 1}">`;
          })).join("")}
        </div>
      </div>
    `;
    return;
  }

  if (puzzle.type === "maze") {
    elements.playArea.innerHTML = `
      <div class="play-card">
        <strong>Tippe deinen Weg vom Start zum Ziel.</strong>
        <div class="maze-grid" style="--maze-size: ${puzzle.size}">
          ${renderMazeCells(puzzle, true)}
        </div>
      </div>
    `;
    elements.playArea.querySelectorAll("[data-maze-cell]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.mazeCell;
        if (button.classList.contains("is-wall")) return;
        if (mazeSelection.has(id)) {
          mazeSelection.delete(id);
          button.classList.remove("is-selected");
        } else {
          mazeSelection.add(id);
          button.classList.add("is-selected");
        }
      });
    });
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

  if (currentPuzzle.type === "sudoku") {
    const inputs = [...elements.playArea.querySelectorAll(".sudoku-grid input[data-answer]")];
    let correct = 0;
    inputs.forEach((input) => {
      const good = input.value.trim() === input.dataset.answer;
      input.classList.toggle("is-good", good);
      input.classList.toggle("is-bad", Boolean(input.value.trim()) && !good);
      if (good) correct += 1;
    });
    elements.scoreLine.textContent = `${correct} von ${inputs.length} Sudoku-Feldern richtig.`;
    return;
  }

  if (currentPuzzle.type === "maze") {
    const needed = currentPuzzle.path.filter((id) => id !== currentPuzzle.start && id !== currentPuzzle.end);
    const correct = needed.filter((id) => mazeSelection.has(id)).length;
    const wrong = [...mazeSelection].filter((id) => !currentPuzzle.pathSet.has(id)).length;
    elements.scoreLine.textContent = wrong
      ? `${correct} richtige Wegfelder, aber ${wrong} Abzweigung${wrong === 1 ? "" : "en"} daneben.`
      : `${correct} von ${needed.length} Wegfeldern markiert.`;
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

function renderMazeCells(puzzle, interactive) {
  return Array.from({ length: puzzle.size }, (_, row) =>
    Array.from({ length: puzzle.size }, (_, col) => {
      const id = `${row}-${col}`;
      const classes = [
        "maze-cell",
        puzzle.blocked.has(id) ? "is-wall" : "",
        id === puzzle.start ? "is-start" : "",
        id === puzzle.end ? "is-end" : "",
        puzzle.pathSet.has(id) && !puzzle.blocked.has(id) ? "is-path-hint" : ""
      ].filter(Boolean).join(" ");
      const label = id === puzzle.start ? "S" : id === puzzle.end ? "Z" : "";

      if (!interactive) return `<span class="${classes}">${label}</span>`;
      return `<button type="button" class="${classes}" data-maze-cell="${id}" aria-label="Labyrinth Feld ${row + 1}-${col + 1}">${label}</button>`;
    }).join("")
  ).join("");
}

function logicClues(order) {
  return [
    `${order[0]} liegt zuerst.`,
    `${order[1]} liegt direkt nach ${order[0]}.`,
    `${order[2]} liegt als Letztes.`
  ];
}

function rotateWords(items, seed) {
  if (!items.length) return items;
  const offset = seed % items.length;
  const rotated = [...items.slice(offset), ...items.slice(0, offset)];
  return seed % 2 === 0 ? rotated : rotated.reverse();
}

function shuffleWord(word, seed) {
  const letters = word.split("");
  if (letters.length < 4) return letters.reverse().join("");
  for (let index = 0; index < letters.length; index += 1) {
    const swap = (index * 2 + seed + 1) % letters.length;
    [letters[index], letters[swap]] = [letters[swap], letters[index]];
  }
  const shuffled = letters.join("");
  return shuffled === word ? letters.reverse().join("") : shuffled;
}

function splitWord(word) {
  const clean = normalizeAnswer(word);
  if (clean.length <= 4) return [clean.slice(0, 2), clean.slice(2)].filter(Boolean);
  const first = Math.ceil(clean.length / 3);
  const second = first + Math.ceil((clean.length - first) / 2);
  return [clean.slice(0, first), clean.slice(first, second), clean.slice(second)].filter(Boolean);
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
    .replaceAll("\u00c4", "AE")
    .replaceAll("\u00d6", "OE")
    .replaceAll("\u00dc", "UE")
    .replaceAll("\u00df", "SS")
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
