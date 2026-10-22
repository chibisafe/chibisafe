import CompareSlider from '@/components/CompareSlider';

export default async function PublicAlbumPage(props: { readonly params: Promise<{ file1: string; file2: string }> }) {
	const params = await props.params;
	return (
		<>
			<div className="w-full flex h-full flex-grow flex-col">
				<CompareSlider file1={params.file1} file2={params.file2} />
			</div>
		</>
	);
}
