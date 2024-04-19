import type { Metadata } from 'next';
import type { MetadataBuilder, PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';
import { FilesListNsfwToggle } from '@/components/FilesListNsfwToggle';
import { notFound, redirect } from 'next/navigation';

export async function generateMetadata({ params }: { readonly params: { identifier: string } }): Promise<Metadata> {
	const { data: response, error } = await fetchEndpoint(
		{ type: 'publicAlbum', identifier: params.identifier },
		1,
		1,
		''
	);

	if (error) {
		return {};
	}

	const meta = {
		title: response.album.isNsfw ? `[nsfw] ${response.album.name}` : response.album.name,
		openGraph: {
			title: response.album.isNsfw ? `[nsfw] ${response.album.name}` : response.album.name,
			images: [response.album.isNsfw ? '/og?section=nsfw-album' : '/og?section=album']
		},
		twitter: {
			title: response.album.isNsfw ? `[nsfw] ${response.album.name}` : response.album.name,
			images: [response.album.isNsfw ? '/og?section=nsfw-album' : '/og?section=album']
		}
	} as MetadataBuilder;

	if (response.album.description) {
		meta.description = response.album.description;
		meta.openGraph.description = response.album.description;
		meta.twitter.description = response.album.description;
	}

	if (!response.album.isNsfw && response.album.cover) {
		meta.openGraph.images = [response.album.cover];
		meta.twitter.images = [response.album.cover];
	}

	return meta;
}

export default async function PublicAlbumPage({
	searchParams,
	params
}: {
	readonly params: { identifier: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const {
		data: response,
		error,
		status
	} = await fetchEndpoint({ type: 'publicAlbum', identifier: params.identifier }, currentPage, perPage, search);

	if (error) {
		if (status === 401) return redirect('/login');
		if (status === 404) return notFound();
		redirect('/');
	}

	return (
		<>
			<DashboardHeader title={response.album.name} subtitle={response.album.description} />
			<div className="px-2 w-full flex h-full flex-grow flex-col">
				<FilesListNsfwToggle nsfw={response.album.isNsfw}>
					<FilesList type="publicAlbum" files={response.album.files} count={response.album.count} />
				</FilesListNsfwToggle>
			</div>
		</>
	);
}
