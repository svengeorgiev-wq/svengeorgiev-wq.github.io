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

// 21 Tages-Audios: ein geführtes Audio je Tag des 21-Tage-Plans (Eleven v4, Stimme Ramona, 13.10.2026)
// Titel kommen aus APP_DATA.days; Skripte und Erzeugung im Buchordner ADHS_bei Erwachsenen/Audios
window.DAY_AUDIOS = [
  { day: 1, file: "audio/tag-01.mp3", duration: "2:02" },
  { day: 2, file: "audio/tag-02.mp3", duration: "1:54" },
  { day: 3, file: "audio/tag-03.mp3", duration: "2:19" },
  { day: 4, file: "audio/tag-04.mp3", duration: "1:51" },
  { day: 5, file: "audio/tag-05.mp3", duration: "1:50" },
  { day: 6, file: "audio/tag-06.mp3", duration: "1:49" },
  { day: 7, file: "audio/tag-07.mp3", duration: "1:44" },
  { day: 8, file: "audio/tag-08.mp3", duration: "1:38" },
  { day: 9, file: "audio/tag-09.mp3", duration: "1:42" },
  { day: 10, file: "audio/tag-10.mp3", duration: "1:53" },
  { day: 11, file: "audio/tag-11.mp3", duration: "1:41" },
  { day: 12, file: "audio/tag-12.mp3", duration: "1:34" },
  { day: 13, file: "audio/tag-13.mp3", duration: "1:49" },
  { day: 14, file: "audio/tag-14.mp3", duration: "1:34" },
  { day: 15, file: "audio/tag-15.mp3", duration: "1:41" },
  { day: 16, file: "audio/tag-16.mp3", duration: "1:39" },
  { day: 17, file: "audio/tag-17.mp3", duration: "1:34" },
  { day: 18, file: "audio/tag-18.mp3", duration: "1:41" },
  { day: 19, file: "audio/tag-19.mp3", duration: "2:24" },
  { day: 20, file: "audio/tag-20.mp3", duration: "2:17" },
  { day: 21, file: "audio/tag-21.mp3", duration: "2:16" }
];

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
