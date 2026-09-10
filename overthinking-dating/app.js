"use strict";

const STORAGE_KEY = "overthinking-dating-state-v1";
const content = window.OVERTHINKING_CONTENT;
if (!content || content.days?.length !== 21 || content.tools?.length !== 22 || content.sources?.length !== 66) {
  throw new Error("Die Buchinhalte fehlen oder sind unvollständig.");
}

const ROUTE_LABELS = Object.freeze({
  today: "Begleit-App",
  check: "Regulations-Ampel",
  days: "Das 21-Tage-Workbook",
  tools: "Die SOS-Toolbox",
  audios: "Audios für typische Situationen",
  sources: "Die Belege zum Buch"
});

const AUDIO_EPISODES = Object.freeze([
  { number: 1, title: "Wenn die Nachricht ausbleibt", situation: "Für den Moment, in dem Warten zur Gedankenspirale wird.", duration: "1:59", file: "01-wenn-die-nachricht-ausbleibt.mp3", chapter: "Kapitel 1", tools: [1, 2] },
  { number: 2, title: "Online – aber keine Antwort", situation: "Wenn der Online-Status plötzlich wie eine eindeutige Botschaft wirkt.", duration: "1:55", file: "02-online-aber-keine-antwort.mp3", chapter: "Kapitel 4", tools: [7, 8] },
  { number: 3, title: "Wenn Ruhe wie Desinteresse wirkt", situation: "Wenn weniger Kontakt sofort Zweifel an Nähe und Beziehung auslöst.", duration: "1:51", file: "03-wenn-ruhe-wie-desinteresse-wirkt.mp3", chapter: "Kapitel 2", tools: [3, 4] },
  { number: 4, title: "Bevor du noch einmal fragst", situation: "Für den Drang, nach einer Rückversicherung gleich die nächste zu suchen.", duration: "1:51", file: "04-bevor-du-noch-einmal-fragst.mp3", chapter: "Kapitel 5", tools: [9, 10] },
  { number: 5, title: "Bevor du die wütende Nachricht sendest", situation: "Wenn Aktivierung sich als scharfe Nachricht entladen will.", duration: "1:46", file: "05-bevor-du-die-wuetende-nachricht-sendest.mp3", chapter: "Kapitel 6", tools: [11, 12] },
  { number: 6, title: "Wenn du im Streit leer wirst", situation: "Wenn Worte verschwinden und dein System auf Rückzug schaltet.", duration: "1:52", file: "06-wenn-du-im-streit-leer-wirst.mp3", chapter: "Kapitel 7", tools: [13, 14] },
  { number: 7, title: "Ein Bedürfnis ohne Angriff aussprechen", situation: "Für ein klares Gespräch, das Nähe sucht, ohne Druck zu machen.", duration: "1:55", file: "07-ein-beduerfnis-ohne-angriff-aussprechen.mp3", chapter: "Kapitel 11", tools: [21, 22] }
]);

const CHECK_QUESTIONS = Object.freeze([
  { key: "tempo", label: "Tempo", options: [
    { color: "gruen", title: "Beweglich", text: "Ich kann mehrere Deutungen nebeneinander halten." },
    { color: "gelb", title: "Schnell oder kreisend", text: "Eine Deutung fühlt sich zwingend an." },
    { color: "rot", title: "Zäh oder leer", text: "Die Gedanken sind weit weg oder kaum greifbar." }
  ]},
  { key: "atem", label: "Atem", options: [
    { color: "gruen", title: "Im Bauch", text: "Der Atem fließt ohne Mühe." },
    { color: "gelb", title: "Hoch in der Brust", text: "Der Atem ist eher kurz oder angespannt." },
    { color: "rot", title: "Flach oder kaum da", text: "Ich nehme ihn fast nicht wahr." }
  ]},
  { key: "spannung", label: "Spannung", options: [
    { color: "gruen", title: "Locker", text: "Kiefer, Schultern und Bauchdecke sind weich." },
    { color: "gelb", title: "Fest", text: "Kiefer, Schultern oder Bauchdecke halten Spannung." },
    { color: "rot", title: "Starr oder fern", text: "Der Körper wirkt still, schwer oder weit weg." }
  ]},
  { key: "impuls", label: "Impuls", options: [
    { color: "gruen", title: "Kein Drang", text: "Ich kann zuhören, abwägen oder warten." },
    { color: "gelb", title: "Etwas tun", text: "Schreiben, nachsehen, fragen oder reagieren." },
    { color: "rot", title: "Nichts mehr", text: "Ich möchte weg, schweigen oder gar nichts tun." }
  ]}
]);

const DEFAULT_STATE = Object.freeze({
  currentDay: 1,
  selectedDay: null,
  completedDays: [],
  favoriteTools: [],
  usedTools: [],
  dayNotes: {},
  dayReflections: {},
  toolEntries: {},
  drafts: { unsent: "" },
  checkDraft: {},
  lastCheck: null,
  checkHistory: [],
  timers: {},
  reminderTime: "20:00"
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
let toolQuery = "";
let sourceQuery = "";
let sourceChapter = "all";
let toastTimer = null;

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return cloneDefault();
    return {
      ...cloneDefault(),
      ...saved,
      drafts: { ...DEFAULT_STATE.drafts, ...(saved.drafts || {}) },
      dayNotes: saved.dayNotes || {},
      dayReflections: saved.dayReflections || {},
      toolEntries: saved.toolEntries || {},
      checkDraft: saved.checkDraft || {},
      timers: saved.timers || {}
    };
  } catch {
    return cloneDefault();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

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
  document.querySelector("#route-label").textContent = ROUTE_LABELS[route] || "Begleit-App";
}

function completedCount() {
  return new Set(state.completedDays.map(Number)).size;
}

function nextOpenDay() {
  return content.days.find((day) => !state.completedDays.includes(day.number))?.number || 21;
}

function render() {
  const route = routeFromHash();
  setActiveNavigation(route);
  const renderers = { today: renderToday, check: renderCheck, days: renderDays, tools: renderTools, audios: renderAudios, sources: renderSources };
  app.innerHTML = `<section class="view">${renderers[route]()}</section>`;
  app.dataset.currentRoute = route;
  if (route === "sources") renderSourceList();
  tickTimers();
}

function resultCopy(color) {
  return {
    gruen: {
      label: "Eher Grün",
      title: "Du kannst gerade sortieren.",
      text: "Reden, klären, entscheiden und planen sind jetzt möglich. Nutze diesen Zustand zum Vorbereiten – nicht erst mitten im Sturm.",
      tools: [19, 21, 22]
    },
    gelb: {
      label: "Eher Gelb",
      title: "Erst regulieren, dann reagieren.",
      text: "Dein Denken wirkt schnell und eng. Nimm genau ein Werkzeug zu Ende und verschiebe Nachrichten oder wichtige Gespräche.",
      tools: [1, 7, 17]
    },
    rot: {
      label: "Eher Rot",
      title: "Weniger Worte, etwas Bewegung.",
      text: "Erwarte nicht sofort Grün. Wärme, Licht, ein anderer Raum oder Summen können den Weg über Gelb öffnen. Keine Gespräche, die eine Antwort erzwingen.",
      tools: [13, 14]
    }
  }[color];
}

function renderToday() {
  const done = completedCount();
  const nextDay = nextOpenDay();
  const last = state.lastCheck ? resultCopy(state.lastCheck.color) : null;
  return `
    <div class="home-grid">
      <article class="book-card">
        <img class="book-cover" src="assets/book-cover-v1.png" width="1024" height="1536" alt="Buchcover Overthinking beim Dating und in Beziehungen von Lea Hoffmann">
        <div class="book-card-copy">
          <p class="eyebrow">Begleit-App zum Buch</p>
          <h2>Overthinking beim Dating und in Beziehungen</h2>
          <p>Das Buch erklärt das Warum. Hier setzt du Ampel, Werkzeuge und 21 Tage praktisch ein.</p>
        </div>
      </article>

      <article class="glass-card hero-card">
        <p class="eyebrow">Tempo · Atem · Spannung · Impuls</p>
        <h1>Was ist gerade möglich?</h1>
        <p class="lede">Vier kurze Fragen. Dann bekommst du Werkzeuge, die zu deinem jetzigen Zustand passen.</p>
        ${last ? `<div class="state-summary"><span class="state-dot ${state.lastCheck.color}"></span><strong>${last.label}</strong><span class="quiet-copy">zuletzt geprüft</span></div>` : ""}
        <div class="button-row">
          <button class="button primary" type="button" data-route="check">Ampel-Check starten</button>
          ${last ? `<button class="button secondary" type="button" data-tool="${last.tools[0]}">Passendes Tool öffnen</button>` : ""}
        </div>
      </article>

      <article class="glass-card quick-note">
        <p class="eyebrow">Dein nächster Schritt</p>
        <h3>Tag ${nextDay} · ${escapeHtml(content.days[nextDay - 1].title)}</h3>
        <div class="progress-line" style="--progress:${Math.round(done / 21 * 100)}%"><span></span></div>
        <p class="progress-copy">${done} von 21 Tagen markiert. Auslassen bricht nichts ab.</p>
        <button class="button secondary" type="button" data-day="${nextDay}">Tag ${nextDay} öffnen</button>
      </article>

      <article class="glass-card quick-note">
        <p class="eyebrow">Vorbereitet für später</p>
        <h3>Ungesendet</h3>
        <p>Schreib hier, was gerade nicht in einen Chat gehört. Es wird weder verschickt noch hochgeladen.</p>
        <textarea data-draft="unsent" aria-label="Ungesendeter Nachrichtenentwurf" placeholder="Hier darf es stehen, ohne gesendet zu werden …">${escapeHtml(state.drafts.unsent)}</textarea>
        <div class="button-row"><button class="text-button" type="button" data-clear-draft="unsent">Entwurf leeren</button></div>
        <p class="save-hint">Automatisch nur in diesem Browser gespeichert</p>
      </article>

      <article class="glass-card audio-callout">
        <div>
          <p class="eyebrow">Neu · Sieben geführte Impulse</p>
          <h3>Wenn Lesen gerade zu viel ist</h3>
          <p>Wähle die Situation, die dich gerade beschäftigt. Jede Folge verbindet eine kurze Regulation mit den passenden Kapiteln und Werkzeugen im Buch.</p>
        </div>
        <button class="button primary" type="button" data-route="audios">Audios für typische Situationen</button>
      </article>
    </div>`;
}

function renderCheck() {
  const answered = Object.keys(state.checkDraft).filter((key) => state.checkDraft[key]).length;
  const result = state.lastCheck?.answers && JSON.stringify(state.lastCheck.answers) === JSON.stringify(state.checkDraft)
    ? resultCopy(state.lastCheck.color)
    : null;
  return `
    <div class="check-intro">
      <p class="eyebrow">Regulations-Ampel · Kapitel 7</p>
      <h1>Erst die Farbe, dann das Werkzeug</h1>
      <p class="lede">Die Ampel beschreibt deinen Zustand; sie stellt keine Diagnose. Wähle jeweils, was gerade am ehesten passt.</p>
    </div>
    <div class="check-grid">
      ${CHECK_QUESTIONS.map((question, index) => `
        <article class="check-card">
          <header><span class="check-index">${index + 1}</span><h3>${question.label}</h3></header>
          <div class="choice-grid">
            ${question.options.map((option) => `
              <button class="choice ${option.color} ${state.checkDraft[question.key] === option.color ? "is-selected" : ""}" type="button" data-check-key="${question.key}" data-check-color="${option.color}" aria-pressed="${state.checkDraft[question.key] === option.color}">
                <span><strong>${option.title}</strong><span>${option.text}</span></span>
              </button>`).join("")}
          </div>
        </article>`).join("")}
    </div>
    <div class="check-actions">
      <span class="quiet-copy">${answered} von 4 beantwortet</span>
      <button class="button primary" type="button" data-evaluate-check ${answered < 4 ? "disabled" : ""}>Einordnen</button>
    </div>
    ${result ? renderCheckResult(state.lastCheck.color) : ""}`;
}

function renderCheckResult(color) {
  const copy = resultCopy(color);
  return `
    <article class="glass-card check-result ${color}">
      <p class="result-kicker">${copy.label}</p>
      <h2>${copy.title}</h2>
      <p>${copy.text}</p>
      <p class="quiet-copy">Gemischte Signale sind normal. Wenn diese Tendenz nicht passt, vertraue deiner eigenen Wahrnehmung.</p>
      <div class="tool-suggestions">
        ${copy.tools.map((number) => {
          const tool = content.tools[number - 1];
          return `<button class="button secondary" type="button" data-tool="${number}">Tool ${number} · ${escapeHtml(tool.title)}</button>`;
        }).join("")}
      </div>
      <div class="button-row" style="margin-top:1rem"><button class="text-button" type="button" data-new-check>Neu prüfen</button></div>
    </article>`;
}

function evaluateCheck() {
  const answers = CHECK_QUESTIONS.map((question) => state.checkDraft[question.key]);
  if (answers.some((answer) => !answer)) return;
  const counts = answers.reduce((all, color) => ({ ...all, [color]: (all[color] || 0) + 1 }), {});
  let color = "gelb";
  if ((counts.rot || 0) >= 2) color = "rot";
  else if ((counts.gelb || 0) >= 2) color = "gelb";
  else if ((counts.gruen || 0) >= 2) color = "gruen";
  const check = { color, answers: { ...state.checkDraft }, at: new Date().toISOString() };
  state.lastCheck = check;
  state.checkHistory = [check, ...state.checkHistory].slice(0, 30);
  saveState();
  render();
  requestAnimationFrame(() => document.querySelector(".check-result")?.scrollIntoView({ behavior: "smooth", block: "center" }));
}

function renderDays() {
  if (state.selectedDay) return renderDayDetail(Number(state.selectedDay));
  const done = completedCount();
  const weeks = [...new Set(content.days.map((day) => day.week))];
  return `
    <div>
      <p class="eyebrow">Anhang A im Buch</p>
      <h1>Das 21-Tage-Workbook</h1>
      <p class="lede">Eine Übung pro Tag, zwei feste Ruhetage. Du machst dort weiter, wo du stehengeblieben bist.</p>
    </div>
    <article class="glass-card days-summary">
      <div class="days-progress"><strong>${done}</strong><span>von 21 Tagen markiert</span></div>
      <div class="progress-line" style="--progress:${Math.round(done / 21 * 100)}%"><span></span></div>
      <div class="day-grid">
        ${content.days.map((day) => `<button class="day-cell ${state.completedDays.includes(day.number) ? "is-done" : ""} ${state.currentDay === day.number ? "is-current" : ""}" type="button" data-day="${day.number}" aria-label="Tag ${day.number}: ${escapeHtml(day.title)}">${day.number}</button>`).join("")}
      </div>
    </article>
    <div class="week-list">
      ${weeks.map((week, index) => `
        <section class="glass-card week-block">
          <p class="eyebrow">Woche ${index + 1}</p>
          <h2>${escapeHtml(titleCase(week))}</h2>
          <div class="week-days">
            ${content.days.filter((day) => day.week === week).map((day) => `
              <button class="week-day ${state.completedDays.includes(day.number) ? "is-done" : ""}" type="button" data-day="${day.number}">
                <span class="week-day-number">${day.number}</span><span><strong>${escapeHtml(day.title)}</strong><small>${day.restDay ? "Ruhetag" : escapeHtml(day.chapter)}</small></span><span class="week-day-status">${state.completedDays.includes(day.number) ? "✓" : "→"}</span>
              </button>`).join("")}
          </div>
        </section>`).join("")}
    </div>`;
}

function titleCase(value) {
  return value.toLowerCase().replace(/(^|\s)(\p{L})/gu, (match, space, letter) => space + letter.toUpperCase());
}

function renderDayDetail(number) {
  const day = content.days[number - 1];
  const done = state.completedDays.includes(number);
  return `
    <button class="text-button" type="button" data-days-overview>← Alle 21 Tage</button>
    <article class="glass-card day-detail">
      <div class="day-detail-head"><div><p class="eyebrow">${escapeHtml(titleCase(day.week))}</p><h1>Tag ${day.number} · ${escapeHtml(day.title)}</h1></div>${day.restDay ? '<span class="day-badge">Ruhetag</span>' : ""}</div>
      <span class="chapter-link">Im Buch: ${escapeHtml(day.chapter)}</span>
      <section class="day-section"><h3>Impuls</h3><p>${escapeHtml(day.impulse)}</p><p class="benefit">Das bringt es dir: ${escapeHtml(day.impulseBenefit)}</p></section>
      <section class="day-section"><h3>Übung</h3><p>${escapeHtml(day.exercise)}</p><p class="benefit">Das bringt es dir: ${escapeHtml(day.exerciseBenefit)}</p></section>
      <section class="day-section"><h3>Reflexionsfrage</h3><p>${escapeHtml(day.reflection)}</p><p class="benefit">Das bringt es dir: ${escapeHtml(day.reflectionBenefit)}</p></section>
      <section class="day-reflection">
        <label for="reflection-${number}"><strong>Deine Antwort</strong></label>
        <textarea id="reflection-${number}" data-day-reflection="${number}" placeholder="Du kannst das Feld leer lassen.">${escapeHtml(state.dayReflections[number] || "")}</textarea>
        <label for="notes-${number}" style="display:block;margin-top:.8rem"><strong>Deine Notizen</strong></label>
        <textarea id="notes-${number}" data-day-note="${number}" placeholder="Was möchtest du festhalten?">${escapeHtml(state.dayNotes[number] || "")}</textarea>
        <p class="save-hint">Automatisch nur in diesem Browser gespeichert</p>
      </section>
      <div class="button-row" style="margin-top:1rem"><button class="button ${done ? "secondary" : "primary"}" type="button" data-complete-day="${number}">${done ? "Markierung entfernen" : "Diesen Tag markieren"}</button></div>
      <div class="day-nav"><button class="button ghost" type="button" data-day="${Math.max(1, number - 1)}" ${number === 1 ? "disabled" : ""}>← Tag ${number - 1}</button><button class="button ghost" type="button" data-day="${Math.min(21, number + 1)}" ${number === 21 ? "disabled" : ""}>Tag ${number + 1} →</button></div>
    </article>`;
}

function toolStates(number) {
  if ([13, 14].includes(number)) return ["rot"];
  if ([21, 22].includes(number)) return ["gruen"];
  if (number === 19) return ["gelb", "gruen"];
  return ["gelb"];
}

function stateLabel(color) {
  return color === "gruen" ? "Grün" : color === "gelb" ? "Gelb" : "Rot";
}

function toolMatches(tool) {
  const filterMatch = toolFilter === "all" || (toolFilter === "favorites" ? state.favoriteTools.includes(tool.number) : toolStates(tool.number).includes(toolFilter));
  const haystack = `${tool.number} ${tool.title} ${tool.summary} ${tool.chapter}`.toLowerCase();
  return filterMatch && haystack.includes(toolQuery.toLowerCase());
}

function renderTools() {
  const tools = content.tools.filter(toolMatches);
  return `
    <div><p class="eyebrow">Kapitel 12 im Buch</p><h1>Die SOS-Toolbox</h1><p class="lede">Erst die Farbe, dann genau ein Werkzeug. Die Sterne zeigen, wie gut das Werkzeug im Buch belegt ist.</p></div>
    <input id="tool-search" type="search" value="${escapeHtml(toolQuery)}" placeholder="Werkzeug suchen" aria-label="Werkzeuge durchsuchen" style="margin-top:1rem">
    <div class="filter-bar" aria-label="Werkzeuge filtern">
      ${[["all","Alle"],["gruen","Grün"],["gelb","Gelb"],["rot","Rot"],["favorites","Favoriten"]].map(([value,label]) => `<button class="chip ${toolFilter === value ? "is-active" : ""}" type="button" data-tool-filter="${value}">${label}</button>`).join("")}
    </div>
    <div class="tool-grid" id="tool-list">${renderToolCards(tools)}</div>`;
}

function renderToolCards(tools) {
  if (!tools.length) return '<p class="quiet-copy">Keine passenden Werkzeuge gefunden.</p>';
  return tools.map((tool) => `
    <article class="tool-card">
      <span class="tool-number">${tool.number}</span>
      <div>
        <h3>${escapeHtml(tool.title)}</h3>
        <p>${escapeHtml(tool.summary)}</p>
        <div class="tool-meta"><span class="evidence" aria-label="${tool.stars} von 3 Evidenzsternen">${"★".repeat(tool.stars)}${"☆".repeat(3 - tool.stars)}</span>${toolStates(tool.number).map((color) => `<span class="state-pill ${color}">${stateLabel(color)}</span>`).join("")}</div>
        <button class="tool-open" type="button" data-tool="${tool.number}">Anwenden</button>
      </div>
      <button class="favorite-button ${state.favoriteTools.includes(tool.number) ? "is-active" : ""}" type="button" data-favorite-tool="${tool.number}" aria-label="${state.favoriteTools.includes(tool.number) ? "Aus Favoriten entfernen" : "Als Favorit markieren"}" aria-pressed="${state.favoriteTools.includes(tool.number)}">★</button>
    </article>`).join("");
}

function renderAudios() {
  return `
    <div class="audio-intro">
      <p class="eyebrow">7 geführte Audio-Impulse</p>
      <h1>Audios für typische Situationen</h1>
      <p class="lede">Wähle, was gerade wirklich passiert. Jede Folge hilft dir zuerst beim Regulieren und verweist hörbar auf die passenden Kapitel und Werkzeuge im Buch.</p>
      <p class="quiet-copy">Die Audios starten nur nach deinem Tipp. Beim ersten Start wird die jeweilige Folge zugleich für spätere Offline-Nutzung gespeichert.</p>
    </div>
    <div class="audio-grid">
      ${AUDIO_EPISODES.map((episode) => {
        const episodeTools = episode.tools.map((number) => content.tools[number - 1]);
        return `
          <article class="glass-card audio-card">
            <header class="audio-card-head">
              <span class="audio-number">${episode.number}</span>
              <div><h2>${escapeHtml(episode.title)}</h2><p class="audio-card-copy">${escapeHtml(episode.situation)}</p></div>
              <span class="audio-duration">${episode.duration} Min.</span>
            </header>
            <audio class="audio-player" controls preload="metadata" src="audio/${escapeHtml(episode.file)}" aria-label="Audio ${episode.number}: ${escapeHtml(episode.title)}">Dein Browser kann dieses Audio nicht abspielen.</audio>
            <p class="audio-reference"><strong>Im Buch:</strong> ${episode.chapter} · ${episodeTools.map((tool) => `Tool ${tool.number} „${escapeHtml(tool.title)}“`).join(" · ")}</p>
            <div class="audio-tools">${episodeTools.map((tool) => `<button class="chip" type="button" data-tool="${tool.number}">Tool ${tool.number} öffnen</button>`).join("")}</div>
          </article>`;
      }).join("")}
    </div>`;
}

function renderSources() {
  return `
    <div><p class="eyebrow">66 wissenschaftliche Arbeiten</p><h1>Die Belege zum Buch</h1><p class="lede">Exakte Kurzangaben aus dem Manuskript, nach Kapiteln filterbar und direkt recherchierbar.</p></div>
    <div class="sources-toolbar">
      <input id="source-search" type="search" value="${escapeHtml(sourceQuery)}" placeholder="Autor, Titel oder Zeitschrift suchen" aria-label="Belege durchsuchen">
      <select id="source-chapter" aria-label="Nach Kapitel filtern"><option value="all">Alle Kapitel</option>${Array.from({length:11},(_,index)=>`<option value="${index+1}" ${String(sourceChapter)===String(index+1)?"selected":""}>Kapitel ${index+1}</option>`).join("")}</select>
    </div>
    <p class="source-count" id="source-count"></p>
    <div class="source-list" id="source-list"></div>
    <article class="glass-card safety-card"><strong>Wichtig</strong><p class="quiet-copy">Die App ordnet keine Symptome medizinisch ein und ersetzt keine Behandlung. Bei anhaltender Taubheit, Antriebslosigkeit oder dem Gefühl, neben dir zu stehen, wende dich an eine ärztliche oder psychotherapeutische Stelle. In Deutschland: 116117; bei Lebensgefahr 112.</p></article>`;
}

function renderSourceList() {
  const list = document.querySelector("#source-list");
  if (!list) return;
  const query = sourceQuery.trim().toLowerCase();
  const filtered = content.sources.filter((source) => {
    const chapterMatch = sourceChapter === "all" || source.chapters.includes(Number(sourceChapter));
    return chapterMatch && source.citation.toLowerCase().includes(query);
  });
  document.querySelector("#source-count").textContent = `${filtered.length} von 66 Belegen`;
  list.innerHTML = filtered.map((source) => `
    <article class="source-card">
      <p>${escapeHtml(source.citation)}</p>
      <div class="source-meta"><span class="source-chapters">Kapitel ${source.chapters.join(", ")}</span><a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${source.doi ? "DOI öffnen" : "Bei Google Scholar suchen"} ↗</a></div>
    </article>`).join("") || '<p class="quiet-copy">Keine Belege gefunden.</p>';
}

function getToolEntry(number, key = "text") {
  const entry = state.toolEntries[number];
  if (entry && typeof entry === "object") return entry[key] || "";
  return key === "text" && typeof entry === "string" ? entry : "";
}

function toolField(number, key, label, type = "textarea", placeholder = "") {
  const value = escapeHtml(getToolEntry(number, key));
  if (type === "input") return `<label>${label}<input type="text" data-tool-field="${number}" data-tool-key="${key}" value="${value}" placeholder="${escapeHtml(placeholder)}"></label>`;
  return `<label>${label}<textarea data-tool-field="${number}" data-tool-key="${key}" placeholder="${escapeHtml(placeholder)}">${value}</textarea></label>`;
}

function timerBlock(toolNumber, duration, label, mode = "timer") {
  return `<div class="timer-orb"><strong data-timer-readout="${toolNumber}">${formatTime(duration)}</strong><small data-timer-stage="${toolNumber}">${label}</small></div><div class="button-row"><button class="button primary" type="button" data-start-timer="${toolNumber}" data-duration="${duration}" data-mode="${mode}">Starten</button><button class="button secondary" type="button" data-reset-timer="${toolNumber}">Zurücksetzen</button></div>`;
}

function renderToolAction(tool) {
  const n = tool.number;
  if (n === 1) return `<h3>Zehn Atemzüge</h3><p>Vier Sekunden ein, acht Sekunden aus. Der Timer zeigt dir den Wechsel.</p>${timerBlock(n, 120, "Bereit", "breath")}`;
  if (n === 3) return `<h3>Bis morgen pausieren</h3><p>Der Countdown bleibt auch nach dem Schließen der App erhalten.</p>${timerBlock(n, 86400, "24 Stunden")}`;
  if (n === 4) return `<h3>Drei konkrete Enttäuschungen</h3><p>Mit Datum, ohne Erklärung dahinter.</p>${toolField(n,"fact1","1","input","Was ist konkret passiert?")}${toolField(n,"fact2","2","input","Was ist konkret passiert?")}${toolField(n,"fact3","3","input","Was ist konkret passiert?")}`;
  if (n === 5) return `<h3>Zehn Minuten Gewicht und Ruhe</h3><p>Flach liegen, Gewicht auf Brustkorb und Bauch. Bequem atmen.</p>${timerBlock(n, 600, "10 Minuten")}`;
  if (n === 6) return `<h3>Die zweite Welle ansagen</h3><p>Auf die Uhr sehen: Das Schlimmste kommt oft erst zwanzig bis vierzig Minuten nach dem Auslöser.</p>${timerBlock(n, 2400, "40 Minuten")}`;
  if (n === 8) return `<h3>Was ist da – was fülle ich?</h3><div class="two-columns">${toolField(n,"known","Was weiß ich?","textarea","Wörter, Uhrzeit, konkrete Handlung …")}${toolField(n,"filled","Was fülle ich?","textarea","Deutung, Befürchtung, Geschichte …")}</div>`;
  if (n === 10) return `<h3>Gegenbeweise</h3><p>Notiere mit Datum, was am nächsten Tag geschah, nachdem du nicht nachgefragt hast.</p>${toolField(n,"evidence","Deine Liste","textarea","Datum – nicht gefragt – was danach passiert ist")}`;
  if (n === 11) return `<h3>Fünf Minuten runterregeln</h3><p>Langsame Atmung oder Muskelentspannung. Erst danach entscheiden.</p>${timerBlock(n, 300, "5 Minuten")}`;
  if (n === 14) return `<h3>Fünf bis zehn lange Töne</h3><p>Einatmen und beim Ausatmen tief und gleichmäßig summen. Es muss nicht schön klingen.</p>${timerBlock(n, 120, "Summen", "breath")}`;
  if (n === 16) return `<h3>Drei Dinge, die du heute kannst</h3><p>Und die du mit sechs Jahren nicht konntest.</p>${toolField(n,"one","1","input")}${toolField(n,"two","2","input")}${toolField(n,"three","3","input")}`;
  if (n === 17) return `<h3>Eine Stunde nicht nachfüttern</h3><p>Die Nachricht nicht wieder lesen und die Situation niemandem erzählen. Danach darfst du neu entscheiden.</p>${timerBlock(n, 3600, "1 Stunde")}`;
  if (n === 18) return `<h3>Mit deinem Namen</h3>${toolField(n,"name","Dein Vorname","input","Vorname")}${toolField(n,"thought","Formuliere den Gedanken","textarea","Was [Name] hier beschäftigt, ist …")}`;
  if (n === 19) return `<h3>Dein Wenn-Dann-Plan</h3><div class="two-columns">${toolField(n,"when","Wenn …","textarea","Situation, die sicher eintritt")}${toolField(n,"then","Dann …","textarea","Handlung, die zwei Minuten dauert")}</div>`;
  if (n === 21) return `<h3>Vier Sätze, keine Vorrede</h3>${toolField(n,"concern","1 · Anliegen","textarea")}${toolField(n,"experience","2 · Eigenes Erleben","textarea")}${toolField(n,"request","3 · Konkrete Bitte","textarea")}${toolField(n,"no","4 · Angebot für ein Nein","textarea")}`;
  if (n === 22) return `<h3>Vom Vorwurf zum Bedürfnis</h3>${toolField(n,"need","Ich hätte gern …","textarea","Übersetze den Vorwurf, bevor du redest.")}`;
  return `<h3>Einmal, zu Ende</h3><p>${escapeHtml(tool.summary)}</p>${toolField(n,"text","Was möchtest du dazu festhalten?","textarea","Optional – bleibt nur auf diesem Gerät")}`;
}

function openTool(number) {
  const tool = content.tools[number - 1];
  if (!tool) return;
  toolDialogContent.innerHTML = `
    <header class="tool-sheet-head"><div><p class="eyebrow">Tool ${tool.number} · ${"★".repeat(tool.stars)}${"☆".repeat(3-tool.stars)}</p><h2 id="tool-dialog-heading">${escapeHtml(tool.title)}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Schließen">×</button></header>
    <p>${escapeHtml(tool.summary)}</p>
    <div class="tool-meta">${toolStates(tool.number).map((color) => `<span class="state-pill ${color}">${stateLabel(color)}</span>`).join("")}</div>
    <section class="tool-action">${renderToolAction(tool)}</section>
    <p class="tool-reference">Im Buch: ${escapeHtml(tool.chapter)}</p>
    <div class="button-row"><button class="button ${state.usedTools.includes(number) ? "secondary" : "primary"}" type="button" data-used-tool="${number}">${state.usedTools.includes(number) ? "Als ausprobiert markiert" : "Als ausprobiert markieren"}</button></div>`;
  if (!toolDialog.open) toolDialog.showModal();
  tickTimers();
}

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours ? `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(rest).padStart(2,"0")}` : `${String(minutes).padStart(2,"0")}:${String(rest).padStart(2,"0")}`;
}

function startTimer(toolNumber, duration, mode) {
  state.timers[toolNumber] = { endAt: Date.now() + duration * 1000, duration, mode };
  saveState();
  tickTimers();
}

function resetTimer(toolNumber) {
  delete state.timers[toolNumber];
  saveState();
  const tool = content.tools[toolNumber - 1];
  if (toolDialog.open) openTool(tool.number);
}

function tickTimers() {
  document.querySelectorAll("[data-timer-readout]").forEach((readout) => {
    const number = Number(readout.dataset.timerReadout);
    const timer = state.timers[number];
    const stage = document.querySelector(`[data-timer-stage="${number}"]`);
    if (!timer) return;
    const remaining = Math.max(0, (timer.endAt - Date.now()) / 1000);
    readout.textContent = formatTime(remaining);
    if (stage) {
      if (remaining <= 0) stage.textContent = "Geschafft";
      else if (timer.mode === "breath") {
        const elapsed = timer.duration - remaining;
        stage.textContent = elapsed % 12 < 4 ? "Einatmen" : "Ausatmen";
      } else stage.textContent = "Läuft";
    }
    if (remaining <= 0 && !timer.finished) {
      timer.finished = true;
      saveState();
      navigator.vibrate?.([100, 80, 100]);
      showToast("Der Timer ist beendet.");
    }
  });
}

function toggleDay(number) {
  if (state.completedDays.includes(number)) state.completedDays = state.completedDays.filter((day) => day !== number);
  else state.completedDays = [...state.completedDays, number].sort((a,b) => a-b);
  state.currentDay = nextOpenDay();
  saveState();
  render();
  showToast(state.completedDays.includes(number) ? `Tag ${number} ist markiert.` : `Markierung für Tag ${number} entfernt.`);
}

function toggleFavorite(number) {
  if (state.favoriteTools.includes(number)) state.favoriteTools = state.favoriteTools.filter((item) => item !== number);
  else state.favoriteTools = [...state.favoriteTools, number].sort((a,b) => a-b);
  saveState();
  render();
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
  const payload = { app: "overthinking-dating", version: 1, exportedAt: new Date().toISOString(), state };
  downloadFile(`bei-dir-bleiben-sicherung-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(payload, null, 2), "application/json");
  showToast("Sicherung wurde erstellt.");
}

function importState(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result));
      if (payload.app !== "overthinking-dating" || !payload.state || typeof payload.state !== "object") throw new Error("Falsches Format");
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

function pad(number) { return String(number).padStart(2, "0"); }
function icsDate(date) { return `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`; }

function createCalendarFile() {
  const value = document.querySelector("#reminder-time").value || "20:00";
  state.reminderTime = value;
  saveState();
  const [hours, minutes] = value.split(":").map(Number);
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);
  if (start <= new Date()) start.setDate(start.getDate() + 1);
  const end = new Date(start.getTime() + 15 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Munich Publishing//Bei dir bleiben//DE", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:bei-dir-bleiben-${Date.now()}@munichpublishing.de`, `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`, "RRULE:FREQ=DAILY;COUNT=21",
    "SUMMARY:Bei dir bleiben – 21-Tage-Workbook", "DESCRIPTION:Öffne die Begleit-App und mache dort weiter, wo du stehengeblieben bist. Auslassen bricht nichts ab.",
    "URL:https://tools.munichpublishing.de/overthinking-dating/", "BEGIN:VALARM", "TRIGGER:-PT10M", "ACTION:DISPLAY", "DESCRIPTION:Bei dir bleiben", "END:VALARM", "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  downloadFile("bei-dir-bleiben-21-tage.ics", ics, "text/calendar;charset=utf-8");
  showToast("Kalenderdatei erstellt. Bitte öffnen und bestätigen.");
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("button[data-route], a[data-route]");
  if (routeButton) { state.selectedDay = null; saveState(); go(routeButton.dataset.route); return; }
  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) { closeButton.closest("dialog")?.close(); return; }
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) { state.selectedDay = Number(dayButton.dataset.day); state.currentDay = state.selectedDay; saveState(); go("days"); return; }
  if (event.target.closest("[data-days-overview]")) { state.selectedDay = null; saveState(); render(); return; }
  const completeButton = event.target.closest("[data-complete-day]");
  if (completeButton) { toggleDay(Number(completeButton.dataset.completeDay)); return; }
  const toolButton = event.target.closest("[data-tool]");
  if (toolButton) { openTool(Number(toolButton.dataset.tool)); return; }
  const favoriteButton = event.target.closest("[data-favorite-tool]");
  if (favoriteButton) { toggleFavorite(Number(favoriteButton.dataset.favoriteTool)); return; }
  const filterButton = event.target.closest("[data-tool-filter]");
  if (filterButton) { toolFilter = filterButton.dataset.toolFilter; render(); return; }
  const choiceButton = event.target.closest("[data-check-key]");
  if (choiceButton) { state.checkDraft[choiceButton.dataset.checkKey] = choiceButton.dataset.checkColor; state.lastCheck = null; saveState(); render(); return; }
  if (event.target.closest("[data-evaluate-check]")) { evaluateCheck(); return; }
  if (event.target.closest("[data-new-check]")) { state.checkDraft = {}; state.lastCheck = null; saveState(); render(); return; }
  const clearDraftButton = event.target.closest("[data-clear-draft]");
  if (clearDraftButton) { state.drafts[clearDraftButton.dataset.clearDraft] = ""; saveState(); render(); showToast("Entwurf geleert."); return; }
  const startTimerButton = event.target.closest("[data-start-timer]");
  if (startTimerButton) { startTimer(Number(startTimerButton.dataset.startTimer), Number(startTimerButton.dataset.duration), startTimerButton.dataset.mode); return; }
  const resetTimerButton = event.target.closest("[data-reset-timer]");
  if (resetTimerButton) { resetTimer(Number(resetTimerButton.dataset.resetTimer)); return; }
  const usedButton = event.target.closest("[data-used-tool]");
  if (usedButton) { const n=Number(usedButton.dataset.usedTool); if(!state.usedTools.includes(n)) state.usedTools.push(n); saveState(); openTool(n); showToast("Als ausprobiert markiert."); }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-draft]")) { state.drafts[event.target.dataset.draft] = event.target.value; saveState(); }
  if (event.target.matches("[data-day-note]")) { state.dayNotes[event.target.dataset.dayNote] = event.target.value; saveState(); }
  if (event.target.matches("[data-day-reflection]")) { state.dayReflections[event.target.dataset.dayReflection] = event.target.value; saveState(); }
  if (event.target.matches("[data-tool-field]")) {
    const number = event.target.dataset.toolField;
    const key = event.target.dataset.toolKey;
    const existing = state.toolEntries[number] && typeof state.toolEntries[number] === "object" ? state.toolEntries[number] : {};
    state.toolEntries[number] = { ...existing, [key]: event.target.value };
    saveState();
  }
  if (event.target.id === "tool-search") { toolQuery = event.target.value; const list=document.querySelector("#tool-list"); if(list) list.innerHTML=renderToolCards(content.tools.filter(toolMatches)); }
  if (event.target.id === "source-search") { sourceQuery = event.target.value; renderSourceList(); }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "source-chapter") { sourceChapter = event.target.value; renderSourceList(); }
});

document.addEventListener("play", (event) => {
  if (!event.target.matches("audio")) return;
  const player = event.target;
  document.querySelectorAll("audio").forEach((other) => { if (other !== player) other.pause(); });
  if (player.dataset.offlineWarmed) return;
  player.dataset.offlineWarmed = "true";
  fetch(player.currentSrc || player.src).catch(() => { player.dataset.offlineWarmed = ""; });
}, true);

document.querySelector("#settings-open").addEventListener("click", () => {
  document.querySelector("#reminder-time").value = state.reminderTime || "20:00";
  settingsDialog.showModal();
});
document.querySelector("#install-button").addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  } else {
    document.querySelector(".install-block details")?.setAttribute("open", "");
    showToast("Nutze die passende Anleitung direkt darunter.");
  }
});
document.querySelector("#calendar-button").addEventListener("click", createCalendarFile);
document.querySelector("#export-button").addEventListener("click", exportState);
document.querySelector("#import-file").addEventListener("change", (event) => { if (event.target.files?.[0]) importState(event.target.files[0]); event.target.value = ""; });
document.querySelector("#reset-button").addEventListener("click", () => confirmDialog.showModal());
document.querySelector("#confirm-reset").addEventListener("click", () => { localStorage.removeItem(STORAGE_KEY); state = cloneDefault(); settingsDialog.close(); render(); showToast("Lokale Daten wurden gelöscht."); });

window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); deferredInstallPrompt = event; });
window.addEventListener("keydown", (event) => { if (event.key === "Tab") document.body.classList.add("keyboard-navigation"); });
window.addEventListener("pointerdown", () => document.body.classList.remove("keyboard-navigation"));
window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js?v=2").catch(() => {});
});

setInterval(tickTimers, 1000);
render();
