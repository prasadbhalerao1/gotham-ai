import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: { xs: "420px" },
      fontFamily: {
        display: ['"Instrument Sans Variable"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        sans: ['"Instrument Sans Variable"', "system-ui", "sans-serif"],
        body: ['"Instrument Sans Variable"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: { DEFAULT: "#09090b", 900: "#09090b", 800: "#111113", 700: "#19191c", 600: "#232327" },
        bone: { DEFAULT: "#f2f2ee", dim: "#a8a8a3", mute: "#6c6c68" },
        // brand accent from the original Gotham AI palette — use sparingly
        signal: { DEFAULT: "#edff66", hot: "#dcf53a", deep: "#55610a" },
        steel: { DEFAULT: "#8a93a6", dark: "#3a404c" },
        alert: "#ff4d2e",
      },
      letterSpacing: { tightest: "-0.04em" },
      transitionTimingFunction: { expo: "cubic-bezier(0.16, 1, 0.3, 1)" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        spinslow: { to: { transform: "rotate(360deg)" } },
        blink: { "50%": { opacity: 0 } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        spinslow: "spinslow 18s linear infinite",
        blink: "blink 1.1s steps(1) infinite",
      },
    },
  },
  plugins: [typography],
};
