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
import type { Link as LinkType } from '@/types';
import { Button } from '@/components/ui/button';
import { LinksConfirmationAction } from './LinksConfirmationAction';
import { Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { getDate } from '@/lib/time';

const columnHelper = createColumnHelper<LinkType>();
const columns = [
	columnHelper.accessor(row => row.identifier, {
		id: 'identifier',
		header: 'Short URL',
		cell(props) {
			return (
				<Link href={props.row.original.link} className="link" target="_blank" rel="noopener noreferrer">
					{props.row.original.link}
				</Link>
			);
		}
	}),
	columnHelper.accessor(row => row.destination, {
		id: 'destination',
		header: 'Destination URL',
		cell(props) {
			return (
				<p className="text-ellipsis max-w-96 whitespace-nowrap overflow-hidden">
					{props.row.original.destination}
				</p>
			);
		}
	}),
	columnHelper.accessor(row => row.views, {
		id: 'views',
		header: 'Views'
	}),
	columnHelper.accessor(row => getDate(row.createdAt), {
		id: 'createdAt',
		header: 'Created At'
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<LinksConfirmationAction
					identifier={props.row.original.identifier}
					description="Are you sure you want to delete this URL?"
				>
					<Button variant="outline" size="icon">
						<Trash2Icon className="h-4 w-4" />
					</Button>
				</LinksConfirmationAction>
			</div>
		)
	})
];

export const LinksTable = ({ data = [] }: PropsWithChildren<{ readonly data?: any | undefined }>) => {
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
