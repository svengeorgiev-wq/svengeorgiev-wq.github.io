"use strict";
/* Buchinhalte zu „Achtsamkeit & Gelassenheit für normale Leute“ (Sarah L. Baumann, Munich Publishing).
   Quelle: Manuskript 29.9.26 Achtsamkeit_Gelassenheit_Baumann.docx. Werkzeug-Schritte, Minimalversionen,
   „Wenn es hakt“-Antworten, Workbook-Tage und Belege sind wörtlich aus dem Manuskript übernommen. */

window.RUHE_CONTENT = {
  book: {
    title: "Achtsamkeit & Gelassenheit für normale Leute",
    subtitle: "Mit der RUHE-Methode raus aus Autopilot und Gedankenkarussell – 12 Werkzeuge, 21-Tage-Workbook und Web-App",
    author: "Sarah L. Baumann",
    publisher: "Munich Publishing",
    appUrl: "https://tools.munichpublishing.de/achtsamkeit/",
    contact: "info@munichpublishing.de"
  },

  method: {
    intro: "Du brauchst ein paar Werkzeuge, die meisten davon in fünf Minuten oder weniger erledigt, und einen Ablauf, mit dem du sie in schwierigen Momenten wiederfindest. Dieser Ablauf heißt in diesem Buch die RUHE-Methode, nach seinen vier Schritten:",
    steps: [
      { letter: "R", name: "Registrieren", text: "Du merkst, dass du gerade auf Autopilot bist oder innerlich hochfährst." },
      { letter: "U", name: "Umschalten", text: "Über den Atem oder den Körper schaltest du einen Gang herunter." },
      { letter: "H", name: "Hinschauen", text: "Du sortierst, was gerade wirklich da ist, bevor du urteilst." },
      { letter: "E", name: "Entscheiden", text: "Du wählst einen einzigen nächsten Schritt." }
    ],
    loop: "Wenn die vier Schritte in einer konkreten Situation nacheinander ablaufen, nenne ich das die RUHE-Schleife. In ihrer Grundform dauert die Schleife eine Minute.",
    shortest: "Wenn du nur eine Sache aus diesem Buch mitnimmst, dann diese: Atme einmal normal ein und lass die Luft danach langsam hinaus, etwas länger, als das Einatmen gedauert hat. Frag dich dabei: Was ist jetzt dran? Das dauert zehn Sekunden. Es ist die kürzeste Form des RUHE-Stopps aus Kapitel 1, und es funktioniert auch an Tagen, an denen sonst gar nichts geht."
  },

  /* Schnellzugriff auf der Startseite: Situation → Werkzeug */
  situations: [
    { label: "Ich bin auf Autopilot", tool: 1 },
    { label: "Ich fahre gerade hoch", tool: 2 },
    { label: "Mein Kopf kreist", tool: 3 },
    { label: "Ich springe zwischen Aufgaben", tool: 5 },
    { label: "Die Hand ist schon am Handy", tool: 6 },
    { label: "Ich sitze seit Stunden am Bildschirm", tool: 8 },
    { label: "Ich schimpfe innerlich über mich", tool: 9 },
    { label: "Gleich sage ich etwas Spitzes", tool: 10 },
    { label: "Der Kopf läuft im Bett weiter", tool: 11 },
    { label: "Die Woche ist zu voll", tool: 12 }
  ],

  tools: [
    {
      number: 1,
      title: "Der RUHE-Stopp",
      chapter: 1,
      chapterTitle: "Achtsamkeit ohne Räucherstäbchen",
      step: "RUHE",
      duration: "etwa 60 Sekunden",
      summary: "Die ganze RUHE-Schleife im Kleinformat, an einem festen Punkt am Morgen.",
      intro: "Der RUHE-Stopp ist die ganze Schleife im Kleinformat, ungefähr sechzig Sekunden lang. Such dir dafür einen festen Punkt am Morgen, der ohnehin jeden Tag vorkommt, etwa die Kaffeemaschine, während sie durchläuft, die Wohnungstür oder das Einparken vor der Arbeit. Dort machst du Folgendes:",
      steps: [
        { title: "Registrieren (etwa 10 Sekunden).", text: "Unterbrich kurz, was du gerade tust, und sag innerlich: „Stopp. Wo bin ich gerade?“ Leg eine Hand auf etwas Festes, die Arbeitsplatte, das Lenkrad, den Türgriff, und nimm wahr, ob es kalt, glatt oder rau ist.", seconds: 10 },
        { title: "Umschalten (etwa 15 Sekunden).", text: "Atme normal ein und lass die Luft danach langsam wieder hinaus, etwas länger, als das Einatmen gedauert hat. Ein- oder zweimal genügt.", seconds: 15 },
        { title: "Hinschauen (etwa 20 Sekunden).", text: "Beantworte drei Fragen mit ein paar Wörtern, still oder halblaut: Was passiert gerade? Was spüre ich? Was denke ich? Zum Beispiel: „Kaffee läuft. Schultern hart. Denke an die Präsentation.“ Mehr braucht es nicht, und eine Lösung musst du hier nicht finden.", seconds: 20 },
        { title: "Entscheiden (etwa 15 Sekunden).", text: "Frag dich, was jetzt als Nächstes dran ist, und wähle genau einen Schritt. Das kann sein, den Kaffee am Fenster zu trinken, bevor du das Handy entsperrst. Dann fang damit an.", seconds: 15 }
      ],
      minimal: "An schlechten Tagen reicht die Minimalversion: ein langer Ausatmer und die Frage „Was ist jetzt dran?“. Das dauert zehn Sekunden und zählt genauso.",
      tip: "In der ersten Woche hilft es, den Stopp immer an denselben Gegenstand zu koppeln. Dann erinnert dich der Gegenstand daran.",
      faq: [
        { q: "Ich vergesse es morgens einfach. Was mache ich falsch?", a: "Nichts. Der Autopilot ist genau der Zustand, in dem Vorsätze verloren gehen, das gehört zur Sache. Klebe in der ersten Woche einen Zettel an den Gegenstand, an den du den Stopp gekoppelt hast, einen gelben Haftzettel an der Kaffeemaschine zum Beispiel. Nach ein paar Tagen reicht meist der Gegenstand allein." },
        { q: "Eine Minute? Kann das überhaupt etwas bringen?", a: "Für sich genommen wenig, da will ich nichts beschönigen. Die Minute ist der erste Moment am Tag, in dem du mitbekommst, was los ist, und alles Weitere baut darauf auf. Wie du sie ausbauen kannst, steht in Kapitel 4." },
        { q: "Sobald ich hinschaue, merke ich erst, wie angespannt ich bin. Wird es dadurch nicht schlimmer?", a: "Die Anspannung war vorher schon da. Jetzt bemerkst du sie, und erst von hier aus kannst du etwas mit ihr tun. Wenn du allerdings über Wochen fast jeden Morgen erschöpft, niedergeschlagen oder voller Angst aufwachst, sprich mit deiner Hausärztin oder deinem Hausarzt oder such dir psychotherapeutische Unterstützung." },
        { q: "Muss ich dafür die Augen schließen oder mich hinsetzen?", a: "Nein. Der RUHE-Stopp funktioniert im Stehen, mit offenen Augen und in einer vollen Küche. Im Auto machst du ihn erst, wenn der Wagen steht." }
      ],
      workbookDays: [1, 2],
      today: "Für morgen früh brauchst du nur eine Vorbereitung: Leg heute Abend fest, an welchem Gegenstand du den ersten Stopp machst, und leg einen Zettel daneben."
    },
    {
      number: 2,
      title: "Das lange Ausatmen",
      chapter: 2,
      chapterTitle: "Der Atem als Bremse",
      step: "U",
      duration: "1 bis 1,5 Minuten",
      summary: "Vier Zähler ein, sechs bis acht aus, fünf bis acht Runden. Mit offenen Augen, mitten in der Situation.",
      intro: "Das Werkzeug dauert eine bis anderthalb Minuten und funktioniert im Sitzen, im Stehen und hinter dem Lenkrad, mit offenen Augen. Für den Stau vom Anfang dieses Kapitels hieße das: Hände locker aufs Lenkrad, Blick auf die Straße, Radio ruhig anlassen, und dann los.",
      steps: [
        { title: "Merken.", text: "Nimm wahr, dass du gerade hochfährst: Kiefer fest, Schultern oben, Atem kurz. Ändern musst du daran in diesem Moment noch nichts." },
        { title: "Einatmen.", text: "Atme ruhig durch die Nase ein und zähl dabei still bis vier. Zieh nicht besonders viel Luft ein, eine normale Menge reicht." },
        { title: "Ausatmen.", text: "Lass die Luft langsam durch die Nase oder durch leicht geöffnete Lippen hinaus und zähl dabei bis sechs, wenn es geht bis acht. Die Lunge muss dabei nicht bis zum letzten Rest leer werden." },
        { title: "Wiederholen.", text: "Fünf bis acht Runden. Damit liegst du bei etwa sechs Atemzügen pro Minute, also deutlich unter deinem gewohnten Tempo." },
        { title: "Variante für sehr heftige Momente.", text: "Atme zweimal kurz hintereinander durch die Nase ein, das zweite Mal nur ein kleines Stück obendrauf, und dann lange durch den Mund aus. Das ist das Seufzen aus der Stanford-Studie. Dort wurde es fünf Minuten am Stück geübt; im Alltag fange ich selbst mit zwei oder drei an." }
      ],
      minimal: "Die Minimalversion für schlechte Tage sind drei lange Ausatmer, ohne Zählen und ohne Runde, einfach jedes Mal etwas länger hinaus als hinein.",
      caution: "Wenn dir schwindlig wird oder die Finger kribbeln, hör auf und atme normal weiter; meist war dann das Einatmen zu groß. Bei Erkrankungen der Atemwege oder des Herzens und wenn du zu Panikattacken neigst, sprich vorher mit deiner Hausärztin oder deinem Hausarzt darüber, welche Atemübungen für dich passen.",
      faq: [
        { q: "Mir wird dabei schwindlig. Mache ich etwas falsch?", a: "Wahrscheinlich atmest du zu viel ein, vor allem wenn du gelernt hast, dass Atemübungen „tief“ sein müssen. Nimm beim Einatmen bewusst weniger Luft als gewohnt und konzentrier dich nur auf das langsame Hinauslassen. Wenn der Schwindel trotzdem wiederkommt, lass die Übung weg und lass es ärztlich abklären." },
        { q: "Mitten im Streit denke ich nie daran. Was bringt mir dann das Werkzeug?", a: "Im Streit fällt einem nur ein, was man vorher schon ein paarmal gemacht hat. Übe das lange Ausatmen deshalb zuerst in harmlosen Momenten, an der roten Ampel, während der Wasserkocher läuft, in der Warteschleife der Krankenkasse. Nach einigen Tagen taucht es dann auch in den heiklen Momenten auf, zuerst meist ein paar Sekunden zu spät, später rechtzeitig." },
        { q: "Das Zählen stresst mich zusätzlich.", a: "Dann lass es weg. Wichtig ist nur, dass das Ausatmen länger dauert als das Einatmen. Manchen hilft es, durch leicht geöffnete Lippen auszuatmen, sodass sie den Luftstrom leise hören; das Geräusch ersetzt die Zahlen." },
        { q: "Wie oft am Tag soll ich das machen?", a: "So oft du es brauchst. In der Stanford-Studie wurde fünf Minuten am Tag geübt. In einer Stressspitze komme ich selbst meist mit einer Minute aus. Wer mag, macht das lange Ausatmen zusätzlich einmal täglich zu einer festen Zeit, damit es im Ernstfall schneller abrufbar ist." }
      ],
      workbookDays: [3],
      today: "Mach das lange Ausatmen heute einmal an einer Stelle, an der gar nichts los ist, an der Supermarktkasse oder in der Schlange beim Bäcker. So lernt dein Körper den Ablauf, bevor du ihn brauchst."
    },
    {
      number: 3,
      title: "Das Gedanken-Etikett",
      chapter: 3,
      chapterTitle: "Wenn der Kopf nicht aufhört",
      step: "H",
      duration: "2 bis 3 Minuten",
      summary: "Ein Etikett für die Sorte des Gedankens, ein Wort für das Gefühl, dann die Frage, ob es etwas zu tun gibt.",
      intro: "Das Gedanken-Etikett dauert zwei bis drei Minuten, und du kannst es auf dem Sofa oder in der Straßenbahn machen. Du brauchst höchstens einen Zettel.",
      steps: [
        { title: "Bemerken.", text: "Merk, dass du gerade zum wiederholten Mal dieselbe Szene durchgehst. Ein inneres „Aha, da ist es wieder“ reicht." },
        { title: "Runterschalten.", text: "Mach zwei lange Ausatmer, wie beim langen Ausatmen aus Kapitel 2. Das verschafft dir die paar Sekunden Abstand, die du für den nächsten Schritt brauchst." },
        { title: "Den Gedanken etikettieren.", text: "Gib dem Gedanken einen Namen für seine Sorte, also dafür, was dein Kopf gerade mit dem Inhalt macht. Mögliche Etiketten sind „Nachspielen“, „Sorgen“, „Bewerten“, „Rechtfertigen“ oder „Planen“. Sag innerlich: „Das ist Nachspielen.“" },
        { title: "Das Gefühl etikettieren.", text: "Such ein einzelnes Wort für das, was du dabei fühlst, so genau wie möglich: gekränkt, verunsichert, ärgerlich, beschämt, müde. Wenn zwei Wörter passen, nimm beide." },
        { title: "Prüfen.", text: "Frag dich: Gibt es hier etwas, das ich tun kann? Wenn ja, schreib den einen Schritt auf einen Zettel, mit Tag und Uhrzeit. Wenn nein, wende dich wieder dem zu, was du gerade getan hast. Kommt der Gedanke zurück, bekommt er wieder sein Etikett, so oft wie nötig." }
      ],
      minimal: "Die Minimalversion für schlechte Tage ist ein einziges Wort für das Gefühl, halblaut gesagt, etwa „gekränkt“.",
      tip: "Manche führen am Abend eine Strichliste auf einem Zettel neben dem Bett, eine Linie für jedes Mal, wenn der Gedanke wiederkam; nach ein paar Tagen wird die Liste meist kürzer.",
      faq: [
        { q: "Der Gedanke kommt sofort wieder. Hat es dann nicht funktioniert?", a: "Doch. Das Etikett soll den Gedanken nicht löschen, das kann es auch gar nicht. Jedes Mal, wenn du ihn benennst, bist du einen Moment lang außerhalb des Kreisens, und diese Momente summieren sich. Dass er zehnmal wiederkommt, ist am ersten Abend normal." },
        { q: "Mir fällt kein Wort für das Gefühl ein.", a: "Dann nimm ein ungefähres. „Irgendwas zwischen ärgerlich und traurig“ ist ein vollkommen brauchbares Etikett. Mit der Zeit werden die Wörter genauer, und manchen hilft eine kleine Liste mit Gefühlswörtern auf dem Handy." },
        { q: "Ich weiß oft nicht, welche Sorte Gedanke das gerade ist.", a: "Dann nimm die, die am ehesten passt, oder erfinde eine eigene. Bettina hat nach ein paar Abenden „Rechtfertigen“ durch „Verteidigungsrede“ ersetzt, weil sie dabei jedes Mal kurz grinsen musste. Hauptsache, du siehst den Gedanken für einen Moment von außen an." },
        { q: "Ist das nicht einfach Verdrängen?", a: "Beim Etikettieren siehst du dir den Gedanken an, benennst, was da ist, und entscheidest dann, ob es jetzt deine Aufmerksamkeit braucht. Er darf bleiben; du bestimmst nur mit, wie viel Zeit er heute Abend bekommt." },
        { q: "Es passiert vor allem nachts im Bett.", a: "Dann funktioniert das Etikett genauso, im Dunkeln und ohne Zettel. Für das Grübeln im Bett gibt es in Kapitel 11 ein eigenes Werkzeug. Hält das nächtliche Kreisen über Wochen an, sprich bitte mit deiner Hausärztin oder deinem Hausarzt." }
      ],
      workbookDays: [4, 5],
      today: "Für den ersten Versuch eignet sich ein kleiner Gedanke, einer, der dir heute beim Abwasch oder an der Haltestelle durch den Kopf geht. Ein Wort für die Sorte, eins für das Gefühl, und dann weiter mit dem Abwasch."
    },
    {
      number: 4,
      title: "Die Fünf-Minuten-Sitzung",
      chapter: 4,
      chapterTitle: "Meditation für Leute ohne Zeit",
      step: "H",
      duration: "5 Minuten, an schlechten Tagen 1",
      summary: "Ein fester Moment, ein Timer, eine Stelle, an der du den Atem spürst. Wanderst du ab, ein Wort, dann zurück.",
      intro: "Diese Sitzung ist für Tage gebaut, an denen du eigentlich keine Zeit hast. Sie dauert fünf Minuten, an schlechten Tagen eine.",
      steps: [
        { title: "Wähle einen festen Moment.", text: "Such dir etwas, das jeden Tag ohnehin passiert, so wie beim RUHE-Stopp aus Kapitel 1: der Kaffee läuft durch, du hast das Auto geparkt, die Kinder sind aus der Tür. Direkt danach sitzt du. Der Entschluss ist dann einmal gefasst und gilt für jeden Tag." },
        { title: "Stell einen Timer auf fünf Minuten.", text: "Dann musst du nicht auf die Uhr schauen. Setz dich aufrecht hin, beide Füße auf dem Boden, Augen geschlossen oder halb offen mit dem Blick schräg nach unten." },
        { title: "Beginne mit drei Atemzügen mit dem langen Ausatmen aus Kapitel 2.", text: "Danach atmest du wieder, wie es von allein kommt." },
        { title: "Such dir eine Stelle, an der du den Atem spürst,", text: "am Naseneingang, an der Brust oder am Bauch. Bleib bei dieser einen Stelle." },
        { title: "Wenn du merkst, dass du woanders bist,", text: "gib dem Gedanken ein kurzes Wort, so wie beim Gedanken-Etikett aus Kapitel 3: „Planen“, „Sorgen“, „Nachspielen“. Dann kehrst du zur Stelle zurück. Das passiert in fünf Minuten zehn- oder zwanzigmal, und jedes Mal zählt." },
        { title: "Wenn der Timer klingelt, schau kurz hin:", text: "Was war heute am häufigsten da? Ein Wort reicht, auf einem Zettel oder im Kopf." }
      ],
      minimal: "Die Minimalversion für schlechte Tage: eine Minute an deinem festen Moment, drei Atemzüge, ein Wort für das, was gerade da ist. Auch das ist eine Sitzung, und sie hält den Moment im Tag fest, an dem du morgen wieder sitzt.",
      faq: [
        { q: "Ich schlafe dabei ein. Mache ich etwas falsch?", a: "Nein. Setz dich aufrechter hin, lass die Augen halb offen und leg die Sitzung auf eine Tageszeit, zu der du wacher bist, gern auch in die Mittagspause, notfalls im Stehen am Fenster. Wenn du dich über Wochen tagsüber so erschöpft fühlst, dass du überall wegdämmerst, lohnt ein Termin bei deiner Hausärztin oder deinem Hausarzt." },
        { q: "Mein Kopf ist fast die ganzen fünf Minuten woanders. Bringt das überhaupt etwas?", a: "Ja. Jedes Mal, wenn du das Abschweifen bemerkst und zurückkehrst, hast du genau das geübt, worum es geht. Eine Sitzung, in der du zwanzigmal zurückgekehrt bist, ist eine fleißige Sitzung." },
        { q: "Wenn ich auf den Atem achte, wird mir eng in der Brust oder leicht schwindelig.", a: "Wechsle die Stelle: Spür deine Füße auf dem Boden oder hör auf die Geräusche im Raum, das Brummen des Kühlschranks, ein Auto draußen. Wenn das Unbehagen bleibt, wenn in der Stille belastende Erinnerungen hochkommen oder dir das Ganze Angst macht, hör auf und sprich mit deiner Hausärztin oder einer Psychotherapeutin darüber. Das ist eine vernünftige Entscheidung." },
        { q: "Ich habe drei Tage ausgelassen. Muss ich jetzt von vorn anfangen?", a: "Nein, es gibt keinen Anfang, zu dem du zurückmüsstest. Setz dich morgen an deinem festen Moment hin, fünf Minuten oder eine, und hol nichts nach." }
      ],
      workbookDays: [6],
      today: "Heute brauchst du nur deinen festen Moment. Schreib ihn auf einen Zettel und kleb ihn dorthin, wo er stattfindet, an die Kaffeemaschine oder ans Lenkrad; morgen setzt du dich dort zum ersten Mal hin."
    },
    {
      number: 5,
      title: "Die Übergangsnotiz",
      chapter: 5,
      chapterTitle: "Achtsam arbeiten",
      step: "E",
      duration: "1 bis 2 Minuten",
      summary: "Zwei Zeilen vor jedem Wechsel: „Stand:“ und „Als Nächstes:“. Was auf dem Papier steht, muss der Kopf nicht festhalten.",
      intro: "Du brauchst einen Stift und irgendetwas zum Draufschreiben: einen Block, den Rand eines Ausdrucks, die erste Zeile im offenen Dokument. Die ganze Notiz dauert ein bis zwei Minuten.",
      steps: [
        { title: "Bevor du eine Aufgabe oder ein Gespräch verlässt, schreib eine Zeile „Stand:“.", text: "Wo bist du gerade? „Angebot bis Punkt 3 fertig.“ „Kundin will Blau, Farbnummer offen.“ Halbe Sätze genügen." },
        { title: "Schreib eine Zeile „Als Nächstes:“ mit einem Verb am Anfang.", text: "„Preise in Punkt 4 prüfen.“ „Spediteur wegen Uhrzeit anrufen.“ Das ist der erste Handgriff, wenn du zurückkommst, so konkret, dass du ihn auch müde verstehst." },
        { title: "Leg die Notiz dorthin, wo du beim Wiedereinstieg zuerst hinschaust:", text: "oben auf den Stapel, in die erste Zeile der Datei, an den Bildschirmrand." },
        { title: "Atme einmal lang aus,", text: "wie in Kapitel 2, und spür kurz deine Füße auf dem Boden. Wenn es geht, steh auf, auch wenn du nur bis zur Tür gehst." },
        { title: "Entscheide für das, was jetzt kommt, einen Satz:", text: "„Ziel dieses Gesprächs: Datum für die Abnahme festlegen.“ Wenn du keinen Satz findest, ist das auch eine Auskunft, die du in den Termin mitnehmen kannst." }
      ],
      minimal: "Die Minimalversion für Tage, an denen gar nichts geht: nur Schritt 2. Ein paar Wörter auf einen Klebezettel, „Als Nächstes: Spediteur anrufen“, und weiter.",
      tip: "Der Übergang, den die meisten unterschätzen, ist der am Feierabend. Hier funktioniert die Notiz genauso, nur mit einem anderen Ziel. „Stand“ und „Als Nächstes“ schreibst du für die Arbeit von morgen früh, damit sie über Nacht dort liegen bleibt. Der Satz in Schritt 5 gilt dann dem Abend: „Jetzt: kochen und zuhören.“",
      faq: [
        { q: "Sobald es hektisch wird, vergesse ich die Notiz. Was dann?", a: "Nimm dir für den Anfang nur einen einzigen Wechsel am Tag vor, zum Beispiel den vor der Mittagspause. Wenn der sitzt, kommt ein zweiter dazu." },
        { q: "Mein Kalender hat keine Lücken. Wo soll das hinpassen?", a: "In die letzten zwei Minuten des laufenden Termins. Die meisten Besprechungen enden ohnehin mit Kleinkram, und kaum jemand bemerkt, dass du dabei zwei Zeilen notierst. Termine, die du selbst ansetzt, kannst du außerdem fünf Minuten später beginnen lassen, um 10:05 statt um 10:00 Uhr." },
        { q: "Ich schreibe die Notiz, aber mein Kopf hängt trotzdem am letzten Termin.", a: "Dann war der Termin wahrscheinlich emotional aufgeladen, ein Konflikt oder eine unangenehme Nachricht. Dafür ist die Notiz zu klein. Nimm dir das Gedanken-Etikett aus Kapitel 3 dazu: ein Wort für den Gedanken, der dich festhält, und dann zurück zur Zeile „Als Nächstes“." },
        { q: "Fühlt sich das nicht nach noch mehr Bürokratie an?", a: "Am Anfang schon, so ging es auch Tanja. Der Test ist einfach: Zähl nach einer Woche, wie oft du beim Wiedereinstieg suchen musstest. Wenn es seltener geworden ist, lohnt sich die Minute." }
      ],
      workbookDays: [8, 9],
      today: "Für morgen reicht ein einziger Wechsel, gern der schwierigste des Tages. Leg dir dafür heute Abend einen Block oder einen Stapel Klebezettel neben die Tastatur."
    },
    {
      number: 6,
      title: "Das Check-Fenster",
      chapter: 6,
      chapterTitle: "Das Handy und du",
      step: "R",
      duration: "Einrichten etwa 5 Minuten, der Griff-Moment weniger als 1",
      summary: "Drei feste Zeiten zum Nachschauen. Dazwischen bekommt jeder Griff ein Wort und einen Strich.",
      intro: "Das Check-Fenster bündelt das Nachschauen auf feste Zeiten und macht den Griff dazwischen sichtbar. Das Einrichten dauert heute etwa fünf Minuten, der Griff-Moment später weniger als eine.",
      steps: [
        { title: "Lege für morgen drei Check-Fenster fest, mit Uhrzeit,", text: "zum Beispiel 7:45, 12:30 und 18:00 Uhr. Schreib sie in den Kalender oder auf einen Zettel an der Stelle, an der das Handy liegt. In jedem Fenster siehst du durch, was sich angesammelt hat, höchstens etwa zehn Minuten lang." },
        { title: "Leg das Handy zwischen den Fenstern außer Sichtweite,", text: "am besten in einen anderen Raum, sonst in eine Schublade oder die Tasche. Stell heute nur die Benachrichtigungen der einen App ab, die dich am häufigsten ruft; die übrigen nimmst du dir an den folgenden Tagen vor, eine pro Tag. Anrufe und zwei, drei wirklich wichtige Kontakte, etwa Schule, Kita oder Vorgesetzte, lässt du durch." },
        { title: "Wenn deine Hand trotzdem zum Handy geht, registriere den Griff.", text: "Sag innerlich „Griff“ und mach einen Strich auf einem Zettel. Das ist der Kern der Übung." },
        { title: "Atme einmal lang aus,", text: "wie in Kapitel 2, und frag dich kurz, was du gerade eigentlich wolltest: Pause, Ablenkung von etwas Zähem, Ruhe vor einem Gefühl, echte Information." },
        { title: "Entscheide:", text: "Ist es dringend, nimm das Handy bewusst und ohne schlechtes Gewissen. Wenn nicht, wartet es bis zum nächsten Fenster." }
      ],
      minimal: "Die Minimalversion für Tage, an denen das alles zu viel ist: nur Schritt 3. Du machst Striche, änderst sonst nichts und zählst am Abend nach. Schon das Zählen ist Registrieren, und du wirst am Abend etwas über deinen Tag wissen, das du morgens noch nicht wusstest.",
      tip: "Rechne damit, dass die ersten Tage sich merkwürdig anfühlen. Wenn der Griff ausbleibt, bleibt der Moment übrig, den er sonst gefüllt hätte. Du musst mit diesem Moment nichts Besonderes anfangen. Schau aus dem Fenster oder bleib einfach bei der Tabelle.",
      faq: [
        { q: "Ich muss beruflich erreichbar sein. Geht das Check-Fenster dann überhaupt?", a: "Ja, mit Ausnahmen. Erreichbar bleibst du über Anrufe und die Kontakte, die du in Schritt 2 durchlässt. Alles andere, was im Job wirklich eilt, kommt meist ohnehin als Anruf. Wenn nicht, kannst du die Fenster enger legen, etwa stündlich zur vollen Stunde. Auch das ist ein großer Unterschied zu dauerndem Nachschauen." },
        { q: "Ich mache jeden Tag Striche, aber es werden nicht weniger.", a: "Dann schau, wann sie gehäuft auftauchen. Bei Aylin war es die ungeliebte Bestellung am Dienstag. Oft steckt hinter einer Häufung eine bestimmte Aufgabe oder eine Uhrzeit, an der du müde bist. Dort hilft es mehr, die Aufgabe kleiner zu machen oder eine echte Pause einzulegen, als noch strenger mit dem Handy zu sein." },
        { q: "Ich merke den Griff erst, wenn ich schon mitten im Scrollen bin.", a: "Dann registrierst du ihn eben dort. Leg das Handy weg, mach den Strich und atme einmal lang aus. Mit der Zeit rückt der Moment meistens nach vorn, erst vor das Scrollen, später vor das Entsperren." },
        { q: "Abends auf dem Sofa ist das Handy meine einzige Pause. Soll ich mir die auch noch nehmen?", a: "Nein. Mach den Abend zur Ausnahme: ein längeres, bewusstes Fenster mit einem Ende, das du vorher festlegst, zum Beispiel 21:30 Uhr. Dann ist es eine Pause, die du dir gönnst, und du rutschst nicht bis Mitternacht hinein, ohne es zu wollen." }
      ],
      workbookDays: [10],
      today: "Dein Handy bekommt heute Abend einen neuen Schlafplatz, außerhalb von Schlafzimmer und Bad, mit Zettel und Stift daneben. Ins erste Check-Fenster schaust du morgen früh erst, wenn du angezogen bist."
    },
    {
      number: 7,
      title: "Die ersten drei Bissen",
      chapter: 7,
      chapterTitle: "Essen, ohne nebenbei zu essen",
      step: "H",
      duration: "etwa 1 Minute",
      summary: "Handy umdrehen, ein langer Atemzug, dann drei Bissen: Geschmack, Konsistenz, Hunger. Danach isst du weiter wie immer.",
      intro: "Eine ganze Mahlzeit von Anfang bis Ende achtsam zu essen, schafft an einem normalen Arbeitstag kaum jemand, ich auch nicht. Deshalb beschränkt sich die Übung auf die ersten drei Bissen, und sie dauert etwa eine Minute.",
      steps: [
        { title: "Bevor du anfängst, dreh das Handy um oder schieb es ein Stück weg.", text: "Nur für die nächste Minute, danach darf es zurück." },
        { title: "Ein langer Atemzug,", text: "so wie beim langen Ausatmen aus Kapitel 2. Mehr Vorbereitung braucht es nicht." },
        { title: "Erster Bissen: Geschmack.", text: "Salzig, süß, sauer, würzig, fad? Warm oder kalt? Du musst nichts benennen können, bemerken reicht." },
        { title: "Zweiter Bissen: Konsistenz.", text: "Knusprig, weich, zäh, cremig. Hörst du dich kauen?" },
        { title: "Dritter Bissen: Hunger.", text: "Wie hungrig bist du gerade: sehr, etwas oder kaum? Nur feststellen, daraus folgt keine Regel." },
        { title: "Danach isst du weiter, wie du willst,", text: "mit Handy, Gespräch oder Mails. Wenn es passt, spürst du ungefähr in der Mitte der Mahlzeit noch einmal kurz nach, wie hungrig du noch bist." }
      ],
      minimal: "Für schlechte Tage gibt es eine Minimalversion: nur der erste Bissen. Das Handy bleibt liegen, wo es liegt, du schmeckst einen Bissen lang und bist fertig.",
      caution: "Für Menschen, die eine Essstörung haben oder hatten oder für die Essen seit Langem mit Angst, Schuldgefühlen oder strengen Regeln verbunden ist, kann genaues Beobachten beim Essen den Druck erhöhen. Dann lass diese Übung bitte weg und sprich mit deiner Hausärztin oder deinem Hausarzt oder mit einer psychotherapeutischen Praxis; Termine vermittelt auch die 116117.",
      faq: [
        { q: "Ich esse mittags mit Kolleginnen. Soll ich da schweigend auf meinem Bissen herumkauen?", a: "Die drei Bissen passen in die ersten Sätze eines Gesprächs, während jemand anderes erzählt. Niemand am Tisch wird merken, dass du gerade auf die Konsistenz deiner Nudeln achtest. Wenn dich Gespräche schnell mitreißen, nimm den ersten Bissen gleich nach dem Hinsetzen, noch bevor die Unterhaltung richtig losgeht." },
        { q: "Beim ersten Bissen bin ich in Gedanken schon wieder im Postfach. Zählt das dann überhaupt?", a: "Ja. Das Abschweifen ist eingeplant, es gehört zur Übung dazu. Nimm den nächsten Bissen als neuen ersten. Wenn ein bestimmter Gedanke immer wieder dazwischenfunkt, gib ihm kurz das Gedanken-Etikett aus Kapitel 3 und kehr zum Teller zurück." },
        { q: "Wenn ich genau hinschmecke, schmeckt mein Essen nach nichts. Mache ich etwas falsch?", a: "Das ist erst einmal eine Information. Renate hat auf diese Weise gemerkt, dass sie ein Brot kaufte, das sie nicht mochte. Manchmal liegt es auch am Tag: Wer sehr müde oder angespannt ist, schmeckt oft weniger. Notier dir das ohne Bewertung und schau am nächsten Tag wieder hin." },
        { q: "Ich esse oft im Gehen oder im Auto. Geht die Übung da auch?", a: "Im Gehen ja, am besten im Stehen an der Haltestelle oder vor der Bürotür, bevor du losläufst. Im Auto nur, wenn es steht und der Motor aus ist. Beim Fahren gehört die Aufmerksamkeit auf die Straße, und das ist wichtiger als jeder Bissen." }
      ],
      workbookDays: [11],
      today: "Für morgen reicht eine einzige Mahlzeit, die ohnehin stattfindet, am besten die, bei der du am häufigsten nebenher liest. Leg einen Zettel mit den Worten „Geschmack, Konsistenz, Hunger“ neben den Teller oder unter die Tastatur. Nach drei Bissen ist die Übung für diesen Tag erledigt."
    },
    {
      number: 8,
      title: "Die Draußen-Runde",
      chapter: 8,
      chapterTitle: "Raus aus dem Kopf, rein in den Körper",
      step: "U",
      duration: "3 bis 5 Minuten",
      summary: "Raus vor die Tür: Füße, Schultern und Atem, drei Dinge von draußen, kurzer Check an der Tür.",
      intro: "Die Draußen-Runde dauert drei bis fünf Minuten und braucht kein Grün im großen Stil. Ein Hinterhof mit einer Birke reicht, ein Balkon, der Weg zur Bäckerei.",
      steps: [
        { title: "Raus.", text: "Steh auf, zieh Schuhe an und geh vor die Tür, auf den Balkon oder in den Hof. Das Handy bleibt drinnen oder stumm in der Tasche.", seconds: 30 },
        { title: "Erste Minute: die Füße.", text: "Spür beim Gehen, wie die Ferse aufsetzt und wie der Boden ist, Asphalt, Kies, Laub, nasse Fliesen.", seconds: 60 },
        { title: "Schultern und Atem.", text: "Zieh die Schultern einmal hoch bis zu den Ohren und lass sie fallen. Neig den Kopf langsam zu jeder Seite, so weit es angenehm ist. Dazu zwei-, dreimal das lange Ausatmen aus Kapitel 2.", seconds: 45 },
        { title: "Drei Dinge von draußen.", text: "Ein Geräusch, etwas auf der Haut (Wind, Kälte, Sonne, Regen) und etwas Grünes, und sei es das Unkraut in einer Pflasterfuge.", seconds: 60 },
        { title: "Zurück, und an der Tür kurz innehalten.", text: "Wie fühlt sich der Nacken jetzt an? Nur registrieren, dann weiterarbeiten.", seconds: 45 }
      ],
      minimal: "Die Minimalversion für schlechte Tage: Fenster auf, Kopf hinaus, drei Atemzüge und ein Geräusch bemerken, fertig.",
      tip: "Wenn du einen festen Auslöser brauchst, häng die Runde an etwas, das ohnehin passiert: eine verschickte Datei, das Ende einer Videokonferenz, den Kaffee am Nachmittag. Und wenn du an einem Tag länger Zeit hast, bleib länger draußen, die Studien sprechen eher für zwanzig Minuten als für fünf.",
      faq: [
        { q: "Bei mir gibt es draußen nur Parkplatz und Hauptstraße. Bringt das dann überhaupt etwas?", a: "Für den Körperteil der Übung ja: Füße, Schultern und Atem funktionieren auch neben einem Parkscheinautomaten. Beim Grübeln fand die Studie von Bratman einen Effekt nur nach dem Spaziergang im Grünen, also lohnt es sich, in die grünste Richtung zu gehen, die es gibt. Oft ist das ein einzelner Straßenbaum oder ein Innenhof, den man nie beachtet hat." },
        { q: "Im Homeoffice komme ich nicht weg, ständig ploppen Nachrichten auf.", a: "Setz deinen Status für fünf Minuten auf abwesend. Die allermeisten Nachrichten überstehen fünf Minuten ohne Antwort, und wer wirklich etwas Dringendes hat, ruft an. Wenn dein Job tatsächlich keine fünf Minuten Abwesenheit erlaubt, nimm die Minimalversion am Fenster." },
        { q: "Der Nacken tut trotzdem weh, auch nach Wochen.", a: "Die Draußen-Runde ist keine Behandlung. Wenn Schmerzen über Wochen bleiben, in den Arm ausstrahlen oder Kribbeln und Taubheit dazukommen, lass das bitte bei deiner Hausärztin oder deinem Hausarzt anschauen." },
        { q: "Bei Regen habe ich einfach keine Lust.", a: "Das verstehe ich gut. Regen gehört trotzdem zu den Dingen, die man auf der Haut spüren kann, und er klingt auf jedem Untergrund anders. Nimm einen Schirm, bleib unter dem Vordach stehen oder mach an solchen Tagen die Minimalversion." }
      ],
      workbookDays: [12, 13],
      today: "Für morgen brauchst du nur einen Auslöser, einen Moment, der sowieso kommt. Stell die Schuhe schon heute Abend dorthin, wo du sie dann siehst. Eine einzige Runde reicht für den ersten Tag, auch wenn sie nur bis zum Briefkasten vor dem Haus führt."
    },
    {
      number: 9,
      title: "Die freundliche Pause",
      chapter: 9,
      chapterTitle: "Freundlich mit dir selbst",
      step: "H",
      duration: "2 bis 3 Minuten",
      summary: "Den harten Satz einfangen, Hand und Atem, die Gegenfrage, der Satz mit deinem Namen, ein nächster Schritt.",
      intro: "Die freundliche Pause dauert zwei bis drei Minuten und passt an jeden Ort, an dem du kurz allein bist, notfalls auf eine Toilette. Du brauchst sie in dem Moment, in dem du merkst, dass du innerlich über dich herfällst.",
      steps: [
        { title: "Den Satz einfangen.", text: "Halte den harten Satz so wörtlich fest, wie er in deinem Kopf klingt, halblaut oder auf einem Zettel: „Wie kann man nur so blöd sein.“" },
        { title: "Hand und Atem.", text: "Leg eine Hand auf das Brustbein oder auf den Unterarm, wenn dir das angenehm ist, sonst beide Hände flach auf den Tisch. Dazu zweimal das lange Ausatmen aus Kapitel 2." },
        { title: "Die Gegenfrage.", text: "Würdest du so mit einer Freundin oder Kollegin reden, der genau das passiert ist? Was würdest du ihr stattdessen sagen?" },
        { title: "Der Satz mit deinem Namen.", text: "Sag dir genau das, mit deinem Vornamen und in der Du-Form. Bei mir klingt das etwa so: „Sarah, das war ärgerlich, und es passiert anderen genauso.“" },
        { title: "Ein nächster Schritt.", text: "Was ist jetzt dran: ein Rückruf, eine Korrektur, eine Entschuldigung? Manchmal ist die Antwort auch, dass nichts mehr zu tun ist." }
      ],
      minimal: "Für schlechte Tage reicht Schritt 4 allein, ein einziger Satz mit deinem Namen, zur Not nur gedacht.",
      faq: [
        { q: "Wenn ich nett zu mir bin, werde ich nachlässig. Brauche ich die Strenge nicht, um gut zu arbeiten?", a: "Die Sorge ist verständlich, und viele Menschen haben sie. Schau dir aber an, was die Strenge in der Situation selbst tut: Bei Sonja hat sie den Rückruf verzögert. In den Studien von Kross schnitten diejenigen besser ab, die mehr Abstand zu sich hatten. Schritt 5 gehört außerdem fest zur Übung, der Fehler wird also nicht schöngeredet." },
        { q: "Mit meinem eigenen Namen mit mir zu reden, kommt mir albern vor.", a: "Das geht fast allen so, und es lässt nach. Du kannst den Satz auch nur denken oder aufschreiben, die Wirkung hängt nicht an der Lautstärke. Wenn dir dein Vorname zu fremd klingt, nimm den Spitznamen, mit dem dich deine Familie ruft." },
        { q: "Mir fällt in dem Moment einfach kein freundlicher Satz ein.", a: "Dann nimm einen, der immer passt: „Das war schwer, und es passiert nicht nur dir.“ Du darfst ihn so lange ausleihen, bis dir eigene einfallen." },
        { q: "Bei mir ist die harte Stimme fast den ganzen Tag da.", a: "Wenn Selbstkritik dich über Wochen begleitet, dich nachts wach hält oder deine Stimmung dauerhaft drückt, ist das mehr, als eine Übung auffangen kann. Sprich dann mit deiner Hausärztin oder deinem Hausarzt oder such dir eine psychotherapeutische Praxis; Termine vermittelt auch die 116117. Wenn Gedanken dazukommen, dass alles keinen Sinn mehr hat, ruf bitte noch am selben Tag die TelefonSeelsorge an, kostenfrei und rund um die Uhr unter 0800 111 0 111." }
      ],
      workbookDays: [15],
      today: "Für die nächsten Tage genügt ein einziger Moment, in dem du innerlich über dich schimpfst: Schreib den Satz wörtlich auf. Mehr musst du beim ersten Mal nicht tun. Wenn du danach noch Luft hast, probier die Frage meiner Schwester an diesem Satz aus."
    },
    {
      number: 10,
      title: "Die Zehn-Sekunden-Antwort",
      chapter: 10,
      chapterTitle: "Zuhören, streiten, zusammenleben",
      step: "E",
      duration: "10 Sekunden",
      summary: "Spüren, ausatmen, innerlich wiederholen, dann zurückgeben, nachfragen oder vertagen. Erst danach sprechen.",
      intro: "Zehn Sekunden sind eine willkürliche Zahl, aber eine praktische. Sie reichen für einen langen Atemzug und einen Satz im Kopf, und sie sind kurz genug, dass am Tisch niemand eine peinliche Stille bemerkt. Vorbereitung brauchst du keine, nur den Vorsatz, es beim nächsten spitzen Satz einmal zu versuchen.",
      steps: [
        { title: "Spüren.", text: "Achte auf das Zeichen, dass eine Antwort schon startbereit ist: warmes Gesicht, fester Kiefer, der erste Satz liegt fertig im Mund. Das ist dein Registrieren." },
        { title: "Ausatmen.", text: "Ein einziger Atemzug aus dem langen Ausatmen in Kapitel 2, also nur eine Runde der Übung. Das ist von außen kaum zu sehen." },
        { title: "Wiederholen.", text: "Sag dir im Kopf in einem Satz, was der andere gerade gesagt hat, möglichst mit seinen Worten: „Er will, dass das Handy vom Tisch kommt.“ Keine Deutung, noch keine Gegenrede." },
        { title: "Wählen.", text: "Entscheide dich für eine von drei Antworten. Du kannst zurückgeben („Du meinst, dass …?“), nachfragen („Was ärgert dich daran am meisten?“) oder vertagen („Ich will dir das nicht im Ärger beantworten. Nach dem Essen, um halb acht?“)." },
        { title: "Sprechen.", text: "Erst jetzt antwortest du. Und wenn dann doch der alte Satz herauskommt, hast du ihn diesmal wenigstens kommen sehen." }
      ],
      minimal: "An Tagen, an denen gar nichts geht, bleibt die Minimalversion: nur Schritt 2, einmal ausatmen, bevor du antwortest. Mit Kindern hilft außerdem ein Satz, der die Pause ankündigt, etwa „Moment, ich denk kurz nach.“ Das klingt banal und verschafft dir trotzdem die zehn Sekunden, ohne dass jemand glaubt, du würdest schmollen.",
      faq: [
        { q: "Und wenn der andere die Pause als Schweigen oder Arroganz versteht?", a: "Dann sag, was du tust. „Ich will dir richtig antworten, gib mir einen Moment“ ist ein vollständiger Satz, und die meisten Menschen können damit gut leben. Gibt es trotzdem Streit über die Pause, sprich das an einem ruhigen Abend ohne akuten Anlass an und erklär kurz, was du gerade ausprobierst." },
        { q: "Was, wenn ich einfach recht habe?", a: "Das kann gut sein. Die Zehn-Sekunden-Antwort verschiebt dein Argument auf einen Zeitpunkt, an dem der andere es auch hören kann. Nach der Versuchsreihe von Itzchakov ist das eher der Moment, nachdem er sich selbst gehört gefühlt hat." },
        { q: "Mein Dreizehnjähriger knallt die Tür, bevor ich überhaupt zehn Sekunden habe.", a: "Dann ist die zugeknallte Tür deine Pause. Geh nicht hinterher, solange du selbst noch auf hundertachtzig bist. Klopf zwanzig Minuten später und nimm eine Antwort aus Schritt 4 mit, am besten das Nachfragen. Viele Jugendliche reden leichter, wenn man nebeneinander etwas tut, beim Autofahren oder Abtrocknen, als wenn man ihnen gegenübersitzt." },
        { q: "Wir streiten immer wieder über dasselbe, und es wird schlimmer.", a: "Dann ist ein Werkzeug für zehn Sekunden zu klein. Wiederkehrende Konflikte, die sich zuspitzen, sind in einer Paar- oder Familienberatung gut aufgehoben; Ehe-, Familien- und Lebensberatungsstellen gibt es in fast jeder Stadt, oft in kirchlicher oder kommunaler Trägerschaft und für wenig oder gar kein Geld. Wenn du in einem Streit Angst bekommst oder dich bedroht fühlst, geht deine Sicherheit jedem Gespräch vor. Rund um die Uhr, kostenlos und anonym erreichst du dann das Hilfetelefon „Gewalt gegen Frauen“ unter 116 016, in akuter Gefahr den Notruf 112." }
      ],
      workbookDays: [16, 17],
      today: "Zum Ausprobieren reicht eine einzige Mahlzeit in den nächsten Tagen, bei der ohnehin alle am Tisch sitzen. Der Vorsatz gilt nur für diese Mahlzeit: bei der ersten Antwort, die dir zu schnell vorkommt, einmal ausatmen."
    },
    {
      number: 11,
      title: "Der Abendabschluss",
      chapter: 11,
      chapterTitle: "Abends abschalten, nachts schlafen",
      step: "E",
      duration: "höchstens 5 Minuten",
      summary: "Am Tisch, vor dem Zähneputzen: alles Offene aufschreiben, den ersten Handgriff markieren, „Für heute ist zu.“",
      intro: "Der Abendabschluss findet außerhalb des Bettes statt, am besten an einem festen Ort, etwa dem Küchentisch, und immer ungefähr zur selben Zeit, vor dem Zähneputzen. Er dauert höchstens fünf Minuten. Du brauchst Papier und einen Stift; das Handy bleibt dabei weg, weil du sonst beim Notieren im Posteingang landest.",
      steps: [
        { title: "Hinsetzen und Zeit begrenzen.", text: "Nimm dir vier Minuten, gern mit dem Küchenwecker, und atme einmal lang aus, bevor du anfängst." },
        { title: "Alles Offene aufschreiben.", text: "Notiere, was in den nächsten Tagen ansteht, so konkret wie möglich: wer, was, wann. „Steuer“ ist zu vage, „Donnerstag 18 Uhr Belege für die Steuer in den grünen Ordner“ ist gut." },
        { title: "Den ersten Handgriff markieren.", text: "Bei dem Punkt, der am meisten drückt, schreibst du dazu, was du morgen als Allererstes dafür tust. Das darf winzig sein." },
        { title: "Den Tag schließen.", text: "Leg den Zettel an die Stelle, an der du morgens als Erstes vorbeikommst, und sag dir halblaut: „Für heute ist zu.“ Das ist deine Entscheidung." },
        { title: "Im Bett nur noch verweisen.", text: "Wenn ein Punkt von der Liste zurückkommt, gib ihm das Etikett „Planen“ aus Kapitel 3 und sag dir: „Steht auf dem Zettel.“ Dann atme ein paarmal lang aus wie in Kapitel 2." }
      ],
      minimal: "Die Minimalversion für schlechte Abende: drei Stichworte auf irgendeinen Zettel, zur Not auf einen Kassenbon, und der Satz aus Schritt 4.",
      caution: "Wer seit Monaten in mehreren Nächten pro Woche lange wach liegt oder nachts aufwacht und nicht wieder einschläft und tagsüber darunter leidet, braucht mehr als einen Zettel. Dafür gibt es eine gut untersuchte Behandlung, die kognitive Verhaltenstherapie bei Schlaflosigkeit, kurz KVT-I, die es inzwischen auch als digitale Programme auf Rezept gibt. Der erste Weg führt über die Hausarztpraxis, die auch andere Ursachen ausschließen kann.",
      faq: [
        { q: "Mir fallen im Bett trotzdem neue Dinge ein.", a: "Das ist normal, vor allem in den ersten Tagen. Leg einen Stift und einen Zettel auf den Nachttisch und schreib im Halbdunkel nur ein Stichwort auf, ohne das große Licht und ohne Handy. Morgens kommt es auf die richtige Liste. Nach ein, zwei Wochen wird der Nachttischzettel meistens kürzer, weil der Kopf gelernt hat, dass abends ohnehin alles eingesammelt wird." },
        { q: "Und wenn mich keine Aufgabe wachhält, eher eine echte Sorge?", a: "Eine Sorge lässt sich nicht abhaken, aber sie kann einen Termin bekommen. Schreib auf den Zettel, wann du dich morgen damit beschäftigst: „Morgen 17 Uhr, zehn Minuten über Mamas Befund nachdenken“ oder „Samstag mit Anke über das Geld reden“. Wenn Sorgen dich über Wochen nachts wachhalten und tagsüber nicht mehr loslassen, ist das ein guter Grund, mit der Hausärztin oder einer Psychotherapeutin zu sprechen; Termine vermittelt auch die 116117." },
        { q: "Ich schlafe gut ein, aber um drei geht es los.", a: "Dann gilt dasselbe wie beim Einschlafen: das Stichwort auf den Nachttischzettel, dann ein paarmal lang ausatmen. Wenn du nach einer gefühlten Viertelstunde noch hellwach bist, steh auf, setz dich bei gedämpftem Licht an einen anderen Ort, lies etwas Langweiliges und geh zurück ins Bett, sobald du müde wirst. Auf die Uhr schauen hilft dabei selten." },
        { q: "Abends ist die einzige Zeit, in der mein Partner und ich reden.", a: "Dann redet. Den Abendabschluss kannst du vorziehen, auf neun oder halb zehn, und schwierige Themen wie Geld oder Schwiegereltern verlegt ihr, wenn es geht, auf einen Zeitpunkt vor dem Abendessen. Nach meiner Erfahrung beginnt nach zehn Uhr kaum ein Gespräch über Geld ruhig." }
      ],
      workbookDays: [18, 19],
      today: "Für heute Abend genügt ein Handgriff, bevor du dieses Buch zuklappst: ein Zettel und ein Stift an dem Platz, an dem du morgen den Abendabschluss machen willst."
    },
    {
      number: 12,
      title: "Der Sonntags-Check",
      chapter: 12,
      chapterTitle: "Gelassen bleiben, wenn das Leben voll ist",
      step: "RUHE",
      duration: "beim ersten Mal etwa 10 Minuten, danach um die 5",
      summary: "Die ganze RUHE-Schleife auf die kommende Woche: ein Wort, drei Ausatmer, drei Zeilen, eine Sache kleiner, eine für dich.",
      intro: "Der Sonntags-Check ist die ganze RUHE-Schleife, einmal pro Woche und auf die kommenden sieben Tage angewendet. Beim ersten Mal dauert er etwa zehn Minuten, danach um die fünf. Sonntag ist nur ein Vorschlag; wer sonntags arbeitet, nimmt einen anderen festen Tag. Du brauchst deinen Kalender oder einen Wochenzettel und einen Stift.",
      steps: [
        { title: "Registrieren.", text: "Lies die kommende Woche einmal von Montag bis Sonntag durch und schreib ein einziges Wort daneben, das beschreibt, wie sie sich anfühlt: eng, machbar, voll, unklar." },
        { title: "Umschalten.", text: "Drei lange Ausatmer wie in Kapitel 2." },
        { title: "Hinschauen.", text: "Schreib drei Zeilen. Zeit: An welchem Tag ist die Woche zu voll? Geld: Welche Zahlung oder Geldfrage steht an, und wann schaust du sie dir an? Pflichten: Was davon musst wirklich du selbst erledigen?" },
        { title: "Entscheiden.", text: "Eine Sache wird kleiner. Du streichst sie, verschiebst sie, gibst sie ab, tauschst sie oder kaufst dir, wenn es geht, die Zeit dafür. Und eine Sache kommt dazu, die nur dir gehört, mit Tag und Uhrzeit." },
        { title: "Ein Werkzeug mitnehmen.", text: "Wähle ein Werkzeug aus diesem Buch für die Woche und häng es an einen festen Moment, zum Beispiel den RUHE-Stopp an den ersten Kaffee oder die Zehn-Sekunden-Antwort an das Abendessen." }
      ],
      minimal: "Die Minimalversion für volle Wochen besteht aus einer einzigen Zeile: „Diese Woche lasse ich weg: …“ Wenn du nur diese Zeile schreibst, hast du den Check gemacht.",
      tip: "Wenn du das Workbook bis Tag 21 durchgearbeitet hast, genügt für die Zeit danach ein kleiner Plan. Der Sonntags-Check bleibt als wöchentlicher Termin. Dazu kommen ein oder zwei Werkzeuge, die bei dir am besten funktioniert haben, jedes an einen festen Moment im Alltag gehängt. Wenn du aussteigst, und das wirst du, fängst du mit der Minimalversion wieder an.",
      faq: [
        { q: "Am Sonntag habe ich keine fünf Minuten.", a: "Dann nimm einen anderen Tag oder einen anderen Ort, etwa Freitag in der S-Bahn. Und wenn es gar nicht geht, bleibt die eine Zeile der Minimalversion, die du auch im Stehen an der Kaffeemaschine schreiben kannst." },
        { q: "Zeit kaufen kann ich mir nicht leisten.", a: "Das geht vielen so. Die Wege ohne Geld aus dem Abschnitt über gekaufte Zeit zählen im Sonntags-Check genauso. Wenn das Geld dauerhaft nicht reicht, ist eine Schuldner- oder Sozialberatung der richtige nächste Schritt." },
        { q: "Meine Liste ist nach dem Check genauso lang wie vorher.", a: "Das ist in den ersten Wochen häufig. Der Check bringt die Liste in eine Reihenfolge und nimmt jede Woche eine Sache heraus. Nach einem Monat sind das vier Dinge, die du nicht mehr tragen musst." },
        { q: "Ich habe das Buch durch und schon wieder die Hälfte vergessen.", a: "Das ist normal. Such dir das eine Werkzeug aus, an das du dich noch am besten erinnerst, und fang damit an. Wahrscheinlich hat es dir schon beim Lesen eingeleuchtet." }
      ],
      workbookDays: [20, 21],
      today: "Bevor du das Buch weglegst, trag für den kommenden Sonntag eine Uhrzeit in deinen Kalender ein, die es in deinem Leben wirklich gibt, auch wenn es 21:40 Uhr ist. Daneben schreibst du nur: „Fünf Minuten, eine Sache weniger.“"
    }
  ],

  workbookIntro: "Das Workbook ist das Übungsheft zum Buch. Es führt dich in drei Wochen durch die zwölf Werkzeuge, jeden Tag mit einer kleinen Portion. Rechne mit fünf Minuten am Tag, an manchen Tagen weniger. Tag 7 und Tag 14 sind Ruhetage ohne neues Werkzeug. Wenn du einen Tag auslässt, machst du am nächsten einfach weiter. Die 21 Tage müssen nicht am Stück passieren, und niemand prüft nach.",

  weeks: [
    { number: 1, title: "Ankommen im Jetzt" },
    { number: 2, title: "Ruhe in den Alltag holen" },
    { number: 3, title: "Freundlich bleiben, auch wenn es voll wird" }
  ],

  days: [
    { number: 1, week: 1, title: "Der erste Stopp", tool: 1, chapter: "Kapitel 1 – Achtsamkeit ohne Räucherstäbchen",
      impulse: "Such dir heute einen Gegenstand, an dem du jeden Morgen vorbeikommst: Kaffeemaschine, Wohnungstür, Autoschlüssel.", impulseBenefit: "gibt deinem Vorsatz einen festen Ort, damit du ihn nicht behalten musst",
      exercise: "Mach dort heute einmal probehalber den RUHE-Stopp: Stopp sagen, lang ausatmen, drei kurze Antworten auf „Was passiert, was spüre ich, was denke ich?“, ein nächster Schritt. Leg einen Zettel dazu, damit er dich morgen früh erinnert.", exerciseBenefit: "verschafft dir den ersten bewussten Moment des Tages",
      question: "Woran habe ich heute gedacht, während ich etwas ganz anderes getan habe?", questionBenefit: "verrät, wohin dein Autopilot am liebsten wandert" },
    { number: 2, week: 1, title: "Autopilot-Spuren", tool: 1, chapter: "Kapitel 1 – Achtsamkeit ohne Räucherstäbchen",
      impulse: "Der Autopilot hinterlässt Lücken: der Weg zur Arbeit, von dem nichts übrig ist, das Frühstück ohne Geschmack.", impulseBenefit: "macht aus einem Ärgernis ein brauchbares Signal",
      exercise: "Mach den RUHE-Stopp heute zweimal, einmal am Morgen und einmal an einem zweiten festen Punkt, etwa beim Händewaschen nach der Mittagspause.", exerciseBenefit: "trainiert das Registrieren auch dann, wenn der Tag schon läuft",
      question: "Welche Minute von heute weiß ich noch ganz genau, und was war an ihr anders?", questionBenefit: "zeigt dir, unter welchen Umständen du ohnehin dabei bist" },
    { number: 3, week: 1, title: "Länger aus als ein", tool: 2, chapter: "Kapitel 2 – Der Atem als Bremse",
      impulse: "Beim Einatmen fährt der Körper leicht hoch, beim Ausatmen wieder runter. Das kannst du nutzen.", impulseBenefit: "erklärt dir, warum ausgerechnet das Ausatmen die Bremse ist",
      exercise: "Übe das lange Ausatmen einmal in Ruhe: vier Zähler ein, sechs bis acht aus, fünf Runden. Setz es danach einmal in einem angespannten Moment ein, im Stau, in der Schlange, vor einem Anruf.", exerciseBenefit: "macht die Technik so vertraut, dass sie im Ernstfall ohne Nachdenken klappt",
      question: "Wann war mein Atem heute am kürzesten, und was war da los?", questionBenefit: "macht deine typischen Hochfahr-Momente sichtbar" },
    { number: 4, week: 1, title: "Ein Etikett für die Schleife", tool: 3, chapter: "Kapitel 3 – Wenn der Kopf nicht aufhört",
      impulse: "Ein Gedanke, der zum fünften Mal kommt, bringt selten etwas Neues mit. Er wiederholt sich.", impulseBenefit: "nimmt dem Grübeln den Anschein, es sei Nachdenken",
      exercise: "Wenn heute ein Gedanke zurückkommt, gib ihm ein Etikett für seine Sorte: Nachspielen, Sorgen, Bewerten, Rechtfertigen oder Planen.", exerciseBenefit: "schafft ein paar Sekunden Abstand zwischen dir und dem Gedanken",
      question: "Welches Etikett habe ich heute am häufigsten vergeben?", questionBenefit: "lässt erkennen, welche Art Grübeln bei dir vorherrscht" },
    { number: 5, week: 1, title: "Ein Wort für das Gefühl", tool: 3, chapter: "Kapitel 3 – Wenn der Kopf nicht aufhört",
      impulse: "„Schlecht“ fasst viele Gefühle in einem Wort zusammen. Je genauer das Wort, desto leichter lässt sich das Gefühl anschauen.", impulseBenefit: "lädt dich ein, genauer hinzusehen",
      exercise: "Ergänze das Gedanken-Etikett heute um ein einzelnes Gefühlswort: gekränkt, verunsichert, ärgerlich, beschämt, müde. Gibt es etwas zu tun, schreib den einen Schritt mit Tag und Uhrzeit auf.", exerciseBenefit: "trennt das, was sich lösen lässt, von dem, was nur gefühlt werden will",
      question: "Welches Gefühlswort hat heute am besten gepasst, und hat es etwas verändert?", questionBenefit: "erweitert deinen Wortschatz für das, was in dir los ist" },
    { number: 6, week: 1, title: "Fünf Minuten sitzen", tool: 4, chapter: "Kapitel 4 – Meditation für Leute ohne Zeit",
      impulse: "Beim Meditieren geht es ums Zurückkommen. Jedes Mal, wenn du merkst, dass du woanders bist, hast du geübt.", impulseBenefit: "nimmt dir den Druck, einen leeren Kopf haben zu müssen",
      exercise: "Setz dich direkt nach einer festen Tätigkeit fünf Minuten hin, Timer an, und bleib mit der Aufmerksamkeit an einer Stelle, an der du den Atem spürst. Wanderst du ab, ein Wort, dann zurück.", exerciseBenefit: "übt genau die Fähigkeit, die alle anderen Werkzeuge brauchen",
      question: "Was war heute beim Sitzen am häufigsten da?", questionBenefit: "macht das Thema sichtbar, das gerade im Vordergrund steht" },
    { number: 7, week: 1, title: "Ruhetag: Rückblick auf Woche 1", tool: null, restDay: true, chapter: "Kapitel 1 bis 4",
      impulse: "Heute kommt nichts Neues dazu. Du schaust nur zurück.", impulseBenefit: "gibt dem, was du ausprobiert hast, Zeit zum Setzen",
      exercise: "Lies deine Notizen von Tag 1 bis 6 durch und kreis das Werkzeug ein, das sich am natürlichsten angefühlt hat. Wenn du magst, mach nur den RUHE-Stopp.", exerciseBenefit: "zeigt dir, womit du am leichtesten dranbleibst",
      question: "Was hat in dieser Woche besser geklappt, als ich erwartet hätte?", questionBenefit: "lenkt den Blick auf das, was schon funktioniert" },
    { number: 8, week: 2, title: "Aufgaben sauber verlassen", tool: 5, chapter: "Kapitel 5 – Achtsam arbeiten",
      impulse: "Wer mitten in einer Aufgabe zur nächsten springt, nimmt einen Teil der alten mit. Das kostet Konzentration.", impulseBenefit: "erklärt, warum du dich nach vielen Wechseln zerstreut fühlst",
      exercise: "Such dir heute einen Wechsel aus, am besten den schwierigsten, und schreib vorher zwei Zeilen: „Stand:“ und „Als Nächstes:“ mit einem Verb am Anfang. Leg den Zettel dorthin, wo du beim Wiedereinstieg zuerst hinschaust.", exerciseBenefit: "lässt die alte Aufgabe los, ohne dass etwas verloren geht",
      question: "Wie schnell war ich nach dem Wechsel wieder drin, verglichen mit sonst?", questionBenefit: "prüft, ob sich die Minute für dich lohnt" },
    { number: 9, week: 2, title: "Feierabend", tool: 5, chapter: "Kapitel 5 – Achtsam arbeiten",
      impulse: "Der schwierigste Übergang des Tages ist oft der zwischen Arbeit und Zuhause.", impulseBenefit: "lenkt deine Aufmerksamkeit auf einen oft übersehenen Moment",
      exercise: "Mach heute zum Feierabend eine Übergangsnotiz für morgen früh und schreib darunter einen Satz für den Abend, zum Beispiel „Jetzt: kochen und zuhören.“", exerciseBenefit: "lässt die Arbeit am Arbeitsplatz liegen",
      question: "Wie viel von meinem Arbeitstag war heute Abend noch in meinem Kopf?", questionBenefit: "macht sichtbar, ob der Abschluss funktioniert" },
    { number: 10, week: 2, title: "Striche zählen", tool: 6, chapter: "Kapitel 6 – Das Handy und du",
      impulse: "Der Griff zum Handy passiert meist, bevor du dich dafür entschieden hast.", impulseBenefit: "macht aus einem Reflex etwas, das du sehen kannst",
      exercise: "Leg drei Check-Fenster mit Uhrzeit fest. Dazwischen liegt das Handy außer Sichtweite, und jeder Griff bekommt einen Strich auf einem Zettel.", exerciseBenefit: "zeigt dir, wie oft und wann der Reflex zuschlägt",
      question: "Wie viele Striche waren es, und was wollte ich in diesen Momenten eigentlich?", questionBenefit: "verrät, wovor der Griff dich bewahren soll" },
    { number: 11, week: 2, title: "Drei Bissen", tool: 7, chapter: "Kapitel 7 – Essen, ohne nebenbei zu essen",
      impulse: "Beim Essen nebenbei bekommt der Kopf wenig davon mit, was du gegessen hast.", impulseBenefit: "erinnert daran, dass Essen auch Genuss ist",
      exercise: "Dreh bei einer Mahlzeit das Handy um und achte bei den ersten drei Bissen nacheinander auf Geschmack, Konsistenz und darauf, wie hungrig du gerade bist. Danach isst du weiter wie immer.", exerciseBenefit: "bringt Geschmack und Sattsein zurück in deine Wahrnehmung",
      question: "Was habe ich bei den drei Bissen bemerkt, das mir sonst entgeht?", questionBenefit: "macht spürbar, wie viel eine Minute Aufmerksamkeit ausmacht" },
    { number: 12, week: 2, title: "Einmal vor die Tür", tool: 8, chapter: "Kapitel 8 – Raus aus dem Kopf, rein in den Körper",
      impulse: "Nach Stunden am Bildschirm meldet sich der Körper oft nur noch über den Nacken.", impulseBenefit: "macht dir bewusst, wie wenig du vom Körper mitbekommst",
      exercise: "Mach heute die Draußen-Runde: drei bis fünf Minuten raus, die Füße spüren, Schultern hochziehen und fallen lassen, ein Geräusch, etwas auf der Haut, etwas Grünes.", exerciseBenefit: "holt dich aus dem Kopf zurück in den Körper",
      question: "Wie hat sich mein Nacken vor und nach der Runde angefühlt?", questionBenefit: "macht den Unterschied spürbar und damit wiederholbar" },
    { number: 13, week: 2, title: "Ein fester Auslöser", tool: 8, chapter: "Kapitel 8 – Raus aus dem Kopf, rein in den Körper",
      impulse: "Was an einem festen Moment hängt, passiert auch an vollen Tagen.", impulseBenefit: "macht die Runde unabhängig von deiner Tagesform",
      exercise: "Häng die Draußen-Runde an etwas, das ohnehin passiert: eine verschickte Datei, das Ende einer Videokonferenz, den Kaffee am Nachmittag. Wenn du Zeit hast, bleib länger draußen.", exerciseBenefit: "hängt die Runde an etwas, das sowieso passiert",
      question: "Welcher Auslöser passt in meinen Tag am besten?", questionBenefit: "hilft dir, die Runde dauerhaft einzubauen" },
    { number: 14, week: 2, title: "Ruhetag: Rückblick auf Woche 2", tool: null, restDay: true, chapter: "Kapitel 5 bis 8",
      impulse: "Zur Hälfte darfst du einmal durchatmen und nichts Neues anfangen.", impulseBenefit: "nimmt Tempo raus, bevor die letzte Woche beginnt",
      exercise: "Blättere durch Tag 8 bis 13 und streich ein Werkzeug, das für dich gerade nicht passt. Das ist erlaubt.", exerciseBenefit: "macht Platz für das, was bei dir wirklich funktioniert",
      question: "Welches Werkzeug nutze ich inzwischen, ohne im Buch nachzuschauen?", questionBenefit: "zeigt dir, was schon zur Gewohnheit wird" },
    { number: 15, week: 3, title: "Mit deinem Namen", tool: 9, chapter: "Kapitel 9 – Freundlich mit dir selbst",
      impulse: "Viele reden mit sich selbst härter als mit jedem anderen Menschen.", impulseBenefit: "macht dir den Ton deiner inneren Stimme bewusst",
      exercise: "Wenn du heute innerlich über dich herfällst, halte den harten Satz fest, leg eine Hand auf das Brustbein, atme zweimal lang aus, frag dich, was du einer Freundin sagen würdest, sag es dir mit deinem Vornamen und entscheide, was jetzt dran ist.", exerciseBenefit: "verschafft dir Abstand und einen freundlicheren Ton",
      question: "Welchen Satz habe ich heute zu mir gesagt, den ich niemals zu einer Freundin sagen würde?", questionBenefit: "markiert die Stelle, an der sich Freundlichkeit am meisten lohnt" },
    { number: 16, week: 3, title: "Erst wiederholen", tool: 10, chapter: "Kapitel 10 – Zuhören, streiten, zusammenleben",
      impulse: "Die schnellste Antwort in einem Streit ist selten die, die du am nächsten Tag noch vertreten willst.", impulseBenefit: "bereitet dich auf den nächsten spitzen Satz vor",
      exercise: "Beim nächsten Satz, der dich ärgert: einmal lang ausatmen, im Kopf wiederholen, was der andere gesagt hat, und dann erst antworten.", exerciseBenefit: "gibt dir zehn Sekunden Vorsprung vor dem Reflex",
      question: "Was habe ich heute gehört, als ich wirklich zugehört habe?", questionBenefit: "holt nach oben, was im Ärger sonst untergeht" },
    { number: 17, week: 3, title: "Drei Karten", tool: 10, chapter: "Kapitel 10 – Zuhören, streiten, zusammenleben",
      impulse: "Nach dem Ausatmen musst du keine perfekte Antwort erfinden. Es gibt drei, die fast immer passen.", impulseBenefit: "macht die Zehn-Sekunden-Antwort alltagstauglich",
      exercise: "Probier heute eine der drei Antworten aus, am besten die, die dir am fremdesten ist: zurückgeben („Du meinst, dass …?“), nachfragen („Was ärgert dich daran am meisten?“) oder vertagen, mit Uhrzeit.", exerciseBenefit: "erweitert deine Möglichkeiten im Gespräch",
      question: "Welche der drei Antworten fällt mir am schwersten, und warum?", questionBenefit: "gibt dir dein nächstes Übungsfeld" },
    { number: 18, week: 3, title: "Der Zettel vor dem Zähneputzen", tool: 11, chapter: "Kapitel 11 – Abends abschalten, nachts schlafen",
      impulse: "Was aufgeschrieben ist, muss der Kopf nicht mehr bewachen.", impulseBenefit: "erklärt, warum ein Zettel beim Einschlafen hilft",
      exercise: "Setz dich heute vor dem Zähneputzen vier Minuten an den Küchentisch, atme einmal lang aus und schreib alles Offene auf, so konkret wie möglich. Markier beim dringendsten Punkt den ersten Handgriff und sag: „Für heute ist zu.“", exerciseBenefit: "schließt den Tag, bevor du ins Bett gehst",
      question: "Welcher Punkt von der Liste wollte im Bett trotzdem zurückkommen?", questionBenefit: "verrät, welches Thema noch Aufmerksamkeit braucht" },
    { number: 19, week: 3, title: "Steht auf dem Zettel", tool: 11, chapter: "Kapitel 11 – Abends abschalten, nachts schlafen",
      impulse: "Für einen Gedanken im Bett reicht ein Verweis auf den Zettel.", impulseBenefit: "gibt dir einen Satz für die Nacht",
      exercise: "Mach den Abendabschluss wie gestern. Kommt im Bett ein Punkt zurück, gib ihm das Etikett „Planen“, sag dir „Steht auf dem Zettel“ und atme ein paarmal lang aus.", exerciseBenefit: "verbindet drei Werkzeuge zu einer Abendroutine",
      question: "Wie lange hat es heute gedauert, bis ich eingeschlafen bin, grob geschätzt?", questionBenefit: "macht Veränderungen über mehrere Nächte sichtbar" },
    { number: 20, week: 3, title: "Fünf Minuten für die Woche", tool: 12, chapter: "Kapitel 12 – Gelassen bleiben, wenn das Leben voll ist",
      impulse: "Eine volle Woche wird nicht leichter, wenn du sie im Kopf trägst. Auf Papier bekommt sie eine Reihenfolge.", impulseBenefit: "zeigt dir, warum sich fünf Minuten Planung lohnen",
      exercise: "Mach den Sonntags-Check (beim ersten Mal rechne mit etwa zehn Minuten): ein Wort für die kommende Woche, drei lange Ausatmer, je eine Zeile zu Zeit, Geld und Pflichten. Eine Sache wird kleiner, eine gehört nur dir.", exerciseBenefit: "nimmt der Woche den Druck, bevor sie anfängt",
      question: "Was lasse ich diese Woche weg, und wie fühlt sich das an?", questionBenefit: "übt das Weglassen, ohne das es nicht geht" },
    { number: 21, week: 3, title: "Dein Plan für danach", tool: 12, chapter: "Kapitel 12 – Gelassen bleiben, wenn das Leben voll ist",
      impulse: "Nach 21 Tagen reichen zwei Werkzeuge, die bei dir funktionieren.", impulseBenefit: "macht das Dranbleiben überschaubar",
      exercise: "Wähle zwei Werkzeuge und häng jedes an einen festen Moment im Alltag. Trag den Sonntags-Check als wöchentlichen Termin in deinen Kalender ein.", exerciseBenefit: "gibt drei Wochen Übung eine Chance, zur Gewohnheit zu werden",
      question: "Womit fange ich wieder an, wenn ich einmal ein paar Wochen raus bin?", questionBenefit: "legt deinen Wiedereinstieg fest, bevor du ihn brauchst" }
  ],

  sources: [
    { chapter: 1, citation: "Killingsworth, M. A. & Gilbert, D. T. (2010): A wandering mind is an unhappy mind. Science, 330(6006), S. 932.", doi: "10.1126/science.1192439" },
    { chapter: 1, citation: "Khoury, B., Sharma, M., Rush, S. E. & Fournier, C. (2015): Mindfulness-based stress reduction for healthy individuals: A meta-analysis. Journal of Psychosomatic Research, 78(6), S. 519–528.", doi: "10.1016/j.jpsychores.2015.03.009" },
    { chapter: 2, citation: "Balban, M. Y., Neri, E., Kogon, M. M., Weed, L., Nouriani, B., Jo, B., Holl, G., Zeitzer, J. M., Spiegel, D. & Huberman, A. D. (2023): Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 4(1), Artikel 100895.", doi: "10.1016/j.xcrm.2022.100895" },
    { chapter: 2, citation: "Zaccaro, A., Piarulli, A., Laurino, M., Garbella, E., Menicucci, D., Neri, B. & Gemignani, A. (2018): How breath-control can change your life: A systematic review on psycho-physiological correlates of slow breathing. Frontiers in Human Neuroscience, 12, Artikel 353.", doi: "10.3389/fnhum.2018.00353" },
    { chapter: 3, citation: "Nolen-Hoeksema, S., Wisco, B. E. & Lyubomirsky, S. (2008): Rethinking rumination. Perspectives on Psychological Science, 3(5), S. 400–424.", doi: "10.1111/j.1745-6924.2008.00088.x" },
    { chapter: 3, citation: "Lieberman, M. D., Eisenberger, N. I., Crockett, M. J., Tom, S. M., Pfeifer, J. H. & Way, B. M. (2007): Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. Psychological Science, 18(5), S. 421–428.", doi: "10.1111/j.1467-9280.2007.01916.x" },
    { chapter: 4, citation: "Goyal, M., Singh, S., Sibinga, E. M. S., Gould, N. F., Rowland-Seymour, A., Sharma, R., Berger, Z., Sleicher, D., Maron, D. D., Shihab, H. M., Ranasinghe, P. D., Linn, S., Saha, S., Bass, E. B. & Haythornthwaite, J. A. (2014): Meditation Programs for Psychological Stress and Well-being: A Systematic Review and Meta-analysis. JAMA Internal Medicine, 174(3), S. 357–368.", doi: "10.1001/jamainternmed.2013.13018" },
    { chapter: 4, citation: "Basso, J. C., McHale, A., Ende, V., Oberlin, D. J. & Suzuki, W. A. (2019): Brief, daily meditation enhances attention, memory, mood, and emotional regulation in non-experienced meditators. Behavioural Brain Research, 356, S. 208–220.", doi: "10.1016/j.bbr.2018.08.023" },
    { chapter: 5, citation: "Leroy, S. (2009): Why is it so hard to do my work? The challenge of attention residue when switching between work tasks. Organizational Behavior and Human Decision Processes, 109(2), S. 168–181.", doi: "10.1016/j.obhdp.2009.04.002" },
    { chapter: 5, citation: "Albulescu, P., Macsinga, I., Rusu, A., Sulea, C., Bodnaru, A. & Tulbure, B. T. (2022): „Give me a break!“ A systematic review and meta-analysis on the efficacy of micro-breaks for increasing well-being and performance. PLOS ONE, 17(8), e0272460.", doi: "10.1371/journal.pone.0272460" },
    { chapter: 6, citation: "Kushlev, K. & Dunn, E. W. (2015): Checking email less frequently reduces stress. Computers in Human Behavior, 43, S. 220–228.", doi: "10.1016/j.chb.2014.11.005" },
    { chapter: 6, citation: "Ward, A. F., Duke, K., Gneezy, A. & Bos, M. W. (2017): Brain Drain: The Mere Presence of One’s Own Smartphone Reduces Available Cognitive Capacity. Journal of the Association for Consumer Research, 2(2), S. 140–154.", doi: "10.1086/691462" },
    { chapter: 7, citation: "Robinson, E., Aveyard, P., Daley, A., Jolly, K., Lewis, A., Lycett, D. & Higgs, S. (2013): Eating attentively: a systematic review and meta-analysis of the effect of food intake memory and awareness on eating. The American Journal of Clinical Nutrition, 97(4), S. 728–742.", doi: "10.3945/ajcn.112.045245" },
    { chapter: 7, citation: "Warren, J. M., Smith, N. & Ashwell, M. (2017): A structured literature review on the role of mindfulness, mindful eating and intuitive eating in changing eating behaviours: effectiveness and associated potential mechanisms. Nutrition Research Reviews, 30(2), S. 272–283.", doi: "10.1017/S0954422417000154" },
    { chapter: 8, citation: "Hunter, M. R., Gillespie, B. W. & Chen, S. Y.-P. (2019): Urban Nature Experiences Reduce Stress in the Context of Daily Life Based on Salivary Biomarkers. Frontiers in Psychology, 10, Artikel 722.", doi: "10.3389/fpsyg.2019.00722" },
    { chapter: 8, citation: "Bratman, G. N., Hamilton, J. P., Hahn, K. S., Daily, G. C. & Gross, J. J. (2015): Nature experience reduces rumination and subgenual prefrontal cortex activation. Proceedings of the National Academy of Sciences, 112(28), S. 8567–8572.", doi: "10.1073/pnas.1510459112" },
    { chapter: 9, citation: "MacBeth, A. & Gumley, A. (2012): Exploring compassion: A meta-analysis of the association between self-compassion and psychopathology. Clinical Psychology Review, 32(6), S. 545–552.", doi: "10.1016/j.cpr.2012.06.003" },
    { chapter: 9, citation: "Kross, E., Bruehlman-Senecal, E., Park, J., Burson, A., Dougherty, A., Shablack, H., Bremner, R., Moser, J. & Ayduk, O. (2014): Self-talk as a regulatory mechanism: How you do it matters. Journal of Personality and Social Psychology, 106(2), S. 304–324.", doi: "10.1037/a0035173" },
    { chapter: 10, citation: "Karremans, J. C., Schellekens, M. P. J. & Kappen, G. (2017): Bridging the Sciences of Mindfulness and Romantic Relationships: A Theoretical Model and Research Agenda. Personality and Social Psychology Review, 21(1), S. 29–49.", doi: "10.1177/1088868315615450" },
    { chapter: 10, citation: "Itzchakov, G., Kluger, A. N. & Castro, D. R. (2017): I Am Aware of My Inconsistencies but Can Tolerate Them: The Effect of High Quality Listening on Speakers’ Attitude Ambivalence. Personality and Social Psychology Bulletin, 43(1), S. 105–120.", doi: "10.1177/0146167216675339" },
    { chapter: 11, citation: "Scullin, M. K., Krueger, M. L., Ballard, H. K., Pruett, N. & Bliwise, D. L. (2018): The effects of bedtime writing on difficulty falling asleep: A polysomnographic study comparing to-do lists and completed activity lists. Journal of Experimental Psychology: General, 147(1), S. 139–146.", doi: "10.1037/xge0000374" },
    { chapter: 11, citation: "Rusch, H. L., Rosario, M., Levison, L. M., Olivera, A., Livingston, W. S., Wu, T. & Gill, J. M. (2019): The effect of mindfulness meditation on sleep quality: a systematic review and meta-analysis of randomized controlled trials. Annals of the New York Academy of Sciences, 1445(1), S. 5–16.", doi: "10.1111/nyas.13996" },
    { chapter: 12, citation: "Whillans, A. V., Dunn, E. W., Smeets, P., Bekkers, R. & Norton, M. I. (2017): Buying time promotes happiness. Proceedings of the National Academy of Sciences, 114(32), S. 8523–8527.", doi: "10.1073/pnas.1706541114" },
    { chapter: 12, citation: "Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W. & Wardle, J. (2010): How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology, 40(6), S. 998–1009.", doi: "10.1002/ejsp.674" }
  ],

  appendix: {
    access: "Die Web-App zum Buch findest du unter tools.munichpublishing.de/achtsamkeit. Sie läuft im Browser, ohne Account, ohne Abo und ohne Download. Was du einträgst, wird nur auf deinem Gerät gespeichert. Wenn du den Browserverlauf löschst oder das Handy wechselst, sind die Einträge dort nicht mehr vorhanden.",
    install: {
      iphone: "Öffne die Adresse in Safari. Tippe unten auf das Teilen-Symbol, das Quadrat mit dem Pfeil nach oben. Wähle „Zum Home-Bildschirm“ und bestätige mit „Hinzufügen“.",
      android: "Öffne die Adresse in Chrome. Tippe oben rechts auf die drei Punkte. Wähle „Zum Startbildschirm hinzufügen“ oder „App installieren“ und bestätige.",
      desktop: "In Chrome oder Edge das Installationssymbol rechts in der Adresszeile anklicken und bestätigen.",
      after: "Danach öffnest du den RUHE-Begleiter wie jede andere App über das Symbol auf deinem Startbildschirm."
    },
    trouble: "Lädt die Seite nicht, prüf zuerst die Internetverbindung und gib die Adresse ohne „www“ ein. Sind deine Einträge verschwunden, hast du wahrscheinlich einen anderen Browser oder ein anderes Gerät benutzt; die App speichert nur dort, wo du sie geöffnet hast.",
    helpIntro: "Dieses Buch ersetzt keine ärztliche oder psychotherapeutische Behandlung. Wenn Anspannung, Grübeln, Schlafprobleme oder Niedergeschlagenheit über Wochen anhalten, sprich mit jemandem, der dafür ausgebildet ist.",
    help: [
      "Erste Anlaufstelle: deine Hausärztin oder dein Hausarzt.",
      "Termine bei Fachärzten und Psychotherapeuten: Terminservice der Kassenärztlichen Vereinigungen unter 116117 oder www.116117-termine.de (für gesetzlich Versicherte).",
      "In einer akuten Krise: TelefonSeelsorge, kostenfrei, anonym und rund um die Uhr unter 0800 111 0 111, 0800 111 0 222 oder 116 123.",
      "Bei Gewalt in der Partnerschaft: Hilfetelefon „Gewalt gegen Frauen“, kostenfrei und rund um die Uhr unter 116 016.",
      "Bei Geldsorgen und Schulden: kostenlose Schuldnerberatung, etwa bei Verbraucherzentralen, Caritas, Diakonie oder AWO in deiner Nähe.",
      "In Lebensgefahr: Notruf 112."
    ],
    helpStand: "Stand der Angaben: September 2026."
  }
};
