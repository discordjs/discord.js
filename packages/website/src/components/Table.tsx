export interface RowData {
	monospace?: boolean;
	content: string;
}

export interface TableProps {
	columns: string[];
	columnStyles?: Record<string, string>;
	rows: Record<string, string | (string | JSX.Element)[]>[];
	className?: string | undefined;
}

export function Table({ rows, columns, columnStyles, className }: TableProps) {
	return (
		<div className={className}>
			<table className="table-fixed w-full p-b-10 border-collapse">
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column} className="border-b z-10 text-left text-sm pl-2 border-slate-400">
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr key={i}>
							{Object.entries(row).map(([colName, val]) => {
								console.log(colName);
								console.log(columnStyles?.[colName]);
								return (
									<td
										key={colName}
										className={`p-2 text-sm border-b text-left border-slate-300 break-all ${
											columnStyles?.[colName] ?? ''
										}`}
									>
										{val}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
