import { FiLink } from 'react-icons/fi';
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

function onAnchorClick() {
	console.log('anchor clicked');
	// Todo implement jump-to links
}

export function MethodItem({ data }: MethodItemProps) {
	return (
		<div className="flex flex-col">
			<div className="flex content-center">
				<button className="bg-transparent border-none cursor-pointer" onClick={onAnchorClick}>
					<FiLink size={16} />
				</button>
				<div className="flex flex-col ml-3">
					<div className="w-full flex flex-row">
						<h4 className="font-mono my-0 break-all">{`${getShorthandName(data)}`}</h4>
						<h4 className="mx-3 my-0">:</h4>
						<h4 className="font-mono color-blue-800 my-0 break-all ">
							{constructHyperlinkedText(data.returnTypeTokens)}
						</h4>
					</div>
				</div>
			</div>
			<div className="mx-10">
				{data.summary && <p className="color-slate-500 mt-2">{data.summary}</p>}
				{data.parameters.length ? <ParameterTable className="mb-10 mx-5" data={data.parameters} /> : null}
			</div>
		</div>
	);
}
