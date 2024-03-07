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
import dayjs from 'dayjs';
import type { Invite } from '@/types';
import { Button } from '@/components/ui/button';
import { InvitesConfirmationAction } from './InvitesConfirmationAction';
import { Trash2Icon } from 'lucide-react';

const columnHelper = createColumnHelper<Invite>();
const columns = [
	columnHelper.accessor(row => row.code, {
		id: 'code',
		header: 'Code',
		cell(props) {
			return (
				<a href={`/invite/${props.row.original.code}`} className="link">
					{props.row.original.code}
				</a>
			);
		}
	}),
	columnHelper.accessor(row => (row.used ? 'Used' : 'Available'), {
		id: 'status',
		header: 'Status'
	}),
	columnHelper.accessor(row => row.createdBy.username, {
		id: 'createdBy',
		header: 'Created By',
		cell(props) {
			return (
				<a href={`/dashboard/admin/user/${props.row.original.createdBy.uuid}`} className="link">
					{props.row.original.createdBy.username}
				</a>
			);
		}
	}),
	columnHelper.accessor(row => dayjs(row.createdAt).format('MMMM D, YYYY h:mm A'), {
		id: 'createdAt',
		header: 'Created At'
	}),
	columnHelper.accessor(row => row.usedBy.username, {
		id: 'claimedBy',
		header: 'Claimed By',
		cell(props) {
			return props.row.original.usedBy.uuid ? (
				<a href={`/dashboard/admin/user/${props.row.original.usedBy.uuid}`} className="link">
					{props.row.original.usedBy.username}
				</a>
			) : (
				'N/A'
			);
		}
	}),
	columnHelper.accessor(row => (row.editedAt ? dayjs(row.editedAt).format('MMMM D, YYYY h:mm A') : 'N/A'), {
		id: 'claimedAt',
		header: 'Claimed At'
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props =>
			props.row.original.used ? null : (
				<div className="flex justify-end">
					<InvitesConfirmationAction
						code={props.row.original.code}
						description="Are you sure you want to revoke this invite? It will prevent anyone from using it to create an account."
					>
						<Button variant="outline" size={'icon'}>
							<Trash2Icon className="h-4 w-4" />
						</Button>
					</InvitesConfirmationAction>
				</div>
			)
	})
];

export const InvitesTable = ({ data }: PropsWithChildren<{ readonly data: any }>) => {
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
