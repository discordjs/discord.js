import { styled } from '../../stitches.config';

export const Container = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	placeItems: 'center',
	padding: '64px 32px',
	maxWidth: 1_200,
	margin: 'auto',
	gap: 50,

	'@md': {
		height: '100%',
		placeContent: 'center',
		padding: '0 64px',
	},

	variants: {
		xs: {
			true: {
				maxWidth: 540,
			},
		},
	},
});
