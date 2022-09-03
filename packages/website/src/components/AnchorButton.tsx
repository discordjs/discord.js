import { darkTheme, styled } from '../../stitches.config';

export const AnchorButton = styled('a', {
	display: 'flex',
	placeItems: 'center',
	backgroundColor: '$blue9',
	appearance: 'none',
	textDecoration: 'none',
	userSelect: 'none',
	height: 42,
	padding: '0 22px',
	borderRadius: 4,
	color: 'white',
	lineHeight: 1,
	fontWeight: 600,

	'&:hover': {
		backgroundColor: '$blue10',
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
				backgroundColor: '$gray4',

				'&:hover': {
					backgroundColor: '$gray5',
				},

				'&:active': {
					backgroundColor: '$gray6',
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
	},
});
