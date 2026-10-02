# HUMAN / INPUT

**AI is a tool. You are the reason.**

An English-language, deliberately self-referential demoscene comedy. Machine-generated code and music; human-initiated intention. 176.64 seconds, 23 chapters, 125 BPM with double-time turbo sections, four ProTracker channels, 15 original synthesized 8-bit samples, 1080p / 50 fps.

## Play

Published player: https://alexgreench.github.io/vilka-clip/human-input/

From the parent directory containing package.json:

```sh
npm install
npm run studio:demo
```

Open http://127.0.0.1:8767/demoscene/ and select Run the demo. Space pauses, arrows select chapters, F toggles fullscreen. The tracker panel displays actual MOD notes and instrument numbers. The browser replays the MOD live in an AudioWorklet using libopenmpt, with Paula resampling and Amiga 500 filters. Choose Amiga 1200 for a brighter sound. Graphics follow the audio clock on every display refresh. An A500-rendered AAC copy is the fallback if AudioWorklet initialization fails.

## Sound and comedy

The hard melodic chiptune combines an overdriven pulse lead, saturated triangle bass, strong synthesized kick/snare, rapid crystal arpeggios and add9 harmony. The Am–F–C–G theme develops through a Dm–F–Am–G bridge, a quiet break and double-time sections with a 250 BPM feel. The actual tracker tempo remains 125 BPM, keeping the visual timeline exact.

All instruments and the lead's short echo are stored in the real MOD samples. The browser and WAV/AAC exports share the same A500 replay path, 80% stereo separation, gentle soft saturation with headroom, and ending fade. The MOD remains editable in ProTracker 2 clone or OpenMPT.

The Amiga-style red-and-white Boing Ball appears early and returns as the disruptive guest at a board of fictional AI-logo parodies: OPEN INVOICE, CLAUDE NINE, GEMIN-I and DEEP SLEEP. Their designs are original vector caricatures. The ball follows a ballistic arc, compresses against the floor, stretches on rebound, and casts a height-sensitive shadow. Scene transitions use eased fades; turbo cuts remain on the beat.

## Impossible finale

From 2:18, the film adds a projected 4D tesseract, a Penrose triangle with cyclic local occlusion, and recursive Droste portals. The turbo finale flows directly into the greetings and closing title.

The two turbo montages cut on half-beats. The pulse stays musical; the title cards and end message remain readable. These are new implementations for this demo, not claims of inventing mathematical effects.

## Rebuild

Requires Node.js and FFmpeg with libx264 and AAC. FFmpeg is resolved from the FFMPEG environment variable, then ../out/ffmpeg-path.txt, then PATH.

```sh
npm run music:demo
npm run preview:demo
npm run render:demo
npm run verify:demo
```

- music.cjs synthesizes samples, composes the score and writes a binary M.K. MOD.
- amiga.js and vendor/paula-worklet.js handle live MOD replay; amiga-render.cjs renders the same sound offline.
- theme.js contains the English five-act narrative.
- engine.js is the deterministic 23-scene renderer shared by browser and export.
- comedy.js draws the Boing Ball and fictional logo parodies.
- impossible.js renders the 4D, Penrose and recursive finale.
- player.js implements audio-clock playback, seeking and the pattern viewer.
- render.cjs streams RGBA frames to FFmpeg.
- build-research.cjs generates the English 100-demo study.

The virtual stage is 640x360, scaled exactly 3x for the 1080p master. Most pixel fields use smaller buffers. The effects use a deterministic software renderer shared by the player and export. Slower machines may show fewer realtime frames; the MP4 always contains all 8832 frames at 50 fps. This is a modern software demo, not an Amiga hardware emulator.

## Files

Local output filenames retain the initial raster-ritual prefix:

- out/raster-ritual.mp4: full-quality 1080p/50 fps master.
- out/human-input-web.mp4: compact 1080p/50 fps web copy.
- out/raster-ritual.mod: real four-channel ProTracker module, 195664 bytes.
- out/raster-ritual.wav: 48 kHz, 16-bit stereo master.
- out/raster-ritual.m4a: AAC fallback soundtrack.
- out/raster-ritual-source.zip: code, MOD, browser audio, font and research.
- out/contact-sheet.png: all 23 chapters.
- out/verification.json: validation results.
- research.html and research/top100.json: the English research report and dataset.

The portable archive excludes the large MP4/WAV files; download them separately or regenerate them. Published filenames use human-input.

## Research and validation

The first 100 unique entries in Pouet's demo category sorted by popularity were retrieved on 2 October 2026. API metadata and production-page text, including discussions, were inspected. All 100 complete videos were not watched. Effect mentions are search clues, not verified technical attribution. No other demos' code, music, footage or samples are included.

Validation checks all 5888 MOD cells against the player score, motion and deterministic seeking in every scene, 100 unique research records, 8832 video frames, aligned audio/video duration, and complete error-free decoding. Technical checks do not replace listening or artistic judgement.

Press Start 2P is included under the SIL Open Font License in ../assets/PressStart2P-OFL.txt. The chrome logo uses installed Impact with system fallbacks; its letterforms may vary across systems.

## Audio engine credits

The vendored libopenmpt WebAssembly build comes from chiptune3 0.8.9 by DrSnuggles. The custom AudioWorklet and shared replay wrapper use libopenmpt directly. See vendor/LIBOPENMPT-LICENSE.txt and vendor/CHIPTUNE3-LICENSE.txt. The sound emulates Paula resampling and Amiga analogue filters, not the whole Amiga machine.

- https://github.com/DrSnuggles/chiptune
- https://lib.openmpt.org/doc/group__libopenmpt__c.html
