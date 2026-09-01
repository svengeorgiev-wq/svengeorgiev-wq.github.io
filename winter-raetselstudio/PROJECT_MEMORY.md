# Winter-Rätselstudio

- App type: static, account-free companion PWA for `Das große Winter-Rätselbuch für Kinder von 8 bis 10 Jahren`.
- Canonical in-book/app label: `Winter-Rätselstudio` (the book uses `Gratis Winter-Rätselstudio` on page 8).
- Visual source: the supplied 118-page 6×9-inch PDF. Reused crops show the same three recurring Winterdetektive and remain black-and-white.
- Interaction: six new supplemental traces, progressive unlocking, hint text, collected letters, final word `WINTER`, and printable completion certificate.
- Printed promise: the two-page `Bonusblatt 1` includes three independently checked puzzles plus solutions, matching page 8's promise of optional printable extra puzzles.
- Storage: all progress and the optional certificate name stay in `localStorage` under `winter-raetselstudio-v1`; export/import uses a prefixed text code.
- PWA release: CSS/app/service-worker query `v=3`, service-worker cache `winter-raetselstudio-v1.0.2`. Navigation is network-first with an offline fallback; versioned assets are cache-first. Bump the relevant query and cache for shell-affecting changes.
- Public deployment: `https://tools.munichpublishing.de/winter-raetselstudio/` through the central GitHub Pages repository. The user explicitly authorized the public release on 2026-09-01 with `stell es live und gib die url`.
