'use client';

// import { createPortal } from 'react-dom';
import { useState } from 'react';
import Link from 'next/link';
import { fileListAtom, uploadStore } from '@/store/upload';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';

const preventDefaultHandler = (e: React.DragEvent<HTMLElement>) => {
	e.preventDefault();
	e.stopPropagation();
};

export default function Home() {
	const [counter, setCounter] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	return (
		<div
			className="relative flex flex-col"
			onDragOver={e => {
				preventDefaultHandler(e);
				setIsDragging(true);
			}}
			onDragEnter={e => {
				preventDefaultHandler(e);
				setIsDragging(true);
			}}
			onDragLeave={e => {
				preventDefaultHandler(e);
				setCounter(counter - 1);
				setIsDragging(false);
			}}
			onDrop={e => {
				preventDefaultHandler(e);
				const files = Array.from(e.dataTransfer.files);
				uploadStore.set(fileListAtom, files);
				setIsDragging(false);
			}}
		>
			<div
				className={cn({
					'pointer-events-none': isDragging
				})}
			>
				{/* {createPortal(<FileUploader isDragging={isDragging} />, document.body)} */}
				<FileUploader isDragging={isDragging} />

				<div className="flex-1">
					<section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
						<div className="flex max-w-[980px] flex-col items-start gap-2">
							<h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
								Beautifully designed components <br className="hidden sm:inline" />
								built with Radix UI and Tailwind CSS.
							</h1>
							<p className="max-w-[700px] text-lg text-muted-foreground">
								Accessible and customizable components that you can copy and paste into your apps. Free.
								Open Source. And Next.js 13 Ready.
							</p>
						</div>
						<div className="flex gap-4">
							<Link href="#" target="_blank" rel="noreferrer" className={buttonVariants()}>
								Documentation
							</Link>
							<Link
								target="_blank"
								rel="noreferrer"
								href="#"
								className={buttonVariants({ variant: 'outline' })}
							>
								GitHub
							</Link>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
