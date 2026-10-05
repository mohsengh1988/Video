#!/usr/bin/env bash
# Kompletter, idempotenter Build. Wiederaufnahme: vorhandene Szenensegmente in build/seg werden übersprungen.
set -euo pipefail
cd "$(dirname "$0")"
python3 scripts/build_voice.py          # Piper-Synthese (Cache) + gemessene Timeline
python3 audio/music.py                  # Musikbett + Effekte
python3 audio/mix.py                    # Mischung, Ducking, Mastering
node scripts/render.js all "${WORKERS:-3}"   # Szenen rendern (Chromium -> ffmpeg)
bash scripts/assemble.sh                # final.mp4 + music_effects_only.mp4
python3 scripts/subs_meta.py            # de.srt, fa.srt, youtube_metadata.md
node scripts/thumbnail.js               # thumbnail.jpg (1280x720)
python3 scripts/qc.py                   # qc_report.md + Screenshots
