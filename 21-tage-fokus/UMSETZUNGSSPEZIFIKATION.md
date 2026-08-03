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
3. **Audios** — alle verfügbaren Audio-Snacks für Tag 0 bis 21
4. **Notfall-Guide** — sechs direkte Wiedereinstiegswege aus Kapitel 8

Zusätzliche Einstellungen werden über ein unaufdringliches Symbol geöffnet und sind kein eigener Hauptbereich.

## Verbindliche Namen auf dem Tagesbildschirm

- **Tag [Nummer]**
- **Heute nur die Minimalversion** — Schalter für die kurze Variante des jeweiligen Tages
- **Fokus-Timer** — gemeinsame Bezeichnung für die 5-Minuten-Routine und die kurzen Varianten
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
- Marker je Tag: gemacht, versucht oder ausgelassen
- gewählte Erinnerungszeit: Uhrzeit
- Minimalversion: Tagesdatum plus Ein-/Aus-Zustand; Dauer je Tag laut Manuskript
- Energiestufe ab Tag 13: Tagesnummer plus Grün, Gelb oder Rot

Der Minimalversions-Schalter gilt nur für den jeweiligen Kalendertag und wird nicht als dauerhaftes persönliches Merkmal gespeichert.

Das bloße Öffnen oder Wechseln eines Tages markiert ihn nicht automatisch und verändert den Fortschritt nicht stillschweigend.

## Fortschrittsregeln

- Tage ohne Zeichen bleiben neutral und leer.
- Es gibt keine rote Warnung, verlorene Serie, Flamme, Punktzahl oder Strafsprache.
- Tage dürfen in beliebiger Reihenfolge markiert und wieder demarkiert werden.
- Eine Lücke blockiert den nächsten Tag nicht.
- Der Wiedereinstieg lautet sinngemäß: **Heute ist ein neuer Einstieg möglich.**

## Minimalversion

Ist **Heute nur die Minimalversion** aktiviert:

- verschwindet die vollständige Routine vollständig aus dem Tagesbildschirm;
- erscheint ausschließlich die kurze Variante des jeweiligen Tages;
- startet der Fokus-Timer mit der manuskriptgetreuen Dauer zwischen 20 und 90 Sekunden;
- bleibt der Tag gleichwertig markierbar.

Es gibt keine ausgegraute oder weiterhin sichtbare Langversion.

## Eingesetzte Inhaltsbausteine

- Titel, Tagesziel, Material, Workbook-Wegweiser und Minimalversion für Tag 0 bis 21
- fünf Etappen aus der Landkarte des Manuskripts
- 22 Audio-Snacks für Tag 0 bis 21
- sechs Wiedereinstiegswege des Notfall-Guides
- drei neutrale Erfolgsmarker

## Abnahmekriterien für Version 1

- Die App funktioniert auf Smartphone und Desktop ohne Registrierung.
- Nach dem ersten Laden funktionieren Tagesansichten, Timer, Fortschritt und App-Shell offline; alle Audios können optional vollständig offline gespeichert werden.
- Beim erneuten Öffnen setzt die App am zuletzt verwendeten Tag fort; `/notfall/` öffnet direkt den Notfall-Guide.
- Fortschritt, Energiestufe und Erinnerungszeit bleiben nach Neuladen erhalten.
- Der Minimalversions-Schalter blendet die vollständige 5-Minuten-Begleitung wirklich aus.
- Die Kalenderdatei enthält eine tägliche Wiederholung und einen Alarm.
- Kein leerer Tag wird visuell negativ bewertet.
- Jeder im Buch verwendete Bereichs- und Werkzeugname existiert wortgleich in der App.
