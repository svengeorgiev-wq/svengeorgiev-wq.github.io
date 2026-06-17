const STORAGE_KEY = "kopf-leiser-overthinking-v1";
const TIMER_SECONDS = 25 * 60;

const days = [
  {
    title: "Status-Check",
    phase: "Körper",
    impulse: "Bevor sich etwas verändern kann, musst du sehen, wie es jetzt ist. Overthinking wird leichter, wenn es vom diffusen Lärm zum sichtbaren Muster wird.",
    exercise: "Nimm dir 10 Minuten. Notiere stichpunktartig deinen gestrigen Tag und markiere alle Momente, in denen du im Kopf hängen geblieben bist.",
    question: "Was überrascht dich, wenn du die Häufigkeit schwarz auf weiß siehst?"
  },
  {
    title: "Der physiologische Seufzer",
    phase: "Körper",
    impulse: "Der schnellste Weg in Richtung Sicherheit ist mechanisch: länger ausatmen, als du einatmest.",
    exercise: "Mache heute dreimal den physiologischen Seufzer: zweimal kurz durch die Nase ein, einmal lang durch den Mund aus.",
    question: "Wie hat sich dein Körper unmittelbar nach dem dritten Atemzug angefühlt?"
  },
  {
    title: "Kaltstart für den Vagus-Nerv",
    phase: "Körper",
    impulse: "Wenn Gedanken rasen, hilft oft keine Logik, sondern ein klarer Körperreiz.",
    exercise: "Wasche dein Gesicht 30 Sekunden eiskalt oder beende die Dusche kurz kalt im Gesicht.",
    question: "Was war lauter: der Kältereiz oder deine Sorgen?"
  },
  {
    title: "Panorama-Blick",
    phase: "Körper",
    impulse: "Stress erzeugt Tunnelblick. Weitblick sendet deinem Nervensystem ein Signal von mehr Raum.",
    exercise: "Hebe den Kopf. Schau geradeaus und nimm 60 Sekunden bewusst wahr, was links und rechts im Augenwinkel passiert.",
    question: "Wie verändert sich deine Atmung, wenn deine Augenmuskeln weicher werden?"
  },
  {
    title: "Nur eine Sache",
    phase: "Körper",
    impulse: "Multitasking ist Stress-Futter. Heute übst du, dem Kopf einen einzigen Reiz zu geben.",
    exercise: "Wähle eine Tätigkeit wie Essen, Zähneputzen oder Gehen. Mache heute nur das, ohne Handy und ohne Podcast.",
    question: "War es langweilig oder erholsam? Wie oft wollte die Hand zum Handy?"
  },
  {
    title: "Körper-Scan",
    phase: "Körper",
    impulse: "Overthinking zieht Energie nach oben. Wir holen Aufmerksamkeit wieder in den Körper.",
    exercise: "Setze dich 5 Minuten ruhig hin. Spüre nacheinander Füße, Waden, Sitzfläche und Rücken, ohne etwas zu bewerten.",
    question: "Welches Körperteil war angespannt, ohne dass du es vorher bemerkt hast?"
  },
  {
    title: "Pause und Freundlichkeit",
    phase: "Körper",
    impulse: "Wenn wir eine Übung vergessen, schimpfen wir oft. Heute trainierst du Freundlichkeit statt Optimierung.",
    exercise: "Tu heute nichts zur Verbesserung. Nimm dir 15 Minuten nutzlose Zeit: Tee, Blick aus dem Fenster, gar nichts leisten.",
    question: "Wie schwer fällt es dir, unproduktiv zu sein?"
  },
  {
    title: "Labeling",
    phase: "Gedanken",
    impulse: "Du bist nicht deine Angst. Du hast gerade einen Gedanken, der Angst macht.",
    exercise: "Wenn Stress kommt, sage innerlich: Ich bemerke gerade, dass ich den Gedanken habe, dass...",
    question: "Fühlt sich der Gedanke durch diesen Satz weiter weg an?"
  },
  {
    title: "Der Kritiker bekommt Abstand",
    phase: "Gedanken",
    impulse: "Ein Gedanke verliert Macht, wenn er nicht mehr wie Wahrheit klingt.",
    exercise: "Gib deinem inneren Kritiker einen Namen. Wenn er kommentiert, antworte: Danke für deine Meinung.",
    question: "Hat sich der Kritiker dadurch weniger absolut angefühlt?"
  },
  {
    title: "Der Faktencheck",
    phase: "Gedanken",
    impulse: "Wir trennen Wahrheit von Zukunftskino. Nicht jeder laute Gedanke ist ein Fakt.",
    exercise: "Nimm eine Sorge und frage: Ist das ein Fakt, der jetzt passiert, oder eine Hypothese? Bei Hypothese: Phantom-Schleife.",
    question: "Wie viel Prozent deiner Sorgen waren echte Fakten?"
  },
  {
    title: "Die Stopp-Taste",
    phase: "Gedanken",
    impulse: "Manchmal braucht dein Kopf eine körperliche Musterunterbrechung.",
    exercise: "Wenn du dich hineinsteigerst, sage laut Stopp, klatsch in die Hände oder wechsle sofort den Raum.",
    question: "Hat der Ortswechsel den Gedankenstrang unterbrochen?"
  },
  {
    title: "Ist das meins?",
    phase: "Gedanken",
    impulse: "Empathische Menschen tragen oft Aufgaben, Stimmungen und Konflikte, die ihnen gar nicht gehören.",
    exercise: "Frage dich bei jeder Sorge: Ist das mein Problem? Kann ich es lösen? Wenn nein, gib das Paket mental zurück.",
    question: "Wie viel Ballast hast du heute getragen, der eigentlich anderen gehört?"
  },
  {
    title: "Das Vielleicht akzeptieren",
    phase: "Gedanken",
    impulse: "Innerer Frieden entsteht oft nicht durch Gewissheit, sondern durch die Erlaubnis, noch nicht alles zu wissen.",
    exercise: "Wenn du keine Antwort hast, sage: Vielleicht passiert X, vielleicht Y. Ich werde damit umgehen, wenn es so weit ist.",
    question: "Wie fühlt es sich an, Kontrolle für einen Moment abzugeben?"
  },
  {
    title: "Wochen-Rückblick",
    phase: "Gedanken",
    impulse: "Das Gehirn sucht Fehler. Heute bringst du es dazu, Fortschritt zu sehen.",
    exercise: "Notiere deinen größten Aha-Moment dieser Woche und eine Situation, in der du schneller aus dem Grübeln kamst.",
    question: "In welcher Situation warst du freier als früher?"
  },
  {
    title: "Digital Detox Light",
    phase: "System",
    impulse: "Jedes Bling ist ein kleiner Stress-Kick. Heute bekommt dein Nervensystem weniger Mikroalarm.",
    exercise: "Schalte Push-Benachrichtigungen aus, außer Anrufe oder wirklich notwendige Kanäle.",
    question: "Wie oft wolltest du aufs Handy schauen, nur aus Gewohnheit?"
  },
  {
    title: "Die Türsteher-Prüfung",
    phase: "System",
    impulse: "Nicht jeder Input verdient Zutritt in deinen Kopf.",
    exercise: "Entfolge heute drei Accounts oder deabonniere einen Newsletter, der dir kein gutes Gefühl gibt.",
    question: "Wie fühlt es sich an, diesen Input los zu sein?"
  },
  {
    title: "Das Sorgen-Büro öffnet",
    phase: "System",
    impulse: "Sorgen lassen sich nicht verbieten, aber sie lassen sich terminieren.",
    exercise: "Lege eine Sorgenzeit fest. Tagsüber schreibst du Sorgen nur auf und verschiebst sie dorthin.",
    question: "Wie viele Morgensorgen waren zur Sorgenzeit noch wichtig?"
  },
  {
    title: "Der Brain Dump",
    phase: "System",
    impulse: "Dein Gehirn ist kein Speicher für To-dos. Heute leerst du den mentalen Arbeitsspeicher.",
    exercise: "Schreibe abends 5 Minuten alles auf, was im Kopf ist. Keine Ordnung, kein Stil, alles raus.",
    question: "War dein Kopf danach stiller oder wenigstens sortierter?"
  },
  {
    title: "Umgebung schafft Klarheit",
    phase: "System",
    impulse: "Ein kleiner freier Bereich außen kann innen spürbar Platz machen.",
    exercise: "Räume einen minimalen Bereich auf: Nachttisch, Schublade, Schreibtischkante. Klein genug, dass du fertig wirst.",
    question: "Wie fühlt sich der Blick auf diese freie Fläche an?"
  },
  {
    title: "Nein sagen",
    phase: "System",
    impulse: "Overthinking entsteht oft dort, wo du Ja gesagt hast, obwohl dein Körper Nein meinte.",
    exercise: "Sage heute zu einer kleinen Sache Nein oder: Ich brauche Bedenkzeit.",
    question: "War die Reaktion der anderen Person wirklich so schlimm wie erwartet?"
  },
  {
    title: "Informations-Fasten",
    phase: "System",
    impulse: "Nachrichten können Stress-Futter sein. Heute bekommt dein System weniger Weltalarm.",
    exercise: "Verzichte 24 Stunden auf Nachrichten in App, Radio, Zeitung und Social Feeds.",
    question: "Hat dir wirklich etwas gefehlt?"
  },
  {
    title: "Der Werte-Check",
    phase: "Leben",
    impulse: "Wer seine Werte kennt, zerdenkt Entscheidungen seltener. Werte sind Filter, nicht Deko.",
    exercise: "Definiere deine Top 3 Werte, zum Beispiel Freiheit, Sicherheit, Harmonie, Wachstum oder Verbundenheit.",
    question: "Passt dein aktueller Haupt-Stressfaktor zu deinen Werten?"
  },
  {
    title: "60-Sekunden-Entscheidung",
    phase: "Leben",
    impulse: "Gut genug spart Lebenszeit. Perfekt kostet oft mehr Energie, als die Entscheidung wert ist.",
    exercise: "Triff heute drei kleine Entscheidungen in unter 60 Sekunden. Wähle das Erste, das passt.",
    question: "Ist etwas Schlimmes passiert, weil es nicht perfekt war?"
  },
  {
    title: "Mut zur Lücke",
    phase: "Leben",
    impulse: "Perfektionismus tarnt sich gern als Anspruch, ist aber oft Angst mit hübscher Oberfläche.",
    exercise: "Erledige eine kleine Aufgabe bewusst nur zu 80 Prozent und lass sie dann los.",
    question: "Hat es jemand gemerkt? Und falls ja: War es wirklich schlimm?"
  },
  {
    title: "Was, wenn es gut wird?",
    phase: "Leben",
    impulse: "Deine Vorstellungskraft kann Katastrophen bauen. Heute darf sie ein gutes Ende simulieren.",
    exercise: "Frage bei Angst bewusst: Was, wenn es absolut gut wird? Stell dir das beste realistische Ergebnis vor.",
    question: "Wie verändert sich deine Körperhaltung dabei?"
  },
  {
    title: "Der Rückwärts-Blick",
    phase: "Leben",
    impulse: "Wir schauen oft nur auf den Berg vor uns. Heute drehst du dich um und siehst, was du schon geschafft hast.",
    exercise: "Schreibe abends drei Dinge auf, die du heute gut gemacht hast.",
    question: "Fühlt sich der Tag dadurch vollständiger an?"
  },
  {
    title: "Dankbarkeit als Fokuswechsel",
    phase: "Leben",
    impulse: "Dankbarkeit zwingt Aufmerksamkeit aus der Bedrohungsschleife heraus.",
    exercise: "Bei Sorge: Nenne sofort drei konkrete Dinge, für die du jetzt dankbar bist.",
    question: "Konntest du den Fokuswechsel im Körper spüren?"
  },
  {
    title: "Dein Zukunfts-Ich",
    phase: "Leben",
    impulse: "Abstand verändert Größe. Was heute riesig wirkt, kann später eine Randnotiz sein.",
    exercise: "Frage dein entspanntes 80-jähriges Ich, was es zu deinem heutigen Problem sagen würde.",
    question: "Wirkt das Problem noch genauso groß?"
  },
  {
    title: "Die Notfall-Liste",
    phase: "Anker",
    impulse: "An schlechten Tagen vergessen wir die Tools. Deshalb landen deine besten Werkzeuge sichtbar.",
    exercise: "Schreibe deine drei Lieblings-Tools auf eine kleine Notfallkarte oder speichere sie im Handy.",
    question: "Welches Tool ist dein stärkster Anker?"
  },
  {
    title: "Feiern und Loslassen",
    phase: "Ankommen",
    impulse: "Du hast geübt. Nicht perfekt, sondern echt. Das zählt.",
    exercise: "Feiere dich bewusst und wähle ein Tool, das du ab jetzt behalten willst.",
    question: "Was ist der größte Unterschied zwischen dir an Tag 1 und heute?"
  }
];

const scripts = [
  {
    title: "2-Minuten-Reset",
    description: "Für Momente, in denen dein Kopf schneller ist als dein Körper.",
    text: "Ich halte kurz an. Zwei kurze Atemzüge durch die Nase, ein langes Ausatmen durch den Mund. Dreimal. Danach entscheide ich den nächsten kleinen Schritt."
  },
  {
    title: "Faktencheck",
    description: "Für Sorgen, die sich wie Wahrheit anfühlen.",
    text: "Ist das gerade ein Fakt oder eine Hypothese? Wenn es eine Hypothese ist, parke ich sie im Sorgen-Büro und komme später bewusst darauf zurück."
  },
  {
    title: "Sorgen-Büro",
    description: "Für Grübeln, das den ganzen Tag besetzen will.",
    text: "Ich nehme dich ernst, aber nicht sofort. Ich notiere diese Sorge und bespreche sie um [Uhrzeit] für 10 Minuten. Bis dahin ist das Büro geschlossen."
  },
  {
    title: "Abend-Entlastung",
    description: "Für die Nachtschicht, wenn der Körper müde ist und der Kopf weitermacht.",
    text: "Offen ist: [Punkt]. Geparkt ist es auf: [Zeitpunkt]. Der nächste Schritt ist: [kleinste Handlung]. Für heute muss mein Kopf nichts mehr lösen."
  },
  {
    title: "Werte-Filter",
    description: "Für Entscheidungen, die zu viele Optionen offenlassen.",
    text: "Meine Top-Werte sind [Wert 1], [Wert 2], [Wert 3]. Welche Option passt am ehesten dazu? Gut genug reicht."
  },
  {
    title: "Notfallkarte",
    description: "Für schlechte Tage, an denen du deine Werkzeuge vergisst.",
    text: "Meine drei Anker: 1. [Tool] 2. [Tool] 3. [Tool]. Erst Körper beruhigen, dann denken. Erst Nervensystem, dann Mindset."
  }
];

const state = {
  activeDay: 0,
  activeView: "today",
  timerRemaining: TIMER_SECONDS,
  timerId: null,
  data: loadState()
};

const elements = {
  completedCount: document.querySelector("#completedCount"),
  activeDayStat: document.querySelector("#activeDayStat"),
  energyStat: document.querySelector("#energyStat"),
  startTodayButton: document.querySelector("#startTodayButton"),
  openTimerButton: document.querySelector("#openTimerButton"),
  resetButton: document.querySelector("#resetButton"),
  dayButtons: document.querySelector("#dayButtons"),
  dayMeta: document.querySelector("#dayMeta"),
  dayTitle: document.querySelector("#dayTitle"),
  dayImpulse: document.querySelector("#dayImpulse"),
  dayExercise: document.querySelector("#dayExercise"),
  dayQuestion: document.querySelector("#dayQuestion"),
  dayNotes: document.querySelector("#dayNotes"),
  noteState: document.querySelector("#noteState"),
  completeDayButton: document.querySelector("#completeDayButton"),
  journeyGrid: document.querySelector("#journeyGrid"),
  nextOpenButton: document.querySelector("#nextOpenButton"),
  resultInput: document.querySelector("#resultInput"),
  containerInput: document.querySelector("#containerInput"),
  firstStepInput: document.querySelector("#firstStepInput"),
  todayTaskInput: document.querySelector("#todayTaskInput"),
  laterTaskInput: document.querySelector("#laterTaskInput"),
  addTodayTask: document.querySelector("#addTodayTask"),
  addLaterTask: document.querySelector("#addLaterTask"),
  todayTasks: document.querySelector("#todayTasks"),
  laterTasks: document.querySelector("#laterTasks"),
  timerText: document.querySelector("#timerText"),
  startTimerButton: document.querySelector("#startTimerButton"),
  pauseTimerButton: document.querySelector("#pauseTimerButton"),
  resetTimerButton: document.querySelector("#resetTimerButton"),
  focusRange: document.querySelector("#focusRange"),
  moodRange: document.querySelector("#moodRange"),
  energyRange: document.querySelector("#energyRange"),
  focusValue: document.querySelector("#focusValue"),
  moodValue: document.querySelector("#moodValue"),
  energyValue: document.querySelector("#energyValue"),
  warningSigns: document.querySelector("#warningSigns"),
  saveEnergyButton: document.querySelector("#saveEnergyButton"),
  energyMap: document.querySelector("#energyMap"),
  scriptGrid: document.querySelector("#scriptGrid"),
  tabs: document.querySelectorAll(".tab-button"),
  views: document.querySelectorAll(".view")
};

init();

function init() {
  state.activeDay = findActiveDay();
  hydratePlanner();
  hydrateEnergyInputs();
  bindEvents();
  renderAll();
}

function bindEvents() {
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });

  elements.startTodayButton.addEventListener("click", () => {
    setView("today");
    selectDay(findActiveDay());
    scrollToWorkspace();
  });

  elements.openTimerButton.addEventListener("click", () => {
    setView("planner");
    scrollToWorkspace();
  });

  elements.resetButton.addEventListener("click", resetProgress);
  elements.completeDayButton.addEventListener("click", toggleCompleteDay);
  elements.nextOpenButton.addEventListener("click", () => {
    selectDay(findActiveDay());
    setView("today");
  });

  elements.dayNotes.addEventListener("input", () => {
    state.data.notes[state.activeDay] = elements.dayNotes.value;
    saveState();
    flashSave(elements.noteState, "Gespeichert.");
  });

  [elements.resultInput, elements.containerInput, elements.firstStepInput].forEach((input) => {
    input.addEventListener("input", savePlanner);
  });

  elements.addTodayTask.addEventListener("click", () => addTask("today"));
  elements.addLaterTask.addEventListener("click", () => addTask("later"));
  elements.todayTaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask("today");
  });
  elements.laterTaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask("later");
  });

  elements.startTimerButton.addEventListener("click", startTimer);
  elements.pauseTimerButton.addEventListener("click", pauseTimer);
  elements.resetTimerButton.addEventListener("click", resetTimer);

  [elements.focusRange, elements.moodRange, elements.energyRange].forEach((range) => {
    range.addEventListener("input", renderRangeValues);
  });
  elements.warningSigns.addEventListener("input", () => {
    state.data.warningSigns = elements.warningSigns.value;
    saveState();
  });
  elements.saveEnergyButton.addEventListener("click", saveEnergy);
}

function renderAll() {
  renderStats();
  renderDayButtons();
  renderDailyCard();
  renderJourney();
  renderTasks();
  renderTimer();
  renderRangeValues();
  renderEnergyMap();
  renderScripts();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderStats() {
  elements.completedCount.textContent = `${state.data.completed.length}/${days.length}`;
  elements.activeDayStat.textContent = String(state.activeDay + 1);
  const entry = state.data.energy[state.activeDay];
  elements.energyStat.textContent = entry ? String(entry.energy) : "-";
}

function renderDayButtons() {
  elements.dayButtons.innerHTML = "";

  days.forEach((day, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-button";
    button.classList.toggle("is-active", index === state.activeDay);
    button.classList.toggle("is-complete", state.data.completed.includes(index));
    button.innerHTML = `
      <span class="day-number">${index + 1}</span>
      <span>
        <strong>${escapeHtml(day.title)}</strong>
        <span>${escapeHtml(day.phase)}</span>
      </span>
    `;
    button.addEventListener("click", () => selectDay(index));
    elements.dayButtons.append(button);
  });
}

function renderDailyCard() {
  const day = days[state.activeDay];
  const complete = state.data.completed.includes(state.activeDay);

  elements.dayMeta.textContent = `Tag ${state.activeDay + 1} / ${day.phase}`;
  elements.dayTitle.textContent = day.title;
  elements.dayImpulse.textContent = day.impulse;
  elements.dayExercise.textContent = day.exercise;
  elements.dayQuestion.textContent = day.question;
  elements.dayNotes.value = state.data.notes[state.activeDay] ?? "";
  elements.completeDayButton.classList.toggle("is-complete", complete);
  elements.completeDayButton.innerHTML = `
    <span data-lucide="${complete ? "check-circle-2" : "check"}"></span>
    ${complete ? "Abgeschlossen" : "Abschließen"}
  `;
}

function renderJourney() {
  elements.journeyGrid.innerHTML = "";
  days.forEach((day, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "journey-card";
    button.classList.toggle("is-active", index === state.activeDay);
    button.classList.toggle("is-complete", state.data.completed.includes(index));
    button.innerHTML = `
      <span class="journey-number">${index + 1}</span>
      <span>
        <strong>${escapeHtml(day.title)}</strong>
        <span>${escapeHtml(day.question)}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      selectDay(index);
      setView("today");
    });
    elements.journeyGrid.append(button);
  });
}

function hydratePlanner() {
  elements.resultInput.value = state.data.planner.result;
  elements.containerInput.value = state.data.planner.container;
  elements.firstStepInput.value = state.data.planner.firstStep;
}

function savePlanner() {
  state.data.planner.result = elements.resultInput.value;
  state.data.planner.container = elements.containerInput.value;
  state.data.planner.firstStep = elements.firstStepInput.value;
  saveState();
}

function renderTasks() {
  renderTaskList("today", elements.todayTasks);
  renderTaskList("later", elements.laterTasks);
}

function renderTaskList(bucket, mount) {
  mount.innerHTML = "";
  const tasks = state.data.tasks[bucket];

  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "save-state";
    empty.textContent = bucket === "today" ? "Noch kein Reset für heute." : "Noch keine Sorge geparkt.";
    mount.append(empty);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";
    item.classList.toggle("is-done", task.done);
    item.innerHTML = `
      <button class="task-check" type="button" aria-label="Aufgabe umschalten"></button>
      <strong>${escapeHtml(task.text)}</strong>
      <button class="icon-button" type="button" aria-label="Aufgabe löschen"><span data-lucide="x"></span></button>
    `;
    item.querySelector(".task-check").addEventListener("click", () => toggleTask(bucket, task.id));
    item.querySelector(".icon-button").addEventListener("click", () => deleteTask(bucket, task.id));
    mount.append(item);
  });
}

function addTask(bucket) {
  const input = bucket === "today" ? elements.todayTaskInput : elements.laterTaskInput;
  const text = input.value.trim();
  if (!text) return;

  state.data.tasks[bucket].push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    done: false
  });
  input.value = "";
  saveState();
  renderTasks();
  if (window.lucide) window.lucide.createIcons();
}

function toggleTask(bucket, id) {
  const task = state.data.tasks[bucket].find((item) => item.id === id);
  if (task) task.done = !task.done;
  saveState();
  renderTasks();
  if (window.lucide) window.lucide.createIcons();
}

function deleteTask(bucket, id) {
  state.data.tasks[bucket] = state.data.tasks[bucket].filter((item) => item.id !== id);
  saveState();
  renderTasks();
  if (window.lucide) window.lucide.createIcons();
}

function hydrateEnergyInputs() {
  elements.warningSigns.value = state.data.warningSigns;
  const entry = state.data.energy[state.activeDay] ?? { focus: 3, mood: 3, energy: 3 };
  elements.focusRange.value = entry.focus;
  elements.moodRange.value = entry.mood;
  elements.energyRange.value = entry.energy;
}

function renderRangeValues() {
  elements.focusValue.textContent = elements.focusRange.value;
  elements.moodValue.textContent = elements.moodRange.value;
  elements.energyValue.textContent = elements.energyRange.value;
}

function saveEnergy() {
  state.data.energy[state.activeDay] = {
    focus: Number(elements.focusRange.value),
    mood: Number(elements.moodRange.value),
    energy: Number(elements.energyRange.value)
  };
  state.data.warningSigns = elements.warningSigns.value;
  saveState();
  renderStats();
  renderEnergyMap();
}

function renderEnergyMap() {
  elements.energyMap.innerHTML = "";
  days.forEach((day, index) => {
    const entry = state.data.energy[index];
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "energy-day";
    if (entry) {
      const average = (entry.focus + entry.mood + entry.energy) / 3;
      tile.classList.add(average < 2.7 ? "is-low" : average < 4 ? "is-mid" : "is-high");
    }
    tile.innerHTML = `
      <strong>Tag ${index + 1}</strong>
      <span>${entry ? `F ${entry.focus} / S ${entry.mood} / R ${entry.energy}` : day.phase}</span>
    `;
    tile.addEventListener("click", () => {
      selectDay(index);
      setView("energy");
    });
    elements.energyMap.append(tile);
  });
}

function renderScripts() {
  elements.scriptGrid.innerHTML = "";
  scripts.forEach((script) => {
    const card = document.createElement("section");
    card.className = "script-card";
    card.innerHTML = `
      <h3>${escapeHtml(script.title)}</h3>
      <p>${escapeHtml(script.description)}</p>
      <textarea rows="4">${escapeHtml(script.text)}</textarea>
      <button class="ghost-action" type="button"><span data-lucide="copy"></span>Kopieren</button>
    `;
    const textarea = card.querySelector("textarea");
    card.querySelector("button").addEventListener("click", async () => {
      await copyText(textarea.value);
      card.querySelector("button").innerHTML = '<span data-lucide="check"></span>Kopiert';
      if (window.lucide) window.lucide.createIcons();
      window.setTimeout(() => {
        card.querySelector("button").innerHTML = '<span data-lucide="copy"></span>Kopieren';
        if (window.lucide) window.lucide.createIcons();
      }, 1200);
    });
    elements.scriptGrid.append(card);
  });
}

function selectDay(index) {
  state.activeDay = index;
  hydrateEnergyInputs();
  renderStats();
  renderDayButtons();
  renderDailyCard();
  renderJourney();
  renderRangeValues();
  renderEnergyMap();
  if (window.lucide) window.lucide.createIcons();
}

function toggleCompleteDay() {
  const exists = state.data.completed.includes(state.activeDay);
  state.data.completed = exists
    ? state.data.completed.filter((day) => day !== state.activeDay)
    : [...state.data.completed, state.activeDay].sort((a, b) => a - b);
  saveState();
  renderStats();
  renderDayButtons();
  renderDailyCard();
  renderJourney();
  if (window.lucide) window.lucide.createIcons();
}

function findActiveDay() {
  return days.findIndex((_, index) => !state.data.completed.includes(index)) === -1
    ? days.length - 1
    : days.findIndex((_, index) => !state.data.completed.includes(index));
}

function setView(view) {
  state.activeView = view;
  elements.tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === view);
  });
  elements.views.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === view);
  });
}

function startTimer() {
  if (state.timerId) return;
  state.timerId = window.setInterval(() => {
    state.timerRemaining -= 1;
    if (state.timerRemaining <= 0) {
      pauseTimer();
      state.timerRemaining = 0;
    }
    renderTimer();
  }, 1000);
}

function pauseTimer() {
  window.clearInterval(state.timerId);
  state.timerId = null;
}

function resetTimer() {
  pauseTimer();
  state.timerRemaining = TIMER_SECONDS;
  renderTimer();
}

function renderTimer() {
  const minutes = Math.floor(state.timerRemaining / 60);
  const seconds = state.timerRemaining % 60;
  elements.timerText.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function resetProgress() {
  pauseTimer();
  localStorage.removeItem(STORAGE_KEY);
  state.data = loadState();
  state.activeDay = 0;
  state.timerRemaining = TIMER_SECONDS;
  hydratePlanner();
  hydrateEnergyInputs();
  renderAll();
}

async function copyText(value) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const element = document.createElement("textarea");
  element.value = value;
  document.body.append(element);
  element.select();
  document.execCommand("copy");
  element.remove();
}

function scrollToWorkspace() {
  document.querySelector(".workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function flashSave(element, text) {
  element.textContent = text;
  window.clearTimeout(element.dataset.timer);
  element.dataset.timer = window.setTimeout(() => {
    element.textContent = "Lokal gespeichert.";
  }, 900);
}

function loadState() {
  const fallback = {
    completed: [],
    notes: {},
    planner: {
      result: "",
      container: "",
      firstStep: ""
    },
    tasks: {
      today: [],
      later: []
    },
    energy: {},
    warningSigns: ""
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      ...fallback,
      ...saved,
      planner: { ...fallback.planner, ...(saved?.planner ?? {}) },
      tasks: { ...fallback.tasks, ...(saved?.tasks ?? {}) },
      notes: { ...fallback.notes, ...(saved?.notes ?? {}) },
      energy: { ...fallback.energy, ...(saved?.energy ?? {}) }
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
