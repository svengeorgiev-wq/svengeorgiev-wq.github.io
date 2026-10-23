(function (global) {
  "use strict";

  const PUZZLES = Object.freeze([
    {
      id: "NACHTZUG-01",
      title: "Das Telegramm im Nachtzug",
      primaryMechanism: "Reihenfolgen und Platzierungen",
      endAnswerType: "Gegenstand / Objekt",
      intro: "Der Winter hatte London in eine starre, graue Stille gelegt, als uns ein Bote zum letzten Nachtzug nach Dover rief. Eine versiegelte Depeschenkassette war zwischen Baker Street und Waterloo Station verschwunden. Vier Boten hatten den Bahnsteig nacheinander betreten, vier Telegramme lagen beim Stationsvorsteher, und auf dem Gepäckwagen warteten vier Schlüssel. Holmes betrachtete weder den Schnee noch die hastig versammelten Zeugen. Ihn interessierte allein die Reihenfolge. Jede spätere Spur, erklärte er, sei nur dann brauchbar, wenn die vorherige zweifelsfrei feststehe.",
      introduction: "Unter der Gaslaterne am Bahnsteig notierte Watson jede Aussage in der Reihenfolge ihres Eingangs. Die verschwundene Kassette kann nur gefunden werden, wenn Ankunftsfolge, Telegramm, Schlüssel und Kassettenplatz nacheinander eindeutig bestimmt werden.",
      levels: [
        {
          number: 1,
          title: "Die Ankunftsfolge",
          paragraphs: [
            "Adler, Bell, Clarke und Doyle trafen nacheinander am Bahnsteig ein. Jede Person belegte genau einen der vier Ankunftsplätze.",
            "Clarke traf unmittelbar nach Bell ein. Adler traf vor Bell ein. Doyle traf nach Clarke ein."
          ],
          question: "● IN WELCHER REIHENFOLGE TRAFEN ADLER, BELL, CLARKE UND DOYLE EIN? ●",
          choices: [
            { value: "ABCD", label: "Adler – Bell – Clarke – Doyle" },
            { value: "ADBC", label: "Adler – Doyle – Bell – Clarke" },
            { value: "BCAD", label: "Bell – Clarke – Adler – Doyle" },
            { value: "DABC", label: "Doyle – Adler – Bell – Clarke" }
          ],
          correct: "ABCD",
          answer: "Adler – Bell – Clarke – Doyle",
          retry: "Diese Antwort widerspricht mindestens einer Angabe. Prüfe die Reihenfolge erneut."
        },
        {
          number: 2,
          title: "Das authentische Telegramm",
          paragraphs: ["Authentisch ist genau das Telegramm, dessen beide Aussagen mit der in Ebene 1 ermittelten Ankunftsfolge übereinstimmen. Sobald eine Aussage falsch ist, scheidet das Telegramm aus."],
          evidence: [
            "Telegramm I – Bell kam unmittelbar vor Clarke. Adler kam zuletzt.",
            "Telegramm II – Doyle kam zuletzt. Adler kam zuerst.",
            "Telegramm III – Clarke kam als Zweiter. Bell kam vor Adler.",
            "Telegramm IV – Bell kam zuerst. Doyle kam nach Adler."
          ],
          question: "● WELCHES TELEGRAMM IST AUTHENTISCH? ●",
          choices: [
            { value: "I", label: "Telegramm I" }, { value: "II", label: "Telegramm II" },
            { value: "III", label: "Telegramm III" }, { value: "IV", label: "Telegramm IV" }
          ],
          correct: "II",
          answer: "Telegramm II",
          retry: "Mindestens eine Aussage des gewählten Telegramms ist falsch. Gleiche beide Sätze mit Ebene 1 ab."
        },
        {
          number: 3,
          title: "Die vier Schlüssel",
          paragraphs: [
            "Auf dem Gepäckwagen lagen von links nach rechts vier Schlüssel: Messing, Silber, Eisen und Bein. Jeder Schlüssel belegte genau eine Position.",
            "Der Eisenschlüssel lag unmittelbar rechts vom Silberschlüssel. Der Messingschlüssel lag links vom Silberschlüssel. Der Beinschlüssel lag rechts vom Eisenschlüssel.",
            "Gesucht ist der Schlüssel an der Position, deren Nummer dem authentischen Telegramm aus Ebene 2 entspricht."
          ],
          question: "● WELCHER SCHLÜSSEL LIEGT AN DER GESUCHTEN POSITION? ●",
          choices: [
            { value: "messing", label: "Messingschlüssel" }, { value: "silber", label: "Silberschlüssel" },
            { value: "eisen", label: "Eisenschlüssel" }, { value: "bein", label: "Beinschlüssel" }
          ],
          correct: "silber",
          answer: "Der Silberschlüssel",
          retry: "Ordne zuerst alle vier Schlüssel und nutze dann die römische Nummer aus Ebene 2."
        },
        {
          number: 4,
          title: "Die Depeschenkassetten",
          paragraphs: [
            "Von links nach rechts standen vier Depeschenkassetten: rot, schwarz, grün und blau. Schwarz stand unmittelbar links von Grün. Blau stand rechts von Grün. Schwarz stand nicht an erster Stelle.",
            "Messing verlangte die erste Kassette. Silber verlangte die Kassette unmittelbar rechts von Schwarz. Eisen verlangte die letzte Kassette. Bein verlangte die schwarze Kassette.",
            "Nur die Anweisung des in Ebene 3 bestimmten Schlüssels darf ausgeführt werden."
          ],
          question: "● WELCHE DEPESCHENKASSETTE MUSS HOLMES ÖFFNEN? ●",
          choices: [
            { value: "rot", label: "Die rote Depeschenkassette" }, { value: "schwarz", label: "Die schwarze Depeschenkassette" },
            { value: "gruen", label: "Die grüne Depeschenkassette" }, { value: "blau", label: "Die blaue Depeschenkassette" }
          ],
          correct: "gruen",
          answer: "Die grüne Depeschenkassette",
          retry: "Prüfe die einzige mögliche Kassettenfolge und führe nur die Anweisung des Schlüssels aus Ebene 3 aus."
        }
      ],
      solutionSteps: [
        { title: "Antwort Ebene 1", answer: "Adler – Bell – Clarke – Doyle", explanation: "Bell und Clarke bilden einen festen Block. Adler muss davor, Doyle danach stehen. Damit bleibt genau diese Folge." },
        { title: "Antwort Ebene 2", answer: "Telegramm II", explanation: "Nur Telegramm II nennt Doyle korrekt als Letzten und Adler korrekt als Ersten." },
        { title: "Antwort Ebene 3", answer: "Der Silberschlüssel", explanation: "Nur Messing – Silber – Eisen – Bein erfüllt alle Lagebedingungen. Telegramm II verweist auf Position 2." },
        { title: "Antwort Ebene 4 / Endantwort", answer: "Die grüne Depeschenkassette", explanation: "Die eindeutige Folge lautet Rot – Schwarz – Grün – Blau. Silber verlangt die Kassette unmittelbar rechts von Schwarz." }
      ],
      bridge: "Holmes schloss die grüne Kassette und legte den Silberschlüssel daneben. Die nächste Spur würde wieder dort beginnen, wo eine überprüfte Reihenfolge keinen Zufall mehr zuließ.",
      outro: "In der Kassette lag die verschwundene Depesche, trocken und unversehrt. Entscheidend waren allein vier sauber verbundene Schlüsse gewesen. Wer zu früh zum letzten Schritt springe, ersetze Deduktion durch Vermutung.",
      checkNote: "Logikprüfung bestanden: jede Ebene besitzt genau eine Lösung und führt zwingend zur grünen Depeschenkassette."
    },
    {
      id: "SPIEGEL-02",
      title: "Der Schatten hinter dem Spiegel",
      primaryMechanism: "Zuordnung und Ausschluss",
      endAnswerType: "Versteck / Ort",
      intro: "Kurz vor Mitternacht verschwand im Stadthaus von Lord Wexford ein belastender Brief. Vier Gäste waren in vier verschiedenen Räumen gesehen worden, doch jeder schilderte seinen Weg anders. Im Musiksaal verstummte noch eine Saite, im Wintergarten schmolz Schnee auf den Fliesen, und im Arbeitszimmer stand eine Schublade offen. Holmes hielt es für voreilig, nach dem Brief zu suchen. Zuerst müsse feststehen, wer sich wo aufgehalten habe.",
      introduction: "Ordne zunächst Ashcombe, Bell, Carrow und Dacre ihren Räumen zu. Die eindeutige Zuordnung führt zu einer Zeugennotiz, einem Bilderrahmen und zuletzt zum Versteck des Briefes.",
      levels: [
        {
          number: 1,
          title: "Vier Gäste, vier Räume",
          paragraphs: [
            "Ashcombe, Bell, Carrow und Dacre hielten sich jeweils in genau einem Raum auf: Bibliothek, Musiksalon, Wintergarten oder Arbeitszimmer.",
            "Bell war im Musiksalon. Dacre war weder in der Bibliothek noch im Wintergarten. Carrow war nicht im Arbeitszimmer. Ashcombe war nicht in der Bibliothek."
          ],
          question: "● WELCHE VOLLSTÄNDIGE ZUORDNUNG IST MÖGLICH? ●",
          choices: [
            { value: "AW-BM-CB-DA", label: "Ashcombe: Wintergarten · Bell: Musiksalon · Carrow: Bibliothek · Dacre: Arbeitszimmer" },
            { value: "AB-BM-CW-DA", label: "Ashcombe: Bibliothek · Bell: Musiksalon · Carrow: Wintergarten · Dacre: Arbeitszimmer" },
            { value: "AW-BB-CM-DA", label: "Ashcombe: Wintergarten · Bell: Bibliothek · Carrow: Musiksalon · Dacre: Arbeitszimmer" },
            { value: "AA-BM-CB-DW", label: "Ashcombe: Arbeitszimmer · Bell: Musiksalon · Carrow: Bibliothek · Dacre: Wintergarten" }
          ],
          correct: "AW-BM-CB-DA",
          answer: "Ashcombe im Wintergarten, Bell im Musiksalon, Carrow in der Bibliothek, Dacre im Arbeitszimmer",
          retry: "Beachte, dass jeder Raum genau einmal vergeben wird. Dacres Ausschlüsse werden erst zusammen mit Bells festem Raum zwingend."
        },
        {
          number: 2,
          title: "Die verlässliche Zeugennotiz",
          paragraphs: ["Verlässlich ist nur die Notiz, in der beide Raumangaben mit der Zuordnung aus Ebene 1 übereinstimmen."],
          evidence: [
            "Notiz I – Bell war in der Bibliothek. Dacre war im Arbeitszimmer.",
            "Notiz II – Ashcombe war im Wintergarten. Carrow war im Arbeitszimmer.",
            "Notiz III – Carrow war in der Bibliothek. Bell war im Musiksalon.",
            "Notiz IV – Dacre war im Wintergarten. Ashcombe war in der Bibliothek."
          ],
          question: "● WELCHE ZEUGENNOTIZ IST VOLLSTÄNDIG VERLÄSSLICH? ●",
          choices: [
            { value: "I", label: "Notiz I" }, { value: "II", label: "Notiz II" },
            { value: "III", label: "Notiz III" }, { value: "IV", label: "Notiz IV" }
          ],
          correct: "III",
          answer: "Notiz III",
          retry: "Eine richtige Einzelangabe genügt nicht. In der gesuchten Notiz müssen beide Raumangaben stimmen."
        },
        {
          number: 3,
          title: "Die vier Bilderrahmen",
          paragraphs: [
            "An der Galeriewand hingen von links nach rechts vier Bilder in Rahmen aus Eiche, Mahagoni, Nussbaum und Ebenholz.",
            "Mahagoni hing unmittelbar links von Nussbaum. Eiche hing links von Mahagoni. Ebenholz hing rechts von Nussbaum.",
            "Die römische Nummer der verlässlichen Notiz bezeichnet die Position des gesuchten Rahmens."
          ],
          question: "● AUS WELCHEM HOLZ BESTEHT DER GESUCHTE RAHMEN? ●",
          choices: [
            { value: "eiche", label: "Eiche" }, { value: "mahagoni", label: "Mahagoni" },
            { value: "nussbaum", label: "Nussbaum" }, { value: "ebenholz", label: "Ebenholz" }
          ],
          correct: "nussbaum",
          answer: "Der Nussbaumrahmen",
          retry: "Bilde zuerst die vollständige Rahmenfolge und übertrage dann die Nummer aus Ebene 2 auf die Position."
        },
        {
          number: 4,
          title: "Das verborgene Fach",
          paragraphs: [
            "Im Salon lagen vier mögliche Verstecke in fester Reihenfolge: Schreibpult, Standuhr, Spiegel und Kamin. Die Standuhr befand sich unmittelbar links vom Spiegel. Der Kamin lag rechts vom Spiegel. Die Standuhr stand nicht an erster Stelle.",
            "Eiche – erstes Versteck; Mahagoni – letztes Versteck; Nussbaum – Versteck unmittelbar rechts von der Standuhr; Ebenholz – Standuhr.",
            "Nur die Anweisung des in Ebene 3 bestimmten Rahmens ist gültig."
          ],
          question: "● WO HAT LORD WEXFORD DEN BRIEF VERSTECKT? ●",
          choices: [
            { value: "schreibpult", label: "Im Schreibpult" }, { value: "standuhr", label: "In der Standuhr" },
            { value: "spiegel", label: "Hinter dem Spiegel" }, { value: "kamin", label: "Im Kamin" }
          ],
          correct: "spiegel",
          answer: "Hinter dem Spiegel",
          retry: "Ordne die vier Verstecke vollständig und befolge ausschließlich die Anweisung des Nussbaumrahmens."
        }
      ],
      solutionSteps: [
        { title: "Antwort Ebene 1", answer: "Ashcombe: Wintergarten · Bell: Musiksalon · Carrow: Bibliothek · Dacre: Arbeitszimmer", explanation: "Bell besetzt den Musiksalon. Dacre kann damit nur im Arbeitszimmer sein. Für Ashcombe und Carrow bleiben Bibliothek und Wintergarten; Ashcombes Ausschluss legt den Rest fest." },
        { title: "Antwort Ebene 2", answer: "Notiz III", explanation: "Nur Notiz III nennt Carrow korrekt in der Bibliothek und Bell korrekt im Musiksalon." },
        { title: "Antwort Ebene 3", answer: "Der Nussbaumrahmen", explanation: "Die einzige Rahmenfolge lautet Eiche – Mahagoni – Nussbaum – Ebenholz. Notiz III verweist auf Position 3." },
        { title: "Antwort Ebene 4 / Endantwort", answer: "Hinter dem Spiegel", explanation: "Die Verstecke liegen als Schreibpult – Standuhr – Spiegel – Kamin. Nussbaum führt unmittelbar rechts von der Standuhr zum Spiegel." }
      ],
      bridge: "Holmes zog den Brief aus der schmalen Fuge hinter dem Spiegel und legte ihn ungelesen auf das Schreibpult.",
      outro: "Kein geheimer Mechanismus hatte den Brief geschützt. Das Versteck war durch vier gewöhnliche Beobachtungen preisgegeben worden, die erst in der richtigen Reihenfolge ihre Wirkung entfalteten.",
      checkNote: "Logikprüfung bestanden: Raumzuordnung, Notiz, Rahmen und Versteck sind jeweils eindeutig bestimmt."
    },
    {
      id: "GLOCKE-03",
      title: "Die stumme Glocke von St. Bride",
      primaryMechanism: "Wahrheit, Lüge und Caesar-Code",
      endAnswerType: "Symbol / Siegel",
      intro: "Während des Abendgebets verstummte die Glocke von St. Bride. Ihr eiserner Klöppel war entfernt worden, und im Turmzimmer fehlte das Siegel einer alten Stiftung. Vier Personen hatten Zugang zur Treppe. Holmes fand vier Aussagen, vier kleine Glocken und eine verschlüsselte Zeile. Der Küster bestand darauf, dass genau eine Person gelogen habe – und dass der Schuldige eben diese Lüge ausgesprochen habe.",
      introduction: "Bestimme den einzigen Lügner, nutze dessen römische Marke für die Glockenfolge, entschlüssle die Nachricht und ordne zuletzt die vier Wachssiegel.",
      levels: [
        {
          number: 1,
          title: "Der einzige Lügner",
          paragraphs: [
            "Archer, Bennett, Cavell und Doyle trugen die Marken I bis IV in dieser Reihenfolge. Genau eine Aussage ist falsch. Der Schuldige ist zugleich die Person, deren Aussage falsch ist.",
            "Archer: „Bennett ist schuldig.“ Bennett: „Doyle ist nicht schuldig.“ Cavell: „Ich bin nicht schuldig.“ Doyle: „Archers Aussage ist falsch.“"
          ],
          question: "● WER HAT DEN GLOCKENKLÖPPEL ENTFERNT? ●",
          choices: [
            { value: "archer", label: "Archer · Marke I" }, { value: "bennett", label: "Bennett · Marke II" },
            { value: "cavell", label: "Cavell · Marke III" }, { value: "doyle", label: "Doyle · Marke IV" }
          ],
          correct: "archer",
          answer: "Archer mit Marke I",
          retry: "Prüfe jede Person als Schuldigen. Genau eine Aussage muss falsch sein, und sie muss vom Schuldigen stammen."
        },
        {
          number: 2,
          title: "Die Folge der Glocken",
          paragraphs: [
            "Auf einem Tisch standen vier kleine Glocken aus Eisen, Bronze, Silber und Messing.",
            "Silber stand unmittelbar rechts von Bronze. Messing stand rechts von Silber. Eisen stand links von Bronze.",
            "Die Marke des Schuldigen bezeichnet die Position der gesuchten Glocke."
          ],
          question: "● WELCHE GLOCKE GEHÖRT ZUR MARKE DES SCHULDIGEN? ●",
          choices: [
            { value: "eisen", label: "Eisenglocke" }, { value: "bronze", label: "Bronzeglocke" },
            { value: "silber", label: "Silberglocke" }, { value: "messing", label: "Messingglocke" }
          ],
          correct: "eisen",
          answer: "Die Eisenglocke",
          retry: "Ordne die vier Metalle von links nach rechts und wähle dann die Position der Marke aus Ebene 1."
        },
        {
          number: 3,
          title: "Die chiffrierte Zeile",
          paragraphs: [
            "Eisen: jeden Buchstaben um eine Stelle zurücksetzen. Bronze: die Buchstabenfolge umkehren. Silber: nur jeden zweiten Buchstaben lesen. Messing: jeden Buchstaben um eine Stelle vorsetzen.",
            "Die verschlüsselte Zeile lautet: TJFHFM JJJ. Verwende ausschließlich die Regel der in Ebene 2 bestimmten Glocke."
          ],
          question: "● WELCHE ANWEISUNG ERGIBT DIE CHIFFRE? ●",
          choices: [
            { value: "siegel-iii", label: "SIEGEL III" }, { value: "siegel-ii", label: "SIEGEL II" },
            { value: "tresor-iii", label: "TRESOR III" }, { value: "jjj-mefhjt", label: "JJJ MEFHJT" }
          ],
          correct: "siegel-iii",
          answer: "SIEGEL III",
          retry: "Wende die Eisenregel Zeichen für Zeichen an: Jeder Buchstabe rückt genau eine Stelle zurück."
        },
        {
          number: 4,
          title: "Die vier Wachssiegel",
          paragraphs: [
            "Vier Wachssiegel lagen von links nach rechts auf dem Altar: Anker, Rose, Löwe und Krone.",
            "Die Rose lag unmittelbar links vom Löwen. Die Krone lag rechts vom Löwen. Die Rose lag nicht an erster Stelle.",
            "Die entschlüsselte römische Zahl aus Ebene 3 bezeichnet die Position des gesuchten Siegels."
          ],
          question: "● WELCHES SIEGEL HAT ARCHER ENTWENDET? ●",
          choices: [
            { value: "anker", label: "Das Ankersiegel" }, { value: "rose", label: "Das Rosensiegel" },
            { value: "loewe", label: "Das Löwensiegel" }, { value: "krone", label: "Das Kronensiegel" }
          ],
          correct: "loewe",
          answer: "Das Löwensiegel",
          retry: "Bestimme die einzige Reihenfolge und wähle anschließend Position III aus der entschlüsselten Nachricht."
        }
      ],
      solutionSteps: [
        { title: "Antwort Ebene 1", answer: "Archer mit Marke I", explanation: "Ist Archer schuldig, ist nur seine Aussage falsch; die Aussagen von Bennett, Cavell und Doyle sind wahr. Jede andere Täterannahme verletzt die Regel." },
        { title: "Antwort Ebene 2", answer: "Die Eisenglocke", explanation: "Die Bedingungen erzwingen Eisen – Bronze – Silber – Messing. Marke I verweist auf Eisen." },
        { title: "Antwort Ebene 3", answer: "SIEGEL III", explanation: "Nach der Eisenregel wird jeder Buchstabe um eine Stelle zurückgesetzt. Aus TJFHFM JJJ wird SIEGEL III." },
        { title: "Antwort Ebene 4 / Endantwort", answer: "Das Löwensiegel", explanation: "Nur Anker – Rose – Löwe – Krone erfüllt alle Bedingungen. An Position III liegt das Löwensiegel." }
      ],
      bridge: "Der fehlende Klöppel lag unter einer losen Stufe; das Löwensiegel fand sich in Archers Mantelfutter.",
      outro: "Als die Glocke wieder erklang, schrieb Watson die vier Aussagen noch einmal untereinander. Entscheidend war die strenge Regel, dass Lüge und Schuld bei derselben Person zusammentreffen mussten.",
      checkNote: "Logikprüfung bestanden: Es gibt genau einen schuldigen Lügner; Glockenfolge, Klartext und Siegelposition sind eindeutig."
    },
    {
      id: "SMARAGD-04",
      title: "Der Smaragd im verschlossenen Museum",
      primaryMechanism: "Wegfolge und Protokollabgleich",
      endAnswerType: "Behälter / Vitrine",
      intro: "Nach Schließung des South Kensington Museums verschwand der Smaragd von Meridia. Die Außentüren waren verriegelt, doch ein Nachtwächter hatte vier Säle in fester Folge kontrolliert. Neben dem leeren Sockel fand Holmes vier widersprüchliche Protokolle, vier kleine Schlossplättchen und eine Reihe farbiger Vitrinen.",
      introduction: "Rekonstruiere den Rundgang, finde das einzig fehlerfreie Protokoll, bestimme das passende Schlossplättchen und öffne zuletzt die richtige Vitrine.",
      levels: [
        {
          number: 1,
          title: "Der Rundgang des Nachtwächters",
          paragraphs: [
            "Der Wächter besuchte Galerie, Münzkabinett, Bibliothek und Archiv jeweils genau einmal.",
            "Die Bibliothek wurde unmittelbar vor dem Archiv kontrolliert. Die Galerie lag vor dem Münzkabinett. Das Münzkabinett wurde vor der Bibliothek besucht."
          ],
          question: "● WIE LAUTET DER VOLLSTÄNDIGE KONTROLLWEG? ●",
          choices: [
            { value: "GMBA", label: "Galerie – Münzkabinett – Bibliothek – Archiv" },
            { value: "GBAM", label: "Galerie – Bibliothek – Archiv – Münzkabinett" },
            { value: "MGBA", label: "Münzkabinett – Galerie – Bibliothek – Archiv" },
            { value: "BAGM", label: "Bibliothek – Archiv – Galerie – Münzkabinett" }
          ],
          correct: "GMBA",
          answer: "Galerie – Münzkabinett – Bibliothek – Archiv",
          retry: "Bibliothek und Archiv bilden einen festen Block. Setze davor Galerie und Münzkabinett in der angegebenen Reihenfolge."
        },
        {
          number: 2,
          title: "Das fehlerfreie Nachtprotokoll",
          paragraphs: ["Nur ein Protokoll stimmt in beiden Punkten mit dem Rundgang aus Ebene 1 überein."],
          evidence: [
            "Protokoll I – Das Archiv folgte unmittelbar auf die Bibliothek. Die Galerie wurde zuletzt kontrolliert.",
            "Protokoll II – Die Galerie wurde zuerst kontrolliert. Das Archiv wurde zuletzt kontrolliert.",
            "Protokoll III – Die Bibliothek wurde als Zweites kontrolliert. Das Münzkabinett lag vor der Galerie.",
            "Protokoll IV – Das Archiv wurde zuerst kontrolliert. Die Galerie lag hinter der Bibliothek."
          ],
          question: "● WELCHES PROTOKOLL IST FEHLERFREI? ●",
          choices: [
            { value: "I", label: "Protokoll I" }, { value: "II", label: "Protokoll II" },
            { value: "III", label: "Protokoll III" }, { value: "IV", label: "Protokoll IV" }
          ],
          correct: "II",
          answer: "Protokoll II",
          retry: "Kontrolliere beide Sätze jedes Protokolls. Ein einziger richtiger Satz macht ein Protokoll noch nicht fehlerfrei."
        },
        {
          number: 3,
          title: "Die Schlossplättchen",
          paragraphs: [
            "Vier Schlossplättchen lagen in einer Reihe: Kupfer, Perlmutt, Jade und Onyx.",
            "Jade lag unmittelbar rechts von Perlmutt. Kupfer lag links von Perlmutt. Onyx lag rechts von Jade.",
            "Die Nummer des fehlerfreien Protokolls bezeichnet die Position des gesuchten Plättchens."
          ],
          question: "● WELCHES SCHLOSSPLÄTTCHEN IST GESUCHT? ●",
          choices: [
            { value: "kupfer", label: "Kupfer" }, { value: "perlmutt", label: "Perlmutt" },
            { value: "jade", label: "Jade" }, { value: "onyx", label: "Onyx" }
          ],
          correct: "perlmutt",
          answer: "Das Perlmuttplättchen",
          retry: "Ordne zuerst die vier Plättchen. Nutze danach die römische Nummer des Protokolls als Position."
        },
        {
          number: 4,
          title: "Die farbigen Vitrinen",
          paragraphs: [
            "Von links nach rechts standen eine elfenbeinfarbene, eine grüne, eine blaue und eine schwarze Vitrine. Grün stand unmittelbar links von Blau. Schwarz stand rechts von Blau. Grün stand nicht an erster Stelle.",
            "Kupfer verlangte die erste Vitrine. Perlmutt verlangte die Vitrine unmittelbar rechts von Grün. Jade verlangte die grüne Vitrine. Onyx verlangte die letzte Vitrine.",
            "Nur die Anweisung des in Ebene 3 bestimmten Plättchens darf befolgt werden."
          ],
          question: "● IN WELCHER VITRINE IST DER SMARAGD VERBORGEN? ●",
          choices: [
            { value: "elfenbein", label: "In der elfenbeinfarbenen Vitrine" }, { value: "gruen", label: "In der grünen Vitrine" },
            { value: "blau", label: "In der blauen Vitrine" }, { value: "schwarz", label: "In der schwarzen Vitrine" }
          ],
          correct: "blau",
          answer: "In der blauen Vitrine",
          retry: "Bestimme die Vitrinenfolge und führe dann ausschließlich die Anweisung des Perlmuttplättchens aus."
        }
      ],
      solutionSteps: [
        { title: "Antwort Ebene 1", answer: "Galerie – Münzkabinett – Bibliothek – Archiv", explanation: "Bibliothek und Archiv bilden einen festen Block. Galerie muss vor Münzkabinett liegen, dieses wiederum vor der Bibliothek." },
        { title: "Antwort Ebene 2", answer: "Protokoll II", explanation: "Nur Protokoll II nennt die Galerie korrekt als ersten und das Archiv korrekt als letzten Raum." },
        { title: "Antwort Ebene 3", answer: "Das Perlmuttplättchen", explanation: "Die Plättchen liegen als Kupfer – Perlmutt – Jade – Onyx. Protokoll II verweist auf Position 2." },
        { title: "Antwort Ebene 4 / Endantwort", answer: "In der blauen Vitrine", explanation: "Die Vitrinenfolge lautet Elfenbein – Grün – Blau – Schwarz. Perlmutt verlangt die Vitrine unmittelbar rechts von Grün." }
      ],
      bridge: "Unter dem blauen Samtpolster lag der Smaragd. Holmes ersetzte ihn durch ein versiegeltes Beweisstück und ließ die Vitrine wieder schließen.",
      outro: "Der verschlossene Ausgang hatte den Dieb nicht geschützt. Aus dem einzigen widerspruchsfreien Protokoll führte die Kette ohne Umweg bis zur blauen Vitrine.",
      checkNote: "Logikprüfung bestanden: Kontrollweg, Protokoll, Schlossplättchen und Vitrine sind eindeutig."
    },
    {
      id: "THEMSE-05",
      title: "Die letzte Laterne an der Themse",
      primaryMechanism: "Zeitfenster und Streckenfolge",
      endAnswerType: "Gebäude / Zielort",
      intro: "Dichter Nebel lag über der Themse, als eine gestohlene Seekarte mit einem Ruderboot flussabwärts gebracht wurde. Vier Boote hatten den Anleger in Abständen von zehn Minuten verlassen. Der Hafenmeister besaß vier Gezeitennotizen, am Kai brannten vier verschiedenfarbige Laternen, und gegenüber zeichneten sich vier Gebäude im Nebel ab.",
      introduction: "Ermittle die Abfahrtsfolge, prüfe die Gezeitennotizen, bestimme die Laterne und leite daraus das Ziel des Bootes ab.",
      levels: [
        {
          number: 1,
          title: "Die vier Abfahrten",
          paragraphs: [
            "Möwe, Rabe, Schwan und Reiher legten um 00:10, 00:20, 00:30 und 00:40 Uhr ab. Jedes Boot nutzte genau eine Zeit.",
            "Der Rabe legte zwanzig Minuten nach der Möwe ab. Der Schwan legte zehn Minuten vor dem Raben ab. Der Reiher legte später als der Rabe ab."
          ],
          question: "● WELCHE BOOTSFOLGE GEHÖRT ZU DEN VIER ABFAHRTSZEITEN? ●",
          choices: [
            { value: "MSRH", label: "00:10 Möwe · 00:20 Schwan · 00:30 Rabe · 00:40 Reiher" },
            { value: "MRSH", label: "00:10 Möwe · 00:20 Rabe · 00:30 Schwan · 00:40 Reiher" },
            { value: "SMRH", label: "00:10 Schwan · 00:20 Möwe · 00:30 Rabe · 00:40 Reiher" },
            { value: "HMSR", label: "00:10 Reiher · 00:20 Möwe · 00:30 Schwan · 00:40 Rabe" }
          ],
          correct: "MSRH",
          answer: "00:10 Möwe · 00:20 Schwan · 00:30 Rabe · 00:40 Reiher",
          retry: "Setze zuerst Möwe und Rabe im Abstand von zwanzig Minuten. Schwan muss genau dazwischen liegen, Reiher danach."
        },
        {
          number: 2,
          title: "Die richtige Gezeitennotiz",
          paragraphs: ["Nur eine Gezeitennotiz enthält zwei Zeitangaben, die beide mit der Abfahrtsfolge aus Ebene 1 übereinstimmen."],
          evidence: [
            "Notiz I – Der Rabe legte um 00:30 ab. Die Möwe legte um 00:40 ab.",
            "Notiz II – Der Reiher legte um 00:40 ab. Der Schwan legte um 00:20 ab.",
            "Notiz III – Die Möwe legte um 00:20 ab. Der Rabe legte um 00:30 ab.",
            "Notiz IV – Der Schwan legte um 00:10 ab. Der Reiher legte um 00:30 ab."
          ],
          question: "● WELCHE GEZEITENNOTIZ IST VOLLSTÄNDIG RICHTIG? ●",
          choices: [
            { value: "I", label: "Notiz I" }, { value: "II", label: "Notiz II" },
            { value: "III", label: "Notiz III" }, { value: "IV", label: "Notiz IV" }
          ],
          correct: "II",
          answer: "Gezeitennotiz II",
          retry: "Beide Zeitangaben müssen stimmen. Prüfe die Notizen vollständig gegen die vier Abfahrten."
        },
        {
          number: 3,
          title: "Die Laternen am Kai",
          paragraphs: [
            "Vier Laternen standen von links nach rechts: weiß, bernsteinfarben, rot und blau.",
            "Rot stand unmittelbar rechts von Bernstein. Weiß stand links von Bernstein. Blau stand rechts von Rot.",
            "Die Nummer der richtigen Gezeitennotiz bezeichnet die Position der gesuchten Laterne."
          ],
          question: "● WELCHE LATERNE MARKIERT DIE WEITERE SPUR? ●",
          choices: [
            { value: "weiss", label: "Die weiße Laterne" }, { value: "bernstein", label: "Die bernsteinfarbene Laterne" },
            { value: "rot", label: "Die rote Laterne" }, { value: "blau", label: "Die blaue Laterne" }
          ],
          correct: "bernstein",
          answer: "Die bernsteinfarbene Laterne",
          retry: "Ordne die vier Laternen vollständig und übertrage anschließend die römische Nummer aus Ebene 2."
        },
        {
          number: 4,
          title: "Die Gebäude im Nebel",
          paragraphs: [
            "Am gegenüberliegenden Ufer lagen Speicher, Werft, Bootshaus und Zollhaus in einer Reihe. Die Werft lag unmittelbar links vom Bootshaus. Das Zollhaus lag rechts vom Bootshaus. Die Werft lag nicht an erster Stelle.",
            "Weiß wies zum Speicher. Bernstein wies auf das Gebäude unmittelbar rechts von der Werft. Rot wies zur Werft. Blau wies zum letzten Gebäude.",
            "Folge nur der Anweisung der in Ebene 3 bestimmten Laterne."
          ],
          question: "● WOHIN WURDE DIE GESTOHLENE SEEKARTE GEBRACHT? ●",
          choices: [
            { value: "speicher", label: "Zum Speicher" }, { value: "werft", label: "Zur Werft" },
            { value: "bootshaus", label: "Zum Bootshaus" }, { value: "zollhaus", label: "Zum Zollhaus" }
          ],
          correct: "bootshaus",
          answer: "Zum Bootshaus",
          retry: "Bestimme die Gebäudefolge und folge anschließend nur dem Hinweis der bernsteinfarbenen Laterne."
        }
      ],
      solutionSteps: [
        { title: "Antwort Ebene 1", answer: "00:10 Möwe · 00:20 Schwan · 00:30 Rabe · 00:40 Reiher", explanation: "Möwe und Rabe liegen zwanzig Minuten auseinander. Schwan liegt zehn Minuten vor Rabe, Reiher danach." },
        { title: "Antwort Ebene 2", answer: "Gezeitennotiz II", explanation: "Nur Notiz II nennt Reiher um 00:40 und Schwan um 00:20 korrekt." },
        { title: "Antwort Ebene 3", answer: "Die bernsteinfarbene Laterne", explanation: "Die Laternenfolge ist Weiß – Bernstein – Rot – Blau. Notiz II verweist auf Position 2." },
        { title: "Antwort Ebene 4 / Endantwort", answer: "Zum Bootshaus", explanation: "Die Gebäude liegen als Speicher – Werft – Bootshaus – Zollhaus. Bernstein weist unmittelbar rechts von der Werft zum Bootshaus." }
      ],
      bridge: "Im Bootshaus lag die Seekarte zusammengerollt unter einem nassen Tau. Das Boot des Raben schaukelte noch am hinteren Steg.",
      outro: "Der Nebel hatte die Sicht genommen, nicht aber die Zeit. Aus vier Abfahrten entstand eine feste Folge; aus der Folge eine richtige Notiz; aus der Notiz eine Laterne; aus der Laterne ein einziges Gebäude.",
      checkNote: "Logikprüfung bestanden: Abfahrtszeiten, Gezeitennotiz, Laterne und Zielgebäude sind eindeutig."
    }
  ].map((puzzle) => Object.freeze(puzzle)));

  function permutations(list) {
    if (list.length <= 1) return [list];
    return list.flatMap((entry, index) => {
      const rest = [...list.slice(0, index), ...list.slice(index + 1)];
      return permutations(rest).map((tail) => [entry, ...tail]);
    });
  }

  function structurePassed(puzzle) {
    return puzzle.levels.length === 4 && puzzle.solutionSteps.length === 4 &&
      puzzle.levels.every((level, index) => level.number === index + 1 && level.choices.some((choice) => choice.value === level.correct));
  }

  function validateNachtzug(puzzle) {
    const people = permutations(["A", "B", "C", "D"]).filter((order) => {
      const pos = Object.fromEntries(order.map((value, index) => [value, index]));
      return pos.C === pos.B + 1 && pos.A < pos.B && pos.D > pos.C;
    });
    const pos = Object.fromEntries((people[0] || []).map((value, index) => [value, index]));
    const telegrams = [
      [pos.B + 1 === pos.C, pos.A === 3], [pos.D === 3, pos.A === 0],
      [pos.C === 1, pos.B < pos.A], [pos.B === 0, pos.D > pos.A]
    ].map((claims, index) => claims.every(Boolean) ? index + 1 : null).filter(Boolean);
    const keys = permutations(["messing", "silber", "eisen", "bein"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.eisen === p.silber + 1 && p.messing < p.silber && p.bein > p.eisen;
    });
    const cases = permutations(["rot", "schwarz", "gruen", "blau"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.schwarz + 1 === p.gruen && p.blau > p.gruen && p.schwarz !== 0;
    });
    const final = cases[0]?.[cases[0].indexOf("schwarz") + 1];
    return { id: puzzle.id, solutionCounts: [people.length, telegrams.length, keys.length, cases.length], answers: [people[0]?.join(""), telegrams[0], keys[0]?.[telegrams[0] - 1], final], passed: structurePassed(puzzle) && people.length === 1 && telegrams.length === 1 && keys.length === 1 && cases.length === 1 && final === "gruen" };
  }

  function validateSpiegel(puzzle) {
    const rooms = permutations(["bibliothek", "musik", "wintergarten", "arbeitszimmer"]).filter((order) => order[1] === "musik" && !["bibliothek", "wintergarten"].includes(order[3]) && order[2] !== "arbeitszimmer" && order[0] !== "bibliothek");
    const map = rooms[0] || [];
    const notes = [
      [map[1] === "bibliothek", map[3] === "arbeitszimmer"], [map[0] === "wintergarten", map[2] === "arbeitszimmer"],
      [map[2] === "bibliothek", map[1] === "musik"], [map[3] === "wintergarten", map[0] === "bibliothek"]
    ].map((claims, index) => claims.every(Boolean) ? index + 1 : null).filter(Boolean);
    const frames = permutations(["eiche", "mahagoni", "nussbaum", "ebenholz"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.mahagoni + 1 === p.nussbaum && p.eiche < p.mahagoni && p.ebenholz > p.nussbaum;
    });
    const places = permutations(["schreibpult", "standuhr", "spiegel", "kamin"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.standuhr + 1 === p.spiegel && p.kamin > p.spiegel && p.standuhr !== 0;
    });
    const frame = frames[0]?.[notes[0] - 1];
    const final = frame === "nussbaum" ? places[0]?.[places[0].indexOf("standuhr") + 1] : null;
    return { id: puzzle.id, solutionCounts: [rooms.length, notes.length, frames.length, places.length], answers: [map.join("|"), notes[0], frame, final], passed: structurePassed(puzzle) && rooms.length === 1 && notes.length === 1 && frames.length === 1 && places.length === 1 && final === "spiegel" };
  }

  function shiftBack(text) {
    return text.replace(/[A-Z]/g, (letter) => String.fromCharCode(65 + (letter.charCodeAt(0) - 66 + 26) % 26));
  }

  function validateGlocke(puzzle) {
    const suspects = ["archer", "bennett", "cavell", "doyle"];
    const culprits = suspects.filter((culprit, index) => {
      const claims = [culprit === "bennett", culprit !== "doyle", culprit !== "cavell", culprit !== "bennett"];
      return claims.filter((claim) => !claim).length === 1 && claims[index] === false;
    });
    const bells = permutations(["eisen", "bronze", "silber", "messing"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.silber === p.bronze + 1 && p.messing > p.silber && p.eisen < p.bronze;
    });
    const bell = bells[0]?.[suspects.indexOf(culprits[0])];
    const decoded = bell === "eisen" ? shiftBack("TJFHFM JJJ") : null;
    const seals = permutations(["anker", "rose", "loewe", "krone"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.rose + 1 === p.loewe && p.krone > p.loewe && p.rose !== 0;
    });
    const final = decoded === "SIEGEL III" ? seals[0]?.[2] : null;
    return { id: puzzle.id, solutionCounts: [culprits.length, bells.length, decoded ? 1 : 0, seals.length], answers: [culprits[0], bell, decoded, final], passed: structurePassed(puzzle) && culprits.length === 1 && culprits[0] === "archer" && bells.length === 1 && decoded === "SIEGEL III" && seals.length === 1 && final === "loewe" };
  }

  function validateSmaragd(puzzle) {
    const rooms = permutations(["G", "M", "B", "A"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.B + 1 === p.A && p.G < p.M && p.M < p.B;
    });
    const pos = Object.fromEntries((rooms[0] || []).map((value, index) => [value, index]));
    const logs = [
      [pos.B + 1 === pos.A, pos.G === 3], [pos.G === 0, pos.A === 3],
      [pos.B === 1, pos.M < pos.G], [pos.A === 0, pos.G > pos.B]
    ].map((claims, index) => claims.every(Boolean) ? index + 1 : null).filter(Boolean);
    const locks = permutations(["kupfer", "perlmutt", "jade", "onyx"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.jade === p.perlmutt + 1 && p.kupfer < p.perlmutt && p.onyx > p.jade;
    });
    const cases = permutations(["elfenbein", "gruen", "blau", "schwarz"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.gruen + 1 === p.blau && p.schwarz > p.blau && p.gruen !== 0;
    });
    const lock = locks[0]?.[logs[0] - 1];
    const final = lock === "perlmutt" ? cases[0]?.[cases[0].indexOf("gruen") + 1] : null;
    return { id: puzzle.id, solutionCounts: [rooms.length, logs.length, locks.length, cases.length], answers: [rooms[0]?.join(""), logs[0], lock, final], passed: structurePassed(puzzle) && rooms.length === 1 && logs.length === 1 && locks.length === 1 && cases.length === 1 && final === "blau" };
  }

  function validateThemse(puzzle) {
    const boats = permutations(["M", "R", "S", "H"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.R === p.M + 2 && p.S === p.R - 1 && p.H > p.R;
    });
    const pos = Object.fromEntries((boats[0] || []).map((value, index) => [value, index]));
    const notes = [
      [pos.R === 2, pos.M === 3], [pos.H === 3, pos.S === 1],
      [pos.M === 1, pos.R === 2], [pos.S === 0, pos.H === 2]
    ].map((claims, index) => claims.every(Boolean) ? index + 1 : null).filter(Boolean);
    const lanterns = permutations(["weiss", "bernstein", "rot", "blau"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.rot === p.bernstein + 1 && p.weiss < p.bernstein && p.blau > p.rot;
    });
    const buildings = permutations(["speicher", "werft", "bootshaus", "zollhaus"]).filter((order) => {
      const p = Object.fromEntries(order.map((value, index) => [value, index]));
      return p.werft + 1 === p.bootshaus && p.zollhaus > p.bootshaus && p.werft !== 0;
    });
    const lantern = lanterns[0]?.[notes[0] - 1];
    const final = lantern === "bernstein" ? buildings[0]?.[buildings[0].indexOf("werft") + 1] : null;
    return { id: puzzle.id, solutionCounts: [boats.length, notes.length, lanterns.length, buildings.length], answers: [boats[0]?.join(""), notes[0], lantern, final], passed: structurePassed(puzzle) && boats.length === 1 && notes.length === 1 && lanterns.length === 1 && buildings.length === 1 && final === "bootshaus" };
  }

  const validators = {
    "NACHTZUG-01": validateNachtzug,
    "SPIEGEL-02": validateSpiegel,
    "GLOCKE-03": validateGlocke,
    "SMARAGD-04": validateSmaragd,
    "THEMSE-05": validateThemse
  };

  function getPuzzle(id) {
    return PUZZLES.find((puzzle) => puzzle.id === id) || PUZZLES[0];
  }

  function validate(id) {
    const puzzle = getPuzzle(id);
    return validators[puzzle.id](puzzle);
  }

  function validateAll() {
    return PUZZLES.map((puzzle) => validate(puzzle.id));
  }

  function isCorrect(puzzleId, levelNumber, value) {
    const level = getPuzzle(puzzleId).levels.find((entry) => entry.number === levelNumber);
    return Boolean(level && level.correct === value);
  }

  const verification = Object.freeze(validateAll());
  if (verification.some((report) => !report.passed)) throw new Error("Mindestens ein Vier-Ebenen-Fall hat die interne Prüfung nicht bestanden.");

  global.SherlockEngine = Object.freeze({ puzzles: PUZZLES, getPuzzle, validate, validateAll, verification, isCorrect, permutations });
})(typeof window !== "undefined" ? window : globalThis);
