# ADHS & Overthinking – 21-Tage-Begleiter

Statische Companion-App zum Buch von Anna Lorenz. Der hochgeladene 21-Tage-Plan ist die inhaltliche und navigative Grundlage. Die App ergänzt ihn um lokale Fortschrittsspeicherung, interaktive Übungen, Timer, SOS-Routing, den Werkzeugkasten mit 26 Buchtools sowie Export und Import.

## Lokal testen

```powershell
python -m http.server 4173
```

Danach `http://localhost:4173/Overthinking_ADHS/` öffnen.

## Daten

Alle Eingaben bleiben ohne Konto im `localStorage` des jeweiligen Browsers. Eine JSON-Datei oder ein Übertragungscode kann unter „Daten sichern“ exportiert und wieder importiert werden.

## Audios

- `audio/` enthält die vier Impuls-Audios (`AUDIO_TRACKS` in `tracks.js`) und seit 13.10.2026 die 21 Tages-Audios `tag-01.mp3` bis `tag-21.mp3` (`DAY_AUDIOS` in `tracks.js`).
- Jedes Tagesmodul zeigt oben den Player zu seinem Tag, „Zum Anhören“ listet alle 21 unter den vier Impulsen.
- Tages-Audios: Eleven v4, Stimme Ramona, 1,5 s Stille vorne, -16 LUFS, 128 kbit/s mono. Skripte und Erzeugung (`audio_skripte.json`, `erzeuge_audios.py`) liegen im Buchordner `ADHS_bei Erwachsenen/Audios`.
- Bei Änderungen an `tracks.js`, `app.js` oder `styles.css` die `?v=`-Version in `index.html` und `sw.js` sowie den Cache-Namen in `sw.js` erhöhen.
