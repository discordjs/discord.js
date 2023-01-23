import type { ApiFunction } from '@microsoft/api-extractor-model';
import { OverloadSwitcher } from '../../OverloadSwitcher';
import { FunctionBody } from './FunctionBody';
import { Header } from '~/components/documentation/Header';

export function Function({ item }: { item: ApiFunction }) {
	const header = <Header kind={item.kind} name={item.name} />;

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
			<Header kind={item.kind} name={item.name} />
			<FunctionBody item={item} />
		</div>
	);
}
