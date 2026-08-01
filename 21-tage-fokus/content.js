"use strict";

// Zentrale Inhaltsquelle der App. Buchtexte werden ausschließlich hier eingesetzt.
// Programmlogik, Timer, Speicherung und Navigation bleiben dadurch unangetastet.
window.FOKUS_CONTENT = Object.freeze({
  days: Array.from({ length: 21 }, (_, index) => {
    const day = index + 1;
    return {
      day,
      title: day === 1 ? "Dein Anker" : `Tag ${day}`,
      workbookHint: `Trag deine Gedanken auf der Seite für Tag ${day} im Workbook ein.`,
      routine: "Lege die heutige Workbook-Seite bereit. Starte den Fokus-Timer, sobald du mit der Tagesroutine beginnst.",
      minimal: "Nimm nur die 60-Sekunden-Variante aus deinem Workbook. Danach darf für heute Schluss sein.",
      timerSeconds: 300,
      audio: day,
      placeholder: true
    };
  }),

  audios: Array.from({ length: 24 }, (_, index) => {
    const number = index + 1;
    return {
      number,
      title: `Audio ${number}`,
      assignment: number <= 21 ? `Tag ${number}` : "Zusatz-Audio",
      src: ""
    };
  }),

  guideQuestions: [
    {
      title: "Was blockiert dich gerade am stärksten?",
      options: [
        { value: "start", label: "Ich komme nicht ins Tun" },
        { value: "full", label: "Mein Kopf ist zu voll" },
        { value: "low", label: "Meine Energie ist fast weg" }
      ]
    },
    {
      title: "Was wäre jetzt leichter?",
      options: [
        { value: "move", label: "Einen winzigen Schritt machen" },
        { value: "settle", label: "Erst kurz runterfahren" }
      ]
    },
    {
      title: "Wie viel ist gerade realistisch?",
      options: [
        { value: "60", label: "60 Sekunden" },
        { value: "120", label: "2 Minuten" }
      ]
    }
  ],

  guideResults: {
    "start-move": {
      title: "Der kleinstmögliche Einstieg",
      text: "Bereite nur den ersten sichtbaren Handgriff vor. Du musst die Aufgabe nicht beenden — nur anfangen."
    },
    "start-settle": {
      title: "Erst landen, dann anfangen",
      text: "Nimm die kurze Pause vollständig. Entscheide erst danach, ob heute noch ein Einstieg möglich ist."
    },
    "full-move": {
      title: "Eine Sache nach außen",
      text: "Öffne dein Workbook und halte nur die eine Sache fest, die gerade am lautesten ist. Nicht sortieren."
    },
    "full-settle": {
      title: "Reize kurz kleiner machen",
      text: "Lege das Handy weg, senke Geräusche und bleib für die gewählte Zeit bei genau einem ruhigen Punkt."
    },
    "low-move": {
      title: "Minimalversion zählt",
      text: "Wähle die kleinste machbare Handlung. Ein kurzer Kontakt mit der Routine ist für heute genug."
    },
    "low-settle": {
      title: "Heute darf klein sein",
      text: "Mach ausschließlich die Minimalversion. Es gibt nichts nachzuholen und keine verlorene Serie."
    }
  },

  guidePlaceholder: true
});
