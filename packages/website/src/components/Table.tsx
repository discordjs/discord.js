import { Table as MantineTable } from '@mantine/core';
import type { ReactNode } from 'react';

export function Table({
	rows,
	columns,
	columnStyles,
}: {
	columnStyles?: Record<string, string>;
	columns: string[];
	rows: Record<string, ReactNode>[];
}) {
	return (
		<MantineTable>
			<thead>
				<tr>
					{columns.map((column) => (
						<th key={column} className="break-normal">
							{column}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, idx) => (
					<tr key={idx}>
						{Object.entries(row).map(([colName, val]) => (
							<td key={colName} className={columnStyles?.[colName] ?? ''}>
								{val}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</MantineTable>
	);
}
