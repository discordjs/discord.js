import { Group, Stack, Title, Text, Box, MediaQuery, Aside, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Fragment, ReactNode } from 'react';
import {
	VscSymbolClass,
	VscSymbolMethod,
	VscSymbolEnum,
	VscSymbolInterface,
	VscSymbolVariable,
	VscListSelection,
	VscSymbolParameter,
} from 'react-icons/vsc';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { HyperlinkedText } from './HyperlinkedText';
import { Section } from './Section';
import { TableOfContentItems } from './TableOfContentItems';
import { TypeParamTable } from './TypeParamTable';
import { TSDoc } from './tsdoc/TSDoc';
import type { ApiClassJSON, ApiInterfaceJSON, ApiItemJSON } from '~/DocModel/ApiNodeJSONEncoder';
import type { TypeParameterData } from '~/DocModel/TypeParameterMixin';
import type { AnyDocNodeJSON } from '~/DocModel/comment/CommentNode';
import type { TokenDocumentation } from '~/util/parse.server';

export interface DocContainerProps {
	name: string;
	kind: string;
	excerpt: string;
	summary?: ApiItemJSON['summary'];
	children?: ReactNode;
	extendsTokens?: TokenDocumentation[] | null;
	implementsTokens?: TokenDocumentation[][];
	typeParams?: TypeParameterData[];
	comment?: AnyDocNodeJSON | null;
	methods?: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'] | null;
	properties?: ApiClassJSON['properties'] | ApiInterfaceJSON['properties'] | null;
}

function generateIcon(kind: string) {
	const icons = {
		Class: <VscSymbolClass />,
		Method: <VscSymbolMethod />,
		Function: <VscSymbolMethod />,
		Enum: <VscSymbolEnum />,
		Interface: <VscSymbolInterface />,
		TypeAlias: <VscSymbolVariable />,
	};

	return icons[kind as keyof typeof icons];
}

export function DocContainer({
	name,
	kind,
	excerpt,
	summary,
	typeParams,
	children,
	extendsTokens,
	implementsTokens,
	methods,
	properties,
}: DocContainerProps) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return (
		<Group>
			<Stack sx={{ flexGrow: 1, maxWidth: '100%' }}>
				<Title sx={{ wordBreak: 'break-all' }} order={2} ml="xs">
					<Group>
						{generateIcon(kind)}
						{name}
					</Group>
				</Title>

				<Section title="Summary" icon={<VscListSelection size={20} />} padded dense={matches}>
					{summary ? <TSDoc node={summary} /> : <Text>No summary provided.</Text>}
				</Section>

				<Box px="xs" pb="xs">
					<SyntaxHighlighter
						wrapLongLines
						language="typescript"
						style={vscDarkPlus}
						codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
					>
						{excerpt}
					</SyntaxHighlighter>
				</Box>

				{extendsTokens?.length ? (
					<Group noWrap>
						<Title order={3} ml="xs">
							Extends
						</Title>
						<Text sx={{ wordBreak: 'break-all' }} className="font-mono">
							<HyperlinkedText tokens={extendsTokens} />
						</Text>
					</Group>
				) : null}

				{implementsTokens?.length ? (
					<Group noWrap>
						<Title order={3} ml="xs">
							Implements
						</Title>
						<Text sx={{ wordBreak: 'break-all' }} className="font-mono">
							{implementsTokens.map((token, idx) => (
								<Fragment key={idx}>
									<HyperlinkedText tokens={token} />
									{idx < implementsTokens.length - 1 ? ', ' : ''}
								</Fragment>
							))}
						</Text>
					</Group>
				) : null}

				<Stack>
					{typeParams?.length ? (
						<Section
							title="Type Parameters"
							icon={<VscSymbolParameter size={20} />}
							padded
							dense={matches}
							defaultClosed
						>
							<TypeParamTable data={typeParams} />
						</Section>
					) : null}
					<Stack>{children}</Stack>
				</Stack>
			</Stack>
			{(kind === 'Class' || kind === 'Interface') && (methods?.length || properties?.length) ? (
				<MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
					<Aside hiddenBreakpoint="lg" width={{ lg: 250 }} withBorder>
						<ScrollArea p="xs">
							<TableOfContentItems properties={properties ?? []} methods={methods ?? []}></TableOfContentItems>
						</ScrollArea>
					</Aside>
				</MediaQuery>
			) : null}
		</Group>
	);
}
