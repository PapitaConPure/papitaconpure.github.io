import type { Config } from 'tailwindcss';
import TailwindCSSAnimatePlugin from 'tailwindcss-animate';

const colors = {
	foreground: '#efebec',
	background: '#0c0909',
	primary: {
		main: '#9c162d',
		50: '#fce9ec',
		100: '#f6bcc6',
		200: '#ef8fa0',
		300: '#e9637a',
		400: '#e33654',
		500: '#c91c3a',
		600: '#9c162d',
		700: '#701020',
		800: '#430913',
		900: '#160306',
	},
	secondary: {
		main: '#3a2c2d',
		50: '#f4f1f1',
		100: '#ded4d4',
		200: '#c8b7b8',
		300: '#b29a9b',
		400: '#9c7d7f',
		500: '#826365',
		600: '#654d4f',
		700: '#483738',
		800: '#2b2122',
		900: '#1b1616',
	},
	accent: {
		main: '#922050',
		50: '#faeaf1',
		100: '#f1c0d5',
		200: '#e896b9',
		300: '#df6d9d',
		400: '#d64381',
		500: '#bc2967',
		600: '#922050',
		700: '#691739',
		800: '#3f0e22',
		900: '#15050b',
	},
	card: {
		DEFAULT: 'hsl(var(--card))',
		foreground: 'hsl(var(--card-foreground))',
	},
	popover: {
		DEFAULT: 'hsl(var(--popover))',
		foreground: 'hsl(var(--popover-foreground))',
	},
	muted: {
		DEFAULT: 'hsl(var(--muted))',
		foreground: 'hsl(var(--muted-foreground))',
	},
	destructive: {
		DEFAULT: 'hsl(var(--destructive))',
		foreground: 'hsl(var(--destructive-foreground))',
	},
	border: 'hsl(var(--border))',
	input: 'hsl(var(--input))',
	ring: 'hsl(var(--ring))',
	chart: {
		'1': 'hsl(var(--chart-1))',
		'2': 'hsl(var(--chart-2))',
		'3': 'hsl(var(--chart-3))',
		'4': 'hsl(var(--chart-4))',
		'5': 'hsl(var(--chart-5))',
	},
};

const inbetweenHoverKeyframes = {
	'glow-nav-desktop-hover': {
		color: colors.secondary[300],
		'text-shadow': `0 0 4pt ${colors.secondary[700]}`,
	},
	'glow-primary-hover': {
		'background-color': colors.primary[500],
		'box-shadow': minimize(`
			0 0pt 7pt ${colors.primary[500]},
			0 0.5pt 16pt ${colors.primary[600]},
			0 1pt 40pt ${colors.primary[700]},
			0 1.5pt 65pt ${colors.primary[800]}
		`),
	},
};

const keyframes = {
	'glow-nav-desktop-hover': {
		from: {
			color: colors.secondary[400],
			'text-shadow': `0 0 0 ${colors.secondary.main}`,
		},
		to: inbetweenHoverKeyframes['glow-nav-desktop-hover'],
	},
	'glow-nav-desktop-active': {
		from: inbetweenHoverKeyframes['glow-nav-desktop-hover'],
		to: {
			color: colors.secondary[200],
			'text-shadow': `0 0 8pt ${colors.secondary[600]}`,
		},
	},
	'glow-primary-hover': {
		from: {
			'background-color': colors.primary[600],
			'box-shadow': `0 0 0 ${colors.primary.main}`,
		},
		to: inbetweenHoverKeyframes['glow-primary-hover'],
	},
	'glow-primary-active': {
		from: inbetweenHoverKeyframes['glow-primary-hover'],
		to: {
			'background-color': colors.primary[400],
			'box-shadow': minimize(`
				0 0pt 5pt ${colors.primary[400]},
				0 0.5pt 24pt ${colors.primary[500]},
				0 1pt 56pt ${colors.primary[600]},
				0 1.5pt 80pt ${colors.primary[700]}
			`),
		},
	},
};

const config: Config = {
	content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	safelist: [
		'text-yellow-200',
		'text-green-300',
		'text-purple-400',
		'text-orange-400',
		'text-blue-400',
	],
	theme: {
		extend: {
			colors,
			fontFamily: {
				'default-sans': '"Outfit", "M PLUS 2", ui-sans-serif system-ui sans-serif',
				'default-serif': '"Vollkorn", "Noto Serif JP", ui-serif, Georgia, serif',
				//'mono': 'ui-monospace, SFMono-Regular',
			},
			animation: {
				'glow-nav-desktop-hover': 'glow-nav-desktop-hover 0.15s ease-out forwards',
				'glow-nav-desktop-active':
					'glow-nav-desktop-active 0.4s cubic-bezier(0.23, 1, 0.320, 1) forwards',
				'glow-primary-hover': 'glow-primary-hover 0.4s ease-out forwards',
				'glow-primary-active':
					'glow-primary-active 0.6s cubic-bezier(0.23, 1, 0.320, 1) forwards',
			},
			keyframes,
		},
	},
	plugins: [TailwindCSSAnimatePlugin],
};

function minimize(css: string) {
	return css.replace(/\s+/g, ' ');
}

export default config;
