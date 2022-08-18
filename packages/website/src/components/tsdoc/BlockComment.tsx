import { Alert, Box, Title, Text } from '@mantine/core';
import { StandardTags } from '@microsoft/tsdoc';
import type { ReactNode } from 'react';
import { VscWarning } from 'react-icons/vsc';

export interface BlockProps {
	children: ReactNode;
	title: string;
}

export function Block({ children, title }: BlockProps) {
	return (
		<Box>
			<Title order={5}>{title}</Title>
			{children}
		</Box>
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
		<Alert icon={<VscWarning />} title="Deprecated" color="red" radius="xs">
			{children}
		</Alert>
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
		case StandardTags.param.tagNameWithUpperCase:
			return <Text>{children}</Text>;
		default: // TODO: Support more blocks in the future.
			return <>{children}</>;
	}
}
