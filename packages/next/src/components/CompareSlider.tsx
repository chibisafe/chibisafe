/* eslint-disable @next/next/no-img-element */
'use client';

import { ReactCompareSlider } from 'react-compare-slider';
import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { settingsAtom } from '@/lib/atoms/settings';

export default function CompareSlider({ file1, file2 }: { readonly file1: string; readonly file2: string }) {
	const settings = useAtomValue(settingsAtom);
	const imgRef = useRef<HTMLImageElement>(null);
	const [isVertical, setIsVertical] = useState(false);

	useEffect(() => {
		if (imgRef.current?.complete) {
			const { naturalHeight, naturalWidth } = imgRef.current;
			setIsVertical(naturalHeight > naturalWidth);
		}
	}, [imgRef.current?.complete]);

	return (
		<ReactCompareSlider
			className={`w-full ${isVertical ? 'h-auto' : 'h-screen'}`}
			itemOne={<img src={`${settings?.serveUploadsFrom}/${file1}`} alt="Image 1" ref={imgRef} />}
			itemTwo={<img src={`${settings?.serveUploadsFrom}/${file2}`} alt="Image 2" />}
		/>
	);
}
