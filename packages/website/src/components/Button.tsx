import { darkTheme, styled } from '../../stitches.config';

export const Button = styled('button', {
	display: 'flex',
	placeItems: 'center',
	background: '$blue9',
	appearance: 'none',
	textDecoration: 'none',
	userSelect: 'none',
	cursor: 'pointer',
	height: 42,
	padding: '0 22px',
	borderRadius: 4,
	color: 'white',
	lineHeight: 1,
	fontSize: 16,
	fontWeight: 600,
	border: 0,

	'&:hover': {
		background: '$blue10',
	},

	'&:active': {
		transform: 'translate3d(0, 1px, 0)',
	},

	'& svg': {
		marginLeft: 10,
	},

	variants: {
		color: {
			secondary: {
				color: 'black',
				background: '$gray4',

				'&:hover': {
					background: '$gray5',
				},

				'&:active': {
					background: '$gray6',
				},

				[`.${darkTheme} &`]: {
					color: 'white',
				},
			},
		},

		dense: {
			true: {
				height: 24,
				padding: '0 8px',
				fontSize: 12,
			},
		},

		icon: {
			xs: {
				padding: 0,
				fontSize: 12,
				height: 16,
				width: 16,
			},

			sm: {
				padding: 0,
				fontSize: 14,
				height: 24,
				width: 24,
			},
		},

		transparent: {
			true: {
				color: '$gray12',
				background: 'transparent',

				'&:hover': {
					background: 'transparent',
				},

				'& svg': {
					margin: 0,
				},
			},
		},
	},
});
