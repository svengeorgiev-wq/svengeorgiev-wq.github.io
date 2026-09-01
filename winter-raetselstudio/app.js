"use strict";

const STORAGE_KEY = "winter-raetselstudio-v1";
const SAVE_PREFIX = "WINTER1.";

const missions = [
  {
    title: "Die richtige Spur",
    short: "Spuren vergleichen",
    level: "Aufwärmen",
    intro: "Untersuche den Fundort und wähle die passende Spur.",
    clue: "Die Spur beginnt am Holzstapel. Sie zeigt breite Sohlen mit einem eckigen Profil. Krallen, Pfotenballen oder schmale Kufen sind nicht zu sehen.",
    kind: "radio",
    choices: ["Tierspur", "Stiefelspur", "Skispur"],
    answer: "Stiefelspur",
    hint: "Achte besonders auf die Wörter „breite Sohlen“ und „eckiges Profil“.",
    letter: "W",
    art: "assets/spurensuche.webp"
  },
  {
    title: "Der Frostcode",
    short: "Zahlencode knacken",
    level: "Leicht",
    intro: "Die Winterkarte wurde mit Zahlen verschlüsselt.",
    clue: "Jede Zahl steht für einen Buchstaben: A = 1, B = 2, C = 3 … Z = 26.",
    kind: "text",
    prompt: "11 – 1 – 18 – 20 – 5",
    label: "Welches Wort ist verschlüsselt?",
    answer: "KARTE",
    hint: "Die ersten beiden Zahlen ergeben K und A.",
    letter: "I",
    art: "assets/kartenmission.webp"
  },
  {
    title: "Buchstaben im Schneesturm",
    short: "Winterwort ordnen",
    level: "Leicht",
    intro: "Der Wind hat die Buchstaben eines wichtigen Gegenstands durcheinandergewirbelt.",
    clue: "Ordne alle sieben Buchstaben zu einem Wort. Der Gegenstand hilft den Detektiven bei der Orientierung.",
    kind: "text",
    prompt: "S · A · P · M · O · S · K",
    label: "Gesuchter Gegenstand",
    answer: "KOMPASS",
    hint: "Das Wort beginnt mit K und endet mit zwei gleichen Buchstaben.",
    letter: "N",
    art: "assets/raetselwerkstatt.webp"
  },
  {
    title: "Die Temperaturspur",
    short: "Zahlenfolge ergänzen",
    level: "Mittel",
    intro: "Nur die richtige nächste Temperatur zeigt den Weg zur Hütte.",
    clue: "Finde die gleichbleibende Veränderung zwischen den Zahlen und ergänze den nächsten Wert.",
    kind: "number",
    prompt: "−8 °C · −5 °C · −2 °C · 1 °C · ?",
    label: "Nächste Temperatur in °C",
    answer: "4",
    hint: "Von einer Zahl zur nächsten wird es immer um 3 Grad wärmer.",
    letter: "T",
    art: "assets/kartenmission.webp"
  },
  {
    title: "Rucksack-Check",
    short: "Ausrüstung auswählen",
    level: "Mittel",
    intro: "Für die Dämmerung am verschneiten Waldrand passen genau vier Dinge in den Rucksack.",
    clue: "Wähle alles, was bei Kälte, Dunkelheit und Orientierung wirklich hilft. Genau vier Antworten sind richtig.",
    kind: "checkbox",
    choices: ["Mütze", "Strandball", "Thermosflasche", "Karte", "Flossen", "Taschenlampe", "Hängematte"],
    answer: ["Mütze", "Thermosflasche", "Karte", "Taschenlampe"],
    hint: "Streiche zuerst alles, was eindeutig zu Strand oder Sommerlager gehört.",
    letter: "E",
    art: "assets/winterdetektive.webp?v=2"
  },
  {
    title: "Das Winterfinale",
    short: "Fundwort entschlüsseln",
    level: "Knifflig",
    intro: "Fünf Fundbuchstaben liegen bereit. Ordne sie und ergänze den fehlenden letzten Buchstaben.",
    clue: "Die gesuchte Lösung ist die Jahreszeit, in der euer Fall spielt.",
    kind: "final",
    prompt: "T · E · W · I · N + ?",
    label: "Das vollständige Lösungswort",
    answer: "WINTER",
    hint: "Das Buch und die verschneite Landschaft verraten das Lösungswort.",
    letter: "R",
    art: "assets/spurensuche.webp"
  }
];

const defaultState = () => ({
  completed: missions.map(() => false),
  attempts: missions.map(() => 0),
  current: 0,
  name: ""
});

let state = loadState();
let deferredInstallPrompt = null;

const elements = {
  startButton: document.querySelector("#startButton"),
  bonusPrintButton: document.querySelector("#bonusPrintButton"),
  installButton: document.querySelector("#installButton"),
  saveButton: document.querySelector("#saveButton"),
  trailStops: document.querySelector("#trailStops"),
  missionStage: document.querySelector("#missionStage"),
  missionArt: document.querySelector("#missionArt"),
  missionKicker: document.querySelector("#missionKicker"),
  missionTitle: document.querySelector("#missionTitle"),
  missionIntro: document.querySelector("#missionIntro"),
  puzzleArea: document.querySelector("#puzzleArea"),
  feedback: document.querySelector("#feedback"),
  hintButton: document.querySelector("#hintButton"),
  checkButton: document.querySelector("#checkButton"),
  progressText: document.querySelector("#progressText"),
  progressBar: document.querySelector("#progressBar"),
  progressTrack: document.querySelector(".progress-track"),
  letterRow: document.querySelector("#letterRow"),
  notebookMessage: document.querySelector("#notebookMessage"),
  continueButton: document.querySelector("#continueButton"),
  certificate: document.querySelector("#certificate"),
  detectiveName: document.querySelector("#detectiveName"),
  printButton: document.querySelector("#printButton"),
  saveDialog: document.querySelector("#saveDialog"),
  saveCode: document.querySelector("#saveCode"),
  copySaveButton: document.querySelector("#copySaveButton"),
  importSaveButton: document.querySelector("#importSaveButton"),
  resetButton: document.querySelector("#resetButton"),
  dialogStatus: document.querySelector("#dialogStatus")
};

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLocaleUpperCase("de-DE")
    .replace(/Ä/g, "AE")
    .replace(/Ö/g, "OE")
    .replace(/Ü/g, "UE")
    .replace(/ß/g, "SS")
    .replace(/[^A-Z0-9-]/g, "");
}

function sanitizeState(candidate) {
  const clean = defaultState();
  if (!candidate || typeof candidate !== "object") return clean;
  if (Array.isArray(candidate.completed) && candidate.completed.length === missions.length) {
    clean.completed = candidate.completed.map(Boolean);
  }
  if (Array.isArray(candidate.attempts) && candidate.attempts.length === missions.length) {
    clean.attempts = candidate.attempts.map((value) => Math.max(0, Math.min(999, Number(value) || 0)));
  }
  const requestedCurrent = Number(candidate.current);
  clean.current = Number.isInteger(requestedCurrent) ? Math.max(0, Math.min(missions.length - 1, requestedCurrent)) : 0;
  clean.name = typeof candidate.name === "string" ? candidate.name.slice(0, 40) : "";

  // A later mission can never be complete when an earlier required mission is missing.
  let gapFound = false;
  clean.completed = clean.completed.map((complete) => {
    if (gapFound) return false;
    if (!complete) gapFound = true;
    return complete;
  });
  const firstGap = clean.completed.findIndex((complete) => !complete);
  clean.current = Math.min(clean.current, firstGap === -1 ? missions.length - 1 : firstGap);
  return clean;
}

function loadState() {
  try {
    return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function firstOpenMission() {
  const index = state?.completed?.findIndex((complete) => !complete) ?? 0;
  return index === -1 ? missions.length - 1 : index;
}

function missionUnlocked(index) {
  return index === 0 || state.completed.slice(0, index).every(Boolean);
}

function completedCount() {
  return state.completed.filter(Boolean).length;
}

function renderTrail() {
  elements.trailStops.replaceChildren();
  missions.forEach((mission, index) => {
    const item = document.createElement("li");
    const complete = state.completed[index];
    const unlocked = missionUnlocked(index);
    item.className = `trail-stop${complete ? " is-complete" : ""}${state.current === index ? " is-current" : ""}${!unlocked ? " is-locked" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "trail-stop__button";
    button.disabled = !unlocked;
    button.setAttribute("aria-label", `Spur ${index + 1}: ${mission.title}. ${complete ? "Gelöst" : unlocked ? "Offen" : "Gesperrt"}`);
    button.innerHTML = `
      <span class="trail-stop__number">${complete ? "✓" : index + 1}</span>
      <span class="trail-stop__text"><strong>${mission.title}</strong><small>${mission.short}</small></span>
      <span class="trail-stop__state">${complete ? "gelöst" : unlocked ? "offen" : "gesperrt"}</span>
    `;
    button.addEventListener("click", () => selectMission(index, true));
    item.append(button);
    elements.trailStops.append(item);
  });
}

function renderMission() {
  const mission = missions[state.current];
  elements.missionKicker.textContent = `Spur ${state.current + 1} · ${mission.level}`;
  elements.missionTitle.textContent = mission.title;
  elements.missionIntro.textContent = mission.intro;
  elements.missionArt.src = mission.art;
  elements.feedback.textContent = "";
  elements.feedback.className = "case-paper__feedback";
  elements.puzzleArea.replaceChildren();
  elements.puzzleArea.append(makeParagraph(mission.clue, "clue-note"));

  if (mission.prompt) {
    elements.puzzleArea.append(makeParagraph(mission.prompt, mission.kind === "number" ? "sequence-line" : "code-line"));
  }

  if (mission.kind === "radio" || mission.kind === "checkbox") {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "choice-list";
    fieldset.setAttribute("aria-label", mission.kind === "radio" ? "Wähle eine Antwort" : "Wähle vier Antworten");
    fieldset.style.border = "0";
    fieldset.style.padding = "0";
    fieldset.style.margin = "0";
    mission.choices.forEach((choice, choiceIndex) => {
      const label = document.createElement("label");
      label.className = "choice-option";
      const input = document.createElement("input");
      input.type = mission.kind;
      input.name = "mission-answer";
      input.value = choice;
      input.id = `choice-${state.current}-${choiceIndex}`;
      const text = document.createElement("span");
      text.textContent = choice;
      label.append(input, text);
      fieldset.append(label);
    });
    elements.puzzleArea.append(fieldset);
  } else {
    const label = document.createElement("label");
    label.className = "answer-label";
    label.htmlFor = "missionAnswer";
    label.textContent = mission.label;
    const input = document.createElement("input");
    input.className = "text-answer";
    input.id = "missionAnswer";
    input.type = mission.kind === "number" ? "number" : "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.inputMode = mission.kind === "number" ? "numeric" : "text";
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") checkCurrentAnswer();
    });
    elements.puzzleArea.append(label, input);
  }

  const solved = state.completed[state.current];
  document.querySelector(".case-paper").classList.toggle("is-solved", solved);
  elements.checkButton.textContent = solved ? nextButtonLabel() : "Antwort prüfen";
  elements.hintButton.textContent = "Hinweis ansehen";
  if (solved) showFeedback(`Diese Spur ist bereits gelöst. Dein Fundbuchstabe: ${mission.letter}.`, "success");
}

function makeParagraph(text, className) {
  const paragraph = document.createElement("p");
  paragraph.className = className;
  paragraph.textContent = text;
  return paragraph;
}

function selectMission(index, scroll) {
  if (!missionUnlocked(index)) return;
  state.current = index;
  saveState();
  renderAll();
  if (scroll) elements.missionStage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function collectAnswer(mission) {
  if (mission.kind === "radio") {
    return document.querySelector('input[name="mission-answer"]:checked')?.value || "";
  }
  if (mission.kind === "checkbox") {
    return [...document.querySelectorAll('input[name="mission-answer"]:checked')].map((input) => input.value);
  }
  return document.querySelector("#missionAnswer")?.value || "";
}

function answerIsCorrect(mission, answer) {
  if (mission.kind === "checkbox") {
    const expected = [...mission.answer].sort();
    const actual = [...answer].sort();
    return expected.length === actual.length && expected.every((value, index) => value === actual[index]);
  }
  return normalizeText(answer) === normalizeText(mission.answer);
}

function checkCurrentAnswer() {
  if (state.completed[state.current]) {
    goToNextMission();
    return;
  }
  const mission = missions[state.current];
  const answer = collectAnswer(mission);
  const empty = Array.isArray(answer) ? answer.length === 0 : !String(answer).trim();
  if (empty) {
    showFeedback("Trage zuerst eine Antwort ein oder wähle eine Möglichkeit aus.", "error");
    return;
  }

  state.attempts[state.current] += 1;
  if (!answerIsCorrect(mission, answer)) {
    saveState();
    showFeedback("Noch nicht ganz. Lies den Auftrag noch einmal und probiere es erneut.", "error");
    return;
  }

  state.completed[state.current] = true;
  saveState();
  renderAll();
  showFeedback(`Richtig! Du hast den Fundbuchstaben ${mission.letter} entdeckt.`, "success");
  document.querySelector(".case-paper").classList.add("is-solved");
  elements.checkButton.textContent = nextButtonLabel();

  if (completedCount() === missions.length) {
    setTimeout(() => elements.certificate.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
  }
}

function nextButtonLabel() {
  return completedCount() === missions.length || state.current === missions.length - 1 ? "Zur Urkunde" : "Nächste Spur";
}

function goToNextMission() {
  if (completedCount() === missions.length) {
    elements.certificate.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const next = state.completed.findIndex((complete) => !complete);
  selectMission(next, true);
}

function showFeedback(message, type) {
  elements.feedback.textContent = message;
  elements.feedback.className = `case-paper__feedback ${type}`;
}

function renderProgress() {
  const count = completedCount();
  elements.progressText.textContent = `${count} von ${missions.length} Spuren gelöst`;
  elements.progressBar.style.width = `${(count / missions.length) * 100}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(count));
  elements.startButton.textContent = count === 0 ? "Ermittlung starten" : count === missions.length ? "Urkunde ansehen" : `Weiter bei Spur ${firstOpenMission() + 1}`;
}

function renderNotebook() {
  elements.letterRow.replaceChildren();
  missions.forEach((mission, index) => {
    const box = document.createElement("span");
    box.className = `letter-box${state.completed[index] ? "" : " empty"}`;
    box.textContent = state.completed[index] ? mission.letter : "?";
    box.setAttribute("aria-label", state.completed[index] ? `Buchstabe ${mission.letter}` : "Noch nicht gefundener Buchstabe");
    elements.letterRow.append(box);
  });
  const count = completedCount();
  if (count === 0) elements.notebookMessage.textContent = "Löse die erste Spur, um den ersten Buchstaben einzutragen.";
  else if (count < missions.length) elements.notebookMessage.textContent = `${count} Fundbuchstaben entdeckt. ${missions.length - count} fehlen noch.`;
  else elements.notebookMessage.textContent = "Fall gelöst: Das Winterwort lautet WINTER. Deine Urkunde ist bereit.";
  elements.continueButton.textContent = count === missions.length ? "Urkunde ansehen" : "Zur nächsten offenen Spur";
}

function renderCertificate() {
  const complete = completedCount() === missions.length;
  elements.certificate.hidden = !complete;
  if (complete) elements.detectiveName.value = state.name;
}

function renderAll() {
  renderTrail();
  renderMission();
  renderProgress();
  renderNotebook();
  renderCertificate();
}

function encodeState() {
  const json = JSON.stringify({ version: 1, ...state });
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return SAVE_PREFIX + btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeState(code) {
  const normalized = code.trim();
  if (!normalized.startsWith(SAVE_PREFIX)) throw new Error("Falsches Codeformat");
  let base64 = normalized.slice(SAVE_PREFIX.length).replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function openSaveDialog() {
  elements.saveCode.value = encodeState();
  elements.dialogStatus.textContent = "";
  elements.saveDialog.showModal();
}

async function copySaveCode() {
  elements.saveCode.value = encodeState();
  elements.saveCode.select();
  try {
    await navigator.clipboard.writeText(elements.saveCode.value);
    elements.dialogStatus.textContent = "Code kopiert.";
  } catch {
    document.execCommand("copy");
    elements.dialogStatus.textContent = "Code markiert. Kopiere ihn mit Strg+C.";
  }
}

function importSaveCode() {
  try {
    const imported = decodeState(elements.saveCode.value);
    state = sanitizeState(imported);
    saveState();
    renderAll();
    elements.saveCode.value = encodeState();
    elements.dialogStatus.textContent = "Spielstand erfolgreich eingelesen.";
  } catch {
    elements.dialogStatus.textContent = "Der Code ist ungültig oder unvollständig.";
  }
}

function resetProgress() {
  if (!window.confirm("Möchtest du wirklich alle sechs Spuren und den Namen löschen?")) return;
  state = defaultState();
  saveState();
  renderAll();
  elements.saveCode.value = encodeState();
  elements.dialogStatus.textContent = "Der Fortschritt wurde zurückgesetzt.";
}

elements.startButton.addEventListener("click", () => {
  if (completedCount() === missions.length) {
    elements.certificate.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    selectMission(firstOpenMission(), true);
  }
});
elements.continueButton.addEventListener("click", goToNextMission);
elements.checkButton.addEventListener("click", checkCurrentAnswer);
elements.hintButton.addEventListener("click", () => showFeedback(`Hinweis: ${missions[state.current].hint}`, "hint"));
elements.saveButton.addEventListener("click", openSaveDialog);
elements.copySaveButton.addEventListener("click", copySaveCode);
elements.importSaveButton.addEventListener("click", importSaveCode);
elements.resetButton.addEventListener("click", resetProgress);
elements.detectiveName.addEventListener("input", (event) => {
  state.name = event.target.value.slice(0, 40);
  saveState();
});
function printSection(mode) {
  document.body.classList.remove("printing-bonus", "printing-certificate");
  document.body.classList.add(mode);
  window.setTimeout(() => window.print(), 50);
}

window.addEventListener("afterprint", () => document.body.classList.remove("printing-bonus", "printing-certificate"));
elements.bonusPrintButton.addEventListener("click", () => printSection("printing-bonus"));
elements.printButton.addEventListener("click", () => printSection("printing-certificate"));

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  elements.installButton.hidden = false;
});
elements.installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  elements.installButton.hidden = true;
});
window.addEventListener("appinstalled", () => {
  elements.installButton.hidden = true;
  deferredInstallPrompt = null;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js?v=3"));
}

renderAll();
