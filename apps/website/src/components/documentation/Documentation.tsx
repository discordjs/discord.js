'use server';

import type { ApiItem } from '@microsoft/api-extractor-model';
import { Header } from './Header';

export function Documentation({ item }: { item: ApiItem }) {
	return (
		<div>
			<Header item={item} />
		</div>
	);
}
