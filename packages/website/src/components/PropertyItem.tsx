import type { DocProperty } from '~/DocModel/DocProperty';
import { constructHyperlinkedText } from '~/util/util';

export interface PropertyItemProps {
	data: ReturnType<DocProperty['toJSON']>;
}

export function PropertyItem({ data }: PropertyItemProps) {
	return (
		<div className="flex flex-col mb-2 ml-3">
			<div className="w-full flex flex-row">
				<h4 className="font-mono my-0">{`${data.name}`}</h4>
				<h4 className="mx-3 my-0">:</h4>
				<h4 className="font-mono color-blue-800 my-0">{constructHyperlinkedText(data.propertyTypeTokens)}</h4>
			</div>
			{data.summary && <p className="color-slate-500 mt-2">{data.summary}</p>}
		</div>
	);
}
