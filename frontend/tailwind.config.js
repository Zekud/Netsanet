/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#e91e63',
                    600: '#c2185b',
                    700: '#a0174a',
                    800: '#7c1238',
                    900: '#5a0e28',
                },
                secondary: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#9c27b0',
                    600: '#8b5cf6',
                    700: '#7c3aed',
                    800: '#6d28d9',
                    900: '#5b21b6',
                },
            },
            fontFamily: {
                sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 1s linear infinite',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
} 