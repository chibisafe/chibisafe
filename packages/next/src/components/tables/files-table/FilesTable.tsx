'use client';
/* eslint-disable @next/next/no-img-element */

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { useState, type PropsWithChildren } from 'react';
import type { File } from '@/types';
import {
	ArrowDownToLineIcon,
	ArrowUpDown,
	ArrowUpRightFromSquare,
	FileAudio,
	FileIcon,
	FileText,
	FileWarning
} from 'lucide-react';
import { Button } from '../../ui/button';
import { DataTable } from '../DataTable';
import { FileInformationDialogActions } from '@/components/FileInformationDialogActions';
import { FileInformationDrawerActions } from '@/components/FileInformationDrawerActions';
import { formatBytes, isFileAudio, isFileImage, isFilePDF, isFileVideo } from '@/lib/file';

const columnHelper = createColumnHelper<File>();
const columns = [
	columnHelper.accessor(row => row.thumb, {
		id: 'thumbnail',
		header: 'Preview',
		cell: props =>
			props.row.original.quarantine ? (
				<FileWarning className="text-red-500 w-16 h-16" />
			) : isFileImage(props.row.original) || isFileVideo(props.row.original) ? (
				<img src={props.row.original.thumb} className="cursor-pointer w-full max-w-32" />
			) : (
				<>
					{isFileAudio(props.row.original) && <FileAudio className=" w-16 h-16" />}
					{isFilePDF(props.row.original) && <FileText className=" w-16 h-16" />}
					{!isFileAudio(props.row.original) && !isFilePDF(props.row.original) && (
						<FileIcon className=" w-16 h-16" />
					)}
					{props.row.original.original ? (
						<span className="break-all max-w-[160px]">
							{props.row.original.original.length > 60
								? `${props.row.original.original.slice(0, 40)}...`
								: props.row.original.original}
						</span>
					) : (
						<span className="break-all max-w-[160px]">
							{props.row.original.name.length > 60
								? `${props.row.original.name.slice(0, 40)}...`
								: props.row.original.name}
						</span>
					)}
				</>
			)
	}),
	columnHelper.accessor(row => row.url, {
		id: 'link',
		header: 'Link',
		cell: props => (
			<a
				href={`/dashboard/admin/ip/${props.row.original.url}`}
				className="text-blue-500 underline inline-flex items-center"
			>
				{props.row.original.name} <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
			</a>
		)
	}),
	columnHelper.accessor(row => row.original, {
		id: 'original',
		header: 'Original',
		cell: props => (
			<a
				href={`/api/file/${props.row.original.uuid}/download`}
				className="text-blue-500 underline inline-flex items-center break-all"
			>
				{props.row.original.original} <ArrowDownToLineIcon className="w-4 h-4 ml-1" />
			</a>
		)
	}),
	columnHelper.accessor(row => row.size, {
		id: 'size',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Size
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => <span>{formatBytes(props.getValue())}</span>
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
		cell: props => (
			<>
				<div className="md:inline-block hidden">
					<FileInformationDialogActions file={props.row.original} type={'uploads'} />
				</div>

				<div className="md:hidden inline-block">
					<FileInformationDrawerActions file={props.row.original} type={'uploads'} />
				</div>
			</>
		)
	})
];

export const FilesTable = ({ data }: PropsWithChildren<{ readonly data: any }>) => {
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
