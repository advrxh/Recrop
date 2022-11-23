module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: "#EAEFBD",
                primary: "#90BE6D",
                secondary: "#EA9010",
            },
        },
    },
    plugins: [require("daisyui")],
};
