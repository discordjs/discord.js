import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				blurple: {
					50: '#e0e3ff',
					100: '#cdd2ff',
					200: '#9ea7ff',
					300: '#7782fa',
					DEFAULT: '#5865F2',
					500: '#3d48c3',
					600: '#293294',
					700: '#1a2165',
					800: '#0e1137',
					900: '#020208',
				},
			},
			fontFamily: {
				sans: 'var(--font-geist-sans)',
				mono: 'var(--font-geist-mono)',
			},
			typography: {
				DEFAULT: {
					css: {
						pre: {
							padding: '12px 0px',
							'line-height': '1.5',
							'border-radius': '6px',
							'border-width': '1px',
							'border-color': 'rgb(212, 212, 212)',
						},
						'.dark pre': {
							'border-color': 'rgb(64, 64, 64)',
						},
						code: {
							'font-size': '1em',
							'font-weight': 'unset',
						},
						'code span:last-of-type:empty': {
							display: 'none',
						},
						a: {
							color: '#5865F2',
							'text-decoration': 'none',
						},
						'a:hover': {
							color: '#3d48c3',
						},
						'.dark a:hover': {
							color: '#7782fa',
						},
						'a > img': {
							display: 'inline-block',
							margin: '0',
						},
						'a > img[height="44"]': {
							height: '44px',
						},
						'div[align="center"] > p > a + a': {
							'margin-left': '0.5em',
						},
						h1: {
							display: 'flex',
							'place-items': 'center',
							'scroll-margin-top': '6.5rem',
						},
						h2: {
							display: 'flex',
							'place-items': 'center',
							'margin-top': '1.25em',
							'scroll-margin-top': '6.5rem',
						},
						h3: {
							display: 'flex',
							'place-items': 'center',
							'margin-top': '1.25em',
							'scroll-margin-top': '6.5rem',
						},
						h4: {
							display: 'flex',
							'place-items': 'center',
							'margin-top': '1.25em',
							'scroll-margin-top': '6.5rem',
						},
						// eslint-disable-next-line id-length
						p: {
							margin: '.5em 0',
						},
					},
				},
			},
		},
	},
	plugins: [typographyPlugin],
};
