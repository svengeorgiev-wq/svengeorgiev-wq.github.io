"use strict";

(() => {

// Das Buch erklärt die Hintergründe, das Workbook hält persönliche Ergebnisse fest.
// Die App ergänzt beides mit Audio, Timer, Erinnerung, Wiedereinstieg und lokalem Fortschritt.
const phases = [
  { id: "setup", title: "Setup", range: "Tag 0", description: "Startplatz und Minimalmaterial" },
  { id: "anfangen", title: "Anfangen", range: "Tage 1–4", description: "Morgenstart, Tagesziel, Nachweis und Zeitfenster" },
  { id: "zeit-reize", title: "Zeit und Reize", range: "Tage 5–8", description: "Termine, Übergänge, Sichtfeld und Handy" },
  { id: "kopfvolumen", title: "Kopfvolumen", range: "Tage 9–12", description: "Zone, Kopf entleeren, sortieren und entscheiden" },
  { id: "energie", title: "Energie", range: "Tage 13–16", description: "Kraft einschätzen, Pausen, Zyklus und Stopp-Punkt" },
  { id: "gefuehle-grenzen", title: "Gefühle und Grenzen", range: "Tage 17–21", description: "Ablehnung, Rückschlag, Nein sagen und Abschluss" }
];

const days = [
  {
    day: 0,
    phase: "setup",
    title: "Dein Setup",
    goal: "Du richtest deinen Startplatz ein und benennst deine drei größten Reibungspunkte.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Reibungspunkte-Seite",
    workbookCue: "Notiere je eine Zeile zu Zeit, Reizen und Aufgaben. Unterstreiche den Punkt, der dich am meisten nervt; alles Übrige darf auf den Parkplatz.",
    minimal: "Leg Buch, Stift und Timer an einen sichtbaren Platz. Mehr ist heute nicht nötig.",
    minimalSeconds: 60,
    audioTitle: "Programmnavigation",
    audioDuration: "1:52",
    audioSrc: "audio/tag-00.mp3"
  },
  {
    day: 1,
    phase: "anfangen",
    title: "Dein Morgen-Anker",
    goal: "Du legst einen festen ersten Schritt für den Morgen fest und sagst dazu deinen Startsatz.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Checkfeld für Tag 1",
    workbookCue: "Halte deinen Morgen-Anker und deinen Startsatz in zwei kurzen Zeilen fest.",
    minimal: "Sag laut: „Heute nur eins.“ Das ist für heute eine vollständige Übung.",
    minimalSeconds: 30,
    audioTitle: "Starthemmung",
    audioDuration: "2:00",
    audioSrc: "audio/tag-01.mp3"
  },
  {
    day: 2,
    phase: "anfangen",
    title: "Dein Ein-Satz-Tagesziel",
    goal: "Du legst für heute genau ein Vorhaben fest und schreibst es auf eine sichtbare Karte.",
    material: "Buch, Stift, Timer, Karteikarte oder Kassenzettel",
    workbookTitle: "Checkfeld für Tag 2",
    workbookCue: "Trage dein Tagesvorhaben und den kleinsten sichtbaren nächsten Handgriff ein.",
    minimal: "Sag laut in einem Satz, welches Vorhaben heute zählt. Schreiben ist nicht nötig.",
    minimalSeconds: 40,
    audioTitle: "Tagesfokus",
    audioDuration: "1:59",
    audioSrc: "audio/tag-02.mp3"
  },
  {
    day: 3,
    phase: "anfangen",
    title: "Abendlicher Nachweis",
    goal: "Du sammelst abends drei geschaffte Dinge und markierst eine Kleinigkeit als Erfolg.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Checkfeld für Tag 3",
    workbookCue: "Sammle drei Dinge vom Tag und kreise eines davon als sichtbaren Beleg ein.",
    minimal: "Nenne laut einen kleinen Beleg für heute. Einer genügt.",
    minimalSeconds: 30,
    audioTitle: "Abschlussreflexion",
    audioDuration: "1:50",
    audioSrc: "audio/tag-03.mp3"
  },
  {
    day: 4,
    phase: "anfangen",
    title: "Zeitfenster sichtbar machen",
    goal: "Du legst für einen festen Termin einen Zeitcontainer mit Pufferpunkt an.",
    material: "Buch, Stift, Timer, Kalender",
    workbookTitle: "Tages-Zeitkarte",
    workbookCue: "Zerlege einen Termin in Beginn, Wegzeit und Fertigwerden. Das Ergebnis ist dein Pufferpunkt.",
    minimal: "Stell einen Wecker fünfzehn Minuten vor deinem nächsten Termin.",
    minimalSeconds: 40,
    audioTitle: "Zeitgefühl",
    audioDuration: "1:46",
    audioSrc: "audio/tag-04.mp3"
  },
  {
    day: 5,
    phase: "zeit-reize",
    title: "Die Kalender-Notlandung",
    goal: "Du legst eine Rettungszeile für Termine an, die du sonst vergisst.",
    material: "Buch, Stift, Timer, Kalender",
    workbookTitle: "Mini-Protokoll für Terminfallen",
    workbookCue: "Notiere, wo deine Rettungszeile liegt, wann du sie aufräumst und welche Terminfalle zuletzt passiert ist.",
    minimal: "Öffne eine Notiz im Handy und nenne sie „Termine“.",
    minimalSeconds: 30,
    audioTitle: "Termine retten",
    audioDuration: "1:42",
    audioSrc: "audio/tag-05.mp3"
  },
  {
    day: 6,
    phase: "zeit-reize",
    title: "Übergänge entschärfen",
    goal: "Du baust ein kurzes Übergangsritual mit einem Zwei-Minuten-Abschluss.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Puffer-Protokoll",
    workbookCue: "Beobachte einen Wechsel des Tages und notiere mit einem Wort, was dich zurückgezogen hat.",
    minimal: "Sag vor dem nächsten Wechsel laut, was jetzt kommt. Nur die Ansage.",
    minimalSeconds: 20,
    audioTitle: "Übergänge",
    audioDuration: "1:55",
    audioSrc: "audio/tag-06.mp3"
  },
  {
    day: 7,
    phase: "zeit-reize",
    title: "Sichtfeld entlasten",
    goal: "Du machst dir eine Arbeitsfläche frei und benennst deine drei stärksten Reize.",
    material: "Buch, Stift, Timer, leere Kiste oder Wäschekorb",
    workbookTitle: "Reizampel",
    workbookCue: "Halte je einen starken Reiz für Augen, Ohren und Handy fest. Leere Felder sind erlaubt.",
    minimal: "Räum mit einer Armbewegung alles vor dir zur Seite.",
    minimalSeconds: 30,
    audioTitle: "Umgebungsgestaltung",
    audioDuration: "1:53",
    audioSrc: "audio/tag-07.mp3"
  },
  {
    day: 8,
    phase: "zeit-reize",
    title: "Handy- und App-Reize begrenzen",
    goal: "Du schaltest die Benachrichtigungen von drei Apps aus und legst einen festen Platz für dein Handy fest.",
    material: "Buch, Stift, Timer, Handy",
    workbookTitle: "Feld für Tag 8",
    workbookCue: "Notiere die stummgeschalteten Apps, den neuen Handyplatz und deine Nachsehzeit. Eine App zählt ebenfalls.",
    minimal: "Leg dein Handy für die nächste halbe Stunde in einen anderen Raum.",
    minimalSeconds: 20,
    audioTitle: "Digitale Überladung",
    audioDuration: "1:50",
    audioSrc: "audio/tag-08.mp3"
  },
  {
    day: 9,
    phase: "kopfvolumen",
    title: "Deine Zone beruhigen",
    goal: "Du richtest eine kleine Fokus-Zone ein und legst einen Platz für offene Schleifen fest.",
    material: "Buch, Stift, Timer, Kiste oder flache Schale",
    workbookTitle: "Vorher-nachher-Feld",
    workbookCue: "Benenne deine Zone und halte kurz fest, was vorher und nachher dort liegt.",
    minimal: "Stell ein Tablett vor dich. Darauf liegt nur deine aktuelle Sache.",
    minimalSeconds: 40,
    audioTitle: "Fokus-Zone",
    audioDuration: "1:44",
    audioSrc: "audio/tag-09.mp3"
  },
  {
    day: 10,
    phase: "kopfvolumen",
    title: "Brain-Dump ohne Sortierdruck",
    goal: "Du schreibst deine offenen Aufgaben ungeordnet auf eine einzige Seite.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Kopf-entleeren-Seite",
    workbookCue: "Schreib ungeordnet, was kommt. Markiere am Ende nur die Sache, die gerade am lautesten ist.",
    minimal: "Schreib drei Aufgaben auf einen Zettel und leg ihn auf den Startplatz.",
    minimalSeconds: 60,
    audioTitle: "Mentale Last",
    audioDuration: "1:56",
    audioSrc: "audio/tag-10.mp3"
  },
  {
    day: 11,
    phase: "kopfvolumen",
    title: "Die Drei-Spuren-Liste",
    goal: "Du sortierst deine Aufgaben in genau drei Spuren und legst eine Parkliste an.",
    material: "Buch, Stift, Timer, Kopf-entleeren-Seite von Tag 10",
    workbookTitle: "Sortierfelder",
    workbookCue: "Verteile die Zeilen auf Heute, Später, Warten und die Parkliste. Für Heute bleiben höchstens drei.",
    minimal: "Markiere auf deiner Liste von Tag 10 genau eine Zeile mit einem H.",
    minimalSeconds: 20,
    audioTitle: "Priorisieren mit drei Spuren",
    audioDuration: "1:32",
    audioSrc: "audio/tag-11.mp3"
  },
  {
    day: 12,
    phase: "kopfvolumen",
    title: "Deine Entscheidungsregel",
    goal: "Du bestimmst eine feste Regel, mit der du den nächsten Schritt festlegst.",
    material: "Buch, Stift, Timer, Drei-Spuren-Liste",
    workbookTitle: "Feld für Tag 12",
    workbookCue: "Notiere die gewählte Zeile, die kleinste nächste Handlung und deinen Entscheidungssatz.",
    minimal: "Nenne laut eine Zeile und den ersten Handgriff dazu. Zwei Sätze genügen.",
    minimalSeconds: 30,
    audioTitle: "Nächster Schritt",
    audioDuration: "1:37",
    audioSrc: "audio/tag-12.mp3"
  },
  {
    day: 13,
    phase: "energie",
    title: "Dein Energieprofil erkennen",
    goal: "Du bestimmst dein aktuelles Energielevel und gibst deinem Tag die passende Stufe.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Energie-Tracking",
    workbookCue: "Halte deine Stufe, eine passende Sache und den größten Kraftfresser mit einem Wort fest.",
    minimal: "Sag laut eine Farbe: grün, gelb oder rot.",
    minimalSeconds: 20,
    audioTitle: "Erschöpfung und Selbststeuerung",
    audioDuration: "1:43",
    audioSrc: "audio/tag-13.mp3"
  },
  {
    day: 14,
    phase: "energie",
    title: "Pausen als Teil des Systems",
    goal: "Du wählst ein festes Pausenfenster und trägst es sichtbar ein.",
    material: "Buch, Stift, Timer, Kalender",
    workbookTitle: "Pausenfeld",
    workbookCue: "Notiere Uhrzeit und Pausenvariante. Körpersignale werden angekreuzt, nicht bewertet.",
    minimal: "Setz dich für sechzig Sekunden hin und schließe die Augen.",
    minimalSeconds: 60,
    audioTitle: "Pause ohne Reize",
    audioDuration: "1:42",
    audioSrc: "audio/tag-14.mp3"
  },
  {
    day: 15,
    phase: "energie",
    title: "Dein Belastungsradar",
    goal: "Du trägst deine Zyklusphase in die Energieampel ein und planst Mindestversionen für erwartbare Tieftage vor.",
    material: "Buch, Stift, Timer, Kalender",
    workbookTitle: "Energie-Tracking ab Tag 15",
    workbookCue: "Ergänze ab heute zur Energiestufe deine Zyklusphase und bereite Mindestversionen für schwere Tage vor.",
    minimal: "Kreise im Kalender die drei Tage ein, die du als schwer erwartest.",
    minimalSeconds: 40,
    audioTitle: "Hormonelle Tieftage",
    audioDuration: "1:48",
    audioSrc: "audio/tag-15.mp3"
  },
  {
    day: 16,
    phase: "energie",
    title: "Dein Stopp-Punkt bei Überflutung",
    goal: "Du legst einen 90-Sekunden-Stopp fest und probierst ihn einmal aus.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Emotionsskala",
    workbookCue: "Vergleiche die Stärke vor und nach der Pause und notiere Auslöser, Körperzeichen und Entlastungssatz.",
    minimal: "Leg die Hände weg und atme sechsmal lang aus.",
    minimalSeconds: 90,
    audioTitle: "Reaktionspause",
    audioDuration: "1:43",
    audioSrc: "audio/tag-16.mp3"
  },
  {
    day: 17,
    phase: "gefuehle-grenzen",
    title: "Ablehnungsgedanken prüfen",
    goal: "Du prüfst einen Ablehnungsgedanken mit vier Fragen und notierst eine zweite Deutung.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Gedanken-Check",
    workbookCue: "Trenne Beobachtung, Deutung, eine zweite Erklärung und den nächsten Schritt in vier kurze Zeilen.",
    minimal: "Sag nur laut, was wörtlich gesagt oder geschrieben wurde – ohne Bewertung.",
    minimalSeconds: 30,
    audioTitle: "Ablehnungsangst",
    audioDuration: "1:56",
    audioSrc: "audio/tag-17.mp3"
  },
  {
    day: 18,
    phase: "gefuehle-grenzen",
    title: "Rückschlag ohne Neustartdrama",
    goal: "Du verarbeitest einen Rückschlag mit einem Protokoll und einem Reparaturschritt.",
    material: "Buch, Stift, Timer",
    workbookTitle: "Mini-Protokoll",
    workbookCue: "Halte einen Vorfall, das vorausgehende Körperzeichen und genau einen Reparaturschritt fest.",
    minimal: "Sag laut: „Ich mache morgen weiter, nicht neu.“",
    minimalSeconds: 20,
    audioTitle: "Selbstkritik",
    audioDuration: "1:54",
    audioSrc: "audio/tag-18.mp3"
  },
  {
    day: 19,
    phase: "gefuehle-grenzen",
    title: "Grenzen und Delegation",
    goal: "Du schreibst drei Nein-Sätze auf und legst fest, was du abgibst.",
    material: "Buch, Stift, Timer, Karteikarte",
    workbookTitle: "Nein- und Delegationsfelder",
    workbookCue: "Formuliere deine Nein-Sätze und halte fest, welchen Bereich künftig wer übernimmt.",
    minimal: "Sag laut: „Diese Woche nicht.“",
    minimalSeconds: 30,
    audioTitle: "Grenzen setzen",
    audioDuration: "1:39",
    audioSrc: "audio/tag-19.mp3"
  },
  {
    day: 20,
    phase: "gefuehle-grenzen",
    title: "Dein Wochenanker",
    goal: "Du bestimmst einen festen Wochentermin für dein System und trägst ihn ein.",
    material: "Buch, Stift, Timer, Kalender",
    workbookTitle: "Wochenanker-Feld",
    workbookCue: "Halte Uhrzeit und Wenn-dann-Satz fest und wähle eine Sache für diese Woche.",
    minimal: "Stell einen wiederkehrenden Wecker mit dem Text „Wochenanker“.",
    minimalSeconds: 20,
    audioTitle: "Verstetigung",
    audioDuration: "1:36",
    audioSrc: "audio/tag-20.mp3"
  },
  {
    day: 21,
    phase: "gefuehle-grenzen",
    title: "Dein System abschließen",
    goal: "Du machst einen System-Check, vergleichst deinen Startzustand und setzt deinen Abschlussmarker.",
    material: "Buch, Stift, Timer, Seite „Mein Startzustand“ von Tag 0",
    workbookTitle: "Abschlussbilanz",
    workbookCue: "Vergleiche die vier Zahlen von Tag 0 mit heute und schreib einen Satz darüber, was sich im Alltag bewegt hat.",
    minimal: "Kreise Tag 21 ein und nenne laut eine Routine, die dir inzwischen leichtfällt.",
    minimalSeconds: 40,
    audioTitle: "Abschluss",
    audioDuration: "1:39",
    audioSrc: "audio/tag-21.mp3"
  }
];

const guidePaths = [
  {
    id: "mehrere-tage",
    label: "Mehrere Tage sind ausgefallen",
    title: "Lücke schließen, nicht neu beginnen",
    action: "Setz in die leeren Kästchen Striche. Nimm heute nur die Minimalversion, die zuletzt funktioniert hat.",
    next: "Morgen steigst du bei deiner aktuellen Etappe wieder ein. Nichts wird nachgeholt.",
    seconds: 60
  },
  {
    id: "woche-zwei",
    label: "Woche zwei fühlt sich nur noch nach Pflicht an",
    title: "Ändere genau eine Sache",
    action: "Wechsle bei der langweiligsten Routine entweder Ort, Kanal, Werkzeug oder Musik – nur einen Punkt.",
    next: "Häng eine kleine, direkte Belohnung dahinter.",
    seconds: 120
  },
  {
    id: "hyperfokus",
    label: "Ich hänge im falschen Hyperfokus fest",
    title: "Ein Reiz von außen beendet den Tunnel",
    action: "Stell einen Timer außer Reichweite. Wenn er klingelt: aufstehen, Wasser holen, Fenster öffnen.",
    next: "Was du im Hyperfokus geschafft hast, darf trotzdem auf deine Beweis-Liste.",
    seconds: 120
  },
  {
    id: "zyklustief",
    label: "Zyklustief oder PMS-Woche",
    title: "Heute keine Systementscheidung",
    action: "Setz nur ein Zeichen und nutze eine vorbereitete Mindestversion.",
    next: "Ob das ganze System sinnvoll ist, entscheidest du erst wieder in einer stabileren Phase.",
    seconds: 60
  },
  {
    id: "scham",
    label: "Ich schäme mich nach dem Abbruch",
    title: "Kontakt statt Leistung",
    action: "Nimm das Buch in die Hand und leg es auf den Startplatz. Du musst es heute nicht aufschlagen.",
    next: "Sag: „Ich fange nicht neu an. Ich mache irgendwann weiter.“",
    seconds: 30
  },
  {
    id: "blockade",
    label: "Selbst das Anfassen des Buches ist unmöglich",
    title: "Erst klären, dann verkleinern",
    action: "Außergewöhnliche Belastung? Plane eine bewusste Pause mit Datum. Seit Wochen leer, ängstlich oder niedergeschlagen? Hol dir fachliche Unterstützung.",
    next: "Geht es dir grundsätzlich gut, wähle nur eine einzige Routine – ohne Kästchen und ohne Workbook.",
    seconds: 60
  }
];

window.FOKUS_CONTENT = Object.freeze({
  phases,
  days,
  audios: days.map((day) => ({
    number: day.day,
    phase: day.phase,
    title: day.title,
    topic: day.audioTitle,
    assignment: day.day === 0 ? "Tag 0 · Setup" : `Tag ${day.day}`,
    duration: day.audioDuration,
    src: day.audioSrc
  })),
  guidePaths
});
})();
