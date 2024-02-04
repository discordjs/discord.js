import type { ApiFunction } from '@discordjs/api-extractor-model';
import dynamic from 'next/dynamic';
import { Documentation } from '~/components/documentation/Documentation';
import { ObjectHeader } from '~/components/documentation/ObjectHeader';
import { FunctionBody } from './FunctionBody';

const OverloadSwitcher = dynamic(async () => import('../../OverloadSwitcher'));

export function Function({ item }: { readonly item: ApiFunction }) {
	if (item.getMergedSiblings().length > 1) {
		const overloads = item.getMergedSiblings().map((sibling, idx) => (
			<Documentation key={`${sibling.displayName}-${idx}`}>
				<ObjectHeader item={sibling as ApiFunction} />
				<FunctionBody item={sibling as ApiFunction} />
			</Documentation>
		));

		return <OverloadSwitcher methodName={item.displayName} overloads={overloads} />;
	}

	return (
		<Documentation>
			<ObjectHeader item={item} />
			<FunctionBody item={item} />
		</Documentation>
	);
}
