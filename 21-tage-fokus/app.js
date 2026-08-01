"use strict";

const STORAGE_KEY = "fokus-21-state-v1";
const NAV_NAMES = Object.freeze({
  today: "Heute",
  days: "21 Tage",
  audios: "Audios",
  emergency: "Notfall-Guide"
});

const content = window.FOKUS_CONTENT;
if (!content?.days?.length || !content?.audios?.length) {
  throw new Error("Die Inhaltsdatei content.js fehlt oder ist unvollständig.");
}

const { days, audios, guideQuestions, guideResults } = content;
const DAY_COUNT = days.length;
const DEFAULT_STATE = Object.freeze({
  currentDay: 1,
  markedDays: [],
  reminderTime: "19:00",
  minimal: { date: "", enabled: false },
  energyByDay: {}
});

let state = loadState();
let activeView = readInitialView();
let deferredInstallPrompt = null;
let toastTimeout = 0;
let guideAnswers = [];
let timer = {
  day: state.currentDay,
  duration: days[state.currentDay - 1].timerSeconds,
  remaining: days[state.currentDay - 1].timerSeconds,
  endAt: 0,
  running: false,
  interval: 0
};

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

  els.settingsButton.addEventListener("click", () => els.settingsDialog.showModal());
  els.calendarButton.addEventListener("click", createCalendarReminder);
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
  const day = days[state.currentDay - 1];
  const marked = state.markedDays.includes(day.day);
  const minimal = isMinimalToday();

  if (timer.day !== day.day) resetTimer(minimal ? 60 : day.timerSeconds, day.day, false);

  els.today.innerHTML = `
    <article class="hero">
      <div class="day-topline">
        <div>
          <p class="eyebrow">${escapeHtml(NAV_NAMES.today)} · ${day.day} von ${DAY_COUNT}</p>
          <h1 id="todayHeading">${escapeHtml(day.title)}</h1>
        </div>
        <div class="day-stepper" aria-label="Tag wechseln">
          <button type="button" id="previousDay" aria-label="Vorheriger Tag" ${day.day === 1 ? "disabled" : ""}>←</button>
          <button type="button" id="nextDay" aria-label="Nächster Tag" ${day.day === DAY_COUNT ? "disabled" : ""}>→</button>
        </div>
      </div>
      <p class="hero-copy">${escapeHtml(day.workbookHint)}</p>
      ${marked ? '<span class="status-pill">✓ Für dich markiert</span>' : ""}
    </article>

    <div class="content-grid">
      <section class="card card--gold">
        <label class="minimal-switch">
          <span>
            <strong>Heute nur 60 Sekunden</strong>
            <small>Die vollständige Routine verschwindet. Die Minimalversion zählt genauso.</small>
          </span>
          <input id="minimalToggle" type="checkbox" ${minimal ? "checked" : ""}>
          <span class="switch-track" aria-hidden="true"></span>
        </label>
      </section>

      ${minimal ? renderMinimalRoutine(day) : renderFullRoutine(day)}
      ${day.day >= 13 ? renderEnergyCard(day) : ""}
      ${renderAudioCard(day)}
      ${renderTimerCard(day, minimal)}

      <section class="card">
        <h2>Dein Marker</h2>
        <p>${marked ? "Die Markierung ist gesetzt. Du kannst sie jederzeit wieder entfernen." : "Wenn es für heute genug war, darfst du dieses Kästchen markieren."}</p>
        <button class="button ${marked ? "button--secondary" : "button--primary"} button--wide" id="markDayButton" type="button">
          ${marked ? "Markierung entfernen" : "Tag markieren"}
        </button>
      </section>
    </div>
  `;

  document.querySelector("#previousDay")?.addEventListener("click", () => selectDay(day.day - 1));
  document.querySelector("#nextDay")?.addEventListener("click", () => selectDay(day.day + 1));
  document.querySelector("#minimalToggle")?.addEventListener("change", toggleMinimal);
  document.querySelector("#markDayButton")?.addEventListener("click", toggleDayMark);
  document.querySelectorAll("[data-energy]").forEach((button) => button.addEventListener("click", setEnergy));
  bindTimerControls();
  paintTimer();
}

function renderFullRoutine(day) {
  return `
    <section class="card" id="routineCard">
      <div class="routine-copy">
        <span class="routine-number" aria-hidden="true">${day.day}</span>
        <div>
          <p class="eyebrow">Deine heutige Routine</p>
          <h2>Bereit, wenn du es bist</h2>
          <p>${escapeHtml(day.routine)}</p>
        </div>
      </div>
      ${day.placeholder ? '<p class="placeholder-note"><strong>Inhaltsplatzhalter:</strong> Der genaue Tagesauftrag wird nach dem Abgleich mit dem Manuskript eingesetzt.</p>' : ""}
    </section>
  `;
}

function renderMinimalRoutine(day) {
  return `
    <section class="card card--sage" id="routineCard">
      <p class="eyebrow">Minimalversion · Tag ${day.day}</p>
      <h2>60 Sekunden sind genug</h2>
      <p>${escapeHtml(day.minimal)}</p>
      ${day.placeholder ? '<p class="placeholder-note"><strong>Inhaltsplatzhalter:</strong> Die genaue 60-Sekunden-Variante wird aus dem Manuskript ergänzt.</p>' : ""}
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
      <p class="eyebrow">Ab Tag 13</p>
      <h2>Energiestufe</h2>
      <p>Was passt heute am ehesten? Die Auswahl bewertet nichts — sie hilft nur bei der Orientierung.</p>
      <div class="energy-options" role="group" aria-label="Energiestufe für Tag ${day.day}">
        ${options.map(([value, label]) => `
          <button class="energy-option ${selected === value ? "is-active" : ""}" type="button" data-energy="${value}" aria-pressed="${selected === value}">${label}</button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAudioCard(day) {
  const audio = audios.find((item) => item.number === day.audio) || { number: day.audio, title: `Audio ${day.audio}`, src: "" };
  return `
    <section class="card">
      <p class="eyebrow">Audio ${audio.number}</p>
      <h2>Audio anhören</h2>
      <p>${audio.src ? escapeHtml(audio.title) : `Hier erscheint die Audio-Begleitung für Tag ${day.day}, sobald die Aufnahme vorliegt.`}</p>
      ${audio.src
        ? `<audio class="audio-player" controls preload="metadata" src="${escapeHtml(audio.src)}">Dein Browser kann dieses Audio nicht abspielen.</audio>`
        : '<button class="button button--secondary button--wide" type="button" disabled>Audio folgt</button>'}
    </section>
  `;
}

function renderTimerCard(day, minimal) {
  const presets = minimal ? [[60, "60 Sek."]] : [[300, "5 Min."], [120, "2 Min."], [90, "90 Sek."]];
  return `
    <section class="card timer-card" aria-labelledby="timerHeading">
      <p class="eyebrow">Tag ${day.day}</p>
      <h2 id="timerHeading">Fokus-Timer</h2>
      <div class="timer-ring" id="timerRing" role="timer" aria-live="off">
        <span class="timer-time" id="timerTime">${formatTime(timer.remaining)}</span>
        <span class="timer-label" id="timerLabel">${timer.running ? "läuft" : "bereit"}</span>
      </div>
      <div class="timer-presets" aria-label="Timerdauer">
        ${presets.map(([seconds, label]) => `<button class="preset-button ${timer.duration === seconds ? "is-active" : ""}" type="button" data-duration="${seconds}" ${timer.running ? "disabled" : ""}>${label}</button>`).join("")}
      </div>
      <div class="button-row" style="margin-top:1rem">
        <button class="button button--primary" id="timerStart" type="button">${timer.running ? "Pause" : timer.remaining < timer.duration ? "Weiter" : "Start"}</button>
        <button class="button button--secondary" id="timerReset" type="button">Neu</button>
      </div>
    </section>
  `;
}

function renderDays() {
  els.days.innerHTML = `
    <article class="hero">
      <p class="eyebrow">Dein Überblick</p>
      <div class="section-topline">
        <div>
          <h1 id="daysHeading">21 Tage</h1>
          <p class="hero-copy">Ein leeres Kästchen ist nur ein leeres Kästchen. Keine verlorene Serie, nichts nachzuholen.</p>
        </div>
        <div class="progress-summary" aria-label="${state.markedDays.length} von 21 Tagen markiert">
          <strong>${state.markedDays.length}</strong><span>/ 21</span>
        </div>
      </div>
    </article>
    <section class="card" style="margin-top:1rem">
      <div class="day-grid" aria-label="Tage auswählen">
        ${days.map((day) => {
          const marked = state.markedDays.includes(day.day);
          return `<button class="day-cell ${day.day === state.currentDay ? "is-current" : ""} ${marked ? "is-marked" : ""}" type="button" data-day="${day.day}" aria-label="Tag ${day.day}${marked ? ", markiert" : ""}" aria-pressed="${marked}">${day.day}</button>`;
        }).join("")}
      </div>
      <p class="quiet-note">Tippe auf einen Tag, um ihn unter <strong>Heute</strong> zu öffnen. Das öffnet den Tag nur — es markiert ihn nicht.</p>
    </section>
    <section class="card card--sage" style="margin-top:1rem">
      <h2>Ein neuer Einstieg ist immer möglich.</h2>
      <p>Du darfst Lücken lassen, Tage wiederholen oder dort weitermachen, wo du gerade bist.</p>
      <button class="button button--secondary" type="button" data-nav="today">Zu Tag ${state.currentDay}</button>
    </section>
  `;

  els.days.querySelectorAll("[data-day]").forEach((button) => {
    button.addEventListener("click", () => {
      selectDay(Number(button.dataset.day));
      navigate("today");
    });
  });
}

function renderAudios() {
  els.audios.innerHTML = `
    <article class="hero">
      <p class="eyebrow">Hören statt lesen</p>
      <h1 id="audiosHeading">Audios</h1>
      <p class="hero-copy">Die 24 Audio-Plätze sind vorbereitet. Sobald die Dateien vorliegen, werden Titel und Zuordnung aus dem Manuskript übernommen.</p>
    </article>
    <section class="audio-list" aria-label="${audios.length} Audio-Plätze">
      ${audios.map((audio) => {
        return `
          <article class="audio-item">
            <span class="audio-number">${audio.number}</span>
            <div><strong>${escapeHtml(audio.title)}</strong><small>${escapeHtml(audio.assignment)} · ${audio.src ? "verfügbar" : "folgt"}</small></div>
          </article>
        `;
      }).join("")}
    </section>
  `;
}

function renderEmergency() {
  const step = guideAnswers.length;
  const done = step >= guideQuestions.length;
  const result = done ? getGuideResult() : null;

  els.emergency.innerHTML = `
    <article class="hero">
      <p class="eyebrow">Wenn gerade nichts geht</p>
      <h1 id="emergencyHeading">Notfall-Guide</h1>
      <p class="hero-copy">Drei kurze Fragen. Kein Analysieren, nur das wählen, was gerade am ehesten passt.</p>
    </article>
    <section class="card" style="margin-top:1rem">
      <div class="guide-progress" aria-label="${Math.min(step, 3)} von 3 Fragen beantwortet">
        ${[0, 1, 2].map((index) => `<span class="${index < step ? "is-done" : ""}"></span>`).join("")}
      </div>
      ${done ? renderGuideResult(result) : renderGuideQuestion(guideQuestions[step], step)}
    </section>
    <p class="quiet-note">Dieser Wegweiser ist für festgefahrene Alltagsmomente gedacht und ersetzt keine medizinische oder psychotherapeutische Hilfe.</p>
  `;

  els.emergency.querySelectorAll("[data-guide-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      guideAnswers.push(button.dataset.guideAnswer);
      renderEmergency();
      els.emergency.querySelector("h2")?.focus?.();
    });
  });

  document.querySelector("#guideBack")?.addEventListener("click", () => {
    guideAnswers.pop();
    renderEmergency();
  });
  document.querySelector("#guideRestart")?.addEventListener("click", () => {
    guideAnswers = [];
    renderEmergency();
  });
  document.querySelector("#guideTimer")?.addEventListener("click", startGuideTimer);
}

function renderGuideQuestion(question, index) {
  return `
    <p class="eyebrow">Frage ${index + 1} von 3</p>
    <h2 tabindex="-1">${escapeHtml(question.title)}</h2>
    <div class="guide-options">
      ${question.options.map((option) => `<button class="guide-option" type="button" data-guide-answer="${option.value}">${escapeHtml(option.label)}</button>`).join("")}
    </div>
    ${index > 0 ? '<button class="text-button" id="guideBack" type="button" style="margin-top:1rem">Eine Frage zurück</button>' : ""}
  `;
}

function renderGuideResult(result) {
  const duration = Number(guideAnswers[2]);
  return `
    <div class="guide-result">
      <span class="result-duration">Dein nächster Schritt · ${duration === 60 ? "60 Sekunden" : "2 Minuten"}</span>
      <h2 tabindex="-1">${escapeHtml(result.title)}</h2>
      <p>${escapeHtml(result.text)}</p>
      <button class="button button--primary button--wide" id="guideTimer" type="button">Jetzt Fokus-Timer starten</button>
    </div>
    ${content.guidePlaceholder ? '<p class="placeholder-note"><strong>Vorläufiger Weg:</strong> Fragen und sechs Szenarien werden nach dem Abgleich mit dem Notfall-Kapitel final ersetzt.</p>' : ""}
    <button class="text-button" id="guideRestart" type="button" style="margin-top:1rem">Von vorn beginnen</button>
  `;
}

function getGuideResult() {
  return guideResults[`${guideAnswers[0]}-${guideAnswers[1]}`] || guideResults["low-settle"];
}

function startGuideTimer() {
  const duration = Number(guideAnswers[2]) || 60;
  if (duration === 60 && !isMinimalToday()) {
    state.minimal = { date: todayKey(), enabled: true };
    saveState();
  }
  resetTimer(duration, state.currentDay, true);
  renderToday();
  navigate("today");
  showToast(`${formatDuration(duration)} gestartet.`);
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
  const nextDay = Math.min(DAY_COUNT, Math.max(1, dayNumber));
  state.currentDay = nextDay;
  saveState();
  const seconds = isMinimalToday() ? 60 : days[nextDay - 1].timerSeconds;
  resetTimer(seconds, nextDay, false);
  renderToday();
  renderDays();
}

function toggleMinimal(event) {
  state.minimal = { date: todayKey(), enabled: event.target.checked };
  saveState();
  resetTimer(event.target.checked ? 60 : days[state.currentDay - 1].timerSeconds, state.currentDay, false);
  renderToday();
  showToast(event.target.checked ? "Minimalversion ist aktiv." : "Vollständige Routine ist sichtbar.");
}

function isMinimalToday() {
  return Boolean(state.minimal.enabled && state.minimal.date === todayKey());
}

function toggleDayMark() {
  const day = state.currentDay;
  if (state.markedDays.includes(day)) {
    state.markedDays = state.markedDays.filter((item) => item !== day);
    showToast(`Markierung für Tag ${day} entfernt.`);
  } else {
    state.markedDays = [...state.markedDays, day].sort((a, b) => a - b);
    showToast(`Tag ${day} ist markiert.`);
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
  document.querySelectorAll("[data-duration]").forEach((button) => {
    button.addEventListener("click", () => resetTimer(Number(button.dataset.duration), state.currentDay, false, true));
  });
  document.querySelector("#timerStart")?.addEventListener("click", toggleTimer);
  document.querySelector("#timerReset")?.addEventListener("click", () => resetTimer(timer.duration, state.currentDay, false, true));
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

function resetTimer(seconds, day = state.currentDay, autostart = false, rerender = false) {
  window.clearInterval(timer.interval);
  timer = { day, duration: seconds, remaining: seconds, endAt: 0, running: false, interval: 0 };
  if (autostart) startTimer();
  if (rerender) renderToday();
}

function paintTimer() {
  const time = document.querySelector("#timerTime");
  const label = document.querySelector("#timerLabel");
  const ring = document.querySelector("#timerRing");
  if (!time || !label || !ring) return;
  time.textContent = formatTime(timer.remaining);
  label.textContent = timer.running ? "läuft" : timer.remaining === 0 ? "geschafft" : timer.remaining < timer.duration ? "pausiert" : "bereit";
  const elapsed = timer.duration ? (timer.duration - timer.remaining) / timer.duration : 0;
  ring.style.setProperty("--progress", `${Math.max(0, Math.min(1, elapsed)) * 360}deg`);
  ring.setAttribute("aria-label", `${formatTime(timer.remaining)} verbleibend`);
  document.title = timer.running ? `${formatTime(timer.remaining)} · Fokus-Timer` : "21-Tage-Fokus-Begleiter";
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
  const description = escapeIcs(`Öffne deinen heutigen Tag im 21-Tage-Fokus-Begleiter. Deine Minimalversion zählt genauso. ${appUrl}`);

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

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "21-tage-fokus-erinnerung.ics";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  showToast("Kalenderdatei erstellt.");
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
    els.installButton.textContent = "Anleitung verstanden";
    els.installButton.onclick = () => showToast("Safari: Teilen → Zum Home-Bildschirm");
  } else {
    els.installHint.textContent = "Nutze im Browsermenü ‚App installieren‘ oder ‚Zum Startbildschirm hinzufügen‘.";
    els.installButton.textContent = "Installationshinweis";
    els.installButton.onclick = () => showToast("Öffne das Browsermenü und wähle ‚App installieren‘.");
  }
}

function resetLocalData() {
  localStorage.removeItem(STORAGE_KEY);
  state = cloneDefaultState();
  guideAnswers = [];
  els.reminderTime.value = state.reminderTime;
  resetTimer(days[0].timerSeconds, 1, false);
  renderAll();
  navigate("today");
  els.settingsDialog.close();
  showToast("Lokale Daten wurden zurückgesetzt.");
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const merged = { ...cloneDefaultState(), ...saved };
    merged.currentDay = Math.min(DAY_COUNT, Math.max(1, Number(merged.currentDay) || 1));
    merged.markedDays = Array.isArray(merged.markedDays)
      ? [...new Set(merged.markedDays.map(Number).filter((day) => day >= 1 && day <= DAY_COUNT))]
      : [];
    merged.energyByDay = merged.energyByDay && typeof merged.energyByDay === "object" ? merged.energyByDay : {};
    merged.minimal = merged.minimal && typeof merged.minimal === "object" ? merged.minimal : { date: "", enabled: false };
    return merged;
  } catch {
    return cloneDefaultState();
  }
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
  toastTimeout = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}
