import type { TypeParameterData } from '~/util/parse.server';
import { constructHyperlinkedText } from '~/util/util';

export interface TableProps {
	data: TypeParameterData[];
}

export function TypeParamTable({ data }: TableProps) {
	return (
		<div className="p-10 border border-gray-200 solid rounded-md">
			<table className="w-full text-sm text-left text-black-500 dark:text-gray-400">
				<thead>
					<tr>
						<th>Name</th>
						<th>Constraint</th>
						<th>Optional</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{data.map((parameter) => (
						<tr key={parameter.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							<th className="py-4 font-normal text-gray-900 dark:text-white whitespace-nowrap">{parameter.name}</th>
							<th>
								<code>{constructHyperlinkedText(parameter.constraintTokens)}</code>
							</th>
							<th>{parameter.optional ? 'Yes' : 'No'}</th>
							<th>
								<code>{constructHyperlinkedText(parameter.defaultTokens)}</code>
							</th>
							<th>None</th>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
