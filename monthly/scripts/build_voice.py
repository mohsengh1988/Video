#!/usr/bin/env python3
"""Synthesize every cue with Piper (de-thorsten-low), measure the real durations
and build the master timeline (build/timeline.json + build/timeline.js),
the voice track (build/voice.wav) and voice_manifest.json.

Idempotent: synthesized clips are cached in voice/cache/<hash>.wav.
"""
import hashlib, json, os, subprocess, sys
import numpy as np
import scipy.io.wavfile as wf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.join(ROOT, 'voice', 'de-thorsten-low.onnx')
CACHE = os.path.join(ROOT, 'voice', 'cache')
BUILD = os.path.join(ROOT, 'build')
SR = 48000

SCALE_EXPLAIN = 1.12   # normales Erklärungstempo
SCALE_LEARN = 1.15     # markierte Lernsätze, erster Durchlauf
SCALE_SLOW = 1.60      # langsame Wiederholung
LEARNER_PAUSE = 4.0    # Nachsprech-Pause nach der langsamen Wiederholung
GAP = 0.60             # Pause zwischen Sätzen
GAP_Q = 0.75           # Pause nach einer Frage
GAP_SLOW = 0.70        # zwischen normalem und langsamem Lernsatz
LEAD = 0.90            # Szenenanfang bis erster Satz
TAIL = 1.10            # letzter Satz bis Szenenende
SUB_MAX = 84           # längere Untertitel werden in zwei Blöcke geteilt


def synth(text, scale):
    os.makedirs(CACHE, exist_ok=True)
    h = hashlib.sha1(f'{text}|{scale}|thorsten-low|v1'.encode()).hexdigest()[:16]
    out = os.path.join(CACHE, h + '.wav')
    if not os.path.exists(out):
        raw = out + '.raw.wav'
        subprocess.run([sys.executable, '-m', 'piper', '-m', MODEL, '-f', raw,
                        '--length-scale', str(scale), '--sentence-silence', '0.25'],
                       input=text.encode(), check=True, capture_output=True)
        # trim leading/trailing silence, resample to 48 kHz
        af = ('silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
              'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
              'aresample=48000:resampler=soxr')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', af, '-ac', '1',
                        '-ar', str(SR), '-c:a', 'pcm_s16le', out], check=True)
        os.remove(raw)
    r, x = wf.read(out)
    assert r == SR
    return out, x.astype(np.float32) / 32768.0


def split_sub(text, t0, t1):
    if len(text) <= SUB_MAX:
        return [{'text': text, 'start': t0, 'end': t1}]
    mid = len(text) / 2
    best = None
    for sep in (': ', '; ', ', ', '. ', '? '):
        i = 0
        while True:
            i = text.find(sep, i + 1)
            if i < 0:
                break
            score = abs(i - mid) + (0 if sep in (': ', '. ', '? ') else 6)
            if best is None or score < best[0]:
                best = (score, i + len(sep.rstrip()))
    if best is None:
        k = text.rfind(' ', 0, int(mid)) or int(mid)
        best = (0, k)
    a, b = text[:best[1]].strip(), text[best[1]:].strip()
    tm = t0 + (t1 - t0) * len(a) / (len(a) + len(b))
    return [{'text': a, 'start': t0, 'end': tm}, {'text': b, 'start': tm, 'end': t1}]


def main():
    data = json.load(open(os.path.join(ROOT, 'src', 'cues.json'), encoding='utf-8'))
    os.makedirs(BUILD, exist_ok=True)
    clips, scenes, t = [], [], 0.0
    for sc in data['scenes']:
        s0 = t
        t += LEAD
        cues = []
        for i, c in enumerate(sc['cues']):
            scale = SCALE_LEARN if c.get('learn') else SCALE_EXPLAIN
            path, x = synth(c['say'], scale)
            d = len(x) / SR
            cue = {k: v for k, v in c.items()}
            cue.update(i=i, start=round(t, 3), end=round(t + d, 3), show=c.get('show', c['say']))
            clips.append({'scene': sc['id'], 'cue': i, 'kind': 'normal', 'text': c['say'],
                          'length_scale': scale, 'start': round(t, 3), 'duration': round(d, 3),
                          'file': os.path.relpath(path, ROOT), 'x': x})
            t += d
            if c.get('learn'):
                t += GAP_SLOW
                path2, x2 = synth(c['say'], SCALE_SLOW)
                d2 = len(x2) / SR
                cue['slow'] = [round(t, 3), round(t + d2, 3)]
                clips.append({'scene': sc['id'], 'cue': i, 'kind': 'slow_repeat', 'text': c['say'],
                              'length_scale': SCALE_SLOW, 'start': round(t, 3), 'duration': round(d2, 3),
                              'file': os.path.relpath(path2, ROOT), 'x': x2})
                t += d2
                cue['hold'] = [round(t, 3), round(t + LEARNER_PAUSE, 3)]
                t += LEARNER_PAUSE
            elif c.get('wait'):
                t += 0.4
                cue['wait'] = [round(t, 3), round(t + c['wait'], 3)]
                t += c['wait']
            elif c.get('pause'):
                cue['pause'] = [round(t, 3), round(t + c['pause'], 3)]
                t += c['pause']
            if i < len(sc['cues']) - 1:
                t += c.get('gap', GAP_Q if c['say'].rstrip().endswith('?') else GAP)
            cues.append(cue)
        t += TAIL
        scenes.append({'id': sc['id'], 'title': sc['title'], 'photo': sc.get('photo'),
                       'start': round(s0, 3), 'end': round(t, 3), 'cues': cues})
    total = t
    # ---- voice track
    n = int(np.ceil(total * SR))
    vo = np.zeros(n, np.float32)
    for c in clips:
        i = int(round(c['start'] * SR))
        x = c.pop('x')
        vo[i:i + len(x)] += x[:n - i]
    wf.write(os.path.join(BUILD, 'voice.wav'), SR, (np.clip(vo, -1, 1) * 32767).astype(np.int16))
    # ---- subtitles (spoken text, with slow repeats)
    subs = []
    for sc in scenes:
        for c in sc['cues']:
            subs += [dict(s, cue=c['i'], scene=sc['id']) for s in split_sub(c['show'], c['start'], c['end'])]
            if 'slow' in c:
                subs += [dict(s, cue=c['i'], scene=sc['id'], slow=True)
                         for s in split_sub(c['show'], c['slow'][0], c['slow'][1])]
    tl = {'title_de': data['title_de'], 'title_fa': data['title_fa'], 'level': data.get('level', 'A1–A2'), 'duration': round(total, 3),
          'fps': 30, 'scenes': scenes, 'subs': subs}
    json.dump(tl, open(os.path.join(BUILD, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    with open(os.path.join(BUILD, 'timeline.js'), 'w', encoding='utf-8') as f:
        f.write('window.TL=' + json.dumps(tl, ensure_ascii=False) + ';\n')
    json.dump({'voice': 'Piper TTS, de-thorsten-low (de, 16 kHz, 1 speaker), resampled to 48 kHz',
               'model_card': 'voice/MODEL_CARD', 'length_scales': {'explain': SCALE_EXPLAIN, 'learn': SCALE_LEARN, 'slow': SCALE_SLOW},
               'learner_pause_seconds': LEARNER_PAUSE, 'total_duration': round(total, 3),
               'repetitions': [c for c in clips if c['kind'] == 'slow_repeat'],
               'clips': clips},
              open(os.path.join(ROOT, 'voice_manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for sc in scenes:
        print(f"{sc['id']:10s} {sc['title']:26s} start {sc['start']:7.2f}  dur {sc['end'] - sc['start']:6.2f}")
    print(f'TOTAL {total:.2f}s = {int(total // 60)}:{total % 60:05.2f}')


if __name__ == '__main__':
    main()
