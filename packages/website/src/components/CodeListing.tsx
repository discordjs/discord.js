import { Badge, Group, Stack, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { HyperlinkedText } from './HyperlinkedText';
import { TSDoc } from './tsdoc/TSDoc';
import type { DocProperty } from '~/DocModel/DocProperty';

export enum CodeListingSeparatorType {
	Type = ':',
	Value = '=',
}

export function CodeListing({
	prop,
	separator = CodeListingSeparatorType.Type,
	children,
}: {
	prop: ReturnType<DocProperty['toJSON']>;
	separator?: CodeListingSeparatorType;
	children?: ReactNode;
}) {
	return (
		<Stack spacing="xs" key={prop.name}>
			<Group>
				{prop.readonly ? <Badge variant="filled">Readonly</Badge> : null}
				{prop.optional ? <Badge variant="filled">Optional</Badge> : null}
				<Title order={4} className="font-mono">
					{prop.name}
				</Title>
				<Title order={4}>{separator}</Title>
				<Title order={4} className="font-mono break-all">
					<HyperlinkedText tokens={prop.propertyTypeTokens} />
				</Title>
			</Group>
			<Group>
				{prop.summary && <TSDoc node={prop.summary} />}
				{prop.comment && <TSDoc node={prop.comment} />}
				{children}
			</Group>
		</Stack>
	);
}
