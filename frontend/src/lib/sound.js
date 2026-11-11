// Site-wide ambient music: one looping track, faded in/out, with a level meter
// the hero scene can react to. Audio only ever starts from a user gesture.
import { useSyncExternalStore } from "react";

const SRC = "/audio/loop.mp3";
const VOLUME = 0.35;
const KEY = "gotham-sound";

let audio = null;
let analyser = null;
let data = null;
let playing = false;
let fadeRaf = 0;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

function readPref() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function writePref(v) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    // storage blocked — preference just isn't remembered
  }
}

function ensureAudio() {
  if (audio) return audio;
  audio = new Audio(SRC);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const src = ctx.createMediaElementSource(audio);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    data = new Uint8Array(analyser.frequencyBinCount);
    src.connect(analyser);
    analyser.connect(ctx.destination);
    audio.addEventListener("play", () => ctx.state === "suspended" && ctx.resume());
  } catch {
    analyser = null; // no Web Audio: music still plays, the scene just won't pulse
  }
  return audio;
}

function fadeTo(target, ms, done) {
  cancelAnimationFrame(fadeRaf);
  const from = audio.volume;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    audio.volume = from + (target - from) * k;
    if (k < 1) fadeRaf = requestAnimationFrame(step);
    else done?.();
  };
  fadeRaf = requestAnimationFrame(step);
}

export const sound = {
  /** Must be called from a click/tap handler. */
  play() {
    const a = ensureAudio();
    a.play()
      .then(() => {
        playing = true;
        writePref("on");
        fadeTo(VOLUME, 1600);
        emit();
      })
      .catch(() => {
        playing = false;
        emit();
      });
  },
  pause() {
    if (!audio) return;
    playing = false;
    writePref("off");
    emit();
    fadeTo(0, 500, () => !playing && audio.pause());
  },
  /**
   * Music on by default: try to start now, and if the browser blocks autoplay,
   * start on the visitor's first click / tap / key press. Respects a previous mute.
   */
  autostart() {
    if (readPref() === "off" || playing) return;
    const a = ensureAudio();
    a.play()
      .then(() => {
        playing = true;
        fadeTo(VOLUME, 1600);
        emit();
      })
      .catch(() => {
        const events = ["pointerup", "keydown", "touchend"];
        const go = (e) => {
          // a press on the mute button itself is handled by the button
          if (e.target.closest?.("[data-sound-toggle]")) return;
          events.forEach((ev) => window.removeEventListener(ev, go, true));
          if (readPref() !== "off" && !playing) sound.play();
        };
        events.forEach((e) => window.addEventListener(e, go, { capture: true, passive: true }));
      });
  },
  toggle() {
    playing ? sound.pause() : sound.play();
  },
  isPlaying: () => playing,
  /** "on" | "off" | null (never chosen) */
  preference: readPref,
  /** 0…1 loudness of the low end, for visuals. */
  level() {
    if (!playing || !analyser) return 0;
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += data[i];
    return sum / (8 * 255);
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useSoundPlaying() {
  return useSyncExternalStore(sound.subscribe, sound.isPlaying, () => false);
}
