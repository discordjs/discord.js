import { styled } from '../../stitches.config';

export const SelectionButton = styled('div', {
	color: '$gray12',
	backgroundColor: '$gray3',
	padding: 10,
	borderRadius: 4,
	userSelect: 'none',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: '$gray4',
	},

	'&:active': {
		backgroundColor: '$gray5',
		transform: 'translate3d(0, 1px, 0)',
	},
});
