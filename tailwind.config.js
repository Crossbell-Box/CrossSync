module.exports = {
    content: ['./index.html', './popup.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/line-clamp')],
};
