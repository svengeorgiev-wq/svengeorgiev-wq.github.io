const data = {
  strand: ["Sonne", "Muschel", "Welle", "Sandburg", "Palme", "Strand", "Meer", "Seestern"],
  eis: ["Eis", "Waffel", "Ferien", "Limonade", "Sommer", "Kugel", "Sorte", "Pause"],
  natur: ["Biene", "Frosch", "Igel", "Blatt", "Bach", "Wolke", "Nektar", "Spur"],
  abenteuer: ["Karte", "Schatz", "Kompass", "Team", "Ziel", "Start", "Lupe", "Mut"]
};

const icons = {
  strand: "🏝️",
  eis: "🍦",
  natur: "🌿",
  abenteuer: "🧭"
};

const titles = {
  code: "Geheimschrift am Strand",
  wordsearch: "Wortsuche im Ferienfeld",
  math: "Zahlenrätsel mit Eis",
  logic: "Detektiv-Spuren",
  draw: "Meine Sommer-Flagge"
};

const elements = {
  type: document.querySelector("#puzzleType"),
  theme: document.querySelector("#theme"),
  words: document.querySelector("#words"),
  age: document.querySelector("#age"),
  level: document.querySelector("#level"),
  solution: document.querySelector("#solution"),
  worksheet: document.querySelector("#worksheet"),
  title: document.querySelector("#sheetTitle"),
  generate: document.querySelector("#generate"),
  generateTop: document.querySelector("#generateTop"),
  printTop: document.querySelector("#printTop")
};

[
  elements.type,
  elements.theme,
  elements.words,
  elements.age,
  elements.level,
  elements.solution
].forEach((input) => input.addEventListener("input", render));

elements.generate.addEventListener("click", render);
elements.generateTop.addEventListener("click", render);
elements.printTop.addEventListener("click", () => window.print());

render();

function render() {
  const type = elements.type.value;
  const theme = elements.theme.value;
  const words = getWords(theme);
  elements.title.textContent = titles[type];
  elements.worksheet.innerHTML = `
    <header class="sheet-head">
      <div class="sheet-icon">${icons[theme]}</div>
      <div>
        <h3>${titles[type]}</h3>
        <p>${intro(type)}</p>
      </div>
    </header>
    ${body(type, words)}
    ${elements.solution.checked ? solution(type, words) : ""}
  `;
}

function getWords(theme) {
  const custom = elements.words.value
    .split(/[,;\n]/)
    .map((word) => word.trim())
    .filter(Boolean);
  return (custom.length ? custom : data[theme]).slice(0, elements.level.value === "knifflig" ? 8 : 6);
}

function intro(type) {
  return {
    code: "Knacke den Sommer-Code. A = 1, B = 2, C = 3 ...",
    wordsearch: "Finde alle Wörter im bunten Buchstabenfeld.",
    math: "Rechne von Eiskugel zu Eiskugel bis zum Ziel.",
    logic: "Lies die Hinweise und finde die richtige Reihenfolge.",
    draw: "Erfinde eine Flagge für deinen perfekten Ferientag."
  }[type];
}

function body(type, words) {
  if (type === "code") return codePuzzle(words);
  if (type === "wordsearch") return wordSearch(words);
  if (type === "math") return mathPuzzle();
  if (type === "logic") return logicPuzzle(words);
  return drawPuzzle();
}

function codePuzzle(words) {
  return `
    <section class="task-box">
      ${words.slice(0, 5).map((word, index) => `
        <p><strong>${index + 1}.</strong> ${encode(word)}</p>
        <div class="answer-line"></div>
      `).join("")}
    </section>
  `;
}

function wordSearch(words) {
  const letters = words.join("").toUpperCase().replace(/[^A-ZÄÖÜ]/g, "").padEnd(64, "SOMMERFERIEN");
  return `
    <section class="task-box">
      <div class="grid">
        ${letters.slice(0, 64).split("").map((letter) => `<span>${letter}</span>`).join("")}
      </div>
      <div class="word-pills">${words.map((word) => `<span>${escapeHtml(word)}</span>`).join("")}</div>
    </section>
  `;
}

function mathPuzzle() {
  const start = Number(elements.age.value);
  const steps = [start, start + 4, start + 9, start + 3, start + 12, start + 7];
  return `
    <section class="task-box">
      ${steps.map((number, index) => `
        <p><strong>Station ${index + 1}:</strong> ${index === 0 ? `Start bei ${number}` : `${steps[index - 1]} ${number > steps[index - 1] ? "+" : "-"} ${Math.abs(number - steps[index - 1])} =`}</p>
        <div class="answer-line"></div>
      `).join("")}
    </section>
  `;
}

function logicPuzzle(words) {
  const items = words.slice(0, 3);
  return `
    <section class="task-box">
      <p>Drei Dinge wurden am Strand gefunden: <strong>${items.join(", ")}</strong>.</p>
      <p>1. ${items[1]} lag nicht zuerst.</p>
      <p>2. ${items[0]} lag direkt vor ${items[2]}.</p>
      <p>3. ${items[2]} lag als Letztes.</p>
      <div class="answer-line"></div>
      <div class="answer-line"></div>
      <div class="answer-line"></div>
    </section>
  `;
}

function drawPuzzle() {
  return `
    <section class="task-box">
      <p>Baue ein: Sonne, Symbol, Muster und deinen Namen.</p>
      <div style="min-height: 300px; border: 3px dashed rgba(56,33,13,.34); border-radius: 8px; background: rgba(255,255,255,.46);"></div>
      <p>Mein Motto:</p>
      <div class="answer-line"></div>
    </section>
  `;
}

function solution(type, words) {
  const text = type === "code"
    ? words.slice(0, 5).join(", ")
    : type === "logic"
      ? words.slice(0, 3).join(" → ")
      : "Freie Kontrolle durch Kind oder Eltern";
  return `<section class="task-box"><strong>Lösung:</strong> ${escapeHtml(text)}</section>`;
}

function encode(word) {
  return word
    .toUpperCase()
    .replaceAll("Ä", "AE")
    .replaceAll("Ö", "OE")
    .replaceAll("Ü", "UE")
    .split("")
    .filter((letter) => /[A-Z]/.test(letter))
    .map((letter) => letter.charCodeAt(0) - 64)
    .join("-");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
