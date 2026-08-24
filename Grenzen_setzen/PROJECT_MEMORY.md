# Grenzen setzen Begleit-App

- Public URL: `https://tools.munichpublishing.de/Grenzen_setzen/`
- Deployment source: this folder in the central GitHub Pages repository.
- Book landing page: `https://munichpublishing.de/Grenzen_setzen`
- Cover links (hero and footer): `https://www.amazon.de/dp/B0H2XPSMZ2`
- Current visual system: warm peach background, black typography, vivid orange accent, based on the 23.8 final cover.
- Current PWA cache: `grenzen-setzen-v6` in `sw.js`; bump the cache name and visible asset query versions for every shell-affecting release.
- Daily modules: exactly 21; labels and chapter references follow the final 24.8 interior manuscript.
- Audio convention: `audio/tag-01.mp3` through `audio/tag-21.mp3`. Missing files appear honestly as `Audio folgt`; same-origin files are detected automatically.
- Audio delivery: all 21 MP3 files are present under the naming convention above (33,580,727 bytes total; 34:40 minutes total; 128 kbit/s). The deployed copies match the delivered originals byte-for-byte by SHA-256.
- Progress storage key: `nichtalle_data`, state version 3. Existing version-2 progress is preserved and gains the `listenedAudios` field.
- Privacy/product boundary: no account or backend. Notes, tools, progress, and audio-listened state remain in localStorage; JSON export/import provides recovery.
- PWA installation: direct browser install when `beforeinstallprompt` is available, plus explicit iPhone/iPad and Android instructions.
