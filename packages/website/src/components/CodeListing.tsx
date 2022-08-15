import { Group, Stack, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { CommentSection } from './Comment';
import { HyperlinkedText } from './HyperlinkedText';
import type { DocItem } from '~/DocModel/DocItem';
import type { TokenDocumentation } from '~/util/parse.server';

export enum CodeListingSeparatorType {
	Type = ':',
	Value = '=',
}

export function CodeListing({
	name,
	separator = CodeListingSeparatorType.Type,
	summary,
	typeTokens,
	children,
}: {
	name: string;
	summary?: ReturnType<DocItem['toJSON']>['summary'];
	typeTokens: TokenDocumentation[];
	separator?: CodeListingSeparatorType;
	children?: ReactNode;
	className?: string | undefined;
}) {
	return (
		<Stack key={name}>
			<Group>
				<Title order={4} className="font-mono">
					{name}
				</Title>
				<Title order={4}>{separator}</Title>
				<Title order={4} className="font-mono break-all">
					<HyperlinkedText tokens={typeTokens} />
				</Title>
			</Group>
			{summary && <CommentSection node={summary} />}
			{children}
		</Stack>
	);
}
