'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
	Pagination as PaginationBase,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';
import { Select, type Item } from '@/components/Select';
import { Input } from './ui/input';
import { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { SearchIcon } from 'lucide-react';

export function Pagination({ itemsTotal = 0 }: { readonly itemsTotal: number }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentPage = searchParams.get('page') ? Number.parseInt(searchParams.get('page')!, 10) : 1;
	const perPage = searchParams.get('limit')
		? Number.parseInt(searchParams.get('limit')!, 10) > 50
			? 50
			: Number.parseInt(searchParams.get('limit')!, 10)
		: 50;

	const totalPages = Math.ceil(itemsTotal / perPage);
	// eslint-disable-next-line unicorn/new-for-builtins
	const totalPagesForDropdown: Item[] = Array.from(Array(totalPages)).map((_, i) => ({
		label: i + 1,
		value: i + 1
	}));

	const [search, setSearch] = useState(searchParams.get('search') ?? '');

	const createSearchString = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('search', search);
		params.delete('page');
		params.delete('limit');

		const url = new URL(window.location.href);
		router.push(`${url.pathname}?${params.toString()}`);
	}, [router, search, searchParams]);

	const onSelectChange = (value: string) => {
		router.push(`/dashboard?page=${value}&limit=${perPage}`);
	};

	return (
		<>
			<PaginationBase className="justify-between">
				<div className="flex w-full max-w-xs items-center space-x-2">
					<Input
						placeholder={`Search...`}
						defaultValue={search}
						onChange={event => setSearch(event.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								createSearchString();
							}
						}}
					/>
					<Button
						type="button"
						size={'icon'}
						variant={'outline'}
						className="min-w-10 min-h-10"
						onClick={() => createSearchString()}
					>
						<SearchIcon className="h-4 w-4" />
					</Button>
				</div>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href={`/dashboard?page=${
								currentPage > 1 ? Number(currentPage) - 1 : currentPage
							}&limit=${perPage}`}
						/>
					</PaginationItem>
					<PaginationItem className="flex items-center gap-3 mx-2">
						<Select
							className="min-w-[72px]"
							items={totalPagesForDropdown}
							value={String(currentPage)}
							onChange={onSelectChange}
						/>
						<span className="text-nowrap">of {totalPages}</span>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							href={`/dashboard?page=${
								currentPage < totalPages ? Number(currentPage) + 1 : currentPage
							}&limit=${perPage}`}
						/>
					</PaginationItem>
				</PaginationContent>
			</PaginationBase>
		</>
	);
}
