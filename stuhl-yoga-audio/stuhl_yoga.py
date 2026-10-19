"""Stuhl-Yoga-Videos mit Sprachanleitung.

  python stuhl_yoga.py skripte          -> schreibt skripte.json (alle Sprechtexte, zur Kontrolle)
  python stuhl_yoga.py audio [übung..]  -> erzeugt die Sprach-Clips mit ElevenLabs (Eleven v4, Stimme Ramona)
  python stuhl_yoga.py video [übung..]  -> baut die Videos mit Ton nach ausgabe/ (mp4 + Vorschaubild jpg)

ElevenLabs: Umgebungsvariable ELEVENLABS_API_KEY. Stimme: ELEVENLABS_VOICE_ID, sonst wird
die Stimme mit dem Namen "Ramona" im Konto gesucht.
Jede Zeile ist ein eigener Clip und startet genau mit ihrem Bild. Ist ein Clip länger als
die geplante Zeit, wird das Bild entsprechend länger gehalten. Vorhandene Clips werden nicht
neu erzeugt (Credits sparen): einzelnen Clip löschen, um ihn neu zu erzeugen.
"""
import json, os, shutil, subprocess, sys, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

HIER = os.path.dirname(os.path.abspath(__file__))
BILDER = os.path.join(HIER, 'bilder')
CLIPS = os.path.join(HIER, 'clips')
AUS = os.path.join(HIER, 'ausgabe')
W, H, FPS = 1080, 1350, 25
TEAL = (0, 122, 122); DARK = (34, 34, 34)


def font(names, size):
    for n in names:
        for d in ('/usr/share/fonts/truetype/dejavu', 'C:/Windows/Fonts', '/Library/Fonts', '/System/Library/Fonts/Supplemental'):
            p = os.path.join(d, n)
            if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()

fT = font(['DejaVuSerif-Bold.ttf', 'georgiab.ttf', 'Georgia Bold.ttf'], 64)
fL = font(['DejaVuSans-Bold.ttf', 'arialbd.ttf', 'Arial Bold.ttf'], 56)
fS = font(['DejaVuSans.ttf', 'arial.ttf', 'Arial.ttf'], 40)

_cache = {}
def _clean(im):
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    lum = a.mean(2); sat = a.max(2) - a.min(2)
    a[(lum > 236) & (sat < 14)] = 255
    return a

def load(name):
    if name in _cache: return _cache[name]
    flip = name.endswith('~'); base = name.rstrip('~')
    a = _clean(Image.open(os.path.join(BILDER, base + '.png')))
    a = a[:1404, :1080]
    if base.startswith('kopf_') and base != 'kopf_c':
        # nur der Kopf bewegt sich: Körper immer aus dem Mittelbild
        c = _clean(Image.open(os.path.join(BILDER, 'kopf_c.png')))[:1404, :1080]
        m = np.zeros((a.shape[0], 1, 1)); m[:330] = 1; m[330:400, 0, 0] = np.linspace(1, 0, 70)
        a = (a * m + c * (1 - m))
    im = Image.fromarray(a.clip(0, 255).astype('uint8'))
    if base.startswith('vorbeuge'):
        im = im.crop((0, 0, 1080, 864)).resize((1000, 800), Image.LANCZOS)
        out = Image.new('RGB', (W, 880), 'white'); out.paste(im, ((W - 1000) // 2, 40))
    else:
        im = im.crop((90, 0, 990, 1404)).resize((int(900 * 880 / 1404), 880), Image.LANCZOS)
        out = Image.new('RGB', (W, 880), 'white'); out.paste(im, ((W - im.width) // 2, 0))
    if flip: out = ImageOps.mirror(out)
    _cache[name] = out
    return out


# ---------------------------------------------------------------- Ablauf je Übung
# Jeder Schritt: (art, bilder, sekunden, anzeige, zähler, sprechtext)
#   art "hold": ein Bild halten, "move": über die Bilder bewegen
def S(art, bilder, sek, anzeige, sprich, zaehler=None):
    return dict(art=art, bilder=bilder if isinstance(bilder, list) else [bilder], sek=sek,
                anzeige=anzeige, zaehler=zaehler, sprich=sprich)

def countdown(bild, n, wort, zaehler=None):
    zahl = {5: 'Fünf.', 4: 'Vier.', 3: 'Drei.', 2: 'Zwei.', 1: 'Eins.'}
    return [S('hold', bild, 1.0, f'{wort} … {i}', zahl[i], zaehler) for i in range(n, 0, -1)]

UEBUNGEN = {}

UEBUNGEN['katzenbuckel'] = ('Katzenbuckel im Sitzen', [
    S('hold', 'katze_0', 2.5, 'Aufrecht sitzen', 'Katzenbuckel im Sitzen. Setzen Sie sich aufrecht hin, die Hände auf den Knien.'),
    S('move', ['katze_0', 'katze_r50', 'katze_r100'], 1.6, 'Rücken runden', 'Runden Sie langsam den Rücken.', 'Durchgang 1'),
    S('hold', 'katze_r100', 1.2, 'Kinn zur Brust', 'Das Kinn sinkt zur Brust.', 'Durchgang 1'),
    S('move', ['katze_r100', 'katze_r50', 'katze_0', 'katze_a50', 'katze_a100'], 2.0, 'Ins Hohlkreuz', 'Und jetzt ins Hohlkreuz, die Brust nach vorn.', 'Durchgang 1'),
    S('hold', 'katze_a100', 1.2, 'Blick nach oben', 'Der Blick geht leicht nach oben.', 'Durchgang 1'),
    S('move', ['katze_a100', 'katze_a50', 'katze_0'], 1.4, 'Zurück zur Mitte', 'Zurück zur Mitte.', 'Durchgang 1'),
    S('move', ['katze_0', 'katze_r50', 'katze_r100'], 1.6, 'Rücken runden', 'Noch einmal: Rücken rund.', 'Durchgang 2'),
    S('hold', 'katze_r100', 1.2, 'Kinn zur Brust', 'Kinn zur Brust.', 'Durchgang 2'),
    S('move', ['katze_r100', 'katze_r50', 'katze_0', 'katze_a50', 'katze_a100'], 2.0, 'Ins Hohlkreuz', 'Und ins Hohlkreuz.', 'Durchgang 2'),
    S('hold', 'katze_a100', 1.2, 'Blick nach oben', 'Blick nach oben.', 'Durchgang 2'),
    S('move', ['katze_a100', 'katze_a50', 'katze_0'], 1.4, 'Zurück zur Mitte', 'Zurück zur Mitte.', 'Durchgang 2'),
    S('hold', 'katze_0', 3.0, 'Langsam im Wechsel', 'Machen Sie das in Ruhe im Wechsel weiter. Jede Bewegung etwa eine Sekunde.'),
])

UEBUNGEN['fuesse-kreisen'] = ('Füße kreisen', [
    S('hold', 'fuesse_0', 2.5, 'Sitzfläche greifen', 'Füße kreisen. Halten Sie sich mit beiden Händen an der Sitzfläche fest.'),
    S('move', ['fuesse_0', 'fuesse_half', 'fuesse_up'], 1.8, 'Beine anheben', 'Heben Sie die Beine langsam an.'),
    S('move', ['fuesse_up', 'fuesse_flex', 'fuesse_up', 'fuesse_point', 'fuesse_up'], 2.4, 'Füße kreisen', 'Und jetzt die Füße langsam kreisen lassen.', 'Kreis 1 von 10'),
    S('move', ['fuesse_up', 'fuesse_flex', 'fuesse_up', 'fuesse_point', 'fuesse_up'], 2.4, 'Füße kreisen', 'Schön gleichmäßig.', 'Kreis 2 von 10'),
    S('move', ['fuesse_up', 'fuesse_flex', 'fuesse_up', 'fuesse_point', 'fuesse_up'], 2.4, 'Füße kreisen', 'Weiter kreisen.', 'Kreis 3 von 10'),
    S('move', ['fuesse_up', 'fuesse_half', 'fuesse_0'], 1.8, 'Füße abstellen', 'Stellen Sie die Füße wieder ab.'),
    S('hold', 'fuesse_0', 3.5, '10 Sek. Pause, dann 10 Mal', 'Zehn Mal kreisen, dann zehn Sekunden Pause, und noch einmal zehn Mal.'),
])

UEBUNGEN['kopfdrehen'] = ('Sanftes Kopfdrehen', [
    S('hold', 'kopf_c', 2.5, 'Aufrecht sitzen', 'Sanftes Kopfdrehen. Setzen Sie sich aufrecht hin, die Hände liegen auf den Oberschenkeln.'),
    S('move', ['kopf_c', 'kopf_r30', 'kopf_r60', 'kopf_r85'], 2.0, 'Langsam nach rechts', 'Drehen Sie den Kopf langsam nach rechts.', 'Durchgang 1 von 10'),
    S('hold', 'kopf_r85', 2.0, 'Halten … 2 … 1', 'Kurz halten.', 'Durchgang 1 von 10'),
    S('move', ['kopf_r85', 'kopf_r60', 'kopf_r30', 'kopf_c'], 2.0, 'Zurück zur Mitte', 'Und zurück zur Mitte.', 'Durchgang 1 von 10'),
    S('move', ['kopf_c', 'kopf_l30', 'kopf_l60', 'kopf_l85'], 2.0, 'Langsam nach links', 'Jetzt langsam nach links.', 'Durchgang 1 von 10'),
    S('hold', 'kopf_l85', 2.0, 'Halten … 2 … 1', 'Halten.', 'Durchgang 1 von 10'),
    S('move', ['kopf_l85', 'kopf_l60', 'kopf_l30', 'kopf_c'], 2.0, 'Zurück zur Mitte', 'Zurück zur Mitte.', 'Durchgang 1 von 10'),
    S('move', ['kopf_c', 'kopf_r30', 'kopf_r60', 'kopf_r85'], 2.0, 'Langsam nach rechts', 'Noch einmal nach rechts.', 'Durchgang 2 von 10'),
    S('hold', 'kopf_r85', 2.0, 'Halten … 2 … 1', 'Halten.', 'Durchgang 2 von 10'),
    S('move', ['kopf_r85', 'kopf_r60', 'kopf_r30', 'kopf_c'], 2.0, 'Zurück zur Mitte', 'Zur Mitte.', 'Durchgang 2 von 10'),
    S('move', ['kopf_c', 'kopf_l30', 'kopf_l60', 'kopf_l85'], 2.0, 'Langsam nach links', 'Nach links.', 'Durchgang 2 von 10'),
    S('hold', 'kopf_l85', 2.0, 'Halten … 2 … 1', 'Halten.', 'Durchgang 2 von 10'),
    S('move', ['kopf_l85', 'kopf_l60', 'kopf_l30', 'kopf_c'], 2.0, 'Zurück zur Mitte', 'Zur Mitte.', 'Durchgang 2 von 10'),
    S('hold', 'kopf_c', 3.0, '10 Mal zu jeder Seite', 'Wiederholen Sie das zehn Mal zu jeder Seite. Ganz in Ruhe.'),
])

UEBUNGEN['selbstumarmung'] = ('Selbstumarmung', [
    S('hold', 'umarm_0', 2.5, 'Aufrecht sitzen', 'Selbstumarmung. Setzen Sie sich aufrecht hin.'),
    S('move', ['umarm_0', 'umarm_cross', 'umarm_hug'], 2.0, 'Schultern greifen', 'Kreuzen Sie die Arme und legen Sie die Hände auf die Schultern.'),
    S('move', ['umarm_hug', 'umarm_deep'], 2.0, 'Leichter Buckel', 'Machen Sie einen leichten Buckel.', 'Durchgang 1 von 10'),
    S('move', ['umarm_deep', 'umarm_hug'], 2.0, 'Wieder aufrichten', 'Und wieder aufrichten.', 'Durchgang 1 von 10'),
    S('move', ['umarm_hug', 'umarm_deep'], 2.0, 'Leichter Buckel', 'Leichter Buckel.', 'Durchgang 2 von 10'),
    S('move', ['umarm_deep', 'umarm_hug'], 2.0, 'Wieder aufrichten', 'Aufrichten.', 'Durchgang 2 von 10'),
    S('move', ['umarm_hug', 'umarm_deep'], 2.0, 'Leichter Buckel', 'Buckel.', 'Durchgang 3 von 10'),
    S('move', ['umarm_deep', 'umarm_hug'], 2.0, 'Wieder aufrichten', 'Und aufrichten.', 'Durchgang 3 von 10'),
    S('hold', 'umarm_hug', 3.0, '10 Mal im Wechsel', 'Zehn Mal im Wechsel. Die Hände bleiben an den Schultern.'),
])

UEBUNGEN['schultern-heben'] = ('Schultern heben', [
    S('hold', 'schulter_0', 2.5, 'Schultern locker', 'Schultern heben. Lassen Sie die Schultern ganz locker.'),
    S('move', ['schulter_0', 'schulter_up'], 1.5, 'Schultern anheben', 'Ziehen Sie die Schultern langsam nach oben.', 'Durchgang 1 von 10'),
    S('hold', 'schulter_up', 1.2, 'Oben kurz halten', 'Kurz halten.', 'Durchgang 1 von 10'),
    S('move', ['schulter_up', 'schulter_0'], 1.5, 'Sinken lassen', 'Und sinken lassen.', 'Durchgang 1 von 10'),
    S('move', ['schulter_0', 'schulter_up'], 1.5, 'Schultern anheben', 'Hoch.', 'Durchgang 2 von 10'),
    S('hold', 'schulter_up', 1.2, 'Oben kurz halten', 'Halten.', 'Durchgang 2 von 10'),
    S('move', ['schulter_up', 'schulter_0'], 1.5, 'Sinken lassen', 'Sinken lassen.', 'Durchgang 2 von 10'),
    S('move', ['schulter_0', 'schulter_up'], 1.5, 'Schultern anheben', 'Hoch.', 'Durchgang 3 von 10'),
    S('hold', 'schulter_up', 1.2, 'Oben kurz halten', 'Halten.', 'Durchgang 3 von 10'),
    S('move', ['schulter_up', 'schulter_0'], 1.5, 'Sinken lassen', 'Und loslassen.', 'Durchgang 3 von 10'),
    S('hold', 'schulter_0', 3.0, '10 Mal, ohne Schwung', 'Zehn Mal, ruhig und ohne Schwung.'),
])

UEBUNGEN['vorbeuge'] = ('Stehende Vorbeuge', [
    S('hold', 'vorbeuge_0', 2.5, 'Vor den Stuhl stellen', 'Stehende Vorbeuge. Stellen Sie sich vor den Stuhl.'),
    S('move', ['vorbeuge_0', 'vorbeuge_30', 'vorbeuge_60', 'vorbeuge_90'], 3.0, 'Knie beugen, nach vorn', 'Beugen Sie die Knie leicht und neigen Sie sich langsam nach vorn.'),
    S('hold', 'vorbeuge_90', 2.5, 'Hände auf die Sitzfläche', 'Legen Sie die Hände auf die Sitzfläche.'),
    S('hold', 'vorbeuge_90', 3.0, 'Rücken gerade halten', 'Halten Sie den Rücken gerade.'),
    S('hold', 'vorbeuge_90', 3.0, 'Bis zu 1 Minute halten', 'Bleiben Sie so, bis zu einer Minute. Atmen Sie ruhig weiter.'),
    S('move', ['vorbeuge_90', 'vorbeuge_60', 'vorbeuge_30', 'vorbeuge_0'], 3.0, 'Langsam aufrichten', 'Und jetzt langsam wieder aufrichten.'),
    S('hold', 'vorbeuge_0', 2.5, 'Fertig', 'Sehr gut.'),
])

UEBUNGEN['koerperrueckseite'] = ('Körperrückseite dehnen', [
    S('hold', 'rueck_0', 2.5, 'Lehne festhalten', 'Körperrückseite dehnen. Stellen Sie sich hinter den Stuhl und halten Sie die Lehne fest.'),
    S('move', ['rueck_0', 'rueck_step', 'rueck_stretch'], 2.0, 'Fuß nach hinten', 'Setzen Sie einen Fuß nach hinten.'),
    S('hold', 'rueck_stretch', 2.0, 'Wade dehnen', 'Strecken Sie das hintere Bein und spüren Sie die Dehnung in der Wade.'),
    *countdown('rueck_stretch', 5, 'Halten', 'insgesamt 10 Sekunden'),
    S('move', ['rueck_stretch', 'rueck_step'], 1.2, 'Locker lassen', 'Locker lassen.'),
    S('move', ['rueck_step', 'rueck_stretch'], 1.2, 'Wieder dehnen', 'Und wieder dehnen.'),
    S('move', ['rueck_stretch', 'rueck_step', 'rueck_0'], 1.6, 'Zurück', 'Zurück.'),
    S('hold', 'rueck_other', 3.0, 'Seite wechseln', 'Jetzt die andere Seite.'),
    S('hold', 'rueck_other', 3.0, '5 Mal je Seite', 'Zehn Sekunden halten, fünf Mal je Seite.'),
])

UEBUNGEN['gesaess'] = ('Gesäß-Dehnung', [
    S('hold', 'gesaess_0', 2.5, 'Aufrecht sitzen', 'Gesäß-Dehnung. Setzen Sie sich aufrecht hin.'),
    S('move', ['gesaess_0', 'gesaess_cross'], 1.8, 'Fuß aufs Knie', 'Legen Sie einen Fuß auf das andere Knie.'),
    S('move', ['gesaess_cross', 'gesaess_lean'], 1.8, 'Vorbeugen', 'Beugen Sie sich mit geradem Rücken nach vorn.', 'Durchgang 1 von 5'),
    *countdown('gesaess_lean', 3, 'Halten', 'Durchgang 1 von 5'),
    S('move', ['gesaess_lean', 'gesaess_cross'], 1.8, 'Aufrichten', 'Und aufrichten.', 'Durchgang 1 von 5'),
    S('move', ['gesaess_cross', 'gesaess_lean'], 1.8, 'Vorbeugen', 'Noch einmal nach vorn.', 'Durchgang 2 von 5'),
    *countdown('gesaess_lean', 3, 'Halten', 'Durchgang 2 von 5'),
    S('move', ['gesaess_lean', 'gesaess_cross'], 1.8, 'Aufrichten', 'Aufrichten.', 'Durchgang 2 von 5'),
    S('hold', 'gesaess_cross~', 3.0, 'Seite wechseln', 'Jetzt die Seite wechseln.'),
    S('hold', 'gesaess_cross~', 3.0, '5 Mal pro Seite', 'Nur so weit, wie es angenehm ist. Fünf Mal pro Seite.'),
])

UEBUNGEN['arme-rotieren'] = ('Arme rotieren', [
    S('hold', 'rot_0', 2.5, 'Aufrecht sitzen', 'Arme rotieren. Setzen Sie sich aufrecht hin.'),
    S('move', ['rot_0', 'rot_a'], 1.5, 'Arme strecken', 'Strecken Sie einen Arm nach vorn und den anderen schräg nach unten.'),
    S('move', ['rot_a', 'rot_b', 'rot_c', 'rot_a'], 3.0, 'Langsam kreisen', 'Und jetzt beide Arme langsam kreisen.', 'Kreis 1 von 15'),
    S('move', ['rot_a', 'rot_b', 'rot_c', 'rot_a'], 3.0, 'Langsam kreisen', 'In dieselbe Richtung.', 'Kreis 2 von 15'),
    S('move', ['rot_a', 'rot_b', 'rot_c', 'rot_a'], 3.0, 'Langsam kreisen', 'Gleichmäßig weiter.', 'Kreis 3 von 15'),
    S('move', ['rot_a', 'rot_0'], 1.5, 'Arme sinken lassen', 'Lassen Sie die Arme sinken.'),
    S('hold', 'rot_0', 3.5, '15 Mal, dann Pause', 'Fünfzehn Mal, dann eine Pause und ein zweiter Durchgang.'),
])

UEBUNGEN['arme-ueber-kopf'] = ('Arme über Kopf', [
    S('hold', 'ueber_0', 2.5, 'Aufrecht sitzen', 'Arme über Kopf. Setzen Sie sich aufrecht hin.'),
    S('move', ['ueber_0', 'ueber_t', 'ueber_top'], 2.4, 'Arme seitlich heben', 'Heben Sie die gestreckten Arme langsam seitlich an.', 'Durchgang 1 von 10'),
    S('hold', 'ueber_top', 1.2, 'Hände über dem Kopf', 'Die Hände berühren sich über dem Kopf.', 'Durchgang 1 von 10'),
    S('move', ['ueber_top', 'ueber_t', 'ueber_0'], 2.4, 'Langsam senken', 'Und langsam wieder senken.', 'Durchgang 1 von 10'),
    S('move', ['ueber_0', 'ueber_t', 'ueber_top'], 2.4, 'Arme seitlich heben', 'Hoch.', 'Durchgang 2 von 10'),
    S('hold', 'ueber_top', 1.2, 'Hände über dem Kopf', 'Hände zusammen.', 'Durchgang 2 von 10'),
    S('move', ['ueber_top', 'ueber_t', 'ueber_0'], 2.4, 'Langsam senken', 'Senken.', 'Durchgang 2 von 10'),
    S('move', ['ueber_0', 'ueber_t', 'ueber_top'], 2.4, 'Arme seitlich heben', 'Hoch.', 'Durchgang 3 von 10'),
    S('hold', 'ueber_top', 1.2, 'Hände über dem Kopf', 'Oben.', 'Durchgang 3 von 10'),
    S('move', ['ueber_top', 'ueber_t', 'ueber_0'], 2.4, 'Langsam senken', 'Und senken.', 'Durchgang 3 von 10'),
    S('hold', 'ueber_0', 3.0, '10 Mal heben und senken', 'Zehn Mal heben und senken.'),
])

UEBUNGEN['nacken'] = ('Seitliche Nacken-Muskeln', [
    S('hold', 'nacken_0', 2.5, 'Aufrecht sitzen', 'Seitliche Nacken-Muskeln. Setzen Sie sich aufrecht hin.'),
    S('move', ['nacken_0', 'nacken_hand'], 1.8, 'Hand auflegen', 'Legen Sie die rechte Hand über den Kopf an das linke Ohr.'),
    S('move', ['nacken_hand', 'nacken_tilt'], 1.8, 'Sanft ziehen', 'Ziehen Sie den Kopf sanft nach rechts.'),
    *countdown('nacken_tilt', 5, 'Halten'),
    S('move', ['nacken_tilt', 'nacken_hand', 'nacken_0'], 2.0, 'Langsam lösen', 'Langsam lösen.'),
    S('move', ['nacken_0', 'nacken_other'], 1.8, 'Andere Seite', 'Jetzt die andere Seite.'),
    *countdown('nacken_other', 5, 'Halten'),
    S('move', ['nacken_other', 'nacken_0'], 1.8, 'Langsam lösen', 'Langsam lösen.'),
    S('hold', 'nacken_0', 3.0, '10 Mal je Seite', 'Zehn Mal je Seite. Ziehen Sie nie ruckartig.'),
])


# ---------------------------------------------------------------- ElevenLabs
def voice_id(key):
    vid = os.environ.get('ELEVENLABS_VOICE_ID')
    if vid: return vid
    req = urllib.request.Request('https://api.elevenlabs.io/v1/voices', headers={'xi-api-key': key})
    for v in json.load(urllib.request.urlopen(req))['voices']:
        if v['name'].strip().lower().startswith('ramona'): return v['voice_id']
    sys.exit('Stimme "Ramona" nicht im Konto gefunden. ELEVENLABS_VOICE_ID setzen.')

def tts(key, vid, text, ziel):
    body = json.dumps({'text': text, 'model_id': 'eleven_v4', 'language_code': 'de',
                       'voice_settings': {'stability': 0.6, 'similarity_boost': 0.8, 'speed': 0.9}}).encode()
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128',
                                 data=body, headers={'xi-api-key': key, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as r, open(ziel, 'wb') as f: f.write(r.read())

def clip_pfad(uebung, i): return os.path.join(CLIPS, uebung, f'{i:02d}.mp3')

def audio(nur):
    key = os.environ.get('ELEVENLABS_API_KEY') or sys.exit('ELEVENLABS_API_KEY fehlt.')
    vid = voice_id(key); zeichen = 0
    for name, (_, schritte) in UEBUNGEN.items():
        if nur and name not in nur: continue
        os.makedirs(os.path.join(CLIPS, name), exist_ok=True)
        for i, s in enumerate(schritte):
            p = clip_pfad(name, i)
            if os.path.exists(p): continue
            tts(key, vid, s['sprich'], p); zeichen += len(s['sprich'])
            print(name, i, s['sprich'])
    print('verbrauchte Zeichen:', zeichen)

def dauer(p):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                         capture_output=True, text=True).stdout.strip()
    return float(out or 0)


# ---------------------------------------------------------------- Video
def video(nur):
    os.makedirs(AUS, exist_ok=True)
    for name, (titel, schritte) in UEBUNGEN.items():
        if nur and name not in nur: continue
        frames, starts, last, t = [], [], None, 0
        def add(img, s): frames.append((img, s['anzeige'], s['zaehler']))
        for i, s in enumerate(schritte):
            starts.append(len(frames) / FPS)
            clip = clip_pfad(name, i)
            soll = max(s['sek'], dauer(clip) + 0.35) if os.path.exists(clip) else s['sek']
            n_ges = int(round(soll * FPS)); start = len(frames)
            bilder = [load(b) for b in s['bilder']]
            if last is not None and last is not bilder[0]:
                for k in range(3): add(Image.blend(last, bilder[0], (k + 1) / 3), s)
            if s['art'] == 'move' and len(bilder) > 1:
                per = max(4, int(s['sek'] * FPS / (len(bilder) - 1)))
                for a, b in zip(bilder, bilder[1:]):
                    for _ in range(per - 3): add(a, s)
                    for k in range(3): add(Image.blend(a, b, (k + 1) / 3), s)
            while len(frames) - start < n_ges: add(bilder[-1], s)
            last = bilder[-1]
        tmp = os.path.join(AUS, name + '_frames'); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
        for i, (img, text, sub) in enumerate(frames):
            fr = Image.new('RGB', (W, H), 'white'); fr.paste(img, (0, 130)); d = ImageDraw.Draw(fr)
            d.text((W / 2, 70), titel, font=fT, fill=DARK, anchor='mm')
            d.rounded_rectangle((60, 1040, W - 60, 1170), 28, fill=TEAL)
            d.text((W / 2, 1105), text, font=fL, fill='white', anchor='mm')
            if sub: d.text((W / 2, 1240), sub, font=fS, fill=DARK, anchor='mm')
            fr.save(os.path.join(tmp, f'{i:05d}.png'))
        mp4 = os.path.join(AUS, name + '.mp4')
        clips = [(clip_pfad(name, i), st) for i, st in enumerate(starts) if os.path.exists(clip_pfad(name, i))]
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(tmp, '%05d.png')]
        if clips:
            for p, _ in clips: cmd += ['-i', p]
            parts = [f'[{k + 1}:a]adelay={int(st * 1000)}|{int(st * 1000)}[a{k}]' for k, (_, st) in enumerate(clips)]
            mix = ''.join(f'[a{k}]' for k in range(len(clips)))
            filt = ';'.join(parts) + f';{mix}amix=inputs={len(clips)}:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100[aout]'
            cmd += ['-filter_complex', filt, '-map', '0:v', '-map', '[aout]', '-c:a', 'aac', '-b:a', '128k', '-ac', '1']
        cmd += ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', '-shortest', mp4]
        subprocess.run(cmd, check=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '1', '-i', mp4, '-frames:v', '1', '-q:v', '3',
                        '-vf', 'scale=540:-2', mp4.replace('.mp4', '.jpg')], check=True)
        shutil.rmtree(tmp)
        print(name, round(len(frames) / FPS, 1), 's', 'mit Ton' if clips else 'ohne Ton')


if __name__ == '__main__':
    modus, nur = (sys.argv[1] if len(sys.argv) > 1 else ''), sys.argv[2:]
    if modus == 'skripte':
        json.dump({n: {'titel': t, 'zeilen': [s['sprich'] for s in sch]} for n, (t, sch) in UEBUNGEN.items()},
                  open(os.path.join(HIER, 'skripte.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print('Zeichen gesamt:', sum(len(s['sprich']) for _, sch in UEBUNGEN.values() for s in sch))
    elif modus == 'audio': audio(nur)
    elif modus == 'video': video(nur)
    else: print(__doc__)
