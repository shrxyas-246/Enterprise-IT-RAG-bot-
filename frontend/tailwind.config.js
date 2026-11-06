/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0D0D12",
        surface: "#16161D",
        panel: "#1A1A22",
        elevated: "#1F1F29",
        line: "#2A2A36",
        brand: {
          DEFAULT: "#7C5CFF",
          soft: "#8F72FF",
          dim: "#5B41C7",
        },
        ink: "#E9E8F0",
        muted: "#8E8CA3",
      },
      borderRadius: {
        xl2: "14px",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 80%, 100%": { opacity: "0.25" },
          "40%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 180ms ease-out",
        blink: "blink 1.2s infinite",
      },
    },
  },
  plugins: [],
};
