import { Suspense } from 'react';
import type { File, FilePropsType } from '@/types';

import { Masonry } from '@/components/Masonry';
import { Pagination } from '@/components/Pagination';

export async function FilesList({
	files,
	count,
	type
}: {
	readonly count: number;
	readonly files: File[];
	readonly type: FilePropsType;
}) {
	return files.length ? (
		<div className="grid gap-8">
			<Suspense>
				<Pagination itemsTotal={count} />
			</Suspense>
			<Masonry files={files} total={count} type={type} />
			<Suspense>
				<Pagination itemsTotal={count} />
			</Suspense>
		</div>
	) : (
		<div className="flex flex-1 justify-center items-center text-white">
			<h1 className="border-r border-white/30 inline-block mr-5 pr-6 font-medium text-2xl align-top">:(</h1>
			<div className="inline-block">
				<h2 className="text-sm font-normal m-0">There are no files to display yet</h2>
			</div>
		</div>
	);
}
