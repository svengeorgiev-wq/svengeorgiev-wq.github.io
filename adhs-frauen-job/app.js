"use strict";

const STORAGE_KEY = "adhs-frauen-job-fokus-v1";
const APP_VERSION = 3;

const days = [
  {
    week: "Woche 1 · Fundament & Einstieg",
    title: "Die Notbremse",
    chapter: "Kapitel 1 – Du funktionierst und bist trotzdem am Limit",
    impulse: "Bevor du heute etwas änderst, atme einmal bewusst aus. Der erste Schritt aus der Überforderung ist nicht mehr Anstrengung, sondern weniger davon.",
    impulseBenefit: "stimmt dich darauf ein, dass weniger oft mehr wirkt",
    exercise: "Wende die 90-Sekunden-Notbremse einmal bewusst an, kurz vor etwas leicht Unangenehmem. Atme lang aus, bis dein planender Kopf wieder mitredet.",
    exerciseBenefit: "holt dich aus dem Alarm zurück, bevor du reagierst",
    question: "In welcher Situation hätte ich heute eine Bremse am dringendsten gebraucht?",
    questionBenefit: "zeigt dir, wo dein Stress zuerst zuschlägt"
  },
  {
    week: "Woche 1 · Fundament & Einstieg",
    title: "Struktur von außen",
    chapter: "Kapitel 2 – Das Kartenhaus verstehen",
    impulse: "Du musst dir nicht mehr merken, du musst es sichtbar machen. Was außerhalb deines Kopfes liegt, kann dir nicht entfallen.",
    impulseBenefit: "nimmt den Druck vom überladenen Gedächtnis",
    exercise: "Verlagere heute eine einzige Sache nach außen: an einen festen Platz oder auf einen Zettel, der dir im Weg liegt.",
    exerciseBenefit: "macht aus einem Vorsatz einen sichtbaren Auslöser",
    question: "Welche Sache vergesse ich immer wieder, und wo müsste sie liegen, damit das aufhört?",
    questionBenefit: "deckt eine wiederkehrende Reibung auf"
  },
  {
    week: "Woche 1 · Fundament & Einstieg",
    title: "Festlegen (F)",
    chapter: "Kapitel 3 – Raus aus dem Kopf",
    impulse: "Nicht alles ist heute dran. Ein klarer Tag beginnt mit einer Entscheidung, nicht mit einer Liste.",
    impulseBenefit: "befreit dich vom Druck, alles gleichzeitig zu wollen",
    exercise: "Lege für heute genau ein Ergebnis fest und schreib es auf. Nur dieses eine.",
    exerciseBenefit: "gibt dem Tag eine klare Richtung",
    question: "Was ist heute wirklich wichtig, und was nur laut?",
    questionBenefit: "trennt Dringlichkeit von echter Bedeutung"
  },
  {
    week: "Woche 1 · Fundament & Einstieg",
    title: "Der Container (O)",
    chapter: "Kapitel 4 – Der Container",
    impulse: "Eine Aufgabe ohne sichtbares Ende läuft endlos. Gib ihr eine Kante.",
    impulseBenefit: "macht Diffuses greifbar",
    exercise: "Formuliere dein heutiges Ergebnis als Container mit sichtbarem Ende – etwa „… ist abgeschickt“ oder „… liegt sortiert“.",
    exerciseBenefit: "lässt dich erkennen, wann du fertig bist",
    question: "Woran würde ich merken, dass ich heute fertig bin?",
    questionBenefit: "definiert Erfolg, bevor du anfängst"
  },
  {
    week: "Woche 1 · Fundament & Einstieg",
    title: "Klein anfangen (K)",
    chapter: "Kapitel 5 – Anfangen ohne Anlauf",
    impulse: "Der erste Meter kostet am meisten Kraft. Mach ihn so klein, dass dein Kopf nicht streiken kann.",
    impulseBenefit: "senkt die Hürde unter die Reizschwelle",
    exercise: "Benenne die kleinste körperliche Handlung deiner Aufgabe und mach sie zwei Minuten. Danach darfst du aufhören.",
    exerciseBenefit: "überlistet die Aufschiebe-Bremse",
    question: "Was ist passiert, nachdem die zwei Minuten um waren?",
    questionBenefit: "zeigt dir, wie oft Anfangen schon die halbe Miete ist"
  },
  {
    week: "Woche 1 · Fundament & Einstieg",
    title: "F-O-K am Stück",
    chapter: "Kapitel 3–5 – die FOKUS-Schritte F, O, K",
    impulse: "Heute fügst du zusammen, was du gelernt hast: drei kleine Schritte, eine Bewegung.",
    impulseBenefit: "verbindet Einzelteile zu einer Routine",
    exercise: "Nimm eine echte Aufgabe und geh F, O und K nacheinander durch.",
    exerciseBenefit: "macht die Schleife im Alltag erfahrbar",
    question: "An welcher der drei Stellen hakt es bei mir am ehesten?",
    questionBenefit: "zeigt dir deinen persönlichen Schwachpunkt"
  },
  {
    week: "Woche 1 · Fundament & Einstieg",
    title: "Ruhetag",
    chapter: "Rückblick – kein neues Kapitel",
    impulse: "Auch Ruhe gehört zum Plan. Heute lernst du nichts Neues, du lässt das Gelernte sich setzen.",
    impulseBenefit: "verankert das Geübte ohne neuen Druck",
    exercise: "Kein neues Werkzeug. Geh die Woche durch und streich an, was leichter war als sonst.",
    exerciseBenefit: "macht kleine Fortschritte sichtbar",
    question: "Welcher kleine Moment dieser Woche hat sich gut angefühlt?",
    questionBenefit: "lenkt den Blick auf das, was schon wirkt"
  },
  {
    week: "Woche 2 · Zeit, Schutz & Feierabend",
    title: "Der sichtbare Tag",
    chapter: "Kapitel 6 – Zeitblindheit zähmen",
    impulse: "Du kannst Zeit nicht erfühlen, aber du kannst sie sehen. Heute gibst du deinem Tag Ränder.",
    impulseBenefit: "macht Zeit aus dem Bauchgefühl heraus fassbar",
    exercise: "Setz zwei feste Anker in den Tag und sieh die Strecke dazwischen als begrenzt.",
    exerciseBenefit: "verhindert, dass Zeit unbemerkt zerrinnt",
    question: "Wo verschwindet meine Zeit am häufigsten, ohne dass ich es merke?",
    questionBenefit: "entlarvt deine größten Zeitlecks"
  },
  {
    week: "Woche 2 · Zeit, Schutz & Feierabend",
    title: "Timer und Puffer",
    chapter: "Kapitel 6 – Zeitblindheit zähmen",
    impulse: "Dein Bauchgefühl unterschätzt die Zeit fast immer. Vertrau lieber einem sichtbaren Timer.",
    impulseBenefit: "ersetzt Wunschdenken durch Realität",
    exercise: "Stell beim nächsten Block einen sichtbaren Timer und schlag die Hälfte als Puffer drauf.",
    exerciseBenefit: "schützt dich vor chronischer Verspätung",
    question: "Wie weit lag meine Schätzung von der Wirklichkeit entfernt?",
    questionBenefit: "eicht dein Zeitgefühl neu"
  },
  {
    week: "Woche 2 · Zeit, Schutz & Feierabend",
    title: "Der Fokusblock",
    chapter: "Kapitel 7 – Der Job-Schutzschild",
    impulse: "Eine geschützte Stunde ist mehr wert als ein ganzer zerfaserter Tag.",
    impulseBenefit: "stellt Qualität über bloße Verfügbarkeit",
    exercise: "Kündige einen Fokusblock an, mit dem Zusatz, wann du wieder erreichbar bist.",
    exerciseBenefit: "schützt deine Konzentration, ohne andere vor den Kopf zu stoßen",
    question: "Was hat es mit mir gemacht, eine Zeit lang nicht erreichbar zu sein?",
    questionBenefit: "lockert den Reflex ständiger Verfügbarkeit"
  },
  {
    week: "Woche 2 · Zeit, Schutz & Feierabend",
    title: "Ein Nein-Skript",
    chapter: "Kapitel 7 – Der Job-Schutzschild",
    impulse: "Ein gutes Nein schützt nicht nur deine Zeit, sondern auch die Zusagen, die du wirklich einhalten willst.",
    impulseBenefit: "macht Abgrenzung zu etwas Positivem",
    exercise: "Benutze einmal ein vorformuliertes Nein-Skript, statt zu improvisieren.",
    exerciseBenefit: "nimmt dir die Angst vorm spontanen Moment",
    question: "Was habe ich befürchtet, und was ist tatsächlich passiert?",
    questionBenefit: "zeigt die Lücke zwischen Angst und Realität"
  },
  {
    week: "Woche 2 · Zeit, Schutz & Feierabend",
    title: "Das Schließ-Ritual",
    chapter: "Kapitel 8 – Feierabend im Kopf",
    impulse: "Ein Tag ohne Ende läuft im Kopf weiter. Heute lernst du, ihn zuzumachen.",
    impulseBenefit: "trennt Arbeit vom Feierabend",
    exercise: "Mach abends dein Schließ-Ritual: leeren, parken, abschalten.",
    exerciseBenefit: "gibt dem Kopf ein Signal, dass Schluss ist",
    question: "War mein Kopf heute Abend etwas leiser als sonst?",
    questionBenefit: "misst die Wirkung des Rituals direkt"
  },
  {
    week: "Woche 2 · Zeit, Schutz & Feierabend",
    title: "Die ganze Schleife",
    chapter: "Kapitel 3–8 – die ganze FOKUS-Schleife",
    impulse: "Heute trägt dich der ganze Bogen, von Festlegen bis Schließen.",
    impulseBenefit: "zeigt, dass die Teile zusammen mehr sind",
    exercise: "Zieh die FOKUS-Schleife einmal komplett durch einen Tag.",
    exerciseBenefit: "macht aus Werkzeugen einen Tagesablauf",
    question: "Welcher Schritt fällt mir leicht, welcher noch schwer?",
    questionBenefit: "richtet deinen Fokus auf das, was noch Übung braucht"
  },
  {
    week: "Woche 2 · Zeit, Schutz & Feierabend",
    title: "Ruhetag",
    chapter: "Rückblick – kein neues Kapitel",
    impulse: "Halbzeit. Du musst nichts beweisen, nur kurz innehalten.",
    impulseBenefit: "schützt dich vor dem Alles-oder-nichts-Reflex",
    exercise: "Kein neues Werkzeug. Lies deine Notizen der letzten Tage.",
    exerciseBenefit: "macht deinen eigenen Weg sichtbar",
    question: "Was hat sich seit Tag 1 verändert, und sei es nur eine Kleinigkeit?",
    questionBenefit: "stärkt das Vertrauen, dass es wirkt"
  },
  {
    week: "Woche 3 · Stresstest & Dranbleiben",
    title: "Das Auffangnetz",
    chapter: "Kapitel 9 – Emotionale Einbrüche auffangen",
    impulse: "Gefühle kommen schnell. Du brauchst keine Kontrolle, nur eine kleine Lücke, bevor du handelst.",
    impulseBenefit: "nimmt die Angst vor starken Gefühlen",
    exercise: "Leg deinen Benenn-Satz fest und üb ihn an einer leichten Gereiztheit.",
    exerciseBenefit: "schafft Abstand zwischen Reiz und Reaktion",
    question: "Was fühle ich eigentlich, wenn ich genau hinschaue?",
    questionBenefit: "übersetzt diffuse Anspannung in klare Gefühle"
  },
  {
    week: "Woche 3 · Stresstest & Dranbleiben",
    title: "Die Monatskarte",
    chapter: "Kapitel 10 – Wenn die Hormone das Steuer übernehmen",
    impulse: "Manche Wochen sind schwerer, nicht weil du versagst, sondern weil dein Körper einem Rhythmus folgt.",
    impulseBenefit: "entlastet dich von Selbstvorwürfen",
    exercise: "Beginne die Monatskarte: notier abends drei Zahlen für Fokus, Stimmung und Energie.",
    exerciseBenefit: "macht ein unsichtbares Muster sichtbar",
    question: "Ahne ich schon, wann meine schweren Tage liegen?",
    questionBenefit: "hilft dir, Tiefphasen vorauszuplanen"
  },
  {
    week: "Woche 3 · Stresstest & Dranbleiben",
    title: "Die Energie-Ampel",
    chapter: "Kapitel 11 – Die langsame Erschöpfung",
    impulse: "Den lauten Einbruch siehst du kommen, den leisen nicht, wenn du nicht weißt, worauf du achten musst.",
    impulseBenefit: "schärft den Blick für frühe Warnzeichen",
    exercise: "Schreib deine drei, vier persönlichen Erschöpfungs-Vorboten auf.",
    exerciseBenefit: "gibt dir ein Frühwarnsystem an die Hand",
    question: "Welches Warnzeichen übergehe ich am liebsten?",
    questionBenefit: "deckt deinen blinden Fleck auf"
  },
  {
    week: "Woche 3 · Stresstest & Dranbleiben",
    title: "Bei Gelb runterschalten",
    chapter: "Kapitel 11 – Die langsame Erschöpfung",
    impulse: "Ruhe ist keine Belohnung für den Zusammenbruch. Sie ist die Wartung, die ihn verhindert.",
    impulseBenefit: "macht Erholung zur Vorsorge statt zum Notfall",
    exercise: "Plane einen Sparmodus: Was lässt du an einem Gelb-Tag bewusst weg?",
    exerciseBenefit: "gibt dir einen fertigen Plan für schwache Tage",
    question: "Was fällt mir am schwersten daran, mir Ruhe zu erlauben?",
    questionBenefit: "legt den Glaubenssatz hinter dem Dauerlauf frei"
  },
  {
    week: "Woche 3 · Stresstest & Dranbleiben",
    title: "Der Wiedereinstieg",
    chapter: "Kapitel 12 – Dranbleiben, auch wenn du rausfällst",
    impulse: "Rausfallen ist normal. Die Kunst ist nicht, drinzubleiben, sondern klein wieder einzusteigen.",
    impulseBenefit: "nimmt dem Rückfall den Schrecken",
    exercise: "Such eine Sache, bei der du rausgefallen bist, und mach den kleinsten Wiedereinstieg, heute.",
    exerciseBenefit: "verhindert, dass aus einem Ausrutscher ein Abbruch wird",
    question: "In welchem Ton rede ich mit mir, wenn ich etwas habe schleifen lassen?",
    questionBenefit: "macht deinen inneren Kritiker hörbar"
  },
  {
    week: "Woche 3 · Stresstest & Dranbleiben",
    title: "Dein eigener FOKUS-Tag",
    chapter: "Alle Kapitel – dein persönlicher Mix",
    impulse: "Du brauchst nicht alle Werkzeuge. Du brauchst deine.",
    impulseBenefit: "befreit dich vom Anspruch der Vollständigkeit",
    exercise: "Gestalte den Tag mit den zwei, drei Werkzeugen, die dir am meisten gebracht haben.",
    exerciseBenefit: "formt aus dem Buch dein persönliches System",
    question: "Welche Werkzeuge will ich dauerhaft behalten?",
    questionBenefit: "destilliert das Wesentliche für dich heraus"
  },
  {
    week: "Woche 3 · Stresstest & Dranbleiben",
    title: "Rückblick und was bleibt",
    chapter: "Kapitel 12 – Dranbleiben, auch wenn du rausfällst",
    impulse: "Einundzwanzig Tage sind kein Ziel, sondern ein Anfang. Was zählt, ist, was du mitnimmst.",
    impulseBenefit: "richtet den Blick nach vorn statt auf die Ziellinie",
    exercise: "Schreib die zwei, drei Dinge auf, die ab jetzt zu deinem Alltag gehören.",
    exerciseBenefit: "verankert die Veränderung über die 21 Tage hinaus",
    question: "Was sage ich mir, wenn ich das nächste Mal rausfalle?",
    questionBenefit: "rüstet dich für den unvermeidlichen Rückschlag"
  }
];

const audioCatalog = days.map((day, index) => ({
  title: day.title,
  src: `audios/tag-${String(index + 1).padStart(2, "0")}.mp3`,
  available: false
}));

const scripts = [
  { title: "Fokusblock ankündigen", description: "Wenn du erreichbar wirken willst, aber Schutz brauchst.", text: "Ich bin bis [Uhrzeit] in einem Fokusblock und schaue danach gesammelt auf Nachrichten. Wenn es dringend ist, schreib bitte [klarer Kanal]." },
  { title: "Nein ohne Rechtfertigung", description: "Für Anfragen, die deinen heutigen Container sprengen würden.", text: "Danke dir fürs Fragen. Heute kann ich das nicht sinnvoll übernehmen. Ich kann dir frühestens [Zeitpunkt] eine realistische Rückmeldung geben." },
  { title: "Schließ-Ritual", description: "Damit der Job nicht mit in den Abend geht.", text: "Offen ist: [Punkt]. Geparkt ist es auf: [Zeitpunkt]. Der nächste Schritt ist: [kleinste Handlung]. Für heute ist Schluss." },
  { title: "Benenn-Satz", description: "Für emotionale Wellen und schnelle innere Eskalation.", text: "Ich bin gerade [Gefühl], das ist eine Welle. Ich muss jetzt nicht reagieren. Ich gebe mir 90 Sekunden und entscheide danach." },
  { title: "Gelb-Tag", description: "Wenn Energiesparen klüger ist als Durchdrücken.", text: "Heute ist ein Gelb-Tag. Ich reduziere auf [Minimum], verschiebe [Parkplatz] und mache nur den nächsten sichtbaren Schritt." },
  { title: "Wiedereinstieg", description: "Für alles, was liegengeblieben ist und dadurch größer wirkt.", text: "Ich muss nicht alles aufholen. Ich steige mit [kleinste Handlung] wieder ein und bewerte danach neu." }
];

const fallbackState = () => ({
  version: APP_VERSION,
  activeDay: 0,
  completed: [],
  notes: {},
  planner: { result: "", container: "", firstStep: "", implementation: "", shutdown: "" },
  tasks: { today: [], later: [] },
  energy: {},
  warningSigns: ""
});

const state = {
  data: loadState(),
  activeView: "today",
  timerRemaining: 1500,
  timerDefault: 1500,
  timerId: null,
  deferredInstallPrompt: null,
  toastTimer: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  appFrame: $(".app-frame"), navItems: $$(".nav-item"), views: $$(".view"),
  progressRing: $("#progressRing"), progressPercent: $("#progressPercent"), resumeTitle: $("#resumeTitle"), resumeText: $("#resumeText"), resumeButton: $("#resumeButton"),
  dayWeek: $("#dayWeek"), dayNumber: $("#dayNumber"), dayTitle: $("#dayTitle"), dayChapter: $("#dayChapter"), dayImpulse: $("#dayImpulse"), dayImpulseBenefit: $("#dayImpulseBenefit"), dayExercise: $("#dayExercise"), dayExerciseBenefit: $("#dayExerciseBenefit"), dayQuestion: $("#dayQuestion"), dayQuestionBenefit: $("#dayQuestionBenefit"), dayNotes: $("#dayNotes"), noteSaveState: $("#noteSaveState"), todayAudioLabel: $("#todayAudioLabel"), completeDayButton: $("#completeDayButton"), completeDayText: $("#completeDayText"), previousDay: $("#previousDay"), nextDay: $("#nextDay"),
  weekOneDays: $("#weekOneDays"), weekTwoDays: $("#weekTwoDays"), weekThreeDays: $("#weekThreeDays"), nextOpenButton: $("#nextOpenButton"), audioGrid: $("#audioGrid"),
  focusResult: $("#focusResult"), focusContainer: $("#focusContainer"), focusFirstStep: $("#focusFirstStep"), focusImplementation: $("#focusImplementation"), focusShutdown: $("#focusShutdown"),
  todayTaskForm: $("#todayTaskForm"), laterTaskForm: $("#laterTaskForm"), todayTaskInput: $("#todayTaskInput"), laterTaskInput: $("#laterTaskInput"), todayTaskList: $("#todayTaskList"), laterTaskList: $("#laterTaskList"),
  timerPreset: $("#timerPreset"), timerDisplay: $("#timerDisplay"), timerToggle: $("#timerToggle"), timerReset: $("#timerReset"),
  focusRange: $("#focusRange"), moodRange: $("#moodRange"), energyRange: $("#energyRange"), focusValue: $("#focusValue"), moodValue: $("#moodValue"), energyValue: $("#energyValue"), warningSigns: $("#warningSigns"), saveEnergyButton: $("#saveEnergyButton"), energyMap: $("#energyMap"),
  scriptsGrid: $("#scriptsGrid"), installDialog: $("#installDialog"), nativeInstallButton: $("#nativeInstallButton"), closeInstallDialog: $("#closeInstallDialog"), offlineBadge: $("#offlineBadge"),
  exportButton: $("#exportButton"), importInput: $("#importInput"), resetButton: $("#resetButton"), toast: $("#toast")
};

initialize();

function initialize() {
  bindNavigation();
  bindDailyView();
  bindPlanner();
  bindEnergy();
  bindInstallation();
  bindDataControls();
  renderScripts();
  renderAudios();
  hydratePlanner();
  renderAll();
  updateOnlineState();
  window.addEventListener("online", updateOnlineState);
  window.addEventListener("offline", updateOnlineState);
  registerServiceWorker();
}

function bindNavigation() {
  elements.navItems.forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
  $$('[data-go-view]').forEach((button) => button.addEventListener("click", () => showView(button.dataset.goView, true)));
  elements.resumeButton.addEventListener("click", () => {
    state.data.activeDay = nextOpenDay();
    saveState();
    renderAll();
    showView("today", true);
  });
  elements.nextOpenButton.addEventListener("click", () => {
    state.data.activeDay = nextOpenDay();
    saveState();
    renderAll();
    showView("today", true);
  });
}

function showView(viewName, scroll = false) {
  state.activeView = viewName;
  elements.navItems.forEach((button) => {
    const active = button.dataset.view === viewName;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  elements.views.forEach((view) => {
    const active = view.dataset.panel === viewName;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
  if (viewName === "energy") hydrateEnergy();
  if (scroll) elements.appFrame.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindDailyView() {
  elements.previousDay.addEventListener("click", () => selectDay(Math.max(0, state.data.activeDay - 1)));
  elements.nextDay.addEventListener("click", () => selectDay(Math.min(days.length - 1, state.data.activeDay + 1)));
  elements.completeDayButton.addEventListener("click", () => {
    const index = state.data.activeDay;
    const complete = state.data.completed.includes(index);
    state.data.completed = complete ? state.data.completed.filter((day) => day !== index) : [...state.data.completed, index].sort((a, b) => a - b);
    saveState();
    renderAll();
    showToast(complete ? "Tag wieder geöffnet." : `Tag ${index + 1} abgeschlossen.`);
  });
  elements.dayNotes.addEventListener("input", () => {
    state.data.notes[state.data.activeDay] = elements.dayNotes.value;
    elements.noteSaveState.textContent = "Speichert …";
    saveState();
    window.clearTimeout(elements.dayNotes._saveTimer);
    elements.dayNotes._saveTimer = window.setTimeout(() => { elements.noteSaveState.textContent = "Lokal gespeichert"; }, 450);
  });
}

function selectDay(index) {
  state.data.activeDay = Math.max(0, Math.min(days.length - 1, Number(index) || 0));
  saveState();
  renderAll();
}

function renderAll() {
  renderProgress();
  renderToday();
  renderJourney();
  renderTasks();
  renderEnergyMap();
}

function renderProgress() {
  const completed = state.data.completed.filter((index) => index >= 0 && index < days.length).length;
  const percent = Math.round((completed / days.length) * 100);
  const nextIndex = nextOpenDay();
  elements.progressPercent.textContent = String(percent);
  elements.progressRing.style.setProperty("--progress", `${percent * 3.6}deg`);
  if (completed === days.length) {
    elements.resumeTitle.textContent = "Alle 21 Tage geschafft";
    elements.resumeText.textContent = "Dein persönlicher FOKUS-Weg bleibt für dich gespeichert.";
    elements.resumeButton.textContent = "Tag 21 ansehen";
  } else {
    elements.resumeTitle.textContent = completed ? `Weiter mit Tag ${nextIndex + 1}` : "Du startest mit Tag 1";
    elements.resumeText.textContent = `${days[nextIndex].title} · ${shortChapter(days[nextIndex].chapter)}`;
    elements.resumeButton.textContent = `Weiter bei Tag ${nextIndex + 1}`;
  }
}

function renderToday() {
  const index = state.data.activeDay;
  const day = days[index];
  const complete = state.data.completed.includes(index);
  elements.dayWeek.textContent = day.week;
  elements.dayNumber.textContent = String(index + 1);
  elements.dayTitle.textContent = day.title;
  elements.dayChapter.textContent = `Im Buch: ${day.chapter}`;
  elements.dayImpulse.textContent = day.impulse;
  elements.dayImpulseBenefit.textContent = day.impulseBenefit;
  elements.dayExercise.textContent = day.exercise;
  elements.dayExerciseBenefit.textContent = day.exerciseBenefit;
  elements.dayQuestion.textContent = day.question;
  elements.dayQuestionBenefit.textContent = day.questionBenefit;
  elements.dayNotes.value = state.data.notes[index] || "";
  elements.todayAudioLabel.textContent = `Audio zu Tag ${index + 1}`;
  elements.completeDayButton.classList.toggle("is-complete", complete);
  elements.completeDayText.textContent = complete ? "Tag abgeschlossen" : "Tag abschließen";
  elements.previousDay.disabled = index === 0;
  elements.nextDay.disabled = index === days.length - 1;
  elements.noteSaveState.textContent = "Lokal gespeichert";
}

function renderJourney() {
  renderJourneyWeek(elements.weekOneDays, 0, 7);
  renderJourneyWeek(elements.weekTwoDays, 7, 14);
  renderJourneyWeek(elements.weekThreeDays, 14, 21);
}

function renderJourneyWeek(container, start, end) {
  container.replaceChildren();
  days.slice(start, end).forEach((day, localIndex) => {
    const index = start + localIndex;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "journey-day";
    button.classList.toggle("is-complete", state.data.completed.includes(index));
    button.classList.toggle("is-active", state.data.activeDay === index);
    button.setAttribute("aria-label", `Tag ${index + 1}: ${day.title}${state.data.completed.includes(index) ? ", abgeschlossen" : ""}`);
    const number = document.createElement("span"); number.className = "journey-day__number"; number.textContent = state.data.completed.includes(index) ? "✓" : String(index + 1);
    const title = document.createElement("strong"); title.textContent = day.title;
    const chapter = document.createElement("small"); chapter.textContent = shortChapter(day.chapter);
    button.append(number, title, chapter);
    button.addEventListener("click", () => { selectDay(index); showView("today", true); });
    container.append(button);
  });
}

function renderAudios() {
  elements.audioGrid.replaceChildren();
  audioCatalog.forEach((audio, index) => {
    const card = document.createElement("article");
    card.className = `audio-card${audio.available ? " is-ready" : ""}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "audio-card__play";
    button.textContent = audio.available ? "▶" : "–";
    button.disabled = !audio.available;
    button.setAttribute("aria-label", audio.available ? `Audio zu Tag ${index + 1} abspielen` : `Audio zu Tag ${index + 1} folgt`);
    const copy = document.createElement("div"); copy.className = "audio-card__copy";
    const title = document.createElement("strong"); title.textContent = `Tag ${index + 1} · ${audio.title}`;
    const status = document.createElement("span"); status.textContent = audio.available ? "Audio verfügbar" : "Audio folgt";
    copy.append(title, status);
    card.append(button, copy);
    if (audio.available) {
      const player = document.createElement("audio"); player.controls = true; player.preload = "metadata"; player.src = audio.src; player.hidden = true;
      button.addEventListener("click", () => { player.hidden = !player.hidden; if (!player.hidden) player.play().catch(() => showToast("Audio konnte nicht gestartet werden.")); });
      copy.append(player);
    }
    elements.audioGrid.append(card);
  });
}

function bindPlanner() {
  const plannerFields = [
    [elements.focusResult, "result"], [elements.focusContainer, "container"], [elements.focusFirstStep, "firstStep"], [elements.focusImplementation, "implementation"], [elements.focusShutdown, "shutdown"]
  ];
  plannerFields.forEach(([element, key]) => element.addEventListener("input", () => { state.data.planner[key] = element.value; saveState(); }));
  elements.todayTaskForm.addEventListener("submit", (event) => addTask(event, "today", elements.todayTaskInput));
  elements.laterTaskForm.addEventListener("submit", (event) => addTask(event, "later", elements.laterTaskInput));
  elements.timerPreset.addEventListener("change", () => {
    pauseTimer();
    state.timerDefault = Number(elements.timerPreset.value);
    state.timerRemaining = state.timerDefault;
    renderTimer();
  });
  elements.timerToggle.addEventListener("click", () => state.timerId ? pauseTimer() : startTimer());
  elements.timerReset.addEventListener("click", () => { pauseTimer(); state.timerRemaining = state.timerDefault; renderTimer(); });
}

function hydratePlanner() {
  elements.focusResult.value = state.data.planner.result || "";
  elements.focusContainer.value = state.data.planner.container || "";
  elements.focusFirstStep.value = state.data.planner.firstStep || "";
  elements.focusImplementation.value = state.data.planner.implementation || "";
  elements.focusShutdown.value = state.data.planner.shutdown || "";
  renderTimer();
}

function addTask(event, bucket, input) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  state.data.tasks[bucket].push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, done: false });
  input.value = "";
  saveState();
  renderTasks();
}

function renderTasks() {
  renderTaskBucket("today", elements.todayTaskList);
  renderTaskBucket("later", elements.laterTaskList);
}

function renderTaskBucket(bucket, container) {
  container.replaceChildren();
  const tasks = normalizeTasks(state.data.tasks[bucket]);
  state.data.tasks[bucket] = tasks;
  if (!tasks.length) {
    const empty = document.createElement("p"); empty.className = "empty-state"; empty.textContent = bucket === "today" ? "Noch leer – das darf so sein." : "Hier wartet gerade nichts."; container.append(empty); return;
  }
  tasks.forEach((task) => {
    const row = document.createElement("div"); row.className = `task-item${task.done ? " is-done" : ""}`;
    const check = document.createElement("input"); check.type = "checkbox"; check.checked = task.done; check.setAttribute("aria-label", `${task.text} erledigt`);
    const text = document.createElement("span"); text.textContent = task.text;
    const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", `${task.text} löschen`);
    check.addEventListener("change", () => { task.done = check.checked; saveState(); renderTasks(); });
    remove.addEventListener("click", () => { state.data.tasks[bucket] = state.data.tasks[bucket].filter((item) => item.id !== task.id); saveState(); renderTasks(); });
    row.append(check, text, remove); container.append(row);
  });
}

function startTimer() {
  if (state.timerRemaining <= 0) state.timerRemaining = state.timerDefault;
  state.timerId = window.setInterval(() => {
    state.timerRemaining -= 1;
    renderTimer();
    if (state.timerRemaining <= 0) {
      pauseTimer();
      showToast("Fokusblock beendet. Jetzt bewusst schließen.");
    }
  }, 1000);
  elements.timerToggle.textContent = "Ⅱ";
  elements.timerToggle.setAttribute("aria-label", "Timer pausieren");
}

function pauseTimer() {
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
  elements.timerToggle.textContent = "▶";
  elements.timerToggle.setAttribute("aria-label", "Timer starten");
}

function renderTimer() {
  const minutes = Math.floor(state.timerRemaining / 60);
  const seconds = state.timerRemaining % 60;
  elements.timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  document.title = state.timerId ? `${elements.timerDisplay.textContent} · FOKUS` : "FOKUS-Begleiter | Bonus-App zum Buch";
}

function bindEnergy() {
  [[elements.focusRange, elements.focusValue], [elements.moodRange, elements.moodValue], [elements.energyRange, elements.energyValue]].forEach(([range, value]) => range.addEventListener("input", () => { value.textContent = range.value; }));
  elements.warningSigns.addEventListener("input", () => { state.data.warningSigns = elements.warningSigns.value; saveState(); });
  elements.saveEnergyButton.addEventListener("click", () => {
    state.data.energy[state.data.activeDay] = { focus: Number(elements.focusRange.value), mood: Number(elements.moodRange.value), energy: Number(elements.energyRange.value), savedAt: new Date().toISOString() };
    state.data.warningSigns = elements.warningSigns.value;
    saveState();
    renderEnergyMap();
    showToast(`Energie für Tag ${state.data.activeDay + 1} gespeichert.`);
  });
}

function hydrateEnergy() {
  const entry = state.data.energy[state.data.activeDay] || { focus: 3, mood: 3, energy: 3 };
  elements.focusRange.value = entry.focus; elements.focusValue.textContent = entry.focus;
  elements.moodRange.value = entry.mood; elements.moodValue.textContent = entry.mood;
  elements.energyRange.value = entry.energy; elements.energyValue.textContent = entry.energy;
  elements.warningSigns.value = state.data.warningSigns || "";
  renderEnergyMap();
}

function renderEnergyMap() {
  elements.energyMap.replaceChildren();
  for (let index = 0; index < days.length; index += 1) {
    const marker = document.createElement("span"); marker.className = "energy-day"; marker.textContent = String(index + 1);
    const entry = state.data.energy[index];
    if (entry) marker.classList.add(entry.energy <= 2 ? "red" : entry.energy === 3 ? "yellow" : "green");
    marker.title = entry ? `Tag ${index + 1}: Energie ${entry.energy} von 5` : `Tag ${index + 1}: kein Eintrag`;
    elements.energyMap.append(marker);
  }
}

function renderScripts() {
  elements.scriptsGrid.replaceChildren();
  scripts.forEach((script) => {
    const card = document.createElement("article"); card.className = "script-card";
    const head = document.createElement("div"); head.className = "script-card__head";
    const copy = document.createElement("div"); const title = document.createElement("h3"); title.textContent = script.title; const description = document.createElement("p"); description.textContent = script.description; copy.append(title, description);
    const button = document.createElement("button"); button.type = "button"; button.textContent = "Kopieren";
    button.addEventListener("click", async () => { await copyText(script.text); button.textContent = "Kopiert ✓"; showToast("Skript kopiert."); window.setTimeout(() => { button.textContent = "Kopieren"; }, 1300); });
    const quote = document.createElement("blockquote"); quote.textContent = script.text;
    head.append(copy, button); card.append(head, quote); elements.scriptsGrid.append(card);
  });
}

function bindInstallation() {
  [$("#installButton"), $("#installSectionButton"), $("#footerInstallButton")].forEach((button) => button.addEventListener("click", openInstallDialog));
  elements.closeInstallDialog.addEventListener("click", () => elements.installDialog.close());
  elements.installDialog.addEventListener("click", (event) => { if (event.target === elements.installDialog) elements.installDialog.close(); });
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    elements.nativeInstallButton.hidden = false;
  });
  elements.nativeInstallButton.addEventListener("click", async () => {
    if (!state.deferredInstallPrompt) return;
    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    elements.nativeInstallButton.hidden = true;
    elements.installDialog.close();
  });
  window.addEventListener("appinstalled", () => showToast("App wurde installiert."));
}

function openInstallDialog() {
  if (typeof elements.installDialog.showModal === "function") elements.installDialog.showModal();
}

function bindDataControls() {
  elements.exportButton.addEventListener("click", () => {
    const payload = JSON.stringify({ app: "FOKUS-Begleiter", version: APP_VERSION, exportedAt: new Date().toISOString(), data: state.data }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `fokus-begleiter-sicherung-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(link.href);
    showToast("Sicherung wurde erstellt.");
  });
  elements.importInput.addEventListener("change", async () => {
    const file = elements.importInput.files?.[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = parsed.data || parsed;
      state.data = mergeState(imported);
      saveState(); hydratePlanner(); renderAll(); hydrateEnergy(); showToast("Sicherung wurde eingelesen.");
    } catch { showToast("Diese Sicherungsdatei konnte nicht gelesen werden."); }
    elements.importInput.value = "";
  });
  elements.resetButton.addEventListener("click", () => {
    if (!window.confirm("Wirklich alle lokalen Notizen, Fortschritte und Einträge auf diesem Gerät löschen?")) return;
    localStorage.removeItem(STORAGE_KEY); state.data = fallbackState(); pauseTimer(); hydratePlanner(); renderAll(); hydrateEnergy(); showToast("Alle lokalen Daten wurden gelöscht.");
  });
}

function nextOpenDay() {
  const firstOpen = days.findIndex((_, index) => !state.data.completed.includes(index));
  return firstOpen === -1 ? days.length - 1 : firstOpen;
}

function shortChapter(chapter) {
  const match = chapter.match(/^Kapitel\s+\d+/i);
  return match ? match[0] : chapter.split("–")[0].trim();
}

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks.map((task, index) => typeof task === "string" ? { id: `legacy-${index}-${task}`, text: task, done: false } : { id: task.id || `legacy-${index}-${task.text || "task"}`, text: String(task.text || "").trim(), done: Boolean(task.done) }).filter((task) => task.text);
}

function mergeState(saved) {
  const fallback = fallbackState();
  const source = saved && typeof saved === "object" ? saved : {};
  return {
    ...fallback,
    ...source,
    version: APP_VERSION,
    activeDay: Math.max(0, Math.min(days.length - 1, Number(source.activeDay) || 0)),
    completed: Array.isArray(source.completed) ? [...new Set(source.completed.map(Number).filter((index) => Number.isInteger(index) && index >= 0 && index < days.length))] : [],
    notes: source.notes && typeof source.notes === "object" ? source.notes : {},
    planner: { ...fallback.planner, ...(source.planner || {}) },
    tasks: { today: normalizeTasks(source.tasks?.today), later: normalizeTasks(source.tasks?.later) },
    energy: source.energy && typeof source.energy === "object" ? source.energy : {},
    warningSigns: typeof source.warningSigns === "string" ? source.warningSigns : ""
  };
}

function loadState() {
  try { return mergeState(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { return fallbackState(); }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); }
  catch { showToast("Lokales Speichern ist in diesem Browser blockiert."); }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return; }
  const area = document.createElement("textarea"); area.value = text; area.style.position = "fixed"; area.style.opacity = "0"; document.body.append(area); area.select(); document.execCommand("copy"); area.remove();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2400);
}

function updateOnlineState() {
  elements.offlineBadge.hidden = navigator.onLine;
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try { await navigator.serviceWorker.register("sw.js?v=4", { scope: "./" }); }
  catch (error) { console.warn("Service Worker konnte nicht registriert werden.", error); }
}
