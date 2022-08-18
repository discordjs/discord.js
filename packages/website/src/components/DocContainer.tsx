import { Group, Stack, Title, Text, Box, MediaQuery, Aside, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { VscListSelection, VscSymbolParameter } from 'react-icons/vsc';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { HyperlinkedText } from './HyperlinkedText';
import { Section } from './Section';
import { TableOfContentsItems } from './TableOfContentsItems';
import { TypeParamTable } from './TypeParamTable';
import { TSDoc } from './tsdoc/TSDoc';
import type { DocClass } from '~/DocModel/DocClass';
import type { DocItem } from '~/DocModel/DocItem';
import type { AnyDocNodeJSON } from '~/DocModel/comment/CommentNode';
import { generateIcon } from '~/util/icon';
import type { TokenDocumentation, TypeParameterData } from '~/util/parse.server';

export interface DocContainerProps {
	name: string;
	kind: string;
	excerpt: string;
	summary?: ReturnType<DocItem['toJSON']>['summary'];
	children?: ReactNode;
	extendsTokens?: TokenDocumentation[] | null;
	implementsTokens?: TokenDocumentation[][];
	typeParams?: TypeParameterData[];
	comment?: AnyDocNodeJSON | null;
	methods?: ReturnType<DocClass['toJSON']>['methods'] | null;
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
}: DocContainerProps) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return (
		<Group>
			<Stack sx={{ flexGrow: 1 }}>
				<Title sx={{ wordBreak: 'break-all' }} order={2} ml="xs">
					<Group>
						{generateIcon(kind)}
						{name}
					</Group>
				</Title>

				<Section title="Summary" icon={<VscListSelection />} padded dense={matches}>
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
								<>
									<HyperlinkedText tokens={token} />
									{idx < implementsTokens.length - 1 ? ', ' : ''}
								</>
							))}
						</Text>
					</Group>
				) : null}

				<Stack>
					{typeParams?.length ? (
						<Section title="Type Parameters" icon={<VscSymbolParameter />} padded dense={matches} defaultClosed>
							<TypeParamTable data={typeParams} />
						</Section>
					) : null}
					<Stack>{children}</Stack>
				</Stack>
			</Stack>
			{kind === 'Class' && methods ? (
				<MediaQuery smallerThan="md" styles={{ display: 'none' }}>
					<Aside
						sx={{ backgroundColor: 'transparent' }}
						hiddenBreakpoint="md"
						width={{ md: 200, lg: 300 }}
						withBorder={false}
					>
						<ScrollArea p="xs">
							<TableOfContentsItems members={methods}></TableOfContentsItems>
						</ScrollArea>
					</Aside>
				</MediaQuery>
			) : null}
		</Group>
	);
}
