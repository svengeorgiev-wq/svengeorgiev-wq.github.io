"use strict";

const STORAGE_KEY = "ruhe-begleiter-v1";
const content = window.RUHE_CONTENT;
if (!content || content.tools?.length !== 12 || content.days?.length !== 21 || content.sources?.length !== 24) {
  throw new Error("Die Buchinhalte fehlen oder sind unvollständig.");
}

const ROUTE_LABELS = Object.freeze({
  today: "Begleit-App zum Buch",
  days: "Die 21-Tage-Übersicht",
  tools: "Die zwölf Werkzeuge",
  timer: "Timer",
  sources: "Die Belege zum Buch"
});

const LABEL_OPTIONS = ["Nachspielen", "Sorgen", "Bewerten", "Rechtfertigen", "Planen"];
const FEELING_OPTIONS = ["gekränkt", "verunsichert", "ärgerlich", "beschämt", "müde"];

const DEFAULT_STATE = Object.freeze({
  completedDays: [],
  selectedDay: null,
  currentDay: 1,
  dayAnswers: {},
  dayNotes: {},
  toolEntries: {},
  usedTools: [],
  favoriteTools: [],
  timers: {},
  breath: { exhale: 6, rounds: 6 },
  sitting: { minutes: 5 },
  weeklyChecks: [],
  installHintDismissed: false
});

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const settingsDialog = document.querySelector("#settings-dialog");
const toolDialog = document.querySelector("#tool-dialog");
const toolDialogContent = document.querySelector("#tool-dialog-content");
const confirmDialog = document.querySelector("#confirm-dialog");
let state = loadState();
let deferredInstallPrompt = null;
let toolFilter = "all";
let toastTimer = null;
let audioContext = null;
let openToolNumber = null;

/* ---------- Zustand ---------- */

function cloneDefault() { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return cloneDefault();
    const base = cloneDefault();
    return {
      ...base,
      ...saved,
      dayAnswers: saved.dayAnswers || {},
      dayNotes: saved.dayNotes || {},
      toolEntries: saved.toolEntries || {},
      timers: saved.timers || {},
      breath: { ...base.breath, ...(saved.breath || {}) },
      sitting: { ...base.sitting, ...(saved.sitting || {}) },
      weeklyChecks: Array.isArray(saved.weeklyChecks) ? saved.weeklyChecks : []
    };
  } catch {
    return cloneDefault();
  }
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatDate(key) {
  const [y, m, d] = key.split("-");
  return `${d}.${m}.${y}`;
}

function entry(number) {
  const current = state.toolEntries[number];
  return current && typeof current === "object" ? current : {};
}

function setEntry(number, patch) {
  state.toolEntries[number] = { ...entry(number), ...patch };
  saveState();
}

function toolByNumber(number) { return content.tools[number - 1]; }

/* ---------- Routing ---------- */

function routeFromHash() {
  const route = location.hash.replace(/^#/, "").split("/")[0];
  return ROUTE_LABELS[route] ? route : "today";
}

function go(route) {
  if (location.hash === `#${route}`) render();
  else location.hash = route;
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
}

function setActiveNavigation(route) {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === route);
    if (button.dataset.nav === route) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.querySelector("#route-label").textContent = ROUTE_LABELS[route];
}

function completedCount() { return new Set(state.completedDays.map(Number)).size; }
function nextOpenDay() { return content.days.find((day) => !state.completedDays.includes(day.number))?.number || 21; }

function render() {
  const route = routeFromHash();
  setActiveNavigation(route);
  const renderers = { today: renderToday, days: renderDays, tools: renderTools, timer: renderTimer, sources: renderSources };
  app.innerHTML = `<section class="view">${renderers[route]()}</section>`;
  app.dataset.currentRoute = route;
  tickTimers();
}

/* ---------- Startseite ---------- */

function stepPill(step) {
  return step === "RUHE" ? '<span class="step-pill sun">R · U · H · E</span>' : `<span class="step-pill">${step} · ${stepName(step)}</span>`;
}

function stepName(step) {
  return { R: "Registrieren", U: "Umschalten", H: "Hinschauen", E: "Entscheiden", RUHE: "Ganze Schleife" }[step];
}

function renderToday() {
  const done = completedCount();
  const nextDay = nextOpenDay();
  const day = content.days[nextDay - 1];
  return `
    <div class="home-grid">
      <article class="book-card">
        <img class="book-cover" src="assets/book-cover-240.webp" width="240" height="384" alt="Buchcover Achtsamkeit &amp; Gelassenheit für normale Leute von Sven Georgiev">
        <div class="book-card-copy">
          <p class="eyebrow">Begleit-App zum Buch</p>
          <h2>Achtsamkeit &amp; Gelassenheit für normale Leute</h2>
          <p>Sven Georgiev · Munich Publishing</p>
          <p>Alle zwölf Werkzeuge aus dem Buch, ein Timer für das lange Ausatmen und die Fünf-Minuten-Sitzung und die 21-Tage-Übersicht. Was du einträgst, bleibt auf deinem Gerät.</p>
        </div>
      </article>

      <article class="glass-card hero-card">
        <p class="eyebrow">Die RUHE-Methode</p>
        <h1>Was ist jetzt dran?</h1>
        <p class="lede">${escapeHtml(content.method.loop)}</p>
        <div class="ruhe-row">
          ${content.method.steps.map((step) => `<div class="ruhe-step"><b>${step.letter}</b><strong>${step.name}</strong><span>${escapeHtml(step.text)}</span></div>`).join("")}
        </div>
        <div class="button-row">
          <button class="button primary" type="button" data-tool="1">RUHE-Stopp starten · 60 Sekunden</button>
          <button class="button sun" type="button" data-tool="2">Das lange Ausatmen</button>
        </div>
      </article>

      <article class="glass-card quick-note">
        <p class="eyebrow">Dein nächster Tag im Workbook</p>
        <h3>Tag ${nextDay} · ${escapeHtml(day.title)}</h3>
        <div class="progress-line" style="--progress:${Math.round(done / 21 * 100)}%"><span></span></div>
        <p class="progress-copy">${done} von 21 Tagen abgehakt. Wenn du einen Tag auslässt, machst du am nächsten einfach weiter.</p>
        <button class="button secondary" type="button" data-day="${nextDay}">Tag ${nextDay} öffnen</button>
      </article>

      <article class="glass-card quick-note situations-card">
        <p class="eyebrow">Jetzt gerade</p>
        <h3>Welcher Moment ist das?</h3>
        <p>Tipp auf die Situation, dann öffnet sich das passende Werkzeug aus dem Buch.</p>
        <div class="situations">
          ${content.situations.map((situation) => `<button class="situation" type="button" data-tool="${situation.tool}">${escapeHtml(situation.label)}</button>`).join("")}
        </div>
      </article>

      <article class="sun-note">
        <p class="eyebrow">Die kürzeste Form</p>
        <p>${escapeHtml(content.method.shortest)}</p>
      </article>

      ${state.installHintDismissed ? "" : `
      <article class="glass-card install-card">
        <div>
          <p class="eyebrow">Anhang B im Buch</p>
          <h3>Die App auf den Startbildschirm legen</h3>
          <p>Ohne Account, ohne Abo, ohne Download. Danach öffnest du den RUHE-Begleiter wie jede andere App.</p>
        </div>
        <div class="button-row"><button class="button primary" type="button" data-open-settings>So geht es</button><button class="text-button" type="button" data-dismiss-install>Später</button></div>
      </article>`}
    </div>`;
}

/* ---------- 21 Tage ---------- */

function renderDays() {
  if (state.selectedDay) return renderDayDetail(Number(state.selectedDay));
  const done = completedCount();
  return `
    <div>
      <p class="eyebrow">Anhang A im Buch</p>
      <h1>Das 21-Tage-RUHE-Workbook</h1>
      <p class="lede">${escapeHtml(content.workbookIntro)}</p>
    </div>
    <article class="glass-card days-summary">
      <div class="days-progress"><strong>${done}</strong><span>von 21 Tagen abgehakt</span></div>
      <div class="progress-line" style="--progress:${Math.round(done / 21 * 100)}%"><span></span></div>
      <div class="day-grid">
        ${content.days.map((day) => `<button class="day-cell ${state.completedDays.includes(day.number) ? "is-done" : ""} ${day.restDay ? "is-rest" : ""} ${nextOpenDay() === day.number ? "is-current" : ""}" type="button" data-day="${day.number}" aria-label="Tag ${day.number}: ${escapeHtml(day.title)}">${day.number}</button>`).join("")}
      </div>
    </article>
    <div class="week-list">
      ${content.weeks.map((week) => `
        <section class="glass-card week-block">
          <p class="eyebrow">Woche ${week.number}</p>
          <h2>${escapeHtml(week.title)}</h2>
          <div class="week-days">
            ${content.days.filter((day) => day.week === week.number).map((day) => `
              <button class="week-day ${state.completedDays.includes(day.number) ? "is-done" : ""} ${day.restDay ? "is-rest" : ""}" type="button" data-day="${day.number}">
                <span class="week-day-number">${day.number}</span><span><strong>${escapeHtml(day.title)}</strong><small>${day.restDay ? "Ruhetag" : escapeHtml(toolByNumber(day.tool).title)}</small></span><span class="week-day-status">${state.completedDays.includes(day.number) ? "✓" : "→"}</span>
              </button>`).join("")}
          </div>
        </section>`).join("")}
    </div>`;
}

function renderDayDetail(number) {
  const day = content.days[number - 1];
  const week = content.weeks[day.week - 1];
  const done = state.completedDays.includes(number);
  const tool = day.tool ? toolByNumber(day.tool) : null;
  return `
    <button class="text-button" type="button" data-days-overview>← Alle 21 Tage</button>
    <article class="glass-card day-detail">
      <div class="day-detail-head"><div><p class="eyebrow">Woche ${week.number} · ${escapeHtml(week.title)}</p><h1>Tag ${day.number} · ${escapeHtml(day.title)}</h1></div>${day.restDay ? '<span class="day-badge">Ruhetag</span>' : ""}</div>
      <span class="chapter-link">Nachlesen: ${escapeHtml(day.chapter)}${tool ? ` · App: ${escapeHtml(tool.title)}` : " · App: 21-Tage-Übersicht"}</span>
      <section class="day-section"><h3>Impuls</h3><p>${escapeHtml(day.impulse)}</p><p class="benefit">Das bringt dir: ${escapeHtml(day.impulseBenefit)}</p></section>
      <section class="day-section"><h3>Übung</h3><p>${escapeHtml(day.exercise)}</p><p class="benefit">Das bringt dir: ${escapeHtml(day.exerciseBenefit)}</p>
        ${tool ? `<div class="button-row" style="margin-top:.7rem"><button class="button secondary" type="button" data-tool="${tool.number}">${escapeHtml(tool.title)} öffnen</button></div>` : ""}
      </section>
      <section class="day-section"><h3>Frage</h3><p>${escapeHtml(day.question)}</p><p class="benefit">Das bringt dir: ${escapeHtml(day.questionBenefit)}</p></section>
      <section class="day-reflection">
        <label for="answer-${number}">Meine Antwort</label>
        <textarea id="answer-${number}" data-day-answer="${number}" placeholder="Du kannst das Feld auch leer lassen.">${escapeHtml(state.dayAnswers[number] || "")}</textarea>
        <label for="notes-${number}" style="margin-top:.8rem">Meine Notizen</label>
        <textarea id="notes-${number}" data-day-note="${number}" placeholder="Was möchtest du festhalten?">${escapeHtml(state.dayNotes[number] || "")}</textarea>
        <p class="save-hint">Wird automatisch nur auf diesem Gerät gespeichert</p>
      </section>
      <div class="button-row" style="margin-top:1rem"><button class="button ${done ? "secondary" : "primary"}" type="button" data-complete-day="${number}">${done ? "Häkchen entfernen" : "Tag abhaken"}</button></div>
      <div class="day-nav"><button class="button ghost" type="button" data-day="${Math.max(1, number - 1)}" ${number === 1 ? "disabled" : ""}>← Tag ${number - 1}</button><button class="button ghost" type="button" data-day="${Math.min(21, number + 1)}" ${number === 21 ? "disabled" : ""}>Tag ${number + 1} →</button></div>
    </article>`;
}

/* ---------- Werkzeuge ---------- */

function toolMatches(tool) {
  if (toolFilter === "all") return true;
  if (toolFilter === "favorites") return state.favoriteTools.includes(tool.number);
  return tool.step === toolFilter || tool.step === "RUHE";
}

function renderTools() {
  const tools = content.tools.filter(toolMatches);
  return `
    <div><p class="eyebrow">Anhang B im Buch</p><h1>Die zwölf Werkzeuge</h1><p class="lede">Jedes Werkzeug aus dem Buch als kurze Schritt-für-Schritt-Anleitung, mit Minimalversion für schlechte Tage und den Antworten aus „Wenn es hakt“.</p></div>
    <div class="filter-bar" aria-label="Werkzeuge filtern">
      ${[["all", "Alle"], ["R", "R · Registrieren"], ["U", "U · Umschalten"], ["H", "H · Hinschauen"], ["E", "E · Entscheiden"], ["favorites", "Favoriten"]].map(([value, label]) => `<button class="chip ${toolFilter === value ? "is-active" : ""}" type="button" data-tool-filter="${value}">${label}</button>`).join("")}
    </div>
    <div class="tool-grid">
      ${tools.length ? tools.map((tool) => `
        <article class="tool-card">
          <span class="tool-number">${tool.number}</span>
          <div>
            <h3>${escapeHtml(tool.title)}</h3>
            <p>${escapeHtml(tool.summary)}</p>
            <div class="tool-meta">${stepPill(tool.step)}<span class="duration-pill">${escapeHtml(tool.duration)}</span></div>
            <button class="tool-open" type="button" data-tool="${tool.number}">Öffnen</button>
          </div>
          <button class="favorite-button ${state.favoriteTools.includes(tool.number) ? "is-active" : ""}" type="button" data-favorite-tool="${tool.number}" aria-label="${state.favoriteTools.includes(tool.number) ? "Aus Favoriten entfernen" : "Als Favorit markieren"}" aria-pressed="${state.favoriteTools.includes(tool.number)}">★</button>
        </article>`).join("") : '<p class="quiet-copy">Noch keine Favoriten. Tipp auf den Stern bei einem Werkzeug.</p>'}
    </div>`;
}

/* ---------- Timer-Seite ---------- */

function renderTimer() {
  return `
    <div><p class="eyebrow">Kapitel 2 und 4 im Buch</p><h1>Timer</h1><p class="lede">Der Atem-Taktgeber für das lange Ausatmen und der Timer für die Fünf-Minuten-Sitzung. Am Ende klingt ein leiser Ton.</p></div>
    <div class="timer-grid">
      <article class="timer-card">
        <p class="eyebrow">Werkzeug 2 · U · Umschalten</p>
        <h2>Das lange Ausatmen</h2>
        <p>Vier Zähler ein, sechs bis acht aus. Fünf bis acht Runden, also etwa sechs Atemzüge pro Minute.</p>
        ${renderBreathPacer()}
      </article>
      <article class="timer-card">
        <p class="eyebrow">Werkzeug 4 · H · Hinschauen</p>
        <h2>Die Fünf-Minuten-Sitzung</h2>
        <p>Drei Atemzüge mit dem langen Ausatmen, dann bleibst du an einer Stelle, an der du den Atem spürst. An schlechten Tagen eine Minute.</p>
        ${renderSittingTimer()}
      </article>
      <article class="timer-card wide">
        <p class="eyebrow">Weitere Abläufe mit Zeit</p>
        <h2>Geführte Minuten</h2>
        <div class="timer-links">
          <button class="timer-link" type="button" data-tool="1"><span><strong>Der RUHE-Stopp</strong><small>Vier Schritte in etwa sechzig Sekunden</small></span><span>→</span></button>
          <button class="timer-link" type="button" data-tool="8"><span><strong>Die Draußen-Runde</strong><small>Fünf Schritte in vier Minuten</small></span><span>→</span></button>
          <button class="timer-link" type="button" data-tool="10"><span><strong>Die Zehn-Sekunden-Antwort</strong><small>Ein Atemzug, ein Satz im Kopf</small></span><span>→</span></button>
          <button class="timer-link" type="button" data-tool="11"><span><strong>Der Abendabschluss</strong><small>Vier Minuten am Küchentisch</small></span><span>→</span></button>
        </div>
      </article>
    </div>`;
}

/* ---------- Belege ---------- */

function renderSources() {
  const chapters = [...new Set(content.sources.map((source) => source.chapter))];
  return `
    <div><p class="eyebrow">Quellenverzeichnis im Buch</p><h1>Die Belege zum Buch</h1><p class="lede">Die Studien, auf die sich die zwölf Kapitel stützen, mit vollständigen Angaben und DOI.</p></div>
    <div class="source-list">
      ${chapters.map((chapter) => {
        const tool = toolByNumber(chapter);
        return `<p class="source-chapter">Kapitel ${chapter} · ${escapeHtml(tool.chapterTitle)}</p>` + content.sources.filter((source) => source.chapter === chapter).map((source) => `
          <article class="source-card">
            <p>${escapeHtml(source.citation)}</p>
            <a class="source-link" href="https://doi.org/${escapeHtml(source.doi)}" target="_blank" rel="noopener">DOI: ${escapeHtml(source.doi)} ↗</a>
          </article>`).join("");
      }).join("")}
    </div>
    <article class="glass-card safety-card"><strong>Wichtig</strong><p class="quiet-copy">${escapeHtml(content.appendix.helpIntro)} Erste Anlaufstelle ist deine Hausärztin oder dein Hausarzt; Termine vermittelt auch die 116117. In einer akuten Krise: TelefonSeelsorge 0800 111 0 111. In Lebensgefahr: Notruf 112.</p></article>`;
}

/* ---------- Timer-Engine ---------- */

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function ensureAudio() {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
  } catch { audioContext = null; }
}

function playChime() {
  if (!audioContext) return;
  try {
    const now = audioContext.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.35 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.35 + 1.6);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now + index * 0.35);
      oscillator.stop(now + index * 0.35 + 1.7);
    });
  } catch { /* kein Ton möglich */ }
}

function startPhaseTimer(key, phases, mode = "phases") {
  ensureAudio();
  const total = phases.reduce((sum, phase) => sum + phase.seconds, 0);
  state.timers[key] = { startAt: Date.now(), phases, total, mode, finished: false };
  saveState();
  tickTimers();
}

function stopTimer(key) {
  delete state.timers[key];
  saveState();
  rerenderTimerHost(key);
}

function rerenderTimerHost(key) {
  if (toolDialog.open && openToolNumber) openTool(openToolNumber);
  else render();
}

function timerProgress(timer) {
  const elapsed = (Date.now() - timer.startAt) / 1000;
  let acc = 0;
  for (let index = 0; index < timer.phases.length; index += 1) {
    const phase = timer.phases[index];
    if (elapsed < acc + phase.seconds) {
      return { index, phase, phaseRemaining: acc + phase.seconds - elapsed, phaseElapsed: elapsed - acc, remaining: timer.total - elapsed, done: false };
    }
    acc += phase.seconds;
  }
  return { index: timer.phases.length - 1, phase: timer.phases[timer.phases.length - 1], phaseRemaining: 0, phaseElapsed: 0, remaining: 0, done: true };
}

function tickTimers() {
  document.querySelectorAll("[data-timer-host]").forEach((host) => {
    const key = host.dataset.timerHost;
    const timer = state.timers[key];
    const readout = host.querySelector("[data-timer-readout]");
    const stage = host.querySelector("[data-timer-stage]");
    const text = host.querySelector("[data-timer-text]");
    const orb = host.querySelector(".timer-orb");
    const bars = host.querySelectorAll(".timer-progress span");
    if (!timer) return;
    const progress = timerProgress(timer);
    if (readout) readout.textContent = formatTime(timer.mode === "breath" ? progress.phaseRemaining : progress.remaining);
    if (stage) stage.textContent = progress.done ? "Geschafft" : progress.phase.label;
    if (text) text.textContent = progress.done ? (timer.phases[timer.phases.length - 1].after || "") : (progress.phase.text || "");
    if (orb) {
      orb.classList.toggle("is-running", !progress.done);
      if (timer.mode === "breath") {
        orb.style.setProperty("--breath-duration", `${progress.phase.seconds}s`);
        orb.classList.toggle("is-inhale", !progress.done && progress.phase.kind === "in");
        orb.classList.toggle("is-exhale", progress.done || progress.phase.kind === "out");
      }
    }
    bars.forEach((bar, index) => {
      bar.classList.toggle("is-done", progress.done || index < progress.index);
      const fill = index === progress.index && !progress.done ? Math.round(progress.phaseElapsed / progress.phase.seconds * 100) : (index < progress.index || progress.done ? 100 : 0);
      bar.style.setProperty("--fill", `${fill}%`);
    });
    if (progress.done && !timer.finished) {
      timer.finished = true;
      saveState();
      navigator.vibrate?.([120, 80, 120]);
      playChime();
      showToast(timer.doneMessage || "Der Timer ist beendet.");
      if (timer.onDone === "rerender") rerenderTimerHost(key);
    }
  });
}

function timerHost(key, options) {
  const timer = state.timers[key];
  const running = timer && !timer.finished;
  const finished = timer && timer.finished;
  const phases = options.phases;
  return `
    <div data-timer-host="${key}">
      <div class="timer-orb ${options.breath ? "breath-orb" : ""}"><strong data-timer-readout>${formatTime(options.breath ? phases[0].seconds : phases.reduce((sum, phase) => sum + phase.seconds, 0))}</strong><small data-timer-stage>${escapeHtml(finished ? "Geschafft" : (running ? "" : options.readyLabel || "Bereit"))}</small></div>
      <p class="timer-phase-text" data-timer-text>${escapeHtml(running ? "" : (finished ? (phases[phases.length - 1].after || "") : (options.readyText || "")))}</p>
      ${phases.length > 1 && phases.length <= 12 ? `<div class="timer-progress" aria-hidden="true">${phases.map(() => "<span><i></i></span>").join("")}</div>` : ""}
      <div class="button-row">
        ${running ? `<button class="button secondary" type="button" data-stop-timer="${key}">Abbrechen</button>` : `<button class="button primary" type="button" data-start-timer="${key}">${escapeHtml(finished ? "Noch einmal" : options.startLabel || "Starten")}</button>`}
        ${finished ? `<button class="button ghost" type="button" data-stop-timer="${key}">Zurücksetzen</button>` : ""}
      </div>
    </div>`;
}

/* Vorlagen für die geführten Abläufe */

function breathPhases() {
  const exhale = Number(state.breath.exhale) || 6;
  const rounds = Number(state.breath.rounds) || 6;
  const phases = [];
  for (let round = 1; round <= rounds; round += 1) {
    phases.push({ kind: "in", label: `Einatmen · Runde ${round} von ${rounds}`, seconds: 4, text: "Ruhig durch die Nase, eine normale Menge Luft." });
    phases.push({ kind: "out", label: `Ausatmen · Runde ${round} von ${rounds}`, seconds: exhale, text: "Langsam hinaus, durch die Nase oder leicht geöffnete Lippen.", after: "Fertig. Merkst du den Unterschied in Kiefer und Schultern?" });
  }
  return phases;
}

function sittingPhases() {
  const minutes = Number(state.sitting.minutes) === 1 ? 1 : 5;
  const opening = minutes === 1 ? 20 : 30;
  return [
    { label: "Drei Atemzüge mit dem langen Ausatmen", seconds: opening, text: "Aufrecht sitzen, beide Füße auf dem Boden, Augen geschlossen oder halb offen." },
    { label: "Bleib bei der Stelle", seconds: minutes * 60 - opening, text: "Naseneingang, Brust oder Bauch. Wanderst du ab: ein Wort, dann zurück. Jedes Mal zählt.", after: "Schau kurz hin: Was war heute am häufigsten da? Ein Wort reicht." }
  ];
}

function stoppPhases() {
  const tool = toolByNumber(1);
  return tool.steps.map((step, index) => ({ label: step.title.replace(/\s*\(.*\)\.?$/, ""), seconds: step.seconds, text: step.text, after: index === 3 ? "Dann fang damit an." : "" }));
}

function outsidePhases() {
  const tool = toolByNumber(8);
  return tool.steps.map((step) => ({ label: step.title.replace(/\.$/, ""), seconds: step.seconds, text: step.text, after: "Nur registrieren, dann weiterarbeiten." }));
}

const TIMER_TEMPLATES = {
  breath: () => ({ phases: breathPhases(), mode: "breath", doneMessage: "Runden beendet." }),
  sitting: () => ({ phases: sittingPhases(), mode: "phases", doneMessage: "Die Sitzung ist zu Ende.", onDone: "rerender" }),
  stopp: () => ({ phases: stoppPhases(), mode: "phases", doneMessage: "Der RUHE-Stopp ist durch." }),
  outside: () => ({ phases: outsidePhases(), mode: "phases", doneMessage: "Die Draußen-Runde ist durch." }),
  ten: () => ({ phases: [{ label: "Ausatmen und wiederholen", seconds: 10, text: "Ein langer Atemzug. Im Kopf: Was hat der andere gerade gesagt?", after: "Jetzt wählen: zurückgeben, nachfragen oder vertagen." }], mode: "phases", doneMessage: "Zehn Sekunden sind um." }),
  evening: () => ({ phases: [{ label: "Alles Offene aufschreiben", seconds: 240, text: "So konkret wie möglich: wer, was, wann.", after: "Den ersten Handgriff markieren. Dann: „Für heute ist zu.“" }], mode: "phases", doneMessage: "Vier Minuten sind um." })
};

function startTemplateTimer(key) {
  const template = TIMER_TEMPLATES[key]();
  ensureAudio();
  state.timers[key] = { startAt: Date.now(), phases: template.phases, total: template.phases.reduce((sum, phase) => sum + phase.seconds, 0), mode: template.mode, finished: false, doneMessage: template.doneMessage, onDone: template.onDone || "" };
  saveState();
  rerenderTimerHost(key);
}

function renderBreathPacer() {
  const exhale = Number(state.breath.exhale) || 6;
  const rounds = Number(state.breath.rounds) || 6;
  return `
    <div class="option-row" aria-label="Ausatmen">
      <span class="quiet-copy" style="align-self:center">Ausatmen:</span>
      ${[6, 8].map((value) => `<button class="choice-pill ${exhale === value ? "is-active" : ""}" type="button" data-breath-exhale="${value}">${value} Zähler</button>`).join("")}
    </div>
    <div class="option-row" aria-label="Runden">
      <span class="quiet-copy" style="align-self:center">Runden:</span>
      ${[5, 6, 8].map((value) => `<button class="choice-pill ${rounds === value ? "is-active" : ""}" type="button" data-breath-rounds="${value}">${value}</button>`).join("")}
    </div>
    ${timerHost("breath", { phases: breathPhases(), breath: true, readyLabel: "Bereit", readyText: "Einatmen 4 Zähler, ausatmen " + exhale + " Zähler, " + rounds + " Runden.", startLabel: "Atem-Taktgeber starten" })}`;
}

function renderSittingTimer() {
  const minutes = Number(state.sitting.minutes) === 1 ? 1 : 5;
  const words = entry(4).words || [];
  const showWord = state.timers.sitting?.finished;
  return `
    <div class="option-row" aria-label="Dauer">
      ${[[5, "5 Minuten"], [1, "1 Minute · schlechter Tag"]].map(([value, label]) => `<button class="choice-pill ${minutes === value ? "is-active" : ""}" type="button" data-sitting-minutes="${value}">${label}</button>`).join("")}
    </div>
    ${timerHost("sitting", { phases: sittingPhases(), readyLabel: "Bereit", readyText: "Setz dich an deinem festen Moment hin. Der Timer beginnt mit drei langen Ausatmern.", startLabel: "Sitzung starten" })}
    ${showWord ? `<div class="tool-block"><h3>Was war heute am häufigsten da?</h3><p class="quiet-copy">Ein Wort reicht.</p><div class="two-columns"><input type="text" id="sitting-word" placeholder="Planen, Sorgen, Nachspielen …" aria-label="Ein Wort für heute"><button class="button secondary" type="button" data-save-sitting-word>Wort festhalten</button></div></div>` : ""}
    ${words.length ? `<ul class="history">${words.slice(-5).reverse().map((item) => `<li><b>${escapeHtml(item.word)}</b> · ${formatDate(item.date)}</li>`).join("")}</ul>` : ""}
    <label for="sitting-moment" style="display:block;margin-top:.9rem;font-size:.78rem;font-weight:800">Mein fester Moment</label>
    <input type="text" id="sitting-moment" data-tool-field="4" data-tool-key="moment" value="${escapeHtml(entry(4).moment || "")}" placeholder="Nach dem ersten Kaffee, nach dem Einparken …">`;
}

/* ---------- Werkzeug-Ansicht ---------- */

function toolField(number, key, label, type = "textarea", placeholder = "") {
  const value = escapeHtml(entry(number)[key] || "");
  if (type === "input") return `<label>${label}<input type="text" data-tool-field="${number}" data-tool-key="${key}" value="${value}" placeholder="${escapeHtml(placeholder)}"></label>`;
  return `<label>${label}<textarea data-tool-field="${number}" data-tool-key="${key}" placeholder="${escapeHtml(placeholder)}">${value}</textarea></label>`;
}

function dailyCounter(number, key) {
  const current = entry(number)[key] || {};
  if (current.date !== todayKey()) return { date: todayKey(), count: 0, history: current.history || [] };
  return current;
}

function bumpDailyCounter(number, key, delta) {
  const current = dailyCounter(number, key);
  const previous = entry(number)[key] || {};
  let history = current.history || [];
  if (previous.date && previous.date !== todayKey() && previous.count) {
    history = [...history.filter((item) => item.date !== previous.date), { date: previous.date, count: previous.count }].slice(-14);
  }
  const count = Math.max(0, (current.count || 0) + delta);
  setEntry(number, { [key]: { date: todayKey(), count, history } });
  return count;
}

function tallyMarks(count) {
  const groups = Math.floor(count / 5);
  const rest = count % 5;
  return `${"𝍸 ".repeat(groups)}${"|".repeat(rest)}`.trim() || "–";
}

function renderToolAction(tool) {
  const n = tool.number;
  const data = entry(n);
  if (n === 1) {
    return `<h3>Sechzig Sekunden, vier Schritte</h3><p class="quiet-copy">Der Timer nennt dir jeden Schritt. Hand auf etwas Festes, dann los.</p>
      ${timerHost("stopp", { phases: stoppPhases(), readyLabel: "Bereit", readyText: "Registrieren, Umschalten, Hinschauen, Entscheiden.", startLabel: "RUHE-Stopp starten" })}
      ${toolField(n, "anchor", "Mein fester Punkt am Morgen", "input", "Kaffeemaschine, Wohnungstür, Einparken …")}`;
  }
  if (n === 2) return `<h3>Der Atem-Taktgeber</h3>${renderBreathPacer()}`;
  if (n === 3) {
    const tally = dailyCounter(n, "tally");
    return `<h3>Etikett vergeben</h3>
      <p class="quiet-copy">Die Sorte des Gedankens:</p>
      <div class="option-row">${LABEL_OPTIONS.map((label) => `<button class="choice-pill ${data.label === label ? "is-active" : ""}" type="button" data-set-field="3" data-field-key="label" data-field-value="${escapeHtml(label)}">${label}</button>`).join("")}</div>
      ${toolField(n, "label", "Oder ein eigenes Etikett", "input", "Verteidigungsrede …")}
      <p class="quiet-copy" style="margin-top:.8rem">Ein Wort für das Gefühl:</p>
      <div class="option-row">${FEELING_OPTIONS.map((label) => `<button class="choice-pill ${data.feeling === label ? "is-active" : ""}" type="button" data-set-field="3" data-field-key="feeling" data-field-value="${escapeHtml(label)}">${label}</button>`).join("")}</div>
      ${toolField(n, "feeling", "Oder dein eigenes Wort", "input", "irgendwas zwischen ärgerlich und traurig")}
      ${toolField(n, "action", "Gibt es etwas zu tun? Der eine Schritt, mit Tag und Uhrzeit", "input", "Mi 9 Uhr, mit Disposition über fehlende Lieferscheine reden")}
      <div class="counter"><div><strong>${tally.count}</strong><small>Mal kam der Gedanke heute zurück</small><div class="tally" aria-hidden="true">${tallyMarks(tally.count)}</div></div><button class="button secondary" type="button" data-tally="3">Da ist er wieder</button></div>`;
  }
  if (n === 4) return `<h3>Der Timer zur Sitzung</h3>${renderSittingTimer()}`;
  if (n === 5) {
    return `<h3>Deine Übergangsnotiz</h3>
      ${toolField(n, "stand", "Stand:", "input", "Angebot bis Punkt 3 fertig.")}
      ${toolField(n, "next", "Als Nächstes: (Verb am Anfang)", "input", "Preise in Punkt 4 prüfen.")}
      ${toolField(n, "sentence", "Ein Satz für das, was jetzt kommt", "input", "Ziel dieses Gesprächs: Datum für die Abnahme festlegen.")}
      <p class="save-hint">Die Notiz bleibt hier stehen, bis du sie überschreibst. Im Buch liegt sie dort, wo du beim Wiedereinstieg zuerst hinschaust.</p>`;
  }
  if (n === 6) {
    const griffe = dailyCounter(n, "griffe");
    const history = (griffe.history || []).slice(-7).reverse();
    return `<h3>Deine drei Check-Fenster</h3>
      <div class="two-columns">
        <label>Fenster 1<input type="time" data-tool-field="6" data-tool-key="window1" value="${escapeHtml(data.window1 || "07:45")}"></label>
        <label>Fenster 2<input type="time" data-tool-field="6" data-tool-key="window2" value="${escapeHtml(data.window2 || "12:30")}"></label>
        <label>Fenster 3<input type="time" data-tool-field="6" data-tool-key="window3" value="${escapeHtml(data.window3 || "18:00")}"></label>
      </div>
      <h3 style="margin-top:1rem">Der Griff-Zähler</h3>
      <p class="quiet-copy">Geht die Hand zum Handy: innerlich „Griff“ sagen, einen Strich machen, einmal lang ausatmen. Was wolltest du gerade eigentlich?</p>
      <div class="counter"><div><strong>${griffe.count}</strong><small>Griffe heute, ${formatDate(todayKey())}</small><div class="tally" aria-hidden="true">${tallyMarks(griffe.count)}</div></div><button class="button primary" type="button" data-tally="6">Griff</button></div>
      <div class="button-row" style="margin-top:.5rem"><button class="text-button" type="button" data-tally-minus="6">Einen Strich zurücknehmen</button></div>
      ${history.length ? `<ul class="history">${history.map((item) => `<li><b>${item.count} Griffe</b> · ${formatDate(item.date)}</li>`).join("")}</ul>` : ""}`;
  }
  if (n === 7) {
    const bites = data.bitesDate === todayKey() ? (data.bites || []) : [];
    const items = [["Geschmack", "Salzig, süß, sauer, würzig, fad? Warm oder kalt?"], ["Konsistenz", "Knusprig, weich, zäh, cremig. Hörst du dich kauen?"], ["Hunger", "Sehr, etwas oder kaum? Nur feststellen."]];
    return `<h3>Drei Bissen, drei Fragen</h3><p class="quiet-copy">Handy umdrehen, ein langer Atemzug, dann Bissen für Bissen abhaken.</p>
      <div class="check-list">${items.map(([title, hint], index) => `<button class="check-item ${bites.includes(index) ? "is-done" : ""}" type="button" data-bite="${index}"><span>${bites.includes(index) ? "✓" : index + 1}</span><span><strong>${index + 1}. Bissen: ${title}</strong><small>${hint}</small></span></button>`).join("")}</div>
      ${toolField(n, "noticed", "Was habe ich bemerkt, das mir sonst entgeht?", "textarea", "Die Butter war kalt, das Salz grob …")}`;
  }
  if (n === 8) {
    return `<h3>Vier Minuten geführt</h3><p class="quiet-copy">Der Timer nennt dir jeden Schritt. Das Handy bleibt dabei stumm in der Tasche.</p>
      ${timerHost("outside", { phases: outsidePhases(), readyLabel: "Bereit", readyText: "Raus, Füße, Schultern und Atem, drei Dinge von draußen, zurück.", startLabel: "Draußen-Runde starten" })}
      ${toolField(n, "trigger", "Mein fester Auslöser", "input", "Eine verschickte Datei, das Ende einer Videokonferenz …")}
      ${toolField(n, "neck", "Wie fühlt sich der Nacken vor und nach der Runde an?", "input", "vorher fest, nachher …")}`;
  }
  if (n === 9) {
    const name = data.name || "";
    return `<h3>Die Pause, Schritt für Schritt</h3>
      ${toolField(n, "harsh", "1 · Der harte Satz, so wörtlich wie er klingt", "input", "Wie kann man nur so blöd sein.")}
      <p class="quiet-copy" style="margin-top:.8rem">2 · Hand auf das Brustbein oder auf den Unterarm, zweimal lang ausatmen.</p>
      ${toolField(n, "friend", "3 · Was würdest du einer Freundin sagen, der genau das passiert ist?", "textarea", "Das war ärgerlich, und es passiert anderen auch.")}
      ${toolField(n, "name", "4 · Dein Vorname (oder Spitzname)", "input", "Sarah")}
      ${toolField(n, "sentence", `4 · Der Satz mit deinem Namen${name ? ` · „${escapeHtml(name)}, …“` : ""}`, "input", `${name || "Sarah"}, das war ärgerlich, und es passiert anderen genauso.`)}
      ${toolField(n, "next", "5 · Ein nächster Schritt", "input", "Rückruf, Korrektur, Entschuldigung – oder nichts mehr")}`;
  }
  if (n === 10) {
    return `<h3>Zehn Sekunden</h3>
      ${timerHost("ten", { phases: TIMER_TEMPLATES.ten().phases, readyLabel: "Bereit", readyText: "Warmes Gesicht, fester Kiefer, der Satz liegt fertig im Mund? Dann jetzt.", startLabel: "Zehn Sekunden starten" })}
      <div class="answer-cards">
        <div class="answer-card"><b>Zurückgeben</b>„Du meinst, dass …?“</div>
        <div class="answer-card"><b>Nachfragen</b>„Was ärgert dich daran am meisten?“</div>
        <div class="answer-card"><b>Vertagen</b>„Ich will dir das nicht im Ärger beantworten. Nach dem Essen, um halb acht?“</div>
      </div>`;
  }
  if (n === 11) {
    const closed = data.closedDate === todayKey();
    return `<h3>Vier Minuten am Tisch</h3><p class="quiet-copy">Im Buch schreibst du auf Papier, damit du nicht im Posteingang landest. Wenn du hier schreibst: nur dieses Feld, sonst nichts.</p>
      ${timerHost("evening", { phases: TIMER_TEMPLATES.evening().phases, readyLabel: "Bereit", readyText: "Einmal lang ausatmen, dann anfangen.", startLabel: "Vier Minuten starten" })}
      ${toolField(n, "open", "Alles Offene, so konkret wie möglich: wer, was, wann", "textarea", "Donnerstag 18 Uhr Belege für die Steuer in den grünen Ordner")}
      ${toolField(n, "first", "Der erste Handgriff morgen für den Punkt, der am meisten drückt", "input", "Darf winzig sein")}
      ${closed ? `<div class="closed-note">Für heute ist zu. Kommt ein Punkt im Bett zurück: „Planen“, und: Steht auf dem Zettel.</div>` : `<div class="button-row" style="margin-top:.9rem"><button class="button primary" type="button" data-close-day>„Für heute ist zu.“</button></div>`}`;
  }
  if (n === 12) {
    const last = state.weeklyChecks[0];
    return `<h3>Die kommende Woche</h3>
      ${toolField(n, "word", "1 · Ein Wort für die Woche", "input", "eng, machbar, voll, unklar")}
      <p class="quiet-copy" style="margin-top:.8rem">2 · Drei lange Ausatmer. <button class="text-button" type="button" data-tool="2">Taktgeber öffnen</button></p>
      ${toolField(n, "time", "3 · Zeit: An welchem Tag ist die Woche zu voll?", "input")}
      ${toolField(n, "money", "3 · Geld: Welche Zahlung oder Geldfrage steht an, und wann schaust du sie dir an?", "input")}
      ${toolField(n, "duties", "3 · Pflichten: Was davon musst wirklich du selbst erledigen?", "input")}
      ${toolField(n, "smaller", "4 · Eine Sache wird kleiner (streichen, verschieben, abgeben, tauschen, Zeit kaufen)", "input")}
      ${toolField(n, "mine", "4 · Eine Sache, die nur dir gehört, mit Tag und Uhrzeit", "input")}
      <label>5 · Ein Werkzeug für die Woche<select data-tool-field="12" data-tool-key="weekTool"><option value="">Bitte wählen</option>${content.tools.map((tool) => `<option value="${tool.number}" ${String(data.weekTool) === String(tool.number) ? "selected" : ""}>${tool.number} · ${escapeHtml(tool.title)}</option>`).join("")}</select></label>
      ${toolField(n, "skip", "Minimalversion: Diese Woche lasse ich weg:", "input")}
      <div class="button-row" style="margin-top:.9rem"><button class="button primary" type="button" data-finish-week>Check abschließen</button></div>
      ${state.weeklyChecks.length ? `<h3 style="margin-top:1rem">Bisherige Checks</h3><ul class="history">${state.weeklyChecks.slice(0, 6).map((check) => `<li><b>${formatDate(check.date)}</b> · ${escapeHtml(check.word || "–")}${check.smaller ? ` · kleiner: ${escapeHtml(check.smaller)}` : ""}${check.skip ? ` · weggelassen: ${escapeHtml(check.skip)}` : ""}</li>`).join("")}</ul>` : ""}
      ${last ? "" : ""}`;
  }
  return "";
}

function openTool(number) {
  const tool = toolByNumber(number);
  if (!tool) return;
  openToolNumber = number;
  const sources = content.sources.filter((source) => source.chapter === tool.chapter);
  toolDialogContent.innerHTML = `
    <header class="tool-sheet-head"><div><p class="eyebrow">Werkzeug ${tool.number} · Kapitel ${tool.chapter} · ${escapeHtml(tool.duration)}</p><h2 id="tool-dialog-heading">${escapeHtml(tool.title)}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Schließen">×</button></header>
    <div class="tool-meta" style="margin-bottom:.8rem">${stepPill(tool.step)}<button class="favorite-button" style="position:static;width:auto;height:auto;padding:.2rem .4rem" type="button" data-favorite-tool="${tool.number}" aria-pressed="${state.favoriteTools.includes(tool.number)}">${state.favoriteTools.includes(tool.number) ? "★ Favorit" : "☆ Favorit"}</button></div>
    <p class="tool-intro">${escapeHtml(tool.intro)}</p>
    <ol class="tool-steps">${tool.steps.map((step) => `<li><strong>${escapeHtml(step.title)}</strong> ${escapeHtml(step.text)}</li>`).join("")}</ol>
    <div class="minimal-note"><strong>Für schlechte Tage</strong>${escapeHtml(tool.minimal)}</div>
    ${tool.tip ? `<p class="caution-note">${escapeHtml(tool.tip)}</p>` : ""}
    ${tool.caution ? `<p class="caution-note">${escapeHtml(tool.caution)}</p>` : ""}
    <section class="tool-block">${renderToolAction(tool)}</section>
    <details class="tool-faq"><summary>Wenn es hakt</summary><dl>${tool.faq.map((item) => `<dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd>`).join("")}</dl></details>
    <details class="tool-faq"><summary>Belege zu diesem Kapitel</summary><dl>${sources.map((source) => `<dd style="margin:.5rem 0 0">${escapeHtml(source.citation)} <a href="https://doi.org/${escapeHtml(source.doi)}" target="_blank" rel="noopener">DOI ↗</a></dd>`).join("")}</dl></details>
    <p class="tool-reference">Im Workbook: Tag ${tool.workbookDays.join(" und ")}. Im Buch: Kapitel ${tool.chapter} – ${escapeHtml(tool.chapterTitle)}.</p>
    <p class="tool-reference">${escapeHtml(tool.today)}</p>
    <div class="button-row"><button class="button ${state.usedTools.includes(number) ? "secondary" : "primary"}" type="button" data-used-tool="${number}">${state.usedTools.includes(number) ? "Als ausprobiert markiert" : "Als ausprobiert markieren"}</button>${tool.workbookDays.map((day) => `<button class="button ghost" type="button" data-day="${day}" data-close-first>Tag ${day} öffnen</button>`).join("")}</div>`;
  if (!toolDialog.open) toolDialog.showModal();
  toolDialogContent.scrollTop = 0;
  tickTimers();
}

/* ---------- Aktionen ---------- */

function toggleDay(number) {
  if (state.completedDays.includes(number)) state.completedDays = state.completedDays.filter((day) => day !== number);
  else state.completedDays = [...state.completedDays, number].sort((a, b) => a - b);
  state.currentDay = nextOpenDay();
  saveState();
  render();
  showToast(state.completedDays.includes(number) ? `Tag ${number} ist abgehakt.` : `Häkchen für Tag ${number} entfernt.`);
}

function toggleFavorite(number) {
  if (state.favoriteTools.includes(number)) state.favoriteTools = state.favoriteTools.filter((item) => item !== number);
  else state.favoriteTools = [...state.favoriteTools, number].sort((a, b) => a - b);
  saveState();
  if (toolDialog.open && openToolNumber === number) openTool(number);
  else render();
}

function downloadFile(name, contentText, type) {
  const url = URL.createObjectURL(new Blob([contentText], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportState() {
  const payload = { app: "ruhe-begleiter", version: 1, exportedAt: new Date().toISOString(), state };
  downloadFile(`ruhe-begleiter-sicherung-${todayKey()}.json`, JSON.stringify(payload, null, 2), "application/json");
  showToast("Sicherung wurde erstellt.");
}

function importState(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result));
      if (payload.app !== "ruhe-begleiter" || !payload.state || typeof payload.state !== "object") throw new Error("Falsches Format");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.state));
      state = loadState();
      settingsDialog.close();
      render();
      showToast("Sicherung wurde eingelesen.");
    } catch {
      showToast("Diese Sicherungsdatei passt nicht zur App.");
    }
  };
  reader.readAsText(file);
}

function renderHelpBlock() {
  const block = document.querySelector("#help-block");
  block.innerHTML = `<h3>Wenn du mehr Unterstützung brauchst</h3><p>${escapeHtml(content.appendix.helpIntro)}</p><ul>${content.appendix.help.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul><p>${escapeHtml(content.appendix.helpStand)}</p>`;
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("button[data-route], a[data-route]");
  if (routeButton) { state.selectedDay = null; saveState(); go(routeButton.dataset.route); return; }
  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) { closeButton.closest("dialog")?.close(); return; }
  if (event.target.closest("[data-open-settings]")) { settingsDialog.showModal(); return; }
  if (event.target.closest("[data-dismiss-install]")) { state.installHintDismissed = true; saveState(); render(); return; }
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    if (dayButton.hasAttribute("data-close-first") && toolDialog.open) toolDialog.close();
    state.selectedDay = Number(dayButton.dataset.day); state.currentDay = state.selectedDay; saveState(); go("days"); return;
  }
  if (event.target.closest("[data-days-overview]")) { state.selectedDay = null; saveState(); render(); return; }
  const completeButton = event.target.closest("[data-complete-day]");
  if (completeButton) { toggleDay(Number(completeButton.dataset.completeDay)); return; }
  const toolButton = event.target.closest("[data-tool]");
  if (toolButton) { openTool(Number(toolButton.dataset.tool)); return; }
  const favoriteButton = event.target.closest("[data-favorite-tool]");
  if (favoriteButton) { toggleFavorite(Number(favoriteButton.dataset.favoriteTool)); return; }
  const filterButton = event.target.closest("[data-tool-filter]");
  if (filterButton) { toolFilter = filterButton.dataset.toolFilter; render(); return; }
  const startButton = event.target.closest("[data-start-timer]");
  if (startButton) { startTemplateTimer(startButton.dataset.startTimer); return; }
  const stopButton = event.target.closest("[data-stop-timer]");
  if (stopButton) { stopTimer(stopButton.dataset.stopTimer); return; }
  const exhaleButton = event.target.closest("[data-breath-exhale]");
  if (exhaleButton) { state.breath.exhale = Number(exhaleButton.dataset.breathExhale); delete state.timers.breath; saveState(); rerenderTimerHost("breath"); return; }
  const roundsButton = event.target.closest("[data-breath-rounds]");
  if (roundsButton) { state.breath.rounds = Number(roundsButton.dataset.breathRounds); delete state.timers.breath; saveState(); rerenderTimerHost("breath"); return; }
  const sittingButton = event.target.closest("[data-sitting-minutes]");
  if (sittingButton) { state.sitting.minutes = Number(sittingButton.dataset.sittingMinutes); delete state.timers.sitting; saveState(); rerenderTimerHost("sitting"); return; }
  if (event.target.closest("[data-save-sitting-word]")) {
    const input = document.querySelector("#sitting-word");
    const word = (input?.value || "").trim();
    if (!word) { showToast("Ein Wort reicht."); return; }
    const words = [...(entry(4).words || []), { word, date: todayKey() }].slice(-30);
    setEntry(4, { words });
    delete state.timers.sitting; saveState();
    rerenderTimerHost("sitting");
    showToast("Festgehalten.");
    return;
  }
  const setField = event.target.closest("[data-set-field]");
  if (setField) { setEntry(Number(setField.dataset.setField), { [setField.dataset.fieldKey]: setField.dataset.fieldValue }); openTool(Number(setField.dataset.setField)); return; }
  const tallyButton = event.target.closest("[data-tally]");
  if (tallyButton) { const n = Number(tallyButton.dataset.tally); bumpDailyCounter(n, n === 6 ? "griffe" : "tally", 1); navigator.vibrate?.(40); openTool(n); return; }
  const tallyMinus = event.target.closest("[data-tally-minus]");
  if (tallyMinus) { const n = Number(tallyMinus.dataset.tallyMinus); bumpDailyCounter(n, n === 6 ? "griffe" : "tally", -1); openTool(n); return; }
  const biteButton = event.target.closest("[data-bite]");
  if (biteButton) {
    const index = Number(biteButton.dataset.bite);
    const current = entry(7).bitesDate === todayKey() ? (entry(7).bites || []) : [];
    const bites = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
    setEntry(7, { bites, bitesDate: todayKey() });
    openTool(7);
    return;
  }
  if (event.target.closest("[data-close-day]")) { setEntry(11, { closedDate: todayKey() }); openTool(11); showToast("Für heute ist zu."); return; }
  if (event.target.closest("[data-finish-week]")) {
    const data = entry(12);
    const check = { date: todayKey(), word: data.word || "", time: data.time || "", money: data.money || "", duties: data.duties || "", smaller: data.smaller || "", mine: data.mine || "", weekTool: data.weekTool || "", skip: data.skip || "" };
    if (!check.word && !check.smaller && !check.skip) { showToast("Ein Wort für die Woche oder die eine Zeile reicht."); return; }
    state.weeklyChecks = [check, ...state.weeklyChecks.filter((item) => item.date !== check.date)].slice(0, 26);
    saveState();
    openTool(12);
    showToast("Check abgeschlossen. Eine Sache weniger.");
    return;
  }
  const usedButton = event.target.closest("[data-used-tool]");
  if (usedButton) { const n = Number(usedButton.dataset.usedTool); if (!state.usedTools.includes(n)) state.usedTools.push(n); saveState(); openTool(n); showToast("Als ausprobiert markiert."); }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-day-note]")) { state.dayNotes[event.target.dataset.dayNote] = event.target.value; saveState(); }
  if (event.target.matches("[data-day-answer]")) { state.dayAnswers[event.target.dataset.dayAnswer] = event.target.value; saveState(); }
  if (event.target.matches("[data-tool-field]")) {
    const number = Number(event.target.dataset.toolField);
    setEntry(number, { [event.target.dataset.toolKey]: event.target.value });
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("select[data-tool-field]")) setEntry(Number(event.target.dataset.toolField), { [event.target.dataset.toolKey]: event.target.value });
});

document.querySelector("#settings-open").addEventListener("click", () => settingsDialog.showModal());
document.querySelector("#install-button").addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  } else {
    document.querySelector(".install-block details")?.setAttribute("open", "");
    showToast("Nutze die Anleitung direkt darunter.");
  }
});
document.querySelector("#export-button").addEventListener("click", exportState);
document.querySelector("#import-file").addEventListener("change", (event) => { if (event.target.files?.[0]) importState(event.target.files[0]); event.target.value = ""; });
document.querySelector("#reset-button").addEventListener("click", () => confirmDialog.showModal());
document.querySelector("#confirm-reset").addEventListener("click", () => { localStorage.removeItem(STORAGE_KEY); state = cloneDefault(); settingsDialog.close(); render(); showToast("Lokale Daten wurden gelöscht."); });
toolDialog.addEventListener("close", () => { openToolNumber = null; render(); });

window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); deferredInstallPrompt = event; });
window.addEventListener("keydown", (event) => { if (event.key === "Tab") document.body.classList.add("keyboard-navigation"); });
window.addEventListener("pointerdown", () => document.body.classList.remove("keyboard-navigation"));
window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js?v=2").catch(() => {});
});

setInterval(tickTimers, 250);
renderHelpBlock();
render();
