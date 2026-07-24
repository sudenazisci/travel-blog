/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2a2a2a',
                accent: '#d4a373',
                'bg-light': '#fdfdfd',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
        },
        animation: {
            marquee: 'marquee 25s linear infinite',
            fadeIn: 'fadeIn 1s ease-in-out',
        },
        keyframes: {
            marquee: {
                '0%': { transform: 'translateX(100%)' },
                '100%': { transform: 'translateX(-100%)' },
            },
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
            }
        }
    },
    plugins: [],
}
