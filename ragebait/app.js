(function () {
  "use strict";
  var F = window.FAELLE, RAENGE = window.RAENGE;
  var URL_APP = "https://tools.munichpublishing.de/ragebait/";
  var $ = function (id) { return document.getElementById(id); };
  var i = 0, punkte = 0, treffer = 0, wahl = 0, beantwortet = false;

  function zeige(id) {
    ["start", "fall", "ende"].forEach(function (s) { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function wert(f) { return f.stufe === "chill" ? 1 : 2; }

  function fall() {
    var f = F[i];
    wahl = 0; beantwortet = false;
    $("stufe").innerHTML = (f.stufe === "chill" ? "CHILL" : "RAGEBAIT") + "<small>" + (wert(f) === 1 ? "1 PUNKT" : "2 PUNKTE") + "</small>";
    $("zaehler").textContent = (i + 1) + "/" + F.length;
    $("fortschritt").style.width = (i / F.length * 100) + "%";
    $("autor").textContent = f.autor;
    $("posttext").textContent = f.post;
    $("hinweis").hidden = false;
    $("feedback").hidden = true;
    var ol = $("kommentare");
    ol.innerHTML = "";
    f.k.forEach(function (kom, j) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<span class="nr"></span><span><span class="user"></span><span class="txt"></span></span>';
      b.querySelector(".nr").textContent = j + 1;
      b.querySelector(".user").textContent = kom[0];
      b.querySelector(".txt").textContent = kom[1];
      b.addEventListener("click", function () { waehle(j + 1); });
      li.appendChild(b); ol.appendChild(li);
    });
    var a = $("aktion");
    a.textContent = "Das ist der Troll";
    a.disabled = true;
  }

  function knoepfe() { return $("kommentare").querySelectorAll("button"); }

  function waehle(n) {
    if (beantwortet) return;
    wahl = n;
    knoepfe().forEach(function (b, j) {
      var an = j + 1 === n;
      b.classList.toggle("sel", an);
      b.setAttribute("aria-pressed", an ? "true" : "false");
    });
    $("aktion").disabled = false;
  }

  function aufloesen() {
    var f = F[i];
    beantwortet = true;
    var richtig = wahl === f.troll;
    if (richtig) { punkte += wert(f); treffer += 1; }
    knoepfe().forEach(function (b, j) {
      b.disabled = true;
      b.classList.remove("sel");
      if (j + 1 === f.troll) b.classList.add("troll");
      else if (j + 1 === wahl) b.classList.add("falsch");
    });
    $("hinweis").hidden = true;
    $("urteil").textContent = richtig ? "Erwischt." : "Reingefallen. Der Troll war Nummer " + f.troll + ".";
    $("erklaerung").textContent = f.l;
    $("feedback").hidden = false;
    $("fortschritt").style.width = ((i + 1) / F.length * 100) + "%";
    var a = $("aktion");
    a.textContent = i + 1 < F.length ? "Nächster Fall" : "Zum Rang";
    a.disabled = false;
    $("feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function rang() {
    for (var k = 0; k < RAENGE.length; k++) if (punkte >= RAENGE[k].ab) return RAENGE[k];
    return RAENGE[RAENGE.length - 1];
  }

  function ende() {
    var r = rang();
    $("rang").textContent = r.name;
    $("rangsatz").textContent = r.satz;
    $("punkte").textContent = punkte;
    $("treffer").textContent = treffer;
    $("geteilt").hidden = true;
    zeige("ende");
  }

  function teilen() {
    var r = rang();
    var text = "Finde den Troll: Ich bin „" + r.name.replace(/\.$/, "") + "“ (" + punkte + " von 15). Schaffst du Peak?";
    if (navigator.share) {
      navigator.share({ title: "Finde den Troll – Ragebait", text: text, url: URL_APP }).catch(function () {});
      return;
    }
    var voll = text + " " + URL_APP;
    var fertig = function () { $("geteilt").hidden = false; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(voll).then(fertig, function () { window.prompt("Zum Kopieren:", voll); });
    } else {
      window.prompt("Zum Kopieren:", voll);
    }
  }

  $("los").addEventListener("click", function () { i = 0; punkte = 0; treffer = 0; fall(); zeige("fall"); });
  $("aktion").addEventListener("click", function () {
    if (!beantwortet) { if (wahl) aufloesen(); return; }
    i += 1;
    if (i < F.length) { fall(); window.scrollTo(0, 0); } else { ende(); }
  });
  $("teilen").addEventListener("click", teilen);
  $("nochmal").addEventListener("click", function () { zeige("start"); });
})();
