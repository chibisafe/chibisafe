'use client';

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, type PropsWithChildren } from 'react';
import { formatBytes } from '@/lib/file';
import { Badge } from '../ui/badge';
import { UserTableActions } from './UserTableActions';
import type { UserWithCount } from '@/types';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
const columnHelper = createColumnHelper<UserWithCount>();
const columns = [
	columnHelper.accessor(row => row.username, {
		id: 'username',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Username
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		}
	}),
	columnHelper.accessor(row => row._count.files, {
		id: 'files',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Files
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		}
	}),
	columnHelper.accessor(row => (row.enabled ? 'Enabled' : 'Disabled'), {
		id: 'status',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		}
	}),
	columnHelper.accessor(row => row.roles, {
		id: 'roles',
		header: 'Roles',
		cell: props => (
			<div className="flex gap-2">
				{props.getValue().map((role: any) => (
					<Badge key={role.name} className="ml-1">
						{role.name}
					</Badge>
				))}
			</div>
		)
	}),
	columnHelper.accessor(row => formatBytes(row.storageQuota.used), {
		id: 'used',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Used
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		}
	}),
	columnHelper.accessor(row => (row.storageQuota.quota ? formatBytes(row.storageQuota.quota) : 'Unlimited'), {
		id: 'limit',
		header: 'Limit'
	}),
	columnHelper.accessor(row => row.createdAt, {
		id: 'created',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Created
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => <span>{new Date(props.getValue()).toLocaleDateString()}</span>
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => <UserTableActions user={props.row.original} />
	})
];

export const UserTable = ({ data }: PropsWithChildren<{ readonly data: any }>) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility
		}
	});

	return (
		<>
			<div className="flex items-center py-4">
				<Input
					placeholder="Search user..."
					value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
					onChange={event => table.getColumn('username')?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
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
