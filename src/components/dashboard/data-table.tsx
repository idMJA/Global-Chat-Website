import { cn } from "@/lib/utils";

interface Column<T> {
	header: string;
	accessor: keyof T | ((row: T) => React.ReactNode);
	className?: string;
	key?: string;
}

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	className?: string;
	onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
	data,
	columns,
	className,
	onRowClick,
}: DataTableProps<T>) {
	const getCellValue = (row: T, column: Column<T>) => {
		if (typeof column.accessor === "function") {
			return column.accessor(row);
		}
		return row[column.accessor];
	};

	return (
		<div className={cn("relative w-full overflow-auto", className)}>
			<table className="w-full caption-bottom text-sm">
				<thead className="[&_tr]:border-b">
					<tr className="border-b transition-colors hover:bg-muted/50">
						{columns.map((column, index) => (
							<th
								key={column.key || column.header || index}
								className={cn(
									"h-12 px-4 text-left align-middle font-medium text-muted-foreground",
									column.className,
								)}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="[&_tr:last-child]:border-0">
					{data.length === 0 ? (
						<tr>
							<td
								colSpan={columns.length}
								className="h-24 text-center text-muted-foreground"
							>
								No data available
							</td>
						</tr>
					) : (
						data.map((row) => (
							<tr
								key={row.id}
								className={cn(
									"border-b transition-colors hover:bg-muted/50",
									onRowClick && "cursor-pointer",
								)}
								onClick={() => onRowClick?.(row)}
							>
								{columns.map((column, index) => (
									<td
										key={column.key || column.header || index}
										className={cn("p-4 align-middle", column.className)}
									>
										{getCellValue(row, column) as React.ReactNode}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
