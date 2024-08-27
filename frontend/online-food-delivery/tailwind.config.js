/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        gray: {
          "100": "rgba(255, 255, 255, 0.65)",
          "200": "rgba(9, 20, 47, 0.65)",
          "300": "rgba(255, 255, 255, 0.2)",
        },
        navy: "rgba(0, 0, 124, 0.2)",
        jaffa: "#f47c57",
        tradewind: "#68b19f",
        goldenrod: "#f8cf7c",
        darkkhaki: "#deb563",
        dark: "#2b2b2b",
        "bg-white": "#f7f9f3",
        black: "#000",
        teal: "#367d6b",
      },
      spacing: {},
      fontFamily: {
        quicksand: "Quicksand",
        "arial-rounded-mt-bold": "'Arial Rounded MT Bold'",
        montserrat: "Montserrat",
      },
      borderRadius: {
        "51xl": "70px",
        mini: "15px",
        "17xl": "36px",
      },
    },
    fontSize: {
      base: "1rem",
      sm: "0.875rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "18xl": "2.313rem",
      "21xl": "2.5rem",
      "5xl": "1.5rem",
      "13xl": "2rem",
      "2xl": "1.313rem",
      mid: "1.063rem",
      xs: "0.75rem",
      "base-6": "1.038rem",
      "51xl": "4.375rem",
      "23xl": "2.625rem",
      "37xl": "3.5rem",
      "mid-5": "1.094rem",
      "base-5": "1.031rem",
      "5xs": "0.5rem",
      inherit: "inherit",
    },
    screens: {
      mq1350: {
        raw: "screen and (max-width: 1350px)",
      },
      mq1125: {
        raw: "screen and (max-width: 1125px)",
      },
      mq800: {
        raw: "screen and (max-width: 800px)",
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