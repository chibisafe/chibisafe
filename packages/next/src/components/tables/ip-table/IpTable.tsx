'use client';

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { useState, type PropsWithChildren } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { DataTable } from '../DataTable';
import dayjs from 'dayjs';
import { IpTableActions } from './IpTableActions';

interface IP {
	readonly createdAt: string;
	readonly ip: string;
	// TODO: Migrate the backend to accept a reason why banning an IP
	readonly reason?: string;
}

const columnHelper = createColumnHelper<IP>();
const columns = [
	columnHelper.display({
		id: 'ip',
		header: 'IP',
		cell: props => (
			<a
				href={`/dashboard/admin/ip/${props.row.original.ip}`}
				className="text-blue-500 underline inline-flex items-center ml-2"
			>
				{props.row.original.ip}
			</a>
		)
	}),
	columnHelper.accessor(row => row.createdAt, {
		id: 'created',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Added on
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => <span>{dayjs(props.getValue()).format('MMMM D, YYYY h:mm A')}</span>
	}),
	columnHelper.accessor(row => row.reason, {
		id: 'reason',
		header: 'Reason'
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<IpTableActions ip={props.row.original.ip} />
			</div>
		)
	})
];

export const IpTable = ({ data }: PropsWithChildren<{ readonly data: any }>) => {
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

	return <DataTable table={table} columns={columns} />;
};