const cases = {
  leicht: [
    {
      title: "Der Fall am Bahnhof",
      type: "Ausschluss",
      intro: "Am Morgen verschwand ein versiegelter Umschlag aus dem Wartesaal von Baker Street. Nur drei Personen waren in der Naehe: der Schaffner Bell, die Blumenhaendlerin Miss Vale und der Student Mr. Larkin.",
      clues: [
        "Der Umschlag wurde zwischen 8:10 und 8:20 Uhr genommen.",
        "Bell kontrollierte um 8:15 Uhr Fahrkarten auf dem Bahnsteig.",
        "Miss Vale stellte um 8:12 Uhr einen Korb direkt neben den Tisch mit dem Umschlag.",
        "Mr. Larkin war bis 8:18 Uhr im Telegrafenraum und wurde dort vom Beamten gesehen.",
        "Wer den Umschlag nahm, musste ihn unter etwas Weichem verstecken, denn es gab kein Rascheln von Papier."
      ],
      question: "Wer nahm den Umschlag?",
      hint: "Achte darauf, wer zur richtigen Zeit nah genug war und ein passendes Versteck bei sich hatte.",
      solution: "Miss Vale nahm den Umschlag. Bell und Larkin haben fuer den entscheidenden Zeitraum Alibis, und der Blumenkorb bietet ein weiches Versteck."
    },
    {
      title: "Die Kerze im Salon",
      type: "Zeitlogik",
      intro: "In einem Salon brannte eine neue Kerze genau 40 Minuten. Als Holmes eintraf, war sie zur Haelfte heruntergebrannt. Drei Gaeste behaupten, sie seien zuletzt im Raum gewesen.",
      clues: [
        "Sir Edwin verliess den Salon um 9:10 Uhr.",
        "Mrs. Gray verliess ihn um 9:18 Uhr.",
        "Dr. Mallory verliess ihn um 9:26 Uhr.",
        "Holmes traf um 9:30 Uhr ein.",
        "Die Kerze wurde erst angezuendet, als die verantwortliche Person den Raum betrat."
      ],
      question: "Wer hat die Kerze angezuendet?",
      hint: "Eine halb verbrannte Kerze hat 20 Minuten gebrannt.",
      solution: "Sir Edwin hat die Kerze angezuendet. Wenn Holmes um 9:30 Uhr eine halb verbrannte 40-Minuten-Kerze sieht, brennt sie seit 9:10 Uhr."
    },
    {
      title: "Der vertauschte Spazierstock",
      type: "Merkmal",
      intro: "Drei Spazierstoecke stehen im Flur: einer mit Silberknauf, einer mit Kerbe, einer mit dunklem Band. Holmes weiss, dass jeder Besitzer genau ein Merkmal genannt hat.",
      clues: [
        "Watson sagt: Mein Stock hat keinen Silberknauf.",
        "Inspector Lestrade sagt: Mein Stock hat die Kerbe.",
        "Mr. Hudson sagt: Mein Stock hat nicht das dunkle Band.",
        "Nur eine dieser Aussagen ist falsch.",
        "Der Stock mit Silberknauf gehoert nicht Lestrade."
      ],
      question: "Welcher Stock gehoert Watson?",
      hint: "Teste zuerst, ob Lestrades Aussage wahr sein kann.",
      solution: "Watson gehoert der Stock mit dunklem Band. Lestrade hat die Kerbe, Hudson den Silberknauf. Damit ist Hudsons Aussage falsch und die beiden anderen sind wahr."
    }
  ],
  mittel: [
    {
      title: "Die vier Notizbuecher",
      type: "Reihenfolge",
      intro: "Auf Holmes' Tisch liegen vier Notizbuecher in einer Reihe: rot, gruen, blau und schwarz. Jedes enthaelt einen anderen Fall: Uhr, Rubin, Brief und Maske.",
      clues: [
        "Das rote Buch liegt ganz links.",
        "Das gruene Buch liegt direkt rechts neben dem roten Buch.",
        "Der Fall mit dem Rubin liegt direkt rechts neben dem Fall mit der Maske.",
        "Der Brief liegt nicht im schwarzen Buch.",
        "Der Fall mit der Uhr liegt im blauen Buch.",
        "Das schwarze Buch liegt rechts vom blauen Buch."
      ],
      question: "Welches Buch enthaelt den Fall mit dem Brief?",
      hint: "Ordne zuerst die Farben: rot, gruen, blau, schwarz. Danach bleibt fuer Brief nur eine Position uebrig.",
      solution: "Der Brief liegt im gruenen Buch. Die Reihenfolge der Farben ist rot, gruen, blau, schwarz. Blau enthaelt die Uhr, schwarz nicht den Brief. Maske und Rubin muessen direkt nebeneinander liegen, also bleiben rot und schwarz dafuer; damit bleibt gruen fuer den Brief."
    },
    {
      title: "Der Klub der fuenf Herren",
      type: "Kombination",
      intro: "Fuenf Herren betraten nacheinander einen Klub: Archer, Blake, Caine, Doyle und Ellis. Jeder trug ein anderes Accessoire: Hut, Schal, Uhrkette, Handschuhe oder Spazierstock.",
      clues: [
        "Doyle kam als Erster.",
        "Blake kam direkt nach Doyle.",
        "Ellis kam weder als Erster noch als Letzter.",
        "Caine kam unmittelbar nach dem Mann mit dem Schal.",
        "Der Mann mit dem Spazierstock kam als Vierter.",
        "Archer kam spaeter als Blake."
      ],
      question: "Wer kam als Vierter in den Klub?",
      hint: "Die ersten beiden Plaetze sind fest. Caine muss direkt hinter dem Schaltraeger liegen.",
      solution: "Archer kam als Vierter. Doyle ist Erster, Blake Zweiter. Ellis kann dann nur Dritter sein, Caine folgt direkt nach dem Schaltraeger als Fuenfter, und Archer bleibt als Vierter."
    },
    {
      title: "Das Dinner in der Devonshire Street",
      type: "Logikgitter",
      intro: "Vier Gaeste sassen an einem runden Tisch: Nora, Felix, Clara und Basil. Jeder brachte ein Geschenk: Tabakdose, Stadtplan, Opernglas oder Siegelring.",
      clues: [
        "Nora sass direkt gegenueber der Person mit dem Stadtplan.",
        "Felix sass direkt links von Clara.",
        "Basil brachte nicht den Siegelring.",
        "Die Person mit dem Opernglas sass direkt rechts von Nora.",
        "Clara sass direkt gegenueber von Nora.",
        "Clara brachte nicht die Tabakdose."
      ],
      question: "Welches Geschenk brachte Clara?",
      hint: "Wer gegenueber von Nora sitzt, hat laut erstem Hinweis den Stadtplan.",
      solution: "Clara brachte den Stadtplan. Clara sitzt gegenueber von Nora, und genau diese Person brachte den Stadtplan."
    }
  ]
};

const state = {
  difficulty: "leicht",
  lastIndex: -1
};

const selectors = {
  segments: document.querySelectorAll(".segment"),
  newPuzzle: document.querySelector("#new-puzzle"),
  difficulty: document.querySelector("#case-difficulty"),
  title: document.querySelector("#case-title"),
  type: document.querySelector("#case-type"),
  puzzleText: document.querySelector("#puzzle-text"),
  hintButton: document.querySelector("#hint-button"),
  solutionButton: document.querySelector("#solution-button"),
  hint: document.querySelector("#hint"),
  solution: document.querySelector("#solution"),
  answer: document.querySelector("#user-answer")
};

function pickCase() {
  const pool = cases[state.difficulty];
  let index = Math.floor(Math.random() * pool.length);

  if (pool.length > 1) {
    while (index === state.lastIndex) {
      index = Math.floor(Math.random() * pool.length);
    }
  }

  state.lastIndex = index;
  return pool[index];
}

function renderCase(caseFile) {
  selectors.difficulty.textContent = state.difficulty === "leicht" ? "Leicht" : "Mittel";
  selectors.title.textContent = caseFile.title;
  selectors.type.textContent = caseFile.type;
  selectors.puzzleText.innerHTML = `
    <p>${caseFile.intro}</p>
    <ul>${caseFile.clues.map((clue) => `<li>${clue}</li>`).join("")}</ul>
    <p><strong>Frage:</strong> ${caseFile.question}</p>
  `;
  selectors.hint.textContent = caseFile.hint;
  selectors.solution.innerHTML = `<p><strong>Schlussfolgerung:</strong> ${caseFile.solution}</p>`;
  selectors.hint.hidden = true;
  selectors.solution.hidden = true;
  selectors.solutionButton.textContent = "Loesung anzeigen";
  selectors.solutionButton.setAttribute("aria-expanded", "false");
  selectors.answer.value = "";
}

function updateDifficulty(nextDifficulty) {
  state.difficulty = nextDifficulty;
  state.lastIndex = -1;
  selectors.segments.forEach((button) => {
    const active = button.dataset.difficulty === nextDifficulty;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderCase(pickCase());
}

selectors.segments.forEach((button) => {
  button.addEventListener("click", () => updateDifficulty(button.dataset.difficulty));
});

selectors.newPuzzle.addEventListener("click", () => renderCase(pickCase()));

selectors.hintButton.addEventListener("click", () => {
  selectors.hint.hidden = !selectors.hint.hidden;
});

selectors.solutionButton.addEventListener("click", () => {
  const shouldShow = selectors.solution.hidden;
  selectors.solution.hidden = !shouldShow;
  selectors.solutionButton.textContent = shouldShow ? "Loesung verbergen" : "Loesung anzeigen";
  selectors.solutionButton.setAttribute("aria-expanded", String(shouldShow));
});

updateDifficulty("leicht");
