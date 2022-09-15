import { useMemo, type ReactNode } from 'react';

export function Table({
	rows,
	columns,
	columnStyles,
}: {
	columnStyles?: Record<string, string>;
	columns: string[];
	rows: Record<string, ReactNode>[];
}) {
	const cols = useMemo(
		() =>
			columns.map((column) => (
				<th key={column} className="border-light-900 break-normal border-b px-3 py-2 text-left text-sm">
					{column}
				</th>
			)),
		[columns],
	);

	const data = useMemo(
		() =>
			rows.map((row, idx) => (
				<tr key={idx} className="[&>td]:last-of-type:border-0">
					{Object.entries(row).map(([colName, val]) => (
						<td
							key={colName}
							className={`border-light-900 border-b px-3 py-2 text-left text-sm ${columnStyles?.[colName] ?? ''}`}
						>
							{val}
						</td>
					))}
				</tr>
			)),
		[columnStyles, rows],
	);

	return (
		<table className="w-full border-collapse">
			<thead>
				<tr>{cols}</tr>
			</thead>
			<tbody>{data}</tbody>
		</table>
	);
}
