/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	corePlugins: {
		colors: true
	},
	theme: {
		container: {
			center: true,
			padding: '2rem'
		},
		extend: {
			screens: {
				'2xl': '1400px',
				mobile: {
					max: '639px'
				},
				desktop: {
					min: '640px'
				}
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				translucent: {
					DEFAULT: 'rgba(29,29,33,0.7)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				switch: 'rgba(0, 0, 0, 0.3) 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 1px 2px'
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 }
				},
				'collapsible-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-collapsible-content-height)' }
				},
				'collapsible-up': {
					from: { height: 'var(--radix-collapsible-content-height)' },
					to: { height: 0 }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-in-out',
				'accordion-up': 'accordion-up 0.2s ease-in-out',
				'collapsible-down': 'collapsible-down 0.2s ease-in-out',
				'collapsible-up': 'collapsible-up 0.2s ease-in-out'
			},
			fontFamily: {
				sans: ['Nunito', ...defaultTheme.fontFamily.sans]
			}
		},
		// screens: {
		// 	mobile: {
		// 		max: '639px'
		// 	},
		// 	desktop: {
		// 		min: '640px'
		// 	}
		// },
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
				500: '#ef4444',
				600: '#dc2626',
				700: '#cc0033a6',
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
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('tailwindcss-animate')]
};
