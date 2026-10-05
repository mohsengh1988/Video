#!/usr/bin/env python3
"""de.srt / fa.srt aus den gemessenen Audio-Cues, youtube_metadata.md mit endgültigen Kapiteln."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, 'build', 'timeline.json'), encoding='utf-8'))
OUT = os.path.join(ROOT, 'out')
os.makedirs(OUT, exist_ok=True)


def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


def write_srt(path, items):
    with open(path, 'w', encoding='utf-8') as f:
        for k, (a, b, txt) in enumerate(items, 1):
            f.write(f'{k}\n{ts(a)} --> {ts(b)}\n{txt}\n\n')


# Deutsch: gesprochene Sätze (inkl. langsamer Wiederholungen); Anzeige bis kurz nach Satzende
de = []
subs = TL['subs']
for i, s in enumerate(subs):
    nxt = subs[i + 1]['start'] if i + 1 < len(subs) else TL['duration']
    end = min(max(s['end'] + 0.6, s['start'] + 1.2), nxt - 0.04)
    txt = s['text'] + ('  (langsam)' if s.get('slow') else '')
    de.append((s['start'], end, txt))
write_srt(os.path.join(OUT, 'de.srt'), de)

# Persisch: wie im Bild – ab dem Cue mit Übersetzung bis zur nächsten Übersetzung bzw. Szenenende
fa = []
for sc in TL['scenes']:
    cs = [c for c in sc['cues'] if c.get('fa')]
    for k, c in enumerate(cs):
        end = cs[k + 1]['start'] - 0.04 if k + 1 < len(cs) else sc['end'] - 0.3
        fa.append((c['start'], end, '‫' + c['fa'] + '‬'))
write_srt(os.path.join(OUT, 'fa.srt'), fa)

# Kapitel
def mmss(t): t = int(t); return f'{t // 60:02d}:{t % 60:02d}'
chapters = '\n'.join(f"{mmss(sc['start'])} {sc['title']}" for sc in TL['scenes'])
dur = TL['duration']
md = f"""# YouTube-Metadaten (final, aus dem Render berechnet)

**Titel:** Ein Morgen in Deutschland | آلمانی در زندگی روزمره

**Länge:** {int(dur // 60)}:{dur % 60:05.2f} · 1920×1080 · 30 fps

## Beschreibung

یک صبح واقعی‌نما را به آلمانی تمرین کن: سفارش در نانوایی، پرسیدن قیمت، پرداخت، مسیر و سلام در محل کار. جمله‌های آلمانی با ترجمهٔ فارسی و تکرار آهسته.

برای درس‌های بعدی سابسکرایب کن.
Instagram: https://www.instagram.com/deutschmitfarsi/

#آموزش_آلمانی #DeutschLernen #DeutschMitFarsi

## Kapitel

{chapters}

## Hinweise / Credits

Fotos (Pexels License, https://www.pexels.com/license/):
- Bäckerei (Berlin): Manish Jain / Pexels – https://www.pexels.com/photo/assorted-artisan-breads-on-display-in-bakery-30853707/
- Brot und Kaffee: Angela Khebou / Pexels – https://www.pexels.com/photo/bread-and-coffee-14003973/
- Münchner U-Bahn (Innenraum): Maria Geller / Pexels – https://www.pexels.com/photo/empty-train-2799586/

Sprecherstimme: Piper TTS, Stimme „thorsten“ (de, low); Datensatz Thorsten-Voice (laut MODEL_CARD: CC0).
Musik und Effekte: eigene Synthese (Python), keine fremden Samples.
Schriften: Inter, Lalezar (SIL Open Font License).

Das Video zeigt eigene Lernbeispiele; die Fotos sind Symbolbilder und keine Aufnahmen des Dialogs. Keine offizielle Vertretung der dargestellten Orte oder Firmen. Didaktische A1–A2-Orientierung, keine Zertifizierungsbehauptung.

Untertitel zum Hochladen: `de.srt` (Deutsch), `fa.srt` (Persisch).
"""
open(os.path.join(OUT, 'youtube_metadata.md'), 'w', encoding='utf-8').write(md)
print('de.srt', len(de), 'cues; fa.srt', len(fa), 'cues')
print(chapters)
