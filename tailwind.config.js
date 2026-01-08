/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                zenith: {
                    blue: "#4A90E2",
                    orange: "#F97316",
                    dark: "#1C1C1E",
                    bg: "#F5F5F7",
                },
            },
        },
    },
    plugins: [],
};
