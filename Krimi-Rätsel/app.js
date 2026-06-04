const STORAGE_KEY = "krimi-raetsel-light-v1";

const cases = [
  {
    id: "bahnhof",
    title: "Der Fall am Bahnhof",
    location: "Bahnsteig 3",
    intro: "Kurz vor Abfahrt verschwindet die goldene Taschenuhr des Direktors. Drei Personen standen am Zeitungskiosk, doch nur eine hatte genug Zeit und den passenden Gegenstand bei sich.",
    suspects: ["Frau Keller", "Herr Brandt", "Mia Vogt"],
    evidence: ["Zugticket", "Roter Schal", "Messing-Schluessel"],
    clues: [
      "Die Person mit dem roten Schal stieg sofort in den Zug und konnte nicht zum Kiosk zurueck.",
      "Herr Brandt zeigte dem Schaffner sein Zugticket, waehrend die Uhr verschwand.",
      "Am Uhrkettenverschluss fand sich ein winziger Messingabrieb.",
      "Mia Vogt hatte keinen Schal und kein Ticket, aber einen grossen Messing-Schluesselbund."
    ],
    hint: "Streiche zuerst alle, die zeitlich nicht am Kiosk gewesen sein koennen. Dann suche das Beweisstueck, das zur Spur passt.",
    answerSuspect: "Mia Vogt",
    answerEvidence: "Messing-Schluessel",
    solution: "Mia Vogt nahm die Uhr. Der Messingabrieb passt zu ihrem Schluesselbund, und im Gegensatz zu Frau Keller und Herrn Brandt war sie zur Tatzeit noch am Kiosk."
  },
  {
    id: "bibliothek",
    title: "Das verschwundene Manuskript",
    location: "Stadtbibliothek",
    intro: "Ein alter Krimi-Entwurf fehlt aus der Vitrine. Die Scheibe blieb heil, doch neben dem Schloss liegt ein feiner blauer Faden.",
    suspects: ["Dr. Seidel", "Lena Hart", "Otto Grimm"],
    evidence: ["Blauer Handschuh", "Lesekarte", "Silberner Fueller"],
    clues: [
      "Dr. Seidel verliess die Bibliothek vor dem Abschliessen der Vitrine.",
      "Otto Grimm trug an diesem Abend braune Lederhandschuhe.",
      "Lena Hart hatte blaue Wollhandschuhe in der Manteltasche.",
      "Der Faden am Schloss ist blau und aus Wolle."
    ],
    hint: "Die Spur ist kein kompliziertes Alibi, sondern Material und Farbe.",
    answerSuspect: "Lena Hart",
    answerEvidence: "Blauer Handschuh",
    solution: "Lena Hart ist die Taeterin. Der blaue Wollfaden passt zu ihren Handschuhen; die anderen Hinweise schliessen Dr. Seidel und Otto Grimm aus."
  },
  {
    id: "teestube",
    title: "Der Zucker im Teesalon",
    location: "Teestube Rosenblatt",
    intro: "Die teure Vanilledose wurde gegen einfachen Zucker ausgetauscht. Drei Stammgaeste waren kurz allein am Serviertisch.",
    suspects: ["Paul Kranz", "Sofie Lenz", "Herr Albrecht"],
    evidence: ["Vanilleduft", "Kassenbon", "Porzellanloeffel"],
    clues: [
      "Paul Kranz bestellte Kaffee und beruehrte den Teetisch nicht.",
      "Herr Albrecht verliess den Salon, bevor die Dose auf den Tisch gestellt wurde.",
      "Sofie Lenz roch auffallend nach Vanille, obwohl sie nur Pfefferminztee trank.",
      "An der ausgetauschten Dose blieb ein leichter Vanilleduft an der Aussenseite."
    ],
    hint: "Wer hatte Kontakt mit der echten Dose, obwohl das eigene Getraenk keine Vanille erklaert?",
    answerSuspect: "Sofie Lenz",
    answerEvidence: "Vanilleduft",
    solution: "Sofie Lenz tauschte die Dose. Der Vanilleduft an ihr und an der Dose zeigt den Kontakt; Paul und Herr Albrecht passen zeitlich nicht."
  },
  {
    id: "atelier",
    title: "Die Farbe am Rahmen",
    location: "Atelier Nordlicht",
    intro: "Ein kleines Gemaelde wird aus dem Atelier genommen und spaeter im Flur gefunden. Am Rahmen klebt frische gruene Farbe.",
    suspects: ["Nora Weiss", "Ben Ritter", "Clara Jung"],
    evidence: ["Gruene Farbe", "Skizzenblock", "Pinselbecher"],
    clues: [
      "Nora Weiss malte an diesem Tag ausschliesslich mit Blau und Weiss.",
      "Ben Ritter reinigte den Pinselbecher im Hof und war nicht im Flur.",
      "Clara Jung arbeitete an einem Plakat mit frischer gruener Farbe.",
      "Die Farbstelle am Rahmen war noch feucht."
    ],
    hint: "Achte darauf, wessen Arbeitsplatz zur frischen Farbe passt.",
    answerSuspect: "Clara Jung",
    answerEvidence: "Gruene Farbe",
    solution: "Clara Jung bewegte das Bild. Nur sie nutzte frische gruene Farbe, die am Rahmen haften blieb."
  },
  {
    id: "hotel",
    title: "Der Brief aus Zimmer 12",
    location: "Hotel Adler",
    intro: "Ein versiegelter Brief verschwindet von der Rezeption. Spaeter liegt nur noch ein Umschlag mit Kaffeespur im Papierkorb.",
    suspects: ["Portier Emil", "Gast Rosa", "Kurier Stein"],
    evidence: ["Kaffeefleck", "Zimmerkarte", "Regenschirm"],
    clues: [
      "Der Kurier Stein gab den Brief ab und verliess das Hotel sofort.",
      "Portier Emil trinkt keinen Kaffee und hatte waehrenddessen Telefondienst im Buero.",
      "Gast Rosa verschuettete kurz zuvor Kaffee an der Rezeption.",
      "Der Papierkorb stand direkt neben dem Rezeptionstisch."
    ],
    hint: "Die Spur verrät nicht nur ein Getraenk, sondern den Ort der Handlung.",
    answerSuspect: "Gast Rosa",
    answerEvidence: "Kaffeefleck",
    solution: "Gast Rosa nahm den Brief. Der Kaffefleck verbindet sie mit dem Umschlag an der Rezeption; Stein war weg und Emil war im Buero."
  },
  {
    id: "markt",
    title: "Die Perle auf dem Markt",
    location: "Wochenmarkt",
    intro: "Aus einer Schmuckschale fehlt eine einzelne Perle. Zwischen den Kisten liegt ein abgerissener gelber Knopf.",
    suspects: ["Hanna Perl", "Max Dorn", "Greta Falk"],
    evidence: ["Gelber Knopf", "Obstkiste", "Quittung"],
    clues: [
      "Max Dorn trug eine Jacke mit schwarzen Metallknoepfen.",
      "Greta Falk bezahlte nachweislich am Nachbarstand, als die Perle verschwand.",
      "Hanna Perl hatte eine gelbe Strickjacke, an der spaeter ein Knopf fehlte.",
      "Der gelbe Knopf lag direkt neben der Schmuckschale."
    ],
    hint: "Ein verlorenes Kleidungsstueckteil ist bei einem leichten Fall oft der direkteste Hinweis.",
    answerSuspect: "Hanna Perl",
    answerEvidence: "Gelber Knopf",
    solution: "Hanna Perl nahm die Perle. Ihr fehlender gelber Knopf passt genau zur Spur neben der Schmuckschale."
  },
  {
    id: "museum",
    title: "Die leere Vitrine",
    location: "Stadtmuseum",
    intro: "Eine alte Muenzsammlung fehlt. Die Vitrine ist nicht aufgebrochen, aber auf dem Glas liegt ein Abdruck von Kreidestaub.",
    suspects: ["Lehrerin Marta", "Waerter Holm", "Schueler Finn"],
    evidence: ["Kreidestaub", "Schluesselring", "Museumskarte"],
    clues: [
      "Waerter Holm oeffnete die Vitrine morgens, danach blieb sein Schluessel im Buero.",
      "Schueler Finn durfte die Vitrine nicht beruehren und stand beim Gruppenfoto im Hof.",
      "Lehrerin Marta kam direkt aus dem Klassenzimmer und hatte Kreide an den Fingern.",
      "Der Abdruck liegt genau am Griff der Vitrine."
    ],
    hint: "Wer konnte einen Kreideabdruck am Griff hinterlassen?",
    answerSuspect: "Lehrerin Marta",
    answerEvidence: "Kreidestaub",
    solution: "Lehrerin Marta ist verantwortlich. Der Kreidestaub am Griff passt zu ihren Fingern; Finn und Holm sind durch die Hinweise ausgeschlossen."
  },
  {
    id: "kino",
    title: "Das Ticket im Kino",
    location: "Kino Merkur",
    intro: "Ein reserviertes Premieren-Ticket verschwindet aus der Kasse. Zurueck bleibt ein Streifen Popcornpapier mit roter Tinte.",
    suspects: ["Anna Klee", "Tom Berger", "Viktor Maas"],
    evidence: ["Rote Tinte", "Popcornpapier", "Kinoplan"],
    clues: [
      "Tom Berger sass schon im Saal, bevor die Kasse geoeffnet wurde.",
      "Viktor Maas hatte keine Popcorn-Tuete und bezahlte bar ohne Stift.",
      "Anna Klee markierte ihre Notizen mit einem roten Filzstift.",
      "Auf dem Popcornpapier stehen rote Zahlen, die zur Ticketnummer passen."
    ],
    hint: "Kombiniere Gegenstand und Schriftfarbe.",
    answerSuspect: "Anna Klee",
    answerEvidence: "Rote Tinte",
    solution: "Anna Klee nahm das Ticket. Die rote Tinte auf dem Popcornpapier passt zu ihrem Stift und zur notierten Ticketnummer."
  }
];

const state = {
  activeIndex: 0,
  entries: loadEntries()
};

const elements = {
  caseList: document.querySelector("#caseList"),
  progressText: document.querySelector("#progressText"),
  progressFill: document.querySelector("#progressFill"),
  progressMessage: document.querySelector("#progressMessage"),
  caseMeta: document.querySelector("#caseMeta"),
  caseTitle: document.querySelector("#caseTitle"),
  caseIntro: document.querySelector("#caseIntro"),
  clueList: document.querySelector("#clueList"),
  revealClueButton: document.querySelector("#revealClueButton"),
  suspectOptions: document.querySelector("#suspectOptions"),
  evidenceOptions: document.querySelector("#evidenceOptions"),
  guessInput: document.querySelector("#guessInput"),
  feedback: document.querySelector("#feedback"),
  newCaseButton: document.querySelector("#newCaseButton"),
  continueButton: document.querySelector("#continueButton"),
  checkButton: document.querySelector("#checkButton"),
  hintButton: document.querySelector("#hintButton"),
  solutionButton: document.querySelector("#solutionButton")
};

render();

elements.newCaseButton.addEventListener("click", () => {
  const start = state.activeIndex + 1;
  const next = cases.findIndex((item, index) => index >= start && !getEntry(item.id).solved);
  state.activeIndex = next === -1 ? 0 : next;
  render();
  scrollToCase();
});

elements.continueButton.addEventListener("click", () => {
  const openIndex = cases.findIndex((item) => !getEntry(item.id).solved);
  state.activeIndex = openIndex === -1 ? 0 : openIndex;
  render();
  scrollToCase();
});

elements.revealClueButton.addEventListener("click", () => {
  const activeCase = getActiveCase();
  const entry = getEntry(activeCase.id);
  entry.cluesShown = Math.min(activeCase.clues.length, (entry.cluesShown ?? 2) + 1);
  saveEntries();
  renderActiveCase();
});

elements.guessInput.addEventListener("input", () => {
  updateEntry({ guess: elements.guessInput.value });
});

elements.checkButton.addEventListener("click", checkAnswer);
elements.hintButton.addEventListener("click", showHint);
elements.solutionButton.addEventListener("click", showSolution);

function render() {
  renderCaseList();
  renderActiveCase();
  renderProgress();
}

function renderCaseList() {
  elements.caseList.innerHTML = "";
  cases.forEach((item, index) => {
    const entry = getEntry(item.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "case-button";
    button.classList.toggle("is-active", index === state.activeIndex);
    button.classList.toggle("is-solved", Boolean(entry.solved));
    button.innerHTML = `
      <span class="case-button__number"><span>${String(index + 1).padStart(2, "0")}</span></span>
      <span>
        <span class="case-button__title">${escapeHtml(item.title)}</span>
        <span class="case-button__meta">${escapeHtml(item.location)} · Leicht</span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.activeIndex = index;
      render();
    });
    elements.caseList.append(button);
  });
}

function renderActiveCase() {
  const activeCase = getActiveCase();
  const entry = getEntry(activeCase.id);
  const cluesShown = entry.cluesShown ?? 2;

  elements.caseMeta.textContent = `${activeCase.location} · Leicht`;
  elements.caseTitle.textContent = activeCase.title;
  elements.caseIntro.textContent = activeCase.intro;
  elements.guessInput.value = entry.guess ?? "";
  elements.feedback.hidden = true;
  elements.feedback.className = "feedback";

  elements.clueList.innerHTML = "";
  activeCase.clues.forEach((clue, index) => {
    const item = document.createElement("li");
    item.textContent = index < cluesShown ? clue : "Noch verdeckter Hinweis";
    item.classList.toggle("locked", index >= cluesShown);
    elements.clueList.append(item);
  });
  elements.revealClueButton.disabled = cluesShown >= activeCase.clues.length;
  elements.revealClueButton.textContent = cluesShown >= activeCase.clues.length ? "Alle Hinweise sichtbar" : "Nächster Hinweis";

  renderOptions("suspects", activeCase.suspects, elements.suspectOptions);
  renderOptions("evidence", activeCase.evidence, elements.evidenceOptions);
}

function renderOptions(kind, options, container) {
  const activeCase = getActiveCase();
  const entry = getEntry(activeCase.id);
  const crossed = entry[kind] ?? [];

  container.innerHTML = "";
  options.forEach((name) => {
    const label = document.createElement("label");
    label.className = "option";
    label.classList.toggle("is-crossed", crossed.includes(name));
    label.innerHTML = `
      <input type="checkbox" ${crossed.includes(name) ? "checked" : ""}>
      <span>${escapeHtml(name)}</span>
    `;
    label.querySelector("input").addEventListener("change", (event) => {
      const current = new Set(getEntry(activeCase.id)[kind] ?? []);
      if (event.target.checked) {
        current.add(name);
      } else {
        current.delete(name);
      }
      updateEntry({ [kind]: [...current] });
      label.classList.toggle("is-crossed", event.target.checked);
    });
    container.append(label);
  });
}

function renderProgress() {
  const solved = cases.filter((item) => getEntry(item.id).solved).length;
  const percentage = Math.round((solved / cases.length) * 100);
  elements.progressText.textContent = `${solved}/${cases.length}`;
  elements.progressFill.style.width = `${percentage}%`;

  if (solved === 0) {
    elements.progressMessage.textContent = "Starte mit einem leichten Fall und streiche aus, was nicht passen kann.";
  } else if (solved < cases.length) {
    elements.progressMessage.textContent = "Gute Spur. Jeder geloeste Fall macht das Ausschliessen leichter.";
  } else {
    elements.progressMessage.textContent = "Alle leichten Faelle geloest. Der Meisterdetektiv kann zufrieden nicken.";
  }
}

function checkAnswer() {
  const activeCase = getActiveCase();
  const entry = getEntry(activeCase.id);
  const guess = normalize(entry.guess ?? "");
  const suspectHit = guess.includes(normalize(activeCase.answerSuspect));
  const evidenceHit = guess.includes(normalize(activeCase.answerEvidence));

  if (suspectHit && evidenceHit) {
    updateEntry({ solved: true, cluesShown: activeCase.clues.length });
    renderCaseList();
    renderProgress();
    showFeedback(`Richtig. ${activeCase.solution}`, "success");
    return;
  }

  showFeedback("Noch nicht ganz. Pruefe zuerst, wer durch Zeit oder Ort ausgeschlossen ist, und gleiche dann das Beweisstueck mit der Spur ab.", "warning");
}

function showHint() {
  showFeedback(getActiveCase().hint);
}

function showSolution() {
  const activeCase = getActiveCase();
  updateEntry({ solved: true, cluesShown: activeCase.clues.length });
  renderCaseList();
  renderProgress();
  renderActiveCase();
  showFeedback(activeCase.solution, "success");
}

function showFeedback(text, type = "") {
  elements.feedback.textContent = text;
  elements.feedback.hidden = false;
  elements.feedback.className = `feedback${type ? ` is-${type}` : ""}`;
}

function getActiveCase() {
  return cases[state.activeIndex];
}

function getEntry(id) {
  if (!state.entries[id]) {
    state.entries[id] = { cluesShown: 2, suspects: [], evidence: [], guess: "", solved: false };
  }
  return state.entries[id];
}

function updateEntry(patch) {
  const activeCase = getActiveCase();
  state.entries[activeCase.id] = {
    ...getEntry(activeCase.id),
    ...patch,
    updatedAt: new Date().toISOString()
  };
  saveEntries();
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
}

function scrollToCase() {
  document.querySelector(".case-stage").scrollIntoView({ behavior: "smooth", block: "start" });
}

function normalize(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
