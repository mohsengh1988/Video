#!/usr/bin/env python3
"""Ruhiges, selbst synthetisiertes Musikbett (keine Samples, keine fremden Aufnahmen) + dezente Effekte.
Länge = Videolänge aus build/timeline.json. Ausgabe: audio/music.wav, audio/whoosh.wav, audio/chime.wav (48 kHz Stereo)."""
import json, os
import numpy as np
import scipy.io.wavfile as wf
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio')
SR = 48000
TL = json.load(open(os.path.join(ROOT, 'build', 'timeline.json'), encoding='utf-8'))
DUR = TL['duration'] + 0.5
N = int(DUR * SR)
rng = np.random.default_rng(7)
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
L = np.zeros(N); R = np.zeros(N)


def put(sig, t, pan=0.0, g=1.0):
    i = int(t * SR)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[:j - i] * g
    L[i:j] += s * np.sqrt(.5 * (1 - pan)); R[i:j] += s * np.sqrt(.5 * (1 + pan))


def pad(ms, dur):
    """weicher Flächenklang: wenige Obertöne, leichte Verstimmung, langsamer Ein-/Ausklang"""
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in ms:
        f = mf(m)
        for det in (-0.06, 0.06):
            ff = f * 2 ** (det / 12)
            x += np.sin(2 * np.pi * ff * t) + 0.28 * np.sin(4 * np.pi * ff * t) + 0.08 * np.sin(6 * np.pi * ff * t)
    a = int(1.6 * SR); r = int(1.8 * SR)
    env = np.ones(n); env[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2; env[-r:] *= np.cos(np.linspace(0, np.pi / 2, r)) ** 2
    return x * env * (1 + 0.04 * np.sin(2 * np.pi * 0.2 * t)) / (len(ms) * 2)


def keys(m, dur=2.2):
    """sanftes E-Piano: Sinus + leichte Obertöne, exponentielles Abklingen"""
    n = int(dur * SR); t = np.arange(n) / SR; f = mf(m)
    x = np.sin(2 * np.pi * f * t) + 0.22 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / .4) + 0.05 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t / .2)
    return x * np.exp(-t / 0.9) * np.minimum(1, t / 0.006)


def bass(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = mf(m)
    x = np.sin(2 * np.pi * f * t) + 0.15 * np.sin(4 * np.pi * f * t)
    return x * np.minimum(1, t / 0.05) * np.exp(-t / 2.5)


# F-Dur, 64 BPM, ruhige Progression: Fmaj7 – Dm7 – Bbmaj7 – Csus4/C
BEAT = 60 / 64; BAR = 4 * BEAT
CH = [(41, [57, 60, 64, 69]), (38, [57, 60, 62, 65]), (34, [58, 62, 65, 69]), (36, [55, 60, 65, 67])]
ARP = [[0, 2, 1, 3, 2, 1, 3, 2], [0, 1, 2, 3, 1, 2, 3, 1], [0, 2, 3, 1, 2, 3, 1, 2], [0, 1, 3, 2, 1, 3, 2, 3]]
nbars = int(DUR / BAR) + 2
for b in range(nbars):
    t0 = b * BAR; root, ch = CH[b % 4]
    put(pad(ch, BAR + 1.8), t0, 0.0, 0.32)
    put(bass(root, BAR), t0, -0.05, 0.30)
    pat = ARP[(b // 4) % 4]
    # Arpeggio nur in jedem zweiten 8-Takt-Block dichter, sonst luftig
    dense = (b // 8) % 2 == 1
    for k, idx in enumerate(pat):
        if not dense and k % 2: continue
        vel = 0.13 * (0.85 + 0.3 * rng.random())
        put(keys(ch[idx] + 12), t0 + k * BEAT / 2, 0.35 if k % 2 else -0.25, vel)
mix = np.stack([L, R], 1)
mix = sosfilt(butter(2, 45, btype='high', fs=SR, output='sos'), mix, axis=0)
mix = sosfilt(butter(2, 6500, btype='low', fs=SR, output='sos'), mix, axis=0)
# kleiner Raum: exponentiell abklingendes Rauschen als Impulsantwort
ir_n = int(1.8 * SR); tt = np.arange(ir_n) / SR
ir = rng.standard_normal((ir_n, 2)) * np.exp(-tt / 0.45)[:, None]; ir[0] = 0; ir /= np.abs(ir).sum(0) ** .5 * 6
wet = np.stack([fftconvolve(mix[:, c], ir[:, c])[:N] for c in range(2)], 1)
mix = mix * 0.8 + wet * 0.35
fin = np.ones(N); a = int(2.0 * SR); fin[:a] = np.linspace(0, 1, a) ** 2
f0 = N - int(3.5 * SR); fin[f0:] *= np.linspace(1, 0, N - f0) ** 1.5
mix *= fin[:, None]
mix /= np.abs(mix).max() * 1.12
wf.write(os.path.join(OUT, 'music.wav'), SR, (mix * 32767).astype(np.int16))

# Effekte: weicher Luftzug (Szenenwechsel), leiser Glockenton (Quiz-Auflösung)
n = int(.5 * SR); t = np.arange(n) / SR; x = rng.standard_normal(n)
lo = sosfilt(butter(2, [400, 2200], btype='band', fs=SR, output='sos'), x); hi = sosfilt(butter(2, [1200, 4500], btype='band', fs=SR, output='sos'), x)
w = t / t[-1]; wh = (lo * (1 - w) + hi * w) * np.sin(np.pi * np.minimum(1, t / .5)) ** 2.4; wh /= np.abs(wh).max()
wf.write(os.path.join(OUT, 'whoosh.wav'), SR, (np.stack([wh * .9, wh], 1) * 32767 * .5).astype(np.int16))
n = int(1.4 * SR); t = np.arange(n) / SR; ch = np.zeros(n)
for m, d in ((84, 0), (88, .09)):
    i = int(d * SR); tt = t[:n - i]; f = mf(m)
    ch[i:] += (np.sin(2 * np.pi * f * tt) * np.exp(-tt / .5) + .3 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt / .15)) * np.minimum(1, tt / .003)
ch /= np.abs(ch).max()
wf.write(os.path.join(OUT, 'chime.wav'), SR, (np.stack([ch, ch], 1) * 32767 * .5).astype(np.int16))
print('music', DUR, 's ok')
