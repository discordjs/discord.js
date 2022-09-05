import type { TokenDocumentation, ApiItemJSON, AnyDocNodeJSON, InheritanceData } from '@discordjs/api-extractor-utils';
import { ActionIcon, Badge, MediaQuery, Title } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { FiLink } from 'react-icons/fi';
import { HyperlinkedText } from './HyperlinkedText';
import { InheritanceText } from './InheritanceText';
import { TSDoc } from './tsdoc/TSDoc';

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
	return (
		<div id={name} className="scroll-mt-30 flex flex-col gap-2">
			<div className={`md:-ml-8.5 flex flex-col gap-0.5 md:flex-row md:place-items-center md:gap-2`}>
				<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
					<ActionIcon component="a" href={`#${name}`} variant="transparent">
						<FiLink size={20} />
					</ActionIcon>
				</MediaQuery>
				{deprecation || readonly || optional ? (
					<div className="flex flex-row flex-wrap gap-1">
						{deprecation ? (
							<Badge variant="filled" color="red">
								Deprecated
							</Badge>
						) : null}
						{readonly ? <Badge variant="filled">Readonly</Badge> : null}
						{optional ? <Badge variant="filled">Optional</Badge> : null}
					</div>
				) : null}
				<div className="flex flex-row flex-wrap gap-1">
					<Title order={4} className="font-mono">
						{name}
						{optional ? '?' : ''}
					</Title>
					<Title order={4}>{separator}</Title>
					<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">
						<HyperlinkedText tokens={typeTokens} />
					</Title>
				</div>
			</div>
			{summary || inheritanceData ? (
				<div className="flex flex-col gap-4">
					{deprecation ? <TSDoc node={deprecation} /> : null}
					{summary ? <TSDoc node={summary} /> : null}
					{comment ? <TSDoc node={comment} /> : null}
					{inheritanceData ? <InheritanceText data={inheritanceData} /> : null}
					{children}
				</div>
			) : null}
		</div>
	);
}
