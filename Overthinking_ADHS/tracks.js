// Sektion "Zum Anhören" — vier Fließtext-Audio-Tracks
// MP3s liegen in /audio/, Dateinamen exakt wie unten (Kleinbuchstaben, Bindestriche)

const tracks = [
  {
    id: "gedanken-looping-nacht",
    title: "Gedanken-Looping (Nacht)",
    subtitle: "Wenn der Kopf abends nicht abschaltet — was gerade passiert und wie du rauskommst.",
    file: "audio/gedanken-looping-nacht.mp3",
    duration: "2:30"
  },
  {
    id: "rsd",
    title: "Ablehnungssensibilität (RSD)",
    subtitle: "Wenn ein neutraler Satz sich anfühlt wie Zurückweisung — was dein Radar da gerade macht.",
    file: "audio/rsd.mp3",
    duration: "2:51"
  },
  {
    id: "social-masking",
    title: "Social Masking",
    subtitle: "Warum du nach Menschen leer bist — und warum das keine Schwäche ist.",
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
