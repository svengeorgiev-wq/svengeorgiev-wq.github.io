# Project Memory — Advents-Ampel-PWA

Last updated: 2026-08-21

## Stable identity

- Source: `C:\Users\sveng\OneDrive\Dokumente\Bonus-App\advents-ampel`
- Deployment mirror: `C:\Users\sveng\OneDrive\Dokumente\Bonus-App\tmp\central-pages-deploy\advents-ampel`
- Repository: `https://github.com/svengeorgiev-wq/svengeorgiev-wq.github.io.git`, branch `main`
- Live URL: `https://tools.munichpublishing.de/advents-ampel/`
- Direct Pages URL: `https://svengeorgiev-wq.github.io/advents-ampel/`
- Published baseline: commit `fc76f35` on `main`
- Status: published and live-verified on 2026-08-21
- PWA shell cache: `advents-ampel-shell-v5`

## Product rules

- The app complements the book and workbook; it does not copy personal workbook fields into browser storage.
- Canonical day titles come from the manuscript workbook cards and must stay identical in app, book, and audio list.
- Main areas are `Heute`, `31 Tage`, `Audios`, and `Ampel-Hilfe`.
- No account, email gate, backend, cloud sync, or daily deep links. State stays in `localStorage`; export/import is available.
- The app stores only current day, daily traffic-light selection, completion markers, reminder time, and audio resume positions.
- The calendar performs reminders after the user imports the generated recurring `.ics` event. Never claim the closed PWA sends reminders itself.
- Missing days are not failures and never trigger a restart or forced catch-up.

## Audio status

- Audio files for days 1–15 are integrated in `audio/`.
- UI slots for days 16–31 exist but are shown as not yet integrated.
- Audio duration labels are based on the actual supplied files.
- Audio is cached on first full request; do not precache the entire audio library in the app shell.

## Visual system

- Palette and imagery derive from the supplied navy, gold, red, and green book cover.
- The Christmas redesign uses a deep midnight-blue background, metallic gold headings and dividers, restrained red/green light accents, snow/star details, and subtle evergreen-like glows. Keep this festive but calm and readable.
- The cover appears as the main hero artwork and as a darkened background detail on the audio and help introductions.
- Cover asset: `assets/book-cover.webp`.
- Icons are square crops of the supplied cover art.
- Verify fixed mobile navigation, all four primary views, dialogs, audio controls, and day cards at mobile and desktop widths.

## Release discipline

- For every shell-affecting release, bump `SHELL_CACHE` in `sw.js` and version changed resource URLs in `index.html` and `APP_SHELL`.
- Keep the source and any later deployment mirror synchronized.
- Before publishing, run JavaScript/JSON checks, local mobile and desktop browser checks, then verify HTML, assets, service worker, audio playback, and update behavior at the live URL.

## Live verification baseline

- GitHub Raw, direct GitHub Pages, and the custom domain returned the published app after commit `fc76f35`.
- Live HTML references `styles.css?v=2`, `data.js?v=2`, and `app.js?v=3`.
- Live service worker reports `advents-ampel-shell-v4` and `advents-ampel-audio-v1`.
- Cover and all 15 integrated MP3 files returned `200`; total verified audio size is 26,270,224 bytes.
- Live desktop browser verification found 31 day buttons, correct navigation, loaded cover and audio metadata, no horizontal overflow, and no console errors.
