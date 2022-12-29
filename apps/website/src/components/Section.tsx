'use client';

import { Section as DJSSection, type SectionOptions } from '@discordjs/ui';
import type { PropsWithChildren } from 'react';
import { useMedia } from 'react-use';

// This is wrapper around the Section component from @discordjs/ui,
// it simply automatically sets the dense prop to true if the screen
// width is less than 768px. This is done to separate client-side logic
// from server-side rendering.
export function Section(options: PropsWithChildren<SectionOptions>) {
	const matches = useMedia('(max-width: 768px)', true);
	options.dense ??= matches;

	return <DJSSection {...options} />;
}
