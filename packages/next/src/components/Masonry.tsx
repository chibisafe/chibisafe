/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useState } from 'react';
import type { File, FilePropsType } from '@/types';
import { useAtom, useAtomValue } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { isDialogOpenAtom, selectedFileAtom } from '@/lib/atoms/fileInformationDialog';
import { isFileVideo } from '@/lib/file';
import { cn } from '@/lib/utils';
import { Masonry as Plock } from '@/components/ui/plock';
import { FileInformationDialog } from '@/components/dialogs/FileInformationDialog';
import { useUploadsQuery } from '@/hooks/useUploadsQuery';
import { FilesTable } from './tables/files-table/FilesTable';
import { FileThumbnail } from './FileThumbnail';
import { isMasonryViewAtom } from '@/lib/atoms/settings';

export function Masonry({
	files,
	total,
	type
}: {
	readonly files?: File[] | undefined;
	readonly total?: number | undefined;
	readonly type: FilePropsType;
}) {
	const searchParams = useSearchParams();

	const currentPage = searchParams.get('page') ? Number.parseInt(searchParams.get('page')!, 10) : 1;
	const perPage = searchParams.get('limit')
		? Number.parseInt(searchParams.get('limit')!, 10) > 50
			? 50
			: Number.parseInt(searchParams.get('limit')!, 10)
		: 50;
	const search = searchParams.get('search') ?? '';

	const { data } = useUploadsQuery({ currentPage, perPage, search, type });

	const [modalOpen, setModalOpen] = useAtom(isDialogOpenAtom);
	const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
	const [hoveredFiles, setHoveredFiles] = useState<string[]>([]);
	const showMasonry = useAtomValue(isMasonryViewAtom);

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
				files?.length ? (
					<Plock
						items={files?.length ? files : data?.files ?? []}
						config={{
							columns: [1, 2, 3, 4],
							gap: [24, 12, 12, 12],
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
					<div className="flex flex-1 justify-center items-center text-white mt-8">
						<h1 className="border-r border-white/30 inline-block mr-5 pr-6 font-medium text-2xl align-top">
							:(
						</h1>
						<div className="inline-block">
							<h2 className="text-sm font-normal m-0">There are no files to display yet</h2>
						</div>
					</div>
				)
			) : (
				<FilesTable data={files?.length ? files : data?.files ?? []} type={type} />
			)}

			{selectedFile ? (
				<FileInformationDialog
					file={selectedFile}
					type={type}
					onOpenChange={(open: boolean) => {
						if (open) return;
						setModalOpen(open);
						setSelectedFile(null);
					}}
					isOpen={modalOpen}
				/>
			) : null}
		</>
	);
}
