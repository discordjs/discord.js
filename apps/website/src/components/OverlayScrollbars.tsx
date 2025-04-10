'use client';

import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { cx } from '@/styles/cva';

OverlayScrollbars.plugin(ClickScrollPlugin);

export function Scrollbars(props: OverlayScrollbarsComponentProps) {
	const { className, children, ...additionalProps } = props;

	return (
		<OverlayScrollbarsComponent {...additionalProps} className={cx('', className)} defer>
			{children}
		</OverlayScrollbarsComponent>
	);
}
