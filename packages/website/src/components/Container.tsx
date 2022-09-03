import { styled } from '../../stitches.config';

export const Container = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	placeContent: 'center',
	placeItems: 'center',
	padding: '0 32px',
	maxWidth: 1_200,
	margin: 'auto',
	gap: 50,

	variants: {
		xs: {
			true: {
				maxWidth: 540,
			},
		},
	},
});
