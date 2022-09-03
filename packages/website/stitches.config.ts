import { red, blue, green, gray, redDark, blueDark, greenDark, grayDark } from '@radix-ui/colors';
import { createStitches } from '@stitches/react';

export const { styled, globalCss, createTheme, getCssText, reset } = createStitches({
	theme: {
		colors: {
			...red,
			...blue,
			...green,
			...gray,
		},
	},
	media: {
		xs: '(min-width: 576px)',
		sm: '(min-width: 768px)',
		md: '(min-width: 992px)',
		lg: '(min-width: 1200px)',
		xl: '(min-width: 1400px)',
	},
});

export const darkTheme = createTheme('dark', {
	colors: {
		...redDark,
		...blueDark,
		...greenDark,
		...grayDark,
	},
});

export const globalStyles = globalCss({ html: { backgroundColor: '$gray1' } });
