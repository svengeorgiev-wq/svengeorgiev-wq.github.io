"use strict";

const STORAGE_KEY = "fokus-21-state-v2";
const LEGACY_STORAGE_KEY = "fokus-21-state-v1";
const AUDIO_CACHE = "fokus-audios-v1";
const NAV_NAMES = Object.freeze({
  today: "Heute",
  days: "21 Tage",
  audios: "Audios",
  emergency: "Notfall-Guide"
});

const content = window.FOKUS_CONTENT;
if (!content?.days?.length || !content?.audios?.length || !content?.phases?.length) {
  throw new Error("Die Inhaltsdatei content.js fehlt oder ist unvollständig.");
}

const { days, audios, phases, guidePaths } = content;
const PROGRAM_DAY_COUNT = 21;
const MARKERS = Object.freeze({
  done: { symbol: "✓", label: "gemacht" },
  tried: { symbol: "○", label: "versucht" },
  skipped: { symbol: "×", label: "ausgelassen" }
});
const DEFAULT_STATE = Object.freeze({
  currentDay: 0,
  markers: {},
  reminderTime: "19:00",
  minimal: { date: "", enabled: false },
  energyByDay: {}
});

let state = loadState();
let activeView = readInitialView();
let deferredInstallPrompt = null;
let toastTimeout = 0;
let selectedGuidePath = "";
let timer = { interval: 0 };
timer = makeTimer(getDay(state.currentDay), false);

const els = {
  today: document.querySelector("#todayView"),
  days: document.querySelector("#daysView"),
  audios: document.querySelector("#audiosView"),
  emergency: document.querySelector("#emergencyView"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsDialog: document.querySelector("#settingsDialog"),
  reminderTime: document.querySelector("#reminderTime"),
  calendarButton: document.querySelector("#calendarButton"),
  installButton: document.querySelector("#installButton"),
  installHint: document.querySelector("#installHint"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  resetButton: document.querySelector("#resetButton"),
  resetDialog: document.querySelector("#resetDialog"),
  confirmResetButton: document.querySelector("#confirmResetButton"),
  toast: document.querySelector("#toast")
};

init();

function init() {
  els.reminderTime.value = state.reminderTime;
  bindGlobalEvents();
  renderAll();
  navigate(activeView, { updateUrl: false, focus: false });
  configureInstallExperience();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

function bindGlobalEvents() {
  document.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-nav]");
    if (navButton) navigate(navButton.dataset.nav);
  });

  document.addEventListener("play", (event) => {
    if (!(event.target instanceof HTMLMediaElement)) return;
    document.querySelectorAll("audio").forEach((audio) => {
      if (audio !== event.target) audio.pause();
    });
  }, true);

  els.settingsButton.addEventListener("click", () => els.settingsDialog.showModal());
  els.calendarButton.addEventListener("click", createCalendarReminder);
  els.exportButton?.addEventListener("click", exportProgress);
  els.importInput?.addEventListener("change", importProgress);
  els.resetButton.addEventListener("click", () => els.resetDialog.showModal());
  els.confirmResetButton.addEventListener("click", resetLocalData);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    configureInstallExperience();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    configureInstallExperience();
    showToast("Die App wurde installiert.");
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && timer.running) tickTimer();
  });
}

function renderAll() {
  renderToday();
  renderDays();
  renderAudios();
  renderEmergency();
}

function renderToday() {
  const day = getDay(state.currentDay);
  const phase = getPhase(day.phase);
  const marker = state.markers[String(day.day)] || "";
  const minimal = isMinimalToday();

  if (timer.day !== day.day) timer = makeTimer(day, minimal);

  els.today.innerHTML = `
    <article class="hero">
      <div class="day-topline">
        <div>
          <p class="eyebrow">${escapeHtml(day.day === 0 ? "Setup vor den 21 Tagen" : `${phase.title} · Tag ${day.day} von ${PROGRAM_DAY_COUNT}`)}</p>
          <h1 id="todayHeading" tabindex="-1">${escapeHtml(day.title)}</h1>
        </div>
        <div class="day-stepper" aria-label="Tag wechseln">
          <button type="button" id="previousDay" aria-label="Vorheriger Tag" ${day.day === 0 ? "disabled" : ""}>←</button>
          <button type="button" id="nextDay" aria-label="Nächster Tag" ${day.day === PROGRAM_DAY_COUNT ? "disabled" : ""}>→</button>
        </div>
      </div>
      <p class="hero-copy">${escapeHtml(day.goal)}</p>
      ${marker ? renderStatusPill(marker) : ""}
    </article>

    <div class="content-grid">
      <section class="card card--gold">
        <label class="minimal-switch">
          <span>
            <strong>Heute nur die Minimalversion</strong>
            <small>${formatDuration(day.minimalSeconds)} statt fünf Minuten. Das zählt vollständig.</small>
          </span>
          <input id="minimalToggle" type="checkbox" ${minimal ? "checked" : ""}>
          <span class="switch-track" aria-hidden="true"></span>
        </label>
      </section>

      ${minimal ? renderMinimalRoutine(day) : renderCompanionLoop(day)}
      ${day.day >= 13 ? renderEnergyCard(day) : ""}
      ${renderAudioCard(day)}
      ${renderTimerCard(day)}
      ${renderMarkerCard(day, marker)}
    </div>
  `;

  document.querySelector("#previousDay")?.addEventListener("click", () => selectDay(day.day - 1));
  document.querySelector("#nextDay")?.addEventListener("click", () => selectDay(day.day + 1));
  document.querySelector("#minimalToggle")?.addEventListener("change", toggleMinimal);
  document.querySelectorAll("[data-marker]").forEach((button) => button.addEventListener("click", setMarker));
  document.querySelectorAll("[data-energy]").forEach((button) => button.addEventListener("click", setEnergy));
  bindTimerControls();
  paintTimer();
}

function renderCompanionLoop(day) {
  return `
    <section class="card companion-card" id="routineCard">
      <p class="eyebrow">Buch · App · Workbook</p>
      <h2>Dein Ablauf für heute</h2>
      <ol class="companion-loop">
        <li>
          <span>1</span>
          <div><strong>Im Buch</strong><p>Öffne <em>Tag ${day.day}: ${escapeHtml(day.title)}</em>. Dort stehen Erklärung und vollständige 5-Minuten-Routine.</p></div>
        </li>
        <li>
          <span>2</span>
          <div><strong>In der App</strong><p>Hör den Audio-Snack, wenn Lesen gerade schwer ist, und lass den Fokus-Timer die Zeit für dich halten.</p></div>
        </li>
        <li>
          <span>3</span>
          <div><strong>Im Workbook · ${escapeHtml(day.workbookTitle)}</strong><p>${escapeHtml(day.workbookCue)}</p></div>
        </li>
      </ol>
      <p class="material-line"><strong>Bereitlegen:</strong> ${escapeHtml(day.material)}</p>
      <p class="privacy-cue">Deine persönlichen Gedanken bleiben im Workbook. Die App speichert nur Marker, Energiestufe und Einstellungen auf diesem Gerät.</p>
    </section>
  `;
}

function renderMinimalRoutine(day) {
  return `
    <section class="card card--sage" id="routineCard">
      <p class="eyebrow">Minimalversion · Tag ${day.day}</p>
      <h2>${formatDuration(day.minimalSeconds)} sind genug</h2>
      <p class="minimal-action">${escapeHtml(day.minimal)}</p>
      <p class="quiet-note">Kein Nachholen, kein Zusatzschritt. Danach darf für heute Schluss sein.</p>
    </section>
  `;
}

function renderEnergyCard(day) {
  const selected = state.energyByDay[String(day.day)] || "";
  const options = [
    ["green", "Grün"],
    ["yellow", "Gelb"],
    ["red", "Rot"]
  ];
  return `
    <section class="card">
      <p class="eyebrow">Energie-Tracking ab Tag 13</p>
      <h2>Energiestufe</h2>
      <p>Was passt heute? Die Farbe bewertet nichts; sie hilft dir nur, die passende Größe zu wählen.</p>
      <div class="energy-options" role="group" aria-label="Energiestufe für Tag ${day.day}">
        ${options.map(([value, label]) => `
          <button class="energy-option ${selected === value ? "is-active" : ""}" type="button" data-energy="${value}" aria-pressed="${selected === value}">${label}</button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAudioCard(day) {
  return `
    <section class="card audio-focus-card">
      <p class="eyebrow">Audio-Snack · ${escapeHtml(day.audioDuration)}</p>
      <h2>${escapeHtml(day.audioTitle)}</h2>
      <p>Ein kurzer Einstieg in den heutigen Schritt – keine Hörversion des Buchkapitels und keine zusätzliche Pflicht.</p>
      <audio class="audio-player" controls preload="metadata" src="${escapeHtml(day.audioSrc)}">Dein Browser kann dieses Audio nicht abspielen.</audio>
    </section>
  `;
}

function renderTimerCard(day) {
  const context = timer.mode === "guide" && timer.context ? timer.context : (timer.mode === "minimal" ? "Minimalversion" : "Deine 5-Minuten-Routine");
  return `
    <section class="card timer-card" aria-labelledby="timerHeading">
      <p class="eyebrow">${escapeHtml(context)}</p>
      <h2 id="timerHeading">Fokus-Timer</h2>
      <div class="timer-ring" id="timerRing" role="timer" aria-live="off">
        <span class="timer-time" id="timerTime">${formatTime(timer.remaining)}</span>
        <span class="timer-label" id="timerLabel">${timer.running ? "läuft" : "bereit"}</span>
      </div>
      <p class="timer-phase" id="timerPhase">${escapeHtml(getTimerPhase())}</p>
      <div class="button-row">
        <button class="button button--primary" id="timerStart" type="button">${timer.running ? "Pause" : timer.remaining < timer.duration ? "Weiter" : "Start"}</button>
        <button class="button button--secondary" id="timerReset" type="button">Neu</button>
      </div>
      <p class="quiet-note">Wenn die Zeit um ist, hör bewusst auf. Mehr ist heute nicht nötig.</p>
    </section>
  `;
}

function renderMarkerCard(day, marker) {
  return `
    <section class="card">
      <p class="eyebrow">Sichtbarer Gegenbeweis</p>
      <h2>Dein Erfolgsmarker</h2>
      <p>Wähle das Zeichen, das heute passt. Jedes Zeichen ist neutral und die Reihe läuft weiter.</p>
      <div class="marker-options" role="group" aria-label="Erfolgsmarker für Tag ${day.day}">
        ${Object.entries(MARKERS).map(([value, item]) => `
          <button class="marker-option marker-option--${value} ${marker === value ? "is-active" : ""}" type="button" data-marker="${value}" aria-pressed="${marker === value}">
            <span>${item.symbol}</span><strong>${item.label}</strong>
          </button>
        `).join("")}
      </div>
      <p class="quiet-note">Noch kein Zeichen? Auch das bleibt einfach leer.</p>
    </section>
  `;
}

function renderDays() {
  const markedProgramDays = Object.entries(state.markers).filter(([day, marker]) => Number(day) >= 1 && Number(day) <= 21 && MARKERS[marker]).length;
  const setupMarker = state.markers["0"] || "";

  els.days.innerHTML = `
    <article class="hero">
      <p class="eyebrow">Die Landkarte aus dem Buch</p>
      <div class="section-topline">
        <div>
          <h1 id="daysHeading" tabindex="-1">Deine 21 Tage</h1>
          <p class="hero-copy">Fünf Etappen bauen aufeinander auf. Lücken sind eingeplant: Du steigst einfach dort wieder ein, wo du gerade bist.</p>
        </div>
        <div class="progress-summary" aria-label="${markedProgramDays} von 21 Tagen mit Zeichen">
          <strong>${markedProgramDays}</strong><span>/ 21</span>
        </div>
      </div>
    </article>

    <section class="setup-row card card--gold">
      <div>
        <p class="eyebrow">Vor dem Programm</p>
        <h2>Tag 0 · Dein Setup</h2>
        <p>Startplatz, Minimalmaterial und dein Ausgangspunkt – Tag 0 zählt nicht zu den 21 Tagen.</p>
      </div>
      <button class="day-link-button ${setupMarker ? `has-marker marker-${setupMarker}` : ""}" type="button" data-open-day="0">
        ${setupMarker ? MARKERS[setupMarker].symbol : "0"}<span>Öffnen</span>
      </button>
    </section>

    <div class="phase-list">
      ${phases.filter((phase) => phase.id !== "setup").map((phase) => renderPhaseGroup(phase)).join("")}
    </div>

    <section class="card card--sage restart-card">
      <h2>Heute ist ein neuer Einstieg möglich.</h2>
      <p>Kein Nachholen, keine gerissene Kette. Öffne einfach den Tag, der jetzt zu dir passt.</p>
      <button class="button button--secondary" type="button" data-nav="today">Zu ${state.currentDay === 0 ? "Tag 0" : `Tag ${state.currentDay}`}</button>
    </section>
  `;

  els.days.querySelectorAll("[data-open-day]").forEach((button) => {
    button.addEventListener("click", () => {
      selectDay(Number(button.dataset.openDay));
      navigate("today");
    });
  });
}

function renderPhaseGroup(phase) {
  const phaseDays = days.filter((day) => day.phase === phase.id);
  return `
    <section class="phase-card" aria-labelledby="phase-${phase.id}">
      <div class="phase-heading">
        <span class="phase-index" aria-hidden="true">${phases.indexOf(phase)}</span>
        <div>
          <p class="eyebrow">${escapeHtml(phase.range)}</p>
          <h2 id="phase-${phase.id}">${escapeHtml(phase.title)}</h2>
          <p>${escapeHtml(phase.description)}</p>
        </div>
      </div>
      <div class="phase-days">
        ${phaseDays.map((day) => {
          const marker = state.markers[String(day.day)] || "";
          return `
            <button class="phase-day ${day.day === state.currentDay ? "is-current" : ""} ${marker ? `has-marker marker-${marker}` : ""}" type="button" data-open-day="${day.day}" aria-label="Tag ${day.day}: ${escapeHtml(day.title)}${marker ? `, ${MARKERS[marker].label}` : ""}">
              <span class="phase-day-number">${marker ? MARKERS[marker].symbol : day.day}</span>
              <span class="phase-day-title">${escapeHtml(day.title)}</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderAudios() {
  els.audios.innerHTML = `
    <article class="hero">
      <p class="eyebrow">Hören, wenn Lesen gerade zu viel ist</p>
      <h1 id="audiosHeading" tabindex="-1">Audio-Snacks</h1>
      <p class="hero-copy"><strong>Diese Audio-Snacks sind keine Hörversion des Buches.</strong> Sie erklären nicht das ganze Kapitel, sondern helfen dir in etwa zwei Minuten beim Einstieg in den jeweiligen Tag. Das Buch bleibt für das Warum da, das Workbook für deine persönlichen Ergebnisse.</p>
    </article>

    <section class="card audio-offline-card">
      <div>
        <p class="eyebrow">Optional · ungefähr 38 MB</p>
        <h2>Audios offline bereithalten</h2>
        <p>Lade alle 22 Snacks einmal auf dieses Gerät. Am besten im WLAN. Die App funktioniert auch ohne diesen Download.</p>
      </div>
      <button class="button button--secondary" id="offlineAudiosButton" type="button">Alle offline speichern</button>
    </section>

    <div class="audio-phase-list">
      ${phases.map((phase) => {
        const phaseAudios = audios.filter((audio) => audio.phase === phase.id);
        return `
          <section class="audio-phase" aria-labelledby="audio-phase-${phase.id}">
            <div class="audio-phase-heading">
              <p class="eyebrow">${escapeHtml(phase.range)}</p>
              <h2 id="audio-phase-${phase.id}">${escapeHtml(phase.title)}</h2>
            </div>
            <div class="audio-list">
              ${phaseAudios.map(renderAudioListItem).join("")}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;

  els.audios.querySelectorAll("[data-open-day]").forEach((button) => {
    button.addEventListener("click", () => {
      selectDay(Number(button.dataset.openDay));
      navigate("today");
    });
  });
  document.querySelector("#offlineAudiosButton")?.addEventListener("click", downloadAudios);
}

function renderAudioListItem(audio) {
  const number = String(audio.number).padStart(2, "0");
  return `
    <article class="audio-item audio-item--player">
      <button class="audio-day-button" type="button" data-open-day="${audio.number}" aria-label="${escapeHtml(audio.assignment)} öffnen">${number}</button>
      <div>
        <strong>${escapeHtml(audio.title)}</strong>
        <small>${escapeHtml(audio.assignment)} · Audio-Thema: ${escapeHtml(audio.topic)} · ${escapeHtml(audio.duration)}</small>
        <audio class="audio-player" controls preload="metadata" src="${escapeHtml(audio.src)}">Dein Browser kann dieses Audio nicht abspielen.</audio>
      </div>
    </article>
  `;
}

function renderEmergency() {
  const path = guidePaths.find((item) => item.id === selectedGuidePath);
  els.emergency.innerHTML = `
    <article class="hero">
      <p class="eyebrow">Wenn das System stehen bleibt</p>
      <h1 id="emergencyHeading" tabindex="-1">Notfall-Guide</h1>
      <p class="hero-copy">Wähle nur die Situation, die gerade am ehesten passt. Du holst nichts nach; jeder Weg endet bei einem kleinen nächsten Schritt.</p>
    </article>
    <section class="card guide-card">
      ${path ? renderGuideResult(path) : renderGuideChoices()}
    </section>
    <p class="quiet-note safety-note">Der Notfall-Guide ist für festgefahrene Alltagsmomente gedacht und ersetzt keine medizinische oder psychotherapeutische Hilfe. Wenn eine starke Belastung seit Wochen anhält, hol dir fachliche Unterstützung.</p>
  `;

  els.emergency.querySelectorAll("[data-guide-path]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedGuidePath = button.dataset.guidePath;
      renderEmergency();
      els.emergency.querySelector("h2")?.focus?.();
    });
  });
  document.querySelector("#guideBack")?.addEventListener("click", () => {
    selectedGuidePath = "";
    renderEmergency();
  });
  document.querySelector("#guideTimer")?.addEventListener("click", () => startGuideTimer(path));
}

function renderGuideChoices() {
  return `
    <p class="eyebrow">Sechs Wege zurück</p>
    <h2>Was hat dich aus dem System gebracht?</h2>
    <div class="guide-options">
      ${guidePaths.map((path) => `<button class="guide-option" type="button" data-guide-path="${path.id}">${escapeHtml(path.label)}</button>`).join("")}
    </div>
  `;
}

function renderGuideResult(path) {
  return `
    <div class="guide-result">
      <span class="result-duration">Dein nächster Schritt · ${formatDuration(path.seconds)}</span>
      <h2 tabindex="-1">${escapeHtml(path.title)}</h2>
      <p>${escapeHtml(path.action)}</p>
      <p class="guide-next"><strong>Danach:</strong> ${escapeHtml(path.next)}</p>
      <button class="button button--primary button--wide" id="guideTimer" type="button">Diesen Schritt jetzt starten</button>
    </div>
    <button class="text-button" id="guideBack" type="button">Andere Situation wählen</button>
  `;
}

function navigate(view, options = {}) {
  const safeView = Object.prototype.hasOwnProperty.call(NAV_NAMES, view) ? view : "today";
  activeView = safeView;

  document.querySelectorAll(".view").forEach((section) => section.classList.toggle("is-active", section.dataset.view === safeView));
  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.nav === safeView;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  if (options.updateUrl !== false) {
    const url = new URL(location.href);
    if (safeView === "today") url.searchParams.delete("view");
    else url.searchParams.set("view", safeView);
    history.replaceState(null, "", url);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  if (options.focus !== false) document.querySelector(`[data-view="${safeView}"] h1`)?.focus?.({ preventScroll: true });
}

function selectDay(dayNumber) {
  const nextDay = Math.min(PROGRAM_DAY_COUNT, Math.max(0, Number(dayNumber) || 0));
  state.currentDay = nextDay;
  saveState();
  timer = makeTimer(getDay(nextDay), isMinimalToday());
  renderToday();
  renderDays();
}

function toggleMinimal(event) {
  state.minimal = { date: todayKey(), enabled: event.target.checked };
  saveState();
  timer = makeTimer(getDay(state.currentDay), event.target.checked);
  renderToday();
  showToast(event.target.checked ? "Minimalversion ist aktiv." : "Die 5-Minuten-Routine ist sichtbar.");
}

function isMinimalToday() {
  return Boolean(state.minimal.enabled && state.minimal.date === todayKey());
}

function setMarker(event) {
  const key = String(state.currentDay);
  const value = event.currentTarget.dataset.marker;
  if (!MARKERS[value]) return;
  if (state.markers[key] === value) {
    delete state.markers[key];
    showToast(`Zeichen für Tag ${state.currentDay} entfernt.`);
  } else {
    state.markers[key] = value;
    showToast(`${MARKERS[value].symbol} ${MARKERS[value].label} für Tag ${state.currentDay}.`);
  }
  saveState();
  renderToday();
  renderDays();
}

function setEnergy(event) {
  const key = String(state.currentDay);
  const value = event.currentTarget.dataset.energy;
  if (state.energyByDay[key] === value) delete state.energyByDay[key];
  else state.energyByDay[key] = value;
  saveState();
  renderToday();
}

function bindTimerControls() {
  document.querySelector("#timerStart")?.addEventListener("click", toggleTimer);
  document.querySelector("#timerReset")?.addEventListener("click", () => {
    const day = getDay(state.currentDay);
    timer = timer.mode === "guide" ? resetTimer(timer.duration, day.day, false, "guide", timer.context) : makeTimer(day, isMinimalToday());
    renderToday();
  });
}

function makeTimer(day, minimal) {
  return resetTimer(minimal ? day.minimalSeconds : 300, day.day, false, minimal ? "minimal" : "full", "");
}

function resetTimer(seconds, day = state.currentDay, autostart = false, mode = "full", context = "") {
  if (timer?.interval) window.clearInterval(timer.interval);
  const next = { day, duration: seconds, remaining: seconds, endAt: 0, running: false, interval: 0, mode, context };
  timer = next;
  if (autostart) startTimer();
  return timer;
}

function toggleTimer() {
  if (timer.running) pauseTimer();
  else startTimer();
  renderToday();
}

function startTimer() {
  if (timer.remaining <= 0) timer.remaining = timer.duration;
  timer.running = true;
  timer.endAt = Date.now() + timer.remaining * 1000;
  window.clearInterval(timer.interval);
  timer.interval = window.setInterval(tickTimer, 250);
}

function pauseTimer() {
  if (!timer.running) return;
  timer.remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
  timer.running = false;
  timer.endAt = 0;
  window.clearInterval(timer.interval);
  timer.interval = 0;
}

function tickTimer() {
  if (!timer.running) return;
  timer.remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
  paintTimer();
  if (timer.remaining === 0) finishTimer();
}

function finishTimer() {
  timer.running = false;
  timer.endAt = 0;
  window.clearInterval(timer.interval);
  timer.interval = 0;
  paintTimer();
  playGentleTone();
  if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
  showToast("Zeit ist um. Das war genug.");
  const startButton = document.querySelector("#timerStart");
  if (startButton) startButton.textContent = "Nochmal";
}

function paintTimer() {
  const time = document.querySelector("#timerTime");
  const label = document.querySelector("#timerLabel");
  const ring = document.querySelector("#timerRing");
  const phase = document.querySelector("#timerPhase");
  if (!time || !label || !ring) return;
  time.textContent = formatTime(timer.remaining);
  label.textContent = timer.running ? "läuft" : timer.remaining === 0 ? "geschafft" : timer.remaining < timer.duration ? "pausiert" : "bereit";
  if (phase) phase.textContent = getTimerPhase();
  const elapsed = timer.duration ? (timer.duration - timer.remaining) / timer.duration : 0;
  ring.style.setProperty("--progress", `${Math.max(0, Math.min(1, elapsed)) * 360}deg`);
  ring.setAttribute("aria-label", `${formatTime(timer.remaining)} verbleibend`);
  document.title = timer.running ? `${formatTime(timer.remaining)} · Fokus-Timer` : "21-Tage-Fokus-Begleiter";
}

function getTimerPhase() {
  if (timer.mode === "guide") return timer.context || "Bleib nur bei diesem kleinen Schritt.";
  if (timer.mode === "minimal") return "Minimalversion · genau ein kleiner Handgriff";
  const elapsed = timer.duration - timer.remaining;
  if (elapsed < 60) return "Minute 0–1 · Einstieg";
  if (elapsed < 180) return "Minute 1–3 · ein Hauptschritt";
  if (elapsed < 240) return "Minute 3–4 · Ergebnis sichtbar machen";
  return "Minute 4–5 · bewusst aufhören";
}

function startGuideTimer(path) {
  if (!path) return;
  resetTimer(path.seconds, state.currentDay, true, "guide", path.title);
  renderToday();
  navigate("today");
  showToast(`${formatDuration(path.seconds)} gestartet.`);
}

function playGentleTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, context.currentTime);
    gain.gain.setValueAtTime(.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.12, context.currentTime + .03);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .8);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + .85);
  } catch {}
}

async function downloadAudios(event) {
  const button = event.currentTarget;
  if (!("caches" in window)) {
    showToast("Offline-Audios werden von diesem Browser nicht unterstützt.");
    return;
  }
  button.disabled = true;
  let saved = 0;
  try {
    const cache = await caches.open(AUDIO_CACHE);
    for (const audio of audios) {
      button.textContent = `Speichere ${saved + 1} von ${audios.length} …`;
      const url = new URL(audio.src, location.href).href;
      if (!(await cache.match(url))) {
        const response = await fetch(url, { cache: "reload" });
        if (!response.ok || response.status !== 200) throw new Error(`Audio ${audio.number} konnte nicht geladen werden.`);
        await cache.put(url, response.clone());
      }
      saved += 1;
    }
    button.textContent = "22 Audios offline gespeichert";
    showToast("Alle Audio-Snacks sind offline gespeichert.");
  } catch {
    button.disabled = false;
    button.textContent = "Download erneut versuchen";
    showToast("Der Audio-Download wurde unterbrochen. Bereits geladene Dateien bleiben erhalten.");
  }
}

function createCalendarReminder() {
  const time = els.reminderTime.value || "19:00";
  state.reminderTime = time;
  saveState();

  const [hours, minutes] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);
  if (start.getTime() < Date.now() - 60000) start.setDate(start.getDate() + 1);
  const end = new Date(start.getTime() + 10 * 60000);
  const stamp = formatIcsDate(new Date(), true);
  const uid = `fokus-21-${Date.now()}@tools.munichpublishing.de`;
  const appUrl = new URL("./", location.href).href.split("?")[0];
  const description = escapeIcs(`Öffne deinen heutigen Tag im 21-Tage-Fokus-Begleiter. Die Minimalversion zählt vollständig. ${appUrl}`);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Munich Publishing//21-Tage-Fokus-Begleiter//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    "RRULE:FREQ=DAILY;COUNT=21",
    "SUMMARY:Dein Fokus-Moment",
    `DESCRIPTION:${description}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:PT0M",
    "DESCRIPTION:Zeit für deinen Fokus-Moment",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  downloadBlob(ics, "21-tage-fokus-erinnerung.ics", "text/calendar;charset=utf-8");
  showToast("Kalenderdatei erstellt.");
}

function exportProgress() {
  const backup = JSON.stringify({ version: 2, savedAt: new Date().toISOString(), state }, null, 2);
  downloadBlob(backup, "21-tage-fokus-sicherung.json", "application/json;charset=utf-8");
  showToast("Lokale Sicherung erstellt.");
}

async function importProgress(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    state = normalizeState(parsed.state || parsed);
    saveState();
    timer = makeTimer(getDay(state.currentDay), isMinimalToday());
    els.reminderTime.value = state.reminderTime;
    renderAll();
    els.settingsDialog.close();
    navigate("today");
    showToast("Sicherung wurde eingelesen.");
  } catch {
    showToast("Diese Sicherungsdatei konnte nicht gelesen werden.");
  } finally {
    event.target.value = "";
  }
}

function downloadBlob(value, filename, type) {
  const blob = new Blob([value], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function configureInstallExperience() {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (standalone) {
    els.installHint.textContent = "Die App ist bereits auf deinem Home-Bildschirm geöffnet.";
    els.installButton.hidden = true;
    return;
  }

  els.installButton.hidden = false;
  if (deferredInstallPrompt) {
    els.installHint.textContent = "Installiere den Begleiter mit einem Tipp auf deinem Home-Bildschirm.";
    els.installButton.textContent = "Installieren";
    els.installButton.onclick = async () => {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      configureInstallExperience();
    };
  } else if (ios) {
    els.installHint.textContent = "Tippe in Safari auf Teilen und dann auf ‚Zum Home-Bildschirm‘.";
    els.installButton.textContent = "Installationshinweis";
    els.installButton.onclick = () => showToast("Safari: Teilen → Zum Home-Bildschirm");
  } else {
    els.installHint.textContent = "Nutze im Browsermenü ‚App installieren‘ oder ‚Zum Startbildschirm hinzufügen‘.";
    els.installButton.textContent = "Installationshinweis";
    els.installButton.onclick = () => showToast("Öffne das Browsermenü und wähle ‚App installieren‘.");
  }
}

function resetLocalData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  state = cloneDefaultState();
  selectedGuidePath = "";
  els.reminderTime.value = state.reminderTime;
  timer = makeTimer(getDay(0), false);
  renderAll();
  navigate("today");
  els.settingsDialog.close();
  showToast("Lokale Daten wurden zurückgesetzt.");
}

function loadState() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) return normalizeState(JSON.parse(current));

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const old = JSON.parse(legacy);
      const migrated = normalizeState({
        ...old,
        markers: Object.fromEntries((old.markedDays || []).map((day) => [String(day), "done"]))
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {}
  return cloneDefaultState();
}

function normalizeState(value) {
  const merged = { ...cloneDefaultState(), ...(value && typeof value === "object" ? value : {}) };
  merged.currentDay = Math.min(PROGRAM_DAY_COUNT, Math.max(0, Number(merged.currentDay) || 0));
  merged.markers = merged.markers && typeof merged.markers === "object"
    ? Object.fromEntries(Object.entries(merged.markers).filter(([day, marker]) => Number(day) >= 0 && Number(day) <= 21 && MARKERS[marker]))
    : {};
  merged.energyByDay = merged.energyByDay && typeof merged.energyByDay === "object" ? merged.energyByDay : {};
  merged.minimal = merged.minimal && typeof merged.minimal === "object" ? merged.minimal : { date: "", enabled: false };
  merged.reminderTime = /^\d{2}:\d{2}$/.test(merged.reminderTime) ? merged.reminderTime : "19:00";
  return merged;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast("Die lokale Speicherung ist in diesem Browser nicht verfügbar.");
  }
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function getDay(dayNumber) {
  return days.find((day) => day.day === Number(dayNumber)) || days[0];
}

function getPhase(id) {
  return phases.find((phase) => phase.id === id) || phases[0];
}

function renderStatusPill(marker) {
  const item = MARKERS[marker];
  return `<span class="status-pill status-pill--${marker}">${item.symbol} ${item.label}</span>`;
}

function readInitialView() {
  const view = new URL(location.href).searchParams.get("view");
  return Object.prototype.hasOwnProperty.call(NAV_NAMES, view) ? view : "today";
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds} Sekunden`;
  if (seconds === 60) return "60 Sekunden";
  if (seconds === 90) return "90 Sekunden";
  return `${Math.round(seconds / 60)} Minuten`;
}

function formatIcsDate(date, utc = false) {
  const value = utc ? new Date(date.getTime()) : date;
  const year = utc ? value.getUTCFullYear() : value.getFullYear();
  const month = (utc ? value.getUTCMonth() : value.getMonth()) + 1;
  const day = utc ? value.getUTCDate() : value.getDate();
  const hours = utc ? value.getUTCHours() : value.getHours();
  const minutes = utc ? value.getUTCMinutes() : value.getMinutes();
  const seconds = utc ? value.getUTCSeconds() : value.getSeconds();
  const formatted = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}${String(seconds).padStart(2, "0")}`;
  return utc ? `${formatted}Z` : formatted;
}

function escapeIcs(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  window.clearTimeout(toastTimeout);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2800);
}
