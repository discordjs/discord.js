import { Alert } from '@discordjs/ui';
import type { PropsWithChildren } from 'react';

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

export function DefaultValueBlock({ children }: PropsWithChildren): JSX.Element {
	return <Block title="Default value">{children}</Block>;
}

export function RemarksBlock({ children }: PropsWithChildren): JSX.Element {
	return <Block title="Remarks">{children}</Block>;
}

export function DeprecatedBlock({ children }: PropsWithChildren): JSX.Element {
	return (
		<Alert title="Deprecated" type="danger">
			{children}
		</Alert>
	);
}

export function SeeBlock({ children }: PropsWithChildren): JSX.Element {
	return <Block title="See Also">{children}</Block>;
}
