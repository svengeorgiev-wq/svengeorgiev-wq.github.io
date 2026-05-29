const data = {
  people: [
    "Inspector Lestrade",
    "Dr. Watson",
    "Mrs. Hudson",
    "Miss Adler",
    "Mr. Hopkins",
    "Sir Reginald",
    "Miss Morstan",
    "Mr. Wiggins"
  ],
  items: [
    "die Taschenuhr",
    "den versiegelten Brief",
    "den Stadtplan",
    "das Opernglas",
    "die Tabakdose",
    "den Siegelring",
    "den Theaterzettel",
    "den silbernen Schluessel"
  ],
  places: [
    "im Lesezimmer",
    "am Kamin",
    "im Flur",
    "beim Teetisch",
    "in der Bibliothek",
    "am Fenster"
  ],
  titles: [
    "Der Fall in der Baker Street",
    "Die Spur im Nebel",
    "Das Raetsel der Abendpost",
    "Die Notiz am Kamin",
    "Der Besucher ohne Alibi",
    "Das Geheimnis der Devonshire Street"
  ]
};

const state = {
  difficulty: "leicht",
  lastSignature: ""
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

function sample(list, count) {
  return shuffle([...list]).slice(0, count);
}

function shuffle(list) {
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}

function permutations(list) {
  if (list.length <= 1) {
    return [list];
  }

  return list.flatMap((entry, index) => {
    const rest = [...list.slice(0, index), ...list.slice(index + 1)];
    return permutations(rest).map((permutation) => [entry, ...permutation]);
  });
}

function ordinal(position) {
  return ["erste", "zweite", "dritte", "vierte"][position - 1];
}

function buildAssignment(keys, values) {
  const shuffledValues = shuffle([...values]);
  return Object.fromEntries(keys.map((key, index) => [key, shuffledValues[index]]));
}

function solveEasy(puzzle, clues) {
  return permutations(puzzle.items)
    .map((itemOrder) => ({
      itemByPerson: Object.fromEntries(puzzle.people.map((person, index) => [person, itemOrder[index]]))
    }))
    .filter((candidate) => clues.every((clue) => clue.test(candidate)));
}

function solveMedium(puzzle, clues) {
  const itemPermutations = permutations(puzzle.items);
  const positionPermutations = permutations([1, 2, 3, 4]);
  const candidates = [];

  itemPermutations.forEach((itemOrder) => {
    positionPermutations.forEach((positionOrder) => {
      candidates.push({
        itemByPerson: Object.fromEntries(puzzle.people.map((person, index) => [person, itemOrder[index]])),
        positionByPerson: Object.fromEntries(puzzle.people.map((person, index) => [person, positionOrder[index]]))
      });
    });
  });

  return candidates.filter((candidate) => clues.every((clue) => clue.test(candidate)));
}

function makeEasyClues(puzzle, solution, targetItem) {
  const candidates = [];

  puzzle.people.forEach((person) => {
    puzzle.items.forEach((item) => {
      if (solution.itemByPerson[person] === item && item !== targetItem) {
        candidates.push({
          text: `${person} hatte ${item}.`,
          hint: "Ein direkter Fund ordnet eine Person sofort zu.",
          test: (candidate) => candidate.itemByPerson[person] === item
        });
      }

      if (solution.itemByPerson[person] !== item) {
        candidates.push({
          text: `${person} hatte nicht ${item}.`,
          hint: "Streiche unmoegliche Zuordnungen konsequent weg.",
          test: (candidate) => candidate.itemByPerson[person] !== item
        });
      }
    });
  });

  return shuffle(candidates);
}

function makeMediumClues(puzzle, solution, targetItem) {
  const candidates = [];

  puzzle.people.forEach((person) => {
    puzzle.items.forEach((item) => {
      if (solution.itemByPerson[person] === item && item !== targetItem) {
        candidates.push({
          text: `${person} trug ${item} bei sich.`,
          hint: "Sichere Zuordnungen verankern das Logikgitter.",
          test: (candidate) => candidate.itemByPerson[person] === item
        });
      }

      if (solution.itemByPerson[person] !== item) {
        candidates.push({
          text: `${person} hatte nicht ${item}.`,
          hint: "Ein Ausschluss ist oft genauso stark wie ein direkter Hinweis.",
          test: (candidate) => candidate.itemByPerson[person] !== item
        });
      }
    });

    const position = solution.positionByPerson[person];
    candidates.push({
      text: `${person} war die ${ordinal(position)} Person, die Holmes befragte.`,
      hint: "Setze zuerst die festen Positionen in die Reihenfolge.",
      test: (candidate) => candidate.positionByPerson[person] === position
    });
  });

  puzzle.people.forEach((leftPerson) => {
    puzzle.people.forEach((rightPerson) => {
      if (leftPerson === rightPerson) {
        return;
      }

      const leftPosition = solution.positionByPerson[leftPerson];
      const rightPosition = solution.positionByPerson[rightPerson];

      if (leftPosition < rightPosition) {
        candidates.push({
          text: `${leftPerson} wurde vor ${rightPerson} befragt.`,
          hint: "Vorher-nachher-Hinweise begrenzen die Reihenfolge.",
          test: (candidate) => candidate.positionByPerson[leftPerson] < candidate.positionByPerson[rightPerson]
        });
      }

      if (leftPosition + 1 === rightPosition) {
        candidates.push({
          text: `${rightPerson} wurde direkt nach ${leftPerson} befragt.`,
          hint: "Direkt benachbarte Personen bilden einen Block.",
          test: (candidate) => candidate.positionByPerson[rightPerson] === candidate.positionByPerson[leftPerson] + 1
        });
      }
    });
  });

  return shuffle(candidates);
}

function selectUniqueClues(puzzle, solution, cluePool, solver, minimumClues) {
  const selected = [];
  let remainingSolutions = solver(puzzle, selected);

  for (const clue of cluePool) {
    const nextSelected = [...selected, clue];
    const nextSolutions = solver(puzzle, nextSelected);

    if (nextSolutions.length < remainingSolutions.length) {
      selected.push(clue);
      remainingSolutions = nextSolutions;
    }

    if (selected.length >= minimumClues && remainingSolutions.length === 1) {
      return {
        clues: selected,
        checkedSolutions: remainingSolutions.length
      };
    }
  }

  return null;
}

function generateEasy() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const people = sample(data.people, 3);
    const items = sample(data.items, 3);
    const places = sample(data.places, 2);
    const itemByPerson = buildAssignment(people, items);
    const solution = { itemByPerson };
    const targetItem = sample(items, 1)[0];
    const answerPerson = people.find((person) => itemByPerson[person] === targetItem);
    const puzzle = { people, items };
    const cluePool = makeEasyClues(puzzle, solution, targetItem);
    const unique = selectUniqueClues(puzzle, solution, cluePool, solveEasy, 3);

    if (!unique) {
      continue;
    }

    return {
      title: sample(data.titles, 1)[0],
      type: "Gepruefter Fall",
      intro: `Holmes fand ${places[0]} drei Personen vor: ${people.join(", ")}. Jede Person hatte genau eines dieser Beweisstuecke: ${items.join(", ")}.`,
      clues: unique.clues.map((clue) => clue.text),
      question: `Wer hatte ${targetItem}?`,
      hint: unique.clues[0].hint,
      solution: `${answerPerson} hatte ${targetItem}. Der eingebaute Solver hat alle moeglichen Zuordnungen geprueft; nach diesen Hinweisen bleibt genau diese eine Loesung uebrig.`,
      signature: `${people.join("|")}-${items.join("|")}-${targetItem}-${answerPerson}`
    };
  }

  return fallbackCase();
}

function generateMedium() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const people = sample(data.people, 4);
    const items = sample(data.items, 4);
    const places = sample(data.places, 2);
    const itemByPerson = buildAssignment(people, items);
    const positionByPerson = buildAssignment(people, [1, 2, 3, 4]);
    const solution = { itemByPerson, positionByPerson };
    const targetItem = sample(items, 1)[0];
    const answerPerson = people.find((person) => itemByPerson[person] === targetItem);
    const puzzle = { people, items };
    const cluePool = makeMediumClues(puzzle, solution, targetItem);
    const unique = selectUniqueClues(puzzle, solution, cluePool, solveMedium, 5);

    if (!unique) {
      continue;
    }

    const orderedPeople = [...people].sort((left, right) => positionByPerson[left] - positionByPerson[right]);

    return {
      title: sample(data.titles, 1)[0],
      type: "Gepruefter Fall",
      intro: `In einem neuen Fall an zwei Orten, ${places[0]} und ${places[1]}, befragte Holmes vier Personen: ${people.join(", ")}. Jede Person hatte genau ein anderes Beweisstueck: ${items.join(", ")}. Ausserdem wurden sie in einer eindeutigen Reihenfolge befragt.`,
      clues: unique.clues.map((clue) => clue.text),
      question: `Wer hatte ${targetItem}?`,
      hint: unique.clues[0].hint,
      solution: `${answerPerson} hatte ${targetItem}. Die eindeutige Befragungsreihenfolge lautet: ${orderedPeople.join(", ")}. Der Solver hat alle Kombinationen aus Beweisstuecken und Reihenfolge geprueft; genau eine passt zu allen Hinweisen.`,
      signature: `${people.join("|")}-${items.join("|")}-${targetItem}-${answerPerson}-${orderedPeople.join("|")}`
    };
  }

  return fallbackCase();
}

function fallbackCase() {
  return {
    title: "Der Notfall in Baker Street",
    type: "Fallback",
    intro: "Holmes wartet auf neue Spuren. Bitte erzeuge den Fall noch einmal.",
    clues: ["Der Generator konnte gerade keinen eindeutigen Fall bauen."],
    question: "Was ist zu tun?",
    hint: "Klicke auf Neuer Fall.",
    solution: "Noch einmal generieren.",
    signature: "fallback"
  };
}

function generateCase() {
  let generated = state.difficulty === "leicht" ? generateEasy() : generateMedium();

  for (let attempt = 0; attempt < 5 && generated.signature === state.lastSignature; attempt += 1) {
    generated = state.difficulty === "leicht" ? generateEasy() : generateMedium();
  }

  state.lastSignature = generated.signature;
  return generated;
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
  state.lastSignature = "";
  selectors.segments.forEach((button) => {
    const active = button.dataset.difficulty === nextDifficulty;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderCase(generateCase());
}

selectors.segments.forEach((button) => {
  button.addEventListener("click", () => updateDifficulty(button.dataset.difficulty));
});

selectors.newPuzzle.addEventListener("click", () => renderCase(generateCase()));

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
