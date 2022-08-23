import { Alert, Box, Title, Text } from '@mantine/core';
import { StandardTags } from '@microsoft/tsdoc';
import type { ReactNode } from 'react';
import { VscWarning } from 'react-icons/vsc';

export function Block({ children, title }: { children: ReactNode; title: string }) {
	return (
		<Box>
			<Title order={5}>{title}</Title>
			{children}
		</Box>
	);
}

export function ExampleBlock({
	children,
	exampleIndex,
}: {
	children: ReactNode;
	exampleIndex?: number | undefined;
}): JSX.Element {
	return <Block title={`Example ${exampleIndex ? exampleIndex : ''}`}>{children}</Block>;
}

export function DeprecatedBlock({ children }: { children: ReactNode }): JSX.Element {
	return (
		<Alert icon={<VscWarning />} title="Deprecated" variant="outline" color="red" radius="sm">
			{children}
		</Alert>
	);
}

export function DefaultValueBlock({ children }: { children: ReactNode }): JSX.Element {
	return <Block title="Default value">{children}</Block>;
}

export function RemarksBlock({ children }: { children: ReactNode }): JSX.Element {
	return <Block title="Remarks">{children}</Block>;
}

export function BlockComment({
	children,
	tagName,
	index,
}: {
	tagName: string;
	children: ReactNode;
	index?: number | undefined;
}): JSX.Element {
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
			return <Text>{children}</Text>;
		default: // TODO: Support more blocks in the future.
			return <>{children}</>;
	}
}
