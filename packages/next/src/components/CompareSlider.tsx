/* eslint-disable @next/next/no-img-element */
'use client';

import { ReactCompareSlider } from 'react-compare-slider';
import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { settingsAtom } from '@/lib/atoms/settings';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

export default function CompareSlider({ file1, file2 }: { readonly file1: string; readonly file2: string }) {
	const settings = useAtomValue(settingsAtom);
	const imgRef = useRef<HTMLImageElement>(null);
	const [isVertical, setIsVertical] = useState(false);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (imgRef.current?.complete) {
			const { naturalHeight, naturalWidth } = imgRef.current;
			setIsVertical(naturalHeight > naturalWidth);
		}
	}, [imgRef.current?.complete]);

	useEffect(() => {
		setIsReady(true);
	}, [settings?.serveUploadsFrom]);

	return isReady ? (
		<ReactCompareSlider
			className={`w-full ${isVertical ? 'h-auto' : 'h-screen'}`}
			itemOne={<img src={`${settings?.serveUploadsFrom}/${file1}`} alt="Image 1" ref={imgRef} />}
			itemTwo={<img src={`${settings?.serveUploadsFrom}/${file2}`} alt="Image 2" />}
		/>
	) : (
		<div
			className={cn('h-full w-full absolute top-0 left-0 bg-black/50 select-none pointer-events-none', {
				hidden: isReady
			})}
		>
			<Loader2Icon className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 animate-spin" />
		</div>
	);
}
