'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { ExternalLink, Loader2, XIcon } from 'lucide-react';

import { uploadsAtom } from '@/lib/atoms/uploads';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Button } from './ui/button';
import { ProgressBar } from '@tremor/react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

type Status = 'complete' | 'idle' | 'uploading';

export const UploadProgress = () => {
	const [uploads, setUploads] = useAtom(uploadsAtom);
	const [buttonText, setButtonText] = useState('');
	const [filesUploading, setFilesUploading] = useState(0);
	const [totalProgress, setTotalProgress] = useState(0);
	const [status, setStatus] = useState<Status>('idle');
	const queryClient = useQueryClient();

	const removeFile = (uuid: string) => {
		setUploads(uploads.filter(file => file.uuid !== uuid));
		if (status === 'complete') {
			// TODO: Close the popover
		}
	};

	useEffect(() => {
		setFilesUploading(uploads.filter(file => file.processing).length);
		let timeout: NodeJS.Timeout;

		if (filesUploading > 0) {
			setStatus('uploading');
			setButtonText(`Uploading ${filesUploading} file${filesUploading === 1 ? '' : 's'}`);
			setTotalProgress(
				uploads
					.filter(file => file.status !== 'error' && file.status !== 'success')
					.reduce((acc, file) => acc + file.progress, 0) / uploads.length
			);
		} else if (uploads.length > 0) {
			setStatus('complete');
			setButtonText('All uploads complete 🎉');
			timeout = setTimeout(() => {
				let queryKey = ['uploads'];
				if (uploads.some(file => file.albumUuid)) {
					queryKey = ['albums', uploads[0]?.albumUuid ? uploads[0].albumUuid : ''];
				}

				void queryClient.invalidateQueries({ queryKey });
			}, 1000);
		} else {
			setStatus('idle');
			setButtonText('');
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [filesUploading, queryClient, uploads]);
	return (
		<Popover>
			<PopoverTrigger asChild>
				{buttonText ? (
					<Button
						variant="outline"
						className={cn('transition-all', status === 'uploading' ? 'flex-col gap-2 py-8' : '')}
					>
						{status === 'uploading' ? (
							<>
								<ProgressBar value={totalProgress} color="blue" className="max-w-sm w-80" />
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							</>
						) : null}
						{buttonText}
					</Button>
				) : null}
			</PopoverTrigger>
			<PopoverContent className="w-[512px] mt-2">
				<ScrollArea className="w-full h-72">
					<ul className="p-4">
						{uploads.map(file => (
							<li key={file.uuid} className="flex items-center justify-between flex-col mb-4 last:mb-0">
								<div className="flex flex-row w-full justify-between">
									<div className="text-sm font-medium">
										{file.status === 'success' ? (
											<>
												<a
													href={file.url}
													target="_blank"
													rel="noopener noreferrer"
													className="link flex items-center gap-1"
												>
													{file.name}
													<ExternalLink className="h-4 w-4 ml-1" />
												</a>
											</>
										) : (
											file.name
										)}
									</div>
									<div className="text-sm text-muted-foreground flex flex-row gap-2 items-center">
										{file.status}
										{file.status === 'error' || file.status === 'success' ? (
											<Button
												variant="ghost"
												size="icon"
												className="w-6 h-6"
												onClick={() => removeFile(file.uuid)}
											>
												<XIcon className="h-4 w-4" />
											</Button>
										) : null}
									</div>
								</div>
								<Progress value={file.progress} className="w-full h-2 mt-1" />
							</li>
						))}
					</ul>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
};
