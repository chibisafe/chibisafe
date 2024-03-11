'use client';

import type { PropsWithChildren } from 'react';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Table as TableType } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

export const DataTable = ({
	table,
	columns,
	showSearch = false,
	searchColumn,
	showColumnSelector = false
}: PropsWithChildren<{
	readonly columns: any[];
	readonly searchColumn?: string;
	readonly showColumnSelector?: boolean;
	readonly showSearch?: boolean;
	readonly table: TableType<any>;
}>) => {
	return (
		<>
			<div className="flex items-center py-4">
				{/* // TODO: Be able to search on any columns instead of a specific one */}
				{showSearch && searchColumn ? (
					<Input
						placeholder={`Search...`}
						value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
						onChange={event => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
				) : null}
				{showColumnSelector ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter(column => column.getCanHide())
								.map(column => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={value => column.toggleVisibility(Boolean(value))}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				) : null}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
};
