import { Group, Stack, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { HyperlinkedText } from './HyperlinkedText';
import { CommentSection } from './tsdoc/Comment';
import type { DocItem } from '~/DocModel/DocItem';
import type { AnyDocNodeJSON } from '~/DocModel/comment/CommentNode';
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
	comment,
}: {
	name: string;
	summary?: ReturnType<DocItem['toJSON']>['summary'];
	typeTokens: TokenDocumentation[];
	separator?: CodeListingSeparatorType;
	children?: ReactNode;
	className?: string | undefined;
	comment?: AnyDocNodeJSON | null;
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
			{comment && <CommentSection node={comment} />}
			{children}
		</Stack>
	);
}
