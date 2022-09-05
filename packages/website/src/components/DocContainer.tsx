import type {
	ApiItemJSON,
	TokenDocumentation,
	TypeParameterData,
	ApiClassJSON,
	ApiInterfaceJSON,
} from '@discordjs/api-extractor-utils';
import { Title, Text, MediaQuery, Skeleton, Divider } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { Fragment, type PropsWithChildren } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import {
	VscSymbolClass,
	VscSymbolMethod,
	VscSymbolEnum,
	VscSymbolInterface,
	VscSymbolVariable,
	VscListSelection,
	VscSymbolParameter,
} from 'react-icons/vsc';
import { HyperlinkedText } from './HyperlinkedText';
import { Section } from './Section';
import { SyntaxHighlighter } from './SyntaxHighlighter';
import { TableOfContentItems } from './TableOfContentItems';
import { TypeParamTable } from './TypeParamTable';
import { TSDoc } from './tsdoc/TSDoc';

type DocContainerProps = PropsWithChildren<{
	excerpt: string;
	extendsTokens?: TokenDocumentation[] | null;
	implementsTokens?: TokenDocumentation[][];
	kind: string;
	methods?: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'] | null;
	name: string;
	properties?: ApiClassJSON['properties'] | ApiInterfaceJSON['properties'] | null;
	summary?: ApiItemJSON['summary'];
	typeParams?: TypeParameterData[];
}>;

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
	const router = useRouter();
	const matches = useMediaQuery('(max-width: 768px)');

	return (
		<>
			<div className="flex flex-col gap-4">
				<Skeleton visible={router.isFallback} radius="sm">
					<Title sx={{ wordBreak: 'break-all' }} order={2} ml="xs">
						<div className="flex flex-row place-items-center gap-2">
							{generateIcon(kind)}
							{name}
						</div>
					</Title>
				</Skeleton>

				<Skeleton visible={router.isFallback} radius="sm">
					<Section title="Summary" icon={<VscListSelection size={20} />} padded dense={matches}>
						{summary ? <TSDoc node={summary} /> : <Text>No summary provided.</Text>}
						<Divider size="md" mt={20} />
					</Section>
				</Skeleton>

				<Skeleton visible={router.isFallback} radius="sm">
					<SyntaxHighlighter code={excerpt} />
				</Skeleton>

				{extendsTokens?.length ? (
					<div className="flex flex-row place-items-center gap-4">
						<Title order={3} ml="xs">
							Extends
						</Title>
						<span className="break-all font-mono">
							<HyperlinkedText tokens={extendsTokens} />
						</span>
					</div>
				) : null}

				{implementsTokens?.length ? (
					<div className="flex flex-row place-items-center gap-4">
						<Title order={3} ml="xs">
							Implements
						</Title>
						<span className="break-all font-mono">
							{implementsTokens.map((token, idx) => (
								<Fragment key={idx}>
									<HyperlinkedText tokens={token} />
									{idx < implementsTokens.length - 1 ? ', ' : ''}
								</Fragment>
							))}
						</span>
					</div>
				) : null}

				<Skeleton visible={router.isFallback} radius="sm">
					<div className="flex flex-col gap-4">
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
						{children}
					</div>
				</Skeleton>
			</div>
			{(kind === 'Class' || kind === 'Interface') && (methods?.length || properties?.length) ? (
				<MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
					<aside className="h-[calc(100vh - 72px)] dark:bg-dark-600 dark:border-dark-100 border-light-800 fixed top-[72px] right-0 bottom-0 z-20 hidden w-64 border-l bg-white pr-2 lg:block">
						<Scrollbars
							universal
							autoHide
							hideTracksWhenNotNeeded
							renderTrackVertical={(props) => (
								<div {...props} className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded" />
							)}
							renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
						>
							<TableOfContentItems properties={properties ?? []} methods={methods ?? []} />
						</Scrollbars>
					</aside>
				</MediaQuery>
			) : null}
		</>
	);
}
