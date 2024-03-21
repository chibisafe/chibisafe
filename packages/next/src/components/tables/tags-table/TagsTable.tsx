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
import { DataTable } from '../DataTable';
import type { TagWithCount } from '@/types';
import { Button } from '@/components/ui/button';
import { TagsConfirmationAction } from './TagsConfirmationAction';
import { ArrowUpDown, Trash2Icon } from 'lucide-react';
import Link from 'next/link';

const columnHelper = createColumnHelper<TagWithCount>();
const columns = [
	columnHelper.accessor(row => row.name, {
		id: 'name',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell(props) {
			return (
				<Link href={`/dashboard/tags/${props.row.original.uuid}`} className="link">
					{props.row.original.name}
				</Link>
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
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<TagsConfirmationAction
					uuid={props.row.original.uuid}
					description="Are you sure you want to delete this tag? This will not delete any files."
				>
					<Button variant="outline" size={'icon'}>
						<Trash2Icon className="h-4 w-4" />
					</Button>
				</TagsConfirmationAction>
			</div>
		)
	})
];

export const TagsTable = ({ data }: PropsWithChildren<{ readonly data: any }>) => {
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
