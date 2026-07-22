(() => {
  "use strict";

  const { weeks, days, tools, supportTools, sosRoutes } = window.APP_DATA;
  const STORAGE_KEY = "adhs-overthinking-21-v1";
  const DEFAULT_STATE = { version: 1, activeDay: 1, entries: {}, supportEntries: {}, startedAt: null };
  const main = document.querySelector("#mainContent");
  const sidebarProgress = document.querySelector("#sidebarProgress");
  const sidebarDays = document.querySelector("#sidebarDays");
  const dataDialog = document.querySelector("#dataDialog");
  const toast = document.querySelector("#toast");
  let state = loadState();
  let toolFilter = "Alle";
  let timerState = null;
  let toastTimeout = null;

  init();

  function init() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    document.addEventListener("click", handleClick);
    main.addEventListener("input", handleEntryInput);
    main.addEventListener("change", handleEntryInput);
    window.addEventListener("hashchange", render);
    document.querySelector("#openDataButton").addEventListener("click", () => dataDialog.showModal());
    document.querySelector("#exportFileButton").addEventListener("click", exportFile);
    document.querySelector("#copyCodeButton").addEventListener("click", copyTransferCode);
    document.querySelector("#importCodeButton").addEventListener("click", importTransferCode);
    document.querySelector("#importFileInput").addEventListener("change", importFile);
    document.querySelector("#resetButton").addEventListener("click", resetData);
    if (!location.hash) history.replaceState(null, "", "#today");
    render();
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  function render() {
    stopTimer();
    renderSidebar();
    const route = parseRoute();
    setActiveNavigation(route.name);
    if (route.name === "day") renderDay(route.id);
    else if (route.name === "plan") renderPlan();
    else if (route.name === "tools") renderTools();
    else if (route.name === "tool") renderTool(route.id);
    else if (route.name === "sos") renderSos(route.id);
    else if (route.name === "progress") renderProgress();
    else renderToday();
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setTimeout(() => window.scrollTo(0, 0), 0);
  }

  function parseRoute() {
    const hash = location.hash.replace(/^#/, "");
    if (/^day-\d+$/.test(hash)) return { name: "day", id: clamp(Number(hash.split("-")[1]), 1, 21) };
    if (/^tool-\d+$/.test(hash)) return { name: "tool", id: clamp(Number(hash.split("-")[1]), 1, 26) };
    if (hash.startsWith("sos-")) return { name: "sos", id: hash.slice(4) };
    if (["today", "plan", "tools", "sos", "progress"].includes(hash)) return { name: hash };
    return { name: "today" };
  }

  function setActiveNavigation(routeName) {
    const navName = routeName === "day" ? "plan" : routeName === "tool" ? "tools" : routeName;
    document.querySelectorAll("[data-route]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.route === navName);
    });
  }

  function renderSidebar() {
    const done = doneCount();
    const percent = Math.round((done / days.length) * 100);
    sidebarProgress.innerHTML = `
      <div class="progress-head"><span>Dein Plan</span><strong>${done}/21</strong></div>
      <div class="progress-track" aria-label="${percent} Prozent abgeschlossen"><i style="width:${percent}%"></i></div>
      <p>${progressMessage(done)}</p>`;

    sidebarDays.innerHTML = weeks.map((week) => `
      <section class="sidebar-week" style="--week-color:${week.color}">
        <div class="sidebar-week__title"><i></i>Woche ${week.id} · ${escapeHtml(week.title)}</div>
        ${days.filter((day) => day.week === week.id).map((day) => {
          const entry = getEntry(day.day);
          const active = parseRoute().name === "day" && parseRoute().id === day.day;
          return `<button class="sidebar-day ${entry.done ? "is-done" : ""} ${active ? "is-active" : ""}" type="button" data-hash="day-${day.day}" aria-label="Tag ${day.day}: ${escapeHtml(day.title)}${entry.done ? ", erledigt" : ""}">
            <span class="sidebar-day__number">${entry.done ? "✓" : String(day.day).padStart(2, "0")}</span>
            <span class="sidebar-day__copy">${escapeHtml(day.title)}</span>
            <span class="sidebar-day__check">${entry.done ? "●" : ""}</span>
          </button>`;
        }).join("")}
      </section>`).join("");
  }

  function renderToday() {
    const done = doneCount();
    const nextDay = days.find((day) => !getEntry(day.day).done) || days[20];
    const week = getWeek(nextDay.week);
    const completedEntry = done ? lastCompletedEntry() : null;
    const averageDelta = getAverageDelta();

    main.innerHTML = `<div class="view">
      <section class="hero-card">
        <div class="hero-card__copy">
          <span class="eyebrow">Dein interaktiver Begleiter</span>
          <h1>Kopf leiser.<br><span class="gradient-text">Schritt für Schritt.</span></h1>
          <p>21 kleine Tagesmodule aus deinem Plan, verbunden mit 26 Werkzeugen aus dem Buch. Deine Eingaben bleiben lokal und der nächste sinnvolle Schritt wartet hier auf dich.</p>
          <div class="hero-card__actions">
            <button class="button button--primary" type="button" data-hash="day-${nextDay.day}">${done ? `Weiter mit Tag ${nextDay.day}` : "Mit Tag 1 starten"} <span aria-hidden="true">→</span></button>
            <button class="button button--secondary" type="button" data-route="sos">Ich brauche gerade schnelle Hilfe</button>
          </div>
          <div class="stat-row">
            <div class="stat-card"><strong>${done}/21</strong><span>Tage abgeschlossen</span></div>
            <div class="stat-card"><strong>${favoriteTools().length}</strong><span>Favoriten gesichert</span></div>
            <div class="stat-card"><strong>${averageDelta === null ? "–" : formatDelta(averageDelta)}</strong><span>Ø Kopf-Lautstärke</span></div>
          </div>
        </div>
        <div class="hero-card__art"><img src="assets/cover.webp" alt="Buchcover ADHS & Overthinking bei Erwachsenen"></div>
      </section>

      <div class="dashboard-grid">
        <section class="panel today-card" style="--week-color:${week.color}">
          <div class="today-card__stripe"></div>
          <div class="panel__pad">
            <div class="panel-head">
              <div><span class="eyebrow">Als Nächstes · Woche ${week.id}</span><h2>Tag ${nextDay.day}: ${escapeHtml(nextDay.title)}</h2></div>
              <span class="today-number">${String(nextDay.day).padStart(2, "0")}</span>
            </div>
            <p>${escapeHtml(nextDay.purpose)}</p>
            <div class="today-card__step"><strong>Dein Mini-Schritt</strong><p>${escapeHtml(nextDay.step)}</p></div>
            <button class="button button--primary" type="button" data-hash="day-${nextDay.day}">${getEntry(nextDay.day).updatedAt ? "Fortsetzen" : "Tagesmodul öffnen"}</button>
          </div>
        </section>

        <section class="panel panel__pad quick-need">
          <span class="eyebrow">Wenn es gerade brennt</span>
          <h3>Was brauchst du jetzt?</h3>
          ${sosRoutes.slice(0, 4).map(renderQuickNeed).join("")}
          <button class="button button--quiet" type="button" data-route="sos">Alle SOS-Wege anzeigen →</button>
        </section>
      </div>

      ${completedEntry ? `<section class="panel panel__pad" style="margin-top:18px">
        <div class="panel-head"><div><span class="eyebrow">Dein letzter Schritt</span><h3>${escapeHtml(completedEntry.day.title)}</h3></div><button class="button button--secondary" type="button" data-hash="day-${completedEntry.day.day}">Ansehen</button></div>
        <p>${completedEntry.entry.notes ? `Deine Notiz: „${escapeHtml(truncate(completedEntry.entry.notes, 180))}“` : "Du hast den Tagesabschluss gespeichert. Wiederholen ist erlaubt – und oft wirksamer als Perfektion."}</p>
      </section>` : ""}
    </div>`;
  }

  function renderQuickNeed(route) {
    return `<button class="quick-need__button" style="--route-color:${route.color}" type="button" data-hash="sos-${route.id}">
      <span class="quick-need__icon">${route.icon}</span><span><strong>${escapeHtml(route.title)}</strong><small>${escapeHtml(route.subtitle)}</small></span><span class="quick-need__arrow">›</span>
    </button>`;
  }

  function renderPlan() {
    const done = doneCount();
    main.innerHTML = `<div class="view">
      <header class="page-head">
        <div><span class="eyebrow">Dein Fundament</span><h1>Der <span class="gradient-text">21-Tage-Plan</span></h1><p>Beginne bei Tag 1 oder springe dorthin, wo du gerade bist. Ausgelassene Tage bleiben offen – eine Pause setzt nichts zurück.</p></div>
        <button class="button button--primary" type="button" data-hash="day-${firstOpenDay().day}">${done ? "Plan fortsetzen" : "Tag 1 öffnen"}</button>
      </header>
      ${weeks.map((week) => `
        <section class="week-section" style="--week-color:${week.color}">
          <div class="week-section__head"><span class="week-section__mark">W${week.id}</span><div><h2>${escapeHtml(week.title)}</h2><p>${escapeHtml(week.description)}</p></div></div>
          <div class="day-grid">${days.filter((day) => day.week === week.id).map((day) => renderDayTile(day, week)).join("")}</div>
        </section>`).join("")}
    </div>`;
  }

  function renderDayTile(day, week) {
    const entry = getEntry(day.day);
    return `<button class="day-tile ${entry.done ? "is-done" : ""}" style="--week-color:${week.color}" type="button" data-hash="day-${day.day}">
      <span class="day-tile__top"><span class="day-tile__number">${entry.done ? "✓" : String(day.day).padStart(2, "0")}</span><span class="day-tile__status">${entry.done ? "Erledigt" : entry.updatedAt ? "Begonnen" : ""}</span></span>
      <strong>${escapeHtml(day.title)}</strong><small>${escapeHtml(day.duration)} · Buch S. ${escapeHtml(day.page)}</small>
    </button>`;
  }

  function renderDay(dayNumber) {
    const day = days.find((item) => item.day === Number(dayNumber)) || days[0];
    const week = getWeek(day.week);
    const entry = getEntry(day.day);
    state.activeDay = day.day;
    saveState();
    const previous = day.day > 1 ? day.day - 1 : null;
    const next = day.day < 21 ? day.day + 1 : null;

    main.innerHTML = `<div class="view" style="--week-color:${week.color}">
      <section class="day-hero">
        <div class="day-hero__inner">
          <div>
            <div class="day-meta"><span class="chip chip--week">Woche ${week.id} · ${escapeHtml(week.title)}</span><span class="chip">${escapeHtml(day.duration)}</span><span class="chip">Buch S. ${escapeHtml(day.page)}</span></div>
            <h1>${escapeHtml(day.title)}</h1><p>${escapeHtml(day.purpose)}</p>
          </div>
          <div class="day-badge"><div><strong>${String(day.day).padStart(2, "0")}</strong><small>von 21</small></div></div>
        </div>
      </section>

      <div class="day-layout">
        <section class="panel exercise">
          <div class="exercise__section">
            <span class="section-label">1 · Kurz einchecken</span>
            <h2>Wie laut ist dein Kopf gerade?</h2>
            <p>Nicht analysieren – der erste Wert, der passt, reicht.</p>
            ${renderScale("before", entry.before ?? 5, "ruhig", "sehr laut")}
          </div>
          <div class="exercise__section">
            <span class="section-label">2 · Dein Mini-Schritt</span>
            <h2>Heute reicht genau das</h2>
            <p>${escapeHtml(day.step)}</p>
            ${day.timer ? renderTimer(day.timer) : ""}
            <div class="activity-form">${renderFields(day.fields, entry.answers || {})}</div>
            ${day.note ? `<p class="privacy-note">Hinweis: ${escapeHtml(day.note)}</p>` : ""}
          </div>
          <div class="exercise__section completion-box">
            <span class="section-label">3 · Tagesabschluss</span>
            <h2>Was ist jetzt anders?</h2>
            ${renderScale("after", entry.after ?? entry.before ?? 5, "ruhiger", "sehr laut")}
            <div class="form-grid" style="margin-top:20px">
              <label class="field"><span>Wie hilfreich war das Tool?</span><select data-entry-key="helpful"><option value="">Noch offen</option>${[1,2,3,4,5].map((value) => `<option value="${value}" ${Number(entry.helpful) === value ? "selected" : ""}>${value} von 5</option>`).join("")}</select></label>
              <label class="choice"><input type="checkbox" data-entry-key="favorite" ${entry.favorite ? "checked" : ""}><span>Dieses Tool als Favorit sichern</span></label>
              <label class="field field--full"><span>Das möchte ich mir merken</span><textarea data-entry-key="notes" placeholder="Stichpunkte reichen.">${escapeHtml(entry.notes || "")}</textarea></label>
            </div>
            <label class="completion-check" style="margin-top:18px"><input type="checkbox" data-entry-key="done" ${entry.done ? "checked" : ""}><span>${escapeHtml(day.close)}</span></label>
          </div>
        </section>

        <aside class="panel context-card">
          <span class="eyebrow">Aus deinem Alltag</span><h3>Wenn das bekannt klingt</h3><p>${escapeHtml(day.situation)}</p>
          <hr><span class="eyebrow">Warum das hilft</span><p>${escapeHtml(day.why)}</p>
          <hr><div class="book-link"><div><span>Vertiefung im Buch</span><strong>Seite ${escapeHtml(day.page)}</strong></div><span aria-hidden="true">↗</span></div>
          <div class="day-nav">
            <button class="button button--secondary" type="button" ${previous ? `data-hash="day-${previous}"` : "disabled"}>← Zurück</button>
            <button class="button button--primary" type="button" ${next ? `data-hash="day-${next}"` : `data-route="progress"`}>${next ? "Weiter →" : "Abschluss →"}</button>
          </div>
        </aside>
      </div>
    </div>`;
  }

  function renderScale(key, value, lowLabel, highLabel) {
    return `<div class="scale"><div class="range-row"><input type="range" min="0" max="10" step="1" value="${value}" data-entry-key="${key}" aria-label="${escapeHtml(key === "before" ? "Kopf-Lautstärke vorher" : "Kopf-Lautstärke nachher")}"><output data-output-for="${key}">${value}/10</output></div><div class="scale__labels"><span>0 · ${lowLabel}</span><span>10 · ${highLabel}</span></div></div>`;
  }

  function renderFields(fields, answers) {
    return `<div class="form-grid">${fields.map((field) => renderField(field, answers[field.key])).join("")}</div>`;
  }

  function renderField(field, value = "") {
    const wide = field.wide ? " field--full" : "";
    if (field.type === "textarea") return `<label class="field${wide}"><span>${escapeHtml(field.label)}</span><textarea data-answer-key="${field.key}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(value || "")}</textarea></label>`;
    if (field.type === "radio" || field.type === "checkbox") {
      const values = Array.isArray(value) ? value : [value];
      return `<fieldset class="field${wide}" style="border:0;padding:0;margin:0"><legend>${escapeHtml(field.label)}</legend><div class="choice-grid ${field.options.length > 5 ? "choice-grid--three" : ""}">${field.options.map((option) => `<label class="choice"><input type="${field.type}" ${field.type === "radio" ? `name="answer-${field.key}"` : ""} data-answer-key="${field.key}" value="${escapeHtml(option)}" ${values.includes(option) ? "checked" : ""}><span>${escapeHtml(option)}</span></label>`).join("")}</div></fieldset>`;
    }
    return `<label class="field${wide}"><span>${escapeHtml(field.label)}</span><input type="${field.type || "text"}" data-answer-key="${field.key}" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(field.placeholder || "")}"></label>`;
  }

  function renderTimer(config) {
    const choices = config.choices || [];
    return `<div class="timer" data-timer data-total="${config.seconds}" data-mode="${config.mode}">
      ${choices.length ? `<div class="filter-bar" style="margin:0">${choices.map((seconds) => `<button class="filter-button ${seconds === config.seconds ? "is-active" : ""}" type="button" data-timer-seconds="${seconds}">${seconds / 60} Min.</button>`).join("")}</div>` : ""}
      <div class="timer__ring"><div class="timer__copy"><strong data-timer-display>${formatTime(config.seconds)}</strong><span data-timer-label>${escapeHtml(config.label)}</span></div></div>
      <div class="timer__actions"><button class="button button--primary" type="button" data-timer-action="toggle">Starten</button><button class="button button--secondary" type="button" data-timer-action="reset">Zurücksetzen</button></div>
    </div>`;
  }

  function renderTools() {
    const categories = ["Alle", ...new Set(tools.map((tool) => tool.category))];
    const filtered = toolFilter === "Alle" ? tools : tools.filter((tool) => tool.category === toolFilter);
    main.innerHTML = `<div class="view">
      <header class="page-head"><div><span class="eyebrow">Direkt aus dem Manuskript</span><h1>Deine <span class="gradient-text">26 Werkzeuge</span></h1><p>Die 21 Tagesmodule führen dich durch die Kernwerkzeuge. Vier ergänzende Tools für Beziehung und Selbstvertretung stehen jederzeit bereit.</p></div></header>
      <div class="filter-bar" aria-label="Werkzeuge filtern">${categories.map((category) => `<button class="filter-button ${toolFilter === category ? "is-active" : ""}" type="button" data-tool-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}</div>
      <div class="tool-grid">${filtered.map(renderToolCard).join("")}</div>
    </div>`;
  }

  function renderToolCard(tool) {
    const color = categoryColor(tool.category);
    const isFavorite = tool.day && getEntry(tool.day).favorite;
    return `<button class="tool-card" type="button" style="--tool-color:${color}" data-hash="${tool.day ? `day-${tool.day}` : `tool-${tool.id}`}">
      <span class="tool-card__icon">${String(tool.id).padStart(2, "0")}</span><strong>${escapeHtml(tool.title)} ${isFavorite ? "★" : ""}</strong><p>${escapeHtml(tool.summary)}</p><small>${tool.day ? `Im Plan: Tag ${tool.day}` : "Ergänzendes Buchtool"} · S. ${tool.page}</small>
    </button>`;
  }

  function renderTool(toolId) {
    const tool = tools.find((item) => item.id === Number(toolId));
    if (!tool || tool.day) { location.hash = tool?.day ? `day-${tool.day}` : "tools"; return; }
    const content = supportTools[tool.id];
    const entry = state.supportEntries[String(tool.id)] || {};
    const fields = supportFields(tool.id);
    const color = categoryColor(tool.category);
    main.innerHTML = `<div class="view" style="--week-color:${color}">
      <section class="day-hero"><div class="day-hero__inner"><div><div class="day-meta"><span class="chip chip--week">Werkzeug ${tool.id} von 26</span><span class="chip">Buch S. ${tool.page}</span></div><h1>${escapeHtml(tool.title)}</h1><p>${escapeHtml(content.intro)}</p></div><div class="day-badge"><div><strong>${tool.id}</strong><small>Tool</small></div></div></div></section>
      <div class="day-layout">
        <section class="panel exercise"><div class="exercise__section"><span class="section-label">So gehst du vor</span><ol class="step-list">${content.steps.map((step, index) => `<li><i>${index + 1}</i><span>${escapeHtml(step)}</span></li>`).join("")}</ol></div><div class="exercise__section"><span class="section-label">Deine Arbeitsfläche</span><div class="activity-form">${renderSupportFields(fields, entry)}</div></div></section>
        <aside class="panel context-card"><span class="eyebrow">Zum 21-Tage-Plan</span><h3>Ergänzung, kein weiterer Pflicht-Tag</h3><p>Dieses Werkzeug steht außerhalb der Tagesfolge bereit. Nutze es dann, wenn die Situation passt.</p><hr><div class="book-link"><div><span>Vertiefung im Buch</span><strong>Seite ${tool.page}</strong></div><span>↗</span></div><button class="button button--secondary" style="width:100%;margin-top:14px" type="button" data-route="tools">← Alle Werkzeuge</button></aside>
      </div>
    </div>`;
  }

  function supportFields(toolId) {
    if (toolId === 21) return [{ key: "activity", label: "Unsere Paralleltätigkeit", type: "text" }, { key: "topic", label: "Worüber möchte ich sprechen?", type: "textarea" }, { key: "when", label: "Wann probieren wir es?", type: "text" }];
    if (toolId === 22) return [{ key: "behavior", label: "Was ich tue", type: "textarea" }, { key: "interpretation", label: "Was du vielleicht denkst", type: "textarea" }, { key: "reality", label: "Was tatsächlich passiert", type: "textarea" }];
    if (toolId === 25) return [{ key: "need", label: "Das brauche ich", type: "textarea" }, { key: "signal", label: "So merke ich, dass es fehlt", type: "textarea" }, { key: "adjustment", label: "Diese kleine Anpassung hilft", type: "textarea" }];
    return [{ key: "contact", label: "Eine Person, Gruppe oder Fachstelle", type: "textarea" }, { key: "frequency", label: "Meine niedrige Kontaktfrequenz", type: "text" }, { key: "next", label: "Mein nächster kleiner Schritt", type: "textarea" }];
  }

  function renderSupportFields(fields, entry) {
    return `<div class="form-grid">${fields.map((field) => `<label class="field ${field.type === "textarea" ? "field--full" : ""}"><span>${escapeHtml(field.label)}</span>${field.type === "textarea" ? `<textarea data-support-key="${field.key}">${escapeHtml(entry[field.key] || "")}</textarea>` : `<input type="text" data-support-key="${field.key}" value="${escapeHtml(entry[field.key] || "")}">`}</label>`).join("")}</div>`;
  }

  function renderSos(routeId) {
    const route = sosRoutes.find((item) => item.id === routeId);
    if (!route) {
      main.innerHTML = `<div class="view"><section class="sos-hero"><span class="eyebrow">Schnelle Hilfe · kein Login</span><h1>Was ist <span class="gradient-text">gerade los?</span></h1><p>Wähle die Situation, die am ehesten passt. Du bekommst sofort einen kleinen Ablauf und kannst danach direkt in das passende Tageswerkzeug springen.</p></section><div class="sos-grid">${sosRoutes.map(renderSosCard).join("")}</div><p class="privacy-note" style="margin-top:18px">Bei akuter Gefahr oder wenn du dich nicht sicher fühlst, wende dich bitte sofort an den örtlichen Notruf oder eine geeignete Krisenhilfe.</p></div>`;
      return;
    }
    const day = days.find((item) => item.day === route.day);
    main.innerHTML = `<div class="view sos-flow" style="--route-color:${route.color}">
      <button class="button button--quiet" type="button" data-route="sos">← Andere Situation wählen</button>
      <section class="sos-flow__top"><span class="eyebrow">Jetzt nur diese drei Schritte</span><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.subtitle)}. Du musst gerade nicht den ganzen Tag lösen.</p>${route.steps.map((step, index) => `<div class="sos-flow__step"><i>${index + 1}</i><div><strong>${index === 0 ? "Zuerst" : index === 1 ? "Dann" : "Danach"}</strong><p>${escapeHtml(step)}</p></div></div>`).join("")}<button class="button button--primary" style="margin-top:24px" type="button" data-hash="day-${route.day}">Passendes Werkzeug öffnen: Tag ${route.day} →</button></section>
      <section class="panel panel__pad" style="margin-top:14px"><span class="eyebrow">Warum dieses Werkzeug?</span><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.why)}</p></section>
    </div>`;
  }

  function renderSosCard(route) {
    return `<button class="sos-card" style="--route-color:${route.color}" type="button" data-hash="sos-${route.id}"><span class="sos-card__icon">${route.icon}</span><strong>${escapeHtml(route.title)}</strong><small>${escapeHtml(route.subtitle)}</small></button>`;
  }

  function renderProgress() {
    const done = doneCount();
    const entries = days.map((day) => ({ day, entry: getEntry(day.day) }));
    const filled = entries.filter(({ entry }) => entry.updatedAt).length;
    const helpful = entries.filter(({ entry }) => Number(entry.helpful));
    const avgHelpful = helpful.length ? helpful.reduce((sum, item) => sum + Number(item.entry.helpful), 0) / helpful.length : null;
    const delta = getAverageDelta();
    const favorites = favoriteTools();
    main.innerHTML = `<div class="view">
      <header class="page-head"><div><span class="eyebrow">Deine Muster, nicht deine Leistung</span><h1>Was dir <span class="gradient-text">wirklich hilft</span></h1><p>Diese Ansicht wächst mit deinen Check-ins. Sie bewertet keine Disziplin – sie macht nützliche Werkzeuge sichtbar.</p></div><button class="button button--secondary" type="button" data-open-data>Daten sichern</button></header>
      <div class="progress-grid">
        <div class="metric-card"><small>Abgeschlossen</small><strong>${done}/21</strong><span>${Math.round(done / 21 * 100)} Prozent des Plans</span></div>
        <div class="metric-card"><small>Ausprobiert</small><strong>${filled}</strong><span>Tagesmodule mit Eintrag</span></div>
        <div class="metric-card"><small>Ø hilfreich</small><strong>${avgHelpful === null ? "–" : avgHelpful.toFixed(1)}</strong><span>von 5 Punkten</span></div>
        <div class="metric-card"><small>Ø Veränderung</small><strong>${delta === null ? "–" : formatDelta(delta)}</strong><span>Kopf-Lautstärke nach Übungen</span></div>
      </div>
      <div class="insight-grid">
        <section class="panel panel__pad"><div class="panel-head"><div><span class="eyebrow">Wochenfortschritt</span><h3>Der Plan im Überblick</h3></div></div><div class="week-bars">${weeks.map((week) => { const weekDays = days.filter((day) => day.week === week.id); const count = weekDays.filter((day) => getEntry(day.day).done).length; return `<div style="--week-color:${week.color}"><div class="week-bar__head"><span>Woche ${week.id} · ${escapeHtml(week.title)}</span><strong>${count}/7</strong></div><div class="week-bar__track"><i style="width:${count / 7 * 100}%"></i></div></div>`; }).join("")}</div></section>
        <section class="panel panel__pad"><div class="panel-head"><div><span class="eyebrow">Dein persönlicher Werkzeugkoffer</span><h3>Favoriten</h3></div></div>${favorites.length ? `<div class="favorite-list">${favorites.map((tool) => `<div class="favorite-item"><span>${escapeHtml(tool.title)}</span><button type="button" data-hash="day-${tool.day}">Öffnen →</button></div>`).join("")}</div>` : `<div class="empty-state">Markiere im Tagesabschluss hilfreiche Tools mit „Favorit“.</div>`}</section>
      </div>
      <section class="panel panel__pad" style="margin-top:18px"><div class="panel-head"><div><span class="eyebrow">Dein nächster sinnvoller Schritt</span><h3>${done === 21 ? "Lieblingswerkzeuge weiterverwenden" : `Tag ${firstOpenDay().day}: ${escapeHtml(firstOpenDay().title)}`}</h3></div><button class="button button--primary" type="button" data-hash="${done === 21 ? "tools" : `day-${firstOpenDay().day}`}">${done === 21 ? "Werkzeugkasten öffnen" : "Weitergehen →"}</button></div><p>${done === 21 ? "Du musst den Plan nicht neu beginnen. Wiederhole gezielt die Werkzeuge, die deine Werte und Notizen als hilfreich zeigen." : "Pausen und Sprünge sind erlaubt. Der erste offene Tag ist nur eine Orientierung, keine Pflicht."}</p></section>
    </div>`;
  }

  function handleClick(event) {
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) { location.hash = routeButton.dataset.route; return; }
    const hashButton = event.target.closest("[data-hash]");
    if (hashButton) { location.hash = hashButton.dataset.hash; return; }
    const filterButton = event.target.closest("[data-tool-filter]");
    if (filterButton) { toolFilter = filterButton.dataset.toolFilter; renderTools(); return; }
    const timerButton = event.target.closest("[data-timer-action]");
    if (timerButton) { controlTimer(timerButton.dataset.timerAction); return; }
    const timerChoice = event.target.closest("[data-timer-seconds]");
    if (timerChoice) { selectTimerDuration(Number(timerChoice.dataset.timerSeconds)); return; }
    if (event.target.closest("[data-open-data]")) dataDialog.showModal();
  }

  function handleEntryInput(event) {
    const route = parseRoute();
    if (route.name === "day") {
      const entry = getEntry(route.id);
      const answerKey = event.target.dataset.answerKey;
      const entryKey = event.target.dataset.entryKey;
      if (answerKey) {
        entry.answers ||= {};
        if (event.target.type === "checkbox") {
          entry.answers[answerKey] = [...main.querySelectorAll(`[data-answer-key="${cssEscape(answerKey)}"]:checked`)].map((input) => input.value);
        } else entry.answers[answerKey] = event.target.value;
      }
      if (entryKey) {
        entry[entryKey] = event.target.type === "checkbox" ? event.target.checked : event.target.type === "range" || entryKey === "helpful" ? Number(event.target.value) || "" : event.target.value;
        const output = main.querySelector(`[data-output-for="${entryKey}"]`);
        if (output) output.value = `${event.target.value}/10`;
        if (entryKey === "done" && event.target.checked) showToast(route.id === 21 ? "21 Tage abgeschlossen. Das ist dein Werkzeugkoffer." : `Tag ${route.id} gespeichert. Pausen sind erlaubt.`);
      }
      entry.updatedAt = new Date().toISOString();
      if (!state.startedAt) state.startedAt = entry.updatedAt;
      saveState();
      renderSidebar();
      return;
    }
    if (route.name === "tool" && event.target.dataset.supportKey) {
      state.supportEntries[String(route.id)] ||= {};
      state.supportEntries[String(route.id)][event.target.dataset.supportKey] = event.target.value;
      state.supportEntries[String(route.id)].updatedAt = new Date().toISOString();
      saveState();
    }
  }

  function controlTimer(action) {
    const timer = main.querySelector("[data-timer]");
    if (!timer) return;
    const total = Number(timer.dataset.total);
    const mode = timer.dataset.mode;
    if (action === "reset") { stopTimer(); updateTimerDisplay(total, total, mode); return; }
    if (!timerState) timerState = { total, remaining: total, mode, interval: null };
    if (timerState.interval) {
      clearInterval(timerState.interval);
      timerState.interval = null;
      const button = main.querySelector('[data-timer-action="toggle"]');
      if (button) button.textContent = "Weiter";
      return;
    }
    const button = main.querySelector('[data-timer-action="toggle"]');
    if (button) button.textContent = "Pause";
    const startedAt = Date.now();
    const startRemaining = timerState.remaining;
    timerState.interval = setInterval(() => {
      timerState.remaining = Math.max(0, startRemaining - Math.floor((Date.now() - startedAt) / 1000));
      updateTimerDisplay(timerState.remaining, timerState.total, timerState.mode);
      if (timerState.remaining <= 0) {
        clearInterval(timerState.interval);
        timerState.interval = null;
        if (button) button.textContent = "Nochmal";
        showToast("Timer beendet. Nimm dir einen Moment, bevor du weitergehst.");
      }
    }, 200);
  }

  function selectTimerDuration(seconds) {
    stopTimer();
    const timer = main.querySelector("[data-timer]");
    if (!timer) return;
    timer.dataset.total = String(seconds);
    main.querySelectorAll("[data-timer-seconds]").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.timerSeconds) === seconds));
    updateTimerDisplay(seconds, seconds, timer.dataset.mode);
  }

  function updateTimerDisplay(remaining, total, mode) {
    const display = main.querySelector("[data-timer-display]");
    const ring = main.querySelector(".timer__ring");
    const label = main.querySelector("[data-timer-label]");
    if (!display || !ring) return;
    display.textContent = formatTime(remaining);
    ring.style.setProperty("--timer-progress", `${(1 - remaining / total) * 360}deg`);
    if (mode === "breathing" && label) {
      const elapsed = total - remaining;
      const cues = ["Einatmen", "Halten", "Ausatmen", "Halten"];
      label.textContent = cues[Math.floor(elapsed / 4) % 4];
      label.classList.add("breath-cue");
    }
    if (remaining === 0) ring.style.setProperty("--timer-progress", "360deg");
  }

  function stopTimer() {
    if (timerState?.interval) clearInterval(timerState.interval);
    timerState = null;
  }

  function getEntry(day) {
    const key = String(day);
    if (!state.entries[key]) state.entries[key] = { answers: {} };
    state.entries[key].answers ||= {};
    return state.entries[key];
  }

  function doneCount() { return days.filter((day) => getEntry(day.day).done).length; }
  function firstOpenDay() { return days.find((day) => !getEntry(day.day).done) || days[20]; }
  function getWeek(id) { return weeks.find((week) => week.id === id); }

  function favoriteTools() {
    const ids = new Set(days.filter((day) => getEntry(day.day).favorite).flatMap((day) => day.toolIds));
    return tools.filter((tool) => ids.has(tool.id));
  }

  function lastCompletedEntry() {
    return days.map((day) => ({ day, entry: getEntry(day.day) })).filter(({ entry }) => entry.done).sort((a, b) => String(b.entry.updatedAt).localeCompare(String(a.entry.updatedAt)))[0] || null;
  }

  function getAverageDelta() {
    const values = days.map((day) => getEntry(day.day)).filter((entry) => Number.isFinite(Number(entry.before)) && entry.before !== "" && Number.isFinite(Number(entry.after)) && entry.after !== "").map((entry) => Number(entry.after) - Number(entry.before));
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  }

  function progressMessage(done) {
    if (!done) return "Ein kleiner Schritt reicht für heute.";
    if (done < 7) return "Woche 1: erst entlasten, dann lösen.";
    if (done < 14) return "Du baust Systeme, nicht mehr Druck.";
    if (done < 21) return "Dein Werkzeugkoffer wird persönlich.";
    return "Plan geschafft. Favoriten bleiben griffbereit.";
  }

  function exportFile() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `adhs-overthinking-fortschritt-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Sicherungsdatei erstellt.");
  }

  async function copyTransferCode() {
    const code = encodeState(state);
    try { await navigator.clipboard.writeText(code); showToast("Übertragungscode kopiert."); }
    catch { document.querySelector("#importCodeInput").value = code; showToast("Code steht im Textfeld zum Kopieren bereit."); }
  }

  function importTransferCode() {
    const value = document.querySelector("#importCodeInput").value.trim();
    if (!value) { showToast("Bitte zuerst einen Code einfügen."); return; }
    try { applyImportedState(decodeState(value)); }
    catch { showToast("Dieser Übertragungscode ist nicht gültig."); }
  }

  function importFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { applyImportedState(JSON.parse(reader.result)); }
      catch { showToast("Die Sicherungsdatei konnte nicht gelesen werden."); }
    };
    reader.readAsText(file);
  }

  function applyImportedState(candidate) {
    if (!candidate || typeof candidate !== "object" || typeof candidate.entries !== "object") throw new Error("invalid");
    state = { ...DEFAULT_STATE, ...candidate, version: 1, entries: candidate.entries || {}, supportEntries: candidate.supportEntries || {} };
    saveState();
    dataDialog.close();
    render();
    showToast("Fortschritt wurde übernommen.");
  }

  function resetData() {
    if (!window.confirm("Wirklich alle Eingaben und Fortschritte auf diesem Gerät löschen? Eine Sicherung kann danach weiterhin importiert werden.")) return;
    state = structuredClone(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    dataDialog.close();
    location.hash = "today";
    render();
    showToast("Lokale Daten wurden zurückgesetzt.");
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed.entries === "object" ? { ...DEFAULT_STATE, ...parsed, supportEntries: parsed.supportEntries || {} } : structuredClone(DEFAULT_STATE);
    } catch { return structuredClone(DEFAULT_STATE); }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { showToast("Deine Eingabe konnte lokal nicht gespeichert werden."); }
  }

  function encodeState(value) {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function decodeState(code) {
    const binary = atob(code.replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }

  function categoryColor(category) {
    return ({ Akut: "#ff8050", Reize: "#34d2ef", Fokus: "#ffbd24", Beziehung: "#ca5fff", Alltag: "#4ed496", Job: "#6d90ff", Energie: "#64dca7", Bürokratie: "#61a8ff", Selbstwert: "#ff9a31", Gedanken: "#e75dbe", Selbstvertretung: "#75d8ff" })[category] || "#ffbd24";
  }

  function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
  function formatDelta(value) { return `${value > 0 ? "+" : ""}${value.toFixed(1)}`; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function truncate(value, length) { return value.length > length ? `${value.slice(0, length - 1)}…` : value; }
  function cssEscape(value) { return window.CSS?.escape ? CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, "\\$&"); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }
})();
