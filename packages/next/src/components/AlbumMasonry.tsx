'use client';

import type { Album as AlbumType } from '@/types';
import { Masonry as Plock } from '@/components/ui/plock';
import { Album } from '@/components/Album';

export function AlbumMasonry({ albums = [] }: { readonly albums?: AlbumType[] | undefined }) {
	return (
		<Plock
			items={albums}
			config={{
				columns: [2, 2, 3, 4],
				gap: [10, 14, 14, 14],
				media: [640, 1024, 1400, 1400]
			}}
			className="px-1"
			render={(album: AlbumType) => <Album key={album.uuid} album={album} />}
		/>
	);
}
