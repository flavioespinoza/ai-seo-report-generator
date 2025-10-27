import fluid, { extract, fontSize, screens } from 'fluid-tailwind'
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

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
		screens, // Fluid Tailwind's default screens, in `rem`
		fontSize, // Fluid Tailwind's default font sizes, in `rem` (including line heights)
		extend: {
			fontFamily: {
				sans: ['var(--font-inter)', ...fontFamily.sans]
			},
			colors: {
				sage: {
					'50': 'hsl(120, 50.00%, 0.80%)', // #f4f5f4
					'100': 'hsl(84, 10%, 90%)', // #e6e8e3
					'200': 'hsl(82, 8%, 80%)', // #ced1c9
					'300': 'hsl(92, 8%, 67%)', // #aab1a4
					'400': 'hsl(93, 7%, 51%)', // #808a78
					'500': 'hsl(95, 9%, 39%)', // #636e5b
					'600': 'hsl(99, 11%, 30%)', // #4b5645
					'700': 'hsl(100, 10%, 24%)', // #3c4438
					'800': 'hsl(100, 9%, 20%)', // #31372e
					'900': 'hsl(97, 10%, 16%)', // #292e26
					'950': 'hsl(105, 9%, 9%)' // #161915
				},
				hotpink: {
					'50': 'hsl(351, 100%, 97%)', // #fff1f3
					'100': 'hsl(350, 100%, 94%)', // #ffe0e5
					'200': 'hsl(350, 100%, 89%)', // #ffc5cf
					'300': 'hsl(350, 100%, 81%)', // #ff9dad
					'400': 'hsl(350, 100%, 70%)', // #ff657f
					'500': 'hsl(350, 99%, 60%)', // #fe3557
					'600': 'hsl(350, 85%, 51%)', // #ec163a
					'700': 'hsl(350, 87%, 42%)', // #c70e2d
					'800': 'hsl(350, 82%, 35%)', // #a41029
					'900': 'hsl(350, 74%, 31%)', // #881427
					'950': 'hsl(350, 88%, 16%)' // #4d0511
				},
				cblue: {
					'50x': 'hsl(206, 47%, 97%)', // #f4f8fb
					'100': 'hsl(206, 44%, 94%)', // #e8f0f6
					'200': 'hsl(203, 41%, 86%)', // #cddfea
					'300': 'hsl(202, 41%, 74%)', // #a1c4d8
					'400': 'hsl(201, 41%, 60%)', // #6ea5c2
					'500': 'hsl(200, 38%, 48%)', // #4c8bab
					'600': 'hsl(203, 43%, 37%)', // #366886
					'700': 'hsl(203, 41%, 32%)', // #305a74
					'800': 'hsl(203, 39%, 27%)', // #2b4c61
					'900': 'hsl(203, 34%, 24%)', // #284252
					'950': 'hsl(207, 36%, 16%)' // #1a2a37
				},
				white: 'hsl(0, 0%, 100%)', // #ffffff
				main: '#FAFAFA',
				green: '#34da60',
				'light-gray': '#e9e8eb',
				gray: '#F2F2F2',
				slate: '#F5F5F5',
				cement: '#AEB3B7',
				charcoal: '#292D2A',
				black: '#000000',
				'light-blue': '#bfdbff',
				'light-green': '#E8F5E9',
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
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
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
				chart: {
					'1': 'var(--chart-1)',
					'2': 'var(--chart-2)',
					'3': 'var(--chart-3)',
					'4': 'var(--chart-4)',
					'5': 'var(--chart-5)'
				}
			},
			borderRadius: {
				'60': '60px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		require('tailwindcss-animate'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/container-queries'),
		fluid
	]
}

export default config
