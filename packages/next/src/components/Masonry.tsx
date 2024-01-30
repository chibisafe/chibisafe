/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import type { File, FilePropsType } from '@/types';
import { isFileAudio, isFileImage, isFilePDF, isFileVideo } from '~/lib/file';
import { debug } from '~/lib/utils';

import { Masonry as Plock } from '@/components/ui/plock';
import { FileInformationDialog } from '@/components/dialogs/FileInformationDialog';
import { Icons } from '@/components/icons';

export function Masonry({
	files,
	total,
	type
}: {
	readonly files: File[];
	readonly total: number;
	readonly type: FilePropsType;
}) {
	// debug(files);
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
					gap: [24, 12, 8, 8],
					media: [640, 1024, 1400, 1400]
				}}
				render={(file, idx) => (
					<div
						className="relative w-full h-auto"
						key={idx}
						onMouseEnter={() => addToHoveredList(file)}
						onMouseLeave={() => removeFromHoveredList(file)}
					>
						{/* TODO: No clue whatsoever why this assertion doesn't work when it works in vue,
						so I'm removing the publicAlbum stuff for now because of it
						{((type !== 'publicAlbum' && !file.quarantine) ||
							((type === 'admin' || type === 'quarantine') && file.quarantine)) ?? (
						)} */}

						{file.quarantine ? (
							<div className="w-[225px] h-40 bg-dark-90 flex flex-col justify-center items-center cursor-not-allowed">
								<Icons.warning className="text-red-500 w-16 h-16" />
							</div>
						) : (
							<FileInformationDialog file={file} type={type} />
						)}

						{isFileImage(file) || isFileVideo(file) ? (
							<>
								{type === 'publicAlbum' && (
									<a
										className="w-full h-full absolute"
										href={file?.url}
										target="_blank"
										rel="noopener noreferrer"
									/>
								)}

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
									<Icons.video className="absolute bottom-1 right-1 w-6 h-6 pointer-events-none" />
								)}
							</>
						) : (
							<div className="h-40 bg-dark-90 flex flex-col justify-center items-center cursor-pointer">
								{isFileAudio(file) && <Icons.audio className=" w-16 h-16" />}
								{isFilePDF(file) && <Icons.text className=" w-16 h-16" />}
								{!isFileAudio(file) && !isFilePDF(file) && <Icons.file className=" w-16 h-16" />}
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
		</>
	);
}
