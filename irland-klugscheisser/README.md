# Irland-Klugscheißer Bonus-App

Statische Companion-App fuer das Amazon-Listing `B0FDKCF6BM`: interaktive Irland-Karte, Fun Facts, Quiz, Favoriten und lokale Reise-Notizen.

## Lokal starten

Die App kann direkt ueber `index.html` geoeffnet werden. Fuer eine lokale Vorschau mit Server:

```powershell
python -m http.server 4173
```

Danach im Browser oeffnen:

```text
http://localhost:4173
```

## Dateien

- `index.html` enthaelt die App-Struktur.
- `styles.css` setzt den hellen Irland-Reise-Look.
- `app.js` enthaelt Stationen, Fakten, Quizlogik und lokale Speicherung.
- `assets/ireland-hero.png` ist das neu generierte Hero-Artwork fuer die App.
- `index.deploy.html` ist die deploybare Einzeldatei mit eingebettetem CSS, JS und Hero-Bild.
- `cover-deploy.webp` sowie `cover-*.webp` sind die optimierten Deploy-Bildvarianten.
