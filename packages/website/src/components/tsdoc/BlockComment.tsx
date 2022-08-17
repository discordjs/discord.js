import { StandardTags } from '@microsoft/tsdoc';
import type { ReactNode } from 'react';
import { VscWarning } from 'react-icons/vsc';

export interface BlockProps {
	children: ReactNode;
	title: string;
}

export function Block({ children, title }: BlockProps) {
	return (
		<div>
			<h3 className="m-0">{title}</h3>
			{children}
		</div>
	);
}

export interface BlockCommentProps {
	tagName: string;
	children: ReactNode;
	index?: number | undefined;
}

export interface ExampleBlockProps {
	children: ReactNode;
	exampleIndex?: number | undefined;
}

export function ExampleBlock({ children, exampleIndex }: ExampleBlockProps): JSX.Element {
	return <Block title={`Example ${exampleIndex ? exampleIndex : ''}`}>{children}</Block>;
}

export function DeprecatedBlock({ children }: { children: ReactNode }): JSX.Element {
	return (
		<div className="bg-red-3 border border-red-4 rounded-xl p-2 color-black">
			<h3 className="m-0 flex items-center space-x-[10px] color-black">
				<VscWarning className="mr-2 color-red-9" />
				Deprecated
			</h3>
			<span>{children}</span>
		</div>
	);
}

export function RemarksBlock({ children }: { children: ReactNode }): JSX.Element {
	return <Block title="Remarks">{children}</Block>;
}

export function BlockComment({ children, tagName, index }: BlockCommentProps): JSX.Element {
	switch (tagName.toUpperCase()) {
		case StandardTags.example.tagNameWithUpperCase:
			return <ExampleBlock exampleIndex={index}>{children}</ExampleBlock>;
		case StandardTags.deprecated.tagNameWithUpperCase:
			return <DeprecatedBlock>{children}</DeprecatedBlock>;
		case StandardTags.remarks.tagNameWithUpperCase:
			return <RemarksBlock>{children}</RemarksBlock>;
		default: // TODO: Support more blocks in the future.
			return <></>;
	}
}
