import { Suspense } from 'react';
import type { File, FilePropsType } from '@/types';

import { Pagination } from '@/components/Pagination';
import { FileInformationDialog } from './dialogs/FileInformationDialog';
import { FilesWrapper } from './FilesWrapper';

export async function FilesList({
	files,
	count,
	type,
	albumUuid
}: {
	readonly albumUuid?: string | undefined;
	readonly count?: number;
	readonly files?: File[];
	readonly type: FilePropsType;
}) {
	return (
		<div className="grid gap-4">
			<Suspense>
				<Pagination itemsTotal={count} type={type} albumUuid={albumUuid} />
				<FilesWrapper files={files} total={count} type={type} albumUuid={albumUuid} />
				<Pagination itemsTotal={count} type={type} albumUuid={albumUuid} />
			</Suspense>
			<FileInformationDialog />
		</div>
	);
}
