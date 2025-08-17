module.exports = {
  theme: {
    extend: {
      keyframes: {
        glow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(34,211,238,0.8)" },
          "50%": { boxShadow: "0 0 25px rgba(34,211,238,1)" },
        },
      },
      animation: {
        glow: "glow 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [
  require('@tailwindcss/line-clamp'),
],
};
