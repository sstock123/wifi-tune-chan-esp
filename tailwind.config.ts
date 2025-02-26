
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E5E5E5",
        input: "#F1F1F1",
        ring: "#FF0000",
        background: "#FFFFFF",
        foreground: "#0F0F0F",
        primary: {
          DEFAULT: "#FF0000", // YouTube Red
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#065FD4", // YouTube Blue
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF0000",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F1F1F1",
          foreground: "#606060",
        },
        accent: {
          DEFAULT: "#F1F1F1",
          foreground: "#0F0F0F",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F0F0F",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F0F0F",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
