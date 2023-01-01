'use client';

import type { ScrollbarProps } from 'react-custom-scrollbars-2';
import { Scrollbars as ReactScrollBars2 } from 'react-custom-scrollbars-2';

export function Scrollbars(props: ScrollbarProps) {
	return <ReactScrollBars2 {...props} />;
}
