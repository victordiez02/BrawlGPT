import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "brawl-blue": "hsl(var(--brawl-blue))",
        "brawl-red": "hsl(var(--brawl-red))",
        "brawl-gold": "hsl(var(--brawl-gold))",
        "brawl-purple": "hsl(var(--brawl-purple))",
        ink: "hsl(var(--ink))",
        paper: "hsl(var(--paper))",
      },
      fontFamily: {
        sans: ['"Nunito"', "system-ui", "sans-serif"],
        display: ['"Lilita One"', '"Nunito"', "system-ui", "sans-serif"],
        brawl: ['"Lilita One"', '"Nunito"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        "sticker-sm": "0 2px 0 0 hsl(var(--ink))",
        sticker: "0 4px 0 0 hsl(var(--ink))",
        "sticker-lg": "0 6px 0 0 hsl(var(--ink))",
        panel:
          "0 6px 0 0 hsl(var(--ink)), 0 0 0 2px hsl(var(--primary) / 0.2) inset",
        pop: "0 4px 0 0 hsl(var(--ink)), 0 10px 24px -6px hsl(var(--ink) / 0.6)",
      },
      scale: {
        "70": "0.70",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "comic-pop": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "speech-bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "bs-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0)" },
          "50%": { transform: "translateY(-8px) rotate(-1deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.45s ease-out both",
        "slide-in": "slide-in 0.4s ease-out both",
        "scale-in": "scale-in 0.35s ease-out both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        sway: "sway 1.6s ease-in-out infinite",
        "comic-pop": "comic-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "speech-bob": "speech-bob 3s ease-in-out infinite",
        "bs-float": "bs-float 4.5s ease-in-out infinite",
      },
      backgroundImage: {
        "brawl-grid":
          "linear-gradient(hsl(var(--ink) / 0.10) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink) / 0.10) 1px, transparent 1px)",
      },
      backgroundSize: {
        "brawl-grid": "32px 32px",
      },
    },
  },
  plugins: [animate],
};

export default config;
