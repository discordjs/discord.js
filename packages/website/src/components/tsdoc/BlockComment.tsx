import { StandardTags } from '@microsoft/tsdoc';
import type { ReactNode } from 'react';

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

export function BlockComment({ children, tagName, index }: BlockCommentProps): JSX.Element {
	switch (tagName.toUpperCase()) {
		case StandardTags.example.tagNameWithUpperCase:
			return <ExampleBlock exampleIndex={index}>{children}</ExampleBlock>;
		default: // TODO: Support more blocks in the future.
			return <></>;
	}
}
