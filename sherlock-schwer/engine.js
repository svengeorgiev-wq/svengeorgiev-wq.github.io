(function (global) {
  "use strict";

  const PUZZLE = Object.freeze({
    id: "NACHTZUG-01",
    chapterTheme: "Ein eingeschneiter Londoner Nachtbahnhof",
    title: "Das Telegramm im Nachtzug",
    primaryMechanism: "Reihenfolgen und Platzierungen",
    previousPrimaryMechanism: "Matching und Zuordnung",
    endAnswerType: "Gegenstand / Objekt",
    previousEndAnswerType: "Vollständige Zuordnung",
    intro: "Der Winter hatte London in eine starre, graue Stille gelegt, als uns ein Bote zum letzten Nachtzug nach Dover rief. Eine versiegelte Depeschenkassette war zwischen Baker Street und Waterloo Station verschwunden. Vier Boten hatten den Bahnsteig nacheinander betreten, vier Telegramme lagen beim Stationsvorsteher, und auf dem Gepäckwagen warteten vier Schlüssel. Holmes betrachtete weder den Schnee noch die hastig versammelten Zeugen. Ihn interessierte allein die Reihenfolge. Jede spätere Spur, erklärte er, sei nur dann brauchbar, wenn die vorherige zweifelsfrei feststehe. So begann eine Ermittlung in vier Schritten, bei der kein Schluss übersprungen werden durfte.",
    introduction: "Unter der Gaslaterne am Bahnsteig notierte Watson jede Aussage in der Reihenfolge ihres Eingangs. Die verschwundene Kassette kann nur gefunden werden, wenn Ankunftsfolge, Telegramm, Schlüssel und Kassettenplatz nacheinander eindeutig bestimmt werden.",
    levels: [
      {
        number: 1,
        title: "Die Ankunftsfolge",
        paragraphs: [
          "Adler, Bell, Clarke und Doyle trafen nacheinander am Bahnsteig ein. Jede Person belegte genau einen der vier Ankunftsplätze.",
          "Clarke traf unmittelbar nach Bell ein. Adler traf vor Bell ein. Doyle traf nach Clarke ein."
        ],
        question: "● IN WELCHER REIHENFOLGE TRAFEN ADLER, BELL, CLARKE UND DOYLE EIN? ●",
        choices: [
          { value: "ABCD", label: "Adler – Bell – Clarke – Doyle" },
          { value: "ADBC", label: "Adler – Doyle – Bell – Clarke" },
          { value: "BCAD", label: "Bell – Clarke – Adler – Doyle" },
          { value: "DABC", label: "Doyle – Adler – Bell – Clarke" }
        ],
        correct: "ABCD",
        answer: "Adler – Bell – Clarke – Doyle"
      },
      {
        number: 2,
        title: "Das authentische Telegramm",
        paragraphs: [
          "Der Stationsvorsteher nummerierte vier Telegramme mit I bis IV. Authentisch ist genau das Telegramm, dessen beide Aussagen mit der in Ebene 1 ermittelten Ankunftsfolge übereinstimmen. Sobald eine Aussage falsch ist, scheidet das Telegramm aus."
        ],
        evidence: [
          "Telegramm I – Bell kam unmittelbar vor Clarke. Adler kam zuletzt.",
          "Telegramm II – Doyle kam zuletzt. Adler kam zuerst.",
          "Telegramm III – Clarke kam als Zweiter. Bell kam vor Adler.",
          "Telegramm IV – Bell kam zuerst. Doyle kam nach Adler."
        ],
        question: "● WELCHES TELEGRAMM IST AUTHENTISCH? ●",
        choices: [
          { value: "I", label: "Telegramm I" },
          { value: "II", label: "Telegramm II" },
          { value: "III", label: "Telegramm III" },
          { value: "IV", label: "Telegramm IV" }
        ],
        correct: "II",
        answer: "Telegramm II"
      },
      {
        number: 3,
        title: "Die vier Schlüssel",
        paragraphs: [
          "Auf dem Gepäckwagen lagen von links nach rechts vier Schlüssel. Es waren Messing, Silber, Eisen und Bein. Jeder Schlüssel belegte genau eine Position.",
          "Der Eisenschlüssel lag unmittelbar rechts vom Silberschlüssel. Der Messingschlüssel lag links vom Silberschlüssel. Der Beinschlüssel lag rechts vom Eisenschlüssel.",
          "Gesucht ist der Schlüssel an der Position, deren Nummer dem authentischen Telegramm aus Ebene 2 entspricht."
        ],
        question: "● WELCHER SCHLÜSSEL LIEGT AN DER GESUCHTEN POSITION? ●",
        choices: [
          { value: "messing", label: "Messingschlüssel" },
          { value: "silber", label: "Silberschlüssel" },
          { value: "eisen", label: "Eisenschlüssel" },
          { value: "bein", label: "Beinschlüssel" }
        ],
        correct: "silber",
        answer: "Der Silberschlüssel"
      },
      {
        number: 4,
        title: "Die Depeschenkassetten",
        paragraphs: [
          "Von links nach rechts standen vier Depeschenkassetten. Sie waren rot, schwarz, grün und blau. Die schwarze Kassette stand unmittelbar links von der grünen. Die blaue Kassette stand rechts von der grünen. Die schwarze Kassette stand nicht an erster Stelle.",
          "Jeder Schlüssel trug eine andere Anweisung. Der Messingschlüssel verlangte die erste Kassette. Der Silberschlüssel verlangte die Kassette unmittelbar rechts von der schwarzen. Der Eisenschlüssel verlangte die letzte Kassette. Der Beinschlüssel verlangte die schwarze Kassette.",
          "Nur die Anweisung des in Ebene 3 bestimmten Schlüssels darf ausgeführt werden."
        ],
        question: "● WELCHE DEPESCHENKASSETTE MUSS HOLMES ÖFFNEN? ●",
        choices: [
          { value: "rot", label: "Die rote Depeschenkassette" },
          { value: "schwarz", label: "Die schwarze Depeschenkassette" },
          { value: "gruen", label: "Die grüne Depeschenkassette" },
          { value: "blau", label: "Die blaue Depeschenkassette" }
        ],
        correct: "gruen",
        answer: "Die grüne Depeschenkassette"
      }
    ],
    solutionSteps: [
      {
        title: "Antwort Ebene 1",
        answer: "Adler – Bell – Clarke – Doyle",
        explanation: "Bell und Clarke bilden durch „unmittelbar nach“ einen festen Block. Adler muss vor diesem Block stehen. Doyle muss nach Clarke stehen. Damit bleibt nur Adler an Position 1, Bell an Position 2, Clarke an Position 3 und Doyle an Position 4. Jede andere Reihenfolge verletzt mindestens eine Bedingung."
      },
      {
        title: "Antwort Ebene 2",
        answer: "Telegramm II",
        explanation: "Mit der Reihenfolge aus Ebene 1 lassen sich die Telegramme prüfen. In Telegramm I ist die zweite Aussage falsch, weil Adler nicht zuletzt kam. Telegramm II nennt Doyle korrekt als Letzten und Adler korrekt als Ersten. Telegramm III und Telegramm IV widersprechen der ermittelten Folge. Nur Telegramm II enthält zwei wahre Aussagen. Ohne Ebene 1 wäre diese Prüfung nicht möglich."
      },
      {
        title: "Antwort Ebene 3",
        answer: "Der Silberschlüssel",
        explanation: "Silber und Eisen bilden einen festen Zweierblock, wobei Eisen rechts von Silber liegt. Messing muss links von Silber liegen, Bein rechts von Eisen. Daher ist nur Messing – Silber – Eisen – Bein möglich. Telegramm II aus Ebene 2 verweist auf Position 2. Dort liegt der Silberschlüssel. Ohne die Nummer des authentischen Telegramms wäre die gesuchte Position nicht bestimmt."
      },
      {
        title: "Antwort Ebene 4 / Endantwort",
        answer: "Die grüne Depeschenkassette",
        explanation: "Schwarz und Grün bilden einen festen Block. Der Block kann nicht an den Positionen 1 und 2 stehen, weil Schwarz nicht an erster Stelle stehen darf. Er kann auch nicht an den Positionen 3 und 4 stehen, weil Blau rechts von Grün stehen muss. Somit stehen Schwarz und Grün auf 2 und 3, Blau auf 4 und Rot auf 1. Der Silberschlüssel aus Ebene 3 verlangt die Kassette unmittelbar rechts von Schwarz, also die grüne Depeschenkassette."
      }
    ],
    bridge: "Holmes schloss die grüne Kassette und legte den Silberschlüssel daneben. Die nächste Spur würde wieder dort beginnen, wo eine überprüfte Reihenfolge keinen Zufall mehr zuließ.",
    outro: "In der Kassette lag die verschwundene Depesche, trocken und unversehrt. Der Schnee auf dem Bahnsteig hatte keine geheime Botschaft getragen; die Gaslaterne hatte nichts verborgen. Entscheidend waren allein vier sauber verbundene Schlüsse gewesen. Holmes erinnerte mich auf der Rückfahrt daran, dass eine schwierige Ermittlung nicht aus möglichst vielen Hinweisen bestehe, sondern aus wenigen Angaben, deren Reihenfolge man respektiere. Wer zu früh zum letzten Schritt springe, ersetze Deduktion durch Vermutung. In der Baker Street legte ich meine Notizen deshalb Ebene für Ebene ab. Der Fall war beendet, doch seine Methode führte geradlinig zur nächsten Akte.",
    checkNote: "Interne Prüfung bestanden: eindeutig lösbar, vollständig und konsistent."
  });

  function permutations(list) {
    if (list.length <= 1) return [list];
    return list.flatMap((entry, index) => {
      const rest = [...list.slice(0, index), ...list.slice(index + 1)];
      return permutations(rest).map((tail) => [entry, ...tail]);
    });
  }

  function validate() {
    const peopleSolutions = permutations(["A", "B", "C", "D"]).filter((order) => {
      const pos = Object.fromEntries(order.map((value, index) => [value, index]));
      return pos.C === pos.B + 1 && pos.A < pos.B && pos.D > pos.C;
    });
    const actual = peopleSolutions[0] || [];
    const pos = Object.fromEntries(actual.map((value, index) => [value, index]));
    const telegrams = [
      [pos.B + 1 === pos.C, pos.A === 3],
      [pos.D === 3, pos.A === 0],
      [pos.C === 1, pos.B < pos.A],
      [pos.B === 0, pos.D > pos.A]
    ];
    const authentic = telegrams.map((claims, index) => claims.every(Boolean) ? index + 1 : null).filter(Boolean);
    const keySolutions = permutations(["messing", "silber", "eisen", "bein"]).filter((order) => {
      const keyPos = Object.fromEntries(order.map((value, index) => [value, index]));
      return keyPos.eisen === keyPos.silber + 1 && keyPos.messing < keyPos.silber && keyPos.bein > keyPos.eisen;
    });
    const caseSolutions = permutations(["rot", "schwarz", "gruen", "blau"]).filter((order) => {
      const casePos = Object.fromEntries(order.map((value, index) => [value, index]));
      return casePos.schwarz + 1 === casePos.gruen && casePos.blau > casePos.gruen && casePos.schwarz !== 0;
    });
    const report = {
      level1Solutions: peopleSolutions.length,
      level2Solutions: authentic.length,
      level3Solutions: keySolutions.length,
      level4Solutions: caseSolutions.length,
      level1Answer: peopleSolutions[0]?.join("") || null,
      level2Answer: authentic[0] === 2 ? "II" : null,
      level3Answer: keySolutions[0]?.[authentic[0] - 1] || null,
      level4Answer: null,
      dependencies: {
        level2UsesLevel1: authentic.length === 1,
        level3UsesLevel2: authentic[0] === 2,
        level4UsesLevel3: keySolutions[0]?.[authentic[0] - 1] === "silber"
      }
    };
    if (caseSolutions.length === 1 && report.dependencies.level4UsesLevel3) {
      const caseOrder = caseSolutions[0];
      const blackIndex = caseOrder.indexOf("schwarz");
      report.level4Answer = caseOrder[blackIndex + 1];
    }
    report.passed =
      report.level1Solutions === 1 && report.level1Answer === "ABCD" &&
      report.level2Solutions === 1 && report.level2Answer === "II" &&
      report.level3Solutions === 1 && report.level3Answer === "silber" &&
      report.level4Solutions === 1 && report.level4Answer === "gruen" &&
      Object.values(report.dependencies).every(Boolean) &&
      PUZZLE.primaryMechanism !== PUZZLE.previousPrimaryMechanism &&
      PUZZLE.endAnswerType !== PUZZLE.previousEndAnswerType;
    return report;
  }

  function isCorrect(levelNumber, value) {
    const level = PUZZLE.levels.find((entry) => entry.number === levelNumber);
    return Boolean(level && level.correct === value);
  }

  const verification = validate();
  if (!verification.passed) throw new Error("Der Vier-Ebenen-Fall hat die interne Prüfung nicht bestanden.");

  global.SherlockEngine = Object.freeze({ puzzle: PUZZLE, validate, verification, isCorrect, permutations });
})(typeof window !== "undefined" ? window : globalThis);
