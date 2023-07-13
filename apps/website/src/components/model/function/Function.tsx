import type { ApiFunction } from '@microsoft/api-extractor-model';
import dynamic from 'next/dynamic';
import { Header } from '../../documentation/Header';
import { FunctionBody } from './FunctionBody';

const OverloadSwitcher = dynamic(async () => import('../../OverloadSwitcher'));

export function Function({ item }: { item: ApiFunction }) {
	const header = <Header kind={item.kind} name={item.name} sourceURL={item.sourceLocation.fileUrl} />;

	if (item.getMergedSiblings().length > 1) {
		const overloads = item
			.getMergedSiblings()
			.map((sibling, idx) => <FunctionBody item={sibling as ApiFunction} key={`${sibling.displayName}-${idx}`} />);

		return (
			<div>
				{header}
				<OverloadSwitcher overloads={overloads} />
			</div>
		);
	}

	return (
		<div>
			{header}
			<FunctionBody item={item} />
		</div>
	);
}
