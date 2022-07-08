import { ParameterTable } from './ParameterTable';
import type { DocMethod } from '~/DocModel/DocMethod';
import type { DocMethodSignature } from '~/DocModel/DocMethodSignature';
import { constructHyperlinkedText } from '~/util/util';

type MethodResolvable = ReturnType<DocMethod['toJSON']> | ReturnType<DocMethodSignature['toJSON']>;

export interface MethodItemProps {
	data: MethodResolvable;
}

function getShorthandName(data: MethodResolvable) {
	return `${data.name}(${data.parameters.reduce((prev, cur, index) => {
		if (index === 0) {
			return `${prev}${cur.name}`;
		}

		return `${prev}, ${cur.name}`;
	}, '')})`;
}

export function MethodItem({ data }: MethodItemProps) {
	return (
		<div className="flex flex-col ml-3">
			<div className="w-full flex flex-row">
				<h4 className="font-mono my-0 break-all">{`${getShorthandName(data)}`}</h4>
				<h4 className="mx-3 my-0">:</h4>
				<h4 className="font-mono color-blue-800 my-0 break-all ">{constructHyperlinkedText(data.returnTypeTokens)}</h4>
			</div>
			{data.summary && <p className="color-slate-500 mt-2">{data.summary}</p>}
			{data.parameters.length ? <ParameterTable className="m-b-10 m-x-10" data={data.parameters} /> : null}
		</div>
	);
}
