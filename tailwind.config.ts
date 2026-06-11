import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#006782",
          deep: "#004E63",
          darkest: "#001F29",
        },
        dark: {
          bg: "#1F242E",
          card: "#111827",
        },
        border: {
          light: "#F3F4F6",
          mid: "#D1D5DB",
          dark: "#374151",
        },
        page: {
          bg: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(90deg, rgba(0,78,99,0.9) 0%, rgba(0,78,99,0.4) 50%, rgba(0,78,99,0) 100%)",
        "brand-gradient": "linear-gradient(90deg, #006782 0%, #004E63 100%)",
        "auth-gradient": "linear-gradient(0deg, #111827 0%, rgba(17,24,39,0.6) 50%, rgba(0,0,0,0.4) 100%)",
        "cta-highlight": "linear-gradient(270deg, rgba(186,234,255,0.2) 0%, rgba(186,234,255,0) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
