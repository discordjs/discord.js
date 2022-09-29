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
		<div className="rounded border border-red-500 p-4">
			<div className="flex flex-row place-items-center gap-4">
				<span className="text-red-500">
					<VscWarning size={20} />
				</span>
				<div className="flex flex-col gap-2 text-sm">
					<span className="font-semibold text-red-500">Deprecated</span>
					{children}
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
