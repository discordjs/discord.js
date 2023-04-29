'use client';

import { Alert, Section, DiscordMessages, DiscordMessage, DiscordMessageEmbed } from '@discordjs/ui';
import { useMDXComponent } from 'next-contentlayer/hooks';
import H1 from './H1';
import { DocsLink } from '~/components/DocsLink';
import { ResultingCode } from '~/components/ResultingCode';

export function Mdx({ code }: { code: string }) {
	const Component = useMDXComponent(code);

	return (
		<Component
			components={{
				Alert,
				Section,
				DiscordMessages,
				DiscordMessage,
				DiscordMessageEmbed,
				DocsLink,
				ResultingCode,
				h1: H1,
			}}
		/>
	);
}
