import { cva } from 'cva';

export const focusRing = cva({
	base: 'outline-base-blurple-400 dark:outline-base-blurple-400 outline-offset-2 forced-colors:outline-[Highlight]',
	variants: {
		isFocusVisible: {
			true: 'outline-2',
			false: 'outline-0',
		},
	},
});
