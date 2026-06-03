const STORAGE_KEY = "kopf-leiser-workbook-v1";

const days = [
  { day: 1, week: 1, weekTitle: "Der Körper - Den Sicherheitsgurt lockern", title: "Status-Check: Wo stehst du gerade?", impulse: "Bevor sich etwas verändern kann, musst du sehen, wie es jetzt ist. Overthinking muss vom diffusen Problem zum greifbaren Muster werden.", exercise: "Nimm dir 10 Minuten. Notiere stichpunktartig deinen gestrigen Tag. Markiere mit einem Stern alle Momente, in denen du im Kopf hängen geblieben bist. Schreib daneben das Thema in 1-2 Worten. Zähle die Sterne - ohne Bewertung.", reflection: "Was überrascht dich, wenn du die Häufigkeit schwarz auf weiß siehst?" },
  { day: 2, week: 1, weekTitle: "Der Körper - Den Sicherheitsgurt lockern", title: "Der physiologische Seufzer", impulse: "Wir müssen dem Körper mechanisch signalisieren: Alles ist sicher. Der schnellste Weg ist das lange Ausatmen.", exercise: "Mache heute 3-mal über den Tag verteilt den physiologischen Seufzer: 2x kurz durch die Nase ein, 1x lang durch den Mund aus. Stell dir einen Timer, zum Beispiel 10:00, 14:00 und 18:00 Uhr.", reflection: "Wie hat sich dein Körper unmittelbar nach dem dritten Atemzug angefühlt?" },
  { day: 3, week: 1, weekTitle: "Der Körper - Den Sicherheitsgurt lockern", title: "Kaltstart für den Vagus-Nerv", impulse: "Wenn Gedanken rasen, hilft keine Logik, sondern nur ein System-Neustart.", exercise: "Beende deine Morgendusche mit 30 Sekunden eiskaltem Wasser im Gesicht. Oder wasche dir das Gesicht am Waschbecken eiskalt.", reflection: "Was war lauter: der Kälte-Reiz oder deine Sorgen?" },
  { day: 4, week: 1, weekTitle: "Der Körper - Den Sicherheitsgurt lockern", title: "Der Panorama-Blick", impulse: "Stress erzeugt Tunnelblick. Weitblick erzeugt Sicherheit.", exercise: "Wenn du dich festbeisst: Hebe den Kopf. Schau geradeaus, aber nimm bewusst wahr, was ganz links und ganz rechts im Augenwinkel passiert. Halte diesen weichen Blick für 60 Sekunden.", reflection: "Wie verändert sich deine Atmung automatisch, wenn deine Augenmuskeln entspannen?" },
  { day: 5, week: 1, weekTitle: "Der Körper - Den Sicherheitsgurt lockern", title: "Die Nur-Eine-Sache-Regel", impulse: "Multitasking ist Gift für Overthinker. Heute üben wir Singletasking.", exercise: "Suche dir eine Tätigkeit aus: Essen, Zähneputzen oder Gehen. Mache heute nur das. Kein Handy, kein Podcast. Nur die eine Sache.", reflection: "War es langweilig oder erholsam? Wie oft zuckte die Hand zum Handy?" },
  { day: 6, week: 1, weekTitle: "Der Körper - Den Sicherheitsgurt lockern", title: "Der Körper-Scan", impulse: "Overthinking zieht alle Energie in den Kopf. Wir holen sie in den Körper zurück.", exercise: "Setze dich für 5 Minuten ruhig hin. Spüre nur deine Füße auf dem Boden. Dann die Waden, den Po, den Rücken. Bewerte nicht, spüre nur.", reflection: "Welches Körperteil war angespannt, ohne dass du es vorher bemerkt hast?" },
  { day: 7, week: 1, weekTitle: "Der Körper - Den Sicherheitsgurt lockern", title: "Pause und Freundlichkeit", impulse: "Wenn wir eine Übung vergessen, schimpfen wir oft. Heute üben wir radikale Freundlichkeit.", exercise: "Tu heute nichts zur Optimierung. Keine Disziplin. Gönne dir bewusst 15 Minuten nutzlose Zeit: Tee trinken, Löcher in die Luft starren, einfach da sein.", reflection: "Wie schwer fällt es dir, unproduktiv zu sein? Was sagt dein innerer Antreiber?" },
  { day: 8, week: 2, weekTitle: "Die Gedanken - Den Beobachter trainieren", title: "Dem Kind einen Namen geben", impulse: "Du bist nicht deine Angst. Du hast nur einen Gedanken, der Angst macht.", exercise: "Wenn Stress kommt, sag innerlich: Ich bemerke gerade, dass ich den Gedanken habe, dass... So schaffst du Distanz.", reflection: "Fühlt sich der Gedanke durch diesen Satz weiter weg an?" },
  { day: 9, week: 2, weekTitle: "Die Gedanken - Den Beobachter trainieren", title: "Hallo Günther", impulse: "Wir nehmen dem Kritiker die Macht, indem wir ihn albern machen.", exercise: "Gib deinem inneren Kritiker einen lustigen Namen. Wenn er meckert, sag: Danke für deine Meinung.", reflection: "Musstest du innerlich grinsen?" },
  { day: 10, week: 2, weekTitle: "Die Gedanken - Den Beobachter trainieren", title: "Der Faktencheck", impulse: "Wir trennen Wahrheit von Drama.", exercise: "Nimm eine Sorge. Frage radikal: Ist das ein Fakt, der jetzt passiert, oder eine Hypothese, also Zukunftskino? Wenn Hypothese, sag laut: Phantom-Schleife.", reflection: "Wie viel Prozent deiner Sorgen waren echte Fakten?" },
  { day: 11, week: 2, weekTitle: "Die Gedanken - Den Beobachter trainieren", title: "Die Stopp-Taste", impulse: "Manchmal brauchen wir eine physische Musterunterbrechung.", exercise: "Wenn du dich hineinsteigerst: Sag laut STOPP oder klatsch in die Hände und wechsle sofort den Raum.", reflection: "Hat der Ortswechsel den Gedankenstrang abgerissen?" },
  { day: 12, week: 2, weekTitle: "Die Gedanken - Den Beobachter trainieren", title: "Ist das meins?", impulse: "Empathische Menschen tragen oft den Ballast anderer.", exercise: "Frage dich bei jeder Sorge: Ist das mein Problem? Kann ich es lösen? Wenn nein: Gib das Paket mental zurück.", reflection: "Wie viel Ballast hast du heute getragen, der anderen gehört?" },
  { day: 13, week: 2, weekTitle: "Die Gedanken - Den Beobachter trainieren", title: "Das Vielleicht akzeptieren", impulse: "Innerer Frieden entsteht, wenn wir das Ich weiß es noch nicht akzeptieren.", exercise: "Wenn du keine Antwort auf eine Zukunftsfrage hast, sage: Vielleicht passiert X, vielleicht Y. Ich werde damit umgehen, wenn es soweit ist.", reflection: "Wie fühlt es sich an, die Kontrolle für einen Moment abzugeben?" },
  { day: 14, week: 2, weekTitle: "Die Gedanken - Den Beobachter trainieren", title: "Wochen-Rückblick", impulse: "Das Gehirn sucht Fehler. Heute zwingen wir es, den Fortschritt zu suchen.", exercise: "Was war dein größter Aha-Moment der Woche?", reflection: "In welcher Situation bist du schneller aus dem Grübeln gekommen als früher?" },
  { day: 15, week: 3, weekTitle: "Das System - Der Architekt", title: "Digital Detox Light", impulse: "Jedes Bling ist ein Stress-Kick.", exercise: "Schalte alle Push-Benachrichtigungen aus, außer Anrufe und SMS. Kein Messenger-Bling, keine News.", reflection: "Wie oft wolltest du aufs Handy schauen, nur aus Gewohnheit?" },
  { day: 16, week: 3, weekTitle: "Das System - Der Architekt", title: "Die Türsteher-Prüfung", impulse: "Wir sortieren aus, was dich stresst.", exercise: "Entfolge heute 3 Accounts oder deabonniere einen Newsletter, der dir kein gutes Gefühl gibt.", reflection: "Wie fühlt es sich an, diesen Input los zu sein?" },
  { day: 17, week: 3, weekTitle: "Das System - Der Architekt", title: "Das Sorgen-Büro öffnet", impulse: "Sorgen lassen sich nicht verbieten, nur terminieren.", exercise: "Lege eine Sorgenzeit fest, zum Beispiel 17 Uhr. Tagsüber: aufschreiben und verschieben. Um 17 Uhr: 10 Minuten sorgen.", reflection: "Wie viele der Morgensorgen waren um 17 Uhr noch wichtig?" },
  { day: 18, week: 3, weekTitle: "Das System - Der Architekt", title: "Der Brain Dump", impulse: "Dein Gehirn ist kein Speicher für To-dos. Heute wird der Arbeitsspeicher geleert.", exercise: "Schreibe abends 5 Minuten lang alles auf, was im Kopf ist. Alles raus aufs Papier.", reflection: "Bist du schneller eingeschlafen?" },
  { day: 19, week: 3, weekTitle: "Das System - Der Architekt", title: "Umgebung schafft Klarheit", impulse: "Aussen Ordnung, innen Ruhe.", exercise: "Räume einen kleinen Bereich auf: Nachttisch, Schublade, Ecke auf dem Schreibtisch. Mach es minimalistisch.", reflection: "Wie fühlt sich der Blick auf diese freie Fläche an?" },
  { day: 20, week: 3, weekTitle: "Das System - Der Architekt", title: "Nein sagen", impulse: "Overthinking entsteht oft, weil wir Ja sagten, obwohl wir Nein meinten.", exercise: "Sag heute zu einer kleinen Sache Nein oder Ich brauche Bedenkzeit.", reflection: "War die Reaktion des anderen wirklich so schlimm?" },
  { day: 21, week: 3, weekTitle: "Das System - Der Architekt", title: "Das Informations-Fasten", impulse: "Nachrichten sind oft Stress-Futter.", exercise: "24 Stunden keine Nachrichten: keine App, kein Radio, keine Zeitung.", reflection: "Hat dir wirklich etwas gefehlt?" },
  { day: 22, week: 4, weekTitle: "Das Leben - Werte und Leichtigkeit", title: "Der Werte-Check", impulse: "Wer seine Werte kennt, zerdenkt keine Entscheidungen.", exercise: "Definiere deine Top 3 Werte, zum Beispiel Freiheit, Sicherheit oder Harmonie. Schreib sie auf.", reflection: "Passt dein aktueller Haupt-Stressfaktor zu deinen Werten?" },
  { day: 23, week: 4, weekTitle: "Das Leben - Werte und Leichtigkeit", title: "Die 60-Sekunden-Entscheidung", impulse: "Gut genug spart Lebenszeit.", exercise: "Triff heute drei kleine Entscheidungen in unter 60 Sekunden. Wähle das Erste, das passt.", reflection: "Ist die Welt untergegangen, weil es nicht perfekt war?" },
  { day: 24, week: 4, weekTitle: "Das Leben - Werte und Leichtigkeit", title: "Mut zur Lücke", impulse: "Perfektionismus ist Angst in schicken Schuhen.", exercise: "Erledige eine Aufgabe bewusst nur zu 80 Prozent.", reflection: "Hat es jemand gemerkt?" },
  { day: 25, week: 4, weekTitle: "Das Leben - Werte und Leichtigkeit", title: "Was wäre, wenn es gut wird?", impulse: "Nutze die Vorstellungskraft für das Best-Case-Szenario.", exercise: "Frage bei Angst bewusst: Und was, wenn es absolut großartig wird? Stell dir einen Film-Trailer vor: Wie sieht das Happy End aus?", reflection: "Wie ändert sich deine Körperhaltung dabei?" },
  { day: 26, week: 4, weekTitle: "Das Leben - Werte und Leichtigkeit", title: "Der Rückwärts-Blick", impulse: "Wir schauen immer auf den Berg vor uns. Das stresst.", exercise: "Schreib abends 3 Dinge auf, die du heute gut gemacht hast.", reflection: "Fühlt sich der Tag erfolgreicher an?" },
  { day: 27, week: 4, weekTitle: "Das Leben - Werte und Leichtigkeit", title: "Dankbarkeit als Angst-Killer", impulse: "Das Gehirn kann nicht gleichzeitig dankbar und ängstlich sein.", exercise: "Bei Sorge: Nenne sofort 3 Dinge, für die du jetzt dankbar bist.", reflection: "Konntest du den Fokus-Shift spüren?" },
  { day: 28, week: 4, weekTitle: "Das Leben - Werte und Leichtigkeit", title: "Dein Zukunfts-Ich", impulse: "In 5 Jahren wirst du darüber lachen.", exercise: "Was würde dein entspanntes 80-jähriges Ich zu deinem heutigen Problem sagen?", reflection: "Wirkt das Problem noch so riesig?" },
  { day: 29, week: 5, weekTitle: "Finale - Lieblingswerkzeuge sichern", title: "Die Notfall-Liste", impulse: "An schlechten Tagen vergessen wir die Tools.", exercise: "Schreib deine 3 Lieblings-Tools auf eine kleine Karte für den Geldbeutel.", reflection: "Welches Tool ist dein Favorit?" },
  { day: 30, week: 5, weekTitle: "Finale - Lieblingswerkzeuge sichern", title: "Feiern und Loslassen", impulse: "Du hast an dir gearbeitet. Das ist selten.", exercise: "Feiere dich. Kauf dir was Schönes. Und dann: Klapp das Buch zu und leb.", reflection: "Was ist der größte Unterschied zwischen dir an Tag 1 und heute?" },
];

const state = {
  activeDay: 1,
  activeWeek: "all",
  entries: loadEntries(),
};

const elements = {
  dayList: document.querySelector("#dayList"),
  weekTabs: document.querySelectorAll(".week-tab"),
  weekLabel: document.querySelector("#weekLabel"),
  dayTitle: document.querySelector("#dayTitle"),
  dayNumber: document.querySelector("#dayNumber"),
  impulseText: document.querySelector("#impulseText"),
  exerciseText: document.querySelector("#exerciseText"),
  reflectionPrompt: document.querySelector("#reflectionPrompt"),
  doneCheck: document.querySelector("#doneCheck"),
  ratingRange: document.querySelector("#ratingRange"),
  ratingValue: document.querySelector("#ratingValue"),
  reflectionInput: document.querySelector("#reflectionInput"),
  progressText: document.querySelector("#progressText"),
  progressFill: document.querySelector("#progressFill"),
  streakText: document.querySelector("#streakText"),
  continueButton: document.querySelector("#continueButton"),
  exportButton: document.querySelector("#exportButton"),
  prevButton: document.querySelector("#prevButton"),
  nextButton: document.querySelector("#nextButton"),
};

render();

elements.weekTabs.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeWeek = button.dataset.week;
    const visibleDays = getVisibleDays();
    if (!visibleDays.some((item) => item.day === state.activeDay)) {
      state.activeDay = visibleDays[0].day;
    }
    render();
  });
});

elements.doneCheck.addEventListener("change", () => {
  updateEntry({ done: elements.doneCheck.checked });
  renderDayList();
  renderProgress();
});

elements.ratingRange.addEventListener("input", () => {
  updateEntry({ rating: Number(elements.ratingRange.value) });
  elements.ratingValue.textContent = `${elements.ratingRange.value}/5`;
});

elements.reflectionInput.addEventListener("input", () => {
  updateEntry({ reflection: elements.reflectionInput.value });
});

elements.prevButton.addEventListener("click", () => moveDay(-1));
elements.nextButton.addEventListener("click", () => moveDay(1));
elements.continueButton.addEventListener("click", continueChallenge);
elements.exportButton.addEventListener("click", exportNotes);

function render() {
  renderWeekTabs();
  renderDayList();
  renderActiveDay();
  renderProgress();
}

function renderWeekTabs() {
  elements.weekTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.week === state.activeWeek);
  });
}

function renderDayList() {
  elements.dayList.innerHTML = "";
  getVisibleDays().forEach((item) => {
    const entry = getEntry(item.day);
    const button = document.createElement("button");
    button.className = "day-card";
    button.type = "button";
    button.classList.toggle("is-active", item.day === state.activeDay);
    button.classList.toggle("is-done", Boolean(entry.done));
    button.innerHTML = `
      <span class="day-card__number"><span>${String(item.day).padStart(2, "0")}</span></span>
      <span>
        <span class="day-card__title">${item.title}</span>
        <span class="day-card__meta">${item.weekTitle}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.activeDay = item.day;
      renderActiveDay();
      renderDayList();
    });
    elements.dayList.append(button);
  });
}

function renderActiveDay() {
  const item = days.find((day) => day.day === state.activeDay);
  const entry = getEntry(item.day);

  elements.weekLabel.textContent = `Woche ${item.week}: ${item.weekTitle}`;
  if (item.week === 5) elements.weekLabel.textContent = item.weekTitle;
  elements.dayTitle.textContent = `Tag ${item.day} - ${item.title}`;
  elements.dayNumber.textContent = String(item.day).padStart(2, "0");
  elements.impulseText.textContent = item.impulse;
  elements.exerciseText.textContent = item.exercise;
  elements.reflectionPrompt.textContent = item.reflection;
  elements.doneCheck.checked = Boolean(entry.done);
  elements.ratingRange.value = entry.rating ?? 0;
  elements.ratingValue.textContent = `${entry.rating ?? 0}/5`;
  elements.reflectionInput.value = entry.reflection ?? "";
  elements.prevButton.disabled = item.day === 1;
  elements.nextButton.disabled = item.day === 30;
}

function renderProgress() {
  const doneCount = days.filter((day) => getEntry(day.day).done).length;
  const percentage = Math.round((doneCount / days.length) * 100);
  elements.progressText.textContent = `${doneCount}/30`;
  elements.progressFill.style.width = `${percentage}%`;
  elements.streakText.textContent = getProgressMessage(doneCount);
}

function getVisibleDays() {
  if (state.activeWeek === "all") return days;
  return days.filter((item) => String(item.week) === state.activeWeek);
}

function getEntry(day) {
  return state.entries[String(day)] ?? {};
}

function updateEntry(patch) {
  const key = String(state.activeDay);
  state.entries[key] = {
    ...state.entries[key],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveEntries();
}

function moveDay(direction) {
  const nextDay = Math.min(30, Math.max(1, state.activeDay + direction));
  state.activeDay = nextDay;
  if (state.activeWeek !== "all") {
    const item = days.find((day) => day.day === nextDay);
    state.activeWeek = String(item.week);
  }
  render();
}

function continueChallenge() {
  const firstOpen = days.find((day) => !getEntry(day.day).done);
  state.activeDay = firstOpen ? firstOpen.day : 30;
  state.activeWeek = "all";
  document.querySelector(".workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  render();
}

function exportNotes() {
  const exportData = days.map((day) => ({
    tag: day.day,
    titel: day.title,
    erledigt: Boolean(getEntry(day.day).done),
    hilfreichkeit: getEntry(day.day).rating ?? 0,
    reflexion: getEntry(day.day).reflection ?? "",
  }));
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "overthinking-workbook-notizen.json";
  link.click();
  URL.revokeObjectURL(url);
}

function getProgressMessage(doneCount) {
  if (doneCount === 0) return "Starte mit Tag 1. Kein Druck, nur ein kleiner Schritt.";
  if (doneCount < 7) return "Woche 1 baut Ruhe im Körper auf. Bleib freundlich mit dir.";
  if (doneCount < 14) return "Du trainierst den Beobachter. Genau hier wird Abstand möglich.";
  if (doneCount < 21) return "Dein System wird leiser. Gute Struktur nimmt Druck aus dem Kopf.";
  if (doneCount < 30) return "Jetzt wird es alltagstauglich: Werte, Leichtigkeit und Mut zur Lücke.";
  return "Alle 30 Tage geschafft. Such dir deine Lieblings-Tools und nimm sie mit ins echte Leben.";
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
