# Der ANKER-Begleiter

Statische, accountfreie PWA zum Buch „ADHS & Wechseljahre – Wenn dein altes System nicht mehr trägt“ von Anna Lorenz.

## Lokal starten

Im Ordner `anker-begleiter` einen statischen Webserver starten, zum Beispiel mit dem gebündelten Python:

```powershell
python -m http.server 4173
```

Dann `http://127.0.0.1:4173/` öffnen.

## Veröffentlichung

- Zieladresse: `https://tools.munichpublishing.de/anker-begleiter/`
- Bereitstellung: zentrales GitHub-Pages-Repository mit Munich-Publishing-Custom-Domain
- Rechtliches: zentrale Seiten `https://munichpublishing.de/impressum` und `https://munichpublishing.de/Datenschutz`
- App-Icon: finale reine Schwarzweiß-Ankermarke als SVG sowie 180-, 192- und 512-Pixel-PNG
- Öffentliche Freigabe für App und 21 MP3-Dateien am 31.08.2026 erteilt

Die Inhaltsquelle `anker-inhalte.json` ist unverändert aus der gelieferten Datei übernommen.

Die 21 finalen Audio-Impulse liegen vollständig als `audio/tag-01.mp3` bis `audio/tag-21.mp3` vor.

Auf dem Startscreen führt der prominente Button `21 Audio-Impulse` in eine eigene Übersicht, in der alle Audios direkt abgespielt werden können.
