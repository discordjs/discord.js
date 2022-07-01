import { constructHyperlinkedText } from '../util/util';
import type { ParameterDocumentation } from '~/util/parse.server';

interface ParameterDetailProps {
	data: ParameterDocumentation[];
}

export function ParameterTable({ data }: ParameterDetailProps) {
	return (
		<div className="p-10 border border-gray-200 solid rounded-md">
			<table className="w-full text-sm text-left text-black-500 dark:text-gray-400">
				<thead>
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Optional</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{data.map((parameter) => (
						<tr key={parameter.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							<th className="py-4 font-normal text-gray-900 dark:text-white whitespace-nowrap">{parameter.name}</th>
							<th>
								<code>{constructHyperlinkedText(parameter.tokens)}</code>
							</th>
							<th>{parameter.isOptional ? 'Yes' : 'No'}</th>
							<th>None</th>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
