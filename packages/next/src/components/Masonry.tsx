/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useState } from 'react';
import type { File, FilePropsType } from '@/types';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { isDialogOpenAtom, selectedFileAtom, currentTypeAtom } from '@/lib/atoms/fileInformationDialog';
import { isFileVideo } from '@/lib/file';
import { cn } from '@/lib/utils';
import { Masonry as Plock } from '@/components/ui/plock';
import { useUploadsQuery } from '@/hooks/useUploadsQuery';
import { FilesTable } from './tables/files-table/FilesTable';
import { FileThumbnail } from './FileThumbnail';
import { isMasonryViewAtom } from '@/lib/atoms/settings';

export function Masonry({
	files,
	total,
	type,
	albumUuid
}: {
	readonly albumUuid?: string | undefined;
	readonly files?: File[] | undefined;
	readonly total?: number | undefined;
	readonly type: FilePropsType;
}) {
	const searchParams = useSearchParams();
	const isUploads = type === 'uploads';
	const isAlbumUploads = type === 'album' && Boolean(albumUuid);

	const currentPage = searchParams.get('page') ? Number.parseInt(searchParams.get('page')!, 10) : 1;
	const perPage = searchParams.get('limit')
		? Number.parseInt(searchParams.get('limit')!, 10) > 50
			? 50
			: Number.parseInt(searchParams.get('limit')!, 10)
		: 50;
	const search = searchParams.get('search') ?? '';

	const { data } = useUploadsQuery({ currentPage, perPage, search, type, albumUuid });

	const setModalOpen = useSetAtom(isDialogOpenAtom);
	const setSelectedFile = useSetAtom(selectedFileAtom);
	const setCurrentType = useSetAtom(currentTypeAtom);
	const [hoveredFiles, setHoveredFiles] = useState<string[]>([]);
	const showMasonry = useAtomValue(isMasonryViewAtom);

	useEffect(() => {
		setCurrentType(type);
	}, [setCurrentType, type]);

	const addToHoveredList = useCallback(
		(file: File) => {
			const identifierToUse = file.uuid ?? file.name;
			if (hoveredFiles.includes(identifierToUse)) return;
			setHoveredFiles([...hoveredFiles, identifierToUse]);
		},
		[hoveredFiles]
	);

	const removeFromHoveredList = useCallback(
		(file: File) => {
			const identifierToUse = file.uuid ?? file.name;
			if (!hoveredFiles.includes(identifierToUse)) return;
			setHoveredFiles(hoveredFiles.filter(file => file !== identifierToUse));
		},
		[hoveredFiles]
	);

	return (
		<>
			{showMasonry ? (
				<Plock
					items={files?.length ? files : isUploads || isAlbumUploads ? data?.files ?? [] : []}
					config={{
						columns: [2, 2, 3, 4],
						gap: [10, 14, 14, 14],
						media: [640, 1024, 1400, 1400]
					}}
					className="px-1"
					render={(file, idx) => (
						<div
							className={cn(
								"relative w-full h-auto transition-all duration-200 hover:scale-105 hover:duration-150 hover:outline-4 hover:outline-[hsl(216_77%_45%)] outline outline-transparent hover:z-50 after:absolute after:-inset-0 after:bg-gradient-to-t after:from-[rgb(4_21_47_/_0.5)] after:via-[rgb(19_36_61_/_0.1)] after:via-30% hover:after:from-transparent hover:after:via-transparent after:content-[''] after:pointer-events-none",
								{
									'cursor-not-allowed': file.quarantine && type !== 'quarantine'
								}
							)}
							key={idx}
							onMouseEnter={() => (isFileVideo(file) ? addToHoveredList(file) : null)}
							onMouseLeave={() => (isFileVideo(file) ? removeFromHoveredList(file) : null)}
						>
							<a
								className={cn('w-full h-full absolute top-0 left-0 pointer-events-auto', {
									'pointer-events-none': file.quarantine && type !== 'quarantine'
								})}
								href={file.url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={e => {
									e.preventDefault();
									e.stopPropagation();
									if (file.quarantine && type !== 'quarantine') {
										return;
									}

									setSelectedFile(file);
									setModalOpen(true);
								}}
							/>

							<FileThumbnail file={file} hoveredFiles={hoveredFiles} type={type} />
						</div>
					)}
				/>
			) : (
				<FilesTable data={files?.length ? files : data?.files ?? []} type={type} />
			)}
		</>
	);
}
