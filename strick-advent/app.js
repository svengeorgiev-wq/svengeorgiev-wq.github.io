"use strict";

/* Strick-Begleiter: Begleit-App zu „Dein Strick-Adventskalender zum Mitstricken“ (Munich Publishing).
   Inhalte in content.js wörtlich aus dem Buch. Alles bleibt im localStorage dieses Browsers. */

const C = window.STRICK_INHALT;
const T = C.tueren;
const R = C.rahmen;
const KEY = "strick-begleiter-v1";
const app = document.getElementById("app");

const LEER = () => ({ done: {}, opened: {}, notes: {}, tab: {}, zaehler: { label: "", reihen: 0, maschen: 0, wach: false } });
let state = laden();

function laden() {
  try {
    const roh = JSON.parse(localStorage.getItem(KEY) || "{}");
    const s = Object.assign(LEER(), roh);
    s.zaehler = Object.assign(LEER().zaehler, roh.zaehler || {});
    return s;
  } catch (e) { return LEER(); }
}
function speichern() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast("Speichern ist in diesem Browser nicht möglich."); }
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const absaetze = (liste) => (liste || []).map((p) => `<p>${esc(p)}</p>`).join("");

/* ---------- Datum ---------- */
function heuteNr() {
  const d = new Date();
  return d.getMonth() === 11 && d.getDate() <= 24 ? d.getDate() : null;
}
function tageBisDezember() {
  const d = new Date();
  if (d.getMonth() === 11) return 0;
  const start = new Date(d.getFullYear(), 11, 1);
  return Math.ceil((start - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
}
const erledigtZahl = () => T.filter((t) => state.done[t.nr]).length;
const naechstesOffen = () => (T.find((t) => !state.done[t.nr]) || null);

/* ---------- Bausteine ---------- */
function foto(f, opts = {}) {
  if (!f) return "";
  const cap = f.alt && !opts.ohneText ? `<figcaption>${esc(f.alt)}</figcaption>` : "";
  return `<figure class="foto"><button type="button" data-zoom="${esc(f.src)}" data-cap="${esc(f.alt)}" aria-label="Foto vergrößern${f.alt ? ": " + esc(f.alt) : ""}"><img src="${esc(f.src)}" width="${f.w}" height="${f.h}" alt="${esc(f.alt)}" loading="lazy" decoding="async"></button>${cap}</figure>`;
}
function tuerVerweise(text) {
  const nr = new Set();
  const re = /Türchen\s+(\d+(?:\s*(?:,|und)\s*\d+)*)/g;
  let m;
  while ((m = re.exec(text))) m[1].split(/\s*(?:,|und)\s*/).forEach((z) => { const n = parseInt(z, 10); if (n >= 1 && n <= 24) nr.add(n); });
  return [...nr];
}
function chips(nummern) {
  if (!nummern.length) return "";
  return `<div class="chips">${nummern.map((n) => `<button class="chip" type="button" data-route="tuer/${n}">Türchen ${n}: ${esc(T[n - 1].titel)}</button>`).join("")}</div>`;
}

/* ---------- Ansichten ---------- */
const kranz = (zahl, zeile) => `<div class="kranz-wrap" aria-hidden="true"><img class="kranz" src="assets/deko/kranz.webp" alt="" width="760" height="499"><div class="kranz-zahl"><b>${zahl}</b><span>${zeile}</span></div></div>`;
const girlande = () => `<img class="girlande" src="assets/deko/girlande.webp" alt="" width="900" height="199" aria-hidden="true">`;
function ansichtHeute() {
  const h = heuteNr();
  const weiter = naechstesOffen();
  const zahl = erledigtZahl();
  let oben = "";
  if (h) {
    const t = T[h - 1];
    oben = `<article class="card hero-advent schnee">${kranz(h, "Dezember")}
      <div class="hero-text"><p class="eyebrow">✦ Heute ✦</p><h1>${esc(t.titel)}</h1><p class="lead">${esc(t.imBlick)}</p>
      <button class="button gold" type="button" data-route="tuer/${h}">Türchen ${h} öffnen</button></div></article>`;
  } else if (tageBisDezember() > 0) {
    const tage = tageBisDezember();
    oben = `<article class="card hero-advent schnee">${kranz(tage, tage === 1 ? "Tag bis zum<br>ersten Türchen" : "Tage bis zum<br>ersten Türchen")}
      <div class="hero-text"><h1>Alle 24 Türchen sind schon da</h1><p class="lead">Du kannst am 1. Dezember beginnen oder heute schon das erste Türchen ausprobieren. Ein Türchen darf auch über mehrere Tage gehen.</p>
      <button class="button gold" type="button" data-route="tuer/${weiter ? weiter.nr : 1}">${weiter && weiter.nr > 1 ? `Weiter mit Türchen ${weiter.nr}` : "Türchen 1 ansehen"}</button></div></article>`;
  } else {
    oben = `<article class="card hero-advent schnee">${kranz(24, "Frohe<br>Weihnachten")}
      <div class="hero-text"><h1>Alle Türchen bleiben offen</h1><p class="lead">Schlag jeden Handgriff nach, wann immer du ihn brauchst.</p>
      <button class="button gold" type="button" data-route="tuerchen">Zu den Türchen</button></div></article>`;
  }
  const weiterKarte = weiter && h && weiter.nr !== h && zahl > 0
    ? `<button class="card quick" type="button" data-route="tuer/${weiter.nr}" style="width:100%"><b>Weiter mit Türchen ${weiter.nr}</b><small>${esc(weiter.titel)}</small></button>` : "";
  const fertig = zahl === 24
    ? `<p>Alle 24 Türchen abgehakt. Frohe Weihnachten! <button class="text-button" type="button" data-route="seite/abschluss">Was du mitnimmst</button></p>`
    : `<p>${zahl === 0 ? "Hak ein Türchen ab, wenn du die kleine Übung gestrickt hast." : weiter ? `Als Nächstes: Türchen ${weiter.nr}, ${esc(weiter.titel)}.` : ""}</p>`;
  const z = state.zaehler;
  return `${oben}${weiterKarte}${girlande()}
    ${zahl === 24 ? `<img class="bildkarte" src="assets/deko/stimmung-schleife.webp" alt="Die Strickschleife aus Türchen 24 auf einem Geschenk" width="900" height="600">` : ""}
    <article class="card progress"><div class="ring" style="--p:${Math.round(zahl / 24 * 100)}"><span>${zahl}/24</span></div>
      <div><h2>Dein Fortschritt</h2>${fertig}</div></article>
    <div class="quick-grid">
      <button class="quick" type="button" data-route="zaehler"><b>Zähler</b><small>${z.label ? esc(z.label) + ": " : ""}Reihe ${z.reihen}, ${z.maschen} Maschen</small></button>
      <button class="quick" type="button" data-route="hilfe"><b>Schnelle Hilfe</b><small>Masche zu viel? Kante eng? Hier nachschlagen.</small></button>
    </div>
    <article class="card"><img class="bildkarte" src="assets/deko/stimmung-wolle.webp" alt="Wollknäuel, Holznadeln und Weihnachtsschmuck" width="900" height="600" loading="lazy"><div class="vorab-cover"><img src="assets/book-cover-240.webp" width="84" height="120" alt="Cover Dein Strick-Adventskalender zum Mitstricken">
      <div><p class="eyebrow">Vor dem Start</p><h2>Material und Grundlagen</h2></div></div>
      <div class="link-list" style="margin-top:12px">${vorabLinks()}</div></article>`;
}
function vorabLinks() {
  return [["aufbau", "So ist jedes Türchen aufgebaut"], ["willkommen", "Willkommen"], ["material", "Dein Übungsplatz: Garn, Nadeln, Zubehör"], ["lesen", "So liest du die Anleitungen"], ["proben", "Die kleinen Proben"]]
    .map(([k, label]) => `<button class="list-link" type="button" data-route="seite/${k}" data-close-dialog>${esc(label)}</button>`).join("");
}

function ansichtRaster() {
  const h = heuteNr();
  const kacheln = T.map((t) => {
    const farbe = ["rot", "gruen", "pflaume"][(t.nr * 5 + Math.floor(t.nr / 4)) % 3];
    const cls = ["tuer", farbe, state.opened[t.nr] ? "offen" : "", state.done[t.nr] ? "erledigt" : "", h === t.nr ? "heute" : ""].join(" ");
    const bild = state.opened[t.nr] ? `<img src="${esc(t.fotoErgebnis.src)}" alt="" loading="lazy">` : "";
    const status = state.done[t.nr] ? ", erledigt" : state.opened[t.nr] ? ", geöffnet" : "";
    return `<button class="${cls}" type="button" data-route="tuer/${t.nr}" aria-label="Türchen ${t.nr}: ${esc(t.titel)}${status}">${bild}<span class="zahl">${t.nr}</span></button>`;
  }).join("");
  return `${girlande()}<p class="eyebrow">✦ 24 Türchen ✦</p><h1>Dein Strick-Adventskalender</h1>
    <p class="lead">Jedes Türchen ist ein Handgriff: entdecken, Schritt für Schritt nachstricken, ausprobieren.</p>
    <div class="tuer-grid">${kacheln}</div>
    <div class="legende"><span><span class="pill">Gold</span> geöffnet</span><span><span class="pill green">✓</span> erledigt</span>${h ? "<span>Leuchtend: heute</span>" : ""}</div>`;
}

function ansichtTuer(nr, tab) {
  const t = T[nr - 1];
  if (!t) return ansichtRaster();
  if (!state.opened[nr]) { state.opened[nr] = true; speichern(); }
  tab = tab || state.tab[nr] || "entdecken";
  state.tab[nr] = tab;
  const reiter = [["entdecken", "Entdecken"], ["schritte", "Schritte"], ["probieren", "Ausprobieren"]]
    .map(([k, l]) => `<button type="button" role="tab" aria-selected="${tab === k}" data-tab="${k}" data-tuer="${nr}">${l}</button>`).join("");
  let inhalt = "";
  if (tab === "entdecken") {
    inhalt = `${foto(t.fotoEntdecken)}${absaetze(t.einleitung)}
      <div class="box"><h3>Heute im Blick</h3><p>${esc(t.imBlick)}</p></div>
      <div class="box gruen"><h3>Das liegt bereit</h3>${absaetze(t.bereit)}</div>
      <button class="button primary" type="button" data-tab="schritte" data-tuer="${nr}">Zu den Schritten</button>`;
  } else if (tab === "schritte") {
    const schritt = (s) => `<div class="schritt"><span class="nr">${s.nr}</span><div><h3>${esc(s.titel)}</h3>${absaetze(s.text)}</div></div>`;
    inhalt = `<h2>So geht der Handgriff</h2>${t.schritte.filter((s) => s.nr <= 2).map(schritt).join("")}
      <div class="foto-paar">${t.fotosSchritt.map((f) => foto(f)).join("")}</div>
      <h2>So geht es weiter</h2>${t.schritte.filter((s) => s.nr > 2).map(schritt).join("")}
      <div class="foto-paar">${t.fotosDetail.map((f) => foto(f)).join("")}</div>
      <button class="button primary" type="button" data-tab="probieren" data-tuer="${nr}">Zum Ausprobieren</button>`;
  } else {
    const erledigt = !!state.done[nr];
    inhalt = `<h2>Dein Ergebnis im Blick</h2>${foto(t.fotoErgebnis)}
      <div class="box"><h3>Deine kleine Übung</h3>${absaetze(t.uebung)}</div>
      <div class="box gruen"><h3>Daran erkennst du das Ergebnis</h3>${absaetze(t.erkennen)}</div>
      <h3>Wenn etwas hakt</h3>${t.hakt.map((x) => `<details class="hakt"><summary>${esc(x.problem)}</summary><p>${esc(x.loesung)}</p></details>`).join("")}
      <div class="box"><h3>Für heute</h3>${absaetze(t.fuerHeute)}${chips(tuerVerweise(t.fuerHeute.join(" ")).filter((n) => n !== nr))}</div>
      <article class="card plain erledigt-zeile"><div><h3>${erledigt ? "Erledigt" : "Geschafft?"}</h3><p style="margin:0">${erledigt ? "Dieses Türchen ist abgehakt." : "Hak das Türchen ab, wenn deine Übung auf der Nadel liegt."}</p></div>
        <button class="button ${erledigt ? "secondary" : "done"}" type="button" data-erledigt="${nr}">${erledigt ? "Häkchen entfernen" : "✓ Türchen erledigt"}</button></article>
      <div class="card plain notiz"><h3><label for="notiz-${nr}">Mein Zettel zu diesem Türchen</label></h3>
        <p style="margin:0 0 8px;color:var(--muted);font-size:15px">Ein kleiner Zettel am Stück genügt: Maschenzahl, Muster und zuletzt gearbeitete Reihe.</p>
        <textarea id="notiz-${nr}" data-notiz="${nr}" placeholder="z. B. 12 M, kraus rechts, 4 R, Garnrest grün, Nadel 4,5">${esc(state.notes[nr] || "")}</textarea></div>`;
  }
  const zurueck = nr > 1 ? `<button class="button secondary" type="button" data-route="tuer/${nr - 1}">‹ Türchen ${nr - 1}</button>` : `<span></span>`;
  const vor = nr < 24 ? `<button class="button secondary" type="button" data-route="tuer/${nr + 1}">Türchen ${nr + 1} ›</button>` : `<button class="button secondary" type="button" data-route="seite/abschluss">Abschluss ›</button>`;
  return `<div class="tuer-kopf"><span class="badge-kranz" aria-hidden="true"><img src="assets/deko/kranz.webp" alt="" width="760" height="499"><b>${nr}</b></span><div><p class="eyebrow">Türchen ${nr} · Buch S. ${t.seite}</p><h1>${esc(t.titel)}</h1></div></div>
    <div class="tabs" role="tablist" aria-label="Teile des Türchens">${reiter}</div>
    <section role="tabpanel">${inhalt}</section>
    <div class="blaettern">${zurueck}${vor}</div>`;
}

function ansichtZaehler() {
  const z = state.zaehler;
  const wachOk = "wakeLock" in navigator;
  return `<p class="eyebrow">Zählen · M und R</p><h1>Reihen- und Maschenzähler</h1>
    <p class="lead">Ein Tipp nach jeder Reihe. Beim Reihenzählen zählt die zuletzt gestrickte Reihe auf der Nadel mit, der Anschlag nicht.</p>
    <div class="card"><div class="feld"><label for="z-label">Woran strickst du gerade?</label><input id="z-label" value="${esc(z.label)}" placeholder="z. B. Türchen 15, Perlmuster" maxlength="60"></div></div>
    <article class="card zaehler" aria-labelledby="z-r-h"><h2 id="z-r-h">Reihen</h2><div class="wert" id="z-reihen" aria-live="polite">${z.reihen}</div>
      <div class="knoepfe"><button class="minus" type="button" data-zaehle="reihen" data-schritt="-1" aria-label="Eine Reihe zurück">−</button><button class="plus" type="button" data-zaehle="reihen" data-schritt="1" aria-label="Eine Reihe dazu">+</button></div>
      <button class="text-button klein" type="button" data-null="reihen">Reihen auf 0</button></article>
    <article class="card zaehler" aria-labelledby="z-m-h"><h2 id="z-m-h">Maschen</h2><div class="wert" id="z-maschen" aria-live="polite">${z.maschen}</div>
      <div class="knoepfe"><button class="minus" type="button" data-zaehle="maschen" data-schritt="-1" aria-label="Eine Masche weniger">−</button><button class="plus" type="button" data-zaehle="maschen" data-schritt="1" aria-label="Eine Masche mehr">+</button></div>
      <button class="text-button klein" type="button" data-null="maschen">Maschen auf 0</button></article>
    ${wachOk ? `<label class="card plain schalter"><input type="checkbox" id="z-wach" ${z.wach ? "checked" : ""}> Bildschirm anlassen, solange der Zähler offen ist</label>` : ""}
    <p style="color:var(--muted);font-size:15px">Zählhilfe im Buch: Türchen 5 und 6. ${chips([5, 6])}</p>`;
}

function hilfeEintraege() {
  const liste = [];
  R.hilfe.abschnitte.forEach((a) => liste.push({ quelle: "Schnelle Hilfe", titel: a.h, text: a.p.join(" "), refs: tuerVerweise(a.p.join(" ")) }));
  R.spickzettel.abschnitte.forEach((a) => liste.push({ quelle: "Spickzettel", titel: a.h, text: a.p.join(" "), refs: tuerVerweise(a.p.join(" ")) }));
  T.forEach((t) => t.hakt.forEach((x) => liste.push({ quelle: `Türchen ${t.nr} · Wenn etwas hakt`, titel: x.problem, text: x.loesung, refs: [t.nr] })));
  return liste;
}
const HILFE = hilfeEintraege();
function eintragHtml(e) {
  return `<div class="eintrag"><div class="treffer-quelle">${esc(e.quelle)}</div><h3>${esc(e.titel)}</h3><p>${esc(e.text)}</p>${chips(e.refs)}</div>`;
}
function ansichtHilfe(q = "") {
  return `<p class="eyebrow">Schnelle Hilfe</p><h1>Wo du nachschlagen kannst</h1>
    <div class="suche"><input type="search" id="hilfe-suche" value="${esc(q)}" placeholder="Suchen, z. B. Masche fehlt, Kante, Umschlag" aria-label="Hilfe durchsuchen" autocomplete="off"></div>
    <div id="hilfe-liste">${hilfeListe(q)}</div>`;
}
function hilfeListe(q) {
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const woerter = norm(q).split(/\s+/).filter(Boolean);
  if (!woerter.length) {
    return `<article class="card"><h2>${esc(R.hilfe.titel)}</h2>${HILFE.filter((e) => e.quelle === "Schnelle Hilfe").map(eintragHtml).join("")}</article>
      <article class="card"><h2>${esc(R.spickzettel.titel)}</h2>${HILFE.filter((e) => e.quelle === "Spickzettel").map(eintragHtml).join("")}</article>
      <p class="leer">Dazu findet die Suche alle „Wenn etwas hakt“-Antworten aus den 24 Türchen.</p>`;
  }
  const treffer = HILFE.filter((e) => { const h = norm(e.titel + " " + e.text + " " + e.quelle); return woerter.every((w) => h.includes(w)); });
  const tuerTreffer = T.filter((t) => woerter.every((w) => norm(t.titel).includes(w)));
  return `${tuerTreffer.length ? `<article class="card"><h2>Türchen</h2>${chips(tuerTreffer.map((t) => t.nr))}</article>` : ""}
    <article class="card">${treffer.length ? treffer.map(eintragHtml).join("") : `<p class="leer">Nichts gefunden. Versuch ein einzelnes Wort wie „Masche“, „Rand“ oder „Faden“.</p>`}</article>`;
}

function ansichtSeite(key) {
  const s = R[key];
  if (!s) return ansichtHeute();
  const fotos = (s.fotos || []).map((f) => foto(f)).join("");
  return `<article class="seite"><p class="eyebrow">${esc(s.label)}</p><h1>${esc(s.titel)}</h1>${absaetze(s.einleitung)}
    ${key === "aufbau" ? "" : fotos}
    ${s.abschnitte.map((a) => `<h2>${esc(a.h)}</h2>${absaetze(a.p)}${chips(tuerVerweise(a.p.join(" ")))}`).join("")}
    ${key === "aufbau" ? `<p><button class="button primary" type="button" data-route="tuer/10">Beispiel ansehen: Türchen 10</button></p>` : ""}
    </article>
    <div class="link-list" style="margin-top:18px">${key === "abschluss" ? `<button class="list-link" type="button" data-route="tuerchen">Alle Türchen</button>` : vorabLinks()}</div>`;
}

function ansichtQuellen() {
  return `<article class="seite"><p class="eyebrow">Zum Nachschlagen</p><h1>Quellen und Bildnachweis</h1>
    <p>Die Anleitungen sind eigenständig formuliert. Für grundlegende Techniken und die fachliche Gegenprüfung wurden folgende öffentlich zugängliche Erläuterungen herangezogen (Abruf: September 2026).</p>
    <ul class="quellen">${R.quellen.map((q) => `<li><b>${esc(q.titel)}</b><br><small>${q.links.map(esc).join("<br>")}</small></li>`).join("")}</ul>
    <h2>Bildnachweis</h2><p>Fotografische Abbildungen und Weihnachtsschmuck: KI-generiert für dieses Buch. Die Abbildungen aus den aufgeführten Quellen wurden nicht übernommen.</p></article>`;
}

/* ---------- Router ---------- */
const LABEL = { heute: "Noch eine Masche bis Weihnachten", tuerchen: "Alle 24 Türchen", zaehler: "Reihen- und Maschenzähler", hilfe: "Schnelle Hilfe und Spickzettel", quellen: "Quellen und Bildnachweis" };
let wakeLock = null;
let letzteRoute = "";

function render() {
  const pfad = (location.hash.replace(/^#\/?/, "") || "heute").split("/");
  const route = pfad[0];
  let html, label = LABEL[route] || LABEL.heute, nav = route;
  if (route === "tuer") { const nr = parseInt(pfad[1], 10) || 1; html = ansichtTuer(nr, pfad[2]); label = `Türchen ${nr} von 24`; nav = "tuerchen"; }
  else if (route === "tuerchen") html = ansichtRaster();
  else if (route === "zaehler") html = ansichtZaehler();
  else if (route === "hilfe") html = ansichtHilfe();
  else if (route === "seite") { html = ansichtSeite(pfad[1]); label = "Vor dem Start"; nav = ""; }
  else if (route === "quellen") { html = ansichtQuellen(); nav = ""; }
  else { html = ansichtHeute(); nav = "heute"; }
  app.innerHTML = html;
  document.getElementById("route-label").textContent = label;
  document.querySelectorAll("[data-nav]").forEach((b) => { b.classList.toggle("active", b.dataset.nav === nav); b.toggleAttribute("aria-current", b.dataset.nav === nav); });
  const neu = pfad.slice(0, 2).join("/");
  if (neu !== letzteRoute) { window.scrollTo(0, 0); letzteRoute = neu; }
  document.title = route === "tuer" ? `Türchen ${pfad[1]} – Strick-Begleiter` : "Strick-Begleiter – Begleit-App zum Strick-Adventskalender";
  wachHalten(route === "zaehler" && state.zaehler.wach);
}
function gehe(route) {
  const ziel = "#/" + route;
  if (location.hash === ziel) render(); else location.hash = ziel;
}

/* ---------- Ereignisse ---------- */
document.addEventListener("click", (ev) => {
  const el = ev.target.closest("button, [data-route]");
  if (!el) return;
  if (el.dataset.closeDialog !== undefined) { const d = el.closest("dialog"); if (d) d.close(); }
  if (el.dataset.route) { gehe(el.dataset.route); return; }
  if (el.dataset.tab) {
    const nr = parseInt(el.dataset.tuer, 10);
    state.tab[nr] = el.dataset.tab; speichern();
    app.innerHTML = ansichtTuer(nr, el.dataset.tab);
    // Wer weiter unten war (Knopf „Zu den Schritten“ am Ende), landet wieder direkt unter dem Türchen-Kopf.
    const kopf = app.querySelector(".tuer-kopf");
    const ziel = kopf.offsetTop + kopf.offsetHeight - 70;
    if (window.scrollY > ziel) window.scrollTo({ top: ziel });
    return;
  }
  if (el.dataset.erledigt) {
    const nr = el.dataset.erledigt;
    if (state.done[nr]) delete state.done[nr]; else { state.done[nr] = true; toast(erledigtZahl() === 24 ? "Alle 24 Türchen geschafft!" : `Türchen ${nr} erledigt`); }
    speichern(); app.innerHTML = ansichtTuer(parseInt(nr, 10), "probieren");
    return;
  }
  if (el.dataset.zoom) {
    const lb = document.getElementById("lightbox");
    document.getElementById("lightbox-img").src = el.dataset.zoom;
    document.getElementById("lightbox-img").alt = el.dataset.cap || "";
    document.getElementById("lightbox-cap").textContent = el.dataset.cap || "";
    lb.showModal();
    return;
  }
  if (el.dataset.zaehle) {
    const k = el.dataset.zaehle;
    state.zaehler[k] = Math.max(0, state.zaehler[k] + parseInt(el.dataset.schritt, 10));
    speichern();
    document.getElementById("z-" + k).textContent = state.zaehler[k];
    if (navigator.vibrate) navigator.vibrate(12);
    return;
  }
  if (el.dataset.null) {
    const k = el.dataset.null;
    if (!state.zaehler[k]) return;
    fragen(`${k === "reihen" ? "Reihen" : "Maschen"} auf 0 setzen?`, "Der aktuelle Stand geht verloren.", "Auf 0 setzen", () => { state.zaehler[k] = 0; speichern(); render(); });
  }
});

document.addEventListener("input", (ev) => {
  const el = ev.target;
  if (el.dataset.notiz) { const nr = el.dataset.notiz; if (el.value.trim()) state.notes[nr] = el.value; else delete state.notes[nr]; speichern(); }
  if (el.id === "z-label") { state.zaehler.label = el.value; speichern(); }
  if (el.id === "hilfe-suche") document.getElementById("hilfe-liste").innerHTML = hilfeListe(el.value);
});
document.addEventListener("change", (ev) => {
  if (ev.target.id === "z-wach") { state.zaehler.wach = ev.target.checked; speichern(); wachHalten(ev.target.checked); }
});

async function wachHalten(an) {
  try {
    if (an && "wakeLock" in navigator && document.visibilityState === "visible") { if (!wakeLock) { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", () => { wakeLock = null; }); } }
    else if (wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { wakeLock = null; }
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && location.hash.startsWith("#/zaehler")) wachHalten(state.zaehler.wach); });

/* ---------- Dialoge, Sicherung, Installation ---------- */
function toast(text) {
  const t = document.getElementById("toast");
  t.textContent = text; t.classList.add("zeigen");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("zeigen"), 2400);
}
function fragen(titel, text, ok, wennJa) {
  const d = document.getElementById("confirm-dialog");
  document.getElementById("confirm-heading").textContent = titel;
  document.getElementById("confirm-text").textContent = text;
  document.getElementById("confirm-ok").textContent = ok;
  d.returnValue = "";
  d.addEventListener("close", function zu() { d.removeEventListener("close", zu); if (d.returnValue === "confirm") wennJa(); });
  d.showModal();
}
document.getElementById("mehr-open").addEventListener("click", () => { document.getElementById("vorab-links").innerHTML = vorabLinks(); document.getElementById("mehr-dialog").showModal(); });
document.querySelectorAll("dialog").forEach((d) => d.addEventListener("click", (ev) => { if (ev.target === d) d.close(); }));
document.getElementById("export-button").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ app: KEY, datum: new Date().toISOString(), daten: state }, null, 1)], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `strick-begleiter-sicherung-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});
document.getElementById("import-file").addEventListener("change", async (ev) => {
  const f = ev.target.files[0]; if (!f) return;
  try {
    const j = JSON.parse(await f.text());
    if (j.app !== KEY || !j.daten) throw new Error();
    state = Object.assign(LEER(), j.daten); state.zaehler = Object.assign(LEER().zaehler, j.daten.zaehler || {});
    speichern(); render(); toast("Sicherung eingelesen");
  } catch (e) { toast("Diese Datei ist keine Sicherung des Strick-Begleiters."); }
  ev.target.value = "";
});
document.getElementById("reset-button").addEventListener("click", () => fragen("Lokale Daten löschen?", "Alle Häkchen, Notizen und Zählerstände in diesem Browser werden entfernt.", "Alles löschen", () => {
  state = LEER(); speichern(); document.getElementById("mehr-dialog").close(); gehe("heute"); toast("Lokale Daten gelöscht");
}));
let installEvent = null;
window.addEventListener("beforeinstallprompt", (ev) => { ev.preventDefault(); installEvent = ev; document.getElementById("install-button").hidden = false; });
document.getElementById("install-button").addEventListener("click", async () => { if (!installEvent) return; installEvent.prompt(); await installEvent.userChoice; installEvent = null; document.getElementById("install-button").hidden = true; });

window.addEventListener("hashchange", render);
render();
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
