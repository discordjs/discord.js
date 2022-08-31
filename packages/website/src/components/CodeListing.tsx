import type { TokenDocumentation, ApiItemJSON, AnyDocNodeJSON, InheritanceData } from '@discordjs/api-extractor-utils';
import { ActionIcon, Badge, Box, createStyles, Group, MediaQuery, Stack, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { PropsWithChildren } from 'react';
import { FiLink } from 'react-icons/fi';
import { HyperlinkedText } from './HyperlinkedText.jsx';
import { InheritanceText } from './InheritanceText.jsx';
import { TSDoc } from './tsdoc/TSDoc.jsx';

export enum CodeListingSeparatorType {
	Type = ':',
	Value = '=',
}

const useStyles = createStyles((theme) => ({
	outer: {
		display: 'flex',
		alignItems: 'center',
		gap: 16,

		[theme.fn.smallerThan('sm')]: {
			flexDirection: 'column',
			alignItems: 'unset',
		},
	},
}));

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
}: PropsWithChildren<{
	comment?: AnyDocNodeJSON | null;
	deprecation?: AnyDocNodeJSON | null;
	inheritanceData?: InheritanceData | null;
	name: string;
	optional?: boolean;
	readonly?: boolean;
	separator?: CodeListingSeparatorType;
	summary?: ApiItemJSON['summary'];
	typeTokens: TokenDocumentation[];
}>) {
	const { classes } = useStyles();
	const matches = useMediaQuery('(max-width: 768px)');

	return (
		<Stack id={name} className="scroll-mt-30" spacing="xs">
			<Box className={classes.outer} ml={matches ? 0 : -45}>
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
