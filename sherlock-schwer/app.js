(function () {
  "use strict";

  const STORAGE_KEY = "sherlock-schwer-v3";
  const LEGACY_STORAGE_KEYS = ["sherlock-schwer-v2", "sherlock-schwer-v1"];
  const BACKUP_PREFIX = "SHERLOCK-SCHWER-3:";
  const LEGACY_BACKUP_PREFIX = "SHERLOCK-SCHWER-2:";
  const ROUTES = ["start", "book", "bonus", "install"];
  const Engine = window.SherlockEngine;
  const Puzzles = Engine.puzzles;

  const BOOK_CASES = [
    { id: 1, title: "Die Spur im Frost", task: "S. 6–7", solution: "S. 81–83" },
    { id: 2, title: "Tod zwischen Tannenzapfen", task: "S. 9–10", solution: "S. 84–86" },
    { id: 3, title: "Der rote Schal im Schnee", task: "S. 12–13", solution: "S. 87–89" },
    { id: 4, title: "Die Stimme aus dem Eiskeller", task: "S. 15–16", solution: "S. 90–93" },
    { id: 5, title: "Geheimnis des Winterabends", task: "S. 18–19", solution: "S. 94–96" },
    { id: 6, title: "Der Tote unter dem Stern", task: "S. 21–22", solution: "S. 97–100" },
    { id: 7, title: "Das dunkle Lied des Chors", task: "S. 24–26", solution: "S. 101–104" },
    { id: 8, title: "Schatten hinter dem Fenster", task: "S. 28–30", solution: "S. 105–108" },
    { id: 9, title: "Der verschwundene Engel aus Glas", task: "S. 32–34", solution: "S. 109–113" },
    { id: 10, title: "Blut auf weißem Schnee", task: "S. 36–38", solution: "S. 114–116" },
    { id: 11, title: "Die tödliche Mitternachtsmesse", task: "S. 40–42", solution: "S. 117–120" },
    { id: 12, title: "Geheimnis im Lebkuchenhaus", task: "S. 44–45", solution: "S. 121–124" },
    { id: 13, title: "Der Krug mit dem heißen Punsch", task: "S. 47–49", solution: "S. 125–128" },
    { id: 14, title: "Flüstern im Wintersturm", task: "S. 51–53", solution: "S. 129–132" },
    { id: 15, title: "Der falsche Nikolaus", task: "S. 55–57", solution: "S. 133–135" },
    { id: 16, title: "Die letzte Laterne am Fluss", task: "S. 59–61", solution: "S. 136–138" },
    { id: 17, title: "Das verschlossene Schneedorf", task: "S. 63–65", solution: "S. 139–142" },
    { id: 18, title: "Der verschwundene Sack Geschenke", task: "S. 67–69", solution: "S. 143–145" },
    { id: 19, title: "Stille im Glockenturm", task: "S. 71–73", solution: "S. 146–148" },
    { id: 20, title: "Der Mord im Schlittenzug", task: "S. 75–76", solution: "S. 149–151" }
  ];

  function freshBonusState(seed = {}) {
    return {
      notes: typeof seed.notes === "string" ? seed.notes.slice(0, 5000) : "",
      levelAnswers: seed.levelAnswers && typeof seed.levelAnswers === "object" ? seed.levelAnswers : {},
      levelResults: seed.levelResults && typeof seed.levelResults === "object" ? seed.levelResults : {},
      unlockedLevel: 1,
      bonusComplete: false,
      solutionVisible: false
    };
  }

  function normalizeBonusState(puzzle, candidate = {}) {
    const normalized = freshBonusState(candidate);
    const solvedInOrder = puzzle.levels.reduce((count, level) => {
      if (count === level.number - 1 && normalized.levelResults[level.number] === "correct" && Engine.isCorrect(puzzle.id, level.number, normalized.levelAnswers[level.number])) return count + 1;
      return count;
    }, 0);
    normalized.unlockedLevel = Math.min(puzzle.levels.length, solvedInOrder + 1);
    normalized.bonusComplete = solvedInOrder === puzzle.levels.length;
    normalized.solutionVisible = normalized.bonusComplete && candidate?.solutionVisible !== false;
    return normalized;
  }

  function freshState(seed = {}) {
    return {
      version: 3,
      route: ROUTES.includes(seed.route) ? seed.route : "start",
      completed: Array.isArray(seed.completed) ? seed.completed : [],
      bookFilter: ["all", "open", "done"].includes(seed.bookFilter) ? seed.bookFilter : "all",
      activePuzzleId: Puzzles.some((puzzle) => puzzle.id === seed.activePuzzleId) ? seed.activePuzzleId : Puzzles[0].id,
      bonusById: Object.fromEntries(Puzzles.map((puzzle) => [puzzle.id, freshBonusState()]))
    };
  }

  function normalizeState(candidate) {
    const normalized = freshState(candidate || {});
    normalized.completed = [...new Set((candidate?.completed || []).filter((id) => Number.isInteger(id) && id >= 1 && id <= 20))].sort((a, b) => a - b);
    const legacyFirstPuzzle = candidate && !candidate.bonusById ? {
      notes: candidate.notes,
      levelAnswers: candidate.levelAnswers,
      levelResults: candidate.levelResults,
      solutionVisible: candidate.solutionVisible
    } : null;
    Puzzles.forEach((puzzle, index) => {
      const source = candidate?.bonusById?.[puzzle.id] || (index === 0 ? legacyFirstPuzzle : null) || {};
      normalized.bonusById[puzzle.id] = normalizeBonusState(puzzle, source);
    });
    return normalized;
  }

  function loadState() {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) return normalizeState(JSON.parse(current));
      for (const key of LEGACY_STORAGE_KEYS) {
        const legacy = localStorage.getItem(key);
        if (legacy) return normalizeState(JSON.parse(legacy));
      }
    } catch (error) {
      console.warn("Gespeicherter Fortschritt konnte nicht geladen werden.", error);
    }
    return freshState();
  }

  let state = loadState();
  let deferredInstallPrompt = null;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function activePuzzle() {
    return Engine.getPuzzle(state.activePuzzleId);
  }

  function activeBonusState() {
    return state.bonusById[state.activePuzzleId];
  }

  function nextOpenCase() {
    return BOOK_CASES.find((entry) => !state.completed.includes(entry.id)) || null;
  }

  function updateBookProgress() {
    const count = state.completed.length;
    const percent = Math.round((count / BOOK_CASES.length) * 100);
    const next = nextOpenCase();
    $("#progress-count").textContent = String(count);
    $("#progress-percent").textContent = `${percent}%`;
    $(".progress-ring").style.setProperty("--progress", `${percent}%`);
    $("#progress-bar").style.width = `${percent}%`;
    $(".progress-track").setAttribute("aria-valuenow", String(count));
    $("#book-summary-count").textContent = `${count} / 20`;
    $("#next-case-copy").textContent = next ? `Als Nächstes: Fall ${next.id} · ${next.title}` : "Alle 20 Fälle abgeschlossen – ausgezeichnet ermittelt.";
    $("#continue-book").textContent = next ? `Mit Fall ${next.id} starten` : "Fallübersicht öffnen";
  }

  function updateBonusSummary() {
    const completed = Puzzles.filter((puzzle) => state.bonusById[puzzle.id].bonusComplete).length;
    $("#bonus-teaser-status").textContent = `${completed} von ${Puzzles.length} Bonusfällen gelöst`;
    $("#bonus-library-status").textContent = completed === Puzzles.length
      ? "Alle fünf Bonusakten sind vollständig gelöst. Jede Akte kann erneut geöffnet oder zurückgesetzt werden."
      : `${completed} von ${Puzzles.length} Akten abgeschlossen. Wähle einen Fall; der Fortschritt wird getrennt gespeichert.`;
  }

  function routeTo(route, updateHash = true) {
    if (!ROUTES.includes(route)) route = "start";
    $$(".view").forEach((view) => {
      const active = view.dataset.view === route;
      view.hidden = !active;
      view.classList.toggle("active", active);
    });
    $$(".nav-item").forEach((button) => {
      const active = button.dataset.route === route;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
    state.route = route;
    saveState();
    if (updateHash && location.hash !== `#${route}`) history.replaceState(null, "", `#${route}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (route === "book") renderBookCases();
    if (route === "bonus") renderBonus();
  }

  function createCaseCard(entry) {
    const done = state.completed.includes(entry.id);
    const article = document.createElement("article");
    article.className = `book-case${done ? " done" : ""}`;
    article.id = `book-case-${entry.id}`;
    const number = document.createElement("span");
    number.className = "case-number";
    number.textContent = done ? "✓" : String(entry.id).padStart(2, "0");
    const copy = document.createElement("div");
    copy.className = "case-copy";
    const title = document.createElement("h2");
    title.textContent = `Fall ${entry.id} · ${entry.title}`;
    const pages = document.createElement("p");
    pages.className = "page-pointers";
    const task = document.createElement("span");
    task.textContent = entry.task;
    const solution = document.createElement("span");
    solution.textContent = entry.solution;
    pages.append(task, solution);
    copy.append(title, pages);
    const toggle = document.createElement("button");
    toggle.className = "case-check";
    toggle.type = "button";
    toggle.setAttribute("aria-pressed", String(done));
    toggle.setAttribute("aria-label", `Fall ${entry.id} als ${done ? "offen" : "gelöst"} markieren`);
    const box = document.createElement("span");
    box.className = "check-box";
    box.setAttribute("aria-hidden", "true");
    box.textContent = "✓";
    toggle.append(box, document.createTextNode(done ? "Gelöst" : "Als gelöst markieren"));
    toggle.addEventListener("click", () => {
      if (done) state.completed = state.completed.filter((id) => id !== entry.id);
      else state.completed = [...new Set([...state.completed, entry.id])].sort((a, b) => a - b);
      saveState();
      updateBookProgress();
      renderBookCases();
    });
    article.append(number, copy, toggle);
    return article;
  }

  function renderBookCases() {
    const list = $("#case-list");
    list.textContent = "";
    const filtered = BOOK_CASES.filter((entry) => {
      const done = state.completed.includes(entry.id);
      return state.bookFilter === "all" || (state.bookFilter === "done" ? done : !done);
    });
    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state panel";
      empty.textContent = state.bookFilter === "done" ? "Noch kein Fall ist als gelöst markiert." : "Keine offenen Fälle – du hast alle 20 Ermittlungen abgeschlossen.";
      list.append(empty);
    } else {
      filtered.forEach((entry) => list.append(createCaseCard(entry)));
    }
    $$(".filter").forEach((button) => {
      const active = button.dataset.filter === state.bookFilter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function createTextBlock(tag, text, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function checkLevel(levelNumber) {
    const puzzle = activePuzzle();
    const bonus = activeBonusState();
    const selected = bonus.levelAnswers[levelNumber];
    if (!selected) {
      bonus.levelResults[levelNumber] = "empty";
      saveState();
      renderBonus();
      return;
    }
    if (!Engine.isCorrect(puzzle.id, levelNumber, selected)) {
      bonus.levelResults[levelNumber] = "wrong";
      saveState();
      renderBonus();
      return;
    }
    bonus.levelResults[levelNumber] = "correct";
    if (levelNumber < puzzle.levels.length) bonus.unlockedLevel = levelNumber + 1;
    else {
      bonus.bonusComplete = true;
      bonus.solutionVisible = true;
    }
    saveState();
    renderBonus();
    requestAnimationFrame(() => {
      const target = levelNumber < puzzle.levels.length ? $(`#level-${levelNumber + 1}`) : $("#solution-panel");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function createLevelCard(level) {
    const puzzle = activePuzzle();
    const bonus = activeBonusState();
    const solved = bonus.levelResults[level.number] === "correct";
    const unlocked = level.number <= bonus.unlockedLevel || solved;
    const article = document.createElement("article");
    article.id = `level-${level.number}`;
    article.className = `panel level-card${solved ? " solved" : unlocked ? " current" : " locked"}`;
    const header = document.createElement("header");
    const headerCopy = document.createElement("div");
    headerCopy.append(createTextBlock("p", `EBENE ${level.number}`, "kicker"), createTextBlock("h2", level.title));
    const badge = createTextBlock("span", solved ? "Gelöst" : unlocked ? "Offen" : "Gesperrt", "level-badge");
    header.append(headerCopy, badge);
    article.append(header);

    if (!unlocked) {
      article.append(createTextBlock("p", `Diese Ebene wird nach der richtigen Antwort zu Ebene ${level.number - 1} freigeschaltet.`, "locked-copy"));
      return article;
    }

    const content = document.createElement("div");
    content.className = "level-content";
    level.paragraphs.forEach((paragraph) => content.append(createTextBlock("p", paragraph)));
    if (level.evidence) {
      const evidence = document.createElement("ul");
      evidence.className = "evidence-list";
      level.evidence.forEach((entry) => evidence.append(createTextBlock("li", entry)));
      content.append(evidence);
    }
    content.append(createTextBlock("p", level.question, "level-question"));

    if (solved) {
      const success = document.createElement("div");
      success.className = "level-feedback success";
      success.textContent = `Richtig – ${level.answer}. ${level.number < puzzle.levels.length ? `Ebene ${level.number + 1} ist freigeschaltet.` : "Damit ist diese Bonusakte vollständig gelöst."}`;
      content.append(success);
    } else {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "choice-list";
      const legend = createTextBlock("legend", "Wähle genau eine Antwort.");
      fieldset.append(legend);
      level.choices.forEach((choice) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `${puzzle.id}-level-${level.number}-answer`;
        input.value = choice.value;
        input.checked = bonus.levelAnswers[level.number] === choice.value;
        input.addEventListener("change", () => {
          bonus.levelAnswers[level.number] = choice.value;
          delete bonus.levelResults[level.number];
          saveState();
        });
        label.append(input, createTextBlock("span", choice.label));
        fieldset.append(label);
      });
      content.append(fieldset);
      const check = createTextBlock("button", `Antwort zu Ebene ${level.number} prüfen`, "button button-primary level-check");
      check.type = "button";
      check.addEventListener("click", () => checkLevel(level.number));
      content.append(check);
      if (bonus.levelResults[level.number] === "empty") content.append(createTextBlock("div", "Bitte wähle zuerst eine Antwort.", "level-feedback try-again"));
      if (bonus.levelResults[level.number] === "wrong") content.append(createTextBlock("div", level.retry || "Diese Antwort widerspricht mindestens einer Angabe. Prüfe deine Ableitung erneut.", "level-feedback try-again"));
    }
    article.append(content);
    return article;
  }

  function renderBonusLibrary() {
    const list = $("#bonus-case-list");
    const cards = Puzzles.map((puzzle, index) => {
      const bonus = state.bonusById[puzzle.id];
      const solved = puzzle.levels.filter((level) => bonus.levelResults[level.number] === "correct").length;
      const active = puzzle.id === state.activePuzzleId;
      const item = document.createElement("article");
      item.className = `bonus-case-item${active ? " active" : ""}${bonus.bonusComplete ? " done" : ""}`;
      item.setAttribute("role", "listitem");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bonus-case-card";
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", `Bonusakte ${index + 1}: ${puzzle.title}. ${solved} von 4 Ebenen gelöst.`);
      const number = createTextBlock("span", String(index + 1).padStart(2, "0"), "bonus-case-number");
      const copy = document.createElement("span");
      copy.className = "bonus-case-copy";
      copy.append(createTextBlock("small", `Akte ${index + 1} · ${puzzle.primaryMechanism}`), createTextBlock("strong", puzzle.title));
      const progress = createTextBlock("span", bonus.bonusComplete ? "Gelöst" : `${solved}/4`, "bonus-case-progress");
      button.append(number, copy, progress);
      button.addEventListener("click", () => {
        state.activePuzzleId = puzzle.id;
        saveState();
        renderBonus();
        requestAnimationFrame(() => $(".puzzle-dossier")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      });
      item.append(button);
      return item;
    });
    list.replaceChildren(...cards);
    updateBonusSummary();
  }

  function renderSolution(puzzle, bonus) {
    const panel = $("#solution-panel");
    panel.hidden = !bonus.solutionVisible;
    if (!bonus.solutionVisible) return;
    const steps = $("#solution-steps");
    steps.textContent = "";
    puzzle.solutionSteps.forEach((step) => {
      const section = document.createElement("section");
      section.className = "solution-step";
      section.append(createTextBlock("h3", step.title.toUpperCase()), createTextBlock("p", step.answer, "solution-answer"), createTextBlock("p", step.explanation));
      steps.append(section);
    });
    $("#solution-bridge").textContent = puzzle.bridge;
    $("#solution-outro").textContent = puzzle.outro;
    $("#verification-note").textContent = puzzle.checkNote;
  }

  function renderBonus() {
    const puzzle = activePuzzle();
    const bonus = activeBonusState();
    renderBonusLibrary();
    $("#bonus-number").textContent = puzzle.id;
    $("#puzzle-title").textContent = puzzle.title;
    $("#puzzle-mechanism").textContent = `Primärmechanik · ${puzzle.primaryMechanism}`;
    $("#puzzle-end-answer").textContent = `Endantwort · ${puzzle.endAnswerType}`;
    $("#bonus-intro").textContent = puzzle.intro;
    $("#bonus-case-intro").textContent = puzzle.introduction;
    $("#detective-notes").value = bonus.notes;
    $("#reset-bonus").setAttribute("aria-label", `${puzzle.title} neu beginnen`);
    const solvedCount = puzzle.levels.filter((level) => bonus.levelResults[level.number] === "correct").length;
    const percent = Math.round((solvedCount / puzzle.levels.length) * 100);
    $("#level-progress-copy").textContent = bonus.bonusComplete ? "4 von 4 Ebenen gelöst" : `Ebene ${bonus.unlockedLevel} von 4`;
    $("#level-progress-status").textContent = bonus.bonusComplete ? "Fall vollständig gelöst" : solvedCount ? "Nächste Spur freigeschaltet" : "Ermittlung begonnen";
    $("#level-progress-bar").style.width = `${percent}%`;
    $(".level-progress .progress-track").setAttribute("aria-valuenow", String(solvedCount));
    $("#level-list").replaceChildren(...puzzle.levels.map(createLevelCard));
    renderSolution(puzzle, bonus);
  }

  function resetBonus() {
    const puzzle = activePuzzle();
    const bonus = activeBonusState();
    const hasProgress = Object.keys(bonus.levelAnswers).length || bonus.notes.trim();
    if (hasProgress && !window.confirm(`„${puzzle.title}“ und alle dazugehörigen Notizen neu beginnen?`)) return;
    state.bonusById[puzzle.id] = freshBonusState();
    saveState();
    renderBonus();
    $("#level-1")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function encodeBackup() {
    const bytes = new TextEncoder().encode(JSON.stringify(state));
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return BACKUP_PREFIX + btoa(binary);
  }

  function decodeBackup(code) {
    const prefix = code.startsWith(BACKUP_PREFIX) ? BACKUP_PREFIX : code.startsWith(LEGACY_BACKUP_PREFIX) ? LEGACY_BACKUP_PREFIX : null;
    if (!prefix) throw new Error("Der Code gehört nicht zur Sherlock-Schwer-App.");
    const binary = atob(code.slice(prefix.length));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (![2, 3].includes(parsed.version) || !Array.isArray(parsed.completed)) throw new Error("Der Sicherungscode ist unvollständig oder ungültig.");
    return normalizeState(parsed);
  }

  async function exportBackup() {
    const code = encodeBackup();
    try {
      await navigator.clipboard.writeText(code);
      $("#backup-status").textContent = "Sicherungscode wurde in die Zwischenablage kopiert.";
    } catch {
      $("#import-panel").hidden = false;
      $("#import-code").value = code;
      $("#import-code").select();
      $("#backup-status").textContent = "Automatisches Kopieren war nicht möglich. Der Code ist markiert und kann manuell kopiert werden.";
    }
  }

  async function triggerInstall() {
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
      $("#install-status").textContent = "Die App ist bereits im eigenständigen App-Modus geöffnet.";
      return;
    }
    if (!deferredInstallPrompt) {
      $("#install-status").textContent = "Nutze die passende Anleitung für iPhone/iPad oder Android. Dein Browser bietet gerade keinen direkten Installationsdialog an.";
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $("#header-install").hidden = true;
  }

  function bindEvents() {
    $$('[data-route]').forEach((control) => control.addEventListener("click", (event) => {
      if (control.tagName === "A") event.preventDefault();
      routeTo(control.dataset.route);
    }));
    $("#continue-book").addEventListener("click", () => {
      const next = nextOpenCase();
      routeTo("book");
      if (next) requestAnimationFrame(() => $("#book-case-" + next.id)?.scrollIntoView({ behavior: "smooth", block: "center" }));
    });
    $$(".filter").forEach((button) => button.addEventListener("click", () => {
      state.bookFilter = button.dataset.filter;
      saveState();
      renderBookCases();
    }));
    $("#jump-next").addEventListener("click", () => {
      const next = nextOpenCase();
      if (!next) return;
      if (state.bookFilter === "done") {
        state.bookFilter = "all";
        renderBookCases();
      }
      requestAnimationFrame(() => $("#book-case-" + next.id)?.scrollIntoView({ behavior: "smooth", block: "center" }));
    });
    $("#detective-notes").addEventListener("input", (event) => {
      activeBonusState().notes = event.target.value.slice(0, 5000);
      saveState();
    });
    $("#reset-bonus").addEventListener("click", resetBonus);
    $("#header-install").addEventListener("click", triggerInstall);
    $("#install-action").addEventListener("click", triggerInstall);
    $("#export-data").addEventListener("click", exportBackup);
    $("#import-toggle").addEventListener("click", () => { $("#import-panel").hidden = !$("#import-panel").hidden; });
    $("#import-data").addEventListener("click", () => {
      try {
        state = decodeBackup($("#import-code").value.trim());
        saveState();
        updateBookProgress();
        renderBookCases();
        renderBonus();
        $("#backup-status").textContent = "Sicherung wurde erfolgreich eingelesen.";
      } catch (error) {
        $("#backup-status").textContent = error.message;
      }
    });
    $("#reset-data").addEventListener("click", () => {
      if (!window.confirm("Wirklich alle lokalen Fortschritte, Notizen und Bonusantworten löschen?")) return;
      localStorage.removeItem(STORAGE_KEY);
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      location.reload();
    });
    window.addEventListener("hashchange", () => routeTo(location.hash.slice(1), false));
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $("#header-install").hidden = false;
      $("#install-status").textContent = "Dein Browser unterstützt die direkte Installation.";
      $("#install-action").textContent = "App jetzt installieren";
    });
    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      $("#header-install").hidden = true;
      $("#install-status").textContent = "Installation abgeschlossen. Die App befindet sich jetzt auf deinem Home-Bildschirm.";
    });
  }

  function initialize() {
    bindEvents();
    updateBookProgress();
    updateBonusSummary();
    renderBookCases();
    renderBonus();
    saveState();
    const hashRoute = location.hash.slice(1);
    routeTo(ROUTES.includes(hashRoute) ? hashRoute : state.route, false);
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js?v=6").catch((error) => console.warn("Offline-Modus konnte nicht aktiviert werden.", error));
    }
  }

  initialize();
})();
