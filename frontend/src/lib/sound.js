// Site-wide ambient music: one looping track, faded in/out, plus a beat pulse the
// hero city flashes to. Audio only ever starts from a user gesture.
import { useSyncExternalStore } from "react";

const SRC = "/audio/loop.mp3";
const VOLUME = 0.35;
const KEY = "gotham-sound";

let audio = null;
let hits = null; // times (s) of the bass hits in the track, found once after it first plays
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
  return audio;
}

/**
 * Finds the bass hits in the track: low-pass it, take the loudness envelope, and keep the
 * strong, sudden rises (about two a second). Runs once, offline, on the cached file, so the
 * visuals land exactly on the music instead of guessing from a live signal.
 */
async function findHits() {
  if (hits) return;
  hits = [];
  try {
    const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const buf = await (await fetch(SRC)).arrayBuffer();
    const track = await new Offline(1, 44100, 44100).decodeAudioData(buf);
    const ctx = new Offline(1, track.length, track.sampleRate);
    const src = ctx.createBufferSource();
    const lowpass = ctx.createBiquadFilter();
    src.buffer = track;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 150;
    src.connect(lowpass).connect(ctx.destination);
    src.start();
    const wave = (await ctx.startRendering()).getChannelData(0);

    const fps = 200;
    const hop = Math.round(track.sampleRate / fps);
    const env = [];
    for (let i = 0; i + hop <= wave.length; i += hop) {
      let sum = 0;
      for (let j = 0; j < hop; j++) sum += wave[i + j] ** 2;
      env.push(Math.sqrt(sum / hop));
    }
    const rise = env.map((v, i) => Math.max(0, v - (env[i - 2] ?? v)));
    const mean = rise.reduce((a, b) => a + b, 0) / rise.length;
    const sd = Math.sqrt(rise.reduce((a, b) => a + (b - mean) ** 2, 0) / rise.length);
    let last = -1;
    for (let i = 1; i < rise.length; i++) {
      const t = i / fps;
      const isPeak = rise[i] === Math.max(...rise.slice(Math.max(0, i - 16), i + 17)); // ±80 ms
      if (rise[i] > mean + 2.5 * sd && isPeak && t - last >= 0.2) {
        hits.push(t);
        last = t;
      }
    }
  } catch {
    hits = []; // can't analyse: the music still plays, the city just doesn't pulse
  }
}

function fadeTo(target, ms, done) {
  cancelAnimationFrame(fadeRaf);
  const from = audio.volume;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    audio.volume = Math.min(1, Math.max(0, from + (target - from) * k));
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
        findHits();
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
        findHits();
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
  /** 1 at the moment of a bass hit, decaying to 0 over ~0.3 s; 0 while muted. */
  pulse() {
    if (!playing || !hits?.length) return 0;
    const t = audio.currentTime;
    let lo = 0;
    let hi = hits.length - 1;
    if (t < hits[0]) return 0;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (hits[mid] <= t) lo = mid;
      else hi = mid - 1;
    }
    return Math.exp(-(t - hits[lo]) * 9) * Math.min(1, audio.volume / VOLUME);
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useSoundPlaying() {
  return useSyncExternalStore(sound.subscribe, sound.isPlaying, () => false);
}
