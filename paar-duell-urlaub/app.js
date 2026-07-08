const STORAGE_KEY = "paar-duell-urlaub-revanche-v1";

const chapters = [
  { id: "all", number: "Alle", label: "Alle Bonusmodule", bookLabel: "Urlaubsduell" },
  { id: "koffer", number: "1", label: "Packlisten-Gericht", bookLabel: "Koffer-Kampf" },
  { id: "unterwegs", number: "2", label: "Plan-B-Zentrale", bookLabel: "Unterwegs-Arena" },
  { id: "hotel", number: "3", label: "Zimmercheck-Protokoll", bookLabel: "Hotelzimmer-Herrschaft" },
  { id: "strand", number: "4", label: "Tagesplan-Duell", bookLabel: "Strand, Stadt oder Sofa?" },
  { id: "restaurant", number: "5", label: "Menü-Orakel", bookLabel: "Restaurant-Radar" },
  { id: "katastrophen", number: "6", label: "Urlaubs-Krisenstab", bookLabel: "Wetter, Wege & kleine Katastrophen" },
  { id: "memory", number: "7", label: "Letzter-Abend-Finale", bookLabel: "Reise-Memory & letzter Abend" }
];

const roundModes = [
  { id: "kurz", label: "Kurz", count: 3, title: "Kurze Revanche" },
  { id: "normal", label: "Normal", count: 6, title: "Revanche-Runde" },
  { id: "lang", label: "Abend", count: 10, title: "Langer Reiseabend" },
  { id: "finale", label: "Finale", count: 12, title: "Finale mit Nachspiel" }
];

const seatModes = [
  { id: "sofa", label: "Sofa" },
  { id: "tisch", label: "Tisch" },
  { id: "zug", label: "Zug" }
];

const levelModes = [
  { id: "locker", label: "Locker" },
  { id: "clever", label: "Clever" },
  { id: "knifflig", label: "Knifflig" }
];

const duelDeck = [
  {
    id: "koffer-01",
    chapter: "koffer",
    level: "clever",
    type: "Schätzduell",
    minutes: 3,
    title: "Der Gegenstand mit Anwalt",
    prompt: "Nennt verdeckt je drei Dinge, die der andere mitnimmt, obwohl sie höchstens in einem Parallelurlaub gebraucht werden. Danach verteidigt jeder seinen verdächtigsten Gegenstand mit einem einzigen Satz.",
    scoring: ["1 Punkt pro Treffer", "2 Punkte für die überzeugendere Verteidigung", "1 Spätpunkt, wenn der Gegenstand am Ende wirklich unbenutzt bleibt"],
    twist: "Wer einen Gegenstand nennt, der schon im Buch diskutiert wurde, muss genauer werden: Marke, Ort im Koffer oder angeblicher Notfall."
  },
  {
    id: "koffer-02",
    chapter: "koffer",
    level: "knifflig",
    type: "Prioritäten-Duell",
    minutes: 4,
    title: "Drei Dinge, null Ausreden",
    prompt: "Stellt euch vor, ein Koffer geht verloren und ihr dürft für die ersten 24 Stunden nur drei Dinge behalten. Schreibt verdeckt eure Top 3 für euch selbst und eine Top 3 für den anderen.",
    scoring: ["2 Punkte pro richtig vorhergesagtem Gegenstand", "1 Punkt für die bessere Begründung", "Bonuspunkt, wenn beide dieselbe Nummer 1 wählen"],
    twist: "Geld, Handy und Ausweis sind gesperrt. Das wäre sonst ein sehr kurzer Krimi."
  },
  {
    id: "koffer-03",
    chapter: "koffer",
    level: "locker",
    type: "Listen-Sprint",
    minutes: 2,
    title: "Packliste der Wahrheit",
    prompt: "60 Sekunden: Schreibt Dinge auf, die ihr zu oft, zu selten oder mit zu viel Optimismus einpackt. Danach markiert jeder die drei treffendsten Begriffe beim anderen.",
    scoring: ["1 Punkt pro markiertem Treffer", "2 Punkte für die ehrlichste Selbstanzeige"],
    twist: "Alles mit 'falls' im Satz zählt doppelt verdächtig, aber nicht doppelt Punkte."
  },
  {
    id: "koffer-04",
    chapter: "koffer",
    level: "clever",
    type: "Reihenfolge",
    minutes: 4,
    title: "Der Suchtrupp im Sockengebiet",
    prompt: "Sortiert verdeckt fünf typische Suchobjekte nach Wahrscheinlichkeit, dass sie im Urlaub erst nach unnötig dramatischer Suche auftauchen: Ladekabel, Sonnenbrille, Zahnbürste, Pflaster, Kopfhörer.",
    scoring: ["3 Punkte für exakte Übereinstimmung an Platz 1", "1 Punkt pro gleicher Platzierung", "1 Punkt für die beste Suchgebiet-Bezeichnung"],
    twist: "Wer 'Ich weiß immer, wo alles ist' sagt, verliert keine Punkte, aber Würde steht zur Debatte."
  },
  {
    id: "unterwegs-01",
    chapter: "unterwegs",
    level: "clever",
    type: "Plan-B-Duell",
    minutes: 5,
    title: "Drei Stunden Verspätung",
    prompt: "Euer Anschluss ist weg. Jeder entwirft verdeckt einen Plan B mit drei Bausteinen: Essen, Zeit retten, Stimmung retten. Danach wird verglichen.",
    scoring: ["1 Punkt pro praktikablem Baustein", "2 Punkte für den ruhigeren Plan", "2 Punkte für den Plan, den ihr wirklich machen würdet"],
    twist: "Der Satz 'Dann warten wir halt' ist erlaubt, aber nur mit Zusatzidee."
  },
  {
    id: "unterwegs-02",
    chapter: "unterwegs",
    level: "knifflig",
    type: "Routen-Richter",
    minutes: 4,
    title: "Der schöne Umweg",
    prompt: "Wählt verdeckt: 20 Minuten schneller, aber hässlich und stressig, oder 35 Minuten länger, aber mit Aussicht und Snackchance. Notiert zusätzlich, was der andere wählt.",
    scoring: ["2 Punkte für richtig vorhergesagte Wahl", "2 Punkte für die bessere Begründung", "1 Punkt, wenn ihr eine gemeinsame Regel für künftige Umwege formuliert"],
    twist: "Aussicht ist kein Argument, wenn beide dabei nur Parkplatz sehen."
  },
  {
    id: "unterwegs-03",
    chapter: "unterwegs",
    level: "locker",
    type: "Durchsage-Duell",
    minutes: 3,
    title: "Offiziell unklar",
    prompt: "Erfindet eine höflich absurde Durchsage für eure aktuelle Reisesituation. Sie muss drei Wörter enthalten: Geduld, Gepäck, wahrscheinlich.",
    scoring: ["2 Punkte für die glaubwürdigere Durchsage", "2 Punkte für den trockeneren Humor", "1 Punkt, wenn der andere kurz nicken musste"],
    twist: "Wer lacht, darf trotzdem gewinnen. Das ist hier keine Behörde."
  },
  {
    id: "unterwegs-04",
    chapter: "unterwegs",
    level: "clever",
    type: "Risiko-Radar",
    minutes: 4,
    title: "Noch kurz tanken",
    prompt: "Schätzt verdeckt, welcher Satz im Urlaub am wahrscheinlichsten später bereut wird: 'Das reicht noch', 'Da vorne kommt bestimmt was', 'Ich brauche keine Jacke', 'Wir sind gleich da'.",
    scoring: ["2 Punkte, wenn beide denselben Risikosatz wählen", "2 Punkte für die treffendere Fallstudie aus eurem Leben", "1 Punkt für die beste Gegenmaßnahme"],
    twist: "Echte Namen von früheren Reiseentscheidungen dürfen anonymisiert werden. Aus Gründen."
  },
  {
    id: "hotel-01",
    chapter: "hotel",
    level: "clever",
    type: "Zimmer-Check",
    minutes: 4,
    title: "Die ersten fünf Minuten",
    prompt: "Schreibt verdeckt die ersten fünf Dinge auf, die der andere im Zimmer bemerkt, prüft oder kommentiert. Danach in echter Reihenfolge vergleichen.",
    scoring: ["1 Punkt pro Treffer", "2 Punkte für die richtige Nummer 1", "1 Punkt für die präziseste Formulierung"],
    twist: "Der Satz 'Das WLAN' zählt nur, wenn auch gesagt wird, wie kritisch die Prüfung ausfällt."
  },
  {
    id: "hotel-02",
    chapter: "hotel",
    level: "knifflig",
    type: "Tauschhandel",
    minutes: 5,
    title: "Kissen-Konferenz",
    prompt: "Ihr habt nur ein perfektes Kissen, eine gute Steckdose und den besseren Bettseitenplatz. Verhandelt verdeckt: Was gebt ihr ab, was fordert ihr, was ist unverhandelbar?",
    scoring: ["2 Punkte für den faireren Deal", "2 Punkte für die realistischere Forderung", "1 Punkt für diplomatische Sprache unter Druck"],
    twist: "Wer 'mir egal' schreibt, muss danach auch wirklich damit leben."
  },
  {
    id: "hotel-03",
    chapter: "hotel",
    level: "locker",
    type: "Hotelkritik",
    minutes: 3,
    title: "Bewertung mit Würde",
    prompt: "Formuliert verdeckt eine 3-Sterne-Bewertung für euer Zimmer: ehrlich, aber nicht unfair. Genau ein Lob, ein Mangel, ein Satz mit 'trotzdem'.",
    scoring: ["2 Punkte für die ausgewogenere Bewertung", "2 Punkte für den besten trockenen Satz", "1 Punkt, wenn sie als echte Bewertung durchgehen würde"],
    twist: "Übertreibung ist erlaubt, Rufschädigung bleibt im Koffer."
  },
  {
    id: "hotel-04",
    chapter: "hotel",
    level: "clever",
    type: "Geräusch-Protokoll",
    minutes: 3,
    title: "Was war das?",
    prompt: "Erstellt verdeckt drei Erklärungen für ein seltsames Geräusch im Hotel: realistisch, dramatisch, völlig unnötig kreativ.",
    scoring: ["1 Punkt pro Kategorie", "2 Punkte für die plausibelste Erklärung", "1 Punkt für die Erklärung, die später garantiert zitiert wird"],
    twist: "Wenn das Geräusch wirklich existiert, bekommt niemand Zusatzpunkte. Nur Atmosphäre."
  },
  {
    id: "strand-01",
    chapter: "strand",
    level: "clever",
    type: "Entscheidungsduell",
    minutes: 4,
    title: "Der perfekte halbe Tag",
    prompt: "Plant verdeckt einen halben Urlaubstag aus drei Blöcken: ein sicherer Genuss, ein kleines Abenteuer, eine Pause. Danach entscheidet ihr, welcher Plan morgen realistischer wäre.",
    scoring: ["1 Punkt pro gutem Block", "2 Punkte für den planbareren Ablauf", "2 Punkte für den Plan mit mehr gemeinsamer Energie"],
    twist: "Ein Plan ohne Pause gilt als optimistisch. Optimismus ist schön, aber nicht automatisch ein Punkt."
  },
  {
    id: "strand-02",
    chapter: "strand",
    level: "locker",
    type: "Szenenwahl",
    minutes: 3,
    title: "Strand, Stadt oder Sofa?",
    prompt: "Wählt verdeckt, was heute wirklich dran wäre: Strand, Stadt oder Sofa. Notiert zusätzlich den Satz, mit dem ihr den anderen überzeugen würdet.",
    scoring: ["2 Punkte für richtig getippte Wahl des anderen", "2 Punkte für den besseren Überzeugungssatz", "1 Punkt für ehrliche Energieeinschätzung"],
    twist: "Sofa im Urlaub ist kein Scheitern. Es ist manchmal Kulturprogramm in Liegeposition."
  },
  {
    id: "strand-03",
    chapter: "strand",
    level: "knifflig",
    type: "Budget-Strategie",
    minutes: 5,
    title: "Ein Schein, drei Wünsche",
    prompt: "Ihr habt 30 Euro Extra-Budget für heute. Teilt es verdeckt auf drei Dinge auf: Erlebnis, Essen, Komfort. Danach wird verhandelt, welcher Mix gewinnt.",
    scoring: ["2 Punkte für den alltagstauglicheren Mix", "2 Punkte für bessere Paar-Balance", "1 Punkt, wenn kein Posten nur aus Trotz existiert"],
    twist: "Komfort darf gewinnen. Man wird im Urlaub nicht automatisch abenteuerlicher durch unbequeme Schuhe."
  },
  {
    id: "strand-04",
    chapter: "strand",
    level: "clever",
    type: "Beobachtungsduell",
    minutes: 3,
    title: "Fünf-Minuten-Fundbüro",
    prompt: "Schaut euch 60 Sekunden um. Danach schreibt jeder fünf Dinge auf, die der andere wahrscheinlich nicht bemerkt hat.",
    scoring: ["1 Punkt pro echtem Fund", "2 Punkte für den überraschendsten Fund", "1 Punkt, wenn der Fund eine Mini-Geschichte bekommt"],
    twist: "Menschen werden nicht bewertet. Gegenstände, Schilder, Geräusche und Situationen schon."
  },
  {
    id: "restaurant-01",
    chapter: "restaurant",
    level: "clever",
    type: "Menü-Orakel",
    minutes: 4,
    title: "Bestellt, bevor ihr bestellt",
    prompt: "Tippt verdeckt, was der andere am wahrscheinlichsten bestellt: sicher, mutig, plötzlich doch Pommes. Danach echte Bestellung oder Wunschbestellung vergleichen.",
    scoring: ["3 Punkte für exakten Treffer", "1 Punkt für richtige Richtung", "2 Punkte für beste Begründung"],
    twist: "Wer 'du nimmst eh meins mit' schreibt und recht hat, erhält moralische Anerkennung. Keine Extrapunkte."
  },
  {
    id: "restaurant-02",
    chapter: "restaurant",
    level: "knifflig",
    type: "Rezensionsgericht",
    minutes: 5,
    title: "Vier Sterne mit Bauchgefühl",
    prompt: "Schreibt verdeckt eine Mini-Rezension für ein Restaurant, das ihr noch nicht bewertet habt: Atmosphäre, Essen, Service, Rückkehrwahrscheinlichkeit. Danach vergleicht die Gewichtung.",
    scoring: ["1 Punkt pro gemeinsamer Gewichtung", "2 Punkte für die hilfreichere Rezension", "1 Punkt für einen Satz, der nicht wie aus dem Prospekt klingt"],
    twist: "Superlative müssen beweisbar sein oder bekommen Urlaub auf Bewährung."
  },
  {
    id: "restaurant-03",
    chapter: "restaurant",
    level: "locker",
    type: "Snack-Notfall",
    minutes: 2,
    title: "Hunger verändert Menschen",
    prompt: "Nennt verdeckt drei Snacks, die die Stimmung des anderen in unter zehn Minuten retten könnten. Danach wird nach Treffer und Realismus gewertet.",
    scoring: ["1 Punkt pro Treffer", "2 Punkte für den realistischsten Notfall-Snack", "1 Punkt, wenn er heute beschaffbar wäre"],
    twist: "Der Snack muss existieren. 'Geduld' ist kein Snack, auch wenn es gesund klingt."
  },
  {
    id: "restaurant-04",
    chapter: "restaurant",
    level: "clever",
    type: "Diplomatie",
    minutes: 4,
    title: "Der Tisch nebenan hört mit",
    prompt: "Formuliert verdeckt einen höflichen Satz, mit dem ihr sagt: Das Essen ist nicht schlimm, aber auch nicht das Tageshighlight.",
    scoring: ["2 Punkte für Diplomatie", "2 Punkte für Wahrheit ohne Gemeinheit", "1 Punkt für den Satz, den ihr wirklich sagen könntet"],
    twist: "Passive Aggression muss leider draußen warten."
  },
  {
    id: "katastrophen-01",
    chapter: "katastrophen",
    level: "clever",
    type: "Rettungsplan",
    minutes: 5,
    title: "Wetterumschwung mit Publikum",
    prompt: "Regen statt Ausflug. Jeder baut verdeckt einen Rettungsplan aus: drinnen, draußen trotzdem, Essen, Mini-Luxus. Danach gewinnt der Plan mit der besseren Stimmungskurve.",
    scoring: ["1 Punkt pro brauchbarem Baustein", "2 Punkte für Stimmungskurve", "1 Punkt für geringe Meckerwahrscheinlichkeit"],
    twist: "Ein Plan darf klein sein. Hauptsache, er rettet mehr als nur die Frisur."
  },
  {
    id: "katastrophen-02",
    chapter: "katastrophen",
    level: "knifflig",
    type: "Krisen-Ranking",
    minutes: 4,
    title: "Was eskaliert zuerst?",
    prompt: "Sortiert verdeckt: leerer Akku, falsche Schuhe, Hunger, verlorene Buchung, nasse Socken. Von harmlos bis maximal urlaubsrelevant.",
    scoring: ["1 Punkt pro gleicher Platzierung", "2 Punkte für gleiche Nummer 1", "1 Punkt für die beste Präventionsregel"],
    twist: "Nasse Socken werden erfahrungsgemäß unterschätzt. Das ist keine medizinische Beratung, nur Beobachtung."
  },
  {
    id: "katastrophen-03",
    chapter: "katastrophen",
    level: "locker",
    type: "Ausreden-Werkstatt",
    minutes: 3,
    title: "Wir kommen etwas später",
    prompt: "Erfindet verdeckt eine ehrliche, aber elegante Verspätungsnachricht. Sie darf nicht lügen, soll aber auch nicht nach kompletter Kapitulation klingen.",
    scoring: ["2 Punkte für Ehrlichkeit", "2 Punkte für Eleganz", "1 Punkt für geringes Rückfrage-Risiko"],
    twist: "Wenn der Satz mit 'lustige Geschichte' beginnt, ist meistens keine lustige Geschichte im Anmarsch."
  },
  {
    id: "katastrophen-04",
    chapter: "katastrophen",
    level: "clever",
    type: "Risikoprofil",
    minutes: 4,
    title: "Der Moment vor dem Problem",
    prompt: "Schreibt verdeckt drei Sätze auf, an denen man erkennt, dass gleich eine kleine Urlaubskatastrophe beginnt.",
    scoring: ["1 Punkt pro treffendem Satz", "2 Punkte für den Satz mit höchster Warnsirene", "1 Punkt für eine Gegenstrategie"],
    twist: "Der Satz 'Das wird schon' ist Joker und darf nur einmal pro Runde verwendet werden."
  },
  {
    id: "memory-01",
    chapter: "memory",
    level: "clever",
    type: "Memory",
    minutes: 4,
    title: "Der Moment bleibt",
    prompt: "Schreibt verdeckt drei kleine Urlaubsmomente auf, die der andere vermutlich später erzählen wird. Danach vergleicht, was wirklich hängen bleibt.",
    scoring: ["2 Punkte pro Treffer", "2 Punkte für den konkretesten Moment", "1 Punkt für die beste Überschrift"],
    twist: "Große Sehenswürdigkeiten zählen nur, wenn ein kleiner Paarmoment daran hängt."
  },
  {
    id: "memory-02",
    chapter: "memory",
    level: "knifflig",
    type: "Letzter Abend",
    minutes: 5,
    title: "Souvenir ohne Staub",
    prompt: "Wählt verdeckt ein nicht-dingliches Souvenir: ein Satz, ein Ritual, ein Fotoauftrag, eine Mini-Regel für zuhause. Danach entscheidet, welches ihr wirklich mitnehmt.",
    scoring: ["2 Punkte für Umsetzbarkeit", "2 Punkte für Paarwert", "1 Punkt, wenn es nächste Woche noch Sinn ergibt"],
    twist: "Magnete sind gesperrt. Der Kühlschrank hatte genug Verantwortung."
  },
  {
    id: "memory-03",
    chapter: "memory",
    level: "locker",
    type: "Titelrunde",
    minutes: 3,
    title: "Urlaubstitel gesucht",
    prompt: "Gebt eurem heutigen Urlaubstag verdeckt einen Buchtitel mit Untertitel. Beispiel: 'Die Rückkehr der falschen Abzweigung - eine Studie in drei Snacks'.",
    scoring: ["2 Punkte für Treffgenauigkeit", "2 Punkte für Humor", "1 Punkt, wenn der Titel morgen noch zitiert wird"],
    twist: "Der Untertitel muss mindestens ein konkretes Detail enthalten."
  },
  {
    id: "memory-04",
    chapter: "memory",
    level: "clever",
    type: "Revanche-Finale",
    minutes: 5,
    title: "Was lernen wir daraus?",
    prompt: "Jeder schreibt verdeckt drei Mini-Regeln für den nächsten gemeinsamen Urlaub: eine praktische, eine faire, eine leicht übertriebene.",
    scoring: ["1 Punkt pro brauchbarer Regel", "2 Punkte für die Regel, die Streit spart", "1 Punkt für charmante Übertreibung"],
    twist: "Regeln mit 'immer' und 'nie' müssen vor Gericht der Realität standhalten."
  }
];

const state = {
  roundMode: "normal",
  seatMode: "sofa",
  levelMode: "clever",
  chapter: "all",
  session: [],
  currentIndex: 0,
  revealed: false,
  scores: [0, 0],
  names: ["Spieler 1", "Spieler 2"],
  timerSeconds: 0,
  timerBase: 0,
  timerRunning: false,
  timerId: null
};

const els = {
  roundForm: document.querySelector("#roundForm"),
  roundOptions: document.querySelector("#roundOptions"),
  seatOptions: document.querySelector("#seatOptions"),
  levelOptions: document.querySelector("#levelOptions"),
  chapterSelect: document.querySelector("#chapterSelect"),
  chapterList: document.querySelector("#chapterList"),
  duelStage: document.querySelector("#duelStage"),
  roundTitle: document.querySelector("#roundTitle"),
  roundKicker: document.querySelector("#roundKicker"),
  duelCounter: document.querySelector("#duelCounter"),
  chapterBadge: document.querySelector("#chapterBadge"),
  sessionList: document.querySelector("#sessionList"),
  revealButton: document.querySelector("#revealButton"),
  prevButton: document.querySelector("#prevButton"),
  nextButton: document.querySelector("#nextButton"),
  printButton: document.querySelector("#printButton"),
  helpButton: document.querySelector("#helpButton"),
  helpModal: document.querySelector("#helpModal"),
  helpCloseButton: document.querySelector("#helpCloseButton"),
  resetScoresButton: document.querySelector("#resetScoresButton"),
  playerOneName: document.querySelector("#playerOneName"),
  playerTwoName: document.querySelector("#playerTwoName"),
  scoreOne: document.querySelector("#scoreOne"),
  scoreTwo: document.querySelector("#scoreTwo"),
  timerDisplay: document.querySelector("#timerDisplay"),
  timerStartButton: document.querySelector("#timerStartButton"),
  timerResetButton: document.querySelector("#timerResetButton"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  saveCode: document.querySelector("#saveCode")
};

init();

function init() {
  renderStaticControls();
  restoreState();
  bindEvents();
  if (!state.session.length) createSession();
  render();
}

function renderStaticControls() {
  els.roundOptions.innerHTML = roundModes.map((mode) => optionButton(mode.id, mode.label)).join("");
  els.seatOptions.innerHTML = seatModes.map((mode) => optionButton(mode.id, mode.label)).join("");
  els.levelOptions.innerHTML = levelModes.map((mode) => optionButton(mode.id, mode.label)).join("");

  els.chapterSelect.innerHTML = chapters.map((chapter) => (
    `<option value="${chapter.id}">${escapeHtml(chapter.label)}</option>`
  )).join("");

  els.chapterList.innerHTML = chapters.filter((chapter) => chapter.id !== "all").map((chapter) => `
    <div class="chapter-chip">
      <strong>${escapeHtml(chapter.number)}</strong>
      <span>
        <b>${escapeHtml(chapter.label)}</b>
        <small>Buchbezug: ${escapeHtml(chapter.bookLabel)}</small>
      </span>
    </div>
  `).join("");
}

function optionButton(id, label) {
  return `<button type="button" data-option="${id}" aria-pressed="false">${escapeHtml(label)}</button>`;
}

function bindEvents() {
  bindSegment(els.roundOptions, "roundMode");
  bindSegment(els.seatOptions, "seatMode");
  bindSegment(els.levelOptions, "levelMode");

  els.chapterSelect.addEventListener("change", () => {
    state.chapter = els.chapterSelect.value;
    persist();
  });

  els.roundForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createSession();
    render();
  });

  els.revealButton.addEventListener("click", () => {
    state.revealed = !state.revealed;
    render();
  });

  els.prevButton.addEventListener("click", () => moveDuel(-1));
  els.nextButton.addEventListener("click", () => moveDuel(1));
  els.printButton.addEventListener("click", () => window.print());
  els.helpButton.addEventListener("click", openHelp);
  els.helpCloseButton.addEventListener("click", closeHelp);
  els.helpModal.addEventListener("click", (event) => {
    if (event.target === els.helpModal) closeHelp();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.helpModal.hidden) closeHelp();
  });
  els.resetScoresButton.addEventListener("click", resetScores);
  els.timerStartButton.addEventListener("click", toggleTimer);
  els.timerResetButton.addEventListener("click", resetTimer);
  els.exportButton.addEventListener("click", exportState);
  els.importButton.addEventListener("click", importState);

  [els.playerOneName, els.playerTwoName].forEach((input, index) => {
    input.addEventListener("input", () => {
      state.names[index] = input.value.trim() || `Spieler ${index + 1}`;
      persist();
      renderScores();
    });
  });
}

function bindSegment(container, key) {
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-option]");
    if (!button) return;
    state[key] = button.dataset.option;
    persist();
    renderControlState();
  });
}

function openHelp() {
  els.helpModal.hidden = false;
  els.helpCloseButton.focus();
}

function closeHelp() {
  els.helpModal.hidden = true;
  els.helpButton.focus();
}

function createSession() {
  const mode = roundModes.find((item) => item.id === state.roundMode) || roundModes[1];
  let pool = duelDeck.filter((duel) => state.chapter === "all" || duel.chapter === state.chapter);
  const exactLevel = pool.filter((duel) => duel.level === state.levelMode);
  if (exactLevel.length >= Math.min(mode.count, 4)) pool = exactLevel.concat(pool.filter((duel) => duel.level !== state.levelMode));
  if (pool.length < mode.count) pool = duelDeck.slice();

  state.session = shuffle(pool).slice(0, mode.count).map((duel) => duel.id);
  state.currentIndex = 0;
  state.revealed = false;
  setTimerForCurrent();
  persist();
}

function render() {
  renderControlState();
  renderScores();
  renderCurrentDuel();
  renderSessionList();
  renderTimer();
  persist();
  if (window.lucide) window.lucide.createIcons();
}

function renderControlState() {
  setPressed(els.roundOptions, state.roundMode);
  setPressed(els.seatOptions, state.seatMode);
  setPressed(els.levelOptions, state.levelMode);
  els.chapterSelect.value = state.chapter;
}

function setPressed(container, value) {
  container.querySelectorAll("[data-option]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.option === value));
  });
}

function renderScores() {
  els.playerOneName.value = state.names[0];
  els.playerTwoName.value = state.names[1];
  els.scoreOne.textContent = state.scores[0];
  els.scoreTwo.textContent = state.scores[1];
}

function renderCurrentDuel() {
  const duel = currentDuel();
  const mode = roundModes.find((item) => item.id === state.roundMode) || roundModes[1];
  els.roundTitle.textContent = mode.title;
  els.roundKicker.textContent = state.seatMode === "tisch" ? "Tischmodus" : state.seatMode === "zug" ? "Zugmodus" : "Sofamodus";
  els.duelCounter.textContent = `${state.currentIndex + 1}/${state.session.length}`;
  els.chapterBadge.textContent = chapterLabel(duel.chapter);
  els.duelStage.classList.toggle("table-mode", state.seatMode === "tisch");

  const main = duelMarkup(duel, false);
  const mirror = duelMarkup(duel, true);
  els.duelStage.innerHTML = `
    <div class="duel-card">
      <div class="duel-main">${main}</div>
      <div class="center-rule">verdeckt schreiben - gleichzeitig aufdecken</div>
      <div class="mirror-copy">${mirror}</div>
    </div>
  `;

  els.revealButton.innerHTML = state.revealed
    ? `<span data-lucide="eye-off"></span> Verbergen`
    : `<span data-lucide="eye"></span> Auswertung`;

  els.duelStage.querySelectorAll("[data-score]").forEach((button) => {
    button.addEventListener("click", () => {
      const player = Number(button.dataset.player);
      const score = Number(button.dataset.score);
      state.scores[player] += score;
      persist();
      renderScores();
    });
  });
}

function duelMarkup(duel, compact) {
  const scoring = duel.scoring.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const reveal = state.revealed ? `
    <div class="reveal-box">
      <h4>Wertung</h4>
      <ul>${scoring}</ul>
      <p><strong>Twist:</strong> ${escapeHtml(duel.twist)}</p>
      ${compact ? "" : scoreButtons()}
    </div>
  ` : "";

  return `
    <div class="duel-head">
      <span class="duel-type">${escapeHtml(duel.type)}</span>
      <span class="duel-time">${duel.minutes} Min.</span>
    </div>
    <h3>${escapeHtml(duel.title)}</h3>
    <p class="duel-prompt">${escapeHtml(duel.prompt)}</p>
    ${compact ? "" : answerPads()}
    ${reveal}
  `;
}

function answerPads() {
  return `
    <div class="duel-fields">
      ${answerPad(state.names[0])}
      ${answerPad(state.names[1])}
    </div>
  `;
}

function answerPad(name) {
  return `
    <div class="answer-pad">
      <strong>${escapeHtml(name)}</strong>
      <div class="write-lines" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
    </div>
  `;
}

function scoreButtons() {
  return `
    <div class="score-buttons">
      <button type="button" data-score="1" data-player="0">+1 ${escapeHtml(state.names[0])}</button>
      <button type="button" data-score="2" data-player="0">+2 ${escapeHtml(state.names[0])}</button>
      <button type="button" data-score="1" data-player="1">+1 ${escapeHtml(state.names[1])}</button>
      <button type="button" data-score="2" data-player="1">+2 ${escapeHtml(state.names[1])}</button>
    </div>
  `;
}

function renderSessionList() {
  els.sessionList.innerHTML = state.session.map((id, index) => {
    const duel = duelById(id);
    return `
      <li>
        <button type="button" data-index="${index}" aria-current="${index === state.currentIndex}">
          <strong>${index + 1}. ${escapeHtml(duel.title)}</strong>
          <span>${escapeHtml(chapterLabel(duel.chapter))} · ${escapeHtml(duel.type)}</span>
        </button>
      </li>
    `;
  }).join("");

  els.sessionList.querySelectorAll("[data-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentIndex = Number(button.dataset.index);
      state.revealed = false;
      setTimerForCurrent();
      render();
    });
  });
}

function moveDuel(direction) {
  if (!state.session.length) return;
  state.currentIndex = (state.currentIndex + direction + state.session.length) % state.session.length;
  state.revealed = false;
  setTimerForCurrent();
  render();
}

function resetScores() {
  state.scores = [0, 0];
  persist();
  renderScores();
}

function setTimerForCurrent() {
  stopTimer();
  const duel = currentDuel();
  state.timerBase = duel.minutes * 60;
  state.timerSeconds = state.timerBase;
}

function toggleTimer() {
  if (state.timerRunning) {
    stopTimer();
    renderTimer();
    return;
  }
  state.timerRunning = true;
  state.timerId = window.setInterval(() => {
    state.timerSeconds = Math.max(0, state.timerSeconds - 1);
    if (state.timerSeconds === 0) stopTimer();
    renderTimer();
    persist();
  }, 1000);
  renderTimer();
}

function stopTimer() {
  state.timerRunning = false;
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
}

function resetTimer() {
  stopTimer();
  state.timerSeconds = state.timerBase || currentDuel().minutes * 60;
  renderTimer();
  persist();
}

function renderTimer() {
  const minutes = Math.floor(state.timerSeconds / 60).toString().padStart(2, "0");
  const seconds = (state.timerSeconds % 60).toString().padStart(2, "0");
  els.timerDisplay.textContent = `${minutes}:${seconds}`;
  els.timerStartButton.innerHTML = state.timerRunning ? `<span data-lucide="pause"></span>` : `<span data-lucide="timer"></span>`;
  if (window.lucide) window.lucide.createIcons();
}

function exportState() {
  const payload = snapshot();
  els.saveCode.value = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  els.saveCode.select();
}

function importState() {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(els.saveCode.value.trim()))));
    applySnapshot(data);
    persist();
    render();
  } catch (error) {
    els.saveCode.value = "Der Code konnte nicht gelesen werden.";
  }
}

function snapshot() {
  return {
    roundMode: state.roundMode,
    seatMode: state.seatMode,
    levelMode: state.levelMode,
    chapter: state.chapter,
    session: state.session,
    currentIndex: state.currentIndex,
    scores: state.scores,
    names: state.names
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    applySnapshot(JSON.parse(raw));
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function applySnapshot(data) {
  state.roundMode = validId(roundModes, data.roundMode, "normal");
  state.seatMode = validId(seatModes, data.seatMode, "sofa");
  state.levelMode = validId(levelModes, data.levelMode, "clever");
  state.chapter = validId(chapters, data.chapter, "all");
  state.session = Array.isArray(data.session) ? data.session.filter((id) => duelDeck.some((duel) => duel.id === id)) : [];
  state.currentIndex = Math.min(Math.max(Number(data.currentIndex) || 0, 0), Math.max(state.session.length - 1, 0));
  state.scores = Array.isArray(data.scores) ? [Number(data.scores[0]) || 0, Number(data.scores[1]) || 0] : [0, 0];
  state.names = Array.isArray(data.names) ? [String(data.names[0] || "Spieler 1"), String(data.names[1] || "Spieler 2")] : ["Spieler 1", "Spieler 2"];
  setTimerForCurrent();
}

function validId(list, value, fallback) {
  return list.some((item) => item.id === value) ? value : fallback;
}

function currentDuel() {
  if (!state.session.length) createSession();
  return duelById(state.session[state.currentIndex]) || duelDeck[0];
}

function duelById(id) {
  return duelDeck.find((duel) => duel.id === id);
}

function chapterLabel(id) {
  return (chapters.find((chapter) => chapter.id === id) || chapters[0]).label;
}

function shuffle(items) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
