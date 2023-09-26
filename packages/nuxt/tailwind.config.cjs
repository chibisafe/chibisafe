module.exports = {
	content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
	corePlugins: {
		colors: true
	},
	darkMode: 'class',
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('tailwindcss-animate')],
	theme: {
		extend: {
			colors: {
				dark: {
					DEFAULT: 'hsl(224, 21%, 14%)'
				},
				theme: {
					100: 'hsl(45, 40%, 98%)',
					200: 'hsl(210, 2%, 53%)',
					300: 'hsl(218, 6%, 26%)',
					400: 'hsl(216, 5%, 19%)',
					500: 'hsl(223, 9%, 15%)',
					600: 'hsl(214, 10%, 14%)',
					700: 'hsl(216, 9%, 11%)',
					800: 'hsl(210, 14%, 11%)',
					900: 'hsl(240, 6%, 10%)',
					1000: 'hsl(210, 10%, 8%)'
				}
			},
			fontFamily: {
				sans: ['Nunito']
			}
		}
	}
};
