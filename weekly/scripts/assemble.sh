#!/usr/bin/env bash
# Szenensegmente verketten und mit dem gemasterten Ton muxen.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
ls build/seg/[0-9][0-9].mp4 | sort | sed "s|^build/seg/|file '|; s|$|'|" > build/seg/list.txt
ffmpeg -y -v error -f concat -safe 0 -i build/seg/list.txt -c copy build/video_only.mp4
ffmpeg -y -v error -i build/video_only.mp4 -i audio/mix_master.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart -shortest out/final.mp4
ffmpeg -y -v error -i build/video_only.mp4 -i audio/music_fx_master.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart -shortest out/music_effects_only.mp4
ls -la out/*.mp4
