import type { ApiItem } from '@microsoft/api-extractor-model';
import type { PropsWithChildren } from 'react';
import { Header } from './Header';

export function Documentation({
	item,
	children,
	showHeader,
}: PropsWithChildren<{ item: ApiItem; showHeader?: boolean }>) {
	return (
		<div className="w-full flex-col space-y-4">
			{showHeader ?? true ? <Header kind={item.kind} name={item.displayName} /> : null}
			{children}
		</div>
	);
}
