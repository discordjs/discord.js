import { StandardTags } from '@microsoft/tsdoc';
import type { PropsWithChildren } from 'react';
import { VscWarning } from 'react-icons/vsc';

export function Block({ children, title }: PropsWithChildren<{ title: string }>) {
	return (
		<div className="flex flex-col gap-2">
			<h5 className="font-bold">{title}</h5>
			{children}
		</div>
	);
}

export function ExampleBlock({
	children,
	exampleIndex,
}: PropsWithChildren<{ exampleIndex?: number | undefined }>): JSX.Element {
	return <Block title={`Example ${exampleIndex ? exampleIndex : ''}`}>{children}</Block>;
}

export function DeprecatedBlock({ children }: PropsWithChildren): JSX.Element {
	return (
		<div className="my-4">
			<div className="relative flex">
				<div className="p-4">{children}</div>
				<div className="absolute flex h-full w-full">
					<div className="rounded-tl-1.5 rounded-bl-1.5 w-4 shrink-0 border-t-2 border-b-2 border-l-2 border-red-500" />
					<div className="relative border-b-2 border-red-500">
						<div className="-translate-y-50% flex place-items-center gap-2 px-2 text-red-500">
							<VscWarning size={20} />
							<span className="font-semibold text-red-500">Deprecated</span>
						</div>
					</div>
					<div className="rounded-tr-1.5 rounded-br-1.5 flex-1 border-t-2 border-b-2 border-r-2 border-red-500" />
				</div>
			</div>
		</div>
	);
}

export function DefaultValueBlock({ children }: PropsWithChildren): JSX.Element {
	return <Block title="Default value">{children}</Block>;
}

export function RemarksBlock({ children }: PropsWithChildren): JSX.Element {
	return <Block title="Remarks">{children}</Block>;
}

export function BlockComment({
	children,
	tagName,
	index,
}: PropsWithChildren<{
	index?: number | undefined;
	tagName: string;
}>): JSX.Element {
	switch (tagName.toUpperCase()) {
		case StandardTags.example.tagNameWithUpperCase:
			return <ExampleBlock exampleIndex={index}>{children}</ExampleBlock>;
		case StandardTags.deprecated.tagNameWithUpperCase:
			return <DeprecatedBlock>{children}</DeprecatedBlock>;
		case StandardTags.remarks.tagNameWithUpperCase:
			return <RemarksBlock>{children}</RemarksBlock>;
		case StandardTags.defaultValue.tagNameWithUpperCase:
			return <DefaultValueBlock>{children}</DefaultValueBlock>;
		case StandardTags.typeParam.tagNameWithUpperCase:
		case StandardTags.param.tagNameWithUpperCase:
			return <span>{children}</span>;
		default: // TODO: Support more blocks in the future.
			return <>{children}</>;
	}
}
