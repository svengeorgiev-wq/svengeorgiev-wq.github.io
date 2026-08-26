(function () {
  "use strict";

  const STORAGE_KEY = "sherlock-schwer-v2";
  const LEGACY_STORAGE_KEY = "sherlock-schwer-v1";
  const BACKUP_PREFIX = "SHERLOCK-SCHWER-2:";
  const ROUTES = ["start", "book", "bonus", "install"];
  const Engine = window.SherlockEngine;
  const Puzzle = Engine.puzzle;

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

  function freshState(seed = {}) {
    return {
      version: 2,
      route: ROUTES.includes(seed.route) ? seed.route : "start",
      completed: Array.isArray(seed.completed) ? seed.completed : [],
      bookFilter: ["all", "open", "done"].includes(seed.bookFilter) ? seed.bookFilter : "all",
      notes: typeof seed.notes === "string" ? seed.notes.slice(0, 5000) : "",
      levelAnswers: {},
      levelResults: {},
      unlockedLevel: 1,
      bonusComplete: false,
      solutionVisible: false
    };
  }

  function normalizeState(candidate) {
    const normalized = freshState(candidate || {});
    normalized.completed = [...new Set((candidate?.completed || []).filter((id) => Number.isInteger(id) && id >= 1 && id <= 20))].sort((a, b) => a - b);
    normalized.levelAnswers = candidate?.levelAnswers && typeof candidate.levelAnswers === "object" ? candidate.levelAnswers : {};
    normalized.levelResults = candidate?.levelResults && typeof candidate.levelResults === "object" ? candidate.levelResults : {};
    const solvedInOrder = Puzzle.levels.reduce((count, level) => {
      if (count === level.number - 1 && normalized.levelResults[level.number] === "correct" && Engine.isCorrect(level.number, normalized.levelAnswers[level.number])) return count + 1;
      return count;
    }, 0);
    normalized.unlockedLevel = Math.min(Puzzle.levels.length, solvedInOrder + 1);
    normalized.bonusComplete = solvedInOrder === Puzzle.levels.length;
    normalized.solutionVisible = normalized.bonusComplete && candidate?.solutionVisible !== false;
    return normalized;
  }

  function loadState() {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) return normalizeState(JSON.parse(current));
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) return normalizeState(JSON.parse(legacy));
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
    const selected = state.levelAnswers[levelNumber];
    if (!selected) {
      state.levelResults[levelNumber] = "empty";
      saveState();
      renderBonus();
      return;
    }
    if (!Engine.isCorrect(levelNumber, selected)) {
      state.levelResults[levelNumber] = "wrong";
      saveState();
      renderBonus();
      return;
    }
    state.levelResults[levelNumber] = "correct";
    if (levelNumber < Puzzle.levels.length) state.unlockedLevel = levelNumber + 1;
    else {
      state.bonusComplete = true;
      state.solutionVisible = true;
    }
    saveState();
    renderBonus();
    requestAnimationFrame(() => {
      const target = levelNumber < Puzzle.levels.length ? $(`#level-${levelNumber + 1}`) : $("#solution-panel");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function createLevelCard(level) {
    const solved = state.levelResults[level.number] === "correct";
    const unlocked = level.number <= state.unlockedLevel || solved;
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
      success.textContent = `Richtig – ${level.answer}. Ebene ${Math.min(level.number + 1, 4)} ${level.number < 4 ? "ist freigeschaltet" : "schließt den Fall ab"}.`;
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
        input.name = `level-${level.number}-answer`;
        input.value = choice.value;
        input.checked = state.levelAnswers[level.number] === choice.value;
        input.addEventListener("change", () => {
          state.levelAnswers[level.number] = choice.value;
          delete state.levelResults[level.number];
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
      if (state.levelResults[level.number] === "empty") content.append(createTextBlock("div", "Bitte wähle zuerst eine Antwort.", "level-feedback try-again"));
      if (state.levelResults[level.number] === "wrong") content.append(createTextBlock("div", "Diese Antwort widerspricht mindestens einer Angabe. Prüfe die Reihenfolge erneut.", "level-feedback try-again"));
    }
    article.append(content);
    return article;
  }

  function renderSolution() {
    const panel = $("#solution-panel");
    panel.hidden = !state.solutionVisible;
    if (!state.solutionVisible) return;
    const steps = $("#solution-steps");
    steps.textContent = "";
    Puzzle.solutionSteps.forEach((step) => {
      const section = document.createElement("section");
      section.className = "solution-step";
      section.append(createTextBlock("h3", step.title.toUpperCase()), createTextBlock("p", step.answer, "solution-answer"), createTextBlock("p", step.explanation));
      steps.append(section);
    });
    $("#solution-bridge").textContent = Puzzle.bridge;
    $("#solution-outro").textContent = Puzzle.outro;
    $("#verification-note").textContent = Puzzle.checkNote;
  }

  function renderBonus() {
    $("#bonus-number").textContent = Puzzle.id;
    $("#puzzle-title").textContent = Puzzle.title;
    $("#bonus-intro").textContent = Puzzle.intro;
    $("#bonus-case-intro").textContent = Puzzle.introduction;
    $("#detective-notes").value = state.notes;
    const solvedCount = Puzzle.levels.filter((level) => state.levelResults[level.number] === "correct").length;
    const percent = Math.round((solvedCount / Puzzle.levels.length) * 100);
    $("#level-progress-copy").textContent = state.bonusComplete ? "4 von 4 Ebenen gelöst" : `Ebene ${state.unlockedLevel} von 4`;
    $("#level-progress-status").textContent = state.bonusComplete ? "Fall vollständig gelöst" : solvedCount ? "Nächste Spur freigeschaltet" : "Ermittlung begonnen";
    $("#level-progress-bar").style.width = `${percent}%`;
    $(".level-progress .progress-track").setAttribute("aria-valuenow", String(solvedCount));
    const list = $("#level-list");
    list.replaceChildren(...Puzzle.levels.map(createLevelCard));
    renderSolution();
  }

  function resetBonus() {
    const hasProgress = Object.keys(state.levelAnswers).length || state.notes.trim();
    if (hasProgress && !window.confirm("Den Vier-Ebenen-Fall und alle dazugehörigen Notizen neu beginnen?")) return;
    state.levelAnswers = {};
    state.levelResults = {};
    state.unlockedLevel = 1;
    state.bonusComplete = false;
    state.solutionVisible = false;
    state.notes = "";
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
    if (!code.startsWith(BACKUP_PREFIX)) throw new Error("Der Code gehört nicht zur aktuellen Sherlock-Schwer-App.");
    const binary = atob(code.slice(BACKUP_PREFIX.length));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (parsed.version !== 2 || !Array.isArray(parsed.completed)) throw new Error("Der Sicherungscode ist unvollständig oder ungültig.");
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
      state.notes = event.target.value.slice(0, 5000);
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
      localStorage.removeItem(LEGACY_STORAGE_KEY);
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
    renderBookCases();
    renderBonus();
    saveState();
    const hashRoute = location.hash.slice(1);
    routeTo(ROUTES.includes(hashRoute) ? hashRoute : state.route, false);
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js?v=4").catch((error) => console.warn("Offline-Modus konnte nicht aktiviert werden.", error));
    }
  }

  initialize();
})();
