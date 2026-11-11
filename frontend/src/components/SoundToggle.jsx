import { sound, useSoundPlaying } from "../lib/sound.js";

/** Speaker icon that mutes / unmutes the music: waves pulse while it plays,
 *  a cross shows when muted. */
const SoundToggle = ({ className = "" }) => {
  const playing = useSoundPlaying();
  return (
    <button
      type="button"
      data-sound-toggle
      onClick={sound.toggle}
      aria-pressed={playing}
      aria-label={playing ? "Mute music" : "Play music"}
      title={playing ? "Mute music" : "Play music"}
      className={`group flex size-10 items-center justify-center rounded-full text-bone transition-colors hover:bg-bone/10 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[1.35rem]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" stroke="none" />
        {playing ? (
          <>
            <path d="M15.5 9.2a4 4 0 0 1 0 5.6" className="origin-[12px_12px] animate-[wave_1.6s_ease-in-out_infinite]" />
            <path d="M18.2 6.6a7.6 7.6 0 0 1 0 10.8" className="origin-[12px_12px] animate-[wave_1.6s_ease-in-out_0.25s_infinite]" />
          </>
        ) : (
          <>
            <path d="M16 9.5l5 5" />
            <path d="M21 9.5l-5 5" />
          </>
        )}
      </svg>
    </button>
  );
};

export default SoundToggle;
