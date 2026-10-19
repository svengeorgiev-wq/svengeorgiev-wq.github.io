# Stuhl Yoga: Videos mit Sprachanleitung

Inhalt
- `stuhl_yoga.py`: Sprechtexte und Video-Ablauf aller 11 Übungen in einer Datei
- `skripte.json`: alle Sprechtexte zum Lesen (122 Clips, ca. 3.200 Zeichen)
- `bilder/`: alle Einzelbilder der Übungen

Voraussetzungen: Python 3 mit `pillow` und `numpy`, `ffmpeg` mit `ffprobe`, ElevenLabs-Key.

## Prompt für Claude Code

Den Ordner `stuhl-yoga-audio` in den Buchordner `Audios/` von „Ganzheitlich fit“ legen, Claude Code dort starten und Folgendes einfügen:

```
Im Ordner stuhl-yoga-audio liegt alles für die Sprachanleitung der Stuhl-Yoga-Videos.

1. Lies README_CLAUDE_CODE.md und stuhl_yoga.py.
2. Installiere falls nötig: pip install pillow numpy (ffmpeg muss vorhanden sein).
3. Nimm meinen ElevenLabs-Key aus der Umgebung (ELEVENLABS_API_KEY) bzw. aus derselben
   Quelle wie bei meinen bisherigen Audio-Projekten. Den Key nie in eine Datei im Repo schreiben.
4. Teste zuerst nur eine Übung: python stuhl_yoga.py audio kopfdrehen
   Prüfe, dass Modell eleven_v4 und Stimme Ramona verwendet werden und die Clips gut klingen.
5. Dann alle: python stuhl_yoga.py audio
6. Videos mit Ton bauen: python stuhl_yoga.py video
   Ergebnis: ausgabe/<übung>.mp4 und ausgabe/<übung>.jpg (11 Videos).
7. Prüfe Stichproben (ffprobe: Video + Ton vorhanden, Länge plausibel, Ton passt zum Bild).
8. Kopiere alle mp4 und jpg aus ausgabe/ in meinen Klon von svengeorgiev-wq/svengeorgiev-wq.github.io
   nach stuhl-yoga/videos/ (bestehende Dateien gleichen Namens überschreiben).
9. In stuhl-yoga/sw.js den Wert CACHE von "stuhl-yoga-v2" auf "stuhl-yoga-v3" setzen.
10. Commit "Stuhl Yoga: Videos mit Sprachanleitung" und push auf main.
11. Prüfe danach https://tools.munichpublishing.de/stuhl-yoga/ (ein Video lädt und hat Ton).
```

## Technik

- ElevenLabs: Modell `eleven_v4`, `language_code` de, Stimme „Ramona“ (Suche per Name im Konto, oder `ELEVENLABS_VOICE_ID` setzen), mp3 44,1 kHz 128 kbit/s, Sprechtempo 0,9.
- Jede Zeile ist ein eigener Clip unter `clips/<übung>/NN.mp3` und startet genau mit ihrem Bildschritt. Ist ein Clip länger als geplant, hält das Video das Bild entsprechend länger (Clip + 0,35 s).
- Ton im Video: auf -16 LUFS normalisiert, AAC 128 kbit/s mono.
- Vorhandene Clips werden nicht neu erzeugt. Einen Clip neu erzeugen: Datei löschen und `audio` erneut starten.
- Text einer Zeile ändern: in `stuhl_yoga.py` den `sprich`-Text anpassen, den passenden Clip löschen, `audio` und `video` erneut laufen lassen.
- Dateinamen passen zur App (`katzenbuckel`, `fuesse-kreisen`, `kopfdrehen`, `selbstumarmung`, `schultern-heben`, `vorbeuge`, `koerperrueckseite`, `gesaess`, `arme-rotieren`, `arme-ueber-kopf`, `nacken`), an der App selbst ändert sich nichts.
