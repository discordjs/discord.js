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
				<th
					className="border-light-900 dark:border-dark-100 break-normal border-b px-3 py-2 text-left text-sm"
					key={column}
				>
					{column}
				</th>
			)),
		[columns],
	);

	const data = useMemo(
		() =>
			rows.map((row, idx) => (
				<tr className="[&>td]:last-of-type:border-0" key={idx}>
					{Object.entries(row).map(([colName, val]) => (
						<td
							className={`border-light-900 dark:border-dark-100 border-b px-3 py-2 text-left text-sm ${
								columnStyles?.[colName] ?? ''
							}`}
							key={colName}
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
