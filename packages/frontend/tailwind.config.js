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
		screens: {
			mobile: {
				max: '639px'
			},
			desktop: {
				min: '640px'
			}
		},
		colors: {
			transparent: 'transparent',
			white: '#ffffff',
			black: '#000000',
			blue: {
				400: '#60a5fa',
				500: '#3b82f6'
			},
			green: {
				400: '#4ade80',
				600: '#16a34a',
				700: '#15803d',
				800: '#106a3d'
			},
			yellow: {
				400: '#facc15',
				900: '#8d730c'
			},
			red: {
				400: '#f87171',
				600: '#dc2626',
				900: '#832c2c'
			},
			indigo: {
				600: '#4f46e5',
				700: '#4338ca'
			},
			gray: {
				100: '#f3f4f6',
				200: '#e5e7eb',
				300: '#d1d5db',
				400: '#9ca3af',
				500: '#6b7280',
				600: '#4b5563',
				700: '#374151',
				800: '#1f2937',
				900: '#111827'
			},
			light: {
				100: '#e8e6e3'
			},
			dark: {
				80: '#2d333b',
				85: '#272a2b',
				90: '#23282a',
				100: '#1e2122',
				110: '#181a1b'
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};
