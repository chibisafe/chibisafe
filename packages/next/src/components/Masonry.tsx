'use client';

import type { File } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Masonry as Plock } from 'react-plock';

import { getFiles } from '@/lib/api';

export function Masonry({ keys }: { readonly keys: (string | undefined)[] }) {
	const { isPending, error, data } = useQuery({
		queryKey: keys,
		queryFn: () => getFiles(),
		placeholderData: (previousData: any) => previousData
	});

	const fileUrls = data?.files.map((file: File) => file.thumb);

	if (isPending) return 'Loading...';
	if (error) return 'An error has occurred: ' + error.message;
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
