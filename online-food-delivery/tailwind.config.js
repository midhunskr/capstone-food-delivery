// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-white": "#f7f9f3",
        tradewind: "#68b19f",
        dark: "#2b2b2b",
        white: "#fff",
        "bg-white1": "#f3f5eb",
        black: "#000",
        jaffa: "#f47c57",
        teal: "#367d6b",
        gainsboro: "#d9d9d9",
      },
      spacing: {},
      fontFamily: {
        "arial-rounded-mt-bold": "'Arial Rounded MT Bold'",
        montserrat: "Montserrat",
        quicksand: "Quicksand",
      },
      borderRadius: {
        "17xl": "36px",
        "51xl": "70px",
      },
    },
    fontSize: {
      "mid-5": "1.094rem",
      "base-5": "1.031rem",
      "5xs": "0.5rem",
      xs: "0.75rem",
      base: "1rem",
      "2xl": "1.313rem",
      mid: "1.063rem",
      "18xl": "2.313rem",
      "51xl": "4.375rem",
      "23xl": "2.625rem",
      inherit: "inherit",
    },
    screens: {
      mq720: {
        raw: "screen and (max-width: 720px)",
      },
      mq360: {
        raw: "screen and (max-width: 360px)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};