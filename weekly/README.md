# Ein Morgen in Deutschland – deutschmitfarsi (Wochenvideo)

Lernvideo 1920×1080 / 30 fps, deutsche Sprecherstimme (Piper `de-thorsten-low`), persische Übersetzung im Bild.
Alles ist Code: Layout = HTML/CSS/SVG, Rendering = Chromium (Playwright) über `render(t)`, Video = ffmpeg,
Stimme = Piper TTS (offline), Musik/Effekte = eigene Synthese in Python.

## Ergebnis (`out/`)

| Datei | Inhalt |
|---|---|
| `final.mp4` | fertiges Video mit Ton (nicht im Git, siehe Build) |
| `music_effects_only.mp4` | gleiches Bild, nur Musik + Effekte (für andere Sprachfassungen) |
| `thumbnail.jpg` | 1280×720 |
| `de.srt`, `fa.srt` | Untertitel mit echten Audiozeitmarken |
| `youtube_metadata.md` | Titel, Beschreibung, endgültige Kapitel, Credits |
| `qc_report.md`, `qc/` | technische Prüfung + Screenshots aus dem fertigen Video |

## Voraussetzungen

- Node 18+ (`npm ci` installiert Playwright; Chromium: `npx playwright install chromium`, falls nicht vorhanden)
- Python 3.10+ und `pip install -r requirements.txt`
- ffmpeg mit `ebur128`, `loudnorm`, `alimiter`, libx264
- Stimme (einmalig, ~63 MB):
  ```bash
  cd voice && curl -L -o v.tgz https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-de-thorsten-low.tar.gz && tar xzf v.tgz && rm v.tgz && cd ..
  ```
  (liefert `de-thorsten-low.onnx`, `.onnx.json` und `MODEL_CARD`)

## Build

```bash
npm ci
bash build.sh            # kompletter Durchlauf; WORKERS=3 parallel rendernde Chromium-Prozesse
```

Einzelschritte (alle idempotent):

```bash
python3 scripts/build_voice.py     # Synthese (Cache in voice/cache), misst Dauer -> build/timeline.json, voice_manifest.json
python3 audio/music.py             # Musikbett + Effekte (audio/*.wav)
python3 audio/mix.py               # EQ, Ducking 150/400 ms, Mastering -15 LUFS / TP <= -1.5 dBTP
node scripts/render.js all 3       # Szenen -> build/seg/NN.mp4 (vorhandene Segmente werden übersprungen = Wiederaufnahme)
node scripts/render.js scene 4     # nur Szene 5 neu rendern (Index ab 0)
node scripts/render.js stills 12.5,40   # Kontrollbilder -> out/qc/
bash scripts/assemble.sh           # out/final.mp4 + out/music_effects_only.mp4
python3 scripts/subs_meta.py       # de.srt, fa.srt, youtube_metadata.md
node scripts/thumbnail.js          # out/thumbnail.jpg
python3 scripts/qc.py              # out/qc_report.md
```

Nach Textänderungen in `src/cues.json`: `build_voice.py` → `music.py` → `mix.py` → betroffene Segmente in `build/seg` löschen → `render.js all` → `assemble.sh`.

## Struktur

- `src/cues.json` – Sprechtext (aus SCRIPT.md) als Einzelsätze, persische Übersetzung, Lernsätze (`learn`), Antwortpausen (`wait`)
- `src/visuals.js` – Layout jeder Szene; Zeiten kommen aus der gemessenen Timeline
- `src/engine.js` – deterministischer Renderer (`render(t)`), Untertitel, Hinweise „Langsam / Sprich nach / Du bist dran“
- `src/icons.js` – eigene SVG-Illustrationen; `src/lib.js`, `src/style.css` – aus der Master-Vorlage
- `assets/` – Pexels-Fotos (Nachweise: `ASSETS_AND_LICENSES.md`), `fonts/` – Inter, Lalezar (OFL)
- Paketunterlagen: `CLAUDE_START_HERE.md`, `SCRIPT.md`, `scenes.json`, `LEARNING_CUES.json`, `FACT_SOURCES.md`, `YOUTUBE_METADATA_DRAFT.md`

Kein automatischer Upload. Abweichungen vom Briefing (u. a. Dauer) stehen in `out/qc_report.md`.
