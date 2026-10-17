// Finde den Troll – 10 Online-Fälle zum Buch „Ragebait“. Keiner davon steht im Buch.
// stufe: "chill" (1 Punkt) oder "ragebait" (2 Punkte); troll: Position 1 bis 5 in der Grundreihenfolge (die App mischt die Kommentare)
window.FAELLE = [
  {
    "stufe": "chill",
    "autor": "nebel_04",
    "post": "Heute lag Schnee auf dem Schulhof. Wer hat schon eine Schneeballschlacht gemacht?",
    "k": [
      [
        "dachs_19",
        "Ja, in der großen Pause gegen die Parallelklasse. Wir haben verloren, aber egal."
      ],
      [
        "kiesel.m",
        "bei uns ist nur matsch"
      ],
      [
        "trommel_7",
        "schneeballschlachten sind was für babys. wer mitmacht ist peinlich"
      ],
      [
        "limo_33",
        "Zu kalt. Schnee nervt einfach, ich bin drin geblieben."
      ],
      [
        "wolle_k",
        "morgen soll noch mehr kommen"
      ]
    ],
    "troll": 3,
    "l": "Alle erzählen, wie es bei ihnen war. trommel_7 erklärt alle, die mitmachen, für peinlich, ohne dass jemand gefragt hat. limo_33 macht auch nicht mit, redet aber nur über sich."
  },
  {
    "stufe": "chill",
    "autor": "ofen_91",
    "post": "Erstes Bananenbrot selbst gebacken. Innen noch ein bisschen weich, aber lecker.",
    "k": [
      [
        "gabel_58",
        "Glaub ich nicht, dass du das selbst gebacken hast. Beweis?"
      ],
      [
        "spatz.r",
        "klingt richtig gut"
      ],
      [
        "kompass_2",
        "REZEPT BITTE!!!"
      ],
      [
        "birne.x",
        "bei mir verbrennt es immer oben und innen ist es noch flüssig, keine ahnung warum"
      ],
      [
        "socke_40",
        "Mit Schokostücken ist es noch besser, und am nächsten Tag schmeckt es sogar besser als frisch."
      ]
    ],
    "troll": 1,
    "l": "gabel_58 unterstellt etwas ohne jeden Grund und verlangt einen Beweis. So zwingt er dich zu antworten. kompass_2 schreit, will aber nur das Rezept."
  },
  {
    "stufe": "chill",
    "autor": "ziegel_8",
    "post": "Endlich den letzten Boss geschafft. Drei Tage hat’s gedauert.",
    "k": [
      [
        "mango_17",
        "nice, welcher boss?"
      ],
      [
        "stift.b",
        "Ich häng da seit Wochen fest."
      ],
      [
        "anker_62",
        "Ich krieg den nie, wie hast du das gemacht?"
      ],
      [
        "wal_23",
        "wen interessiert dein spiel. schau lieber in die klassengruppe, da wird gerade über dich gelästert"
      ],
      [
        "krokus_5",
        "Jetzt kommt das Ende, das ist noch schwerer."
      ]
    ],
    "troll": 4,
    "l": "wal_23 lenkt vom Thema ab und streut ein Gerücht, das niemand prüfen kann. Er will Unruhe, keine Antwort zum Spiel. Alle anderen bleiben beim Spiel."
  },
  {
    "stufe": "chill",
    "autor": "pauke_31",
    "post": "Unsere Schulband spielt am Freitag um 18 Uhr in der Aula. Kommt vorbei!",
    "k": [
      [
        "kekse_77",
        "komm ich, aber nur wenn’s nicht wieder zwei Stunden dauert"
      ],
      [
        "flocke.t",
        "Spielt ihr auch was Eigenes oder nur Covers? Letztes Jahr war das echt gut."
      ],
      [
        "regen_12",
        "um 18 uhr hab ich training, schade. nehmt ihr das auf? dann schau ich es mir später an"
      ],
      [
        "hummer_9",
        "ICH BIN DA, ganz vorne!!"
      ],
      [
        "bohne_46",
        "Schulbands sind das Schlimmste. Wer da hingeht, hat einfach keinen Geschmack."
      ]
    ],
    "troll": 5,
    "l": "bohne_46 übertreibt maßlos und beleidigt alle, die hingehen wollen. hummer_9 ist laut, aber vor Vorfreude."
  },
  {
    "stufe": "chill",
    "autor": "marmor_6",
    "post": "Morgen ist Wandertag. Weiß jemand, ob wir Regensachen brauchen?",
    "k": [
      [
        "iltis_28",
        "laut wetter ab mittag regen"
      ],
      [
        "tonne_53",
        "Wandertag fällt sowieso aus, steht schon überall. Bleibt einfach zu Hause, merkt eh keiner."
      ],
      [
        "zwiebel.p",
        "Ich nehm einfach die Jacke mit."
      ],
      [
        "kerze_k",
        "Steht das nicht im Elternbrief? Ich glaub, da stand, dass wir bei jedem Wetter gehen und feste Schuhe brauchen."
      ],
      [
        "papaya_3",
        "frag doch morgen früh die klassenlehrerin"
      ]
    ],
    "troll": 2,
    "l": "tonne_53 behauptet etwas Falsches mit großer Sicherheit („steht schon überall“) und ruft zum Schwänzen auf. Wer ihm glaubt, fehlt morgen und hat Ärger."
  },
  {
    "stufe": "ragebait",
    "autor": "lupe_15",
    "post": "Mein kleiner Bruder hat heute sein erstes Tor im Verein geschossen!",
    "k": [
      [
        "gecko_81",
        "WAS?! sag ihm glückwunsch!!!"
      ],
      [
        "delfin.s",
        "Tore in dem Alter zählen nicht wirklich, da steht ja kein richtiger Torwart. Freu dich lieber nicht zu früh für ihn."
      ],
      [
        "walnuss_4",
        "welche position spielt er"
      ],
      [
        "fichte_70",
        "Ich hab nie eins geschossen, Neid."
      ],
      [
        "quark_22",
        "Bei uns in der E-Jugend war der Torwart echt schlecht, da war das auch leicht. Trotzdem hab ich mich bei jedem Tor gefreut wie verrückt."
      ]
    ],
    "troll": 2,
    "l": "delfin.s klingt sachlich, macht aber die Freude kaputt, ohne dass es einen Anlass gibt. Der Haken: quark_22 klingt ähnlich, redet aber über das eigene Team. gecko_81 ist laut, aber begeistert."
  },
  {
    "stufe": "ragebait",
    "autor": "kissen_88",
    "post": "Habe mein Zimmer umgestellt. Das Bett steht jetzt am Fenster.",
    "k": [
      [
        "marder_13",
        "klingt nach mehr platz"
      ],
      [
        "kiwi.b",
        "Bett am Fenster? Im Winter zieht es da voll, ich würd’s zurückstellen."
      ],
      [
        "pinsel_2",
        "OMG am fenster schlafen ist das beste!!"
      ],
      [
        "nudel_36",
        "Ich darf bei mir nicht mal was umstellen."
      ],
      [
        "taube_59",
        "voll wichtig, dass du dein bett verschiebst. andere haben echte probleme, aber klar, poste ruhig weiter"
      ]
    ],
    "troll": 5,
    "l": "taube_59 macht deinen Post klein und dir ein schlechtes Gewissen, das mit dem Post nichts zu tun hat. Er will, dass du dich verteidigst. Der Haken: kiwi.b ist auch kritisch, gibt aber einen echten Grund und einen Rat."
  },
  {
    "stufe": "ragebait",
    "autor": "kran_44",
    "post": "Bus verpasst und zu Fuß gegangen. 40 Minuten.",
    "k": [
      [
        "luchs_k",
        "40 min?? respekt"
      ],
      [
        "tomate_65",
        "Ich lauf das jeden Tag, nach zwei Wochen merkst du es kaum noch. Mit Musik geht’s schneller."
      ],
      [
        "muschel_8",
        "nächstes mal schreib mir einfach, dann laufen wir zusammen, ich wohn ja eh in der nähe"
      ],
      [
        "kakao_27",
        "Weiß doch jeder: Ab 30 Minuten Laufen gehen die Knie kaputt. Sagen alle Ärzte. Hättest halt gewartet."
      ],
      [
        "birke.r",
        "Der Bus ist bei uns auch immer zu früh weg. Ich glaub, der Fahrer hat einfach keine Lust zu warten."
      ]
    ],
    "troll": 4,
    "l": "kakao_27 erfindet eine Gefahr, beruft sich auf „alle Ärzte“ und reibt dir noch rein, dass du selbst schuld bist. Der Haken: tomate_65 klingt erst nach Angeberei, gibt dir aber einen Tipp."
  },
  {
    "stufe": "ragebait",
    "autor": "efeu_19",
    "post": "Welche Jahreszeit mögt ihr am liebsten? Ich: Herbst.",
    "k": [
      [
        "leiter_3",
        "herbst-fans sind immer gleich: tee, kerze, foto davon. ihr seid alle so vorhersehbar"
      ],
      [
        "salami_6",
        "SOMMER. keine diskussion."
      ],
      [
        "ameise_k",
        "Frühling, wegen Geburtstag."
      ],
      [
        "kiefer_94",
        "Herbst ist okay, aber nur bis November. Danach ist alles grau, nass und um halb fünf schon dunkel."
      ],
      [
        "pflaume_x",
        "winter, wegen schnee"
      ]
    ],
    "troll": 1,
    "l": "leiter_3 steckt alle Herbst-Fans in eine Schublade und macht sich über sie lustig. Ein Lager gegen das andere. Der Haken: salami_6 ist laut und duldet keine Widerrede, sagt aber nur die eigene Meinung."
  },
  {
    "stufe": "ragebait",
    "autor": "harfe_57",
    "post": "Mein Lieblingslied kam gerade im Shuffle, so gut!",
    "k": [
      [
        "dose_21",
        "welches?? sag den titel, ich such neue lieder"
      ],
      [
        "lachs_k",
        "Shuffle ist das Schlimmste, da kommt nie, was man will. Mach dir eine Playlist, dann kommt es öfter."
      ],
      [
        "wiesel_90",
        "Echte Fans können den ganzen Text. Zweite Strophe, los."
      ],
      [
        "zebra.n",
        "bei mir kommt im shuffle immer dasselbe lied, egal wie oft ich skippe"
      ],
      [
        "kompott_7",
        "sing mit!! und dreh lauter, dann hören es die nachbarn auch"
      ]
    ],
    "troll": 3,
    "l": "wiesel_90 stellt eine Bedingung auf, die niemand verlangt hat, und fordert einen Beweis. Er will dich vorführen. Der Haken: lachs_k meckert über Shuffle, gibt dir aber einen Tipp."
  }
];

// Punkte: Chill 1, Ragebait 2 → höchstens 15. Ränge wie im Buch, eigene Grenzen.
window.RAENGE = [
  { ab: 14, name: "Peak.", satz: "Dich ragebaitet keiner." },
  { ab: 10, name: "Schwer zu ragebaiten.", satz: "Die meisten Haken siehst du kommen." },
  { ab: 5, name: "Angebissen.", satz: "Du siehst den Haken. Du beißt trotzdem." },
  { ab: 0, name: "Geködert.", satz: "Jeder Post kriegt dich." }
];
