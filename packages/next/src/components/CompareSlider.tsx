/* eslint-disable @next/next/no-img-element */
'use client';

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { settingsAtom } from '@/lib/atoms/settings';
import { Loader2Icon } from 'lucide-react';

export default function CompareSlider({ file1, file2 }: { readonly file1: string; readonly file2: string }) {
	const settings = useAtomValue(settingsAtom);
	const [isVertical, setIsVertical] = useState(false);

	return settings ? (
		<ReactCompareSlider
			className={`w-full ${isVertical ? 'h-auto' : 'h-screen'}`}
			itemOne={
				<ReactCompareSliderImage
					src={`${settings.serveUploadsFrom}/${file1}`}
					alt="Image 1"
					onLoad={({ currentTarget }) =>
						setIsVertical(currentTarget.naturalHeight > currentTarget.naturalWidth)
					}
				/>
			}
			itemTwo={<ReactCompareSliderImage src={`${settings.serveUploadsFrom}/${file2}`} alt="Image 2" />}
		/>
	) : (
		<div className="h-full w-full absolute top-0 left-0 bg-black/50 select-none pointer-events-none">
			<Loader2Icon className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 animate-spin" />
		</div>
	);
}
