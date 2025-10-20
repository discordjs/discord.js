import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { ConstructorNode } from './ConstructorNode';
import { DeprecatedNode } from './DeprecatedNode';
import { EnumMemberNode } from './EnumMemberNode';
import { EventNode } from './EventNode';
import { InformationNode } from './InformationNode';
import { MethodNode } from './MethodNode';
import { Outline } from './Outline';
import { Scrollbars } from './OverlayScrollbars';
import { ParameterNode } from './ParameterNode';
import { PropertyNode } from './PropertyNode';
import { ReturnNode } from './ReturnNode';
import { SeeNode } from './SeeNode';
import { SummaryNode } from './SummaryNode';
import { SyntaxHighlighter } from './SyntaxHighlighter';
import { TypeParameterNode } from './TypeParameterNode';
import { UnionMember } from './UnionMember';
import { UnstableNode } from './UnstableNode';
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
			<TabList className="flex flex-wrap gap-2">
				{node.overloads.map((overload: any) => (
					<Tab
						className="cursor-pointer rounded-full bg-neutral-800/10 px-2 py-1 font-sans text-sm leading-none font-normal whitespace-nowrap text-neutral-800 hover:bg-neutral-800/20 data-[selected]:bg-neutral-500 data-[selected]:text-neutral-100 dark:bg-neutral-200/10 dark:text-neutral-200 dark:hover:bg-neutral-200/20 dark:data-[selected]:bg-neutral-500/70"
						id={`overload-${overload.displayName}-${overload.overloadIndex}`}
						key={`overload-tab-${overload.displayName}-${overload.overloadIndex}`}
					>
						<span>Overload {overload.overloadIndex}</span>
					</Tab>
				))}
			</TabList>
			{node.overloads.map((overload: any) => (
				<TabPanel
					className="flex flex-col gap-4"
					id={`overload-${overload.displayName}-${overload.overloadIndex}`}
					key={`overload-tab-panel-${overload.displayName}-${overload.overloadIndex}`}
				>
					<DocItem node={overload} packageName={packageName} version={version} />
				</TabPanel>
			))}
		</Tabs>
	);
}

export async function DocItem({
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

			<Scrollbars className="border-base-neutral-200 dark:border-base-neutral-600 bg-base-neutral-100 dark:bg-base-neutral-900 rounded-sm border">
				<SyntaxHighlighter
					className="min-w-max bg-[#f3f3f4] py-4 text-sm dark:bg-[#121214]"
					code={node.sourceExcerpt}
					lang="typescript"
				/>
			</Scrollbars>

			{node.summary?.deprecatedBlock.length ? (
				<DeprecatedNode deprecatedBlock={node.summary.deprecatedBlock} version={version} />
			) : null}

			{node.summary?.unstableBlock.length ? (
				<UnstableNode unstableBlock={node.summary.unstableBlock} version={version} />
			) : null}

			{node.summary?.summarySection ? <SummaryNode node={node.summary.summarySection} version={version} /> : null}

			{node.summary?.returnsBlock.length ? <ReturnNode node={node.summary.returnsBlock} version={version} /> : null}

			{node.summary?.seeBlocks.length ? <SeeNode node={node.summary.seeBlocks} version={version} /> : null}

			<Outline node={node} />

			{node.construct ? <ConstructorNode node={node.construct} version={version} /> : null}

			{node.typeParameters?.length ? (
				<div className="flex flex-col gap-4">
					<h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">
						<VscSymbolParameter aria-hidden className="flex-shrink-0" size={24} />
						Type Parameters
					</h2>
					<TypeParameterNode description node={node.typeParameters} version={version} />
				</div>
			) : null}

			{node.parameters?.length ? (
				<div className="flex flex-col gap-4">
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
