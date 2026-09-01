# Der ANKER-Begleiter

- App type: static, account-free, privacy-conscious PWA; all user entries stay in `localStorage` under `anker-begleiter-v1`.
- Source content: `anker-inhalte.json`, copied byte-for-byte from the supplied manuscript extraction. Do not retype or rewrite day, tracker, chapter, or tool copy.
- Source manuscript: `31.8. ADHS-und-Wechseljahre-Interior.docx`; the app implements the printed seven-module promise and manuscript-specific night-plan and physician-intro wording.
- Module names are fixed: `Das 21-Tage-Board`, `Die zwölf Werkzeuge`, `Der Drei-Stufen-Tagescheck`, `Der Tracker`, `Timer`, `Der Nacht-Notfallplan`, `Das Vier-Wochen-Protokoll`.
- PWA release: resource query `v=6`, service-worker cache `anker-begleiter-v1.0.5`. Bump both for shell-affecting changes.
- Audio paths are declared in `audio-manifest.json` as drop-ins at `audio/tag-01.mp3` through `audio/tag-21.mp3`. Missing files must not produce a player; successful same-origin audio requests are cached on demand and remain detectable offline after caching.
- All 21 final MP3s were supplied in `ADHS-Wechseljahre_Audios_01-21.zip` and copied byte-identically into `audio/tag-01.mp3` through `audio/tag-21.mp3` on 2026-08-31.
- The start screen and first-use screen contain a prominent `21 Audio-Impulse` button. Route `#audios` lists all 21 titled players; playback automatically pauses any other active audio.
- Public deployment target is fixed at `https://tools.munichpublishing.de/anker-begleiter/` through the central GitHub Pages repository and its Munich Publishing custom domain.
- Legal links reuse the verified central pages `https://munichpublishing.de/impressum` and case-sensitive `https://munichpublishing.de/Datenschutz`; no app-specific legal copy is required.
- The pure black-and-white anchor in `icons/icon.svg`, `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` is the final app icon, not a placeholder.
- No delivery input remains. The user explicitly approved public release of the app and all 21 MP3 files on 2026-08-31 with `live stellen`.
