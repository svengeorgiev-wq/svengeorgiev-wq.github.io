# Bei dir bleiben

- App type: static, account-free PWA companion to `Overthinking beim Dating und in Beziehungen` by Lea Hoffmann.
- Source manuscript: `7.9. Overthinking-Dating_Interior_FINAL.docx`; generated source-faithful day, tool, and citation content lives in `content.js`.
- Fixed navigation labels: `Heute`, `21 Tage`, `22 Tools`, `Belege`. The core model is the manuscript's `Regulations-Ampel` with the four questions `Tempo`, `Atem`, `Spannung`, `Impuls`.
- The app implements all 21 workbook days, all 22 tools with evidence stars and chapter references, local notes/drafts, state-based tool routing, export/import, calendar handoff, and a visible installation guide.
- User data is local under `overthinking-dating-state-v1`; no account, email capture, backend, analytics, or cross-device sync.
- Public deployment target: `https://tools.munichpublishing.de/overthinking-dating/` through the central GitHub Pages repository.
- The user has granted standing authorization and instruction to commit, push, and live-verify every completed PWA release; do not request deployment permission again.
- Current shell query is `v=1`; service-worker cache is `overthinking-dating-v1.0.0`. Shell changes must advance both.
- Initial live release commit `a70db9a` was published on 2026-09-08. Cache-busted GitHub Pages and custom-domain checks returned HTTP 200 for HTML, JS, content, manifest, service worker, and the exact cover; browser QA passed at 390×844 and 1365×900 with persistence, offline restart, and zero console errors.
- The exact supplied cover is `assets/book-cover-v1.png`; app icons use the teal cover palette and white head/heart line motif.
- Source citations are deduplicated to the manuscript's 66 unique works. DOI enrichment was not performed because external Crossref submission was not authorized; unresolved entries link to a citation-specific Google Scholar search.
