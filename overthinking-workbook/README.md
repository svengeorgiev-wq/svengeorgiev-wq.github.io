# Schluss mit Overthinking - Workbook App

Statische Web-App für den 30-Tage-Praxis-Plan aus dem Buch. Sie läuft ohne Build-Schritt und speichert Fortschritt, Bewertung und Reflexionen lokal im Browser.

## Lokal starten

Die App kann direkt über `index.html` geöffnet werden. Für eine lokale Vorschau mit Server:

```powershell
python -m http.server 4173
```

Danach im Browser öffnen:

```text
http://localhost:4173
```

## Deployment auf GitHub Pages

1. Repository zu GitHub pushen.
2. In GitHub unter `Settings > Pages` als Quelle `Deploy from a branch` wählen.
3. Branch `main` und Ordner `/root` auswählen.
4. Speichern. GitHub stellt die App danach als Pages-URL bereit.

## Dateien

- `index.html` enthält die App-Struktur.
- `styles.css` setzt den Cover-inspirierten Look.
- `app.js` enthält die 30 Tage, Interaktion und lokale Speicherung.
- `assets/cover.png` ist das Buchcover für den visuellen Stil.
