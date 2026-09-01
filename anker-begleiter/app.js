"use strict";

const STORAGE_KEY = "anker-begleiter-v1";
const MEDICAL_NOTE = "Diese App ersetzt keine ärztliche Diagnose und keine Behandlung. Sie bereitet das Gespräch mit deiner Ärztin vor und gibt dir Werkzeuge für den Alltag.";
const DEFAULT_NIGHT_LINES = [
  "Wenn ich wach werde, schaue ich nicht auf die Uhr.",
  "Wenn ich nach etwa zwanzig Minuten noch wach bin, stehe ich auf und gehe in einen anderen Raum.",
  "Ich lese dort etwas, das ich schon kenne, bei kleinem Licht – bis ich müde werde."
];
const INTRO_DEFAULTS = [
  "Seit etwa einem Jahr schlafe ich schlecht durch, und meine Konzentration hat deutlich nachgelassen.",
  "Ich habe das vier Wochen lang protokolliert, ich habe das Blatt dabei.",
  "Ich möchte wissen, was davon abgeklärt werden sollte."
];
const ROUTE_LABELS = {
  today: "Heute",
  audios: "21 Audio-Impulse",
  board: "Das 21-Tage-Board",
  tools: "Die zwölf Werkzeuge",
  check: "Der Drei-Stufen-Tagescheck",
  tracker: "Der Tracker",
  timer: "Timer",
  night: "Der Nacht-Notfallplan",
  protocol: "Das Vier-Wochen-Protokoll",
  settings: "Einstellungen"
};

let content;
let audioManifest;
let state;
let phaseOverride = null;
let trackerWeek = 1;
let deferredInstallPrompt = null;
let activeTimer = null;
let reentryNeeded = false;
let reentryRestart = false;

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const areaMenu = document.querySelector("#area-menu");
const confirmDialog = document.querySelector("#confirm-dialog");
const importFile = document.querySelector("#import-file");

function defaultState() {
  return {
    version: 1,
    onboardingDone: false,
    onboardingChoice: null,
    currentDay: 1,
    usedDays: [],
    dayLevels: {},
    tracker: {},
    nightLines: ["", "", ""],
    restartPoint: "Der Drei-Stufen-Tag",
    ramp: ["", "", ""],
    rampEnd: null,
    protocol: {},
    intro: ["", "", ""],
    reminder: { enabled: false, time: "19:00" },
    backupHintSeen: false,
    lastSeen: null
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed || parsed.version !== 1) return defaultState();
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      reminder: { ...base.reminder, ...(parsed.reminder || {}) }
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function markdown(value) {
  const lines = String(value || "").split("\n");
  let html = "";
  let list = null;
  const closeList = () => {
    if (list) html += `</${list}>`;
    list = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      html += `<h3>${inlineMarkdown(line.slice(4))}</h3>`;
      continue;
    }
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    const unordered = line.match(/^-\s+(.+)$/);
    if (ordered) {
      if (list !== "ol") { closeList(); list = "ol"; html += "<ol>"; }
      html += `<li>${inlineMarkdown(ordered[1])}</li>`;
      continue;
    }
    if (unordered) {
      if (list !== "ul") { closeList(); list = "ul"; html += "<ul>"; }
      html += `<li>${inlineMarkdown(unordered[1])}</li>`;
      continue;
    }
    closeList();
    html += `<p>${inlineMarkdown(line)}</p>`;
  }
  closeList();
  return html;
}

function routeName() {
  return (location.hash.replace(/^#\/?/, "") || "today").split("/")[0];
}

function routeParts() {
  return (location.hash.replace(/^#\/?/, "") || "today").split("/");
}

function navigate(route) {
  if (areaMenu.open) areaMenu.close();
  if (location.hash === `#${route}`) render();
  else location.hash = route;
}

function todayPhase() {
  if (phaseOverride) return phaseOverride;
  const hour = new Date().getHours();
  if (hour < 5) return "night";
  if (hour < 11) return "morning";
  if (hour < 18) return "day";
  return "evening";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setHeader(route) {
  document.querySelector("#route-kicker").textContent = ROUTE_LABELS[route] || "Begleiter";
  document.querySelectorAll(".bottom-nav [data-nav]").forEach((button) => {
    const current = button.dataset.nav === route;
    if (current) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function screenHead(kicker, title, description = "") {
  return `<header class="screen-head"><p class="eyebrow">${escapeHtml(kicker)}</p><h1>${escapeHtml(title)}</h1>${description ? `<p class="lead">${escapeHtml(description)}</p>` : ""}</header>`;
}

function renderOnboarding() {
  const selected = content.tracker_zeilen.find((row) => row.id === state.onboardingChoice);
  if (selected) {
    const chapters = selected.kapitel.map((nr) => `Kapitel ${nr}`).join(" und ");
    return `<section class="screen onboarding">
      ${screenHead("Einmaliger Einstieg", "Dein Ausgangspunkt")}
      <div class="onboarding-result">
        <p class="eyebrow">Dort setzt das Buch an</p>
        <h2>${escapeHtml(selected.name)}</h2>
        <p>${chapters} setzt dort an. Du kannst mit Tag 1 anfangen.</p>
      </div>
      <button class="primary-button" type="button" data-action="finish-onboarding">Mit Tag 1 anfangen</button>
      <button class="text-button" type="button" data-action="reset-onboarding-choice">Andere Zeile wählen</button>
    </section>`;
  }
  return `<section class="screen onboarding">
    ${screenHead("Der ANKER-Begleiter", "Welche Zeile ist bei dir gerade die lauteste?", "Ein Tap genügt. Du kannst diesen Einstieg überspringen.")}
    ${renderAudioCta("Direkt anhören")}
    <p class="medical-note">${escapeHtml(MEDICAL_NOTE)}</p>
    <div class="choice-list">
      ${content.tracker_zeilen.map((row) => `<button type="button" data-action="onboarding-choice" data-id="${row.id}"><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.unterzeile)}</small></button>`).join("")}
    </div>
    <button class="text-button" type="button" data-action="skip-onboarding">Überspringen und Heute öffnen</button>
  </section>`;
}

function renderAudioCta(kicker = "Neu im Begleiter") {
  return `<button class="home-audio-cta" type="button" data-route="audios">
    <span class="audio-cta-icon" aria-hidden="true">▶</span>
    <span><small>${escapeHtml(kicker)}</small><strong>21 Audio-Impulse</strong><span>Alle Audios an einem Ort</span></span>
    <span class="audio-cta-arrow" aria-hidden="true">→</span>
  </button>`;
}

function renderReentry() {
  if (reentryRestart) {
    return `<section class="screen">
      ${screenHead("1-Punkt-Neustart", "Heute nur dieser eine Punkt")}
      <article class="card">
        <p class="eyebrow">Dein Wiedereinstieg</p>
        <h2>${escapeHtml(state.restartPoint || "Der Drei-Stufen-Tag")}</h2>
        <p>Beim Wiedereinstieg nur diesen Punkt. Nichts nachholen.</p>
        <button class="primary-button" type="button" data-action="finish-reentry">Für heute öffnen</button>
      </article>
    </section>`;
  }
  return `<section class="screen">
    ${screenHead("Wiedereinstieg", "Du musst nichts aufholen")}
    <article class="card">
      <p>Du kannst da weitermachen, wo du warst, oder heute mit deinem einen Punkt neu anfangen.</p>
      <div class="button-row">
        <button class="primary-button" type="button" data-action="continue-reentry">Bei Tag ${state.currentDay} weitermachen</button>
        <button class="secondary-button" type="button" data-action="restart-reentry">Heute neu anfangen</button>
      </div>
    </article>
  </section>`;
}

function phaseSwitch(active) {
  return `<div class="phase-switch" aria-label="Teil des Tages">
    <button type="button" data-action="phase" data-phase="morning" aria-pressed="${active === "morning"}">Morgen</button>
    <button type="button" data-action="phase" data-phase="day" aria-pressed="${active === "day"}">Tag</button>
    <button type="button" data-action="phase" data-phase="evening" aria-pressed="${active === "evening"}">Abend</button>
  </div>`;
}

function stageKey(label) {
  if (label === "voller Tag") return "full";
  if (label === "halber Tag") return "half";
  return "survival";
}

function renderCheck(compact = false) {
  const saved = state.dayLevels[state.currentDay];
  return `<section class="${compact ? "" : "screen"}">
    ${compact ? "" : screenHead("Morgens · dreißig Sekunden", "Der Drei-Stufen-Tagescheck")}
    <div class="stage-grid">
      ${content.tagesstufen.map((label) => {
        const key = stageKey(label);
        const details = key === "full" ? "Der Plan gilt wie geschrieben." : key === "half" ? "Du machst die Hälfte und lässt die andere stehen." : "Keine wichtigen Gespräche, Entscheidungen oder Mails.";
        return `<button class="stage-button" type="button" data-action="set-stage" data-stage="${key}" data-label="${escapeHtml(label)}"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(details)}</small></button>`;
      }).join("")}
    </div>
    ${saved ? `<p class="today-stored">Für heute gespeichert: <strong>${escapeHtml(saved)}</strong>.</p>` : ""}
  </section>`;
}

function renderToday() {
  if (reentryNeeded) return renderReentry();
  const phase = todayPhase();
  if (phase === "night") return renderNight();
  let body;
  if (phase === "morning") body = renderCheck(true);
  else if (phase === "day") body = renderDay(state.currentDay, true);
  else body = renderTracker(state.currentDay, true);
  const label = phase === "morning" ? "Morgens" : phase === "day" ? "Tagsüber" : "Abends";
  return `<section class="screen today-screen">
    ${screenHead(label, "Heute", "Es gibt nichts nachzuholen.")}
    ${renderAudioCta()}
    ${phaseSwitch(phase)}
    ${body}
  </section>`;
}

function audioPath(dayNumber) {
  return audioManifest.files.find((item) => item.day === Number(dayNumber))?.path || "";
}

function renderAudioSlot(day, title = "") {
  return `<div class="audio-slot" data-audio-day="${day.nr}" data-audio-title="${escapeHtml(title)}" aria-live="polite"></div>`;
}

function renderAudios() {
  const weeks = [...new Set(content.tage.map((day) => day.woche))];
  return `<section class="screen audio-library">
    ${screenHead("Direkt anhören", "21 Audio-Impulse", "Alle gesprochenen Impulse aus dem 21-Tage-Board an einem Ort. Ein Audio wird beim ersten Abspielen offline gespeichert.")}
    ${weeks.map((week) => `<section class="audio-week"><h2>${escapeHtml(week)}</h2><div class="audio-list">${content.tage.filter((day) => day.woche === week).map((day) => `<article class="audio-item"><header><span class="day-number">${day.nr}</span><span><strong>${escapeHtml(day.thema)}</strong><small>Audio ${day.nr}</small></span></header>${renderAudioSlot(day, day.thema)}<button class="text-button audio-day-link" type="button" data-route="day/${day.nr}">Tag ${day.nr} im Board öffnen</button></article>`).join("")}</div></section>`).join("")}
    <div class="button-row"><button class="text-button" type="button" data-route="today">Zurück zu Heute</button></div>
  </section>`;
}

function renderDay(dayNumber, embedded = false) {
  const day = content.tage.find((item) => item.nr === Number(dayNumber)) || content.tage[0];
  const survival = state.dayLevels[day.nr] === "Überlebenstag";
  const special = day.nr === 11 ? renderNightEditor() : day.nr === 20 ? renderRestartEditor() : "";
  const dayBody = survival
    ? `<article class="card">
        <p class="eyebrow">Überlebenstag</p>
        <h2>${escapeHtml(day.thema)}</h2>
        <p>„An solchen Tagen ist der Impuls die ganze Übung; du musst dann nichts aufschreiben.“</p>
        ${renderAudioSlot(day)}
      </article>`
    : `<article class="card day-card">
        <p class="eyebrow">Tag ${day.nr} · ${escapeHtml(day.woche)}</p>
        <h2>${escapeHtml(day.thema)}</h2>
        <div class="day-meta"><span class="pill">${escapeHtml(day.audio)}</span><span class="pill">${escapeHtml(day.app_modul)}</span></div>
        ${renderAudioSlot(day)}
        <section class="day-section"><h3>Impuls</h3><p>${escapeHtml(day.impuls)}</p><p class="benefit">${escapeHtml(day.impuls_nutzen)}</p></section>
        <section class="day-section"><h3>Übung</h3><p>${escapeHtml(day.uebung)}</p><p class="benefit">${escapeHtml(day.uebung_nutzen)}</p></section>
        <section class="day-section"><h3>Reflexionsfrage</h3><p>${escapeHtml(day.frage)}</p><p class="benefit">${escapeHtml(day.frage_nutzen)}</p></section>
        <p class="crossref"><strong>Im Buch und Workbook:</strong> ${escapeHtml(day.kapitel)} · Workbook-Tag ${day.nr} · App-Modul ${escapeHtml(day.app_modul)}</p>
        ${special}
        <div class="button-row"><button class="secondary-button" type="button" data-action="mark-day" data-day="${day.nr}">${state.usedDays.includes(day.nr) ? "Als genutzt markiert" : "Als genutzt markieren"}</button></div>
      </article>`;
  if (embedded) return dayBody;
  return `<section class="screen">${screenHead(day.woche, `Tag ${day.nr}: ${day.thema}`)}${dayBody}<div class="button-row"><button class="text-button" type="button" data-route="board">Zurück zum 21-Tage-Board</button></div></section>`;
}

function renderBoard() {
  const weeks = [...new Set(content.tage.map((day) => day.woche))];
  return `<section class="screen">
    ${screenHead("In derselben Reihenfolge wie im Workbook", "Das 21-Tage-Board", "Jeder Tag ist jederzeit erreichbar. Ausgelassene Tage werden nicht nachgeholt.")}
    ${weeks.map((week) => `<section class="week-block"><h2>${escapeHtml(week)}</h2><div class="day-list">${content.tage.filter((day) => day.woche === week).map((day) => `<button class="day-row" type="button" data-route="day/${day.nr}" data-used="${state.usedDays.includes(day.nr)}"><span class="day-number">${day.nr}</span><span><strong>${escapeHtml(day.thema)}</strong><small>${escapeHtml(day.app_modul)}</small></span><span class="used-mark">${state.usedDays.includes(day.nr) ? "genutzt" : ""}</span></button>`).join("")}</div></section>`).join("")}
  </section>`;
}

function chapterDays(chapterNumber) {
  return content.tage.filter((day) => {
    if (day.kapitel.includes(`Kapitel ${chapterNumber} –`)) return true;
    if (day.kapitel === "Kapitel 1 bis 4") return chapterNumber >= 1 && chapterNumber <= 4;
    if (day.kapitel === "Kapitel 5 bis 8") return chapterNumber >= 5 && chapterNumber <= 8;
    return false;
  });
}

function renderTools(query = "") {
  const normalized = query.trim().toLocaleLowerCase("de");
  const chapters = content.kapitel.filter((chapter) => `${chapter.werkzeug} ${chapter.titel} ${chapter.werkzeug_text}`.toLocaleLowerCase("de").includes(normalized));
  return `<section class="screen">
    ${screenHead("Zum Nachschlagen", "Die zwölf Werkzeuge", "Benannt wie im Buch, mit dem vollständigen Werkzeugtext.")}
    <label class="search-field"><span>Werkzeug suchen</span><input id="tool-search" type="search" autocomplete="off" value="${escapeHtml(query)}" placeholder="Name oder Stichwort"></label>
    <div id="tool-list" class="tool-list">${renderToolCards(chapters)}</div>
  </section>`;
}

function renderToolCards(chapters) {
  if (!chapters.length) return `<p class="info-note">Kein Werkzeug passt zu diesem Suchwort.</p>`;
  return chapters.map((chapter) => {
    const days = chapterDays(chapter.nr);
    const dayText = days.length ? days.map((day) => `Tag ${day.nr}`).join(", ") : "kein fester Workbook-Tag";
    return `<details class="tool-card"><summary><span>${escapeHtml(chapter.werkzeug)}</span><small>Kapitel ${chapter.nr}</small></summary><div class="tool-body"><p class="micro">${escapeHtml(chapter.titel)} · Workbook: ${escapeHtml(dayText)}</p><div class="markdown">${markdown(chapter.werkzeug_text)}</div></div></details>`;
  }).join("");
}

function renderTracker(dayNumber = state.currentDay, embedded = false) {
  const day = Number(dayNumber);
  const saved = state.tracker[day] || {};
  const form = `<form id="tracker-form" class="tracker-form" data-day="${day}">
    <div class="emergency-rule"><span><strong>Wenn heute nichts geht:</strong><br><small>Nur „Die Nacht“ eintragen.</small></span><button class="secondary-button" type="button" data-action="focus-night">Nur Die Nacht</button></div>
    ${content.tracker_zeilen.map((row) => `<fieldset class="tracker-row" data-row="${row.id}"><legend>${escapeHtml(row.name)}<span class="row-sub">${escapeHtml(row.frage)}</span></legend><div class="mark-options">${content.tracker_stufen.map((level, index) => { const id = `mark-${day}-${row.id}-${index}`; return `<input id="${id}" type="radio" name="${row.id}" value="${escapeHtml(level.zeichen)}" ${saved[row.id] === level.zeichen ? "checked" : ""}><label for="${id}" title="${escapeHtml(level.bedeutung)}"><span aria-hidden="true">${escapeHtml(level.zeichen)}</span><span class="sr-only">${escapeHtml(level.bedeutung)}</span></label>`; }).join("")}</div></fieldset>`).join("")}
    <button class="primary-button" type="submit">Tracker für Tag ${day} speichern</button>
  </form>`;
  if (embedded) return form;
  return `<section class="screen">
    ${screenHead("Abends · eine Minute", "Der Tracker", "Sieben Zeilen, ein Zeichen pro Zeile. Keine automatische Deutung.")}
    <label class="field"><span>Workbook-Tag</span><select id="tracker-day-select">${content.tage.map((item) => `<option value="${item.nr}" ${item.nr === day ? "selected" : ""}>Tag ${item.nr}</option>`).join("")}</select></label>
    <div class="card-flat" style="margin-top:16px">${form}</div>
    ${renderWeekOverview()}
  </section>`;
}

function renderWeekOverview() {
  const start = (trackerWeek - 1) * 7 + 1;
  const days = Array.from({ length: 7 }, (_, index) => start + index);
  return `<section class="week-block">
    <p class="eyebrow">Wochenübersicht</p><h2>Sieben Zeilen × sieben Tage</h2>
    <div class="week-selector" aria-label="Woche wählen">${[1, 2, 3].map((week) => `<button type="button" data-action="tracker-week" data-week="${week}" aria-pressed="${trackerWeek === week}">Woche ${week}</button>`).join("")}</div>
    <div class="tracker-grid-wrap"><table class="tracker-grid"><thead><tr><th>Zeile</th>${days.map((day) => `<th>Tag ${day}</th>`).join("")}</tr></thead><tbody>${content.tracker_zeilen.map((row) => `<tr><td>${escapeHtml(row.name)}</td>${days.map((day) => `<td>${escapeHtml(state.tracker[day]?.[row.id] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <div class="reading-list">
      <div><strong>Reihenfolge</strong>die schlechten Tage in „Kopf im Nebel“ neben der Zeile „Die Nacht“</div>
      <div><strong>Kopplung</strong>welche zwei Zeilen gemeinsam kippen</div>
      <div><strong>Ausreißer</strong>der eine gute Tag in einer schlechten Woche</div>
    </div>
    <p class="medical-note">Der Tracker stellt keine Diagnose. Er behauptet auch nicht, dass eine Zeile die andere verursacht. Er zeigt, was zusammen auftritt.</p>
  </section>`;
}

function renderTimer() {
  return `<section class="screen">
    ${screenHead("Ohne Konfiguration", "Timer", "Zwei ruhige Timer, ohne Ton.")}
    <div class="timer-choice">
      <button type="button" data-action="open-six-timer"><span class="eyebrow">6 Sekunden</span><h2>6-Sekunden-Abstand</h2><p class="quiet">Starten, zweimal ausatmen, ruhig zurückkommen.</p></button>
      <button type="button" data-action="open-ramp"><span class="eyebrow">60 Minuten</span><h2>Abkühl-Rampe</h2><p class="quiet">Drei vorher festgelegte Stufen.</p></button>
    </div>
  </section>`;
}

function renderSixTimer(seconds = null) {
  const value = seconds === null ? 6 : seconds;
  return `<section class="screen"><div class="timer-display"><div><p class="eyebrow">6-Sekunden-Abstand</p><div class="timer-number" id="six-number">${value}</div><p id="six-status" class="quiet">Ruhiges Ende, ohne Ton.</p><div class="button-row" style="justify-content:center"><button class="primary-button" type="button" data-action="start-six">Start</button><button class="secondary-button" type="button" data-route="timer">Zurück</button></div></div></div></section>`;
}

function rampLabels() {
  return ["Eine Stunde vorher", "Eine halbe Stunde vorher", "Letzte zehn Minuten"];
}

function renderRamp() {
  const configured = state.ramp.every((item) => item.trim());
  if (!configured) {
    return `<section class="screen">${screenHead("Einmal festlegen", "Abkühl-Rampe", "Danach reicht ein Knopf.")}<form id="ramp-form" class="stack">${rampLabels().map((label, index) => `<label class="field"><span>${label}</span><textarea name="ramp-${index}" placeholder="Was steht in dieser Stufe?">${escapeHtml(state.ramp[index])}</textarea></label>`).join("")}<button class="primary-button" type="submit">Rampe speichern</button></form></section>`;
  }
  const remaining = state.rampEnd ? Math.max(0, Math.ceil((state.rampEnd - Date.now()) / 1000)) : null;
  const stage = remaining === null ? -1 : remaining > 1800 ? 0 : remaining > 600 ? 1 : 2;
  const time = remaining === null ? "60:00" : `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  return `<section class="screen">${screenHead("Drei Stufen", "Abkühl-Rampe")}<div class="timer-display" style="min-height:170px"><div><div class="timer-number" id="ramp-number" style="font-size:clamp(3rem,14vw,6rem)">${time}</div><p class="quiet">${remaining === 0 ? "Die Rampe ist ruhig beendet." : "Keine Töne."}</p></div></div><div class="stack">${state.ramp.map((text, index) => `<div class="ramp-stage" aria-current="${stage === index ? "step" : "false"}"><strong>${rampLabels()[index]}</strong><p>${escapeHtml(text)}</p></div>`).join("")}</div><div class="button-row"><button class="primary-button" type="button" data-action="${state.rampEnd && remaining > 0 ? "stop-ramp" : "start-ramp"}">${state.rampEnd && remaining > 0 ? "Rampe beenden" : "Abkühl-Rampe starten"}</button><button class="secondary-button" type="button" data-action="edit-ramp">Stufen ändern</button></div></section>`;
}

function currentNightLines() {
  return state.nightLines.every((line) => line.trim()) ? state.nightLines : DEFAULT_NIGHT_LINES;
}

function renderNight() {
  const lines = currentNightLines();
  return `<section class="night-screen"><div class="night-inner"><p class="eyebrow">Der Nacht-Notfallplan</p><h1>Für jetzt.</h1><div class="night-lines">${lines.map((line) => `<div class="night-line">${escapeHtml(line)}</div>`).join("")}</div><button class="night-close" type="button" data-action="close-night">Zurück</button></div></section>`;
}

function renderNightEditor() {
  const lines = state.nightLines;
  return `<section class="day-section"><h3>Deine drei Sätze für die Nacht</h3><p class="quiet">Wenn du nichts einträgst, zeigt der Nacht-Notfallplan die Vorlage aus Kapitel 6.</p><form id="night-form" class="stack">${[0,1,2].map((index) => `<label class="field"><span>Satz ${index + 1}</span><textarea name="night-${index}" rows="2">${escapeHtml(lines[index])}</textarea></label>`).join("")}<button class="secondary-button" type="submit">Drei Sätze speichern</button></form></section>`;
}

function renderRestartEditor() {
  return `<section class="day-section"><h3>Dein einer Punkt</h3><p class="quiet">Das Werkzeug, mit dem du nach einer Unterbrechung wieder anfängst.</p><form id="restart-form" class="stack"><label class="field"><span>Werkzeug</span><select name="restart-point">${content.kapitel.map((chapter) => `<option value="${escapeHtml(chapter.werkzeug)}" ${state.restartPoint === chapter.werkzeug ? "selected" : ""}>${escapeHtml(chapter.werkzeug)}</option>`).join("")}</select></label><button class="secondary-button" type="submit">Einen Punkt speichern</button></form></section>`;
}

function trackerToProtocol(day, field) {
  const marks = state.tracker[day] || {};
  const maps = {
    sleep: { "+": "durchgeschlafen", "o": "einmal wach", "−": "mehrfach / lange wach" },
    stimuli: { "+": "gut", "o": "dünnhäutig", "−": "zu viel" },
    concentration: { "+": "normal", "o": "stellenweise weg", "−": "kaum arbeitsfähig" }
  };
  const source = field === "sleep" ? marks.nacht : field === "stimuli" ? marks.reize : marks.nebel;
  return maps[field]?.[source] || "";
}

function protocolValue(day, field) {
  return state.protocol[day]?.[field] ?? (day <= 21 ? trackerToProtocol(day, field) : "");
}

function protocolOptions(field, value) {
  const options = field === "sleep"
    ? ["", "durchgeschlafen", "einmal wach", "mehrfach / lange wach"]
    : field === "stimuli"
      ? ["", "gut", "dünnhäutig", "zu viel"]
      : ["", "normal", "stellenweise weg", "kaum arbeitsfähig"];
  return options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${option || "–"}</option>`).join("");
}

function renderProtocolRows(editable = true) {
  return Array.from({ length: 28 }, (_, index) => {
    const day = index + 1;
    const week = Math.ceil(day / 7);
    const weekDay = ((day - 1) % 7) + 1;
    if (!editable) {
      return `<tr><td class="week-cell">${week}</td><td class="day-cell">${weekDay}</td><td>${escapeHtml(protocolValue(day, "sleep"))}</td><td>${escapeHtml(protocolValue(day, "stimuli"))}</td><td>${escapeHtml(protocolValue(day, "concentration"))}</td><td class="note-cell">${escapeHtml(protocolValue(day, "note"))}</td></tr>`;
    }
    return `<tr><td>W${week} · T${weekDay}</td><td><select data-protocol data-day="${day}" data-field="sleep" aria-label="Woche ${week} Tag ${weekDay}, Schlaf">${protocolOptions("sleep", protocolValue(day, "sleep"))}</select></td><td><select data-protocol data-day="${day}" data-field="stimuli" aria-label="Woche ${week} Tag ${weekDay}, Reize">${protocolOptions("stimuli", protocolValue(day, "stimuli"))}</select></td><td><select data-protocol data-day="${day}" data-field="concentration" aria-label="Woche ${week} Tag ${weekDay}, Konzentration">${protocolOptions("concentration", protocolValue(day, "concentration"))}</select></td><td><input data-protocol data-day="${day}" data-field="note" type="text" maxlength="60" value="${escapeHtml(protocolValue(day, "note"))}" aria-label="Woche ${week} Tag ${weekDay}, Notiz"></td></tr>`;
  }).join("");
}

function introValue(index) {
  return state.intro[index]?.trim() || INTRO_DEFAULTS[index];
}

function renderProtocol() {
  return `<section class="screen protocol-screen">
    ${screenHead("Fürs Arztgespräch", "Das Vier-Wochen-Protokoll", "Die ersten drei Wochen übernehmen deine passenden Trackerzeichen. Du kannst jeden Eintrag ändern.")}
    <div class="protocol-actions"><button class="primary-button" type="button" data-action="print-protocol">Auf eine A4-Seite drucken</button></div>
    <section class="card-flat stack"><h2>Der Drei-Sätze-Einstieg</h2>${["Seit wann", "Was ich mitbringe", "Was ich möchte"].map((label, index) => `<label class="field"><span>${label}</span><textarea data-intro="${index}" rows="2" placeholder="${escapeHtml(INTRO_DEFAULTS[index])}">${escapeHtml(state.intro[index])}</textarea></label>`).join("")}</section>
    ${[1,2,3,4].map((week) => `<section class="protocol-week"><h2>Woche ${week}</h2><div class="protocol-table-wrap"><table class="protocol-table"><thead><tr><th>Tag</th><th>Schlaf</th><th>Reize</th><th>Konzentration</th><th>Notiz</th></tr></thead><tbody>${renderProtocolRows(true).split("</tr>").slice((week - 1) * 7, week * 7).map((row) => row ? `${row}</tr>` : "").join("")}</tbody></table></div></section>`).join("")}
    <p class="medical-note">${escapeHtml(MEDICAL_NOTE)}</p>
    <section class="print-sheet" aria-hidden="true">
      <header class="print-head"><div><p>ADHS &amp; Wechseljahre</p><h1>Vier-Wochen-Protokoll</h1></div><p>Stand: ${new Intl.DateTimeFormat("de-DE").format(new Date())}</p></header>
      <div class="print-intro">${["Seit wann", "Was ich mitbringe", "Was ich möchte"].map((label, index) => `<div><strong>${label}</strong>${escapeHtml(introValue(index))}</div>`).join("")}</div>
      <table class="print-protocol"><thead><tr><th class="week-cell">Woche</th><th class="day-cell">Tag</th><th>Schlaf</th><th>Reize</th><th>Konzentration</th><th class="note-cell">Notiz</th></tr></thead><tbody>${renderProtocolRows(false)}</tbody></table>
      <p class="print-medical">${escapeHtml(MEDICAL_NOTE)}</p>
    </section>
  </section>`;
}

function renderSettings() {
  return `<section class="screen">
    ${screenHead("Nur auf diesem Gerät", "Einstellungen")}
    <section class="settings-section"><h2>Daten sichern</h2><p>Ohne Account gibt es kein automatisches Backup. Wenn du das Gerät wechselst oder Browserdaten löschst, gehen deine Einträge verloren. Exportiere sie vorher als JSON-Datei.</p><div class="settings-actions"><button class="primary-button" type="button" data-action="export">Daten exportieren</button><button class="secondary-button" type="button" data-action="import">Daten importieren</button><button class="danger-button" type="button" data-action="delete">Alles löschen</button></div></section>
    <section class="settings-section"><h2>Eine Erinnerung</h2><p>Die App sendet keine Push-Nachrichten. Wenn du möchtest, erstellt sie einen einzigen täglichen Termin. Nach dem Öffnen und Bestätigen erinnert dich dein Gerätekalender.</p><label class="toggle-line"><input id="reminder-enabled" type="checkbox" ${state.reminder.enabled ? "checked" : ""}><span>Kalender-Erinnerung ausdrücklich einschalten</span></label><label class="field"><span>Uhrzeit</span><input id="reminder-time" type="time" value="${escapeHtml(state.reminder.time)}"></label><button class="secondary-button" type="button" data-action="calendar" ${state.reminder.enabled ? "" : "disabled"}>Kalenderdatei erstellen</button></section>
    <section class="settings-section"><h2>Auf den Startbildschirm</h2><p>Die App läuft im Browser; du musst nichts installieren. Für einen festen Platz und leichteren Offline-Zugriff kannst du sie auf den Startbildschirm legen.</p><button id="install-button" class="primary-button" type="button" data-action="install" ${deferredInstallPrompt ? "" : "hidden"}>App zum Home-Bildschirm hinzufügen</button><div class="card-flat"><h3>iPhone und iPad</h3><p>In Safari: Teilen → Zum Home-Bildschirm.</p><h3>Android</h3><p>In Chrome: Drei-Punkte-Menü → Zum Startbildschirm hinzufügen.</p></div></section>
    <section class="settings-section"><h2>Impressum &amp; Datenschutz</h2><p>Die zentralen Rechtstexte von Munich Publishing öffnen sich in einem neuen Browserfenster.</p><div class="legal-links"><a class="secondary-button" href="https://munichpublishing.de/impressum" target="_blank" rel="noopener">Impressum öffnen</a><a class="secondary-button" href="https://munichpublishing.de/Datenschutz" target="_blank" rel="noopener">Datenschutz öffnen</a></div><p class="privacy-note">Deine Einträge bleiben ausschließlich lokal in diesem Browser. Die App verwendet kein Konto, keine Analyse und lädt keine Ressourcen fremder Anbieter.</p></section>
  </section>`;
}

function render() {
  window.clearInterval(activeTimer);
  activeTimer = null;
  const [route, parameter] = routeParts();
  const night = route === "night" || (route === "today" && state?.onboardingDone && todayPhase() === "night");
  document.body.classList.toggle("night-mode", night);
  setHeader(route);
  let html;
  if (!state.onboardingDone && route !== "night" && route !== "audios") html = renderOnboarding();
  else if (route === "today") html = renderToday();
  else if (route === "audios") html = renderAudios();
  else if (route === "board") html = renderBoard();
  else if (route === "day") html = renderDay(parameter);
  else if (route === "tools") html = renderTools();
  else if (route === "check") html = renderCheck();
  else if (route === "tracker") html = renderTracker(state.currentDay);
  else if (route === "timer") html = renderTimer();
  else if (route === "six-timer") html = renderSixTimer();
  else if (route === "ramp") html = renderRamp();
  else if (route === "night") html = renderNight();
  else if (route === "protocol") html = renderProtocol();
  else if (route === "settings") html = renderSettings();
  else html = renderToday();
  app.innerHTML = html;
  window.scrollTo(0, 0);
  hydrateAudio();
  if (route === "ramp" && state.rampEnd) startRampTicker();
}

async function hydrateAudio() {
  const slots = [...document.querySelectorAll("[data-audio-day]")];
  await Promise.all(slots.map(async (slot) => {
    const day = Number(slot.dataset.audioDay);
    const title = slot.dataset.audioTitle;
    const path = audioPath(day);
    try {
      const response = await fetch(path, { method: "HEAD", cache: "no-store" });
      if (!response.ok || !slot.isConnected) return;
      slot.innerHTML = `<div class="audio-control"><button type="button" data-action="audio" data-src="${path}" aria-label="Audio ${day} abspielen">▶</button><span><strong>${title ? escapeHtml(title) : `Audio ${day}`}</strong><br><small>Audio ${day} · Impuls von rund zwei Minuten</small></span><audio preload="none" src="${path}"></audio></div>`;
    } catch {
      // Kein Player, solange die Datei nicht vorhanden ist.
    }
  }));
}

function submitTracker(form) {
  const day = Number(form.dataset.day);
  const formData = new FormData(form);
  const entry = {};
  content.tracker_zeilen.forEach((row) => {
    const value = formData.get(row.id);
    if (value) entry[row.id] = value;
  });
  state.tracker[day] = entry;
  state.currentDay = Math.max(state.currentDay, Math.min(21, day));
  saveState();
  showToast("Tracker gespeichert.");
  if (day >= 7 && !state.backupHintSeen) {
    state.backupHintSeen = true;
    saveState();
    showToast("Eine Woche ist erfasst. Den Datenexport findest du in Einstellungen.");
  }
  render();
}

function startSixTimer() {
  window.clearInterval(activeTimer);
  let remaining = 6;
  const number = document.querySelector("#six-number");
  const status = document.querySelector("#six-status");
  number.textContent = String(remaining);
  activeTimer = window.setInterval(() => {
    remaining -= 1;
    number.textContent = String(Math.max(remaining, 0));
    if (remaining <= 0) {
      window.clearInterval(activeTimer);
      activeTimer = null;
      status.textContent = "Fertig.";
    }
  }, 1000);
}

function startRampTicker() {
  window.clearInterval(activeTimer);
  activeTimer = window.setInterval(() => {
    if (!state.rampEnd || state.rampEnd <= Date.now()) {
      state.rampEnd = null;
      saveState();
      window.clearInterval(activeTimer);
      activeTimer = null;
    }
    render();
  }, 1000);
}

function exportState() {
  const payload = { app: "Der ANKER-Begleiter", exportedAt: new Date().toISOString(), data: state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `anker-begleiter-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Export erstellt.");
}

function downloadCalendar() {
  const [hour, minute] = state.reminder.time.split(":").map(Number);
  const start = new Date();
  start.setDate(start.getDate() + (start.getHours() > hour || (start.getHours() === hour && start.getMinutes() >= minute) ? 1 : 0));
  start.setHours(hour, minute, 0, 0);
  const stamp = (date) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}00`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Munich Publishing//ANKER-Begleiter//DE", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:anker-begleiter-${Date.now()}@local`, `DTSTART:${stamp(start)}`, "RRULE:FREQ=DAILY",
    "SUMMARY:Ein ruhiger ANKER-Moment", "DESCRIPTION:Öffne den ANKER-Begleiter, wenn es heute passt.",
    "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:Ein ruhiger ANKER-Moment", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "anker-erinnerung.ics";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Kalenderdatei erstellt. Öffne sie und bestätige den Termin.");
}

document.addEventListener("click", async (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    navigate(routeButton.dataset.route);
    return;
  }
  if (event.target.closest("#menu-open")) { areaMenu.showModal(); return; }
  if (event.target.closest("[data-close-dialog]")) { event.target.closest("dialog").close(); return; }
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if (action === "onboarding-choice") { state.onboardingChoice = actionButton.dataset.id; saveState(); render(); }
  else if (action === "reset-onboarding-choice") { state.onboardingChoice = null; saveState(); render(); }
  else if (action === "finish-onboarding" || action === "skip-onboarding") { state.onboardingDone = true; state.currentDay = 1; saveState(); navigate("today"); }
  else if (action === "phase") { phaseOverride = actionButton.dataset.phase; render(); }
  else if (action === "set-stage") { state.dayLevels[state.currentDay] = actionButton.dataset.label; saveState(); if (actionButton.dataset.stage === "survival") phaseOverride = "day"; render(); }
  else if (action === "mark-day") { const day = Number(actionButton.dataset.day); if (!state.usedDays.includes(day)) state.usedDays.push(day); state.currentDay = Math.min(21, Math.max(state.currentDay, day + (day < 21 ? 1 : 0))); saveState(); render(); }
  else if (action === "focus-night") { document.querySelector('[data-row="nacht"]')?.scrollIntoView({ behavior: "smooth", block: "center" }); document.querySelector('[name="nacht"]')?.focus(); }
  else if (action === "tracker-week") { trackerWeek = Number(actionButton.dataset.week); render(); }
  else if (action === "open-six-timer") navigate("six-timer");
  else if (action === "open-ramp") navigate("ramp");
  else if (action === "start-six") startSixTimer();
  else if (action === "start-ramp") { state.rampEnd = Date.now() + 60 * 60 * 1000; saveState(); render(); }
  else if (action === "stop-ramp") { state.rampEnd = null; saveState(); render(); }
  else if (action === "edit-ramp") { state.ramp = ["", "", ""]; state.rampEnd = null; saveState(); render(); }
  else if (action === "close-night") history.length > 1 ? history.back() : navigate("today");
  else if (action === "print-protocol") window.print();
  else if (action === "export") exportState();
  else if (action === "import") importFile.click();
  else if (action === "delete") confirmDialog.showModal();
  else if (action === "calendar") downloadCalendar();
  else if (action === "install" && deferredInstallPrompt) { deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; render(); }
  else if (action === "audio") {
    const player = actionButton.closest(".audio-control").querySelector("audio");
    const day = actionButton.closest("[data-audio-day]")?.dataset.audioDay || "";
    if (player.paused) {
      document.querySelectorAll(".audio-control audio").forEach((other) => {
        if (other === player || other.paused) return;
        other.pause();
        const otherButton = other.closest(".audio-control").querySelector("button");
        const otherDay = other.closest("[data-audio-day]")?.dataset.audioDay || "";
        otherButton.textContent = "▶";
        otherButton.setAttribute("aria-label", `Audio ${otherDay} abspielen`);
      });
      await player.play();
      actionButton.textContent = "Ⅱ";
      actionButton.setAttribute("aria-label", `Audio ${day} anhalten`);
    } else {
      player.pause();
      actionButton.textContent = "▶";
      actionButton.setAttribute("aria-label", `Audio ${day} abspielen`);
    }
  }
  else if (action === "continue-reentry") { reentryNeeded = false; saveState(); navigate(`day/${state.currentDay}`); }
  else if (action === "restart-reentry") { reentryRestart = true; render(); }
  else if (action === "finish-reentry") { reentryNeeded = false; reentryRestart = false; saveState(); navigate("today"); }
});

document.addEventListener("ended", (event) => {
  if (!event.target.matches(".audio-control audio")) return;
  const button = event.target.closest(".audio-control").querySelector("button");
  const day = event.target.closest("[data-audio-day]")?.dataset.audioDay || "";
  button.textContent = "▶";
  button.setAttribute("aria-label", `Audio ${day} abspielen`);
}, true);

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === "tracker-form") submitTracker(form);
  else if (form.id === "night-form") {
    const data = new FormData(form);
    state.nightLines = [0,1,2].map((index) => String(data.get(`night-${index}`) || "").trim());
    saveState(); showToast("Nachtplan gespeichert."); render();
  } else if (form.id === "restart-form") {
    state.restartPoint = String(new FormData(form).get("restart-point"));
    saveState(); showToast("Dein einer Punkt ist gespeichert.");
  } else if (form.id === "ramp-form") {
    const data = new FormData(form);
    state.ramp = [0,1,2].map((index) => String(data.get(`ramp-${index}`) || "").trim());
    saveState(); render();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "tool-search") {
    const query = event.target.value;
    const normalized = query.trim().toLocaleLowerCase("de");
    const chapters = content.kapitel.filter((chapter) => `${chapter.werkzeug} ${chapter.titel} ${chapter.werkzeug_text}`.toLocaleLowerCase("de").includes(normalized));
    document.querySelector("#tool-list").innerHTML = renderToolCards(chapters);
  }
  if (event.target.matches("[data-protocol]")) {
    const day = Number(event.target.dataset.day);
    state.protocol[day] ||= {};
    state.protocol[day][event.target.dataset.field] = event.target.value;
    saveState();
  }
  if (event.target.matches("[data-intro]")) {
    state.intro[Number(event.target.dataset.intro)] = event.target.value;
    saveState();
  }
  if (event.target.id === "reminder-enabled") {
    state.reminder.enabled = event.target.checked;
    saveState(); render();
  }
  if (event.target.id === "reminder-time") {
    state.reminder.time = event.target.value;
    saveState();
  }
});

document.querySelector("#tracker-day-select");
document.addEventListener("change", (event) => {
  if (event.target.id === "tracker-day-select") {
    state.currentDay = Number(event.target.value);
    saveState();
    render();
  }
});

confirmDialog.addEventListener("close", () => {
  if (confirmDialog.returnValue === "confirm") {
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    phaseOverride = null;
    navigate("today");
    showToast("Lokale Daten gelöscht.");
  }
});

importFile.addEventListener("change", async () => {
  const file = importFile.files?.[0];
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    const imported = payload.data || payload;
    if (!imported || imported.version !== 1) throw new Error("Unbekanntes Format");
    state = { ...defaultState(), ...imported, reminder: { ...defaultState().reminder, ...(imported.reminder || {}) } };
    saveState();
    showToast("Daten importiert.");
    render();
  } catch {
    showToast("Diese Datei konnte nicht importiert werden.");
  } finally {
    importFile.value = "";
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (routeName() === "settings") render();
});
window.addEventListener("hashchange", render);

async function init() {
  try {
    const [contentResponse, audioResponse] = await Promise.all([
      fetch("anker-inhalte.json"),
      fetch("audio-manifest.json")
    ]);
    if (!contentResponse.ok || !audioResponse.ok) throw new Error("Inhalte fehlen");
    content = await contentResponse.json();
    audioManifest = await audioResponse.json();
    state = loadState();
    if (state.lastSeen) {
      const gap = Date.now() - new Date(state.lastSeen).getTime();
      reentryNeeded = state.onboardingDone && gap > 7 * 24 * 60 * 60 * 1000;
    }
    state.lastSeen = new Date().toISOString();
    saveState();
    render();
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js?v=6").catch(() => {});
    }
  } catch (error) {
    app.innerHTML = `<section class="screen">${screenHead("Nicht geladen", "Die App konnte nicht geöffnet werden")}<p class="medical-note">Bitte lade die Seite neu. Deine lokalen Einträge bleiben erhalten.</p></section>`;
    console.error(error);
  }
}

window.__ANKER_APP__ = {
  getState: () => structuredClone(state),
  getContent: () => structuredClone(content),
  getAudioManifest: () => structuredClone(audioManifest),
  render,
  protocolValue
};

init();
