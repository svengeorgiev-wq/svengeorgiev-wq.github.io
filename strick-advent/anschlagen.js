"use strict";

/* Extra für Anfänger: Maschen anschlagen (Kreuzanschlag). Nicht Teil der 24 Türchen und nicht im Buch.
   Gezeichnete Schritte statt Fotos, damit jede Fadenlage stimmt. Fadenende gold, Knäuelfaden rot. */

(function () {
  const GOLD = "#c39a45", ROT = "#9b1c2c", HAUT = "#f2d6c2", HAUT_R = "#c99c80", HOLZ = "#d2a36a", HOLZ_R = "#9c6f3c", TINTE = "#3f1733";

  const nadel = (x1 = 40, x2 = 320, y = 60) =>
    `<path d="M${x1} ${y - 5} L${x2 - 22} ${y - 5} L${x2} ${y} L${x2 - 22} ${y + 5} L${x1} ${y + 5} Z" fill="${HOLZ}" stroke="${HOLZ_R}" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<circle cx="${x1}" cy="${y}" r="8" fill="${HOLZ_R}"/>`;

  // Eine Masche auf der Nadel: hinterer Bogen, dann Nadel (separat), dann vorderer Bogen.
  const mascheHinten = (x, y = 60, f = GOLD) => `<path d="M${x} ${y + 20} C${x + 11} ${y + 10} ${x + 11} ${y - 14} ${x} ${y - 16}" fill="none" stroke="${f}" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
  const mascheVorn = (x, y = 60, f = GOLD) => `<path d="M${x} ${y - 16} C${x - 11} ${y - 14} ${x - 11} ${y + 10} ${x} ${y + 20}" fill="none" stroke="${f}" stroke-width="5" stroke-linecap="round"/>`;

  const finger = (x1, y1, x2, y2, r) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${HAUT_R}" stroke-width="${2 * r + 3}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${HAUT}" stroke-width="${2 * r}" stroke-linecap="round"/>`;
  const hand = () => `<ellipse cx="185" cy="262" rx="105" ry="52" fill="${HAUT}" stroke="${HAUT_R}" stroke-width="1.5"/>` +
    finger(150, 225, 92, 152, 17) + finger(215, 222, 262, 128, 15);

  const faden = (d, f, extra = "") => `<path d="${d}" fill="none" stroke="${f}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const pfeil = (d, id) => `<path d="${d}" fill="none" stroke="${TINTE}" stroke-width="2.4" stroke-dasharray="6 5" marker-end="url(#spitze-${id})"/>`;
  const marker = (id) => `<defs><marker id="spitze-${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${TINTE}"/></marker></defs>`;
  const text = (x, y, t, anker = "start", farbe = TINTE) => `<text x="${x}" y="${y}" text-anchor="${anker}" fill="${farbe}" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" font-size="13.5" font-weight="700">${t}</text>`;
  const nummer = (x, y, n) => `<circle cx="${x}" cy="${y}" r="12" fill="${TINTE}"/><text x="${x}" y="${y + 5}" text-anchor="middle" fill="#fff" font-family="system-ui, sans-serif" font-size="14" font-weight="800">${n}</text>`;
  const svg = (inhalt, label, h = 290) => `<svg class="anschlag-svg" viewBox="0 0 360 ${h}" role="img" aria-label="${label}">${inhalt}</svg>`;

  // Hand mit Steinschleuder-Fäden; maschen = Anzahl Maschen auf der Nadel (Anfangsschlinge zählt mit)
  function schleuder(maschen, id, zusatz = "", daumenLeer = false) {
    const xs = Array.from({ length: maschen }, (_, i) => 180 - (maschen - 1) * 9 + i * 18);
    const letzte = xs[xs.length - 1];
    let s = marker(id);
    // Fäden hinter der Hand und hinter den Fingern
    s += faden(`M${letzte + 4} 80 C 236 95 252 110 268 122`, ROT);                       // Knäuelfaden zum Zeigefinger
    s += faden(`M272 128 C 282 150 268 200 238 240`, ROT, 'opacity=".55"');              // Knäuelfaden hinter dem Zeigefinger in die Hand
    if (!daumenLeer) s += faden(`M96 190 C 84 178 92 160 106 168 C 120 182 136 214 150 246`, GOLD, 'opacity=".55"'); // Fadenende hinter dem Daumen in die Hand
    xs.forEach((x) => (s += mascheHinten(x)));
    s += nadel();
    xs.forEach((x) => (s += mascheVorn(x)));
    if (maschen > 1) s += faden(`M${xs[0]} 80 ` + xs.slice(1).map((x) => `Q ${x - 9} 90 ${x} 80`).join(" "), GOLD, 'stroke-width="4"');
    s += hand();
    if (daumenLeer) s += faden(`M${letzte - 3} 80 C 120 120 50 160 62 214 C 70 244 110 252 150 250`, GOLD); // Fadenende hängt frei neben dem Daumen
    else s += faden(`M${letzte - 3} 80 C 160 112 140 150 132 166 C 124 180 108 192 96 190`, GOLD); // Fadenende vorn über den Daumen
    s += faden(`M262 116 C 268 112 276 118 272 128`, ROT);                                // Knäuelfaden über dem Zeigefinger
    return s + zusatz;
  }

  const BILDER = {
    abmessen: () => {
      let s = `<rect x="34" y="150" width="292" height="26" rx="4" fill="#f4e6c0" stroke="${GOLD}"/>`;
      for (let i = 0; i <= 10; i++) s += `<line x1="${40 + i * 28}" y1="150" x2="${40 + i * 28}" y2="${i % 5 ? 160 : 166}" stroke="${GOLD}" stroke-width="1.5"/>`;
      s += faden(`M40 128 L 320 128`, GOLD) + faden(`M320 128 C 334 128 340 116 330 100`, ROT);
      s += `<circle cx="318" cy="78" r="28" fill="#e9c9cf" stroke="${ROT}" stroke-width="3"/>` +
        faden(`M296 64 C 312 76 330 82 344 70`, ROT, 'stroke-width="2.5"') + faden(`M294 84 C 314 94 334 96 346 86`, ROT, 'stroke-width="2.5"') + faden(`M300 100 C 316 104 332 104 340 98`, ROT, 'stroke-width="2.5"');
      s += `<circle cx="320" cy="128" r="6" fill="${TINTE}"/>`;
      s += text(40, 118, "Fadenende: ca. 50 cm für 12 Maschen") + text(40, 204, "3 cm pro Masche + 15 cm Reserve");
      s += text(304, 252, "hier kommt die Anfangsschlinge hin", "end") + `<path d="M318 238 L 320 140" stroke="${TINTE}" stroke-width="2" stroke-dasharray="4 4"/>`;
      return svg(s, "Ein langes Fadenende vom Knäuel abmessen, etwa 50 Zentimeter für 12 Maschen", 270);
    },
    schlinge: () => {
      let s = mascheHinten(180, 70, ROT) + nadel(40, 320, 70) + mascheVorn(180, 70, ROT);
      s += `<circle cx="180" cy="96" r="7" fill="${ROT}"/>`;
      s += faden(`M176 100 C 160 140 130 170 112 220`, GOLD) + faden(`M184 100 C 200 140 230 170 250 220`, ROT);
      s += text(98, 244, "Fadenende", "middle", "#8a6a23") + text(258, 244, "zum Knäuel", "middle", ROT) + text(150, 132, "Knoten", "end");
      return svg(s, "Die Anfangsschlinge sitzt auf der Nadel, darunter hängen Fadenende und Knäuelfaden", 260);
    },
    halten: () => svg(schleuder(1, "h", text(22, 128, "Daumen", "start") + text(292, 100, "Zeige-", "start") + text(292, 116, "finger", "start") + text(22, 232, "Fadenende", "start", "#8a6a23") + text(296, 200, "zum", "start", ROT) + text(296, 216, "Knäuel", "start", ROT)),
      "Die linke Hand hält beide Fäden wie eine Steinschleuder: Fadenende um den Daumen, Knäuelfaden über den Zeigefinger"),
    einstechen: () => svg(schleuder(1, "e", pfeil(`M318 64 C 250 120 150 230 112 204 C 100 196 104 180 118 170`, "e") + nummer(70, 236, 1)),
      "Die Nadelspitze geht von unten in die Schlinge am Daumen"),
    holen: () => svg(schleuder(1, "o", pfeil(`M124 166 C 160 104 230 92 258 108`, "o") + pfeil(`M264 126 C 230 156 170 186 126 184`, "o2") + marker("o2") + nummer(196, 98, 2) + nummer(206, 196, 3)),
      "Die Nadel holt den Faden vom Zeigefinger und zieht ihn durch die Daumenschlinge zurück"),
    anziehen: () => svg(schleuder(2, "a", pfeil(`M84 150 C 60 160 52 176 60 192`, "a"), true),
      "Die zweite Masche liegt auf der Nadel, der Daumen zieht sie mit dem Fadenende sanft an"),
    fertig: () => {
      const xs = Array.from({ length: 12 }, (_, i) => 70 + i * 20);
      let s = xs.map((x) => mascheHinten(x)).join("") + nadel(30, 340, 70) + xs.map((x) => mascheVorn(x)).join("");
      s += faden(`M${xs[0]} 90 ` + xs.slice(1).map((x) => `Q ${x - 10} 100 ${x} 90`).join(" "), GOLD, 'stroke-width="4"');
      s += xs.map((x, i) => text(x, 128, String(i + 1), "middle")).join("");
      s += faden(`M${xs[11]} 90 C 300 120 316 150 330 190`, ROT) + faden(`M${xs[0]} 90 C 56 120 52 150 50 178`, GOLD);
      s += text(14, 200, "Fadenende", "start", "#8a6a23") + text(348, 214, "zum Knäuel", "end", ROT) + text(180, 166, "Die Anfangsschlinge zählt mit", "middle");
      return svg(s, "Zwölf Maschen liegen auf der Nadel", 230);
    }
  };

  const SCHRITTE = [
    { titel: "Ein langes Fadenende abmessen", bild: "abmessen", text: ["Zieh vom Knäuel ein langes Fadenende ab, ohne es abzuschneiden. Rechne etwa 3 cm pro Masche und 15 cm Reserve. Für die 12 Maschen im Buch sind das rund 50 cm."] },
    { titel: "Die Anfangsschlinge legen", bild: "schlinge", text: ["Leg an dieser Stelle einen Kreis, das Fadenende liegt oben. Hol den Knäuelfaden von hinten als kleine Schlaufe durch den Kreis. Schieb die Schlaufe auf die Nadel und zieh an beiden Fäden, bis sie anliegt. Sie darf noch auf der Nadel gleiten.", "Diese Schlinge ist schon deine erste Masche."] },
    { titel: "Die linke Hand einrichten", bild: "halten", text: ["Nimm die Nadel in die rechte Hand und halte die Schlinge mit dem Zeigefinger fest. Das Fadenende hängt vorn, der Knäuelfaden hinten.", "Schieb Daumen und Zeigefinger der linken Hand von unten zwischen die beiden Fäden und spreize sie. Das Fadenende liegt jetzt um den Daumen, der Knäuelfaden über dem Zeigefinger. Mit den übrigen Fingern hältst du beide Fäden in der Hand fest. Die Fäden bilden ein V wie eine Steinschleuder."] },
    { titel: "In die Daumenschlinge einstechen", bild: "einstechen", cap: "① Von unten in die Schlinge am Daumen.", text: ["Führ die Nadelspitze von unten in die Schlinge am Daumen, also unter den vorderen Faden am Daumen."] },
    { titel: "Den Faden vom Zeigefinger holen", bild: "holen", cap: "② Faden am Zeigefinger von oben holen. ③ Zurück durch die Daumenschlinge.", text: ["Fahr mit der Spitze über den Faden am Zeigefinger und nimm ihn von oben auf. Zieh ihn durch die Daumenschlinge zurück nach vorn."] },
    { titel: "Die Masche anziehen", bild: "anziehen", cap: "Daumen raus, wieder unter das Fadenende legen und sanft anziehen.", text: ["Lass die Schlinge vom Daumen gleiten. Leg den Daumen wieder unter das Fadenende und zieh die neue Masche damit sanft an. Sie liegt an der Nadel, lässt sich aber noch verschieben.", "Jetzt liegen zwei Maschen auf der Nadel."] },
    { titel: "Wiederholen bis 12 Maschen", bild: "fertig", text: ["Wiederhole Schritt 4 bis 6, bis 12 Maschen auf der Nadel liegen. Die Anfangsschlinge zählt mit. Beim Mitzählen hilft dir der Maschenzähler in der App.", "Das Fadenende kürzt du auf etwa 15 cm. Beim Stricken bleibt es unbenutzt, gestrickt wird mit dem Faden zum Knäuel."] }
  ];

  const HAKT = [
    ["Die Maschen sitzen so fest, dass die Nadel kaum hineinkommt.", "Zieh nach jeder Masche nur so weit an, dass sie anliegt. Hilft das nicht, schlag über zwei zusammengehaltene Nadeln an und zieh die zweite danach heraus."],
    ["Das Fadenende reicht nicht für alle 12 Maschen.", "Zieh die Maschen von der Nadel, zieh den Faden glatt und fang mit einem längeren Fadenende neu an. Beim Anschlag kostet das nur ein paar Minuten."],
    ["Die Maschen rutschen von der Nadel.", "Halt die Maschen mit dem rechten Zeigefinger fest und schieb sie von der Spitze weg zur Mitte der Nadel."],
    ["Ich weiß nicht mehr, welcher Faden welcher ist.", "Folge dem Faden: Einer führt zum Knäuel, der andere hat ein offenes Ende. Das offene Ende gehört immer um den Daumen."]
  ];

  const e = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  window.STRICK_ANSCHLAGEN = {
    hilfe: { quelle: "Extra für Anfänger", titel: "Maschen anschlagen", text: "Noch nie Maschen angeschlagen? Die Extra-Anleitung zeigt den Kreuzanschlag Schritt für Schritt, bis 12 Maschen auf der Nadel liegen. Sie gehört nicht zu den 24 Türchen." },
    ansicht() {
      const schritte = SCHRITTE.map((s, i) => `<div class="schritt"><span class="nr">${i + 1}</span><div><h3>${e(s.titel)}</h3>${s.text.map((p) => `<p>${e(p)}</p>`).join("")}</div></div><figure class="anschlag-bild">${BILDER[s.bild]()}${s.cap ? `<figcaption>${e(s.cap)}</figcaption>` : ""}</figure>`).join("");
      const hakt = HAKT.map(([p, l]) => `<details class="hakt"><summary>${e(p)}</summary><p>${e(l)}</p></details>`).join("");
      return `<div class="extra-band"><span class="pill green">Extra für Anfänger</span><span class="pill">Kein Türchen</span></div>
        <p class="eyebrow">Vor Türchen 1</p><h1>Maschen anschlagen</h1>
        <div class="box gruen extra-hinweis"><h3>Für alle, die noch nie angeschlagen haben</h3>
          <p>Diese Anleitung steht nicht im Buch und gehört nicht zu den 24 Türchen. Sie kommt vorher: Danach liegen 12 Maschen auf deiner Nadel, und du kannst mit Türchen 1 anfangen.</p>
          <p>Du kannst schon anschlagen? Dann überspring diese Seite.</p></div>
        <div class="box"><h3>Das liegt bereit</h3><p>Dein Übungsgarn und eine Stricknadel in 4 bis 5 mm. Für den Anschlag brauchst du nur eine Nadel.</p>
          <p class="farb-legende"><span class="strich gold"></span>Fadenende <span class="strich rot"></span>Faden zum Knäuel <small>Die Farben zeigen nur, welcher Faden welcher ist.</small></p></div>
        <h2>Der Kreuzanschlag in 7 Schritten</h2>${schritte}
        <h3>Wenn etwas hakt</h3>${hakt}
        <article class="card plain extra-weiter"><div><h3>12 Maschen auf der Nadel?</h3><p style="margin:0">Dann beginnt jetzt dein Adventskalender.</p></div>
          <button class="button primary" type="button" data-route="tuer/1">Weiter zu Türchen 1 ›</button></article>`;
    }
  };
})();
