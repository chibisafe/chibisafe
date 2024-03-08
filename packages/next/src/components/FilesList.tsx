import { Suspense } from 'react';
import type { File, FilePropsType } from '@/types';

import { Masonry } from '@/components/Masonry';
import { Pagination } from '@/components/Pagination';

export async function FilesList({ files, count, type }: { readonly count: number; readonly files: File[]; readonly type: FilePropsType }) {
	return (
		<div className="grid gap-8">
			<Suspense>
				<Pagination itemsTotal={count} />
			</Suspense>
			<Masonry files={files} total={count} type={type} />
			<Suspense>
				<Pagination itemsTotal={count} />
			</Suspense>
		</div>
	);
}
