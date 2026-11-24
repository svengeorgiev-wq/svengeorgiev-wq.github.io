"use strict";
/* Mein Schal: Begleit-App zu „Stricken für Anfänger: Dein erster Schal in 30 Abenden“.
   Daten in data.js (window.SCHAL) erzeugt export_app_30.py aus den Daten der Türchen-App (strick-schal) und den Buchtexten.
   Nichts von Hand ändern. Abend k beginnt im Buch auf Seite 4k+5, „Am Schal“ steht auf Seite 4k+8. */
(function () {
  const S = window.SCHAL, AB = S.abende, KEY = "strick-anfaenger-v1", N = AB.length;
  const $ = (q) => document.querySelector(q);
  const e = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const app = $("#app");

  // Alle Reihen in Strickreihenfolge, inklusive der halben Reihe 15 an Abend 18
  const R = [];
  AB.forEach((d) => d.rows.forEach((r, i) => R.push(Object.assign({ abend: d.nr, i, of: d.rows.length }, r))));
  const firstOf = (n) => R.findIndex((r) => r.abend === n);
  const lastOf = (n) => { let k = -1; R.forEach((r, i) => { if (r.abend === n) k = i; }); return k; };
  const EXP = {}; AB.forEach((d) => { if (d.exp != null) EXP[d.nr] = d.exp; });
  const page = (n) => 4 * n + 5;         // Eröffnungsseite (mit Rätsel)
  const schalPage = (n) => 4 * n + 8;    // Seite „Am Schal“ mit Strickschrift
  const NACH_REIHEN = 28;                // erster Abend nach der letzten Reihe

  // ---------- Speicher
  const leer = () => ({ pos: 0, done: {}, ends: {}, rid: {}, bow: 0, started: false, tab: {} });
  let st = leer();
  try { const raw = localStorage.getItem(KEY); if (raw) st = Object.assign(st, JSON.parse(raw)); } catch (_) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (_) {} };
  const doneCount = () => Object.keys(st.done).filter((k) => st.done[k]).length;
  const rowsDoneLabel = () => R.slice(0, st.pos).filter((r) => r.id).length;
  const aktuell = () => !st.done[1] ? 1 : st.pos < R.length ? R[st.pos].abend : NACH_REIHEN;

  // ---------- Wake Lock auf der Reihen-Seite
  let lock = null;
  async function wake(on) {
    try {
      if (on && "wakeLock" in navigator && !lock) { lock = await navigator.wakeLock.request("screen"); lock.addEventListener("release", () => (lock = null)); }
      if (!on && lock) { await lock.release(); lock = null; }
    } catch (_) {}
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && location.hash.startsWith("#/reihe")) wake(true); });

  // ---------- Bausteine
  const pct = (a, b) => Math.round((100 * a) / b);
  const bar = (a, b) => `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${b}" aria-valuenow="${a}"><i style="width:${pct(a, b)}%"></i></div>`;
  const photo = (p) => p ? `<figure><button class="zoom" type="button" data-zoom="${e(p.src)}" data-cap="${e(p.cap)}"><img src="${e(p.src)}" alt="${e(p.cap)}" loading="lazy" width="616" height="409"></button><figcaption>${e(p.cap)}</figcaption></figure>` : "";
  const ph = (d, slot) => d.photos.find((p) => p.slot === slot);
  const sideTag = (r) => `<span class="side ${r.rs ? "rs" : "ws"}">${r.rs ? "Hinreihe" : "Rückreihe"}</span>`;
  const hakt = (d) => d.hakt.map(([q, a]) => `<details class="hakt"><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join("");

  // ---------- Ansichten
  function vStart() {
    const cur = R[Math.min(st.pos, R.length - 1)];
    const fertig = st.pos >= R.length;
    const weiter = !st.started
      ? `<button class="button primary wide" type="button" data-go="abend/1">Mit Abend 1 anfangen</button>
         <p class="muted" style="margin-top:10px">Abend 1 ist der Anschlag: 28 Maschen auf die Nadel, mit Fotos und Zeichnungen Schritt für Schritt.</p>`
      : !st.done[1] ? `<button class="button primary wide" type="button" data-go="abend/1">Weiter mit Abend 1: Maschen anschlagen</button>`
      : fertig ? `<button class="button primary wide" type="button" data-go="abend/${NACH_REIHEN}">Weiter mit Abend ${NACH_REIHEN}: Fäden vernähen</button>`
      : `<button class="button primary wide" type="button" data-go="reihe">Weiter stricken: Abend ${cur.abend}, Reihe ${cur.row}</button>`;
    return `<section class="card hero"><img src="icons/icon-192.png" alt="" width="96" height="96" style="border-radius:16px">
        <div><h1>Dein erster Schal</h1><p>30 Abende. Jede Masche nachgerechnet. Die App zählt mit.</p></div></section>
      <section class="card"><p class="eyebrow">Dein Stand</p>
        <div class="big">${rowsDoneLabel()} <span style="font-size:1rem;color:var(--grau)">von ${S.totalRows} Reihen</span></div>${bar(rowsDoneLabel(), S.totalRows)}
        <p class="muted">${doneCount()} von ${N} Abenden erledigt</p>${weiter}</section>
      <section class="card"><h2 style="margin-top:0">Deine ${N} Abende</h2>${grid()}</section>
      <section class="card"><h2 style="margin-top:0">Etwas stimmt nicht?</h2><p>Wähl aus, was du siehst, und du bekommst die passende Antwort.</p><button class="button wide" type="button" data-go="hilfe">Zur Fehlerhilfe</button></section>`;
  }

  function grid() {
    const now = aktuell();
    return `<div class="grid">${AB.map((d) => `<button class="door${st.done[d.nr] ? " done" : ""}${st.started && d.nr === now && !st.done[d.nr] ? " now" : ""}${d.typ === "wdh" ? " wdh" : ""}" type="button" data-go="abend/${d.nr}" aria-label="Abend ${d.nr}${st.done[d.nr] ? ", erledigt" : ""}">${d.nr}</button>`).join("")}</div>`;
  }

  function vAbend(n, tab) {
    const d = AB[n - 1]; if (!d) return vStart();
    tab = tab || st.tab[n] || "kniff";
    const tabs = [["kniff", d.typ === "wdh" ? "Wiederholen" : "Kniff"], ["schal", "Am Schal"], ["raetsel", "Rätsel"]];
    const seg = `<div class="seg" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" aria-selected="${k === tab}" class="${k === tab ? "on" : ""}" data-go="abend/${n}/${k}">${l}</button>`).join("")}</div>`;
    let body = "";
    if (tab === "kniff") body = d.typ === "wdh" ? wiederholen(d) : kniff(d);
    else if (tab === "schal") body = schal(d);
    else body = raetsel(d);
    const nav = `<div class="btnrow">${n > 1 ? `<button class="button ghost" type="button" data-go="abend/${n - 1}">‹ Abend ${n - 1}</button>` : ""}${n < N ? `<button class="button ghost" type="button" data-go="abend/${n + 1}">Abend ${n + 1} ›</button>` : ""}</div>`;
    return `<p class="eyebrow">Abend ${n}${st.done[n] ? ' · <span class="pill ok">erledigt</span>' : ""}</p><h1>${e(d.typ === "wdh" ? d.wtitel : d.kniff)}</h1>
      <p class="ww">${e(d.ww)}</p>${seg}${body}${nav}`;
  }

  function kniff(d) {
    const st4 = d.steps.map(([t, x], i) => {
      const p = [ph(d, "schritt-1"), ph(d, "schritt-2"), ph(d, "detail-1"), ph(d, "detail-2")][i];
      return `<div class="step"><span class="n">${i + 1}</span><div><h3>${e(t)}</h3><p>${e(x)}</p>${photo(p)}${photo(ph(d, `zusatz-${i + 1}`))}</div></div>`;
    }).join("");
    const erg = ph(d, "ergebnis");
    const extra = d.typ === "anschlag" ? `<div class="box gruen"><b>Noch genauer?</b> Die Zeichnungen zeigen jeden Handgriff einzeln, mit Fadenende und Knäuelfaden in zwei Farben.
        <button class="row-link" type="button" data-go="anschlagen" style="margin-top:8px">Kreuzanschlag in Zeichnungen ›</button></div>` : "";
    return `${photo(ph(d, "entdecken"))}<p>${e(d.intro)}</p><div class="blick"><span>Heute im Blick</span>${e(d.blick)}</div>
      <p class="muted">Dauer: ${e(d.min)}</p>${st4}${extra}
      ${erg ? `<h2>So sieht es aus</h2>${photo(erg)}` : ""}
      <h2>Wenn etwas hakt</h2>${hakt(d)}
      <button class="button primary wide" type="button" data-go="abend/${d.nr}/schal" style="margin-top:12px">Weiter: am Schal ${d.typ === "anschlag" ? "anschlagen" : "stricken"}</button>`;
  }

  function wiederholen(d) {
    const pruef = d.pruef.map((x) => `<li>${e(x)}</li>`).join("");
    return `${photo(d.photos[0])}<p>${e(d.intro)}</p><div class="blick"><span>Heute im Blick</span>${e(d.blick)}</div>
      <p class="muted">Dauer: ${e(d.min)} · Heute kein neuer Kniff.</p>
      <div class="step"><span class="n">1</span><div><h3>Kurz wiederholt</h3><p>${e(d.wdh)}</p></div></div>
      <div class="step"><span class="n">2</span><div><h3>Prüfblick nach Reihe 8</h3><ul>${pruef}</ul></div></div>
      <div class="step"><span class="n">3</span><div><h3>Typischer Fehler an dieser Stelle</h3><p>${e(d.fehler)}</p></div></div>
      <div class="step"><span class="n">4</span><div><h3>Was du dann tust</h3><p>${e(d.tun)}</p></div></div>
      <h2>Wenn etwas hakt</h2>${hakt(d)}
      <div class="box"><b>Morgen:</b> ${e(d.morgen)}</div>
      <button class="button primary wide" type="button" data-go="abend/${d.nr}/schal" style="margin-top:12px">Weiter: am Schal stricken</button>`;
  }

  function schal(d) {
    const n = d.nr;
    if (d.typ === "anschlag") {
      return `<h2 style="margin-top:0">${e(d.block)}</h2><p>${e(d.sIntro)}</p><div class="box gruen">${e(d.sVor)}</div>
        <button class="row-link" type="button" data-go="anschlagen">Kreuzanschlag in Zeichnungen ›</button>
        <div class="check"><b>Maschen-Check</b>${e(d.sCheck)}</div>
        <button class="button primary wide" type="button" data-go="check/1">${st.done[1] ? "Erledigt ✓ · noch einmal zählen" : "28 Maschen angeschlagen? Zum Maschen-Check"}</button>
        <p class="muted">${e(d.sAfter)}</p>`;
    }
    if (d.rows.length) {
      const lines = d.lines.map(([l, t]) => `<li><b>${e(l)}</b>${e(t)}</li>`).join("");
      const f = firstOf(n), l = lastOf(n);
      const inAbend = st.pos >= f && st.pos <= l;
      const label = st.done[n] ? "Reihen noch einmal ansehen" : inAbend && st.pos > f ? `Weiter mit Reihe ${R[st.pos].row}` : "Reihe für Reihe starten";
      const anzahl = d.rows.filter((r) => r.id).length + (d.rows.some((r) => r.partial) ? 1 : 0);
      return `<h2 style="margin-top:0">${e(d.block)}</h2><p>${e(d.sIntro)}</p>${d.sVor ? `<div class="box gruen">${e(d.sVor)}</div>` : ""}
        <button class="button primary wide" type="button" data-start="${n}">${label}</button>
        <h3 style="margin-top:18px">Die Anleitung im Überblick · ${anzahl} Reihen${d.von ? ` (${e(d.von)})` : ""}</h3><ul class="lines">${lines}</ul>
        ${d.bindoff ? `<div class="box"><b>Danach:</b> ${e(d.bindoff)}</div>` : ""}
        <div class="check"><b>Maschen-Check</b>${e(d.sCheck)}</div>
        <p class="muted">Die Strickschrift zu diesem Abschnitt steht im Buch auf Seite ${schalPage(n)}.</p>`;
    }
    const doneBtn = `<button class="button primary wide" type="button" data-fertig="${n}">${st.done[n] ? "Erledigt ✓" : "Abend " + n + " erledigt"}</button>`;
    if (d.ends) {
      const ends = d.ends.map((x, i) => `<li><label><input type="checkbox" data-end="${i}" ${st.ends[i] ? "checked" : ""}> ${e(x)}</label></li>`).join("");
      return `<h2 style="margin-top:0">Alle Fäden vernähen</h2><p>${e(d.sIntro)}</p><h3>Diese Enden hängen an deinem Schal</h3><ul class="ends">${ends}</ul>
        <div class="box">Die Enden am Farbstreifen vernähst du jeweils im Abschnitt ihrer eigenen Farbe: Enden von Farbe B im Streifen, Enden von Farbe A in den Nachbarabschnitten.</div>
        <div class="check"><b>Check</b>${e(d.sCheck)}</div>${doneBtn}`;
    }
    if (!d.bow) {
      return `<h2 style="margin-top:0">Den Schal waschen und trocknen</h2><p>${e(d.sIntro)}</p>
        <ul><li>Die Banderole deines Garns entscheidet über Temperatur und Waschweise.</li><li>Für den langen Schal brauchst du eine große Schüssel oder das Waschbecken und zwei Handtücher.</li><li>Leg den Schal zum Trocknen flach aus, notfalls in einer Schlangenlinie.</li><li>Rippen und glatte Abschnitte gleichen sich beim Trocknen etwas an. Zieh sie nicht mit Gewalt auf dieselbe Breite.</li></ul>
        <div class="check"><b>Check</b>${e(d.sCheck)}</div>${doneBtn}`;
    }
    const bow = d.bow.map((x) => `<li>${e(x)}</li>`).join("");
    return `<h2 style="margin-top:0">Schleife und Geschenk</h2><p>${e(d.sIntro)}</p><ol>${bow}</ol>
      <div class="card counter"><div><b>Reihen der Schleife</b><div class="muted">14 Reihen kraus rechts, 14 Maschen</div></div>
        <div class="stepper" style="margin:0"><button type="button" data-bow="-1" aria-label="eine Reihe weniger">−</button><output>${st.bow}</output><button type="button" data-bow="1" aria-label="eine Reihe mehr">+</button></div></div>
      ${st.bow >= 14 ? '<div class="result ok">14 Reihen. Jetzt locker abketten.</div>' : ""}
      <div class="check"><b>Check</b>${e(d.sCheck)}</div>${doneBtn}`;
  }

  function raetsel(d) {
    const r = d.riddle, open = st.rid[d.nr];
    return `<h2 style="margin-top:0">${e(r.title)}</h2><p>Das Rätsel steht im Buch auf Seite ${page(d.nr)}. Hier bekommst du einen Tipp, wenn du festhängst.</p>
      <details class="hakt"><summary>Tipp zeigen</summary><p>${e(r.hint)}</p></details>
      ${open ? `<div class="box gruen"><b>Lösung:</b> ${e(r.sol)}${r.trap ? `<p class="muted" style="margin:.6em 0 0">${e(r.trap)}</p>` : ""}</div>`
        : `<button class="button wide" type="button" data-loesung="${d.nr}">Lösung zeigen</button>`}
      <p class="muted" style="margin-top:12px">Alle Lösungen stehen auch hinten im Buch.</p>`;
  }

  function vReihe() {
    if (st.pos >= R.length) return `<h1>Alle ${S.totalRows} Reihen gestrickt.</h1><p>Der Schal ist abgekettet. Jetzt kommen Vernähen, Waschen und die Schleife.</p><button class="button primary wide" type="button" data-go="abend/${NACH_REIHEN}">Weiter mit Abend ${NACH_REIHEN}</button>`;
    const r = R[st.pos], d = AB[r.abend - 1];
    const after = r.partial ? "Danach: 27 Maschen auf der Nadel, 1 Schlinge im Markierer." : `Danach liegen <b>${r.after} Maschen</b> auf der Nadel.`;
    return `<div class="navi">
      <div class="meta"><button class="button ghost" type="button" data-go="abend/${r.abend}" style="padding:6px 12px">Abend ${r.abend} · ${e(d.block)}</button>${sideTag(r)}</div>
      <div class="rowno">Reihe <strong>${r.row}</strong>${r.partial ? " (nur bis zur Mitte)" : ""} <span class="muted">· ${r.i + 1} von ${r.of} heute</span></div>
      <div class="instr">${e(r.text)}</div>
      <p class="after">${after}</p>
      <button class="next" type="button" id="next">${r.i + 1 === r.of ? "Reihe fertig · zum Maschen-Check" : "Reihe fertig ✓"}</button>
      <div class="small"><button class="button ghost" type="button" id="prev" ${st.pos === 0 ? "disabled" : ""}>‹ Eine Reihe zurück</button><button class="button ghost" type="button" data-go="hilfe">Hilfe</button></div>
      <p class="muted" style="margin-top:14px">Gesamt: Reihe ${rowsDoneLabel() + (r.id ? 1 : 0)} von ${S.totalRows}</p>${bar(rowsDoneLabel(), S.totalRows)}
    </div>`;
  }

  let zahl = null;
  function vCheck(n) {
    const d = AB[n - 1]; if (!d || EXP[n] == null) return vStart();
    const exp = EXP[n];
    const naechste = AB[n] && AB[n].rows.length;
    let res = "";
    if (zahl !== null && zahl === exp) {
      res = `<div class="result ok"><b>Stimmt.</b> ${exp} Maschen. Abend ${n} ist fertig.</div>${d.sAfter ? `<p>${e(d.sAfter)}</p>` : ""}
        ${d.bindoff ? `<div class="box"><b>Jetzt abketten:</b> ${e(d.bindoff)}</div>` : ""}
        <div class="btnrow">${n < N ? `<button class="button primary" type="button" data-go="abend/${n + 1}">Abend ${n + 1} öffnen</button>` : ""}${naechste ? `<button class="button" type="button" data-go="reihe">Direkt weiterstricken</button>` : ""}</div>`;
    } else if (zahl !== null) {
      const h = S.help.find((x) => x.id === (zahl > exp ? "zuviel" : "zuwenig"));
      res = `<div class="result bad"><b>${zahl} statt ${exp}.</b> ${zahl > exp ? "Das ist " + (zahl - exp) + " zu viel." : (exp - zahl === 1 ? "Da fehlt eine Masche" : "Da fehlen " + (exp - zahl) + " Maschen") + "."}</div>
        ${n === 1 ? `<p>Beim Anschlag ist das schnell behoben: ${zahl > exp ? "Lass die überzähligen Maschen von der Nadel gleiten und zieh den Faden sanft nach." : "Schlag die fehlenden Maschen einfach dazu."}</p>`
          : `<h3>${e(h.s)}</h3><p>${e(h.a)}</p>${h.doors.map((t) => `<button class="row-link" type="button" data-go="abend/${t}">Kniff von Abend ${t}: ${e(AB[t - 1].kniff)} ›</button>`).join("")}`}
        <div class="btnrow"><button class="button" type="button" id="recount">Noch einmal zählen</button>${n > 1 ? '<button class="button ghost" type="button" id="back1">Zurück zur letzten Reihe</button>' : ""}</div>
        <button class="button ghost wide" type="button" id="force" style="margin-top:10px">Ich habe es gelöst, weiter</button>`;
    }
    const start = zahl === null ? exp - 4 : zahl;
    return `<p class="eyebrow">Abend ${n} · Maschen-Check</p><h1>Zähl nach</h1>
      <p>Wie viele Maschen liegen jetzt auf der Nadel? Zähl in Vierergruppen, das geht schneller.</p>
      <div class="check"><b>So soll es sein</b>${e(d.sCheck)}</div>
      ${zahl === null || zahl !== exp ? `<div class="stepper"><button type="button" data-z="-1" aria-label="eine Masche weniger">−</button><output id="z">${start}</output><button type="button" data-z="1" aria-label="eine Masche mehr">+</button></div>
      <button class="button primary wide" type="button" id="pruefen">Prüfen</button>` : ""}${res}`;
  }

  function vAbende() { return `<h1>Deine ${N} Abende</h1><p class="muted">Kniff, Schal und Rätsel für jeden Abend. Du kannst jeden Abend jederzeit öffnen. Hell umrandet: Abende zum Wiederholen und Prüfen.</p>${grid()}`; }

  function vHilfe() {
    return `<h1>Fehlerhilfe</h1><p>Was siehst du gerade?</p>${S.help.map((h) => `<details class="hakt helpitem"><summary>${e(h.s)}</summary><p>${e(h.a)}</p>${h.doors.map((t) => `<button class="row-link" type="button" data-go="abend/${t}">Abend ${t}: ${e(AB[t - 1].kniff)} ›</button>`).join("")}</details>`).join("")}
      <p class="muted" style="margin-top:14px">Die Schnelle Hilfe steht auch hinten im Buch auf Seite 135.</p>`;
  }

  function vStand() {
    const opts = AB.filter((d) => d.rows.length).map((d) => `<option value="${d.nr}">Abend ${d.nr} · ${e(d.block)}</option>`).join("");
    return `<h1>Reihe von Hand einstellen</h1><p>Du hast ohne App weitergestrickt? Stell hier ein, welche Reihe als Nächstes dran ist.</p>
      <label class="box" style="display:block">Abend<br><select id="sd" style="width:100%;font-size:1.05rem;padding:10px;margin-top:6px">${opts}</select></label>
      <label class="box" style="display:block">Nächste Reihe<br><select id="sr" style="width:100%;font-size:1.05rem;padding:10px;margin-top:6px"></select></label>
      <button class="button primary wide" type="button" id="setpos">Übernehmen</button>`;
  }

  function vInstall() {
    return `<h1>Auf den Startbildschirm legen</h1><div class="box"><h3>iPhone</h3><p>In Safari öffnen, auf das Teilen-Symbol tippen, dann „Zum Home-Bildschirm“.</p></div>
      <div class="box"><h3>Android</h3><p>In Chrome öffnen, oben rechts die drei Punkte, dann „Zum Startbildschirm hinzufügen“.</p></div>
      <p class="muted">Die App läuft danach wie eine normale App und funktioniert auch ohne Netz, sobald du sie einmal geöffnet hast.</p>`;
  }

  function vInfo() {
    return `<h1>Über die App</h1><p>Die kostenlose Begleit-App zu „Stricken für Anfänger: Dein erster Schal in 30 Abenden“ von Munich Publishing. Alle Reihen, Maschenzahlen und Checks stammen aus dem Buch und sind Masche für Masche nachgerechnet.</p>
      <h2>Datenschutz</h2><p>Ohne Account, keine E-Mail, keine Cloud. Dein Stand bleibt in diesem Browser auf deinem Gerät.</p>
      <h2>Bildnachweis</h2><p>Fotografische Abbildungen: KI-generiert für dieses Buch.</p>
      <p>Fragen zum Buch oder zur App: <a href="mailto:info@munichpublishing.de">info@munichpublishing.de</a></p>
      <p><a href="https://munichpublishing.de/impressum" target="_blank" rel="noopener">Impressum</a> · <a href="https://munichpublishing.de/Datenschutz" target="_blank" rel="noopener">Datenschutz</a></p>`;
  }

  // ---------- Router
  const SUB = { start: "Begleit-App zum Buch", reihe: "Reihe für Reihe", abende: `Alle ${N} Abende`, hilfe: "Fehlerhilfe", abend: "Kniff, Schal und Rätsel", check: "Maschen-Check" };
  const TITEL = "Mein Schal – App zu Stricken für Anfänger";
  function render() {
    const p = location.hash.replace(/^#\/?/, "").split("/");
    const r = p[0] || "start";
    let h;
    if (r === "reihe") h = vReihe();
    else if (r === "abend") { const n = +p[1]; if (p[2]) { st.tab[n] = p[2]; save(); } h = vAbend(n, p[2]); }
    else if (r === "check") h = vCheck(+p[1]);
    else if (r === "abende") h = vAbende();
    else if (r === "hilfe") h = vHilfe();
    else if (r === "anschlagen" && window.STRICK_ANSCHLAGEN) h = window.STRICK_ANSCHLAGEN.ansicht().replace(/data-route=/g, "data-go=");
    else if (r === "stand") h = vStand();
    else if (r === "installieren") h = vInstall();
    else if (r === "info") h = vInfo();
    else h = vStart();
    app.innerHTML = h;
    $("#sub").textContent = SUB[r] || SUB.start;
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.nav === (r === "abend" || r === "check" ? "abende" : r)));
    wake(r === "reihe");
    if (r === "stand") fillStand();
    document.title = r === "abend" ? `Abend ${p[1]} – Mein Schal` : TITEL;
  }
  function go(h) { if (("#/" + h) === location.hash || (h === "" && !location.hash)) render(); else location.hash = "/" + h; window.scrollTo(0, 0); }
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });

  function fillStand() {
    const sd = $("#sd"), sr = $("#sr");
    const cur = R[Math.min(st.pos, R.length - 1)];
    sd.value = String(cur.abend);
    const fill = () => { const n = +sd.value; sr.innerHTML = R.map((r, i) => r.abend === n ? `<option value="${i}">Reihe ${r.row}${r.partial ? " (halbe Reihe)" : ""}</option>` : "").join(""); if (cur.abend === n) sr.value = String(st.pos); };
    sd.addEventListener("change", fill); fill();
  }

  // ---------- Klicks
  document.addEventListener("click", (ev) => {
    const t = ev.target.closest("button, a"); if (!t) return;
    if (t.hasAttribute("data-close")) { const dlg = t.closest("dialog"); if (dlg) dlg.close(); }
    if (t.dataset.go !== undefined) { if (t.dataset.go.startsWith("abend/1") || t.dataset.go === "anschlagen") { st.started = true; save(); } go(t.dataset.go); return; }
    if (t.dataset.zoom) { const lb = $("#lightbox"); lb.querySelector("img").src = t.dataset.zoom; lb.querySelector("figcaption").textContent = t.dataset.cap; lb.showModal(); return; }
    if (t.dataset.start) { const n = +t.dataset.start, f = firstOf(n), l = lastOf(n); if (!(st.pos >= f && st.pos <= l) || st.done[n]) st.pos = f; st.started = true; save(); go("reihe"); return; }
    if (t.dataset.loesung) { st.rid[t.dataset.loesung] = true; save(); render(); return; }
    if (t.dataset.fertig) { const n = +t.dataset.fertig; st.done[n] = !st.done[n]; save(); render(); return; }
    if (t.dataset.bow) { st.bow = Math.max(0, Math.min(14, st.bow + +t.dataset.bow)); save(); render(); return; }
    if (t.dataset.z) { const o = $("#z"); o.textContent = Math.max(0, +o.textContent + +t.dataset.z); return; }
    switch (t.id) {
      case "next": {
        const r = R[st.pos]; st.started = true;
        if (r.i + 1 === r.of) { st.pos += 1; save(); zahl = null; go("check/" + r.abend); }
        else { st.pos += 1; save(); render(); }
        if (navigator.vibrate) navigator.vibrate(15);
        break;
      }
      case "prev": if (st.pos > 0) { st.pos -= 1; save(); render(); } break;
      case "pruefen": { zahl = +$("#z").textContent; const n = +location.hash.split("/")[2]; if (zahl === EXP[n]) { st.done[n] = true; st.started = true; save(); } render(); break; }
      case "recount": zahl = null; render(); break;
      case "back1": zahl = null; st.pos = Math.max(0, st.pos - 1); save(); go("reihe"); break;
      case "force": { const n = +location.hash.split("/")[2]; st.done[n] = true; st.started = true; save(); zahl = EXP[n]; render(); break; }
      case "setpos": st.pos = +$("#sr").value; st.started = true; st.done[1] = true; save(); go("reihe"); break;
      case "menu-open": $("#menu").showModal(); break;
      case "reset": if (confirm("Wirklich alles zurücksetzen? Dein Stand und alle Häkchen werden gelöscht.")) { st = leer(); save(); $("#menu").close(); go(""); } break;
    }
  });
  document.addEventListener("change", (ev) => { const c = ev.target; if (c.dataset && c.dataset.end !== undefined) { st.ends[c.dataset.end] = c.checked; save(); } });
  // Zahl im Check zurücksetzen, wenn ein anderer Check geöffnet wird
  window.addEventListener("hashchange", () => { if (!location.hash.startsWith("#/check/")) zahl = null; });

  render();
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
