import fluid, { extract, fontSize, screens } from 'fluid-tailwind'
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

// ✅ Explicit imports for Tailwind v3.4.x color sets
import {
	gray,
	zinc,
	slate,
	neutral,
	stone,
	blue,
	emerald,
	red,
	yellow,
	green,
	sky
} from 'tailwindcss/colors'

const config: Config = {
	content: {
		files: [
			'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
			'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
			'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
			'./src/**/*.{js,ts,jsx,tsx}'
		],
		extract
	},
	darkMode: ['class'],
	theme: {
		screens,
		fontSize,
		extend: {
			fontFamily: {
				sans: ['var(--font-inter)', ...fontFamily.sans],
				display: ['Inter', ...fontFamily.sans]
			},

			// ✅ Combine built-in & custom colors
			colors: {
				// Tailwind default palettes re-added explicitly
				gray,
				zinc,
				slate,
				neutral,
				stone,
				blue,
				emerald,
				red,
				yellow,
				green,
				sky,

				// ---- Custom brand palette ----
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				'background-sidenav': 'var(--background-sidenav)',

				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)'
				},
				primary: {
					DEFAULT: '#4c8bab',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#636e5b',
					foreground: '#ffffff'
				},
				critical: {
					DEFAULT: '#fe3557',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)'
				},
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',

				// ---- Extended brand hues ----
				sage: {
					50: '#f4f5f4',
					100: '#e6e8e3',
					200: '#ced1c9',
					300: '#aab1a4',
					400: '#808a78',
					500: '#636e5b',
					600: '#4b5645',
					700: '#3c4438',
					800: '#31372e',
					900: '#292e26',
					950: '#161915'
				},
				hotpink: {
					50: '#fff1f3',
					100: '#ffe0e5',
					200: '#ffc5cf',
					300: '#ff9dad',
					400: '#ff657f',
					500: '#fe3557',
					600: '#ec163a',
					700: '#c70e2d',
					800: '#a41029',
					900: '#881427',
					950: '#4d0511'
				},
				cblue: {
					50: '#f4f8fb',
					100: '#e8f0f6',
					200: '#cddfea',
					300: '#a1c4d8',
					400: '#6ea5c2',
					500: '#4c8bab',
					600: '#366886',
					700: '#305a74',
					800: '#2b4c61',
					900: '#284252',
					950: '#1a2a37'
				},

				white: '#ffffff',
				main: '#FAFAFA',
				'light-gray': '#e9e8eb',
				graysoft: '#F2F2F2',
				slatesoft: '#F5F5F5',
				cement: '#AEB3B7',
				charcoal: '#292D2A',
				black: '#000000',
				'light-blue': '#bfdbff',
				'light-green': '#E8F5E9',
				brightgreen: '#34da60',

				'background-light': '#F8FAFC',
				'background-dark': '#18181B',

				chart: {
					1: 'var(--chart-1)',
					2: 'var(--chart-2)',
					3: 'var(--chart-3)',
					4: 'var(--chart-4)',
					5: 'var(--chart-5)'
				}
			},

			borderRadius: {
				DEFAULT: '0.5rem',
				lg: '0.75rem',
				xl: '1rem'
			}
		}
	},
	plugins: [fluid]
}

export default config
