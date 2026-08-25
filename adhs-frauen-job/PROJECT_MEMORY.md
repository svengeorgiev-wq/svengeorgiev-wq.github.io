# ADHS Frauen Job – FOKUS-Begleiter

- Public URL: `https://tools.munichpublishing.de/adhs-frauen-job/`
- Deployment source: this folder in the central GitHub Pages repository.
- App type: static, account-free PWA; all user state remains in `localStorage` under `adhs-frauen-job-fokus-v1` so existing progress survives the redesign.
- Main areas mirror the manuscript vocabulary: `Heute`, `21 Tage`, `FOKUS`, `Energie`, `Skripte`; `Audios` is the added sixth area.
- The 21 workbook days and chapter references are based on `15.8-ADHS-bei-Frauen-im-Job_final.docx`.
- All 21 audio files are available as `audios/tag-01.mp3` through `audios/tag-21.mp3`; `app.js` marks the complete catalog as available.
- Cover source supplied by the user on 2026-08-24; the deployed optimized asset is `assets/book-cover-2026.jpg`.
- PWA release version: resource query `v=5`, service-worker cache `adhs-frauen-job-v5.0.0`. The 21 audios are precached for offline playback. Bump both for shell-affecting releases.
- PWA files: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`, icons, and the local cover asset. There are no runtime CDN dependencies.
