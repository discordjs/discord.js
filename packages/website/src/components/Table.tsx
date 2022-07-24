import type { ReactNode } from 'react';

export interface RowData {
	monospace?: boolean;
	content: string;
}

export interface TableProps {
	columns: string[];
	columnStyles?: Record<string, string>;
	rows: Record<string, ReactNode>[];
	className?: string | undefined;
}

export function Table({ rows, columns, columnStyles, className }: TableProps) {
	return (
		<div className={className}>
			<table className="table-fixed w-full pb-10 border-collapse">
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column} className="border-b z-10 text-left text-sm pl-2 border-gray">
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr key={i}>
							{Object.entries(row).map(([colName, val]) => (
								<td
									key={colName}
									className={`p-2 text-sm border-b text-left border-gray break-all ${columnStyles?.[colName] ?? ''}`}
								>
									{val}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
