'use client';

import { Section } from '@discordjs/ui';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import type { PropsWithChildren } from 'react';
import { useMedia } from 'react-use';

export function SectionShell({ title, children }: PropsWithChildren<{ title: string }>) {
	const matches = useMedia('(max-width: 768px)', true);
	return (
		<Section dense={matches} icon={<VscSymbolProperty size={20} />} padded title={title}>
			{children}
		</Section>
	);
}
