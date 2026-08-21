"use strict";

(() => {
  const { phases, days } = window.ADVENTS_AMPEL_CONTENT;
  const STORAGE_KEY = "advents-ampel-state-v1";
  const ROUTES = new Set(["today", "days", "audio", "help"]);
  const TONES = {
    green: { label: "Grün", lead: "Kapazität ist da", text: "Bereite heute vor, was später keine Entscheidung mehr brauchen soll. Arbeite mit der Tageskarte im Workbook." },
    yellow: { label: "Gelb", lead: "Es wird eng", text: "Kürze, statt neu zu planen. Nutze die kleinste Fassung des heutigen Werkzeugs und lass den Rest liegen." },
    red: { label: "Rot", lead: "Es ist gekippt", text: "Nicht sortieren, nicht aufholen. Nutze nur den vorentschiedenen Notgriff und versorge dich zuerst." }
  };

  const els = {
    main: document.querySelector("#mainContent"),
    sidebarDays: document.querySelector("#sidebarDays"),
    sidebarProgress: document.querySelector("#sidebarProgress"),
    settingsDialog: document.querySelector("#settingsDialog"),
    openSettings: document.querySelector("#openSettings"),
    exportButton: document.querySelector("#exportButton"),
    importInput: document.querySelector("#importInput"),
    installButton: document.querySelector("#installButton"),
    calendarButton: document.querySelector("#calendarButton"),
    reminderTime: document.querySelector("#reminderTime"),
    resetButton: document.querySelector("#resetButton"),
    toast: document.querySelector("#toast")
  };

  let state = loadState();
  let route = readRoute();
  let installPrompt = null;
  let toastTimer = 0;
  let timerInterval = 0;

  init();

  function init() {
    els.reminderTime.value = state.reminderTime;
    bindShellEvents();
    render();
    registerServiceWorker();
  }

  function bindShellEvents() {
    document.addEventListener("click", (event) => {
      const routeButton = event.target.closest("[data-route]");
      if (routeButton) {
        navigate(routeButton.dataset.route);
        return;
      }

      const dayButton = event.target.closest("[data-day]");
      if (dayButton) {
        state.currentDay = clampDay(dayButton.dataset.day);
        saveState();
        navigate("today");
      }
    });

    window.addEventListener("hashchange", () => {
      route = readRoute();
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
    });

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      installPrompt = event;
    });

    els.openSettings.addEventListener("click", () => els.settingsDialog.showModal());
    els.exportButton.addEventListener("click", exportState);
    els.importInput.addEventListener("change", importState);
    els.installButton.addEventListener("click", installApp);
    els.calendarButton.addEventListener("click", downloadCalendar);
    els.reminderTime.addEventListener("change", () => {
      state.reminderTime = /^\d{2}:\d{2}$/.test(els.reminderTime.value) ? els.reminderTime.value : "19:00";
      saveState();
    });
    els.resetButton.addEventListener("click", resetState);
  }

  function render() {
    window.clearInterval(timerInterval);
    renderSidebar();
    updateNav();

    if (route === "days") renderDays();
    else if (route === "audio") renderAudio();
    else if (route === "help") renderHelp();
    else renderToday();

    bindViewEvents();
    els.main.focus({ preventScroll: true });
  }

  function renderSidebar() {
    const completed = completedCount();
    els.sidebarProgress.innerHTML = `
      <div class="sidebar-progress">
        <div class="sidebar-progress__top"><strong>${completed}/31</strong><span>markiert</span></div>
        <div class="progress-track" aria-label="${completed} von 31 Tagen markiert"><i style="width:${(completed / 31) * 100}%"></i></div>
      </div>`;

    els.sidebarDays.innerHTML = days.map((day) => `
      <button class="sidebar-day ${day.day === state.currentDay ? "is-active" : ""} ${state.done[String(day.day)] ? "is-done" : ""}" type="button" data-day="${day.day}" aria-label="Tag ${day.day}: ${escapeHtml(day.title)}">
        <span class="sidebar-day__number">${String(day.day).padStart(2, "0")}</span>
        <span class="sidebar-day__title">${escapeHtml(day.title)}</span>
        <span class="sidebar-day__dot" aria-hidden="true"></span>
      </button>`).join("");
  }

  function updateNav() {
    document.querySelectorAll("[data-route]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.route === route);
      if (button.dataset.route === route) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }

  function renderToday() {
    const day = getDay(state.currentDay);
    const checkedTone = state.checks[String(day.day)] || "";
    const tone = checkedTone ? TONES[checkedTone] : null;
    const completed = completedCount();
    const audioMarkup = day.audio
      ? `<div class="audio-inline"><span class="eyebrow">Tages-Audio · ${day.duration}</span><audio controls preload="metadata" data-audio-day="${day.day}" src="${day.audio}">Dein Browser unterstützt die Audiowiedergabe nicht.</audio></div>`
      : `<div class="audio-unavailable">Audio ${day.day} ist vorbereitet und wird ergänzt, sobald die Datei vorliegt.</div>`;

    els.main.innerHTML = `
      <div class="view">
        <section class="hero">
          <div class="hero__copy">
            <span class="eyebrow">ADHS und Overthinking im Dezember</span>
            <h1>Heute reicht <span>heute.</span></h1>
            <p>31 geführte Tage, dein täglicher Ampel-Check und kurze Audio-Begleitung. Ohne Anmeldung, ohne Abo, ohne Streak-Druck.</p>
            <div class="hero__actions">
              <button class="button button--primary" type="button" data-scroll-today>Tag ${day.day} öffnen</button>
              <button class="button button--secondary" type="button" data-route="help">Ich brauche Ampel-Hilfe</button>
            </div>
          </div>
          <div class="hero__art"><img src="assets/book-cover-2026.png" alt="Buchcover ADHS und Overthinking bei Erwachsenen von Anna Lorenz"></div>
        </section>

        <div class="stats" aria-label="Fortschritt">
          <div class="stat-card"><small>Markiert</small><strong>${completed}</strong><span>von 31 Tagen</span></div>
          <div class="stat-card"><small>Aktueller Tag</small><strong>${day.day}</strong><span>${escapeHtml(day.title)}</span></div>
          <div class="stat-card"><small>Audios bereit</small><strong>15</strong><span>von 31 Dateien</span></div>
        </div>

        <div class="today-grid" id="todayCard">
          <section class="card">
            <div class="day-title-row">
              <div><span class="eyebrow">Tag ${day.day} · ${day.day}. Dezember</span><h2>${escapeHtml(day.title)}</h2><span class="day-meta">Kapitel ${day.chapter} · ${escapeHtml(day.tool)}</span></div>
              <span class="tone-pill tone-pill--${day.expected}">meist ${TONES[day.expected].label}</span>
            </div>
            <p class="impulse">${escapeHtml(day.impulse)}</p>
            <div class="book-cue">
              <span class="book-cue__icon" aria-hidden="true">B</span>
              <div><strong>Deine Tageskarte im Workbook</strong><p>${escapeHtml(day.reflection)} Persönliche Gedanken bleiben dort – die App merkt nur Ampelstand und Fortschritt.</p></div>
            </div>
            ${day.timer ? renderTimerMarkup(day) : ""}
            ${audioMarkup}
            <div class="day-actions">
              <button class="button button--secondary completion-button ${state.done[String(day.day)] ? "is-done" : ""}" type="button" data-complete-day="${day.day}">${state.done[String(day.day)] ? "✓ Tag markiert" : "Tag markieren"}</button>
              <div class="day-nav">
                <button class="button button--secondary" type="button" data-step-day="-1" ${day.day === 1 ? "disabled" : ""} aria-label="Vorheriger Tag">←</button>
                <button class="button button--secondary" type="button" data-step-day="1" ${day.day === 31 ? "disabled" : ""} aria-label="Nächster Tag">→</button>
              </div>
            </div>
          </section>

          <section class="card check-card">
            <span class="eyebrow">Täglicher Ampel-Check</span>
            <h2>Wo stehst du heute?</h2>
            <p>Nicht das Gefühl bewerten. Wähle nach dem sichtbaren Verhalten, das du heute an dir bemerkt hast.</p>
            <div class="signal-choice" role="group" aria-label="Ampelstand wählen">
              ${["green", "yellow", "red"].map((key) => `<button class="signal-button signal-button--${key} ${checkedTone === key ? "is-active" : ""}" type="button" data-tone="${key}" aria-pressed="${checkedTone === key}"><span aria-hidden="true"></span><strong>${TONES[key].label}</strong></button>`).join("")}
            </div>
            <div class="signal-response" aria-live="polite">
              ${tone ? `<strong>${tone.lead}</strong><p>${tone.text}</p>` : `<strong>Noch nichts gewählt</strong><p>Ein sichtbares Signal genügt. Du musst deinen Tag nicht erklären.</p>`}
            </div>
          </section>
        </div>
      </div>`;
  }

  function renderDays() {
    const completed = completedCount();
    els.main.innerHTML = `
      <div class="view">
        <header class="page-head"><div><span class="eyebrow">Dezember ohne Neustartdrama</span><h1>31 Tage</h1><p>Die Tagesnamen entsprechen den Karten im Workbook. Ausgefallene Tage bleiben einfach liegen – du gehst beim heutigen Tag weiter.</p></div><span class="status-pill status-pill--green">${completed}/31 markiert</span></header>
        ${phases.map((phase) => `
          <section class="phase-section">
            <div class="phase-head" style="--tone:var(--${phase.tone})"><span class="phase-mark">${phase.chapter}</span><div><h2>${escapeHtml(phase.title)}</h2><p>${phase.range} · Kapitel ${phase.chapter}</p></div></div>
            <div class="day-grid">
              ${days.filter((day) => day.chapter === phase.chapter).map((day) => `
                <button class="day-tile ${state.done[String(day.day)] ? "is-done" : ""}" type="button" data-day="${day.day}">
                  <span class="day-tile__top"><span class="day-tile__number">${String(day.day).padStart(2, "0")}</span><span class="day-tile__status">${state.done[String(day.day)] ? "✓ markiert" : TONES[day.expected].label}</span></span>
                  <strong>${escapeHtml(day.title)}</strong><small>${escapeHtml(day.tool)}</small>
                </button>`).join("")}
            </div>
          </section>`).join("")}
      </div>`;
  }

  function renderAudio() {
    els.main.innerHTML = `
      <div class="view">
        <section class="audio-hero"><div><span class="eyebrow">Kurze Begleitung für unterwegs</span><h1>Tägliche Audios</h1><p>Die Audios begleiten die Tageskarte; sie sind keine vorgelesene Buchfassung. Die ersten 15 Tage sind bereits verfügbar. Ein einmal vollständig geladenes Audio kann die App anschließend offline wiedergeben.</p></div><div class="audio-hero__mark" aria-hidden="true">♫</div></section>
        <div class="notice"><strong>15 von 31 Audios eingebunden.</strong> Die Plätze für Tag 16–31 stehen schon bereit und werden beim nächsten Inhaltspaket ergänzt.</div>
        <div class="audio-list">
          ${days.map((day) => `
            <article class="audio-card">
              <span class="audio-card__number">${String(day.day).padStart(2, "0")}</span>
              <div>
                <div class="audio-card__head"><div><h2>${escapeHtml(day.title)}</h2><p>Tag ${day.day} · ${escapeHtml(day.tool)}</p></div>${day.audio ? `<span class="availability">${day.duration}</span>` : `<span class="availability availability--waiting">folgt</span>`}</div>
                ${day.audio ? `<audio controls preload="metadata" data-audio-day="${day.day}" src="${day.audio}">Dein Browser unterstützt die Audiowiedergabe nicht.</audio>` : `<div class="audio-unavailable">Audio ${day.day} ist noch nicht eingebunden.</div>`}
              </div>
            </article>`).join("")}
        </div>
      </div>`;
  }

  function renderHelp() {
    els.main.innerHTML = `
      <div class="view">
        <section class="help-hero"><span class="eyebrow">Ein Signal reicht</span><h1>Nicht deuten. Ablesen.</h1><p>Die Advents-Ampel hängt an beobachtbarem Verhalten – nicht daran, wie gut du dich gerade einschätzen kannst.</p></section>
        <div class="help-grid">
          <section class="card help-card help-card--green"><div class="help-card__light"></div><h2>Grün</h2><p>Kapazität ist da. Jetzt werden Signale, Sätze und Ersatzlösungen vorbereitet.</p><ul><li>Eine Nachricht direkt beantworten</li><li>Etwas beim Vorbeigehen wegräumen</li><li>Nach dem Einkauf noch eine Sache schaffen</li></ul></section>
          <section class="card help-card help-card--yellow"><div class="help-card__light"></div><h2>Gelb</h2><p>Es wird eng. Jetzt wird gekürzt und nichts Neues geplant.</p><ul><li>Denselben Absatz mehrfach lesen</li><li>Eine gelesene Nachricht erneut öffnen</li><li>Drei Dinge anfangen, keines abschließen</li></ul></section>
          <section class="card help-card help-card--red"><div class="help-card__light"></div><h2>Rot</h2><p>Es ist gekippt. Jetzt gilt nur der vorentschiedene Notgriff.</p><ul><li>Im geparkten Auto sitzen bleiben</li><li>Zu allem zu- oder absagen</li><li>Zwei-Minuten-Dinge nicht mehr schaffen</li></ul></section>
        </div>
        <div class="help-actions">
          <section class="card"><span class="eyebrow">Wenn Lesen gerade zu viel ist</span><h2>60 Sekunden raus</h2><p>Geh an den vorher festgelegten Ort. Kein Gespräch, keine neue Entscheidung, nur sechzig Sekunden Abstand.</p><button class="button button--primary" type="button" data-quick-timer>60 Sekunden starten</button><div data-quick-timer-output class="timer-display" hidden>01:00</div></section>
          <section class="card"><span class="eyebrow">Täglich zur gleichen Zeit</span><h2>Kalender erinnern lassen</h2><p>Lege die tägliche Erinnerung einmalig in deinem Kalender an. Danach erinnert dich dein Kalender, nicht die App.</p><button class="button button--secondary" type="button" data-open-calendar>Kalender-Erinnerung einrichten</button></section>
        </div>
      </div>`;
  }

  function renderTimerMarkup(day) {
    return `<div class="card timer-card" data-timer-seconds="${day.timer}"><span class="eyebrow">Fokus-Timer</span><h3>${escapeHtml(day.timerLabel)}</h3><div class="timer-display" data-timer-display>${formatTime(day.timer)}</div><div class="timer-actions"><button class="button button--primary" type="button" data-timer-toggle>Starten</button><button class="button button--secondary" type="button" data-timer-reset>Zurücksetzen</button></div></div>`;
  }

  function bindViewEvents() {
    document.querySelector("[data-scroll-today]")?.addEventListener("click", () => document.querySelector("#todayCard")?.scrollIntoView({ behavior: "smooth", block: "start" }));

    document.querySelectorAll("[data-tone]").forEach((button) => button.addEventListener("click", () => {
      state.checks[String(state.currentDay)] = button.dataset.tone;
      saveState();
      render();
      document.querySelector(".check-card")?.scrollIntoView({ block: "nearest" });
    }));

    document.querySelector("[data-complete-day]")?.addEventListener("click", (event) => {
      const key = String(event.currentTarget.dataset.completeDay);
      state.done[key] = !state.done[key];
      if (!state.done[key]) delete state.done[key];
      saveState();
      render();
      showToast(state.done[key] ? "Tag markiert. Das reicht für heute." : "Markierung entfernt.");
    });

    document.querySelectorAll("[data-step-day]").forEach((button) => button.addEventListener("click", () => {
      state.currentDay = clampDay(state.currentDay + Number(button.dataset.stepDay));
      saveState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }));

    bindAudioEvents();
    bindTimer();

    document.querySelector("[data-quick-timer]")?.addEventListener("click", startQuickTimer);
    document.querySelector("[data-open-calendar]")?.addEventListener("click", () => els.settingsDialog.showModal());
  }

  function bindAudioEvents() {
    document.querySelectorAll("audio[data-audio-day]").forEach((audio) => {
      const key = String(audio.dataset.audioDay);
      audio.addEventListener("loadedmetadata", () => {
        const saved = Number(state.audioPositions[key]) || 0;
        if (saved > 2 && saved < audio.duration - 2) audio.currentTime = saved;
      }, { once: true });
      audio.addEventListener("play", () => {
        document.querySelectorAll("audio").forEach((other) => { if (other !== audio) other.pause(); });
      });
      audio.addEventListener("timeupdate", () => {
        const second = Math.floor(audio.currentTime);
        if (second > 0 && second % 5 === 0 && state.audioPositions[key] !== second) {
          state.audioPositions[key] = second;
          saveState();
        }
      });
      audio.addEventListener("ended", () => {
        delete state.audioPositions[key];
        saveState();
      });
    });
  }

  function bindTimer() {
    const card = document.querySelector("[data-timer-seconds]");
    if (!card) return;
    const total = Number(card.dataset.timerSeconds);
    let remaining = total;
    let running = false;
    const display = card.querySelector("[data-timer-display]");
    const toggle = card.querySelector("[data-timer-toggle]");

    toggle.addEventListener("click", () => {
      running = !running;
      toggle.textContent = running ? "Pausieren" : "Weiter";
      if (running) {
        const end = Date.now() + remaining * 1000;
        window.clearInterval(timerInterval);
        timerInterval = window.setInterval(() => {
          remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
          display.textContent = formatTime(remaining);
          if (remaining === 0) {
            window.clearInterval(timerInterval);
            running = false;
            toggle.textContent = "Noch einmal";
            showToast("Zeit ist um. Du darfst zurückkommen.");
          }
        }, 250);
      } else window.clearInterval(timerInterval);
    });

    card.querySelector("[data-timer-reset]").addEventListener("click", () => {
      window.clearInterval(timerInterval);
      running = false;
      remaining = total;
      display.textContent = formatTime(total);
      toggle.textContent = "Starten";
    });
  }

  function startQuickTimer(event) {
    const button = event.currentTarget;
    const output = document.querySelector("[data-quick-timer-output]");
    let remaining = 60;
    button.disabled = true;
    button.textContent = "Läuft …";
    output.hidden = false;
    output.textContent = formatTime(remaining);
    window.clearInterval(timerInterval);
    const end = Date.now() + 60000;
    timerInterval = window.setInterval(() => {
      remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      output.textContent = formatTime(remaining);
      if (remaining === 0) {
        window.clearInterval(timerInterval);
        button.disabled = false;
        button.textContent = "Noch einmal starten";
        showToast("60 Sekunden sind um.");
      }
    }, 250);
  }

  function navigate(nextRoute) {
    const safeRoute = ROUTES.has(nextRoute) ? nextRoute : "today";
    if (location.hash === `#${safeRoute}`) {
      route = safeRoute;
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
    } else location.hash = safeRoute;
  }

  function readRoute() {
    const value = location.hash.replace(/^#/, "");
    return ROUTES.has(value) ? value : "today";
  }

  function getDay(dayNumber) {
    return days.find((day) => day.day === Number(dayNumber)) || days[0];
  }

  function clampDay(value) {
    return Math.max(1, Math.min(31, Number(value) || 1));
  }

  function completedCount() {
    return Object.values(state.done).filter(Boolean).length;
  }

  function defaultDay() {
    const now = new Date();
    return now.getMonth() === 11 ? clampDay(now.getDate()) : 1;
  }

  function defaultState() {
    return { currentDay: defaultDay(), checks: {}, done: {}, audioPositions: {}, reminderTime: "19:00" };
  }

  function loadState() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return normalizeState(value);
    } catch {
      return defaultState();
    }
  }

  function normalizeState(value) {
    const base = defaultState();
    const safe = value && typeof value === "object" ? value : {};
    return {
      currentDay: clampDay(safe.currentDay || base.currentDay),
      checks: safe.checks && typeof safe.checks === "object" ? Object.fromEntries(Object.entries(safe.checks).filter(([key, tone]) => Number(key) >= 1 && Number(key) <= 31 && TONES[tone])) : {},
      done: safe.done && typeof safe.done === "object" ? Object.fromEntries(Object.entries(safe.done).filter(([key, done]) => Number(key) >= 1 && Number(key) <= 31 && done)) : {},
      audioPositions: safe.audioPositions && typeof safe.audioPositions === "object" ? safe.audioPositions : {},
      reminderTime: /^\d{2}:\d{2}$/.test(safe.reminderTime) ? safe.reminderTime : "19:00"
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      showToast("Die lokale Speicherung ist in diesem Browser nicht verfügbar.");
    }
  }

  function exportState() {
    const payload = { app: "advents-ampel", version: 1, exportedAt: new Date().toISOString(), state };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), `advents-ampel-sicherung-${dateStamp()}.json`);
    showToast("Sicherung wurde erstellt.");
  }

  async function importState(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      if (payload.app !== "advents-ampel" || !payload.state) throw new Error("invalid");
      state = normalizeState(payload.state);
      saveState();
      els.reminderTime.value = state.reminderTime;
      els.settingsDialog.close();
      render();
      showToast("Sicherung wurde übernommen.");
    } catch {
      showToast("Diese Datei ist keine gültige Advents-Ampel-Sicherung.");
    } finally {
      event.target.value = "";
    }
  }

  async function installApp() {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      return;
    }
    showToast("Im Browser-Menü „Zum Startbildschirm“ oder „App installieren“ wählen.");
  }

  function resetState() {
    if (!window.confirm("Alle Ampelstände, Markierungen und Audio-Positionen auf diesem Gerät löschen?")) return;
    state = defaultState();
    saveState();
    els.reminderTime.value = state.reminderTime;
    els.settingsDialog.close();
    render();
    showToast("Lokale Daten wurden zurückgesetzt.");
  }

  function downloadCalendar() {
    const [hours, minutes] = state.reminderTime.split(":").map(Number);
    const now = new Date();
    const year = now.getMonth() === 11 ? now.getFullYear() : now.getFullYear();
    const start = `${year}1201T${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}00`;
    const endDate = new Date(year, 11, 1, hours, minutes + 10, 0);
    const end = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, "0")}${String(endDate.getDate()).padStart(2, "0")}T${String(endDate.getHours()).padStart(2, "0")}${String(endDate.getMinutes()).padStart(2, "0")}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Munich Publishing//Advents-Ampel//DE", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT", `UID:advents-ampel-${year}@munichpublishing.de`, `DTSTAMP:${stamp}`, `DTSTART;TZID=Europe/Berlin:${start}`, `DTEND;TZID=Europe/Berlin:${end}`,
      "RRULE:FREQ=DAILY;COUNT=31", "SUMMARY:Advents-Ampel – Tagescheck", "DESCRIPTION:Öffne die Advents-Ampel und wähle Grün, Gelb oder Rot. Ein sichtbares Signal genügt.",
      "BEGIN:VALARM", "TRIGGER:-PT0M", "ACTION:DISPLAY", "DESCRIPTION:Zeit für deinen Advents-Ampel-Check", "END:VALARM", "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    downloadBlob(new Blob([ics], { type: "text/calendar;charset=utf-8" }), `advents-ampel-erinnerung-${year}.ics`);
    showToast("Kalenderdatei erstellt. Öffnen und den Termin bestätigen.");
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    navigator.serviceWorker.register("sw.js").catch(() => showToast("Offline-Modus konnte nicht aktiviert werden."));
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Math.ceil(seconds));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function dateStamp() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 3200);
  }
})();
