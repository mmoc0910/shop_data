/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Epilogue", "sans-serif;"],
      },
      colors: {
        primary: "#4d79d8",
        primary20: "#4ACD8D",
        primary40: "#77D9AA",
        primary60: "#A5E6C6",
        primary80: "#D2F2E3",
        "primary-extra": "#F1FBF7",
        secondary: "#6F49FD",
        secondary20: "#8C6DFD",
        secondary40: "#A992FE",
        secondary60: "#C5B6FE",
        secondary80: "#E2DBFF",
        text1: "#171725",
        text2: "#4B5264",
        text3: "#808191",
        text4: "#B2B3BD",
        "icon-color": "#A2A2A8",
        white: "#FFFFFF",
        "white-soft": "#FCFBFF",
        "gray-soft": "#FCFCFC",
        strock: "#F1F1F3",
        lite: "#FCFCFD",
        error: "#EB5757",
        darkbg: "#13131A",
        "dark-secondary": "#1C1C24",
        "soft-dark": "#22222C",
        "dark-soft": "#24242C",
        "dark-strock": "#3A3A43",
        red2: "#422C32",
      },
      keyframes: {
        lineloading: {
          "0%": {
            right: "100%",
          },
          "50%": {
            right: 0,
            left: 0,
          },
          "100%": {
            right: 0,
            left: "100%",
          },
        },
      },
      animation: {
        lineloading: "lineloading 2s forwards infinite",
      },
    },
  },
  plugins: [],
};
