// import Image from 'next/image';
import Link from 'next/link';
import type { Album as AlbumType } from '@/types';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { AlbumSettingsDialog } from './dialogs/AlbumSettingsDialog';

export const Album = ({ album }: { readonly album: AlbumType }) => {
	return (
		<div className="group relative h-96 w-60">
			<div
				className={cn(
					"absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-200 after:absolute after:-inset-0 after:bg-gradient-to-t after:from-[rgb(4_21_47)] after:via-[rgb(19_36_61_/_0.6)] after:via-30% after:content-[''] group-hover:scale-105 group-hover:duration-150 group-hover:outline-4 group-hover:outline-[hsl(216_77%_45%)] outline outline-transparent",
					album.nsfw ? 'blur group-hover:blur-0' : ''
				)}
				style={{
					backgroundImage: `url(${album.cover})`
				}}
			/>
			<div className="absolute bottom-0 left-4 right-4 pointer-events-none select-none group-hover:pointer-events-auto">
				<div className="mb-2 transform-gpu text-2xl font-bold text-white delay-75 duration-200 group-hover:-translate-y-14 group-hover:delay-75 cursor-pointer">
					{album.name}
				</div>
				<div className="mb-4 transform-gpu text-lg font-normal text-white delay-0 duration-200 group-hover:-translate-y-14 group-hover:delay-100">
					{album.count} files
				</div>
			</div>
			<Link
				href={`/dashboard/albums/${album.uuid}`}
				className="absolute inset-0 transition-all cursor-pointer duration-100 group-hover:scale-105 group-hover:duration-150"
			/>
			<AlbumSettingsDialog>
				<Button className="absolute -bottom-10 left-4 right-4 transition-all opacity-0 duration-100 group-hover:-translate-y-14 transform-gpu group-hover:opacity-100 group-hover:delay-100">
					Settings
				</Button>
			</AlbumSettingsDialog>
		</div>
	);
};
