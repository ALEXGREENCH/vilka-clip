# HUMAN / INPUT

**AI is a tool. You are the reason.**

An English-language, deliberately self-referential demoscene comedy. Machine-generated code and music; human-initiated intention. 184.32 seconds, 24 chapters, 125 BPM with double-time turbo sections, four ProTracker channels, 15 original synthesized 8-bit samples, 1080p / 50 fps.

## Play

Published player: https://alexgreench.github.io/vilka-clip/human-input/

From the parent directory containing package.json:

```sh
npm install
npm run studio:demo
```

Open http://127.0.0.1:8767/demoscene/ and select Run the demo. Space pauses, arrows select chapters, F toggles fullscreen. The tracker panel displays actual MOD notes and instrument numbers. The browser plays a decoded AAC copy of the MOD while the graphics follow the audio clock.

## Sound and comedy

The hard melodic chiptune combines an overdriven pulse lead, saturated triangle bass, strong synthesized kick/snare, rapid crystal arpeggios and add9 harmony. The Am–F–C–G theme develops through a Dm–F–Am–G bridge, a quiet break and double-time sections with a 250 BPM feel. The actual tracker tempo remains 125 BPM, keeping the visual timeline exact.

All instruments and the lead's short echo are stored in the real MOD samples. The WAV/AAC master adds gain, gentle bus compression, a limiter and the ending fade. Verified master levels: mean -13.9 dBFS, peak -1.1 dBFS. The MOD remains editable in ProTracker 2 clone or OpenMPT.

The Amiga-style red-and-white Boing Ball appears early and returns as the disruptive guest at a board of fictional AI-logo parodies: OPEN INVOICE, CLAUDE NINE, GEMIN-I and DEEP SLEEP. Their designs are original vector caricatures.

## Impossible finale

From 2:18, the film adds a projected 4D tesseract, a Penrose triangle with cyclic local occlusion, recursive Droste portals, and a ray-marched Menger sponge. Chapter 22 uses a stable external orbit: the camera stays outside the bounded object and points at its centre. It replaces the earlier close-up Mandelbox shot.

The two turbo montages cut on half-beats. The pulse stays musical; the title cards and end message remain readable. These are new implementations for this demo, not claims of inventing mathematical effects.

## Rebuild

Requires Node.js and FFmpeg with libopenmpt, libx264 and AAC. FFmpeg is resolved from the FFMPEG environment variable, then ../out/ffmpeg-path.txt, then PATH.

```sh
npm run music:demo
npm run preview:demo
npm run render:demo
npm run verify:demo
```

- music.cjs synthesizes samples, composes the score and writes a binary M.K. MOD.
- theme.js contains the English five-act narrative.
- engine.js is the deterministic 24-scene renderer shared by browser and export.
- comedy.js draws the Boing Ball and fictional logo parodies.
- impossible.js renders the 4D, Penrose, recursive and Menger finale.
- player.js implements audio-clock playback, seeking and the pattern viewer.
- render.cjs streams RGBA frames to FFmpeg.
- build-research.cjs generates the English 100-demo study.

The virtual stage is 640x360, scaled exactly 3x for the 1080p master. Most pixel fields use smaller buffers. The browser's final fractal uses a 448x252 WebGL buffer; software export uses 224x126 and the same distance field and camera, so fine pixels differ. A software fallback runs when WebGL is unavailable. Slower machines may show fewer realtime frames; the MP4 always contains all 9216 frames at 50 fps. This is a modern software demo, not an Amiga hardware emulator.

## Files

Local output filenames retain the initial raster-ritual prefix:

- out/raster-ritual.mp4: full-quality 1080p/50 fps master.
- out/human-input-web.mp4: compact 1080p/50 fps web copy.
- out/raster-ritual.mod: real four-channel ProTracker module, 196688 bytes.
- out/raster-ritual.wav: 48 kHz, 16-bit stereo master.
- out/raster-ritual.m4a: AAC browser soundtrack.
- out/raster-ritual-source.zip: code, MOD, browser audio, font and research.
- out/contact-sheet.png: all 24 chapters.
- out/verification.json: validation results.
- research.html and research/top100.json: the English research report and dataset.

The portable archive excludes the large MP4/WAV files; download them separately or regenerate them. Published filenames use human-input.

## Research and validation

The first 100 unique entries in Pouet's demo category sorted by popularity were retrieved on 2 October 2026. API metadata and production-page text, including discussions, were inspected. All 100 complete videos were not watched. Effect mentions are search clues, not verified technical attribution. No other demos' code, music, footage or samples are included.

Validation checks all 6144 MOD cells against the player score, motion and deterministic seeking in every scene, 100 unique research records, 9216 video frames, aligned audio/video duration, and complete error-free decoding. Technical checks do not replace listening or artistic judgement.

Press Start 2P is included under the SIL Open Font License in ../assets/PressStart2P-OFL.txt. The chrome logo uses installed Impact with system fallbacks; its letterforms may vary across systems.
