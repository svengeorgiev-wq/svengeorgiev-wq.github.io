# Sherlock Schwer PWA

## Purpose

- Book companion for `Sherlock Logikrätsel – Band 4: Schwer`.
- Local source/deploy folder: `sherlock-schwer/`.
- Public path: `https://tools.munichpublishing.de/sherlock-schwer/`.

## Product contract

- The existing `sherlock-logikraetsel/` light/medium app remains unchanged.
- The start page shows the supplied Band 4 cover prominently.
- `Buchfälle` mirrors all 20 printed case names and provides concrete task and solution page ranges.
- `Bonusrätsel` contains five curated, text-only four-level cases. Each level is locked until the previous answer is correct; there are no tables or visual solution elements.
- Bonus cases: `Das Telegramm im Nachtzug`, `Der Schatten hinter dem Spiegel`, `Die stumme Glocke von St. Bride`, `Der Smaragd im verschlossenen Museum`, and `Die letzte Laterne an der Themse`.
- The engine enumerates the allowed combinations for every level and refuses to load unless every case has exactly one solution per level and a valid dependency chain.
- Progress, notes, level answers, and unlocked levels persist separately for all five cases in `localStorage`; v2 progress is migrated into the retained Nachtzug case, and export/import remains available without an account.
- Installation guidance must remain visible for iPhone/iPad and Android; use the native install prompt when available.

## Versioning

- Current shell version: `v6`.
- Service-worker cache: `sherlock-schwer-v6.0.0`.
- Cache cleanup is restricted to the `sherlock-schwer-` prefix so this app cannot delete caches belonging to sibling PWAs on the same origin.
- When shell assets change, bump query versions in `index.html`, registration in `app.js`, manifest link, and `CACHE_NAME`/precache entries in `sw.js` together.

## Source notes

- Supplied interior: `3.11-Interior-Schwer-Print.pdf`, 154 pages, Canva image-only PDF.
- The actual solution section starts on printed page 81. One Fall 1 title page says `Lösungswege auf Seite 95`; the companion deliberately uses the actual pages 81–83.
- The supplied cover is copied to `assets/sherlock-schwer-cover.jpg`.
- The cover links directly to `https://www.amazon.de/dp/B0FZD79PK5`.
- The cover is displayed cleanly without an offset backdrop or overlaid Amazon badge; the image itself is the link.

## Release gate

- Do not publish the user-provided cover or push this folder without telling the user it will become publicly accessible on GitHub Pages/the app domain and obtaining approval.
- The user explicitly approved publication of this PWA and its supplied cover on 2026-08-26.
