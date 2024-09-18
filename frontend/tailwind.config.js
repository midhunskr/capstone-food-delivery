import daisyui from 'daisyui';
const { default: daisyui } = daisyui;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [daisyui],
  theme: {
    extend: {
      borderWidth: {
        '8': '8px',
      },
      colors: {
        "bg-white": "#f7f9f2",
        "label-tint": "#808080",
        "item-tint": "#484848",
        "selection-tint": "#cacaca",
        "disabled-tint": "#E0E0E0",
        black: "#000",
        white: "#fff",
        dark: "#2b2b2b",
        gray: {
          "100": "rgba(255, 255, 255, 0.65)",
          "200": "rgba(9, 20, 47, 0.65)",
          "300": "rgba(255, 255, 255, 0.2)",
        },
        navy: "rgba(0, 0, 124, 0.2)",
        jaffa: "#f47c57",       
        tradewind: "#68b19f",
        gainsboro: "#d9d9d9",
        goldenrod: "#F8CF7C"  
      },
      spacing: {},
      fontFamily: {
        montserrat: "Montserrat",
      },
      borderRadius: {
        "51xl": "70px",
        "17xl": "36px",
        mini: "15px",
      },
    },
    fontSize: {
      xs: "0.75rem",
      base: "1rem",
      "2xl": "1.313rem",
      mid: "1.063rem",
      "18xl": "2.313rem",
      "51xl": "4.375rem",
      "23xl": "2.625rem",
      "37xl": "3.5rem",
      "mid-5": "1.094rem",
      "base-5": "1.031rem",
      "5xs": "0.5rem",
      sm: "0.875rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "21xl": "2.5rem",
      "5xl": "1.5rem",
      "13xl": "2rem",
      "base-6": "1.038rem",
      inherit: "inherit",
    },
    screens: {
      mq1350: {
        raw: "screen and (max-width: 1350px)",
      },
      mq1125: {
        raw: "screen and (max-width: 1125px)",
      },
      mq1050: {
        raw: "screen and (max-width: 1050px)",
      },
      mq1025: {
        raw: "screen and (max-width: 1025px)",
      },
      mq800: {
        raw: "screen and (max-width: 800px)",
      },
      mq750: {
        raw: "screen and (max-width: 750px)",
      },
      mq450: {
        raw: "screen and (max-width: 450px)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};