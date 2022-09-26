module.exports = {
    content: ['./index.html', './popup.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false, // Default button style will conflict with element-plus, see also https://juejin.cn/post/7084614555598323719
    },
    plugins: [require('@tailwindcss/line-clamp')],
};
