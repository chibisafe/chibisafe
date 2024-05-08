import { useCallback, useEffect, useState } from 'react';
import request from '@/lib/request';
import { toast } from 'sonner';
import { FileQuestionIcon, Loader2Icon } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

export const FileTextViewer = ({ uuid }: { readonly uuid?: string }) => {
	const [content, setContent] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchHighlight = useCallback(async () => {
		try {
			setLoading(true);
			setContent(null);

			const { data: response, error } = await request.raw({ method: 'GET', url: `file/${uuid}/highlight` });
			const data = await response?.text();

			if (!data) {
				return;
			}

			setContent(data);

			if (error) {
				toast.error(error);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [uuid]);

	useEffect(() => {
		void fetchHighlight();
	}, [fetchHighlight]);

	return content ? (
		<ScrollArea className="h-full 2xl:max-w-7xl xl:max-w-5xl md:max-w-3xl max-w-[calc(100vw-6rem)] w-full p-8 bg-background">
			<div
				className="w-full"
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: content
				}}
			/>
		</ScrollArea>
	) : loading ? (
		<div
			className={cn('h-full w-full absolute top-0 left-0 bg-black/50 select-none pointer-events-none', {
				hidden: !loading
			})}
		>
			<Loader2Icon className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 animate-spin" />
		</div>
	) : (
		<span className="text-light-100 h-full items-center hidden md:flex px-8 flex-col justify-center gap-4">
			<FileQuestionIcon className="w-16 h-16" />
			Sorry but this filetype can't be previewed at this time.
		</span>
	);
};
