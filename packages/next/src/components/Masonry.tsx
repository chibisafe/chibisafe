/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useState } from 'react';
import type { File, FilePropsType } from '@/types';
import { useAtom } from 'jotai';
import { FileAudio, File as FileIcon, FileText, FileWarning, Video } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { isDialogOpenAtom } from '@/lib/atoms/fileInformationDialog';
import { isFileAudio, isFileImage, isFilePDF, isFileVideo } from '@/lib/file';
import { cn } from '@/lib/utils';
import { Masonry as Plock } from '@/components/ui/plock';
import { FileInformationDialog } from '@/components/dialogs/FileInformationDialog';
import { useUploadsQuery } from '@/hooks/useUploadsQuery';

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

	// const ref = useRef<Record<string, HTMLImageElement | null>>({});
	const [modalOpen, setModalOpen] = useAtom(isDialogOpenAtom);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [hoveredFiles, setHoveredFiles] = useState<string[]>([]);

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

						{file.quarantine ? (
							<div className="h-40 bg-dark-90 flex flex-col justify-center items-center">
								<FileWarning className="text-red-500 w-16 h-16" />
							</div>
						) : isFileImage(file) || isFileVideo(file) ? (
							<>
								<img src={file.thumb} className="cursor-pointer w-full min-w-[160px]" />

								{isFileVideo(file) && hoveredFiles.includes(file.uuid ?? file.name) && (
									<video
										className="preview absolute top-0 left-0 w-full h-full pointer-events-none min-w-[160px]"
										autoPlay
										loop
										muted
									>
										<source src={file.preview} type="video/mp4" />
									</video>
								)}

								{isFileVideo(file) && (
									<Video className="absolute bottom-1 right-1 w-6 h-6 pointer-events-none" />
								)}
							</>
						) : (
							<div className="h-40 bg-dark-90 flex flex-col justify-center items-center cursor-pointer">
								{isFileAudio(file) && <FileAudio className=" w-16 h-16" />}
								{isFilePDF(file) && <FileText className=" w-16 h-16" />}
								{!isFileAudio(file) && !isFilePDF(file) && <FileIcon className=" w-16 h-16" />}
								{file.original ? (
									<span className=" mt-4 text-lg text-center break-all w-[160px]">
										{file.original.length > 60 ? `${file.original.slice(0, 40)}...` : file.original}
									</span>
								) : (
									<span className=" mt-4 text-lg text-center break-all w-[160px]">
										{file.name.length > 60 ? `${file.name.slice(0, 40)}...` : file.name}
									</span>
								)}
							</div>
						)}
					</div>
				)}
			/>

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
