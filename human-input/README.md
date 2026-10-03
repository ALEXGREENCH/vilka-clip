# HUMAN / INPUT

**AI is a tool. You are the reason.**

An English-language demoscene comedy: 23 procedural chapters, 5:48, 1080p / 50 fps. Each scene lasts approximately 15.16 seconds, twice the earlier pacing.

[Play the demo](https://alexgreench.github.io/vilka-clip/human-input/)

## Soundtrack

Pixel Pulse was supplied by the creator as an MP3 generated with Suno. The player now uses native stereo MP3 playback. Its original sound, melody, pitch and tempo are preserved; the active soundtrack has no MOD conversion, Paula processing or reconstructed instruments.

The supplied source is 3:39. The demo edit repeats an opening phrase and four twelve-bar passages to support the longer scenes, for a runtime of 348.631125 seconds. All source sections remain in their original order. Short 4 ms ramps are applied only at non-contiguous edit jumps, with a four-second final fade. The result is encoded as 48 kHz stereo MP3 at 320 kbps. The unmodified original MP3 is available as a separate download.

The browser plays the MP3 directly using HTML audio. The side panel shows musical position, not simulated tracker notes. Graphics follow the audio clock. A measured transient map and energy envelope drive pulses and a continuously integrated motion clock. Chapter cuts fall on six-bar boundaries at approximately 95 BPM; turbo montages use half-beats. Audio analysis and video export use the same edited soundtrack.

## Visuals

The Boing Ball follows a ballistic arc, compresses on impact and stretches on rebound. Fictional AI logos include OPEN INVOICE, CLAUDE NINE, GEMIN-I and DEEP SLEEP.

Scene 3 uses a rigid cube with consistent face winding and culling. Scenes 4 and 22 combine letter ripples, whole-line vertical waves and copper gradients. Scene 7 wraps its tunnel texture without an angular seam. Scene 10 omits decorative vertical stripes. Scene 18 uses one ground plane for streets and building foundations, clips at the camera and retires rows behind it. From 4:32, the finale adds a 4D tesseract, cyclic Penrose occlusion and recursive portals.

## Rebuild

Requires Node.js and FFmpeg with libx264, MP3 and AAC. FFmpeg is resolved from FFMPEG, then ../out/ffmpeg-path.txt, then PATH.

```sh
npm install
npm run music:demo
npm run studio:demo
npm run preview:demo
npm run render:demo
npm run verify:demo
```

Open http://127.0.0.1:8767/demoscene/. Space pauses, arrows select chapters and F toggles fullscreen. The source archive includes the supplied MP3, clean demo edit, code, font, research and validation reports; large MP4/WAV masters are downloaded separately or regenerated.

- mp3-music.cjs creates the clean extended audio edit and timing map. music.cjs is its entry point.
- timing.js contains measured audio data; rhythm.js interpolates it deterministically.
- engine.js, geometry.js, comedy.js and impossible.js implement the procedural effects.
- theme.js contains the English narrative; player.js implements native MP3 playback and seeking.
- render.cjs exports the 640x360 stage, scaled exactly 3x to 1920x1080 at 50 fps.

Local export filenames retain the raster-ritual prefix; published files use human-input. The master has 17432 frames; its endpoints match the soundtrack within one video frame. out/music-audit.json records the source edit and out/verification.json records the checks.

## Research and credits

The first 100 unique productions in Pouet's demo category, sorted by popularity, were retrieved on 2 October 2026. API metadata and production-page text were inspected; all 100 full videos were not watched. Page mentions are research clues, not verified effect attribution. No other demos' music, footage, samples or code are included. See research.html and research/top100.json.

The music is the creator's supplied Suno track Pixel Pulse. The procedural visuals and player were created for this demo. Press Start 2P is included under the SIL Open Font License in ../assets/PressStart2P-OFL.txt. The chrome title uses installed Impact with system fallbacks.

Validation covers original stereo playback, audio-derived timing, all scene motion and deterministic seeking, camera clipping, frame count, synchronized media duration and full video/audio decoding. Technical checks do not substitute for musical judgement.
