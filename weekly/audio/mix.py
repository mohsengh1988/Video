#!/usr/bin/env python3
"""Mischung: Sprache (EQ) + Musikbett mit Ducking (150 ms Attack / 400 ms Release) + Effekte.
Mastering (ffmpeg loudnorm, 2 Durchgänge) auf -15 LUFS integrated, True Peak <= -1.5 dBTP, 48 kHz Stereo.
Ausgabe: audio/mix_master.wav, audio/music_fx_master.wav"""
import json, os, re, subprocess
import numpy as np
import scipy.io.wavfile as wf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'audio'); B = os.path.join(ROOT, 'build')
SR = 48000
TL = json.load(open(os.path.join(B, 'timeline.json'), encoding='utf-8'))
N = int(round(TL['duration'] * SR))
VOICE_LUFS, MUSIC_LUFS, DUCK_DB = -16.0, -26.0, -6.0   # Musik unter Sprache ≈ -32 LUFS → ca. 16 dB unter der Stimme


def load(p):
    r, x = wf.read(p); assert r == SR, (p, r)
    x = x.astype(np.float32) / 32768.0
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x[:N]; return np.pad(x, ((0, N - len(x)), (0, 0)))


def save(p, x): wf.write(p, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


def lufs(x):
    tmp = os.path.join(B, '_lufs.wav'); save(tmp, x)
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', tmp, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1])


# --- Sprache mit EQ aus der Master-Vorlage
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(B, 'voice.wav'), '-af',
                'highpass=f=90,equalizer=f=3000:t=q:w=1:g=2.5,equalizer=f=200:t=q:w=1:g=-1.5', '-ac', '2', '-ar', str(SR),
                os.path.join(B, 'voice_eq.wav')], check=True)
vo = load(os.path.join(B, 'voice_eq.wav')); vo *= 10 ** ((VOICE_LUFS - lufs(vo)) / 20)

# --- Ducking-Hüllkurve (Steuerrate 1 kHz)
CR = 1000; nc = int(np.ceil(N / SR * CR)) + 1
tgt = np.ones(nc)
for sc in TL['scenes']:
    for c in sc['cues']:
        for a, b in [(c['start'], c['end'])] + ([tuple(c['slow'])] if 'slow' in c else []):
            tgt[int((a - .12) * CR):int((b + .25) * CR)] = 10 ** (DUCK_DB / 20)
env = np.empty(nc); cur = 1.0
aa, rr = np.exp(-1 / (.15 * CR)), np.exp(-1 / (.40 * CR))
for i in range(nc):
    k = aa if tgt[i] < cur else rr; cur = tgt[i] + (cur - tgt[i]) * k; env[i] = cur
duck = np.interp(np.arange(N) / SR, np.arange(nc) / CR, env).astype(np.float32)

mus = load(os.path.join(A, 'music.wav')); mus *= 10 ** ((MUSIC_LUFS - lufs(mus)) / 20)
mus_d = mus * duck[:, None]

# --- Effekte: leiser Luftzug an Szenenwechseln, Glockenton bei Quiz-Auflösungen
fx = np.zeros((N, 2), np.float32)
wh = load(os.path.join(A, 'whoosh.wav'))[:int(.5 * SR)]; chime = load(os.path.join(A, 'chime.wav'))[:int(1.4 * SR)]
def add(sig, t, g):
    i = int(t * SR); j = min(N, i + len(sig)); fx[i:j] += sig[:j - i] * g
for sc in TL['scenes'][1:]: add(wh, sc['start'] - .25, .05)
quiz = next(s for s in TL['scenes'] if s['id'] == 'weekly_16')
for k in (6, 8): add(chime, quiz['cues'][k]['start'] - .05, .06)

mix = vo + mus_d + fx
# Kontrolle: Musikpegel unter Sprache vs. Stimme
sp = duck < 0.75
stats = {'voice_lufs_speech': lufs(vo[sp]), 'music_lufs_under_speech': lufs(mus_d[sp]), 'music_lufs_between': lufs(mus_d[~sp])}
stats['music_below_voice_db'] = round(stats['voice_lufs_speech'] - stats['music_lufs_under_speech'], 2)
json.dump(stats, open(os.path.join(B, 'mix_stats.json'), 'w'), indent=1); print(stats)
music_fx = mus + fx
for name, x in (('mix_raw.wav', mix), ('music_fx_raw.wav', music_fx)): save(os.path.join(B, name), x)


def measure(path):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1]); TP = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)[-1])
    return I, TP


def master(src, dst, I=-15.0, comp=True):
    """sanfter Kompressor (Master-Vorlage) -> Pegel auf Ziel-LUFS -> Limiter mit Reserve für True Peak"""
    pre = os.path.join(B, '_pre.wav')
    af = 'acompressor=threshold=-22dB:ratio=3:attack=5:release=150:knee=4' if comp else 'anull'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-af', af, '-c:a', 'pcm_f32le', pre], check=True)
    x, _ = measure(pre)
    g = I - x
    for lim_db in (-2.3, -2.8, -3.3, -3.8):
        af = f'volume={g:.3f}dB,alimiter=limit={10 ** (lim_db / 20):.5f}:attack=3:release=60:level=0,aresample=48000'
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', pre, '-af', af, '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s24le', dst], check=True)
        oi, otp = measure(dst)
        if otp <= -1.5: break
    print(os.path.basename(dst), f'integrated {oi:.2f} LUFS, true peak {otp:.2f} dBTP (limit {lim_db} dBFS)')
    return oi, otp


master(os.path.join(B, 'mix_raw.wav'), os.path.join(A, 'mix_master.wav'))
master(os.path.join(B, 'music_fx_raw.wav'), os.path.join(A, 'music_fx_master.wav'), I=-20.0, comp=False)
