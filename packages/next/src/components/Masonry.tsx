/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { File, FilePropsType, FileWithIndex } from '@/types';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isDialogOpenAtom, selectedFileAtom } from '@/lib/atoms/fileDialog';
import { isFileVideo } from '@/lib/file';
import { cn } from '@/lib/utils';
import { Masonry as Plock } from '@/components/ui/plock';
import { FileThumbnail } from './FileThumbnail';
import { useLongPress } from '@uidotdev/usehooks';
import { selectedFilesAtom, selectionActiveAtom } from '@/lib/atoms/selectedFiles';
import { CircleCheckIcon, CircleIcon } from 'lucide-react';
import { Button } from './ui/button';

function FileItem({
	file,
	type,
	idx,
	hoveredFiles,
	setHoveredFiles
}: {
	readonly file: FileWithIndex;
	readonly hoveredFiles: string[];
	readonly idx: number;
	setHoveredFiles(files: string[]): void;
	readonly type: FilePropsType;
}) {
	const setModalOpen = useSetAtom(isDialogOpenAtom);
	const setSelectedFile = useSetAtom(selectedFileAtom);
	const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom);
	const isSelectionActive = useAtomValue(selectionActiveAtom);
	const isSelected = useMemo(() => selectedFiles.includes(file), [selectedFiles, file]);

	const addToHoveredList = useCallback(
		(file: File) => {
			const identifierToUse = file.uuid ?? file.name;
			if (hoveredFiles.includes(identifierToUse)) return;
			setHoveredFiles([...hoveredFiles, identifierToUse]);
		},
		[hoveredFiles, setHoveredFiles]
	);

	const removeFromHoveredList = useCallback(
		(file: File) => {
			const identifierToUse = file.uuid ?? file.name;
			if (!hoveredFiles.includes(identifierToUse)) return;
			setHoveredFiles(hoveredFiles.filter(file => file !== identifierToUse));
		},
		[hoveredFiles, setHoveredFiles]
	);

	const canFileCanBeSelected = useCallback(() => {
		if (file.quarantine && type !== 'quarantine') {
			return;
		}

		if (isSelected) {
			setSelectedFiles(selectedFiles.filter(f => f !== file));
		} else {
			setSelectedFiles([...selectedFiles, file]);
		}
	}, [file, isSelected, selectedFiles, setSelectedFiles, type]);

	const attrs = useLongPress(
		e => {
			// console.log('long press', e);
			canFileCanBeSelected();
		},
		{
			// onStart: e => {
			// 	console.log('Press started');
			// },
			// onFinish: e => {
			// 	console.log('Press finished');
			// },
			// onCancel: e => {
			// 	console.log('Press cancelled');
			// },
			threshold: 500
		}
	);

	return (
		<div
			className={cn(
				"relative w-full h-auto transition-all duration-200 hover:duration-150 outline outline-transparent hover:z-40 after:absolute after:-inset-0 after:bg-gradient-to-t after:from-[rgb(4_21_47_/_0.5)] after:via-[rgb(19_36_61_/_0.1)] after:content-[''] after:pointer-events-none group",
				{
					'cursor-not-allowed': file.quarantine && type !== 'quarantine',
					'md:hover:scale-105 md:hover:outline-4 md:hover:outline-[hsl(216_77%_45%)] hover:after:from-transparent hover:after:via-transparent':
						!isSelectionActive,
					'outline-4 outline-[hsl(46,77%,45%)]': isSelectionActive && isSelected
				}
			)}
			key={idx}
			onMouseEnter={() => (isFileVideo(file) ? addToHoveredList(file) : null)}
			onMouseLeave={() => (isFileVideo(file) ? removeFromHoveredList(file) : null)}
		>
			<div
				className={cn(
					'absolute right-0 top-0 z-20 hidden pointer-events-none group-hover:hidden group-hover:pointer-events-auto md:group-hover:flex',
					{
						'pointer-events-auto': isSelectionActive,
						flex: isSelected,
						'!hidden': file.quarantine && type !== 'quarantine'
					}
				)}
			>
				<Button
					variant="link"
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();

						canFileCanBeSelected();
					}}
				>
					{isSelected ? <CircleCheckIcon className="h-6 w-6" /> : <CircleIcon className="h-6 w-6" />}
				</Button>
			</div>
			<button
				type="button"
				className={cn('w-full h-full absolute top-0 left-0 pointer-events-auto hidden', {
					'pointer-events-none': file.quarantine && type !== 'quarantine',
					block: isSelectionActive
				})}
				onClick={() => {
					if (file.quarantine && type !== 'quarantine') {
						return;
					}

					canFileCanBeSelected();
				}}
			/>
			<a
				className={cn('w-full h-full absolute top-0 left-0 pointer-events-auto', {
					'pointer-events-none': file.quarantine && type !== 'quarantine',
					hidden: isSelectionActive
				})}
				href={file.url}
				target="_blank"
				rel="noopener noreferrer"
				draggable={false}
				{...attrs}
				style={{ WebkitTouchCallout: 'none' }}
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
	);
}

export function Masonry({
	files,
	type
}: {
	readonly files?: FileWithIndex[] | undefined;
	readonly type: FilePropsType;
}) {
	const [hoveredFiles, setHoveredFiles] = useState<string[]>([]);
	const setSelectedFiles = useSetAtom(selectedFilesAtom);

	useEffect(() => {
		return () => {
			setSelectedFiles([]);
		};
	}, [setSelectedFiles]);

	return files?.length ? (
		<Plock
			items={files}
			config={{
				columns: [2, 2, 3, 4],
				gap: [10, 14, 14, 14],
				media: [640, 1024, 1400, 1400]
			}}
			className="px-1"
			render={(file, idx) => (
				<FileItem
					key={idx}
					file={file}
					type={type}
					idx={idx}
					hoveredFiles={hoveredFiles}
					setHoveredFiles={setHoveredFiles}
				/>
			)}
		/>
	) : null;
}
