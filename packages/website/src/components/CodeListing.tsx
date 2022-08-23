import { ActionIcon, Badge, Box, Group, MediaQuery, Stack, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { FiLink } from 'react-icons/fi';
import { HyperlinkedText } from './HyperlinkedText';
import { InheritanceText } from './InheritanceText';
import { TSDoc } from './tsdoc/TSDoc';
import type { ApiItemJSON, InheritanceData } from '~/DocModel/ApiNodeJSONEncoder';
import type { AnyDocNodeJSON } from '~/DocModel/comment/CommentNode';
import type { TokenDocumentation } from '~/util/parse.server';

export enum CodeListingSeparatorType {
	Type = ':',
	Value = '=',
}

export function CodeListing({
	name,
	separator = CodeListingSeparatorType.Type,
	typeTokens,
	readonly = false,
	optional = false,
	summary,
	children,
	comment,
	deprecation,
	inheritanceData,
}: {
	name: string;
	separator?: CodeListingSeparatorType;
	typeTokens: TokenDocumentation[];
	readonly?: boolean;
	optional?: boolean;
	summary?: ApiItemJSON['summary'];
	comment?: AnyDocNodeJSON | null;
	children?: ReactNode;
	deprecation?: AnyDocNodeJSON | null;
	inheritanceData?: InheritanceData | null;
}) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return (
		<Stack id={name} className="scroll-mt-30" spacing="xs">
			<Box
				sx={(theme) => ({
					display: 'flex',
					gap: 16,

					[theme.fn.smallerThan('sm')]: {
						flexDirection: 'column',
					},
				})}
				ml={matches ? 0 : -45}
			>
				<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
					<ActionIcon component="a" href={`#${name}`} variant="transparent">
						<FiLink size={20} />
					</ActionIcon>
				</MediaQuery>
				{deprecation || readonly || optional ? (
					<Group spacing={10} noWrap>
						{deprecation ? (
							<Badge variant="filled" color="red">
								Deprecated
							</Badge>
						) : null}
						{readonly ? <Badge variant="filled">Readonly</Badge> : null}
						{optional ? <Badge variant="filled">Optional</Badge> : null}
					</Group>
				) : null}
				<Group spacing={10}>
					<Title order={4} className="font-mono">
						{name}
						{optional ? '?' : ''}
					</Title>
					<Title order={4}>{separator}</Title>
					<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">
						<HyperlinkedText tokens={typeTokens} />
					</Title>
				</Group>
			</Box>
			<Group>
				<Stack>
					{deprecation ? <TSDoc node={deprecation} /> : null}
					{summary && <TSDoc node={summary} />}
					{comment && <TSDoc node={comment} />}
					{inheritanceData ? <InheritanceText data={inheritanceData} /> : null}
					{children}
				</Stack>
			</Group>
		</Stack>
	);
}
