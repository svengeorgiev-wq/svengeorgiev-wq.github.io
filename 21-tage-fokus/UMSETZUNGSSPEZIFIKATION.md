# Umsetzungsspezifikation — 21-Tage-Fokus-Begleiter

Stand: 31.07.2026

## Produktentscheidung

Die App bleibt eine statische, offline-fähige PWA ohne Konto, E-Mail-Erfassung, Cloud-Synchronisierung oder Backend. Alle Zustandsdaten werden ausschließlich lokal auf dem Gerät gespeichert.

Die App ersetzt weder Buch noch Workbook:

- Das Buch erklärt Hintergründe und Zusammenhänge.
- Das Workbook nimmt persönliche Inhalte handschriftlich auf.
- Die App misst Zeit, spielt Audios ab, führt durch den Notfall-Guide und zeigt den lokalen Fortschrittsmarker.

## Verbindliche Bereichsnamen

Diese vier Namen werden in App, Buch, Workbook und Mikro-Verweisen wortgleich verwendet:

1. **Heute** — aktueller Tag mit Routine, Timer, Audio und Markierung
2. **21 Tage** — Übersicht der 21 neutralen Fortschrittskästchen
3. **Audios** — alle verfügbaren Begleit-Audios
4. **Notfall-Guide** — drei kurze Fragen mit Weiterleitung in eines von sechs Szenarien

Zusätzliche Einstellungen werden über ein unaufdringliches Symbol geöffnet und sind kein eigener Hauptbereich.

## Verbindliche Namen auf dem Tagesbildschirm

- **Tag [Nummer]**
- **Heute nur 60 Sekunden** — Schalter für die Minimalversion
- **Fokus-Timer** — gemeinsame Bezeichnung für 60 Sekunden, 90 Sekunden, 2 Minuten oder 5 Minuten
- **Audio anhören**
- **Tag markieren** / **Markierung entfernen**
- **Tägliche Erinnerung einrichten**
- **Energiestufe** — ab Tag 13 mit den Optionen Grün, Gelb und Rot

Beispiel für einen Mikro-Verweis im Buch:

> → in der App: Tag 7 · Fokus-Timer

## Erinnerungsfunktion

Eine statische PWA kann bei vollständig geschlossener App keine tägliche lokale Benachrichtigung zu einer garantierten Uhrzeit auslösen.

Version 1 verwendet deshalb eine wiederkehrende Kalender-Erinnerung:

1. Die Leserin wählt eine Uhrzeit.
2. Die App erzeugt eine `.ics`-Kalenderdatei.
3. Der Kalender zeigt einen täglich wiederkehrenden Termin mit Alarm an.
4. Die Erinnerung funktioniert anschließend unabhängig von der App und ohne Backend.

Die Benutzeroberfläche nennt dies konsequent **Kalender-Erinnerung**, nicht Push-Benachrichtigung. Eine spätere echte Web-Push-Funktion wäre eine gesonderte Ausbaustufe mit Server- oder Push-Dienst.

Vorgeschlagener Kalendertext:

- Titel: **Dein Fokus-Moment**
- Beschreibung: **Öffne deinen heutigen Tag im 21-Tage-Fokus-Begleiter. Deine Minimalversion zählt genauso.**
- Wiederholung: täglich
- Alarm: zum gewählten Zeitpunkt

## Einstieg und Navigation

Es gibt keine Tages-QR-Codes und keine separaten QR-Ziele für die 21 Tage.

- Ein einmaliger App-QR-Code beziehungsweise Kurzlink öffnet die App am normalen Einstieg.
- Die 21 Tage werden innerhalb der App über **Heute** und **21 Tage** aufgerufen.
- Beim nächsten Öffnen setzt die App am zuletzt verwendeten Tag fort.
- Der Notfall-Code darf als einziger zusätzlicher Direktzugang erhalten bleiben und `…/notfall/` öffnen.

Nach der ersten Nutzung soll die Leserin die App über ihr Home-Screen-Symbol öffnen und keinen QR-Code erneut scannen müssen. Die App bleibt auch ohne jeden QR-Code vollständig navigierbar.

## Lokaler Zustand

Gespeichert werden ausschließlich:

- aktueller Tag: Zahl von 0 bis 21
- markierte Tage: Liste von Tagesnummern
- gewählte Erinnerungszeit: Uhrzeit
- Minimalversion: Tagesdatum plus Ein-/Aus-Zustand
- Energiestufe ab Tag 13: Tagesnummer plus Grün, Gelb oder Rot

Der Minimalversions-Schalter gilt nur für den jeweiligen Kalendertag und wird nicht als dauerhaftes persönliches Merkmal gespeichert.

Das bloße Öffnen oder Wechseln eines Tages markiert ihn nicht automatisch und verändert den Fortschritt nicht stillschweigend.

## Fortschrittsregeln

- Unmarkierte Tage bleiben neutral und leer.
- Es gibt keine rote Warnung, verlorene Serie, Flamme, Punktzahl oder Strafsprache.
- Tage dürfen in beliebiger Reihenfolge markiert und wieder demarkiert werden.
- Eine Lücke blockiert den nächsten Tag nicht.
- Der Wiedereinstieg lautet sinngemäß: **Heute ist ein neuer Einstieg möglich.**

## Minimalversion

Ist **Heute nur 60 Sekunden** aktiviert:

- verschwindet die vollständige Routine vollständig aus dem Tagesbildschirm;
- erscheint ausschließlich die 60-Sekunden-Variante;
- startet der Fokus-Timer mit 60 Sekunden;
- bleibt der Tag gleichwertig markierbar.

Es gibt keine ausgegraute oder weiterhin sichtbare Langversion.

## Noch benötigte Inhaltsbausteine

Die technische App kann mit Platzhaltern gebaut werden. Vor der Veröffentlichung werden benötigt:

1. Titel, Kurzauftrag und Minimalversion für alle 21 Tage
2. Zuordnung der Timerdauer je Tag beziehungsweise Werkzeug
3. drei Fragen und sechs Zielwege des Notfall-Guides
4. Dateinamen, Titel und Zuordnung der 24 Audios zu den 21 Tagen oder ergänzenden Audio-Plätzen
5. genaue Workbook-Seitenhinweise pro Tag

## Abnahmekriterien für Version 1

- Die App funktioniert auf Smartphone und Desktop ohne Registrierung.
- Nach dem ersten Laden funktionieren Tagesansichten, Timer, Fortschritt und bereits geladene Platzhalter offline.
- Beim erneuten Öffnen setzt die App am zuletzt verwendeten Tag fort; `/notfall/` öffnet direkt den Notfall-Guide.
- Fortschritt, Energiestufe und Erinnerungszeit bleiben nach Neuladen erhalten.
- Der 60-Sekunden-Schalter blendet die vollständige Routine wirklich aus.
- Die Kalenderdatei enthält eine tägliche Wiederholung und einen Alarm.
- Kein leerer Tag wird visuell negativ bewertet.
- Jeder im Buch verwendete Bereichs- und Werkzeugname existiert wortgleich in der App.
