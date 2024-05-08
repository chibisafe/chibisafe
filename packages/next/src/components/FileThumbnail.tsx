'use client';

import { selectedFileAtom, isDialogOpenAtom } from '@/lib/atoms/fileDialog';
import { isFileImage, isFileVideo, isFileAudio, isFilePDF } from '@/lib/file';
import { cn } from '@/lib/utils';
import type { FilePropsType, FileWithIndex } from '@/types';
import { useSetAtom } from 'jotai';
import { FileWarning, Video, FileAudio, FileText, FileIcon } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';

const ComponentType = ({
	children,
	isTableView,
	file,
	type
}: PropsWithChildren<{
	readonly file?: FileWithIndex;
	readonly isTableView?: boolean;
	readonly type: FilePropsType;
}>) => {
	const setModalOpen = useSetAtom(isDialogOpenAtom);
	const setSelectedFile = useSetAtom(selectedFileAtom);

	return isTableView && file ? (
		<button
			type="button"
			className="flex flex-col justify-center items-center"
			onClick={e => {
				e.preventDefault();
				e.stopPropagation();

				if (file.quarantine && type !== 'quarantine') {
					return;
				}

				setSelectedFile(file);
				setModalOpen(true);
			}}
		>
			{children}
		</button>
	) : (
		<>{children}</>
	);
};

export const FileThumbnail = ({
	file,
	hoveredFiles = [],
	isTableView = false,
	type
}: {
	readonly file: FileWithIndex;
	readonly hoveredFiles?: string[];
	readonly isTableView?: boolean;
	readonly type: FilePropsType;
}) => {
	const [error, setError] = useState(false);

	return file.quarantine ? (
		<div className={cn('flex flex-col justify-center items-center', isTableView ? '' : 'h-40 bg-dark-90')}>
			<FileWarning className="text-red-500 w-16 h-16" />
		</div>
	) : (isFileImage(file) && !error) || (isFileVideo(file) && file.thumb && !error) ? (
		<ComponentType isTableView={isTableView} file={file} type={type}>
			<picture>
				<img
					src={file.thumb}
					className="cursor-pointer w-full sm:min-w-[160px] min-w-0"
					onError={() => setError(true)}
				/>
			</picture>

			{isFileVideo(file) && hoveredFiles.includes(file.uuid ?? file.name) && (
				<video
					className="preview absolute top-0 left-0 w-full h-full pointer-events-none sm:min-w-[160px] min-w-0"
					autoPlay
					loop
					muted
				>
					<source src={file.preview} type="video/mp4" />
				</video>
			)}

			{isFileVideo(file) && <Video className="absolute bottom-1 right-1 w-6 h-6 pointer-events-none" />}
		</ComponentType>
	) : (
		<div
			className={cn(
				'flex flex-col justify-center items-center cursor-pointer',
				isTableView ? '' : 'h-40 bg-dark-90'
			)}
		>
			<ComponentType isTableView={isTableView} file={file} type={type}>
				{isFileAudio(file) && <FileAudio className=" w-16 h-16" />}
				{isFilePDF(file) && <FileText className=" w-16 h-16" />}
				{!isFileAudio(file) && !isFilePDF(file) && <FileIcon className=" w-16 h-16" />}
				{file.original ? (
					<span className={cn('break-all w-[160px]', isTableView ? '' : 'mt-4 text-lg text-center')}>
						{file.original.length > 60 ? `${file.original.slice(0, 40)}...` : file.original}
					</span>
				) : (
					<span className={cn('break-all w-[160px]', isTableView ? '' : 'mt-4 text-lg text-center')}>
						{file.name.length > 60 ? `${file.name.slice(0, 40)}...` : file.name}
					</span>
				)}
			</ComponentType>
		</div>
	);
};
