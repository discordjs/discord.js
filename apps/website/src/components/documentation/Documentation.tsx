'use server';

import type { ApiItem } from '@microsoft/api-extractor-model';
import type { PropsWithChildren } from 'react';
import { Header } from './Header';

export function Documentation({ item, children }: PropsWithChildren<{ item: ApiItem }>) {
	return (
		<div className="space-y-4">
			<Header kind={item.kind} name={item.displayName} />
			{children}
		</div>
	);
}
