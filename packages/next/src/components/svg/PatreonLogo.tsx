import type { ComponentProps } from 'react';
import Image from 'next/image';

export const PatreonLogo = (props: Omit<ComponentProps<typeof Image>, 'alt' | 'src'>) => {
	const src = `<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 32 32"
			{...props}
		>
			<path
				fill="currentColor"
				d="M20.516.697c-6.355 0-11.521 5.167-11.521 11.521c0 6.333 5.167 11.484 11.521 11.484C26.849 23.702 32 18.551 32 12.218C32 5.863 26.849.697 20.516.697zM.005 31.38H5.63V.697H.005z"
			/>
		</svg>`;
	return <Image priority src={src} alt="Patreon logo" {...props} />;
};
