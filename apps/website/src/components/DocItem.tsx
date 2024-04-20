import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { ConstructorNode } from './ConstructorNode';
import { DeprecatedNode } from './DeprecatedNode';
import { EnumMemberNode } from './EnumMemberNode';
import { EventNode } from './EventNode';
import { InformationNode } from './InformationNode';
import { MethodNode } from './MethodNode';
import { Outline } from './Outline';
import { OverlayScrollbarsComponent } from './OverlayScrollbars';
import { ParameterNode } from './ParameterNode';
import { PropertyNode } from './PropertyNode';
import { ReturnNode } from './ReturnNode';
import { SeeNode } from './SeeNode';
import { SummaryNode } from './SummaryNode';
import { SyntaxHighlighter } from './SyntaxHighlighter';
import { TypeParameterNode } from './TypeParameterNode';
import { UnionMember } from './UnionMember';
import { Tab, TabList, TabPanel, Tabs } from './ui/Tabs';

async function OverloadNode({
	node,
	packageName,
	version,
}: {
	readonly node: any;
	readonly packageName: string;
	readonly version: string;
}) {
	return (
		<Tabs className="flex flex-col gap-4">
			<TabList className="flex gap-2">
				{node.overloads.map((overload: any) => {
					return (
						<Tab
							id={`overload-${overload.displayName}-${overload.overloadIndex}`}
							key={`overload-tab-${overload.displayName}-${overload.overloadIndex}`}
							className="cursor-pointer rounded-full bg-neutral-800/10 px-2 py-1 font-sans text-sm font-normal leading-none text-neutral-800 hover:bg-neutral-800/20 data-[selected]:bg-neutral-500 data-[selected]:text-neutral-100 dark:bg-neutral-200/10 dark:text-neutral-200 dark:hover:bg-neutral-200/20 dark:data-[selected]:bg-neutral-500/70"
						>
							<span>Overload {overload.overloadIndex}</span>
						</Tab>
					);
				})}
			</TabList>
			{node.overloads.map((overload: any) => {
				return (
					<TabPanel
						id={`overload-${overload.displayName}-${overload.overloadIndex}`}
						key={`overload-tab-panel-${overload.displayName}-${overload.overloadIndex}`}
						className="flex flex-col gap-8"
					>
						<DocItem node={overload} packageName={packageName} version={version} />
					</TabPanel>
				);
			})}
		</Tabs>
	);
}

export function DocItem({
	node,
	packageName,
	version,
}: {
	readonly node: any;
	readonly packageName: string;
	readonly version: string;
}) {
	if (node.overloads?.length) {
		return <OverloadNode node={node} packageName={packageName} version={version} />;
	}

	return (
		<>
			<InformationNode node={node} version={version} />

			<OverlayScrollbarsComponent
				defer
				options={{
					overflow: { y: 'hidden' },
					scrollbars: { autoHide: 'scroll', autoHideDelay: 500, autoHideSuspend: true, clickScroll: true },
				}}
				className="rounded-md border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
			>
				<SyntaxHighlighter className="py-4 text-sm" lang="typescript" code={node.sourceExcerpt} />
			</OverlayScrollbarsComponent>

			{node.summary?.deprecatedBlock.length ? (
				<DeprecatedNode deprecatedBlock={node.summary.deprecatedBlock} version={version} />
			) : null}

			{node.summary?.summarySection ? <SummaryNode node={node.summary.summarySection} version={version} /> : null}

			{node.summary?.returnsBlock.length ? <ReturnNode node={node.summary.returnsBlock} version={version} /> : null}

			{node.summary?.seeBlocks.length ? <SeeNode node={node.summary.seeBlocks} version={version} /> : null}

			<Outline node={node} />

			{node.constructor?.parametersString ? <ConstructorNode node={node.constructor} version={version} /> : null}

			{node.typeParameters?.length ? (
				<div className="flex flex-col gap-8">
					<h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">
						<VscSymbolParameter aria-hidden className="flex-shrink-0" size={24} />
						Type Parameters
					</h2>
					<TypeParameterNode description node={node.typeParameters} version={version} />
				</div>
			) : null}

			{node.parameters?.length ? (
				<div className="flex flex-col gap-8">
					<h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">
						<VscSymbolParameter aria-hidden className="flex-shrink-0" size={24} />
						Parameters
					</h2>
					<ParameterNode description node={node.parameters} version={version} />
				</div>
			) : null}

			{node.members?.properties?.length ? (
				<PropertyNode node={node.members.properties} packageName={packageName} version={version} />
			) : null}

			{node.members?.methods?.length ? (
				<div>
					<MethodNode node={node.members.methods} packageName={packageName} version={version} />
				</div>
			) : null}

			{node.members?.events?.length ? (
				<div>
					<EventNode node={node.members.events} packageName={packageName} version={version} />
				</div>
			) : null}

			{node.members?.length ? <EnumMemberNode node={node.members} packageName={packageName} version={version} /> : null}

			{node.unionMembers?.length ? <UnionMember node={node.unionMembers} version={version} /> : null}
		</>
	);
}
