// import Image from 'next/image';
import Link from 'next/link';
import type { Album as AlbumType } from '@/types';

import { Button } from '@/components/ui/button';

import { AlbumSettingsDialog } from './dialogs/AlbumSettingsDialog';

export const Album = ({ album }: { readonly album: AlbumType }) => {
	return (
		<>
			{/* <div className="group relative shrink-0 w-60 h-96 transition-all duration-500 last:mr-0">
				<div className="duration-200 group-hover:scale-105 w-60 h-96 relative">
					<Image
						src={album.cover ?? ''}
						alt="Album cover"
						className="object-cover h-full w-full transition-all outline outline-2 outline-transparent group-hover:outline-4 group-hover:outline-blue-600"
						fill
					/>
					<div
						className="absolute top-0 left-0 z-10 w-full h-full"
						style={{
							background:
								'linear-gradient(rgba(0, 0, 0, 0) 20%, rgb(19 36 61 / 60%) 70%, rgb(4, 21, 47) 100%)'
						}}
					/>
				</div>
				<div className="absolute bottom-[-2.5em] left-4 right-4 cursor-default transition-all duration-200 group-hover:translate-y-[-3.5rem] z-20 pointer-events-none select-none group-hover:pointer-events-auto">
					<Link href={`/dashboard/albums/${album.uuid}`}>
						<div className="font-bold text-2xl mb-2 transition delay-300">{album.name}</div>
						<div className="font-normal text-lg mb-4 transition delay-500">{album.count} files</div>
					</Link>
					<Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						Settings
					</Button>
				</div>
			</div> */}

			<div className="group relative h-96 w-60">
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-200 after:absolute after:-inset-0 after:bg-gradient-to-t after:from-[rgb(4_21_47)] after:via-[rgb(19_36_61_/_0.6)] after:via-30% after:content-[''] group-hover:scale-105 group-hover:duration-150 group-hover:outline-4 group-hover:outline-[hsl(216_77%_45%)] outline outline-transparent"
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
		</>
	);
};
