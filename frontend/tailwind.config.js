/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1A1918',
                accent: '#A34828',
                'accent-hover': '#8C3B1E',
                'bg-light': '#FBF9F5',
                'card-bg': '#FFFFFF',
                'blog-text': '#4A4744',
                cream: '#FBF9F5',
                paper: '#F4F0E8',
                ink: '#1A1918',
                'ink-light': '#4A4744',
                'ink-muted': '#78746D',
                terracotta: '#A34828',
                sandstone: '#8C6D53',
                pine: '#2C3E35',
            },
            fontFamily: {
                serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                mono: ['"Space Mono"', 'monospace'],
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
