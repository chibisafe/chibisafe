'use client';

import { fileListAtom, uploadStore } from '@/store/upload';
import { motion } from 'framer-motion';

import { formatBytes } from '@/lib/file';
import { cn, debug } from '@/lib/utils';

const watchFileList = uploadStore.sub(fileListAtom, () => {
	for (const file of uploadStore.get(fileListAtom)) {
		debug(`Added ${file.name} (${formatBytes(file.size)})`);
	}
});

export interface ProcessFiles {
	processFiles(): void;
}

export function FileUploader({ isDragging }: { readonly isDragging: boolean }) {
	const variants = {
		open: {
			clipPath: 'inset(0% 0% 0% 0% round 10px)',
			transition: {
				type: 'spring',
				bounce: 0,
				duration: 0.3
			}
		},
		closed: {
			clipPath: 'inset(10% 50% 90% 50% round 10px)',
			transition: {
				type: 'spring',
				bounce: 0,
				duration: 0.3
			}
		}
	};

	return (
		<motion.div
			animate={isDragging ? 'open' : 'closed'}
			variants={variants}
			className={cn({
				'absolute top-0 left-0 w-full h-full p-4 z-50': true,
				'pointer-events-none': true
			})}
		>
			<div className="bg-sky-700/80 w-full h-full p-4 rounded-md">
				<div className="w-full h-full border rounded-md border-dashed border-slate-400" />
			</div>
			<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
				<h2 className="font-heading text-3xl">Drop your files here to start uploading them</h2>
			</div>
		</motion.div>
	);
}
