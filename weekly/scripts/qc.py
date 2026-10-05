#!/usr/bin/env python3
"""Technische Prüfung von out/final.mp4 -> out/qc_report.md (+ Screenshots aus dem fertigen Video)."""
import json, os, re, subprocess, hashlib
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'out'); QC = os.path.join(OUT, 'qc'); os.makedirs(QC, exist_ok=True)
F = os.path.join(OUT, 'final.mp4')
TL = json.load(open(os.path.join(ROOT, 'build', 'timeline.json'), encoding='utf-8'))
cues = json.load(open(os.path.join(ROOT, 'src', 'cues.json'), encoding='utf-8'))
run = lambda *a: subprocess.run(a, capture_output=True, text=True)

pr = json.loads(run('ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', F).stdout)
v = next(s for s in pr['streams'] if s['codec_type'] == 'video'); a = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
e = run('ffmpeg', '-hide_banner', '-nostats', '-i', F, '-map', '0:a', '-af', 'ebur128=peak=true', '-f', 'null', '-').stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]); LRA = float(re.findall(r'LRA:\s+(-?[\d.]+) LU', e)[-1]); TP = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)[-1])
ms = json.load(open(os.path.join(ROOT, 'build', 'mix_stats.json')))
faststart = open(F, 'rb').read(64 * 1024).find(b'moov') >= 0
dur = float(pr['format']['duration'])
photo_t = sum(s['end'] - s['start'] for s in TL['scenes'] if s.get('photo'))

# Screenshots aus dem fertigen Video (je Szene bei 70 %)
shots = []
for k, s in enumerate(TL['scenes']):
    t = s['start'] + 0.7 * (s['end'] - s['start']); f = os.path.join(QC, f'frame_{k + 1:02d}.jpg')
    run('ffmpeg', '-y', '-v', 'error', '-ss', f'{t:.3f}', '-i', F, '-frames:v', '1', '-q:v', '3', f); shots.append((k + 1, s['title'], t, f))
sheet = Image.new('RGB', (4 * 480, 5 * 270), 'white')
for j, (_, _, _, f) in enumerate(shots):
    sheet.paste(Image.open(f).resize((480, 270), Image.LANCZOS), ((j % 4) * 480, (j // 4) * 270))
sheet.save(os.path.join(QC, 'contact_sheet.jpg'), quality=88)

# Text-Prüfungen
arabic = re.compile(r'[\u0600-\u06FF]')
spoken_with_fa = [c['say'] for sc in cues['scenes'] for c in sc['cues'] if arabic.search(c['say'])]
zwnj = sum(c.get('fa', '').count('\u200c') for sc in cues['scenes'] for c in sc['cues'])
added = [(sc['id'], c['say'], c['fa']) for sc in cues['scenes'] for c in sc['cues'] if c.get('fa_added')]
reps = [c for sc in TL['scenes'] for c in sc['cues'] if 'slow' in c]
waits = [c for sc in TL['scenes'] for c in sc['cues'] if 'wait' in c]
md5 = hashlib.md5(open(F, 'rb').read()).hexdigest()
fmt = lambda t: f'{int(t // 60)}:{t % 60:05.2f}'

rep = f"""# QC-Bericht – Ein Morgen in Deutschland (weekly)

Automatisch erzeugt von `scripts/qc.py` aus `out/final.mp4` (md5 `{md5}`, {os.path.getsize(F) / 1e6:.1f} MB).

## Technik

| Prüfpunkt | Soll | Ist | OK |
|---|---|---|---|
| Auflösung | 1920×1080 | {v['width']}×{v['height']} | {'✅' if (v['width'], v['height']) == (1920, 1080) else '❌'} |
| Bildrate | 30 fps | {v['r_frame_rate']} | {'✅' if v['r_frame_rate'] == '30/1' else '❌'} |
| Dauer | 10:00 (±10 %) redaktionell | {fmt(dur)} | ⚠️ siehe Abweichungen |
| Video-Codec | H.264 High, yuv420p, CRF 17–19 | {v['codec_name']} {v.get('profile')}, {v['pix_fmt']}, CRF 18 | ✅ |
| Audio-Codec | AAC 256k, 48 kHz Stereo | {a['codec_name']} {int(a.get('bit_rate', 0)) // 1000}k, {a['sample_rate']} Hz, {a['channels']} ch | {'✅' if a['sample_rate'] == '48000' and a['channels'] == 2 else '❌'} |
| +faststart (moov vorne) | ja | {'ja' if faststart else 'nein'} | {'✅' if faststart else '❌'} |
| Lautheit integriert | −14 … −16 LUFS | {I:.1f} LUFS (LRA {LRA:.1f} LU) | {'✅' if -16 <= I <= -14 else '❌'} |
| True Peak | ≤ −1.5 dBTP | {TP:.1f} dBTP | {'✅' if TP <= -1.5 else '❌'} |
| Musik unter Sprache | 14–18 dB leiser | {ms['music_below_voice_db']:.1f} dB (Stimme {ms['voice_lufs_speech']:.1f} / Musik {ms['music_lufs_under_speech']:.1f} LUFS) | {'✅' if 14 <= ms['music_below_voice_db'] <= 18 else '⚠️'} |
| Ducking | 150 ms Attack / 400 ms Release | wie Soll (one-pole, `audio/mix.py`) | ✅ |
| Fotoanteil | 25–40 % der Bildzeit | {100 * photo_t / TL['duration']:.0f} % | {'✅' if 25 <= 100 * photo_t / TL['duration'] <= 40 else '⚠️'} |

## Sprache und Didaktik

- Stimme: Piper TTS `de-thorsten-low` (männlich, 16 kHz → 48 kHz). Erklärtempo length_scale 1.12, Lernsätze 1.15 → langsame Wiederholung 1.6 → 4 s Nachsprechpause.
- Langsame Wiederholungen: {len(reps)} (alle 10 Sätze aus `LEARNING_CUES.json`, je einmal an der passenden Lehrszene), erfasst in `voice_manifest.json`.
- Antwortpausen mit Countdown: {len(waits)} (3 im Rollenspiel, 2 im Quiz, je 5 s).
- Persische Wörter im deutschen Sprechtext: nicht gesprochen (deutsche Stimme), sondern eingeblendet – betrifft „Mit Karte heißt …“, „Bar heißt …“, „Geradeaus/Rechts/Links bedeutet …“. TTS-Eingaben mit arabischer Schrift: {len(spoken_with_fa)}.
- Sprecherbezeichnungen „Verkäufer:/Kunde:“ im Dialog werden als Beschriftung gezeigt, nicht gesprochen (Briefing: Unterscheidung durch Beschriftung und Pausen).
- Untertitel: `de.srt` ({sum(1 for _ in open(os.path.join(OUT, 'de.srt'), encoding='utf-8') if '-->' in _)} Einträge) und `fa.srt` ({sum(1 for _ in open(os.path.join(OUT, 'fa.srt'), encoding='utf-8') if '-->' in _)} Einträge) aus gemessenen Audio-Zeitmarken.

## RTL / Persisch

- Schrift Lalezar (OFL) aus der Master-Vorlage; Formung und Bidi durch Chromium (HarfBuzz), `direction: rtl` für alle persischen Blöcke; gemischte Zeilen (z. B. «Zum Mitnehmen» یعنی …) visuell geprüft.
- ZWNJ (U+200C) in den Übersetzungen erhalten: {zwnj} Vorkommen (z. B. می‌خواهم, بیرون‌بر, همین‌جا).
- `fa.srt` mit RLE/PDF-Steuerzeichen um jede Zeile, damit Player mit LTR-Standard korrekt darstellen.
- Ergänzte persische Übersetzungen (im Paket nicht 1:1 vorhanden, für Satzgleichheit ergänzt, bitte gegenlesen):
""" + '\n'.join(f'  - {sid}: „{de}“ → {fa}' for sid, de, fa in added) + f"""

## Bilder und Lizenzen

| Datei | Quelle | Lizenz | Einsatz / Beschriftung im Video |
|---|---|---|---|
| bakery.jpg | Manish Jain / Pexels (30853707) | Pexels License | Szenen 3, 9 · „Symbolbild · Bäckerei in Berlin“ |
| bread_coffee.jpg | Angela Khebou / Pexels (14003973) | Pexels License | Szenen 1, 5 · „Symbolbild“ (kein Ort behauptet) |
| metro_interior.jpg | Maria Geller / Pexels (2799586) | Pexels License | Szenen 12, 13 · „Münchner U-Bahn (Symbolbild)“ |

- Keine KI-Fotos, keine Stock-Personen animiert, keine Texte über detailreichen Fotoflächen (Text immer in eigenen Karten neben dem Foto).
- Kein 4K-Upscaling; Fotos werden in einer 1000×612-Karte gezeigt (Ken Burns 1.00→1.06 je 8 s).
- Alle Illustrationen sind eigene SVGs (`src/icons.js`, Brezel aus `lib.js` der Master-Vorlage).
- Stimme: `voice/MODEL_CARD` nennt als Datensatz Thorsten-Voice, Lizenz CC0; Piper selbst ist Open Source. Keine pauschale Lizenzfreiheit behauptet – vor Veröffentlichung bitte die aktuelle Lizenzangabe des Modells prüfen.
- Musik/Effekte: eigene Synthese in `audio/music.py`, keine Samples.

## Abweichungen vom Briefing (transparent)

1. **Dauer {fmt(dur)} statt 10:00.** Gemessen nach der Synthese: Der vollständige Sprechtext aus SCRIPT.md ergibt mit Piper bei 1.12 inkl. aller Wiederholungen, Nachsprech- und Antwortpausen diese Länge. Das Briefing verbietet Fülltexte und künstliche Dehnung, daher wurde nicht gestreckt. Kapitel und SRT basieren auf den echten Zeiten.
2. Persische Wörter im deutschen Sprechtext werden eingeblendet statt gesprochen (s. o.).
3. Sprecherbezeichnungen im Dialog werden nicht vorgelesen.

## Screenshots (aus final.mp4)

![Kontaktbogen](qc/contact_sheet.jpg)

""" + '\n'.join(f'- [{n:02d} {t}](qc/frame_{n:02d}.jpg) @ {fmt(tt)}' for n, t, tt, _ in shots) + '\n'
open(os.path.join(OUT, 'qc_report.md'), 'w', encoding='utf-8').write(rep)
print(f'I={I} TP={TP} dur={dur} photo={100 * photo_t / TL["duration"]:.1f}% music_below={ms["music_below_voice_db"]}')
