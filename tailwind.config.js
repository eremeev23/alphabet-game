module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    colors: {
      black: "var(--black)",
      blue: "var(--blue)",
      light: "var(--light)",
      white: "var(--white)",
      red: "var(--red)"
    },
    extend: {
      borderWidth: {
        3: "3px"
      }
    }
  },
  plugins: []
};
