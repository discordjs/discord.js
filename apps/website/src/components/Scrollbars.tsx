'use client';

import type { ScrollbarProps } from 'react-custom-scrollbars-2';
import { Scrollbars as ReactScrollbars2 } from 'react-custom-scrollbars-2';

export function Scrollbars(props: ScrollbarProps) {
	return <ReactScrollbars2 {...props} />;
}
