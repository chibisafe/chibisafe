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
import { ArrowUpRightFromSquare } from 'lucide-react';
import { DataTable } from '../DataTable';
import type { AlbumLink } from '@/types';
import { DeleteLinkButton } from './DeleteLinkButton';
import { AlbumLinksToggleAction } from './AlbumLinksToggleAction';

const columnHelper = createColumnHelper<AlbumLink>();
const columns = [
	columnHelper.accessor(row => row.views, {
		id: 'views',
		header: 'Views'
	}),
	columnHelper.display({
		id: 'link',
		header: 'Link',
		cell: props => (
			<a href={`/a/${props.row.original.identifier}`} target="_blank" className="link inline-flex items-center">
				{props.row.original.identifier} <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
			</a>
		)
	}),
	columnHelper.display({
		id: 'enabled',
		header: 'Enabled',
		cell: props => (
			<AlbumLinksToggleAction
				key={props.row.original.uuid}
				uuid={props.row.original.uuid}
				albumUuid={props.row.original.albumUuid}
				initialEnabled={props.row.original.enabled}
			/>
		)
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<DeleteLinkButton uuid={props.row.original.uuid} albumUuid={props.row.original.albumUuid} />
			</div>
		)
	})
];

export const AlbumLinksTable = ({ data = [] }: PropsWithChildren<{ readonly data?: any | undefined }>) => {
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
