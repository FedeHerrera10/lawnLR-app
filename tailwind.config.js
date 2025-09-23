/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        Sora: ["Sora-Regular"], // usa el mismo nombre que pusiste en useFonts
        SoraBold: ["Sora-Bold"],
        SoraSemiBold: ["Sora-SemiBold"],
        SoraMedium: ["Sora-Medium"],
        SoraExtraBold: ["Sora-ExtraBold"],
      },
    },
  },
  plugins: [],
}