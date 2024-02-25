/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import type { File, FilePropsType } from '@/types';
import { FileAudio, File as FileIcon, FileText, FileWarning, Video } from 'lucide-react';

import { isFileAudio, isFileImage, isFilePDF, isFileVideo } from '@/lib/file';
import { Masonry as Plock } from '@/components/ui/plock';
import { FileInformationDialog } from '@/components/dialogs/FileInformationDialog';

export function Masonry({
	files,
	total,
	type
}: {
	readonly files: File[];
	readonly total: number;
	readonly type: FilePropsType;
}) {
	// const ref = useRef<Record<string, HTMLImageElement | null>>({});
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [hoveredFiles, setHoveredFiles] = useState<string[]>([]);

	const addToHoveredList = (file: File) => {
		const identifierToUse = file.uuid ?? file.name;
		if (hoveredFiles.includes(identifierToUse)) return;
		setHoveredFiles([...hoveredFiles, identifierToUse]);
	};

	const removeFromHoveredList = (file: File) => {
		const identifierToUse = file.uuid ?? file.name;
		if (!hoveredFiles.includes(identifierToUse)) return;
		setHoveredFiles(hoveredFiles.filter(file => file !== identifierToUse));
	};

	return (
		<>
			<Plock
				items={files}
				config={{
					columns: [1, 2, 3, 4],
					gap: [24, 12, 12, 12],
					media: [640, 1024, 1400, 1400]
				}}
				className="px-1"
				render={(file, idx) => (
					<div
						className="relative w-full h-auto transition-all duration-200 hover:scale-105 hover:duration-150 hover:outline-4 hover:outline-[hsl(216_77%_45%)] outline outline-transparent hover:z-50 after:absolute after:-inset-0 after:bg-gradient-to-t after:from-[rgb(4_21_47_/_0.5)] after:via-[rgb(19_36_61_/_0.1)] after:via-30% hover:after:from-transparent hover:after:via-transparent after:content-[''] after:pointer-events-none"
						key={idx}
						onMouseEnter={() => (isFileVideo(file) ? addToHoveredList(file) : null)}
						onMouseLeave={() => (isFileVideo(file) ? removeFromHoveredList(file) : null)}
					>
						{/* TODO: No clue whatsoever why this assertion doesn't work when it works in vue,
						so I'm removing the publicAlbum stuff for now because of it
						{((type !== 'publicAlbum' && !file.quarantine) ||
							((type === 'admin' || type === 'quarantine') && file.quarantine)) ?? (
						)} */}

						{file.quarantine ? (
							<div className="w-[225px] h-40 bg-dark-90 flex flex-col justify-center items-center cursor-not-allowed">
								<FileWarning className="text-red-500 w-16 h-16" />
							</div>
						) : (
							<a
								className="w-full h-full absolute top-0 left-0 pointer-events-auto"
								href={file.url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={e => {
									e.preventDefault();
									e.stopPropagation();
									setSelectedFile(file);
									setModalOpen(true);
								}}
							/>
						)}

						{isFileImage(file) || isFileVideo(file) ? (
							<>
								{/* {type === 'publicAlbum' && (
									<a
										className="w-full h-full absolute"
										href={file?.url}
										target="_blank"
										rel="noopener noreferrer"
									/>
								)} */}

								<img
									src={file.thumb}
									// ref={el => {
									// 	ref.current[file.uuid] = el;
									// }}
									// onLoad={() => onImageLoad(file.uuid)}
									className="cursor-pointer w-full min-w-[160px]"
								/>

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
					// albums={albums}
					// tags={tags}
					// isVertical={imageDimensions[selectedFile.uuid]?.isVertical}
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
