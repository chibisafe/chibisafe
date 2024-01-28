'use client';

import type { File } from '@/types';
import { debug } from '~/lib/utils';

import { Masonry as Plock } from '@/components/ui/plock';

export function Masonry({ files, total }: { readonly files: File[]; readonly total: number }) {
	debug(files);
	const fileUrls = files?.map((file: File) => file.thumb);
	return (
		<>
			<Plock
				items={fileUrls}
				config={{
					columns: [1, 2, 3, 4],
					gap: [24, 12, 6, 6],
					media: [640, 1024, 1400, 1400]
				}}
				// eslint-disable-next-line @next/next/no-img-element
				render={(item, idx) => <img key={idx} src={item} style={{ width: '100%', height: 'auto' }} />}
			/>
		</>
	);
}
