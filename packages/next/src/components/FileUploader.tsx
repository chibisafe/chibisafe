'use client';

import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

import { formatBytes } from '@/lib/file';
import { cn, debug } from '@/lib/utils';
import { Icons } from '@/components/icons';

export function FileUploader() {
	const isUploadEnabled = true;
	const maxFileSize = 1000 * 1000 * 1000; // 1GB

	const fileInput = useRef<HTMLInputElement>(null);

	const onFileAdded = useCallback((acceptedFiles: File[]) => {
		debug(acceptedFiles);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onFileAdded });
	return (
		<div
			className="w-80 h-fit max-h-[320px] flex-col right-0 top-0 space-y-2"
			{...getRootProps()}
		>
			<div
				className={cn([
					'w-80 h-80 right-0 top-0 bg-[#181a1b] rounded-3xl border-4 shadow-lg flex items-center justify-center blueprint flex-col cursor-pointer hover:border-[#3b3e40] transform-gpu transition-all',
					isDragActive ? 'border-blue-400' : 'border-[#303436]'
				])}
			>
				{isUploadEnabled ? (
					<>
						<Icons.uploadCloud className="h-12 w-12 pointer-events-none " />
						<h3 className="font-bold text-center mt-4 pointer-events-none">
							<p className="">
								{' '}
								DROP FILES OR <br />
								<span className="text-blue-400">CLICK HERE</span>{' '}
							</p>
						</h3>
						<p className="text-center mt-4 w-3/4 pointer-events-none inline-block">
							{formatBytes(maxFileSize)} max per file
						</p>

						<input ref={fileInput} type="file" className="hidden" multiple {...getInputProps()} />
					</>
				) : (
					<h3 className="text-center mt-4  w-3/4 pointer-events-none">
						Anonymous upload is disabled. <br />
						Please log in.
					</h3>
				)}
			</div>
		</div>
	);
}
