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
import { DeleteShortUrlButton } from './DeleteShortUrlButton';
import Link from 'next/link';
import { getDate } from '@/lib/time';

const columnHelper = createColumnHelper<LinkType>();
const columns = [
	columnHelper.accessor(row => row.identifier, {
		id: 'identifier',
		header: 'Short URL',
		cell(props) {
			return (
				<a href={props.row.original.link} className="link" target="_blank" rel="noopener noreferrer">
					{props.row.original.link}
				</a>
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
	columnHelper.accessor(row => row.user?.username, {
		id: 'user',
		header: 'User',
		enableHiding: true,
		cell: props => {
			if (!props.table.options.meta?.isAdmin) {
				props.column.toggleVisibility(false);
				return;
			}

			return (
				<Link
					href={`/dashboard/admin/users/${props.row.original.user?.uuid}`}
					className="text-blue-500 underline inline-flex items-center"
				>
					{props.row.original.user?.username}
				</Link>
			);
		}
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
				<DeleteShortUrlButton
					identifier={props.row.original.identifier}
					isAdmin={props.table.options.meta?.isAdmin}
				/>
			</div>
		)
	})
];

export const LinksTable = ({
	data = [],
	isAdmin = false
}: PropsWithChildren<{ readonly data?: any | undefined; readonly isAdmin?: boolean | undefined }>) => {
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
		},
		meta: {
			isAdmin
		}
	});

	return <DataTable table={table} columns={columns} />;
};
