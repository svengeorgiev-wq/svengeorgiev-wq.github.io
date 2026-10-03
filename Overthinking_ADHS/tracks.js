// Sektion "Zum Anhören" — vier Fließtext-Audio-Tracks
// MP3s liegen in /audio/, Dateinamen exakt wie unten (Kleinbuchstaben, Bindestriche)

const tracks = [
  {
    id: "gedanken-looping-nacht",
    title: "Gedanken-Looping (Nacht)",
    subtitle: "Wenn der Kopf abends nicht abschaltet: was gerade passiert und wie du rauskommst.",
    file: "audio/gedanken-looping-nacht.mp3",
    duration: "2:30"
  },
  {
    id: "rsd",
    title: "Ablehnungssensibilität (RSD)",
    subtitle: "Wenn ein neutraler Satz sich anfühlt wie Zurückweisung: was dein Radar da gerade macht.",
    file: "audio/rsd.mp3",
    duration: "2:51"
  },
  {
    id: "social-masking",
    title: "Social Masking",
    subtitle: "Warum du nach Menschen leer bist. Und warum das keine Schwäche ist.",
    file: "audio/social-masking.mp3",
    duration: "2:06"
  },
  {
    id: "selbstwert",
    title: "Das „Ich bin zu viel\"-Muster",
    subtitle: "Warum der Satz „ich bin zu viel\" kein Urteil ist, sondern ein Symptom.",
    file: "audio/selbstwert.mp3",
    duration: "2:27"
  }
];

window.AUDIO_TRACKS = tracks;

// Hörbuch-Karte am Anfang der Sektion "Zum Anhören"
// offerUntil: letzter Tag, an dem die Angebotszeile gezeigt wird (danach automatisch fallbackText)
// url: ACX-Bounty-Link, unverändert lassen (source_code und ref werden für die Zuordnung gebraucht)
window.AUDIOBOOK = {
  eyebrow: "Hörbuch",
  title: "Das ganze Buch zum Hören",
  text: "Keine Ruhe zum Lesen? Dann lass dir das Buch vorlesen. Alle 13 Kapitel, gut 4 Stunden, gesprochen von Melanie Wagner. Für die Bahn, die Hunderunde oder den Abwasch.",
  duration: "4 Std.",
  offerUntil: "2026-12-28",
  offerText: "Noch kein Audible? Aktuell 0,99 € im Monat für die ersten drei Monate, danach 6,99 € im Monat, monatlich kündbar. Angebot bis 28.12.2026.",
  fallbackText: "Im Audible-Abo enthalten oder einzeln kaufbar.",
  buttonLabel: "Hörprobe anhören",
  url: "https://www.audible.de/pd/B0H8FCJVVV/?source_code=EKAORWS0223189009-BK-ACX0-519906&ref=acx_bty_BK_ACX0_519906_rh_de"
};
