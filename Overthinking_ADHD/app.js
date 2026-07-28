(() => {
  "use strict";

  const { weeks, days, tools, supportTools, sosRoutes } = window.APP_DATA;
  const STORAGE_KEY = "adhs-overthinking-21-en-v1";
  const DEFAULT_STATE = { version: 1, activeDay: 1, entries: {}, supportEntries: {}, startedAt: null };
  const main = document.querySelector("#mainContent");
  const sidebarProgress = document.querySelector("#sidebarProgress");
  const sidebarDays = document.querySelector("#sidebarDays");
  const dataDialog = document.querySelector("#dataDialog");
  const toast = document.querySelector("#toast");
  let state = loadState();
  let toolFilter = "All";
  let timerState = null;
  let toastTimeout = null;

  init();

  function init() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    document.addEventListener("click", handleClick);
    document.addEventListener("play", handleAudioPlay, true);
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
    else if (route.name === "listen") renderListen();
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
    if (["today", "plan", "tools", "listen", "sos", "progress"].includes(hash)) return { name: hash };
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
      <div class="progress-head"><span>Your plan</span><strong>${done}/21</strong></div>
      <div class="progress-track" aria-label="${percent} percent completed"><i style="width:${percent}%"></i></div>
      <p>${progressMessage(done)}</p>`;

    sidebarDays.innerHTML = weeks.map((week) => `
      <section class="sidebar-week" style="--week-color:${week.color}">
        <div class="sidebar-week__title"><i></i>Week ${week.id} · ${escapeHtml(week.title)}</div>
        ${days.filter((day) => day.week === week.id).map((day) => {
          const entry = getEntry(day.day);
          const active = parseRoute().name === "day" && parseRoute().id === day.day;
          return `<button class="sidebar-day ${entry.done ? "is-done" : ""} ${active ? "is-active" : ""}" type="button" data-hash="day-${day.day}" aria-label="Day ${day.day}: ${escapeHtml(day.title)}${entry.done ? ", completed" : ""}">
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
          <span class="eyebrow">Your interactive companion</span>
          <h1>Quiet the noise.<br><span class="gradient-text">One step at a time.</span></h1>
          <p>Twenty-one small daily modules from your plan, connected with 26 tools from the book. Your entries stay on this device, and your next useful step is waiting here.</p>
          <div class="hero-card__actions">
            <button class="button button--primary" type="button" data-hash="day-${nextDay.day}">${done ? `Continue with day ${nextDay.day}` : "Start with day 1"} <span aria-hidden="true">→</span></button>
            <button class="button button--secondary" type="button" data-route="sos">I need quick help right now</button>
          </div>
          <div class="stat-row">
            <div class="stat-card"><strong>${done}/21</strong><span>days completed</span></div>
            <div class="stat-card"><strong>${favoriteTools().length}</strong><span>favorites saved</span></div>
            <div class="stat-card"><strong>${averageDelta === null ? "–" : formatDelta(averageDelta)}</strong><span>avg. mental noise</span></div>
          </div>
        </div>
        <div class="hero-card__art"><a href="https://www.amazon.de/dp/B0GX7G8Z1B/" target="_blank" rel="noopener noreferrer" aria-label="View ADHD & Overthinking for Adults on Amazon (opens in a new tab)"><img src="assets/cover.webp?v=20260728-en" alt="English book cover: ADHD & Overthinking in Adults"></a></div>
      </section>

      <div class="dashboard-grid">
        <section class="panel today-card" style="--week-color:${week.color}">
          <div class="today-card__stripe"></div>
          <div class="panel__pad">
            <div class="panel-head">
              <div><span class="eyebrow">Up next · Week ${week.id}</span><h2>Day ${nextDay.day}: ${escapeHtml(nextDay.title)}</h2></div>
              <span class="today-number">${String(nextDay.day).padStart(2, "0")}</span>
            </div>
            <p>${escapeHtml(nextDay.purpose)}</p>
            <div class="today-card__step"><strong>Your mini-step</strong><p>${escapeHtml(nextDay.step)}</p></div>
            <button class="button button--primary" type="button" data-hash="day-${nextDay.day}">${getEntry(nextDay.day).updatedAt ? "Continue" : "Open today's module"}</button>
          </div>
        </section>

        <section class="panel panel__pad quick-need">
          <span class="eyebrow">When things feel urgent</span>
          <h3>What do you need right now?</h3>
          ${sosRoutes.slice(0, 4).map(renderQuickNeed).join("")}
          <button class="button button--quiet" type="button" data-route="sos">Show all SOS options →</button>
        </section>
      </div>

      ${completedEntry ? `<section class="panel panel__pad" style="margin-top:18px">
        <div class="panel-head"><div><span class="eyebrow">Your latest step</span><h3>${escapeHtml(completedEntry.day.title)}</h3></div><button class="button button--secondary" type="button" data-hash="day-${completedEntry.day.day}">View</button></div>
        <p>${completedEntry.entry.notes ? `Your note: “${escapeHtml(truncate(completedEntry.entry.notes, 180))}”` : "You saved the daily check-out. Repeating is allowed—and often more effective than perfection."}</p>
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
        <div><span class="eyebrow">Your foundation</span><h1>The <span class="gradient-text">21-Day Plan</span></h1><p>Begin with day 1 or jump to where you are right now. Skipped days remain open—a pause never resets your progress.</p></div>
        <button class="button button--primary" type="button" data-hash="day-${firstOpenDay().day}">${done ? "Continue the plan" : "Open day 1"}</button>
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
      <span class="day-tile__top"><span class="day-tile__number">${entry.done ? "✓" : String(day.day).padStart(2, "0")}</span><span class="day-tile__status">${entry.done ? "Completed" : entry.updatedAt ? "Started" : ""}</span></span>
      <strong>${escapeHtml(day.title)}</strong><small>${escapeHtml(day.duration)} · Book p. ${escapeHtml(day.page)}</small>
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
            <div class="day-meta"><span class="chip chip--week">Week ${week.id} · ${escapeHtml(week.title)}</span><span class="chip">${escapeHtml(day.duration)}</span><span class="chip">Book p. ${escapeHtml(day.page)}</span></div>
            <h1>${escapeHtml(day.title)}</h1><p>${escapeHtml(day.purpose)}</p>
          </div>
          <div class="day-badge"><div><strong>${String(day.day).padStart(2, "0")}</strong><small>of 21</small></div></div>
        </div>
      </section>

      <div class="day-layout">
        <section class="panel exercise">
          <div class="exercise__section">
            <span class="section-label">1 · Quick check-in</span>
            <h2>How loud is your mind right now?</h2>
            <p>Do not analyze—the first number that feels right is enough.</p>
            ${renderScale("before", entry.before ?? 5, "quiet", "very loud")}
          </div>
          <div class="exercise__section">
            <span class="section-label">2 · Your mini-step</span>
            <h2>This is enough for today</h2>
            <p>${escapeHtml(day.step)}</p>
            ${day.timer ? renderTimer(day.timer) : ""}
            <div class="activity-form">${renderFields(day.fields, entry.answers || {})}</div>
            ${day.note ? `<p class="privacy-note">Note: ${escapeHtml(day.note)}</p>` : ""}
          </div>
          <div class="exercise__section completion-box">
            <span class="section-label">3 · Daily check-out</span>
            <h2>What is different now?</h2>
            ${renderScale("after", entry.after ?? entry.before ?? 5, "quieter", "very loud")}
            <div class="form-grid" style="margin-top:20px">
              <label class="field"><span>How helpful was this tool?</span><select data-entry-key="helpful"><option value="">Not rated yet</option>${[1,2,3,4,5].map((value) => `<option value="${value}" ${Number(entry.helpful) === value ? "selected" : ""}>${value} of 5</option>`).join("")}</select></label>
              <label class="choice"><input type="checkbox" data-entry-key="favorite" ${entry.favorite ? "checked" : ""}><span>Save this tool as a favorite</span></label>
              <label class="field field--full"><span>What I want to remember</span><textarea data-entry-key="notes" placeholder="Bullet points are enough.">${escapeHtml(entry.notes || "")}</textarea></label>
            </div>
            <label class="completion-check" style="margin-top:18px"><input type="checkbox" data-entry-key="done" ${entry.done ? "checked" : ""}><span>${escapeHtml(day.close)}</span></label>
          </div>
        </section>

        <aside class="panel context-card">
          <span class="eyebrow">From everyday life</span><h3>If this sounds familiar</h3><p>${escapeHtml(day.situation)}</p>
          <hr><span class="eyebrow">Why it helps</span><p>${escapeHtml(day.why)}</p>
          <hr><div class="book-link"><div><span>Go deeper in the book</span><strong>Page ${escapeHtml(day.page)}</strong></div><span aria-hidden="true">↗</span></div>
          <div class="day-nav">
            <button class="button button--secondary" type="button" ${previous ? `data-hash="day-${previous}"` : "disabled"}>← Back</button>
            <button class="button button--primary" type="button" ${next ? `data-hash="day-${next}"` : `data-route="progress"`}>${next ? "Next →" : "Finish →"}</button>
          </div>
        </aside>
      </div>
    </div>`;
  }

  function renderScale(key, value, lowLabel, highLabel) {
    return `<div class="scale"><div class="range-row"><input type="range" min="0" max="10" step="1" value="${value}" data-entry-key="${key}" aria-label="${escapeHtml(key === "before" ? "Mental noise before" : "Mental noise after")}"><output data-output-for="${key}">${value}/10</output></div><div class="scale__labels"><span>0 · ${lowLabel}</span><span>10 · ${highLabel}</span></div></div>`;
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
      ${choices.length ? `<div class="filter-bar" style="margin:0">${choices.map((seconds) => `<button class="filter-button ${seconds === config.seconds ? "is-active" : ""}" type="button" data-timer-seconds="${seconds}">${seconds / 60} min</button>`).join("")}</div>` : ""}
      <div class="timer__ring"><div class="timer__copy"><strong data-timer-display>${formatTime(config.seconds)}</strong><span data-timer-label>${escapeHtml(config.label)}</span></div></div>
      <div class="timer__actions"><button class="button button--primary" type="button" data-timer-action="toggle">Start</button><button class="button button--secondary" type="button" data-timer-action="reset">Reset</button></div>
    </div>`;
  }

  function renderTools() {
    const categories = ["All", ...new Set(tools.map((tool) => tool.category))];
    const filtered = toolFilter === "All" ? tools : tools.filter((tool) => tool.category === toolFilter);
    main.innerHTML = `<div class="view">
      <header class="page-head"><div><span class="eyebrow">Directly from the manuscript</span><h1>Your <span class="gradient-text">26 tools</span></h1><p>The 21 daily modules guide you through the core tools. Four additional tools for relationships and self-advocacy are always available.</p></div></header>
      <div class="filter-bar" aria-label="Filter tools">${categories.map((category) => `<button class="filter-button ${toolFilter === category ? "is-active" : ""}" type="button" data-tool-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}</div>
      <div class="tool-grid">${filtered.map(renderToolCard).join("")}</div>
    </div>`;
  }

  function renderToolCard(tool) {
    const color = categoryColor(tool.category);
    const isFavorite = tool.day && getEntry(tool.day).favorite;
    return `<button class="tool-card" type="button" style="--tool-color:${color}" data-hash="${tool.day ? `day-${tool.day}` : `tool-${tool.id}`}">
      <span class="tool-card__icon">${String(tool.id).padStart(2, "0")}</span><strong>${escapeHtml(tool.title)} ${isFavorite ? "★" : ""}</strong><p>${escapeHtml(tool.summary)}</p><small>${tool.day ? `In the plan: Day ${tool.day}` : "Additional book tool"} · p. ${tool.page}</small>
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
      <section class="day-hero"><div class="day-hero__inner"><div><div class="day-meta"><span class="chip chip--week">Tool ${tool.id} of 26</span><span class="chip">Book p. ${tool.page}</span></div><h1>${escapeHtml(tool.title)}</h1><p>${escapeHtml(content.intro)}</p></div><div class="day-badge"><div><strong>${tool.id}</strong><small>Tool</small></div></div></div></section>
      <div class="day-layout">
        <section class="panel exercise"><div class="exercise__section"><span class="section-label">How to use it</span><ol class="step-list">${content.steps.map((step, index) => `<li><i>${index + 1}</i><span>${escapeHtml(step)}</span></li>`).join("")}</ol></div><div class="exercise__section"><span class="section-label">Your workspace</span><div class="activity-form">${renderSupportFields(fields, entry)}</div></div></section>
        <aside class="panel context-card"><span class="eyebrow">Part of the 21-day plan</span><h3>An extra, not another required day</h3><p>This tool is available outside the daily sequence. Use it whenever the situation fits.</p><hr><div class="book-link"><div><span>Go deeper in the book</span><strong>Page ${tool.page}</strong></div><span>↗</span></div><button class="button button--secondary" style="width:100%;margin-top:14px" type="button" data-route="tools">← All tools</button></aside>
      </div>
    </div>`;
  }

  function renderListen() {
    const audioTracks = window.AUDIO_TRACKS || [];
    main.innerHTML = `<div class="view audio-view">
      <header class="page-head audio-head">
        <div><span class="eyebrow">Audio support for loud-mind moments</span><h1>Listen <span class="gradient-text">anytime</span></h1><p>The English audio impulses are being prepared and will be available here independently of the 21-day plan.</p></div>
        <div class="audio-head__mark" aria-hidden="true">♫</div>
      </header>
      <aside class="audio-notice" aria-label="Health notice"><span aria-hidden="true">i</span><p><strong>Important:</strong> These audio impulses do not replace diagnosis or treatment. If distress persists, please seek support from a physician or qualified mental-health professional.</p></aside>
      <section class="audio-list" aria-label="Audio impulses">
        ${audioTracks.length ? audioTracks.map(renderAudioTrack).join("") : `<div class="empty-state"><strong>English audio is coming soon.</strong><p>The four English recordings will appear here as soon as they are available.</p></div>`}
      </section>
    </div>`;
  }

  function renderAudioTrack(track, index) {
    return `<article class="audio-card" id="track-${escapeHtml(track.id)}">
      <div class="audio-card__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>
      <div class="audio-card__content">
        <div class="audio-card__head"><div><h2>${escapeHtml(track.title)}</h2><p>${escapeHtml(track.subtitle)}</p></div><span class="audio-duration">${escapeHtml(track.duration)}</span></div>
        <audio controls preload="none" src="${escapeHtml(track.file)}" aria-label="Play ${escapeHtml(track.title)}">Your browser does not support audio playback. <a href="${escapeHtml(track.file)}">Download the MP3</a>.</audio>
      </div>
    </article>`;
  }

  function supportFields(toolId) {
    if (toolId === 21) return [{ key: "activity", label: "Our parallel activity", type: "text" }, { key: "topic", label: "What do I want to talk about?", type: "textarea" }, { key: "when", label: "When will we try it?", type: "text" }];
    if (toolId === 22) return [{ key: "behavior", label: "What I do", type: "textarea" }, { key: "interpretation", label: "What you may think", type: "textarea" }, { key: "reality", label: "What is actually happening", type: "textarea" }];
    if (toolId === 25) return [{ key: "need", label: "What I need", type: "textarea" }, { key: "signal", label: "How I notice it is missing", type: "textarea" }, { key: "adjustment", label: "This small adjustment helps", type: "textarea" }];
    return [{ key: "contact", label: "One person, group, or professional service", type: "textarea" }, { key: "frequency", label: "My low contact frequency", type: "text" }, { key: "next", label: "My next small step", type: "textarea" }];
  }

  function renderSupportFields(fields, entry) {
    return `<div class="form-grid">${fields.map((field) => `<label class="field ${field.type === "textarea" ? "field--full" : ""}"><span>${escapeHtml(field.label)}</span>${field.type === "textarea" ? `<textarea data-support-key="${field.key}">${escapeHtml(entry[field.key] || "")}</textarea>` : `<input type="text" data-support-key="${field.key}" value="${escapeHtml(entry[field.key] || "")}">`}</label>`).join("")}</div>`;
  }

  function renderSos(routeId) {
    const route = sosRoutes.find((item) => item.id === routeId);
    if (!route) {
      main.innerHTML = `<div class="view"><section class="sos-hero"><span class="eyebrow">Quick help · no login</span><h1>What is happening <span class="gradient-text">right now?</span></h1><p>Choose the situation that fits best. You will get a short sequence immediately and can then jump to the matching daily tool.</p></section><div class="sos-grid">${sosRoutes.map(renderSosCard).join("")}</div><p class="privacy-note" style="margin-top:18px">If you are in immediate danger or do not feel safe, contact your local emergency services or an appropriate crisis service now.</p></div>`;
      return;
    }
    const day = days.find((item) => item.day === route.day);
    main.innerHTML = `<div class="view sos-flow" style="--route-color:${route.color}">
      <button class="button button--quiet" type="button" data-route="sos">← Choose another situation</button>
      <section class="sos-flow__top"><span class="eyebrow">Only these three steps for now</span><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.subtitle)}. You do not have to solve the whole day right now.</p>${route.steps.map((step, index) => `<div class="sos-flow__step"><i>${index + 1}</i><div><strong>${index === 0 ? "First" : index === 1 ? "Then" : "After that"}</strong><p>${escapeHtml(step)}</p></div></div>`).join("")}<button class="button button--primary" style="margin-top:24px" type="button" data-hash="day-${route.day}">Open the matching tool: Day ${route.day} →</button></section>
      <section class="panel panel__pad" style="margin-top:14px"><span class="eyebrow">Why this tool?</span><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.why)}</p></section>
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
      <header class="page-head"><div><span class="eyebrow">Your patterns, not your performance</span><h1>What <span class="gradient-text">really helps you</span></h1><p>This view grows with your check-ins. It does not grade discipline—it makes useful tools visible.</p></div><button class="button button--secondary" type="button" data-open-data>Back up data</button></header>
      <div class="progress-grid">
        <div class="metric-card"><small>Completed</small><strong>${done}/21</strong><span>${Math.round(done / 21 * 100)} percent of the plan</span></div>
        <div class="metric-card"><small>Explored</small><strong>${filled}</strong><span>daily modules with an entry</span></div>
        <div class="metric-card"><small>Avg. helpfulness</small><strong>${avgHelpful === null ? "–" : avgHelpful.toFixed(1)}</strong><span>out of 5 points</span></div>
        <div class="metric-card"><small>Avg. change</small><strong>${delta === null ? "–" : formatDelta(delta)}</strong><span>mental noise after exercises</span></div>
      </div>
      <div class="insight-grid">
        <section class="panel panel__pad"><div class="panel-head"><div><span class="eyebrow">Weekly progress</span><h3>The plan at a glance</h3></div></div><div class="week-bars">${weeks.map((week) => { const weekDays = days.filter((day) => day.week === week.id); const count = weekDays.filter((day) => getEntry(day.day).done).length; return `<div style="--week-color:${week.color}"><div class="week-bar__head"><span>Week ${week.id} · ${escapeHtml(week.title)}</span><strong>${count}/7</strong></div><div class="week-bar__track"><i style="width:${count / 7 * 100}%"></i></div></div>`; }).join("")}</div></section>
        <section class="panel panel__pad"><div class="panel-head"><div><span class="eyebrow">Your personal toolkit</span><h3>Favorites</h3></div></div>${favorites.length ? `<div class="favorite-list">${favorites.map((tool) => `<div class="favorite-item"><span>${escapeHtml(tool.title)}</span><button type="button" data-hash="day-${tool.day}">Open →</button></div>`).join("")}</div>` : `<div class="empty-state">Mark useful tools as favorites during the daily check-out.</div>`}</section>
      </div>
      <section class="panel panel__pad" style="margin-top:18px"><div class="panel-head"><div><span class="eyebrow">Your next useful step</span><h3>${done === 21 ? "Keep using your favorite tools" : `Day ${firstOpenDay().day}: ${escapeHtml(firstOpenDay().title)}`}</h3></div><button class="button button--primary" type="button" data-hash="${done === 21 ? "tools" : `day-${firstOpenDay().day}`}">${done === 21 ? "Open the toolkit" : "Continue →"}</button></div><p>${done === 21 ? "You do not need to restart the plan. Repeat the tools your ratings and notes show to be helpful." : "Pauses and jumps are allowed. The first open day is only a guide, not an obligation."}</p></section>
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

  function handleAudioPlay(event) {
    if (!(event.target instanceof HTMLAudioElement)) return;
    document.querySelectorAll("audio").forEach((audio) => {
      if (audio !== event.target) audio.pause();
    });
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
        if (entryKey === "done" && event.target.checked) showToast(route.id === 21 ? "You completed all 21 days. This is your toolkit." : `Day ${route.id} saved. Pauses are allowed.`);
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
      if (button) button.textContent = "Continue";
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
        if (button) button.textContent = "Again";
        showToast("Timer finished. Take a moment before moving on.");
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
      const cues = ["Inhale", "Hold", "Exhale", "Hold"];
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
    if (!done) return "One small step is enough for today.";
    if (done < 7) return "Week 1: reduce the load before solving.";
    if (done < 14) return "You are building systems, not more pressure.";
    if (done < 21) return "Your toolkit is becoming personal.";
    return "Plan complete. Your favorites stay within reach.";
  }

  function exportFile() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `adhd-overthinking-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Backup file created.");
  }

  async function copyTransferCode() {
    const code = encodeState(state);
    try { await navigator.clipboard.writeText(code); showToast("Transfer code copied."); }
    catch { document.querySelector("#importCodeInput").value = code; showToast("The code is ready to copy from the text field."); }
  }

  function importTransferCode() {
    const value = document.querySelector("#importCodeInput").value.trim();
    if (!value) { showToast("Paste a code first."); return; }
    try { applyImportedState(decodeState(value)); }
    catch { showToast("This transfer code is not valid."); }
  }

  function importFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { applyImportedState(JSON.parse(reader.result)); }
      catch { showToast("The backup file could not be read."); }
    };
    reader.readAsText(file);
  }

  function applyImportedState(candidate) {
    if (!candidate || typeof candidate !== "object" || typeof candidate.entries !== "object") throw new Error("invalid");
    state = { ...DEFAULT_STATE, ...candidate, version: 1, entries: candidate.entries || {}, supportEntries: candidate.supportEntries || {} };
    saveState();
    dataDialog.close();
    render();
    showToast("Progress imported.");
  }

  function resetData() {
    if (!window.confirm("Delete all entries and progress on this device? You can still import a backup afterward.")) return;
    state = structuredClone(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    dataDialog.close();
    location.hash = "today";
    render();
    showToast("Local data reset.");
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed.entries === "object" ? { ...DEFAULT_STATE, ...parsed, supportEntries: parsed.supportEntries || {} } : structuredClone(DEFAULT_STATE);
    } catch { return structuredClone(DEFAULT_STATE); }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { showToast("Your entry could not be saved on this device."); }
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
    return ({ "Immediate help": "#ff8050", "Sensory input": "#34d2ef", Focus: "#ffbd24", Relationships: "#ca5fff", "Daily life": "#4ed496", Work: "#6d90ff", Energy: "#64dca7", Admin: "#61a8ff", "Self-worth": "#ff9a31", Thoughts: "#e75dbe", "Self-advocacy": "#75d8ff" })[category] || "#ffbd24";
  }

  function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
  function formatDelta(value) { return `${value > 0 ? "+" : ""}${value.toFixed(1)}`; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function truncate(value, length) { return value.length > length ? `${value.slice(0, length - 1)}…` : value; }
  function cssEscape(value) { return window.CSS?.escape ? CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, "\\$&"); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }
})();
