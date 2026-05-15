/* ─────────────────────────────────────────────────────────────
   21-TAGE-DATEN — Overthinking bei ADHS · Anna Lorenz
   Inhalte aus dem Buch (S. 4–146).
   ───────────────────────────────────────────────────────────── */

const WEEKS = [
  { num: 1, title: 'Sofort weniger Kopf' },
  { num: 2, title: 'Alltag & Beziehungen stabilisieren' },
  { num: 3, title: 'Job, Gender & Bürokratie' },
];

const SOS_TOOLS = [
  {
    name: 'Dopamin-Pause',
    page: 17,
    desc: '3 Minuten Timer: Handy weg, kein Input, nur still sitzen oder stehen. Sofortiger Reset für ein überreiztes System.'
  },
  {
    name: '5-4-3-2-1-Erdungstechnik',
    page: 20,
    desc: '5 Dinge sehen, 4 fühlen, 3 hören, 2 riechen, 1 schmecken. Bringt dich sofort zurück ins Jetzt.'
  },
  {
    name: 'Box-Breathing',
    page: 120,
    desc: '2 Minuten: 4 Sek ein, 4 halten, 4 aus, 4 halten. Senkt die Alarmstufe direkt — auch mitten am Tag.'
  }
];

const DAYS = [
  /* WOCHE 1 — Sofort weniger Kopf */
  {
    day: 1,
    tool: 'Stärken-Detektive',
    page: 4,
    exercise: 'Schreib 1 Mini-Erfolg in 3 Spalten: Situation / ADHS-Anteil / Beweis.',
    situation: 'Du liegst abends im Bett und dein Kopf spielt den Tag wie ein peinliches Highlight-Reel ab („Warum hab ich das gesagt?") — du sammelst bewusst 1 Gegenbeweis, statt weiter zu grübeln.',
    why: 'Fakten entkräften den Negativfilter und bremsen die Schamspirale.'
  },
  {
    day: 2,
    tool: 'Narrative Externalisierung: Gib dem Kritiker einen Namen',
    page: 7,
    exercise: 'Gib der Kritikerstimme einen Namen und sag einmal: „Ah, das ist wieder [Name]."',
    situation: 'Nach einem kleinen Fehler startet sofort „Du bist unfähig" — du erkennst: Das ist ein Gedankensender, nicht die Wahrheit.',
    why: 'Benennen schafft Distanz und reduziert die emotionale Wucht des Gedankens.'
  },
  {
    day: 3,
    tool: 'Dopamin-Pause',
    page: 17,
    exercise: '3 Minuten Timer: Handy weg, kein Input, nur still sitzen oder stehen.',
    situation: 'Du feilst ewig an einer Nachricht oder scrollst, weil dein Kopf zu laut ist — du machst einen Reset vor der nächsten Aktion.',
    why: 'Reiz-Entzug senkt die Überstimulation und nimmt dem Grübeln den Treibstoff.'
  },
  {
    day: 4,
    tool: '5-4-3-2-1-Erdungstechnik',
    page: 20,
    exercise: '5 Dinge sehen, 4 fühlen, 3 hören, 2 riechen, 1 schmecken (oder Kurzform 3–2–1).',
    situation: 'Im Supermarkt, ÖPNV oder Office wird alles zu viel und du kippst in Overload — du holst dich in die Gegenwart zurück.',
    why: 'Sinnesfokus verdrängt Gedankenschleifen, weil er Kapazität im Gehirn bindet.'
  },
  {
    day: 5,
    tool: 'Sensorik-Audit',
    page: 30,
    exercise: 'Notiere 3 Stress-Reize (Licht, Geräusch, Kleidung, Chaos) und entferne 1 sofort.',
    situation: 'Du bist „grundlos" gereizt — tatsächlich stresst dich z. B. kratzende Kleidung oder grelles Licht permanent.',
    why: 'Weniger Reize = weniger Dauerstress = weniger Overthinking als Notfallreaktion.'
  },
  {
    day: 6,
    tool: 'Safe-Space-Box',
    page: 31,
    exercise: 'Lege 2 Dinge griffbereit bereit (z. B. Ohrstöpsel + Schlafmaske oder Duftanker + Fidget).',
    situation: 'Nach einem sozialen Tag bist du kurz vor Shutdown oder Meltdown — du greifst zur Box, statt dich „zusammenzureißen".',
    why: 'Du brauchst keine Willenskraft, sondern sofortige Reizreduktion.'
  },
  {
    day: 7,
    tool: 'Ideen-Schleuse',
    page: 43,
    exercise: 'Schreib 5 kreisende Gedanken als 1-Satz-Parkplatz auf und setz eine Sichtungszeit (z. B. 19:00 Uhr).',
    situation: 'Beim Arbeiten kommen dauernd neue Ideen oder To-dos und du springst weg — du parkst, statt zu jagen.',
    why: 'Externalisieren entlastet dein Arbeitsgedächtnis und reduziert den inneren Druck.'
  },

  /* WOCHE 2 — Alltag & Beziehungen stabilisieren */
  {
    day: 8,
    tool: 'Analoges Mind-Mapping',
    page: 44,
    exercise: '5 Minuten Mindmap: Thema in die Mitte, 5 Äste, fertig.',
    situation: 'Du fühlst dich überfordert, weil alles zusammenklebt (Job, Haushalt, Beziehung) — du machst den Knoten sichtbar.',
    why: 'Sichtbarkeit macht Chaos sortierbar und senkt mentale Überlastung.'
  },
  {
    day: 9,
    tool: 'Unmasking-Ampel',
    page: 53,
    exercise: 'Ordne 3 Kontexte in Grün / Gelb / Rot ein (Maske ab / locker / auf).',
    situation: 'Du bist nach Treffen leer und grübelst danach stundenlang — du erkennst: zu viel „Rot" ohne Erholung.',
    why: 'Du steuerst Energie über passende soziale Zonen statt über Durchhalten.'
  },
  {
    day: 10,
    tool: 'SOS-Technik bei RSD',
    page: 55,
    exercise: 'Sag „Das könnte RSD sein", notiere 2 neutrale Erklärungen, entscheide „Ich warte bis morgen".',
    situation: 'Jemand antwortet nicht oder wirkt kurz — dein Kopf macht daraus Ablehnung.',
    why: 'Du stoppst die Interpretation und schaffst eine Zeitbremse gegen Impulsreaktionen.'
  },
  {
    day: 11,
    tool: 'Time-Out-Geste',
    page: 66,
    exercise: 'Lege Satz + Rückkehrzeit fest: „Time-out, ich komme um __ zurück."',
    situation: 'Ein Gespräch kippt und du merkst körperlich: gleich eskaliert es — du gehst raus, bevor du Schaden machst.',
    why: 'Pause senkt den Stresspegel, damit dein Gehirn wieder steuerbar wird.'
  },
  {
    day: 12,
    tool: 'Dopamin-Check-in',
    page: 68,
    exercise: 'Notiere 3 Fragen: „Was war gut? Was war schwer? Was brauche ich?"',
    situation: 'Beziehung wird zu Orga und Problemlösen und du grübelst über „uns" — du erzeugst wieder Verbindung.',
    why: 'Positive Momente bekommen bewusst Platz und reduzieren Beziehungs-Overthinking.'
  },
  {
    day: 13,
    tool: 'System der minimalen Reibung',
    page: 79,
    exercise: 'Wähle 1 Stelle, die nie funktioniert, und mach sie „dümmer" (sichtbar, offen, nah dran).',
    situation: 'Schlüssel, Post oder Wäsche scheitern immer wieder und triggern Scham — du baust die Hürde ab.',
    why: 'Weniger Reibung = mehr Umsetzung = weniger Schamspiralen.'
  },
  {
    day: 14,
    tool: '15-Minuten-Blitz-Routine',
    page: 81,
    exercise: '5 Minuten Timer: 1 Fläche frei machen oder 10 Dinge wegräumen.',
    situation: 'Chaos wirkt riesig, du vermeidest und grübelst — du machst einen schnellen sichtbaren Reset.',
    why: 'Ein kleiner sichtbarer Erfolg senkt Stress und erhöht das Handlungsgefühl.'
  },

  /* WOCHE 3 — Job, Gender & Bürokratie */
  {
    day: 15,
    tool: 'Eat the Frog (ADHS-modifiziert)',
    page: 93,
    exercise: 'Schreib den „Frosch" auf und definiere den kleinsten Startschritt (max. 1 Minute).',
    situation: 'Du bist beschäftigt mit Kleinkram, aber das Wichtigste bleibt liegen — du startest mikro-klein statt zu prokrastinieren.',
    why: 'Mini-Start erzeugt Momentum und umgeht Startwiderstand.'
  },
  {
    day: 16,
    tool: 'Fokus-Timer & Body Doubling',
    page: 94,
    exercise: 'Starte einen 5–10 Minuten Fokus-Sprint mit Timer (Body Double optional).',
    situation: 'Du willst anfangen, driftest aber ins Scrollen oder Herumlaufen — der Sprint bringt dich in Bewegung.',
    why: 'Zeitlimit macht den Einstieg klein und reduziert Überforderung.'
  },
  {
    day: 17,
    tool: 'Cycle-Planner',
    page: 106,
    exercise: 'Markiere „Energie: low / medium / high" und passe 1 Erwartung daran an.',
    situation: 'Rund um PMS- oder Low-Phasen wird alles lauter im Kopf und du wertest dich ab — du planst passend, statt zu kämpfen.',
    why: 'Planung nach Energie reduziert Selbstvorwürfe und Overthinking-Druck.'
  },
  {
    day: 18,
    tool: 'Ernährung & Supplements zur Dopamin-Unterstützung',
    page: 108,
    exercise: 'Plane 1 Stabilizer: Wasser + Protein-Snack (oder fester Snack-Slot).',
    situation: 'Nachmittags-Crash → mehr Grübeln, Reizbarkeit, Impuls-Scrollen — du stabilisierst, statt zu kompensieren.',
    why: 'Stabilere Energie senkt die innere Unruhe, die Grübeln antreibt.'
  },
  {
    day: 19,
    tool: 'Physisches Entladen',
    page: 118,
    exercise: '90 Sekunden: 10 Kniebeugen + 20 Sek Shake/Gehen + 10 Kniebeugen.',
    situation: 'Du spürst Wut oder Impuls und willst sofort reagieren — du entlädst, bevor du sprichst oder schreibst.',
    why: 'Körperlicher Stressabbau reduziert Impulsreaktionen und das Nach-Grübeln.'
  },
  {
    day: 20,
    tool: 'Box-Breathing',
    page: 120,
    exercise: '2 Minuten Box-Breathing: 4 ein, 4 halten, 4 aus, 4 halten.',
    situation: 'Vor Telefonat, Feedback oder Behörde steigt der Alarm im Körper — du regulierst, bevor du vermeidest.',
    why: 'Atmung wirkt direkt aufs Nervensystem und senkt die Alarmstufe.'
  },
  {
    day: 21,
    tool: 'Drei-Kisten-Sortiersystem + Telefon-Skript',
    page: 144,
    exercise: 'Sortiere 1 Brief in „Jetzt / Warten / Archiv" und schreibe 3 Sätze fürs Telefonat: „Ich rufe an wegen… / Aktenzeichen… / Ich brauche…" (Skript S. 146).',
    situation: 'Mahnung liegt seit Wochen ungeöffnet, der Anruf blockiert dich — du zerlegst die Hürde in Sortieren + Skript statt Kopfkino.',
    why: 'Du reduzierst Entscheidungslast und senkst die Schwelle, überhaupt zu handeln.'
  },
];
