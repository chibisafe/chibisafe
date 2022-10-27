/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	corePlugins: {
		colors: false
	},
	theme: {
		extend: {
			fontFamily: {
				sans: ['Nunito', ...defaultTheme.fontFamily.sans]
			}
		},
		colors: {
			white: '#ffffff',
			black: '#000000',
			blue: {
				400: '#60a5fa',
				500: '#3b82f6'
			},
			green: {
				400: '#4ade80'
			},
			yellow: {
				400: '#facc15'
			},
			red: {
				400: '#f87171'
			},
			indigo: {
				600: '#4f46e5',
				700: '#4338ca'
			},
			gray: {
				100: '#f3f4f6',
				300: '#d1d5db',
				400: '#9ca3af',
				500: '#6b7280',
				700: '#374151',
				900: '#111827'
			},
			light: {
				100: '#e8e6e3'
			},
			dark: {
				90: '#23282a',
				100: '#1e2122',
				110: '#181a1b'
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};
