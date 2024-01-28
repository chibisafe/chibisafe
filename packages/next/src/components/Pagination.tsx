'use client';

import { useRouter } from 'next/navigation';

import {
	Pagination as PaginationBase,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';
import { Select, type Item } from '@/components/Select';

export async function Pagination({
	currentPage,
	perPage,
	itemsTotal
}: {
	readonly currentPage: number;
	readonly itemsTotal: number;
	readonly perPage: number;
}) {
	const router = useRouter();

	const totalPages = Math.ceil(itemsTotal / perPage);
	// eslint-disable-next-line unicorn/new-for-builtins
	const totalPagesForDropdown: Item[] = Array.from(Array(totalPages)).map((_, i) => ({
		label: i + 1,
		value: i + 1
	}));

	const onSelectChange = (value: string) => {
		router.push(`/dashboard?page=${value}&limit=${perPage}`);
	};

	return (
		<>
			<PaginationBase>
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
