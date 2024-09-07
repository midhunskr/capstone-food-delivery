/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        gray: {
          "100": "rgba(128, 128, 128, 0.29)",
          "200": "rgba(255, 255, 255, 0.65)",
          "300": "rgba(9, 20, 47, 0.65)",
          "400": "rgba(255, 255, 255, 0.2)",
        },
        navy: "rgba(0, 0, 124, 0.2)",
        jaffa: "#f47c57",
        "bg-white": "#f7f9f3",
        tradewind: "#68b19f",
        "label-tint": "#808080",
        dark: "#2b2b2b",
        "disabled-grey": "#e0e0e0",
        gainsboro: "#d9d9d9",
      },
      spacing: {},
      fontFamily: {
        montserrat: "Montserrat",
      },
      borderRadius: {
        "7xl-3": "26.3px",
        "12xs": "1px",
        "7xl": "26px",
        "38xl": "57px",
        "8xs": "5px",
        "3xs": "10px",
        lg: "18px",
        "14xl": "33px",
        "25xl": "44px",
      },
    },
    fontSize: {
      base: "16px",
      sm: "14px",
      lg: "18px",
      xl: "20px",
      "5xl": "24px",
      lgi: "19px",
      "mid-5": "17.5px",
      "lgi-4": "19.4px",
      mid: "17px",
      "3xs": "10px",
      inherit: "inherit",
    },
    screens: {
      mq1125: {
        raw: "screen and (max-width: 1125px)",
      },
      mq1025: {
        raw: "screen and (max-width: 1025px)",
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