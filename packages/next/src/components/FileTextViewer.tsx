import { useCallback, useEffect, useState } from 'react';
import request from '@/lib/request';
import { toast } from 'sonner';
import { FileQuestionIcon } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export const FileTextViewer = ({ uuid }: { readonly uuid?: string }) => {
	const [content, setContent] = useState<string | null>(null);

	const fetchHighlight = useCallback(async () => {
		try {
			const { data: response, error } = await request.raw({ method: 'GET', url: `file/${uuid}/highlight` });
			const data = await response?.text();

			if (!data) return;

			setContent(data);

			if (error) {
				toast.error(error);
			}
		} catch (error) {
			console.error(error);
		}
	}, [uuid]);

	useEffect(() => {
		void fetchHighlight();
	}, [fetchHighlight]);

	return content ? (
		<ScrollArea className="h-full 2xl:max-w-7xl xl:max-w-5xl md:max-w-3xl max-w-[calc(100vw-6rem)] w-full p-8">
			<div
				className="w-full"
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: content
				}}
			/>
		</ScrollArea>
	) : (
		<span className="text-light-100 h-full items-center hidden md:flex px-8 flex-col justify-center gap-4">
			<FileQuestionIcon className="w-16 h-16" />
			Sorry but this filetype can't be previewed at this time.
		</span>
	);
};
