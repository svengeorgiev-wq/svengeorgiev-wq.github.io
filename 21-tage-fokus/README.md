# 21-Tage-Fokus-Begleiter

Statische, installierbare Companion-PWA zu **Frauen mit ADHS: Die 21-Tage-Fokus-Formel**.

## Rollenverteilung

- Das Buch erklärt Hintergründe und die vollständigen Tagesroutinen.
- Das Workbook nimmt persönliche Beobachtungen und Ergebnisse auf.
- Die App ergänzt beides mit Audio-Snacks, Fokus-Timer, Kalender-Erinnerung, lokalem Fortschritt und dem interaktiven Notfall-Guide.

## Enthalten

- separater Setup-Tag 0 plus Tage 1–21 mit den Titeln aus dem Manuskript
- fünf Etappen: Anfangen, Zeit und Reize, Kopfvolumen, Energie, Gefühle und Grenzen
- 5-Minuten-Timer mit den vier wiederkehrenden Zeitabschnitten aus dem Buch
- taggenaue Minimalversionen zwischen 20 und 90 Sekunden
- 22 echte MP3-Audio-Snacks für Tag 0–21 inklusive optionalem Offline-Download
- deutlicher Hinweis, dass die Audio-Snacks keine Hörversion des Buches sind
- drei neutrale Marker: gemacht, versucht, ausgelassen
- Energiestufe ab Tag 13
- sechs manuskriptbasierte Wiedereinstiegswege im Notfall-Guide
- wiederkehrende Kalender-Erinnerung für 21 Tage
- lokale Sicherung und Wiederherstellung des Fortschritts
- Offline-App-Shell ohne Konto, E-Mail-Erfassung oder Backend

## Lokal starten

```powershell
python -m http.server 4178
```

Danach `http://127.0.0.1:4178/` öffnen.

## Live

`https://tools.munichpublishing.de/21-tage-fokus/`
