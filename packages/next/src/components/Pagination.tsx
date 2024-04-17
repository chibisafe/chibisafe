'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Pagination as PaginationBase, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Select, type Item } from '@/components/Select';
import { Input } from './ui/input';
import { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, LayoutDashboardIcon, SearchIcon, TableIcon } from 'lucide-react';
import type { FilePropsType } from '@/types';
import { useUploadsQuery } from '@/hooks/useUploadsQuery';
import { useAtom } from 'jotai';
import { isMasonryViewAtom } from '@/lib/atoms/settings';
import { Tooltip } from './Tooltip';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function Pagination({
	itemsTotal,
	type,
	albumUuid
}: {
	readonly albumUuid?: string | undefined;
	readonly itemsTotal?: number | undefined;
	readonly type?: FilePropsType | undefined;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const currentPage = searchParams.get('page') ? Number.parseInt(searchParams.get('page')!, 10) : 1;
	const perPage = searchParams.get('limit')
		? Number.parseInt(searchParams.get('limit')!, 10) > 50
			? 50
			: Number.parseInt(searchParams.get('limit')!, 10)
		: 50;
	const publicOnly = searchParams.get('publicOnly') === 'true';

	const [search, setSearch] = useState(searchParams.get('search') ?? '');
	const [showMasonry, setShowMasonry] = useAtom(isMasonryViewAtom);

	const { data } = useUploadsQuery({ currentPage, perPage, search, type, albumUuid });

	const totalItems = itemsTotal ?? data?.count ?? 0;

	const totalPages = Math.ceil(totalItems / perPage);
	const totalPagesForDropdown: Item[] = Array.from({ length: totalPages }).map((_, i) => ({
		label: i + 1,
		value: i + 1
	}));

	const createSearchString = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('search', search);
		if (publicOnly) {
			params.set('publicOnly', publicOnly.toString());
		} else {
			params.delete('publicOnly');
		}

		params.delete('page');
		params.delete('limit');

		router.push(`${pathname}?${params.toString()}`);
	}, [pathname, publicOnly, router, search, searchParams]);

	const updateUrlParameters = useCallback(
		(page: number, limit: number, publicOnly: boolean) => {
			const params = new URLSearchParams(searchParams.toString());
			if (search) {
				params.set('search', search);
			}

			if (page) {
				params.set('page', page.toString());
			}

			if (limit) {
				params.set('limit', limit.toString());
			}

			if (publicOnly) {
				params.set('publicOnly', publicOnly.toString());
			} else {
				params.delete('publicOnly');
			}

			router.push(`${pathname}?${params.toString()}`);
		},
		[pathname, router, search, searchParams]
	);

	const onSelectChange = useCallback(
		(value: string) => {
			updateUrlParameters(Number(value), perPage, publicOnly);
		},
		[perPage, publicOnly, updateUrlParameters]
	);

	const onPublicOnlyChange = useCallback(
		(value: boolean) => {
			updateUrlParameters(currentPage, perPage, value);
		},
		[currentPage, perPage, updateUrlParameters]
	);

	const setPreviousUrl = () => {
		if (currentPage <= 1) {
			return;
		}

		updateUrlParameters(currentPage - 1, perPage, publicOnly);
	};

	const setNextUrl = () => {
		if (currentPage >= totalPages) {
			return;
		}

		updateUrlParameters(currentPage + 1, perPage, publicOnly);
	};

	return (
		<>
			<PaginationBase className="justify-between flex-col gap-4 sm:gap-0 sm:flex-row">
				{type === 'publicAlbum' ? (
					<div className="flex w-full sm:max-w-xs items-center gap-2">{itemsTotal} results</div>
				) : (
					<>
						<div className="flex w-full sm:max-w-xs items-center gap-2">
							<div className="hidden lg:block">
								<Tooltip content={showMasonry ? 'Switch to table view' : 'Switch to masonry view'}>
									<Button
										type="button"
										size={'icon'}
										variant={'outline'}
										className="min-w-10 min-h-10"
										onClick={() => setShowMasonry(!showMasonry)}
									>
										{showMasonry ? (
											<TableIcon className="h-4 w-4" />
										) : (
											<LayoutDashboardIcon className="h-4 w-4" />
										)}
									</Button>
								</Tooltip>
							</div>
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
						<div className="flex w-full sm:max-w-xs items-center justify-center gap-2">
							<p>{totalItems} results</p>
						</div>
					</>
				)}
				{type === 'admin' ? (
					<div className="flex w-full sm:max-w-xs items-center gap-2">
						<div className="flex items-center space-x-2">
							<Switch id="anonymous-only" onCheckedChange={value => onPublicOnlyChange(value)} />
							<Label htmlFor="anonymous-only" className="hidden md:inline-flex">
								Show anonymous files only
							</Label>
							<Label htmlFor="anonymous-only" className="inline-flex md:hidden">
								Anonymous only
							</Label>
						</div>
					</div>
				) : null}
				<PaginationContent className="justify-center sm:justify-normal">
					<li>
						<Button
							aria-label="Go to previous page"
							size="default"
							variant="ghost"
							className="gap-1 pl-2.5"
							onClick={() => setPreviousUrl()}
						>
							<ChevronLeft className="h-4 w-4" />
							<span>Previous</span>
						</Button>
					</li>
					<PaginationItem className="flex items-center gap-3 mx-2">
						<Select
							className="min-w-[72px]"
							items={totalPagesForDropdown}
							value={String(currentPage)}
							onChange={onSelectChange}
						/>
						<span className="text-nowrap">of {totalPages}</span>
					</PaginationItem>
					<li>
						<Button
							aria-label="Go to next page"
							size="default"
							variant="ghost"
							className="gap-1 pr-2.5"
							onClick={() => setNextUrl()}
						>
							<span>Next</span>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</li>
				</PaginationContent>
			</PaginationBase>
		</>
	);
}
