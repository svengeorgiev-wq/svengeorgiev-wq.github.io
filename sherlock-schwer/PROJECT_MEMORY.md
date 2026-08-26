# Sherlock Schwer PWA

## Purpose

- Book companion for `Sherlock Logikrätsel – Band 4: Schwer`.
- Local source/deploy folder: `sherlock-schwer/`.
- Public path: `https://tools.munichpublishing.de/sherlock-schwer/`.

## Product contract

- The existing `sherlock-logikraetsel/` light/medium app remains unchanged.
- The start page shows the supplied Band 4 cover prominently.
- `Buchfälle` mirrors all 20 printed case names and provides concrete task and solution page ranges.
- `Bonusfall` is a curated, text-only four-level case. Each level is locked until the previous answer is correct; there are no tables or visual solution elements.
- Current bonus case: `Das Telegramm im Nachtzug`; primary mechanism `Reihenfolgen und Platzierungen`; final answer type `Gegenstand / Objekt`.
- The engine enumerates all permutations for every level and refuses to load unless each level has exactly one solution and the dependency chain ends in the green dispatch case.
- Progress, notes, level answers, and the unlocked level persist in `localStorage`; export/import is available without an account.
- Installation guidance must remain visible for iPhone/iPad and Android; use the native install prompt when available.

## Versioning

- Current shell version: `v3`.
- Service-worker cache: `sherlock-schwer-v3.0.0`.
- Cache cleanup is restricted to the `sherlock-schwer-` prefix so this app cannot delete caches belonging to sibling PWAs on the same origin.
- When shell assets change, bump query versions in `index.html`, registration in `app.js`, manifest link, and `CACHE_NAME`/precache entries in `sw.js` together.

## Source notes

- Supplied interior: `3.11-Interior-Schwer-Print.pdf`, 154 pages, Canva image-only PDF.
- The actual solution section starts on printed page 81. One Fall 1 title page says `Lösungswege auf Seite 95`; the companion deliberately uses the actual pages 81–83.
- The supplied cover is copied to `assets/sherlock-schwer-cover.jpg`.
- The cover currently links to a conservative Amazon search URL because no exact ASIN was supplied or reliably found.

## Release gate

- Do not publish the user-provided cover or push this folder without telling the user it will become publicly accessible on GitHub Pages/the app domain and obtaining approval.
- The user explicitly approved publication of this PWA and its supplied cover on 2026-08-26.
